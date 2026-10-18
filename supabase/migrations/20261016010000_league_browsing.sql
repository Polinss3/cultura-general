-- Explorar grupos de la semana actual, sin modificar afiliaciones ni premios.
-- Conserva la RLS de league_members/weekly_xp y expone solo datos del ranking.
begin;

create or replace function public.get_league_groups()
returns jsonb language plpgsql stable security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_week date := date_trunc('week', current_date)::date;
  v_groups jsonb;
begin
  if v_uid is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'group_id', g.id, 'division', g.division, 'group_name_key', g.name_key,
    'group_seq', g.seq, 'member_count', g.members, 'is_mine', g.is_mine
  ) order by g.division, g.seq), '[]'::jsonb) into v_groups
  from (
    select lg.*, count(lm.user_id) as members,
           coalesce(bool_or(lm.user_id = v_uid), false) as is_mine
    from public.league_groups lg
    left join public.league_members lm on lm.group_id = lg.id and lm.week_start = v_week
    where lg.week_start = v_week
    group by lg.id
  ) g;
  return v_groups;
end;
$$;

create or replace function public.get_league_group(p_group_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_week date := date_trunc('week', current_date)::date;
  v_group public.league_groups%rowtype;
  v_board jsonb;
  v_count int;
  v_promote int;
  v_relegate int;
  v_rank int;
  v_xp int := 0;
begin
  if v_uid is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  select * into v_group from public.league_groups
    where id = p_group_id and week_start = v_week;
  if not found then return null; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', r.user_id, 'username', r.username, 'xp', r.xp,
    'level', r.level, 'cosmetics', r.cosmetics, 'is_pro', r.is_pro, 'rank', r.rnk
  ) order by r.rnk), '[]'::jsonb), count(*) into v_board, v_count
  from (
    select lm.user_id, p.username, coalesce(wx.xp, 0) as xp,
           coalesce(p.level, 1) as level, coalesce(p.cosmetics, '{}'::jsonb) as cosmetics,
           coalesce(p.premium_tier, '') not in ('', 'none') as is_pro,
           row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk
    from public.league_members lm
    join public.profiles p on p.id = lm.user_id
    left join public.weekly_xp wx on wx.user_id = lm.user_id and wx.week_start = v_week
    where lm.group_id = p_group_id and lm.week_start = v_week
  ) r;

  select (e->>'rank')::int, (e->>'xp')::int into v_rank, v_xp
    from jsonb_array_elements(v_board) e where e->>'user_id' = v_uid::text;
  v_promote := public.league_promote_zone(v_count);
  v_relegate := public.league_relegate_zone(v_count);
  if v_count <= v_promote + v_relegate then v_relegate := 0; end if;

  return jsonb_build_object(
    'group_id', v_group.id, 'division', v_group.division, 'week_start', v_week,
    'group_name_key', v_group.name_key, 'group_seq', v_group.seq,
    'group_size', public.league_group_size(), 'member_count', v_count,
    'my_rank', v_rank, 'my_xp', coalesce(v_xp, 0),
    'promote_zone', v_promote, 'relegate_zone', v_relegate,
    'promote_min', public.league_promote_min(v_group.division),
    'last_result', null, 'last_reward', 0, 'leaderboard', v_board
  );
end;
$$;

revoke all on function public.get_league_groups() from public, anon;
revoke all on function public.get_league_group(uuid) from public, anon;
grant execute on function public.get_league_groups() to authenticated;
grant execute on function public.get_league_group(uuid) to authenticated;
commit;
