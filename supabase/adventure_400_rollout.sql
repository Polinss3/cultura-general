-- Generado por scripts/build-adventure-400-rollout.mjs.
-- ⚠️ APLICAR A MANO DURANTE EL ROLLOUT DE LA 2.2.0, NUNCA CON db push.
--
-- Amplía límites y funciones de progreso de 200 a 400 niveles. Las builds
-- 2.1.x siguen operando dentro de 1-200 y no cambian de comportamiento.
begin;

alter table public.adventure_reward_claims
  drop constraint if exists adventure_reward_claims_level_check;
alter table public.adventure_reward_claims
  add constraint adventure_reward_claims_level_check check (level between 1 and 400);

alter table public.adventure_chapter_reward_claims
  drop constraint if exists adventure_chapter_reward_claims_chapter_check;
alter table public.adventure_chapter_reward_claims
  add constraint adventure_chapter_reward_claims_chapter_check check (chapter between 1 and 20);
alter table public.adventure_chapter_reward_claims
  drop constraint if exists adventure_chapter_reward_claims_level_check;
alter table public.adventure_chapter_reward_claims
  add constraint adventure_chapter_reward_claims_level_check
    check (level between 20 and 400 and level % 20 = 0);

create or replace function public.adventure_level_unlocked(
  p_user_id uuid,
  p_level int
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p_level between 1 and 40
      or public.is_premium(p_user_id)
      or (
        p_level between 41 and 200
        and coalesce(
          (select p.adventure_legacy from public.profiles p where p.id = p_user_id),
          false
        )
      );
$$;

create or replace function public.merge_adventure_progress(
  p_left jsonb,
  p_right jsonb
)
returns jsonb
language plpgsql
set search_path = public, pg_temp
as $merge$
declare
  v_left jsonb := case when jsonb_typeof(p_left) = 'object' then p_left else '{}'::jsonb end;
  v_right jsonb := case when jsonb_typeof(p_right) = 'object' then p_right else '{}'::jsonb end;
  v_completed jsonb := '[]'::jsonb;
  v_scores jsonb := '{}'::jsonb;
  v_times jsonb := '{}'::jsonb;
  v_stars jsonb := '{}'::jsonb;
  v_left_completed jsonb;
  v_right_completed jsonb;
  v_level int;
  v_prefix int := 0;
  v_left_value int;
  v_right_value int;
  v_value int;
  v_left_text text;
  v_right_text text;
begin
  v_left_completed := case when jsonb_typeof(v_left->'completedLevels') = 'array'
    then v_left->'completedLevels' else '[]'::jsonb end;
  v_right_completed := case when jsonb_typeof(v_right->'completedLevels') = 'array'
    then v_right->'completedLevels' else '[]'::jsonb end;

  -- Los niveles solo se desbloquean en orden. Conservar el prefijo contiguo
  -- evita estados imposibles (p. ej. nivel 200 completado sin el 1).
  for v_level in 1..400 loop
    if exists (
      select 1
      from jsonb_array_elements_text(v_left_completed || v_right_completed) as item(value)
      where item.value ~ '^[0-9]+$' and item.value::int = v_level
    ) then
      v_completed := v_completed || jsonb_build_array(v_level);
      v_prefix := v_level;
    else
      exit;
    end if;
  end loop;

  for v_level in 1..400 loop
    -- Mejor puntuacion: el maximo valido (0..10).
    v_left_text := v_left->'bestScores'->>v_level::text;
    v_right_text := v_right->'bestScores'->>v_level::text;
    v_left_value := case when coalesce(v_left_text, '') ~ '^[0-9]+$'
      then least(10, v_left_text::int) else 0 end;
    v_right_value := case when coalesce(v_right_text, '') ~ '^[0-9]+$'
      then least(10, v_right_text::int) else 0 end;
    v_value := greatest(v_left_value, v_right_value);
    if v_value > 0 then
      v_scores := v_scores || jsonb_build_object(v_level::text, v_value);
    end if;

    -- Mejor tiempo: el minimo positivo y razonable (hasta 24 horas).
    v_left_text := v_left->'bestTimesMs'->>v_level::text;
    v_right_text := v_right->'bestTimesMs'->>v_level::text;
    v_left_value := case when coalesce(v_left_text, '') ~ '^[0-9]+$'
      then least(86400000, v_left_text::int) else 0 end;
    v_right_value := case when coalesce(v_right_text, '') ~ '^[0-9]+$'
      then least(86400000, v_right_text::int) else 0 end;
    v_value := case
      when v_left_value > 0 and v_right_value > 0 then least(v_left_value, v_right_value)
      else greatest(v_left_value, v_right_value)
    end;
    if v_value > 0 then
      v_times := v_times || jsonb_build_object(v_level::text, v_value);
    end if;

    -- Estrellas: solo existen para niveles realmente completados.
    if v_level <= v_prefix then
      v_left_text := v_left->'stars'->>v_level::text;
      v_right_text := v_right->'stars'->>v_level::text;
      v_left_value := case when coalesce(v_left_text, '') ~ '^[0-9]+$'
        then least(3, greatest(1, v_left_text::int)) else 1 end;
      v_right_value := case when coalesce(v_right_text, '') ~ '^[0-9]+$'
        then least(3, greatest(1, v_right_text::int)) else 1 end;
      v_stars := v_stars || jsonb_build_object(
        v_level::text,
        greatest(v_left_value, v_right_value)
      );
    end if;
  end loop;

  return jsonb_build_object(
    'version', 1,
    'unlockedLevel', least(400, v_prefix + 1),
    'completedLevels', v_completed,
    'rewardedLevels', '[]'::jsonb,
    'bestScores', v_scores,
    'bestTimesMs', v_times,
    'stars', v_stars,
    'rewardedStarMilestones', '{}'::jsonb,
    'updatedAt', to_jsonb(now()::text)
  );
end;
$merge$;

create or replace function public.sync_adventure_progress(p_progress jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $sync$
declare
  v_uid uuid := auth.uid();
  v_remote jsonb;
  v_merged jsonb;
  v_rewarded_levels jsonb;
  v_rewarded_stars jsonb;
  v_level int;
  v_milestone int;
  v_claimed_milestone int;
  v_text text;
  v_created boolean := false;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_progress is null or jsonb_typeof(p_progress) <> 'object' or octet_length(p_progress::text) > 400000 then
    raise exception 'invalid adventure progress';
  end if;

  -- Crear primero la fila vacia hace que dos primeros inicios simultaneos se
  -- serialicen sobre la misma clave en vez de poder pisarse entre si.
  insert into public.user_adventure_progress (user_id)
  values (v_uid)
  on conflict (user_id) do nothing;
  v_created := found;

  select progress into v_remote
  from public.user_adventure_progress
  where user_id = v_uid
  for update;

  v_merged := public.merge_adventure_progress(
    coalesce(v_remote, '{}'::jsonb),
    p_progress
  );

  -- Compatibilidad con las builds de TestFlight anteriores a este backend:
  -- si es la primera sincronizacion, sus marcas locales indican recompensas
  -- que el antiguo award_progress ya entrego. Se registran como claims de
  -- legado (ganancia 0) para no volver a pagarlas al actualizar.
  if v_created then
    for v_level in 1..400 loop
      if coalesce(p_progress->'rewardedLevels', '[]'::jsonb) @> jsonb_build_array(v_level) and
         coalesce(v_merged->'completedLevels', '[]'::jsonb) @> jsonb_build_array(v_level) then
        insert into public.adventure_reward_claims (user_id, level, milestone)
        values (v_uid, v_level, 1)
        on conflict (user_id, level, milestone) do nothing;
      end if;

      v_text := p_progress->'rewardedStarMilestones'->>v_level::text;
      v_claimed_milestone := case when coalesce(v_text, '') ~ '^[0-9]+$'
        then least(3, v_text::int) else 0 end;
      if v_claimed_milestone >= 2 and
         coalesce((v_merged->'stars'->>v_level::text)::int, 0) >= v_claimed_milestone then
        for v_milestone in 2..v_claimed_milestone loop
          insert into public.adventure_reward_claims (user_id, level, milestone)
          values (v_uid, v_level, v_milestone)
          on conflict (user_id, level, milestone) do nothing;
        end loop;
      end if;
    end loop;
  end if;

  select coalesce(jsonb_agg(level order by level), '[]'::jsonb)
    into v_rewarded_levels
  from public.adventure_reward_claims
  where user_id = v_uid and milestone = 1;

  select coalesce(jsonb_object_agg(level::text, milestone), '{}'::jsonb)
    into v_rewarded_stars
  from (
    select level, max(milestone)::int as milestone
    from public.adventure_reward_claims
    where user_id = v_uid and milestone in (2, 3)
    group by level
  ) claimed;

  v_merged := jsonb_set(v_merged, '{rewardedLevels}', v_rewarded_levels, true);
  v_merged := jsonb_set(v_merged, '{rewardedStarMilestones}', v_rewarded_stars, true);

  insert into public.user_adventure_progress (user_id, progress, updated_at)
  values (v_uid, v_merged, now())
  on conflict (user_id) do update
    set progress = excluded.progress,
        updated_at = excluded.updated_at;

  return v_merged;
end;
$sync$;

create or replace function public.claim_adventure_reward(
  p_level int,
  p_milestone int
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $claim$
declare
  v_uid uuid := auth.uid();
  v_progress jsonb;
  v_stars int := 0;
  v_inserted boolean := false;
  v_base_xp int;
  v_base_coins int;
  v_apply_multiplier boolean;
  v_result jsonb;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if p_level is null or p_level < 1 or p_level > 400 or
     p_milestone is null or p_milestone not in (1, 2, 3) then
    raise exception 'invalid adventure reward';
  end if;

  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid
  for update;
  if v_progress is null then raise exception 'adventure progress not found'; end if;

  if not coalesce(v_progress->'completedLevels', '[]'::jsonb) @> jsonb_build_array(p_level) then
    raise exception 'adventure level not completed';
  end if;
  if p_milestone > 1 then
    v_stars := case
      when coalesce(v_progress->'stars'->>p_level::text, '') ~ '^[0-9]+$'
        then (v_progress->'stars'->>p_level::text)::int
      else 0
    end;
    if v_stars < p_milestone then raise exception 'adventure star milestone not reached'; end if;
  end if;

  v_base_xp := case when p_milestone = 1 then 80 else 0 end;
  v_base_coins := case p_milestone when 1 then 20 when 2 then 5 else 10 end;
  v_apply_multiplier := p_milestone = 1;

  insert into public.adventure_reward_claims (user_id, level, milestone)
  values (v_uid, p_level, p_milestone)
  on conflict (user_id, level, milestone) do nothing;
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
    v_base_xp,
    v_base_coins,
    v_apply_multiplier,
    'adventure_level_' || p_level || '_milestone_' || p_milestone
  );

  update public.adventure_reward_claims
  set gained_xp = coalesce((v_result->>'gained_xp')::int, 0),
      gained_coins = coalesce((v_result->>'gained_coins')::int, 0)
  where user_id = v_uid and level = p_level and milestone = p_milestone;

  return v_result || jsonb_build_object('already_claimed', false);
end;
$claim$;

create or replace function public.claim_pending_adventure_rewards()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $pending$
declare
  v_uid uuid := auth.uid();
  v_progress jsonb;
  v_level int;
  v_milestone int;
  v_stars int;
  v_result jsonb;
  v_total_xp int := 0;
  v_total_coins int := 0;
  v_claimed_count int := 0;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid
  for update;

  if v_progress is null then
    return jsonb_build_object(
      'xp', 0, 'level', 1, 'leveled_up', false, 'levels_gained', 0,
      'coins', 0, 'gained_xp', 0, 'gained_coins', 0, 'claimed_count', 0
    );
  end if;

  for v_level in 1..400 loop
    exit when not coalesce(v_progress->'completedLevels', '[]'::jsonb) @> jsonb_build_array(v_level);
    v_stars := greatest(1, coalesce(nullif(v_progress->'stars'->>v_level::text, '')::int, 1));
    for v_milestone in 1..least(3, v_stars) loop
      if not exists (
        select 1 from public.adventure_reward_claims
        where user_id = v_uid and level = v_level and milestone = v_milestone
      ) then
        v_result := public.claim_adventure_reward(v_level, v_milestone);
        v_total_xp := v_total_xp + coalesce((v_result->>'gained_xp')::int, 0);
        v_total_coins := v_total_coins + coalesce((v_result->>'gained_coins')::int, 0);
        v_claimed_count := v_claimed_count + 1;
      end if;
    end loop;
  end loop;

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
    'gained_xp', v_total_xp,
    'gained_coins', v_total_coins,
    'claimed_count', v_claimed_count
  );
end;
$pending$;

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
  if p_chapter is null or p_chapter < 1 or p_chapter > 20 then
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
    for v_chapter in 1..20 loop
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

commit;
