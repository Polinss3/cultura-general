-- ─────────────────────────────────────────────────────────────
-- Cultura General — Gamificación (XP, niveles, monedas, misiones,
-- tienda, logros, cofres, Modo Ascenso).
-- Idempotente, re-ejecutable. Aplicar en Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── 1. Columnas nuevas en profiles ──────────────────────────
alter table public.profiles
  add column if not exists xp            int  default 0,
  add column if not exists level         int  default 1,
  add column if not exists coins         int  default 0,
  add column if not exists ladder_best   int  default 0,
  add column if not exists last_chest_at date;

-- ─── 2. Tablas nuevas ────────────────────────────────────────

-- Inventario: power-ups (consumibles) y cosméticos (equipables).
create table if not exists public.user_items (
  user_id    uuid references auth.users(id) on delete cascade not null,
  item_id    text not null,
  quantity   int  default 0,
  equipped   boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, item_id)
);

-- Logros desbloqueados / reclamados (1 recompensa por logro).
create table if not exists public.user_achievements (
  user_id        uuid references auth.users(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at    timestamptz default now(),
  claimed        boolean default false,
  primary key (user_id, achievement_id)
);

-- Progreso de misiones diarias (clave por día).
create table if not exists public.user_missions (
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date not null default current_date,
  mission_id text not null,
  progress   int  default 0,
  goal       int  not null,
  claimed    boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, date, mission_id)
);

-- Historial / transparencia de monedas.
create table if not exists public.coin_ledger (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  delta      int  not null,
  reason     text,
  created_at timestamptz default now()
);
create index if not exists coin_ledger_user_idx on public.coin_ledger (user_id, created_at desc);

-- Topes diarios anti-farmeo (p. ej. Aprender).
create table if not exists public.daily_award_caps (
  user_id uuid references auth.users(id) on delete cascade not null,
  date    date not null default current_date,
  source  text not null,
  xp      int  default 0,
  coins   int  default 0,
  primary key (user_id, date, source)
);

-- Catálogo de la tienda (precios server-side, fuente de la verdad).
create table if not exists public.shop_items (
  item_id     text primary key,
  name        text not null,
  description text,
  price       int  not null check (price >= 0),
  type        text not null check (type in ('powerup','cosmetic')),
  icon        text,
  sort        int  default 0,
  active      boolean default true
);

-- ─── 3. Row Level Security ───────────────────────────────────
alter table public.user_items        enable row level security;
alter table public.user_achievements enable row level security;
alter table public.user_missions     enable row level security;
alter table public.coin_ledger       enable row level security;
alter table public.daily_award_caps  enable row level security;
alter table public.shop_items        enable row level security;

do $$ begin
  drop policy if exists "Users read own items"        on public.user_items;
  drop policy if exists "Users read own achievements"  on public.user_achievements;
  drop policy if exists "Users read own missions"      on public.user_missions;
  drop policy if exists "Users read own ledger"        on public.coin_ledger;
  drop policy if exists "Users read own caps"          on public.daily_award_caps;
  drop policy if exists "Shop readable by authenticated" on public.shop_items;
end $$;

-- Lectura propia (las escrituras pasan por funciones SECURITY DEFINER).
create policy "Users read own items"        on public.user_items        for select using (auth.uid() = user_id);
create policy "Users read own achievements"  on public.user_achievements for select using (auth.uid() = user_id);
create policy "Users read own missions"      on public.user_missions     for select using (auth.uid() = user_id);
create policy "Users read own ledger"        on public.coin_ledger       for select using (auth.uid() = user_id);
create policy "Users read own caps"          on public.daily_award_caps  for select using (auth.uid() = user_id);
create policy "Shop readable by authenticated" on public.shop_items
  for select using (auth.role() = 'authenticated');

-- ─── 4. Curva de niveles ─────────────────────────────────────
-- threshold(L) = 20*(L^2 - 1)  ⇒  level = floor(sqrt(xp/20 + 1))
create or replace function public.level_from_xp(p_xp int)
returns int language sql immutable as $$
  select greatest(1, floor(sqrt(greatest(p_xp, 0) / 20.0 + 1)))::int;
$$;

-- ─── 5. Primitiva de recompensa ──────────────────────────────
-- Aplica multiplicador de racha al XP (no a las monedas), respeta
-- topes diarios por fuente, recalcula nivel y otorga bonus de monedas
-- por cada nivel ganado (+50/nivel). Devuelve jsonb con el resultado.
create or replace function public.award_progress(
  p_base_xp         int,
  p_base_coins      int,
  p_apply_multiplier boolean default true,
  p_source          text default null
)
returns jsonb language plpgsql security definer as $award$
declare
  v_uid    uuid := auth.uid();
  v_streak int;
  v_xp     int;
  v_coins  int;
  v_mult   numeric;
  v_gain_xp    int;
  v_gain_coins int;
  v_cap_xp     int;
  v_cap_coins  int;
  v_used_xp    int := 0;
  v_used_coins int := 0;
  v_old_level  int;
  v_new_level  int;
  v_levels     int;
  v_level_bonus int;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;
  if p_base_xp < 0 or p_base_coins < 0 or p_base_xp > 100000 or p_base_coins > 100000 then
    raise exception 'invalid award payload';
  end if;

  select coalesce(streak,0), coalesce(xp,0), coalesce(coins,0)
    into v_streak, v_xp, v_coins
    from public.profiles where id = v_uid for update;

  v_mult := case when p_apply_multiplier
                 then least(1 + 0.1 * v_streak, 2.0)
                 else 1 end;
  v_gain_xp    := floor(p_base_xp * v_mult);
  v_gain_coins := p_base_coins;

  -- Topes diarios anti-farmeo por fuente.
  if p_source = 'learn' then
    v_cap_xp := 300; v_cap_coins := 150;
    select coalesce(xp,0), coalesce(coins,0) into v_used_xp, v_used_coins
      from public.daily_award_caps
     where user_id = v_uid and date = current_date and source = p_source;
    v_gain_xp    := greatest(0, least(v_gain_xp,    v_cap_xp    - coalesce(v_used_xp,0)));
    v_gain_coins := greatest(0, least(v_gain_coins, v_cap_coins - coalesce(v_used_coins,0)));
    if v_gain_xp > 0 or v_gain_coins > 0 then
      insert into public.daily_award_caps (user_id, date, source, xp, coins)
        values (v_uid, current_date, p_source, v_gain_xp, v_gain_coins)
      on conflict (user_id, date, source) do update
        set xp = public.daily_award_caps.xp + excluded.xp,
            coins = public.daily_award_caps.coins + excluded.coins;
    end if;
  end if;

  v_old_level := public.level_from_xp(v_xp);
  v_new_level := public.level_from_xp(v_xp + v_gain_xp);
  v_levels    := greatest(0, v_new_level - v_old_level);
  v_level_bonus := v_levels * 50;

  update public.profiles
     set xp    = v_xp + v_gain_xp,
         level = v_new_level,
         coins = v_coins + v_gain_coins + v_level_bonus
   where id = v_uid;

  if v_gain_coins + v_level_bonus <> 0 then
    insert into public.coin_ledger (user_id, delta, reason)
      values (v_uid, v_gain_coins + v_level_bonus, coalesce(p_source,'award'));
  end if;

  return jsonb_build_object(
    'xp', v_xp + v_gain_xp,
    'level', v_new_level,
    'leveled_up', v_levels > 0,
    'levels_gained', v_levels,
    'coins', v_coins + v_gain_coins + v_level_bonus,
    'gained_xp', v_gain_xp,
    'gained_coins', v_gain_coins + v_level_bonus
  );
end;
$award$;

-- ─── 6. Tienda ───────────────────────────────────────────────
create or replace function public.buy_item(p_item_id text)
returns jsonb language plpgsql security definer as $buy$
declare
  v_uid   uuid := auth.uid();
  v_price int;
  v_type  text;
  v_coins int;
  v_owned int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select price, type into v_price, v_type
    from public.shop_items where item_id = p_item_id and active = true;
  if v_price is null then raise exception 'item not found'; end if;

  select coalesce(quantity,0) into v_owned
    from public.user_items where user_id = v_uid and item_id = p_item_id;

  if v_type = 'cosmetic' and coalesce(v_owned,0) >= 1 then
    raise exception 'already owned';
  end if;

  select coalesce(coins,0) into v_coins from public.profiles where id = v_uid for update;
  if v_coins < v_price then raise exception 'insufficient coins'; end if;

  update public.profiles set coins = coins - v_price where id = v_uid;

  insert into public.user_items (user_id, item_id, quantity, updated_at)
    values (v_uid, p_item_id, 1, now())
  on conflict (user_id, item_id) do update
    set quantity = public.user_items.quantity + 1, updated_at = now();

  insert into public.coin_ledger (user_id, delta, reason)
    values (v_uid, -v_price, 'buy:' || p_item_id);

  return jsonb_build_object('item_id', p_item_id, 'coins', v_coins - v_price);
end;
$buy$;

create or replace function public.consume_item(p_item_id text)
returns int language plpgsql security definer as $consume$
declare
  v_uid uuid := auth.uid();
  v_qty int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select coalesce(quantity,0) into v_qty
    from public.user_items where user_id = v_uid and item_id = p_item_id for update;
  if coalesce(v_qty,0) <= 0 then raise exception 'no item'; end if;
  update public.user_items set quantity = quantity - 1, updated_at = now()
   where user_id = v_uid and item_id = p_item_id;
  return v_qty - 1;
end;
$consume$;

create or replace function public.equip_item(p_item_id text, p_equipped boolean)
returns void language plpgsql security definer as $equip$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  update public.user_items set equipped = p_equipped, updated_at = now()
   where user_id = v_uid and item_id = p_item_id and quantity > 0;
end;
$equip$;

-- ─── 7. Cofre diario ─────────────────────────────────────────
create or replace function public.claim_daily_chest()
returns jsonb language plpgsql security definer as $chest$
declare
  v_uid    uuid := auth.uid();
  v_last   date;
  v_streak int;
  v_reward int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select last_chest_at, coalesce(streak,0) into v_last, v_streak
    from public.profiles where id = v_uid for update;
  if v_last = current_date then raise exception 'already claimed'; end if;

  v_reward := floor(20 * least(1 + 0.1 * v_streak, 2.0));
  update public.profiles
     set coins = coins + v_reward, last_chest_at = current_date
   where id = v_uid;
  insert into public.coin_ledger (user_id, delta, reason) values (v_uid, v_reward, 'chest');

  return jsonb_build_object('reward', v_reward);
end;
$chest$;

-- ─── 8. Misiones diarias ─────────────────────────────────────
create or replace function public.increment_mission(
  p_mission_id text, p_amount int, p_goal int
)
returns int language plpgsql security definer as $incm$
declare
  v_uid uuid := auth.uid();
  v_progress int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_amount < 0 or p_amount > 1000 then raise exception 'invalid amount'; end if;
  insert into public.user_missions (user_id, date, mission_id, progress, goal, updated_at)
    values (v_uid, current_date, p_mission_id, p_amount, p_goal, now())
  on conflict (user_id, date, mission_id) do update
    set progress = least(public.user_missions.goal, public.user_missions.progress + p_amount),
        updated_at = now()
  returning progress into v_progress;
  return v_progress;
end;
$incm$;

create or replace function public.claim_mission(p_mission_id text)
returns jsonb language plpgsql security definer as $claimm$
declare
  v_uid uuid := auth.uid();
  v_progress int;
  v_goal int;
  v_claimed boolean;
  v_result jsonb;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select progress, goal, claimed into v_progress, v_goal, v_claimed
    from public.user_missions
   where user_id = v_uid and date = current_date and mission_id = p_mission_id for update;
  if v_progress is null then raise exception 'mission not found'; end if;
  if v_claimed then raise exception 'already claimed'; end if;
  if v_progress < v_goal then raise exception 'mission incomplete'; end if;

  update public.user_missions set claimed = true
   where user_id = v_uid and date = current_date and mission_id = p_mission_id;

  v_result := public.award_progress(30, 15, false, 'mission');
  return v_result;
end;
$claimm$;

-- ─── 9. Logros ───────────────────────────────────────────────
-- Recompensa server-side por logro (rareza). Idempotente (1 vez).
create or replace function public.claim_achievement(p_achievement_id text)
returns jsonb language plpgsql security definer as $claima$
declare
  v_uid uuid := auth.uid();
  v_claimed boolean;
  v_reward int;
  v_result jsonb;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select claimed into v_claimed
    from public.user_achievements
   where user_id = v_uid and achievement_id = p_achievement_id for update;
  if v_claimed then raise exception 'already claimed'; end if;

  v_reward := case p_achievement_id
    when 'five_hundred_answers' then 200
    when 'streak_30'            then 200
    when 'accuracy_95'          then 200
    when 'ladder_20'            then 200
    when 'coins_2000'           then 150
    when 'level_50'             then 200
    when 'level_25'             then 120
    when 'missions_50'          then 150
    when 'hundred_answers'      then 100
    when 'streak_7'             then 100
    when 'speed_20'             then 100
    when 'ladder_10'            then 100
    when 'level_10'             then 80
    when 'mult_max'             then 80
    else 50
  end;

  insert into public.user_achievements (user_id, achievement_id, unlocked_at, claimed)
    values (v_uid, p_achievement_id, now(), true)
  on conflict (user_id, achievement_id) do update set claimed = true, unlocked_at = now();

  v_result := public.award_progress(0, v_reward, false, 'achievement');
  return v_result;
end;
$claima$;

-- ─── 10. Modo Ascenso ────────────────────────────────────────
create or replace function public.save_ladder_run(p_floor int, p_coins int)
returns jsonb language plpgsql security definer as $ladder$
declare
  v_uid uuid := auth.uid();
  v_best int;
  v_new_best boolean := false;
  v_result jsonb;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_floor < 0 or p_floor > 1000 or p_coins < 0 or p_coins > 100000 then
    raise exception 'invalid ladder payload';
  end if;

  select coalesce(ladder_best,0) into v_best from public.profiles where id = v_uid for update;
  if p_floor > v_best then
    update public.profiles set ladder_best = p_floor where id = v_uid;
    v_new_best := true;
  end if;

  -- XP por la escalada (con multiplicador) + monedas del bote.
  v_result := public.award_progress(p_floor * 10, p_coins, true, 'ladder');
  return v_result || jsonb_build_object('ladder_best', greatest(v_best, p_floor), 'new_best', v_new_best);
end;
$ladder$;

-- ─── 11. Ranking de escaladas (Modo Ascenso) ─────────────────
create or replace function public.get_ladder_ranking()
returns table (user_id uuid, username text, ladder_best int, level int)
language sql security definer as $$
  select p.id, p.username, coalesce(p.ladder_best,0), coalesce(p.level,1)
    from public.profiles p
   where coalesce(p.ladder_best,0) > 0
   order by p.ladder_best desc
   limit 50;
$$;

-- ─── 12. Racha con "Congelar racha" (streak_freeze) ──────────
-- Sustituye la versión de security_hardening.sql: si el usuario faltó
-- exactamente un día y tiene un streak_freeze en inventario, lo consume
-- y mantiene la racha en vez de resetearla. Sin esto, el power-up
-- "Congelar racha" se podía comprar en la tienda pero no hacía nada.
create or replace function public.update_streak(p_user_id uuid)
returns void language plpgsql security definer as $streak_fn$
declare
  v_last_date  date;
  v_freeze_qty int;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'unauthorized';
  end if;

  select max(dr.date) into v_last_date
    from public.daily_rankings dr
   where dr.user_id = p_user_id
     and dr.score > 0
     and dr.date < current_date;

  if v_last_date = current_date - 1 then
    update public.profiles
       set streak      = streak + 1,
           best_streak = greatest(best_streak, streak + 1)
     where id = p_user_id;
    return;
  end if;

  -- Faltó exactamente un día: intenta consumir un "Congelar racha".
  if v_last_date = current_date - 2 then
    select coalesce(quantity,0) into v_freeze_qty
      from public.user_items
     where user_id = p_user_id and item_id = 'streak_freeze' for update;

    if coalesce(v_freeze_qty, 0) > 0 then
      update public.user_items
         set quantity = quantity - 1, updated_at = now()
       where user_id = p_user_id and item_id = 'streak_freeze';
      update public.profiles
         set streak      = streak + 1,
             best_streak = greatest(best_streak, streak + 1)
       where id = p_user_id;
      return;
    end if;
  end if;

  update public.profiles set streak = 1 where id = p_user_id;
end;
$streak_fn$;

-- ─── 13. Seed del catálogo de la tienda ──────────────────────
insert into public.shop_items (item_id, name, description, price, type, icon, sort, active) values
  ('pw_5050',      '50/50',          'Elimina dos respuestas incorrectas',        65,  'powerup',  '✂️', 10, true),
  ('pw_hint',      'Pista',          'Muestra una pista de la pregunta',          45,  'powerup',  '💡', 20, true),
  ('pw_skip',      'Saltar',         'Salta la pregunta sin penalización',        40,  'powerup',  '⏭️', 30, true),
  ('pw_time',      '+5 segundos',    'Añade 5 segundos en Contrarreloj',          50,  'powerup',  '⏱️', 40, true),
  ('pw_revive',    'Vida extra',     'Recupera una vida en Modo Ascenso',         90,  'powerup',  '❤️', 50, true),
  ('streak_freeze','Congelar racha', 'Protege tu racha un día sin jugar',         180, 'powerup',  '🧊', 60, true),
  ('frame_bronze', 'Marco bronce',   'Marco de avatar de bronce',                 150, 'cosmetic', '🥉', 70, true),
  ('frame_silver', 'Marco plata',    'Marco de avatar de plata',                  400, 'cosmetic', '🥈', 80, true),
  ('frame_gold',   'Marco oro',      'Marco de avatar de oro',                    900, 'cosmetic', '🥇', 90, true),
  ('name_neon',    'Nombre neón',    'Color de nombre neón',                      250, 'cosmetic', '🟣', 100, true),
  ('name_gold',    'Nombre dorado',  'Color de nombre dorado',                    500, 'cosmetic', '🟡', 110, true),
  ('theme_emerald','Tema esmeralda', 'Color de acento esmeralda',                 600, 'cosmetic', '💚', 120, true)
on conflict (item_id) do update
  set name = excluded.name, description = excluded.description, price = excluded.price,
      type = excluded.type, icon = excluded.icon, sort = excluded.sort, active = excluded.active;
