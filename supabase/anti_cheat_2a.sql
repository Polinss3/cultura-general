-- ═══════════════════════════════════════════════════════════════════════════
-- BLINDAJE 2a: el servidor deja de fiarse del móvil en misiones y logros
-- ═══════════════════════════════════════════════════════════════════════════
--
-- ⚠️  NO APLICAR HASTA QUE LA 2.2.0 ESTÉ PUBLICADA (decisión de Pablo, 09-21).
--     Vive fuera de migrations/ a propósito; se aplica a mano, con
--     `supabase db query --linked -f supabase/anti_cheat_2a.sql`.
--
-- Compatible con TODAS las versiones publicadas (1.3.0 → 2.3.0): no cambia
-- ninguna firma ni la forma de las respuestas. Un cliente legítimo nunca es
-- rechazado: la app solo pide reclamar lo que ya cumple, y los topes diarios
-- están por encima de lo que se gana jugando en serio.
--
-- Qué cierra (ver memoria "backend-hardening-fases", fase 2a):
--   1. Logros: `claim_achievement` comprobaba solo "no reclamado ya"; ahora
--      exige que la condición real se cumpla (columnas de profiles y claims
--      de Aventura). Además paga lo que dice la app (los de Aventura pagaban
--      50 por defecto y la app promete 25/50/75/100/150).
--   2. Misiones: `increment_mission` recibía el OBJETIVO del cliente (mandar
--      goal=1 completaba cualquier misión). Ahora el objetivo sale del
--      catálogo del servidor y el parámetro se ignora. Solo cuentan las 3
--      misiones del día (misma semilla que la app) y cada llamada no puede
--      sumar más que el propio objetivo, salvo monedas.
--   3. Topes diarios por fuente en `award_progress` (antes solo Aprender).
--
-- Definiciones anteriores: scratch prod_*.sql del 2026-09-21 (idénticas a
-- gamification.sql salvo award_progress, que ya llevaba el tope de learn).
-- Rollback: reaplicar esas definiciones.
-- ═══════════════════════════════════════════════════════════════════════════
begin;

-- ─── 1. Logros ───────────────────────────────────────────────────────────────
-- Espejo de lib/achievements.ts. Aventura se mide con adventure_reward_claims
-- (una fila por nivel y hito: 1 = completado, 2 = 2 estrellas, 3 = 3 estrellas).
create or replace function public.achievement_unlocked(p_uid uuid, p_id text)
returns boolean
language plpgsql stable security definer set search_path = public, pg_temp as $$
declare
  p record;
  v_adv_levels int;
  v_adv_stars  int;
  v_accuracy   numeric;
begin
  select coalesce(total_answered, 0) as answered, coalesce(total_correct, 0) as correct,
         coalesce(best_streak, 0) as best_streak, coalesce(speed_record, 0) as speed,
         coalesce(level, 1) as level, coalesce(coins, 0) as coins, coalesce(ladder_best, 0) as ladder
    into p from public.profiles where id = p_uid;
  if not found then return false; end if;
  v_accuracy := case when p.answered > 0 then p.correct::numeric / p.answered else 0 end;

  if p_id like 'adventure%' then
    select count(distinct level), coalesce(sum(m), 0)
      into v_adv_levels, v_adv_stars
      from (select level, max(milestone) as m from public.adventure_reward_claims
             where user_id = p_uid group by level) s;
  end if;

  return case p_id
    when 'first_answer'         then p.answered >= 1
    when 'ten_answers'          then p.answered >= 10
    when 'hundred_answers'      then p.answered >= 100
    when 'five_hundred_answers' then p.answered >= 500
    when 'streak_3'             then p.best_streak >= 3
    when 'streak_7'             then p.best_streak >= 7
    when 'streak_30'            then p.best_streak >= 30
    when 'accuracy_80'          then p.answered >= 20 and v_accuracy >= 0.8
    when 'accuracy_95'          then p.answered >= 50 and v_accuracy >= 0.95
    when 'speed_5'              then p.speed >= 5
    when 'speed_10'             then p.speed >= 10
    when 'speed_20'             then p.speed >= 20
    when 'level_10'             then p.level >= 10
    when 'level_25'             then p.level >= 25
    when 'level_50'             then p.level >= 50
    when 'coins_500'            then p.coins >= 500
    when 'coins_2000'           then p.coins >= 2000
    when 'ladder_5'             then p.ladder >= 5
    when 'ladder_10'            then p.ladder >= 10
    when 'ladder_20'            then p.ladder >= 20
    when 'mult_max'             then p.best_streak >= 10
    when 'adventure_first'      then v_adv_levels >= 1
    when 'adventure_chapter'    then v_adv_levels >= 20
    when 'adventure_stars_100'  then v_adv_stars >= 100
    when 'adventure_levels_100' then v_adv_levels >= 100
    when 'adventure_all'        then v_adv_levels >= 400
    else false
  end;
end;
$$;

create or replace function public.claim_achievement(p_achievement_id text)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_claimed boolean;
  v_reward int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select claimed into v_claimed
    from public.user_achievements
   where user_id = v_uid and achievement_id = p_achievement_id for update;
  if v_claimed then raise exception 'already claimed'; end if;

  if not public.achievement_unlocked(v_uid, p_achievement_id) then
    raise exception 'achievement locked';
  end if;

  v_reward := case p_achievement_id
    when 'five_hundred_answers' then 200
    when 'streak_30'            then 200
    when 'accuracy_95'          then 200
    when 'ladder_20'            then 200
    when 'coins_2000'           then 150
    when 'level_50'             then 200
    when 'level_25'             then 120
    when 'hundred_answers'      then 100
    when 'streak_7'             then 100
    when 'speed_20'             then 100
    when 'ladder_10'            then 100
    when 'level_10'             then 80
    when 'mult_max'             then 80
    when 'adventure_first'      then 25
    when 'adventure_chapter'    then 50
    when 'adventure_stars_100'  then 75
    when 'adventure_levels_100' then 100
    when 'adventure_all'        then 150
    else 50
  end;

  insert into public.user_achievements (user_id, achievement_id, unlocked_at, claimed)
    values (v_uid, p_achievement_id, now(), true)
  on conflict (user_id, achievement_id) do update set claimed = true, unlocked_at = now();

  return public.award_progress(0, v_reward, false, 'achievement');
end;
$$;

-- ─── 2. Misiones ─────────────────────────────────────────────────────────────
-- Catálogo (espejo de lib/missions.ts) y selección diaria con la misma
-- semilla que la app (mulberry32 sobre hash FNV-1a de 'YYYY-MM-DD').
create or replace function public.mission_goal(p_mission_id text)
returns int language sql immutable as $$
  select case p_mission_id
    when 'm_learn_10'         then 10
    when 'm_learn_correct8'   then 8
    when 'm_speed_6'          then 6
    when 'm_speed_play2'      then 2
    when 'm_daily'            then 1
    when 'm_ladder_5'         then 5
    when 'm_ladder_play'      then 1
    when 'm_adventure_play'   then 1
    when 'm_adventure_perfect' then 1
    when 'm_adventure_stars'  then 3
    when 'm_coins_100'        then 100
    else null
  end;
$$;

-- Math.imul: producto módulo 2^32. En numeric porque el producto de dos
-- valores de 32 bits desborda bigint.
create or replace function public.imul32(a bigint, b bigint)
returns bigint language sql immutable as $$
  select ((a::numeric * b::numeric) % 4294967296)::bigint;
$$;

-- Misiones del día: replica pickDailyMissions (hashSeed + mulberry32 +
-- Fisher-Yates) para que el servidor sepa cuáles son las 3 de hoy.
create or replace function public.daily_mission_ids(p_date date default current_date)
returns text[]
language plpgsql immutable as $$
declare
  ids  text[] := array['m_learn_10','m_learn_correct8','m_speed_6','m_speed_play2','m_daily',
                       'm_ladder_5','m_ladder_play','m_adventure_play','m_adventure_perfect',
                       'm_adventure_stars','m_coins_100'];
  seed text := to_char(p_date, 'YYYY-MM-DD');
  h    bigint := 2166136261;
  a    bigint;
  t    bigint;
  r    numeric;
  i    int;
  j    int;
  tmp  text;
begin
  -- hashSeed: FNV-1a de 32 bits.
  for i in 1..length(seed) loop
    h := public.imul32(h # ascii(substr(seed, i, 1)), 16777619);
  end loop;
  a := h;
  -- Fisher-Yates con mulberry32(a).
  for i in reverse array_length(ids, 1) - 1 .. 1 loop
    a := (a + 1831565813) % 4294967296;
    t := a;
    t := public.imul32(t # (t >> 15), 1 | t);
    t := t # ((t + public.imul32(t # (t >> 7), 61 | t)) % 4294967296);
    t := t # (t >> 14);
    r := (t % 4294967296)::numeric / 4294967296;
    j := floor(r * (i + 1));
    tmp := ids[i + 1]; ids[i + 1] := ids[j + 1]; ids[j + 1] := tmp;
  end loop;
  return ids[1:3];
end;
$$;

create or replace function public.increment_mission(p_mission_id text, p_amount integer, p_goal integer)
returns integer
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_goal int := public.mission_goal(p_mission_id);
  v_progress int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if v_goal is null then raise exception 'unknown mission'; end if;
  if not (p_mission_id = any(public.daily_mission_ids(current_date))) then
    raise exception 'mission not active today';
  end if;
  if p_amount < 0 or p_amount > 1000 then raise exception 'invalid amount'; end if;
  -- Ninguna acción legítima suma más que el objetivo de golpe, salvo las
  -- monedas (una recompensa grande puede pasar de 100).
  if p_mission_id <> 'm_coins_100' and p_amount > v_goal then
    raise exception 'invalid amount';
  end if;

  insert into public.user_missions (user_id, date, mission_id, progress, goal, updated_at)
    values (v_uid, current_date, p_mission_id, least(v_goal, p_amount), v_goal, now())
  on conflict (user_id, date, mission_id) do update
    set progress = least(v_goal, public.user_missions.progress + p_amount),
        goal = v_goal,
        updated_at = now()
  returning progress into v_progress;
  return v_progress;
end;
$$;

create or replace function public.claim_mission(p_mission_id text)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_uid uuid := auth.uid();
  v_progress int;
  v_goal int := public.mission_goal(p_mission_id);
  v_claimed boolean;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if v_goal is null or not (p_mission_id = any(public.daily_mission_ids(current_date))) then
    raise exception 'mission not found';
  end if;
  select progress, claimed into v_progress, v_claimed
    from public.user_missions
   where user_id = v_uid and date = current_date and mission_id = p_mission_id for update;
  if v_progress is null then raise exception 'mission not found'; end if;
  if v_claimed then raise exception 'already claimed'; end if;
  if v_progress < v_goal then raise exception 'mission incomplete'; end if;

  update public.user_missions set claimed = true
   where user_id = v_uid and date = current_date and mission_id = p_mission_id;

  return public.award_progress(30, 15, false, 'mission');
end;
$$;

-- ─── 3. Topes diarios por fuente ─────────────────────────────────────────────
-- (xp, monedas) máximos al día por fuente. Holgados: un jugador intenso
-- legítimo no los toca; un bucle automatizado sí.
create or replace function public.award_daily_cap(p_source text)
returns table (cap_xp int, cap_coins int) language sql immutable as $$
  select caps.cap_xp, caps.cap_coins from (values
    ('learn',       300, 150),   -- ya existía: 8 xp por acierto
    ('speed',       900, 300),   -- 6 xp/acierto ×2 de racha ≈ 120 por ronda → 7-8 rondas
    ('flags',       600, 250),
    ('years',       600, 250),
    ('ladder',      900, 400),
    ('exam',        400, 200),
    ('review',      500, 200),
    ('rewarded_ad', 300, 300),
    ('daily_route',  40,  30)    -- una vez al día por diseño
  ) as caps(source, cap_xp, cap_coins) where caps.source = p_source;
$$;

create or replace function public.award_progress(
  p_base_xp integer, p_base_coins integer, p_apply_multiplier boolean default true, p_source text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_uid    uuid := auth.uid();
  v_streak int;
  v_xp     int;
  v_coins  int;
  v_mult   numeric;
  v_gain_xp    int;
  v_gain_coins int;
  v_cap        record;
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
  select * into v_cap from public.award_daily_cap(p_source);
  if found then
    select coalesce(xp,0), coalesce(coins,0) into v_used_xp, v_used_coins
      from public.daily_award_caps
     where user_id = v_uid and date = current_date and source = p_source;
    v_gain_xp    := greatest(0, least(v_gain_xp,    v_cap.cap_xp    - coalesce(v_used_xp,0)));
    v_gain_coins := greatest(0, least(v_gain_coins, v_cap.cap_coins - coalesce(v_used_coins,0)));
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
$$;

commit;

-- Comprobación rápida tras aplicar (debe coincidir con la app para hoy):
--   select public.daily_mission_ids(current_date);
