-- Ligas: colocar al jugador en cuanto gana XP en la semana, no al abrir la app.
-- Aditiva e idempotente; get_league() devuelve las mismas claves que en v3.
--
-- El fallo (detectado el 2026-10-18): solo get_league() colocaba al jugador en
-- su grupo de la semana, y la app solo lo llama desde la tarjeta de liga de
-- Inicio y desde la pantalla Ligas. Quien jugaba sin pasar por ahí (p. ej. la
-- diaria abierta desde un aviso) sumaba weekly_xp pero no estaba en ningún
-- grupo: su XP no contaba para nada, ni subía ni cobraba. Esa semana eran 3,
-- uno con 1.553 XP, que habría ascendido.
--
-- Ahora:
--  · league_place_user(uid) hace la colocación (lo que antes era el bloque
--    "si no está colocado" de get_league), para cualquier usuario.
--  · track_weekly_xp, el trigger que suma el XP semanal, la llama la primera
--    vez que el jugador gana XP en la semana. Vale para todas las versiones de
--    la app, sin actualizar.
--  · El resultado de la colocación (subió/bajó/se mantuvo y el premio) queda
--    guardado en league_members: antes solo salía en la respuesta de la
--    llamada que colocaba, que casi siempre era la tarjeta de Inicio, así que
--    el aviso de la pantalla Ligas no se veía nunca.
--  · El premio se abona directamente (monedas + coin_ledger 'league'), igual
--    que hacía award_progress(0, premio, false, 'league'), que no tiene tope
--    para 'league'. award_progress usa auth.uid(), y desde el trigger el
--    usuario que gana XP no tiene por qué ser quien llama.
--
-- Rollback: reaplicar get_league() y track_weekly_xp() de
-- 20260921020000_leagues_v3_groups.sql y supabase/gamification.sql. Las
-- columnas y la función nuevas son inofensivas si se dejan.
begin;

alter table public.league_members
  add column if not exists placement_result text,
  add column if not exists placement_reward int not null default 0;

-- ─── 1. Colocación ───────────────────────────────────────────────────────────
create or replace function public.league_place_user(p_uid uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_week          date := date_trunc('week', current_date)::date;
  v_div           int;
  v_group         uuid;
  v_prev_week     date;
  v_prev_div      int;
  v_prev_group    uuid;
  v_prev_rank     int;
  v_prev_count    int;
  v_prev_xp       int;
  v_promote_zone  int;
  v_relegate_zone int;
  v_reward        int := 0;
  v_result        text := null;   -- 'promoted' | 'relegated' | 'stayed'
begin
  if p_uid is null then return; end if;

  -- El trigger y get_league() pueden llegar a la vez para el mismo usuario:
  -- sin el cerrojo, los dos lo verían sin colocar y pagarían dos premios.
  perform pg_advisory_xact_lock(hashtext('league_place:' || p_uid::text));

  select division, group_id into v_div, v_group
    from public.league_members
   where user_id = p_uid and week_start = v_week;

  if found then
    -- Colocado antes de v3 en la semana en curso: solo le falta el grupo.
    if v_group is null then
      v_group := public.league_assign_group(v_week, v_div);
      update public.league_members set group_id = v_group
       where user_id = p_uid and week_start = v_week;
    end if;
    return;
  end if;

  -- Colocación: mirar la participación más reciente.
  select week_start, division, group_id into v_prev_week, v_prev_div, v_prev_group
    from public.league_members
   where user_id = p_uid
   order by week_start desc
   limit 1;

  if not found then
    v_div := 0;  -- usuario nuevo → Bronce
  else
    -- Puesto y tamaño del grupo en su última semana. Si esa semana aún no
    -- tenía grupo (anterior a v3), se puntúa contra la división entera.
    select rnk, cnt into v_prev_rank, v_prev_count from (
      select lm.user_id,
             row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk,
             count(*) over () as cnt
        from public.league_members lm
        left join public.weekly_xp wx
          on wx.user_id = lm.user_id and wx.week_start = v_prev_week
       where lm.week_start = v_prev_week
         and lm.division = v_prev_div
         and (v_prev_group is null or lm.group_id = v_prev_group)
    ) r where user_id = p_uid;

    select coalesce(xp, 0) into v_prev_xp
      from public.weekly_xp where user_id = p_uid and week_start = v_prev_week;
    v_prev_xp := coalesce(v_prev_xp, 0);

    v_promote_zone  := public.league_promote_zone(v_prev_count);
    v_relegate_zone := public.league_relegate_zone(v_prev_count);

    if v_prev_div < 3
       and v_prev_rank is not null and v_prev_rank <= v_promote_zone
       and (public.league_promote_min(v_prev_div) is null
            or v_prev_xp >= public.league_promote_min(v_prev_div)) then
      v_div := v_prev_div + 1;
      v_result := 'promoted';
    elsif v_prev_div > 0
          and (
            (v_prev_rank is not null and v_prev_count is not null
             and v_relegate_zone > 0
             and v_prev_count > v_promote_zone + v_relegate_zone
             and v_prev_rank > v_prev_count - v_relegate_zone)
            or (public.league_relegate_min(v_prev_div) is not null
                and v_prev_xp < public.league_relegate_min(v_prev_div))
          ) then
      v_div := v_prev_div - 1;
      v_result := 'relegated';
    else
      v_div := v_prev_div;
      v_result := 'stayed';
    end if;

    v_reward := public.league_placement_reward(v_prev_div, v_prev_rank);
  end if;

  v_group := public.league_assign_group(v_week, v_div);

  -- Primero la fila y después el premio: la PK (user_id, week_start) es la que
  -- garantiza que el premio de la semana pasada se cobra una sola vez.
  insert into public.league_members
    (user_id, week_start, division, group_id, placement_result, placement_reward)
  values (p_uid, v_week, v_div, v_group, v_result, v_reward)
  on conflict (user_id, week_start) do nothing;
  if not found then return; end if;

  if v_reward > 0 then
    update public.profiles set coins = coalesce(coins, 0) + v_reward where id = p_uid;
    insert into public.coin_ledger (user_id, delta, reason) values (p_uid, v_reward, 'league');
  end if;

  update public.profiles set league_division = v_div where id = p_uid;
end;
$$;

revoke all on function public.league_place_user(uuid) from public, anon, authenticated;

-- ─── 2. XP semanal: colocar al ganar el primer XP de la semana ───────────────
create or replace function public.track_weekly_xp()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_week date := date_trunc('week', current_date)::date;
begin
  if NEW.xp > OLD.xp then
    insert into public.weekly_xp (user_id, week_start, xp)
      values (NEW.id, v_week, NEW.xp - OLD.xp)
    on conflict (user_id, week_start) do update
      set xp = public.weekly_xp.xp + excluded.xp;

    if not exists (select 1 from public.league_members
                    where user_id = NEW.id and week_start = v_week) then
      -- Un fallo de la liga nunca debe impedir sumar el XP.
      begin
        perform public.league_place_user(NEW.id);
      exception when others then
        raise warning 'league_place_user(%) failed: %', NEW.id, sqlerrm;
      end;
    end if;
  end if;
  return NEW;
end;
$$;

-- ─── 3. get_league(): misma respuesta, colocación delegada ───────────────────
create or replace function public.get_league()
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $league$
declare
  v_uid           uuid := auth.uid();
  v_week          date := date_trunc('week', current_date)::date;
  v_div           int;
  v_group         uuid;
  v_group_name    text;
  v_group_seq     int;
  v_promote_zone  int;
  v_relegate_zone int;
  v_last_reward   int := 0;
  v_last_result   text := null;
  v_my_xp         int;
  v_my_rank       int;
  v_count         int;
  v_board         jsonb;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  perform public.league_place_user(v_uid);

  select division, group_id, placement_result, coalesce(placement_reward, 0)
    into v_div, v_group, v_last_result, v_last_reward
    from public.league_members
   where user_id = v_uid and week_start = v_week;

  select name_key, seq into v_group_name, v_group_seq
    from public.league_groups where id = v_group;

  select coalesce(xp, 0) into v_my_xp
    from public.weekly_xp where user_id = v_uid and week_start = v_week;
  v_my_xp := coalesce(v_my_xp, 0);

  select rnk, cnt into v_my_rank, v_count from (
    select lm.user_id,
           row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk,
           count(*) over () as cnt
      from public.league_members lm
      left join public.weekly_xp wx
        on wx.user_id = lm.user_id and wx.week_start = v_week
     where lm.group_id = v_group
  ) r where user_id = v_uid;

  v_promote_zone  := public.league_promote_zone(v_count);
  v_relegate_zone := public.league_relegate_zone(v_count);
  if v_count <= v_promote_zone + v_relegate_zone then
    v_relegate_zone := 0;
  end if;

  select coalesce(jsonb_agg(row order by (row->>'rank')::int), '[]'::jsonb)
    into v_board
  from (
    select jsonb_build_object(
             'user_id', lm.user_id,
             'username', p.username,
             'xp', coalesce(wx.xp, 0),
             'level', coalesce(p.level, 1),
             'cosmetics', coalesce(p.cosmetics, '{}'::jsonb),
             'is_pro', coalesce(p.premium_tier, '') not in ('', 'none'),
             'rank', row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id)
           ) as row
      from public.league_members lm
      join public.profiles p on p.id = lm.user_id
      left join public.weekly_xp wx
        on wx.user_id = lm.user_id and wx.week_start = v_week
     where lm.group_id = v_group
     order by coalesce(wx.xp, 0) desc, lm.user_id
     limit 50
  ) t;

  return jsonb_build_object(
    'division', v_div,
    'week_start', v_week,
    'group_id', v_group,
    'group_name_key', v_group_name,
    'group_seq', v_group_seq,
    'group_size', public.league_group_size(),
    'my_xp', v_my_xp,
    'my_rank', v_my_rank,
    'member_count', v_count,
    'promote_zone', v_promote_zone,
    'relegate_zone', v_relegate_zone,
    'promote_min', public.league_promote_min(v_div),
    'relegate_min', public.league_relegate_min(v_div),
    'last_result', v_last_result,
    'last_reward', v_last_reward,
    'leaderboard', v_board
  );
end;
$league$;

grant execute on function public.get_league() to authenticated;

-- ─── 4. Rescatar a quien ya ha ganado XP esta semana sin estar colocado ──────
select public.league_place_user(w.user_id)
  from public.weekly_xp w
 where w.week_start = date_trunc('week', current_date)::date
   and w.xp > 0
   and not exists (select 1 from public.league_members m
                    where m.user_id = w.user_id and m.week_start = w.week_start);

commit;
