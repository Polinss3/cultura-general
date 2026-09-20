-- Recuperar la racha con monedas (2.3.0).
-- Aditiva e idempotente; compatible con la 2.2.0: `update_streak` conserva la
-- firma y el comportamiento, solo anota qué racha se perdió y cuándo.
--
-- Modelo:
--  · profiles.lost_streak / lost_streak_at: la racha que se rompió en el último
--    reinicio (si era de 2+ días) y el momento. Es lo que la app enseña como
--    "has perdido tu racha de N días".
--  · recover_streak(): dentro de las 48 h siguientes, paga 10 🪙 por día
--    perdido (mínimo 50, máximo 500) y devuelve la racha. El precio lo fija el
--    servidor; la app solo lo muestra (streak_recovery_price).
--
-- Rollback: la versión anterior de update_streak es la de
-- migrations/20260906050000_pro_perks_v1.sql (verificada idéntica en prod el
-- 2026-09-21 con pg_get_functiondef).
begin;

alter table public.profiles
  add column if not exists lost_streak    int not null default 0,
  add column if not exists lost_streak_at timestamptz;

comment on column public.profiles.lost_streak is
  'Racha que se rompió en el último reinicio (0 = nada que recuperar). Ver recover_streak().';

-- ─── Precio ──────────────────────────────────────────────────────────────────
create or replace function public.streak_recovery_price(p_lost int)
returns int language sql immutable as $$
  select least(500, greatest(50, coalesce(p_lost, 0) * 10));
$$;

-- ─── update_streak: igual que antes, pero anota la racha perdida ─────────────
create or replace function public.update_streak(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $streak_fn$
declare
  v_last_date  date;
  v_freeze_qty int;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'unauthorized';
  end if;

  -- Último día con la pregunta respondida, acertada o no. La racha es de
  -- constancia: fallar la pregunta no la rompe.
  select max(dr.date) into v_last_date
    from public.daily_rankings dr
   where dr.user_id = p_user_id
     and dr.date < current_date;

  if v_last_date = current_date - 1 then
    update public.profiles
       set streak      = streak + 1,
           best_streak = greatest(best_streak, streak + 1)
     where id = p_user_id;
    return;
  end if;

  -- Faltó exactamente un día.
  if v_last_date = current_date - 2 then
    -- PRO: perdón automático, sin gastar nada. Se comprueba ANTES que el
    -- inventario para no consumirle un objeto a quien no lo necesita.
    if public.is_premium(p_user_id) then
      update public.profiles
         set streak      = streak + 1,
             best_streak = greatest(best_streak, streak + 1)
       where id = p_user_id;
      return;
    end if;

    select coalesce(quantity,0) into v_freeze_qty
      from public.user_items
     where user_id = p_user_id and item_id = 'streak_freeze' for update;

    if coalesce(v_freeze_qty, 0) > 0 then
      update public.user_items
         set quantity = quantity - 1, updated_at = now()
       where user_id = p_user_id and item_id = 'streak_freeze';
      update public.profiles
         set streak      = streak + 1,
             best_streak = greatest(best_streak, streak + 1)
       where id = p_user_id;
      return;
    end if;
  end if;

  -- Reinicio. Si había una racha de verdad (2+ días) se anota para poder
  -- recuperarla; si no, se limpia cualquier oferta anterior: un segundo hueco
  -- dentro de la ventana invalidaría la cuenta.
  update public.profiles
     set lost_streak    = case when streak >= 2 then streak else 0 end,
         lost_streak_at = case when streak >= 2 then now() else null end,
         streak         = 1
   where id = p_user_id;
end;
$streak_fn$;

-- ─── recover_streak ──────────────────────────────────────────────────────────
-- La racha recuperada es la perdida MÁS la actual: quien perdió 10 días el
-- lunes y responde martes y miércoles (racha 2) recupera 12, porque no hay
-- hueco entre medias (uno nuevo habría limpiado lost_streak).
create or replace function public.recover_streak()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid   uuid := auth.uid();
  v_p     record;
  v_price int;
  v_new   int;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;

  select coins, streak, best_streak, lost_streak, lost_streak_at
    into v_p
    from public.profiles where id = v_uid for update;

  if v_p.lost_streak is null or v_p.lost_streak <= 0
     or v_p.lost_streak_at is null
     or v_p.lost_streak_at < now() - interval '48 hours' then
    raise exception 'nothing to recover';
  end if;

  v_price := public.streak_recovery_price(v_p.lost_streak);
  if coalesce(v_p.coins, 0) < v_price then
    raise exception 'insufficient coins';
  end if;

  v_new := v_p.lost_streak + coalesce(v_p.streak, 0);

  update public.profiles
     set coins          = coins - v_price,
         streak         = v_new,
         best_streak    = greatest(coalesce(best_streak, 0), v_new),
         lost_streak    = 0,
         lost_streak_at = null
   where id = v_uid;

  insert into public.coin_ledger (user_id, delta, reason)
  values (v_uid, -v_price, 'streak_recovery');

  return jsonb_build_object(
    'recovered', true,
    'streak',    v_new,
    'price',     v_price,
    'coins',     coalesce(v_p.coins, 0) - v_price
  );
end;
$$;

grant execute on function public.recover_streak() to authenticated;
grant execute on function public.streak_recovery_price(int) to authenticated;

commit;
