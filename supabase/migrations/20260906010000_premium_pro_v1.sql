-- CG PRO v1 — suscripción premium (mensual, anual, lifetime).
--
-- Migración ADITIVA e idempotente: no altera ninguna función ni contrato
-- existente. El candado de servidor sobre las recompensas de Aventura se
-- implementa con TRIGGERS sobre las tablas de reclamaciones, no reescribiendo
-- `claim_adventure_reward` ni `claim_adventure_chapter_reward`, para no tocar
-- lógica ya verificada en producción.
begin;

-- ─── Estado premium en el perfil ─────────────────────────────────────────────
-- Espejo denormalizado, igual que `league_division` y `cosmetics`. La fuente de
-- la verdad es RevenueCat; este espejo lo escribe el webhook.

alter table public.profiles
  add column if not exists premium_tier text not null default 'none',
  add column if not exists premium_until timestamptz,
  add column if not exists premium_since timestamptz,
  add column if not exists adventure_legacy boolean not null default false,
  add column if not exists pro_stipend_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_premium_tier_check'
  ) then
    alter table public.profiles
      add constraint profiles_premium_tier_check
      check (premium_tier in ('none', 'monthly', 'annual', 'lifetime'));
  end if;
end $$;

comment on column public.profiles.premium_tier is
  'Espejo de RevenueCat. Lo escribe el webhook, nunca el cliente.';
comment on column public.profiles.premium_until is
  'Fin del periodo pagado. NULL en lifetime (no caduca) y en none.';
comment on column public.profiles.adventure_legacy is
  'Usuario que ya había pasado del capítulo 2 antes de la 2.2.0: conserva la Aventura completa para siempre.';

-- El cliente ya solo puede escribir `username` en profiles (security_hardening),
-- así que estas columnas quedan protegidas por la política existente.

-- ─── Helpers ─────────────────────────────────────────────────────────────────

create or replace function public.is_premium(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (
      select p.premium_tier = 'lifetime'
          or (p.premium_tier in ('monthly', 'annual')
              and p.premium_until is not null
              and p.premium_until > now())
      from public.profiles p
      where p.id = p_user_id
    ),
    false
  );
$$;

comment on function public.is_premium(uuid) is
  'True si el usuario tiene PRO activo. Lifetime no caduca; las suscripciones se comprueban contra premium_until.';

-- Capítulos 1 y 2 (niveles 1-40) son gratuitos. El resto exige PRO, salvo para
-- los usuarios heredados de versiones anteriores a la 2.2.0.
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
  select p_level <= 40
      or public.is_premium(p_user_id)
      or coalesce(
           (select p.adventure_legacy from public.profiles p where p.id = p_user_id),
           false
         );
$$;

grant execute on function public.is_premium(uuid) to authenticated;
grant execute on function public.adventure_level_unlocked(uuid, int) to authenticated;

-- ─── Candado de recompensas de Aventura ──────────────────────────────────────
-- Un cliente modificado podría llamar a claim_adventure_reward para un nivel de
-- pago. Estos triggers lo cortan en la tabla, sin tocar las funciones.

create or replace function public.enforce_adventure_premium_level()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.adventure_level_unlocked(new.user_id, new.level) then
    raise exception 'adventure level requires premium';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_adventure_reward_premium on public.adventure_reward_claims;
create trigger trg_adventure_reward_premium
  before insert on public.adventure_reward_claims
  for each row execute function public.enforce_adventure_premium_level();

drop trigger if exists trg_adventure_chapter_reward_premium on public.adventure_chapter_reward_claims;
create trigger trg_adventure_chapter_reward_premium
  before insert on public.adventure_chapter_reward_claims
  for each row execute function public.enforce_adventure_premium_level();

-- ─── Grandfathering ──────────────────────────────────────────────────────────
-- Lo llama el cliente una vez, en el primer arranque de la 2.2.0. Marca legacy
-- solo si el progreso REMOTO (no el que envíe el cliente) demuestra que ya se
-- había pasado del nivel 40.

create or replace function public.grant_adventure_legacy_access()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_progress jsonb;
  v_max_completed int := 0;
  v_legacy boolean;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select adventure_legacy into v_legacy from public.profiles where id = v_uid;
  if v_legacy then return true; end if;

  select progress into v_progress
  from public.user_adventure_progress
  where user_id = v_uid;

  if v_progress is null then return false; end if;

  select coalesce(max((value)::int), 0) into v_max_completed
  from jsonb_array_elements_text(coalesce(v_progress->'completedLevels', '[]'::jsonb)) as value
  where value ~ '^[0-9]+$';

  v_max_completed := greatest(
    v_max_completed,
    case
      when coalesce(v_progress->>'unlockedLevel', '') ~ '^[0-9]+$'
        then (v_progress->>'unlockedLevel')::int - 1
      else 0
    end
  );

  if v_max_completed <= 40 then return false; end if;

  update public.profiles set adventure_legacy = true where id = v_uid;
  return true;
end;
$$;

grant execute on function public.grant_adventure_legacy_access() to authenticated;

-- ─── Escritura del estado premium (solo webhook) ─────────────────────────────
-- La Edge Function `revenuecat-webhook` entra con la service role key. Esta
-- función centraliza la validación para que el webhook no haga UPDATE suelto.

create or replace function public.apply_premium_status(
  p_user_id uuid,
  p_tier text,
  p_until timestamptz
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_tier not in ('none', 'monthly', 'annual', 'lifetime') then
    raise exception 'invalid premium tier: %', p_tier;
  end if;

  update public.profiles
  set premium_tier = p_tier,
      premium_until = case when p_tier = 'lifetime' then null else p_until end,
      premium_since = case
        when p_tier = 'none' then premium_since
        else coalesce(premium_since, now())
      end
  where id = p_user_id;
end;
$$;

revoke execute on function public.apply_premium_status(uuid, text, timestamptz) from anon, authenticated;
grant execute on function public.apply_premium_status(uuid, text, timestamptz) to service_role;

-- ─── Estipendio mensual de monedas ───────────────────────────────────────────
-- 300 monedas al mes para PRO. Idempotente por mes natural: si ya se cobró en
-- los últimos 28 días, no concede nada y devuelve claimed=false.

create or replace function public.claim_pro_stipend()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_last timestamptz;
  v_coins int := 300;
  v_profile record;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;

  select pro_stipend_at into v_last from public.profiles where id = v_uid for update;

  if v_last is not null and v_last > now() - interval '28 days' then
    select coalesce(coins, 0) as coins into v_profile from public.profiles where id = v_uid;
    return jsonb_build_object('claimed', false, 'coins', v_profile.coins, 'gainedCoins', 0);
  end if;

  update public.profiles
  set coins = coalesce(coins, 0) + v_coins,
      pro_stipend_at = now()
  where id = v_uid;

  insert into public.coin_ledger (user_id, delta, reason)
  values (v_uid, v_coins, 'pro_stipend');

  select coalesce(coins, 0) as coins into v_profile from public.profiles where id = v_uid;
  return jsonb_build_object('claimed', true, 'coins', v_profile.coins, 'gainedCoins', v_coins);
end;
$$;

grant execute on function public.claim_pro_stipend() to authenticated;

commit;
