-- Aventura 2.1: recompensa segura e idempotente para los finales de capítulo.
-- Migración aditiva: no cambia ningún contrato consumido por la versión 2.0.
begin;

create table if not exists public.adventure_chapter_reward_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter int not null check (chapter between 1 and 10),
  level int not null check (level between 20 and 200 and level % 20 = 0),
  gained_coins int not null default 0 check (gained_coins >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, chapter),
  constraint adventure_chapter_reward_level_matches check (level = chapter * 20)
);

alter table public.adventure_chapter_reward_claims enable row level security;

drop policy if exists "Users read own adventure chapter rewards"
  on public.adventure_chapter_reward_claims;
create policy "Users read own adventure chapter rewards"
  on public.adventure_chapter_reward_claims for select
  using (auth.uid() = user_id);

grant select on public.adventure_chapter_reward_claims to authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.adventure_chapter_reward_claims from anon, authenticated;

create or replace function public.claim_adventure_chapter_reward(p_chapter int)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $claim_chapter$
declare
  v_uid uuid := auth.uid();
  v_level int;
  v_progress jsonb;
  v_inserted boolean := false;
  v_result jsonb;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_chapter is null or p_chapter < 1 or p_chapter > 10 then
    raise exception 'invalid adventure chapter';
  end if;

  v_level := p_chapter * 20;
  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid
  for update;
  if v_progress is null then raise exception 'adventure progress not found'; end if;

  if not coalesce(v_progress->'completedLevels', '[]'::jsonb) @> jsonb_build_array(v_level) then
    raise exception 'adventure chapter not completed';
  end if;

  insert into public.adventure_chapter_reward_claims (user_id, chapter, level)
  values (v_uid, p_chapter, v_level)
  on conflict (user_id, chapter) do nothing;
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
    40,
    false,
    'adventure_chapter_' || p_chapter
  );

  update public.adventure_chapter_reward_claims
  set gained_coins = coalesce((v_result->>'gained_coins')::int, 0)
  where user_id = v_uid and chapter = p_chapter;

  return v_result || jsonb_build_object('already_claimed', false);
end;
$claim_chapter$;

create or replace function public.claim_pending_adventure_chapter_rewards()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $pending_chapters$
declare
  v_uid uuid := auth.uid();
  v_progress jsonb;
  v_chapter int;
  v_level int;
  v_result jsonb;
  v_total_coins int := 0;
  v_claimed_count int := 0;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid
  for update;

  if v_progress is not null then
    for v_chapter in 1..10 loop
      v_level := v_chapter * 20;
      if coalesce(v_progress->'completedLevels', '[]'::jsonb) @> jsonb_build_array(v_level) and
         not exists (
           select 1 from public.adventure_chapter_reward_claims
           where user_id = v_uid and chapter = v_chapter
         ) then
        v_result := public.claim_adventure_chapter_reward(v_chapter);
        v_total_coins := v_total_coins + coalesce((v_result->>'gained_coins')::int, 0);
        v_claimed_count := v_claimed_count + 1;
      end if;
    end loop;
  end if;

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
    'gained_coins', v_total_coins,
    'claimed_count', v_claimed_count
  );
end;
$pending_chapters$;

revoke all on function public.claim_adventure_chapter_reward(int) from public;
revoke all on function public.claim_pending_adventure_chapter_rewards() from public;
grant execute on function public.claim_adventure_chapter_reward(int) to authenticated;
grant execute on function public.claim_pending_adventure_chapter_rewards() to authenticated;

commit;

select
  to_regprocedure('public.claim_adventure_chapter_reward(integer)') is not null as reward_rpc_ok,
  to_regprocedure('public.claim_pending_adventure_chapter_rewards()') is not null as pending_rpc_ok,
  to_regclass('public.adventure_chapter_reward_claims') is not null as claims_table_ok;
