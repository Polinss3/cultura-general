-- Aventura 2.1: logros validados en servidor.
--
-- Migración aditiva: las builds 2.0 siguen usando claim_achievement sin ningún
-- cambio de firma. Los nuevos ids se reclaman mediante un RPC separado que
-- comprueba el progreso canónico de Aventura antes de pagar.
begin;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'user_achievements_id_catalog_check'
  ) then
    alter table public.user_achievements
      drop constraint user_achievements_id_catalog_check;
  end if;

  alter table public.user_achievements
    add constraint user_achievements_id_catalog_check
    check (achievement_id in (
      'first_answer', 'ten_answers', 'hundred_answers', 'five_hundred_answers',
      'streak_3', 'streak_7', 'streak_30',
      'accuracy_80', 'accuracy_95',
      'speed_5', 'speed_10', 'speed_20',
      'level_10', 'level_25', 'level_50',
      'coins_500', 'coins_2000',
      'ladder_5', 'ladder_10', 'ladder_20',
      'mult_max',
      'adventure_first', 'adventure_chapter', 'adventure_stars_100',
      'adventure_levels_100', 'adventure_all'
    ))
    not valid;
end $$;

create or replace function public.claim_adventure_achievement(
  p_achievement_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $claim_adventure_achievement$
declare
  v_uid uuid := auth.uid();
  v_progress jsonb;
  v_completed int := 0;
  v_stars int := 0;
  v_unlocked boolean := false;
  v_reward int := 0;
  v_inserted boolean := false;
  v_result jsonb;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_achievement_id not in (
    'adventure_first', 'adventure_chapter', 'adventure_stars_100',
    'adventure_levels_100', 'adventure_all'
  ) then
    raise exception 'invalid adventure achievement';
  end if;

  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid
  for update;
  if v_progress is null then raise exception 'adventure progress not found'; end if;

  if jsonb_typeof(v_progress->'completedLevels') = 'array' then
    v_completed := jsonb_array_length(v_progress->'completedLevels');
  end if;
  if jsonb_typeof(v_progress->'stars') = 'object' then
    select coalesce(sum(case when value ~ '^[0-3]$' then value::int else 0 end), 0)::int
      into v_stars
    from jsonb_each_text(v_progress->'stars');
  end if;

  v_unlocked := case p_achievement_id
    when 'adventure_first' then v_completed >= 1
    when 'adventure_chapter' then v_completed >= 20
    when 'adventure_stars_100' then v_stars >= 100
    when 'adventure_levels_100' then v_completed >= 100
    when 'adventure_all' then v_completed >= 200
    else false
  end;
  if not v_unlocked then raise exception 'adventure achievement locked'; end if;

  v_reward := case p_achievement_id
    when 'adventure_first' then 25
    when 'adventure_chapter' then 50
    when 'adventure_stars_100' then 75
    when 'adventure_levels_100' then 100
    when 'adventure_all' then 150
    else 0
  end;

  insert into public.user_achievements (user_id, achievement_id, unlocked_at, claimed)
  values (v_uid, p_achievement_id, now(), true)
  on conflict (user_id, achievement_id) do nothing;
  v_inserted := found;

  if not v_inserted then
    select coalesce(xp, 0) as xp, coalesce(level, 1) as level, coalesce(coins, 0) as coins
      into v_profile
    from public.profiles where id = v_uid;
    if not found then raise exception 'profile not found'; end if;
    return jsonb_build_object(
      'xp', v_profile.xp,
      'level', v_profile.level,
      'leveled_up', false,
      'levels_gained', 0,
      'coins', v_profile.coins,
      'gained_xp', 0,
      'gained_coins', 0,
      'already_claimed', true
    );
  end if;

  v_result := public.award_progress(
    0,
    v_reward,
    false,
    'adventure_achievement_' || p_achievement_id
  );
  return v_result || jsonb_build_object('already_claimed', false);
end;
$claim_adventure_achievement$;

revoke all on function public.claim_adventure_achievement(text) from public;
grant execute on function public.claim_adventure_achievement(text) to authenticated;

commit;

-- Verificación manual tras ejecutar esta migración en Supabase:
select
  to_regprocedure('public.claim_adventure_achievement(text)') is not null as rpc_ok,
  exists (
    select 1 from pg_constraint
    where conname = 'user_achievements_id_catalog_check'
      and pg_get_constraintdef(oid) like '%adventure_all%'
  ) as catalog_ok;
