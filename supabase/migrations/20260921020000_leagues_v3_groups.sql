-- Ligas semanales v3: grupos de ~30 (2.3.0).
-- Aditiva e idempotente; compatible con la 2.2.0: get_league() devuelve las
-- mismas claves que antes (más algunas nuevas) y la app antigua simplemente ve
-- una tabla más corta.
--
-- Qué cambia respecto a v2 (supabase/leagues.sql, verificado idéntico en prod
-- el 2026-09-21):
--  · Cada semana, dentro de cada división, los jugadores se reparten en GRUPOS
--    de hasta 30 (league_groups). Se llenan por orden de llegada, como en
--    Duolingo: el primero que abre la app en la semana estrena grupo.
--  · Puesto, ascenso, descenso y premio se calculan DENTRO del grupo. Zonas:
--    suben los 7 primeros y bajan los 5 últimos en un grupo lleno; en grupos
--    pequeños las zonas se encogen (1 de cada 4 sube, 1 de cada 6 baja) para
--    que "top 7" no signifique "todos" en un grupo de 8.
--  · El grupo tiene nombre (name_key, traducido en la app) para que se sienta
--    un grupo y no una tabla.
--  · league_members gana la columna group_id. Las semanas anteriores a la
--    migración no tienen grupo: su puesto se calcula como antes, por división
--    entera, así nadie pierde el resultado de la semana en curso.
--
-- Rollback: reaplicar supabase/leagues.sql (get_league v2). Las tablas y la
-- columna nuevas son inofensivas si se dejan.
begin;

-- ─── 1. Grupos ───────────────────────────────────────────────────────────────
create table if not exists public.league_groups (
  id         uuid primary key default gen_random_uuid(),
  week_start date not null,
  division   int  not null,
  seq        int  not null,          -- 1, 2, 3… dentro de (semana, división)
  name_key   text not null,          -- clave i18n: leagues.groups.<name_key>
  created_at timestamptz not null default now(),
  unique (week_start, division, seq)
);

alter table public.league_members
  add column if not exists group_id uuid references public.league_groups(id);

create index if not exists league_members_group_idx
  on public.league_members (group_id);

alter table public.league_groups enable row level security;
do $$ begin
  drop policy if exists "Users read league_groups" on public.league_groups;
end $$;
-- Solo lectura; solo se rellena desde get_league() (security definer).
create policy "Users read league_groups" on public.league_groups
  for select to authenticated using (true);

-- ─── 2. Parámetros ───────────────────────────────────────────────────────────
create or replace function public.league_group_size()
returns int language sql immutable as $$ select 30 $$;

-- Zonas según el tamaño real del grupo: 7 / 5 con 30 jugadores.
create or replace function public.league_promote_zone(p_count int)
returns int language sql immutable as $$
  select least(7, greatest(1, coalesce(p_count, 0) / 4));
$$;
create or replace function public.league_relegate_zone(p_count int)
returns int language sql immutable as $$
  select least(5, coalesce(p_count, 0) / 6);
$$;

-- Nombres de grupo (claves; la app las traduce). 32 para que dos grupos de la
-- misma división rara vez compartan nombre; si pasa, seq los distingue.
create or replace function public.league_group_name_key(p_seq int)
returns text language sql immutable as $$
  select (array[
    'owls','foxes','wolves','falcons','otters','lynxes','bears','hares',
    'ravens','dolphins','tigers','eagles','badgers','herons','panthers','stags',
    'bison','cranes','jaguars','ibex','condors','seals','cobras','moose',
    'orcas','hawks','pumas','storks','rhinos','swifts','gazelles','turtles'
  ])[((greatest(p_seq, 1) - 1) % 32) + 1];
$$;

-- ─── 3. Asignar grupo (con cerrojo por semana+división) ──────────────────────
create or replace function public.league_assign_group(p_week date, p_div int)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_group uuid;
  v_seq   int;
begin
  -- Dos altas simultáneas en la misma división no deben crear dos grupos a
  -- medias ni pasarse de 30.
  perform pg_advisory_xact_lock(hashtext('league_group:' || p_week::text || ':' || p_div::text));

  select g.id into v_group
    from public.league_groups g
    left join public.league_members lm on lm.group_id = g.id
   where g.week_start = p_week and g.division = p_div
   group by g.id, g.seq
  having count(lm.user_id) < public.league_group_size()
   order by g.seq
   limit 1;

  if v_group is not null then
    return v_group;
  end if;

  select coalesce(max(seq), 0) + 1 into v_seq
    from public.league_groups
   where week_start = p_week and division = p_div;

  insert into public.league_groups (week_start, division, seq, name_key)
  values (p_week, p_div, v_seq, public.league_group_name_key(v_seq))
  returning id into v_group;

  return v_group;
end;
$$;

-- ─── 4. get_league() v3 ──────────────────────────────────────────────────────
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
  v_prev_week     date;
  v_prev_div      int;
  v_prev_group    uuid;
  v_prev_rank     int;
  v_prev_count    int;
  v_prev_xp       int;
  v_promote_zone  int;
  v_relegate_zone int;
  v_last_reward   int := 0;
  v_last_result   text := null;   -- 'promoted' | 'relegated' | 'stayed'
  v_my_xp         int;
  v_my_rank       int;
  v_count         int;
  v_board         jsonb;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  -- ¿Ya colocado esta semana?
  select division, group_id into v_div, v_group
    from public.league_members
   where user_id = v_uid and week_start = v_week;

  if not found then
    -- Colocación: mirar la participación más reciente.
    select week_start, division, group_id into v_prev_week, v_prev_div, v_prev_group
      from public.league_members
     where user_id = v_uid
     order by week_start desc
     limit 1;

    if not found then
      v_div := 0;  -- usuario nuevo → Bronce
    else
      -- Puesto y tamaño del grupo la semana anterior. Si esa semana aún no
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
      ) r where user_id = v_uid;

      select coalesce(xp, 0) into v_prev_xp
        from public.weekly_xp where user_id = v_uid and week_start = v_prev_week;
      v_prev_xp := coalesce(v_prev_xp, 0);

      v_promote_zone  := public.league_promote_zone(v_prev_count);
      v_relegate_zone := public.league_relegate_zone(v_prev_count);

      -- Ascenso: entre los primeros y con actividad mínima.
      if v_prev_div < 3
         and v_prev_rank is not null and v_prev_rank <= v_promote_zone
         and (public.league_promote_min(v_prev_div) is null
              or v_prev_xp >= public.league_promote_min(v_prev_div)) then
        v_div := v_prev_div + 1;
        v_last_result := 'promoted';
      -- Descenso: entre los últimos (si el grupo da para zonas), o por inactividad.
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
        v_last_result := 'relegated';
      else
        v_div := v_prev_div;
        v_last_result := 'stayed';
      end if;

      -- Premio por posición de la semana pasada (una sola vez: la colocación
      -- de esta semana solo ocurre una vez por la PK de league_members).
      v_last_reward := public.league_placement_reward(v_prev_div, v_prev_rank);
      if v_last_reward > 0 then
        perform public.award_progress(0, v_last_reward, false, 'league');
      end if;
    end if;

    v_group := public.league_assign_group(v_week, v_div);

    insert into public.league_members (user_id, week_start, division, group_id)
      values (v_uid, v_week, v_div, v_group)
    on conflict (user_id, week_start) do nothing;

    update public.profiles set league_division = v_div where id = v_uid;
  end if;

  -- Miembros colocados antes de v3 en la semana en curso no tienen grupo:
  -- se les asigna ahora, sin tocar división ni premios.
  if v_group is null then
    v_group := public.league_assign_group(v_week, v_div);
    update public.league_members set group_id = v_group
     where user_id = v_uid and week_start = v_week;
  end if;

  select name_key, seq into v_group_name, v_group_seq
    from public.league_groups where id = v_group;

  -- XP de esta semana.
  select coalesce(xp, 0) into v_my_xp
    from public.weekly_xp where user_id = v_uid and week_start = v_week;
  v_my_xp := coalesce(v_my_xp, 0);

  -- Puesto del usuario y tamaño del grupo esta semana.
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
  -- Sin sitio para las dos zonas, no hay descenso por puesto (igual que en v2).
  if v_count <= v_promote_zone + v_relegate_zone then
    v_relegate_zone := 0;
  end if;

  -- Clasificación del grupo esta semana (cabe entera: ≤ 30).
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

commit;
