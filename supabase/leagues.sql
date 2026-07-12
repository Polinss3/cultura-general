-- ═══════════════════════════════════════════════════════════════════════════
-- LIGAS SEMANALES  ·  v2 (estilo SimCity BuildIt)
-- ═══════════════════════════════════════════════════════════════════════════
-- Aditivo y retro-compatible: NO altera funciones existentes de forma que rompa
-- apps antiguas. Se puede RE-EJECUTAR sin problema (if not exists / or replace).
--
-- Modelo:
--  · weekly_xp: XP que cada usuario gana por semana (ISO, lunes). La alimenta un
--    TRIGGER sobre profiles.xp — NO tocamos award_progress.
--  · league_members: en qué división está cada usuario CADA semana (snapshot).
--    Permite calcular el puesto de la semana anterior para ascenso/descenso y
--    premios por posición.
--  · profiles.league_division: espejo de la división actual, para pintar la
--    insignia de liga en cualquier ranking sin exponer league_members.
--  · get_league(): "reset perezoso" (sin cron). La primera vez que abres Ligas
--    en una semana nueva: calcula tu puesto de la semana pasada, asciende/
--    desciende por PUESTO (con actividad mínima), te paga el premio por posición
--    y te coloca en la división de esta semana. Devuelve la clasificación.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. XP semanal ───────────────────────────────────────────
create table if not exists public.weekly_xp (
  user_id    uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  xp         int  not null default 0,
  primary key (user_id, week_start)
);

-- ─── 2. Membresía de liga por semana (snapshot) ──────────────
create table if not exists public.league_members (
  user_id    uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  division   int  not null default 0,   -- 0=Bronce,1=Plata,2=Oro,3=Diamante
  primary key (user_id, week_start)
);
create index if not exists league_members_week_div_idx
  on public.league_members (week_start, division);

-- ─── 3. Espejo de la división actual en profiles (para insignias) ───────────
alter table public.profiles
  add column if not exists league_division int not null default 0;

-- ─── 4. RLS (lectura propia; escrituras por funciones security definer) ──────
alter table public.weekly_xp      enable row level security;
alter table public.league_members enable row level security;

do $$ begin
  drop policy if exists "Users read own weekly_xp"     on public.weekly_xp;
  drop policy if exists "Users read own league_member" on public.league_members;
end $$;

create policy "Users read own weekly_xp"     on public.weekly_xp      for select using (auth.uid() = user_id);
create policy "Users read own league_member" on public.league_members for select using (auth.uid() = user_id);

-- ─── 5. Trigger: acumular XP semanal cuando sube profiles.xp ────────────────
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

-- ─── 6. Parámetros de liga ──────────────────────────────────
-- Actividad mínima (XP semanal) para PODER ascender / evitar descenso.
create or replace function public.league_promote_min(p_div int)
returns int language sql immutable as $$
  select case p_div when 0 then 150 when 1 then 300 when 2 then 500 else null end;
$$;
create or replace function public.league_relegate_min(p_div int)
returns int language sql immutable as $$
  select case p_div when 1 then 80 when 2 then 150 when 3 then 250 else null end;
$$;

-- Premio (monedas) por puesto final, escalado por división.
create or replace function public.league_placement_reward(p_div int, p_rank int)
returns int language sql immutable as $$
  select (case
    when p_rank is null or p_rank <= 0 then 0
    when p_rank = 1 then 100
    when p_rank = 2 then 70
    when p_rank = 3 then 50
    when p_rank <= 10 then 25
    else 10
  end * (1 + coalesce(p_div, 0) * 0.5))::int;
$$;

-- ─── 7. get_league(): reset perezoso + clasificación ────────────────────────
create or replace function public.get_league()
returns jsonb language plpgsql security definer as $league$
declare
  v_uid          uuid := auth.uid();
  v_week         date := date_trunc('week', current_date)::date;
  v_promote_zone int  := 5;   -- ascienden los 5 primeros de la división
  v_relegate_zone int := 5;   -- descienden los 5 últimos
  v_div          int;
  v_prev_week    date;
  v_prev_div     int;
  v_prev_rank    int;
  v_prev_count   int;
  v_prev_xp      int;
  v_last_reward  int := 0;
  v_last_result  text := null;   -- 'promoted' | 'relegated' | 'stayed'
  v_my_xp        int;
  v_my_rank      int;
  v_count        int;
  v_board        jsonb;
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  -- ¿Ya colocado esta semana?
  select division into v_div
    from public.league_members
   where user_id = v_uid and week_start = v_week;

  if not found then
    -- Colocación: mirar la participación más reciente.
    select week_start, division into v_prev_week, v_prev_div
      from public.league_members
     where user_id = v_uid
     order by week_start desc
     limit 1;

    if not found then
      v_div := 0;  -- usuario nuevo → Bronce
    else
      -- Puesto y tamaño del grupo la semana anterior.
      select rnk, cnt into v_prev_rank, v_prev_count from (
        select lm.user_id,
               row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk,
               count(*) over () as cnt
          from public.league_members lm
          left join public.weekly_xp wx
            on wx.user_id = lm.user_id and wx.week_start = v_prev_week
         where lm.week_start = v_prev_week and lm.division = v_prev_div
      ) r where user_id = v_uid;

      select coalesce(xp, 0) into v_prev_xp
        from public.weekly_xp where user_id = v_uid and week_start = v_prev_week;
      v_prev_xp := coalesce(v_prev_xp, 0);

      -- Ascenso: entre los primeros y con actividad mínima.
      if v_prev_div < 3
         and v_prev_rank is not null and v_prev_rank <= v_promote_zone
         and (public.league_promote_min(v_prev_div) is null
              or v_prev_xp >= public.league_promote_min(v_prev_div)) then
        v_div := v_prev_div + 1;
        v_last_result := 'promoted';
      -- Descenso: entre los últimos, o por inactividad.
      elsif v_prev_div > 0
            and (
              (v_prev_rank is not null and v_prev_count is not null
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

    insert into public.league_members (user_id, week_start, division)
      values (v_uid, v_week, v_div)
    on conflict (user_id, week_start) do nothing;

    update public.profiles set league_division = v_div where id = v_uid;
  end if;

  -- XP del usuario esta semana.
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
     where lm.week_start = v_week and lm.division = v_div
  ) r where user_id = v_uid;

  -- Clasificación (top 50) de la división esta semana.
  select coalesce(jsonb_agg(row order by (row->>'rank')::int), '[]'::jsonb)
    into v_board
  from (
    select jsonb_build_object(
             'user_id', lm.user_id,
             'username', p.username,
             'xp', coalesce(wx.xp, 0),
             'level', coalesce(p.level, 1),
             'cosmetics', coalesce(p.cosmetics, '{}'::jsonb),
             'rank', row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id)
           ) as row
      from public.league_members lm
      join public.profiles p on p.id = lm.user_id
      left join public.weekly_xp wx
        on wx.user_id = lm.user_id and wx.week_start = v_week
     where lm.week_start = v_week and lm.division = v_div
     order by coalesce(wx.xp, 0) desc, lm.user_id
     limit 50
  ) t;

  return jsonb_build_object(
    'division', v_div,
    'week_start', v_week,
    'my_xp', v_my_xp,
    'my_rank', v_my_rank,
    'member_count', v_count,
    'promote_zone', v_promote_zone,
    'relegate_zone', v_relegate_zone,
    'last_result', v_last_result,
    'last_reward', v_last_reward,
    'leaderboard', v_board
  );
end;
$league$;
