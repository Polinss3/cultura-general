-- Embudo de la primera sesión: login, onboarding, primer resultado y permiso
-- de avisos. Aditiva e idempotente.
--
-- Por qué (2026-10-18): el 23 % de las cuentas no llega a jugar nada (119 de
-- 526) y el 52 % de quienes juegan no vuelve otro día, pero no se sabía en qué
-- pantalla se iban. Cada evento lleva un `install_id` aleatorio del
-- dispositivo, así que se puede seguir a un invitado o a alguien que aún no
-- tiene cuenta; en cuanto hay sesión, `user_id` sale de auth.uid().
--
-- Escritura solo por log_funnel_event(). El nombre del evento se valida por
-- forma, no contra una lista, para poder añadir pasos sin otra migración.
--
-- Embudo por instalación de los últimos 30 días:
--   select event, count(distinct install_id) instalaciones
--     from public.funnel_events
--    where created_at > now() - interval '30 days'
--    group by event order by instalaciones desc;
--
-- Rollback: drop function public.log_funnel_event(text, text, text, text, text, text);
--           drop table public.funnel_events;
begin;

create table if not exists public.funnel_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  install_id  text not null,
  user_id     uuid references auth.users(id) on delete set null,
  event       text not null,
  detail      text,
  platform    text,
  app_version text,
  lang        text
);

create index if not exists funnel_events_created_idx on public.funnel_events (created_at desc);
create index if not exists funnel_events_install_idx on public.funnel_events (install_id);

alter table public.funnel_events enable row level security;
revoke all on public.funnel_events from anon, authenticated;

create or replace function public.log_funnel_event(
  p_install_id  text,
  p_event       text,
  p_detail      text default null,
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
  -- Malformado = descartado en silencio: medir nunca puede romper la app.
  if p_install_id is null or length(p_install_id) not between 8 and 64 then return; end if;
  if p_event is null or p_event !~ '^[a-z][a-z0-9_]{1,39}$' then return; end if;

  insert into public.funnel_events
    (install_id, user_id, event, detail, platform, app_version, lang)
  values (
    p_install_id,
    auth.uid(),
    p_event,
    left(p_detail, 64),
    left(p_platform, 16),
    left(p_app_version, 32),
    left(p_lang, 8)
  );
end;
$$;

revoke all on function public.log_funnel_event(text, text, text, text, text, text) from public;
grant execute on function public.log_funnel_event(text, text, text, text, text, text) to anon, authenticated;

commit;
