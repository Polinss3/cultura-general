-- ═══════════════════════════════════════════════════════════════════════════
-- LIGAS SEMANALES  (Bloque 5 · Fase B)
-- ═══════════════════════════════════════════════════════════════════════════
-- Aditivo y retro-compatible: NO altera tablas ni funciones existentes. Las
-- apps antiguas siguen funcionando igual (ni conocen estas tablas/RPC).
--
-- Idea:
--  · weekly_xp: XP que cada usuario gana por semana (ISO, lunes). Se alimenta
--    con un TRIGGER sobre profiles.xp — NO tocamos award_progress (menos riesgo).
--  · user_league: división actual del usuario (0=Bronce..3=Diamante) y la semana
--    en la que está. El "reset" semanal es PEREZOSO: se aplica la primera vez
--    que el usuario abre Ligas en una semana nueva (sin cron).
--  · get_league(): aplica el reset perezoso (ascenso/descenso por umbral de XP
--    de la semana anterior) y devuelve la división, el ranking semanal de esa
--    división y la posición del usuario.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Tablas ───────────────────────────────────────────────
create table if not exists public.weekly_xp (
  user_id    uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  xp         int  not null default 0,
  primary key (user_id, week_start)
);

create table if not exists public.user_league (
  user_id    uuid references auth.users(id) on delete cascade primary key,
  division   int  not null default 0,   -- 0=Bronce, 1=Plata, 2=Oro, 3=Diamante
  week_start date not null,
  last_rank  int
);
create index if not exists user_league_div_week_idx
  on public.user_league (division, week_start);

-- ─── 2. RLS (lectura propia; las escrituras van por funciones definer) ──────
alter table public.weekly_xp   enable row level security;
alter table public.user_league enable row level security;

do $$ begin
  drop policy if exists "Users read own weekly_xp"   on public.weekly_xp;
  drop policy if exists "Users read own league"       on public.user_league;
end $$;

create policy "Users read own weekly_xp" on public.weekly_xp   for select using (auth.uid() = user_id);
create policy "Users read own league"     on public.user_league for select using (auth.uid() = user_id);

-- ─── 3. Trigger: acumular XP semanal cuando sube profiles.xp ────────────────
-- No modifica award_progress: cualquier incremento de xp queda registrado.
create or replace function public.track_weekly_xp()
returns trigger language plpgsql security definer as $$
begin
  if NEW.xp > OLD.xp then
    insert into public.weekly_xp (user_id, week_start, xp)
      values (NEW.id, date_trunc('week', current_date)::date, NEW.xp - OLD.xp)
    on conflict (user_id, week_start) do update
      set xp = public.weekly_xp.xp + excluded.xp;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_track_weekly_xp on public.profiles;
create trigger trg_track_weekly_xp
  after update of xp on public.profiles
  for each row execute function public.track_weekly_xp();

-- ─── 4. Umbrales de ascenso/descenso por división ───────────────────────────
-- Ascender: XP semanal >= promote(div). Descender: XP semanal < relegate(div).
create or replace function public.league_promote_threshold(p_div int)
returns int language sql immutable as $$
  select case p_div when 0 then 200 when 1 then 400 when 2 then 700 else null end;
$$;

create or replace function public.league_relegate_threshold(p_div int)
returns int language sql immutable as $$
  select case p_div when 1 then 100 when 2 then 200 when 3 then 350 else null end;
$$;

-- ─── 5. get_league(): reset perezoso + ranking de la división ────────────────
create or replace function public.get_league()
returns jsonb language plpgsql security definer as $league$
declare
  v_uid       uuid := auth.uid();
  v_week      date := date_trunc('week', current_date)::date;
  v_div       int;
  v_prev_week date;
  v_last_xp   int;
  v_promote   int;
  v_relegate  int;
  v_my_xp     int;
  v_my_rank   int;
  v_board     jsonb;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  -- Asegura la fila de liga del usuario.
  insert into public.user_league (user_id, division, week_start)
    values (v_uid, 0, v_week)
  on conflict (user_id) do nothing;

  select division, week_start into v_div, v_prev_week
    from public.user_league where user_id = v_uid for update;

  -- Reset perezoso: si el usuario venía de una semana anterior, aplica
  -- ascenso/descenso según su XP de aquella semana.
  if v_prev_week < v_week then
    select coalesce(xp, 0) into v_last_xp
      from public.weekly_xp where user_id = v_uid and week_start = v_prev_week;
    v_last_xp := coalesce(v_last_xp, 0);

    v_promote  := public.league_promote_threshold(v_div);
    v_relegate := public.league_relegate_threshold(v_div);

    if v_promote is not null and v_last_xp >= v_promote then
      v_div := v_div + 1;
    elsif v_relegate is not null and v_last_xp < v_relegate then
      v_div := v_div - 1;
    end if;

    update public.user_league
       set division = v_div, week_start = v_week, last_rank = null
     where user_id = v_uid;
  end if;

  -- XP del usuario esta semana.
  select coalesce(xp, 0) into v_my_xp
    from public.weekly_xp where user_id = v_uid and week_start = v_week;
  v_my_xp := coalesce(v_my_xp, 0);

  -- Posición del usuario en su división esta semana.
  select rank into v_my_rank from (
    select ul.user_id,
           row_number() over (order by coalesce(wx.xp, 0) desc, ul.user_id) as rank
      from public.user_league ul
      left join public.weekly_xp wx
        on wx.user_id = ul.user_id and wx.week_start = v_week
     where ul.division = v_div and ul.week_start = v_week
  ) r where user_id = v_uid;

  -- Ranking (top 30) de la división esta semana.
  select coalesce(jsonb_agg(row order by (row->>'rank')::int), '[]'::jsonb)
    into v_board
  from (
    select jsonb_build_object(
             'user_id', ul.user_id,
             'username', p.username,
             'xp', coalesce(wx.xp, 0),
             'level', coalesce(p.level, 1),
             'rank', row_number() over (order by coalesce(wx.xp, 0) desc, ul.user_id)
           ) as row
      from public.user_league ul
      join public.profiles p on p.id = ul.user_id
      left join public.weekly_xp wx
        on wx.user_id = ul.user_id and wx.week_start = v_week
     where ul.division = v_div and ul.week_start = v_week
     order by coalesce(wx.xp, 0) desc, ul.user_id
     limit 30
  ) t;

  v_promote  := public.league_promote_threshold(v_div);
  v_relegate := public.league_relegate_threshold(v_div);

  return jsonb_build_object(
    'division', v_div,
    'week_start', v_week,
    'my_xp', v_my_xp,
    'my_rank', v_my_rank,
    'promote_threshold', v_promote,
    'relegate_threshold', v_relegate,
    'leaderboard', v_board
  );
end;
$league$;
