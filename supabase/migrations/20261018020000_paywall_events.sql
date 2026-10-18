-- CG PRO: medir el paywall. Aditiva e idempotente.
--
-- Por qué (2026-10-18): desde la 2.2.0 nadie ha empezado la prueba gratuita y
-- no había forma de saber si es por el precio o porque casi nadie ve el
-- paywall (solo 2 cuentas han llegado al nivel 40 de Aventura, que era la
-- entrada principal). Esta tabla registra cada apertura y lo que pasa dentro:
-- de dónde viene (`source`), qué plan toca y cómo termina.
--
-- Escritura solo por log_paywall_event(): valida los campos y fija user_id con
-- auth.uid(), así que nadie puede apuntar eventos a otra cuenta. El invitado
-- (rol anon) también registra, con user_id nulo. Sin políticas de lectura: se
-- consulta desde el panel o con `supabase db query --linked`.
--
-- Embudo de los últimos 30 días por origen:
--   select source,
--          count(distinct view_id) filter (where event = 'view')         as vistas,
--          count(distinct view_id) filter (where event = 'purchase_tap') as toques_compra,
--          count(distinct view_id) filter (where event = 'purchased')    as compras
--     from public.paywall_events
--    where created_at > now() - interval '30 days'
--    group by source order by vistas desc;
--
-- Rollback: drop function public.log_paywall_event(text, text, text, text, text, text, text);
--           drop table public.paywall_events;
begin;

create table if not exists public.paywall_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  user_id     uuid references auth.users(id) on delete set null,
  -- Una apertura del paywall: agrupa sus eventos para contar embudos.
  view_id     text not null,
  event       text not null check (event in (
    'view', 'select_plan', 'purchase_tap', 'purchased', 'cancelled',
    'failed', 'login_required', 'restore', 'no_plans', 'close'
  )),
  source      text not null,
  tier        text check (tier in ('monthly', 'annual', 'lifetime')),
  platform    text,
  app_version text,
  lang        text
);

create index if not exists paywall_events_created_idx on public.paywall_events (created_at desc);
create index if not exists paywall_events_view_idx on public.paywall_events (view_id);

alter table public.paywall_events enable row level security;
revoke all on public.paywall_events from anon, authenticated;

create or replace function public.log_paywall_event(
  p_view_id     text,
  p_event       text,
  p_source      text,
  p_tier        text default null,
  p_platform    text default null,
  p_app_version text default null,
  p_lang        text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Un evento malformado se descarta en silencio: medir nunca puede romper el
  -- paywall, y el cliente no reintenta.
  if p_view_id is null or length(p_view_id) not between 8 and 64 then return; end if;
  if p_event not in (
    'view', 'select_plan', 'purchase_tap', 'purchased', 'cancelled',
    'failed', 'login_required', 'restore', 'no_plans', 'close'
  ) then return; end if;
  if p_tier is not null and p_tier not in ('monthly', 'annual', 'lifetime') then
    p_tier := null;
  end if;

  insert into public.paywall_events
    (user_id, view_id, event, source, tier, platform, app_version, lang)
  values (
    auth.uid(),
    p_view_id,
    p_event,
    left(coalesce(nullif(p_source, ''), 'unknown'), 64),
    p_tier,
    left(p_platform, 16),
    left(p_app_version, 32),
    left(p_lang, 8)
  );
end;
$$;

revoke all on function public.log_paywall_event(text, text, text, text, text, text, text) from public;
grant execute on function public.log_paywall_event(text, text, text, text, text, text, text) to anon, authenticated;

commit;
