-- ─────────────────────────────────────────────────────────────
-- Cultura General — Pausa de cuenta + ajustes para invitado
-- Idempotente, re-ejecutable.
-- ─────────────────────────────────────────────────────────────

-- ─── Columnas para pausa de cuenta ───────────────────────────

alter table public.profiles
  add column if not exists is_paused boolean default false,
  add column if not exists paused_at timestamptz;

-- ─── Ocultar perfiles pausados en lecturas públicas ─────────
-- (Rankings, búsqueda de amigos. El propio usuario sí se ve a sí mismo.)

drop policy if exists "Profiles viewable by all"        on public.profiles;
drop policy if exists "Active profiles viewable by all" on public.profiles;
create policy "Active profiles viewable by all"
  on public.profiles for select
  using (coalesce(is_paused, false) = false or auth.uid() = id);

-- ─── Permitir que invitado lea preguntas ────────────────────
-- Las preguntas no son datos sensibles; el modo invitado las necesita
-- para Aprender / Rápido.

drop policy if exists "Questions readable by authenticated" on public.questions;
drop policy if exists "Questions readable by all"           on public.questions;
create policy "Questions readable by all"
  on public.questions for select
  using (true);

-- ─── RPCs ────────────────────────────────────────────────────

create or replace function public.pause_account()
returns void language plpgsql security definer as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles
     set is_paused = true,
         paused_at = now()
   where id = auth.uid();
end;
$$;

create or replace function public.reactivate_account()
returns void language plpgsql security definer as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles
     set is_paused = false,
         paused_at = null
   where id = auth.uid();
end;
$$;

revoke all on function public.pause_account()      from public;
revoke all on function public.reactivate_account() from public;
grant execute on function public.pause_account()      to authenticated;
grant execute on function public.reactivate_account() to authenticated;
