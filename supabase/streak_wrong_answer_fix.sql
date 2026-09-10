-- ─────────────────────────────────────────────────────────────
-- Cultura General — la racha se rompía al fallar la pregunta del día
--
-- QUÉ ARREGLA: `update_streak` decidía si "ayer jugaste" mirando
-- `daily_rankings` con `score > 0`. Como `saveDailyAnswer` guarda score 100
-- si aciertas y 0 si fallas, un día con la pregunta FALLADA no contaba como
-- jugado: al día siguiente la función no encontraba "ayer" y ponía la racha
-- a 1. Mientras tanto el calendario de racha (`fetchAnsweredDates`) pinta
-- cualquier día con fila en `daily_rankings`, acierto o fallo, y todos los
-- textos de la app dicen "Responde hoy para mantener tu racha". Resultado:
-- ocho días seguidos pintados y "1 día" de racha (reporte de un usuario,
-- 2026-09-10).
--
-- La racha premia la constancia, no el acierto: cualquier día con la pregunta
-- respondida cuenta. Se quita el filtro y nada más; el resto del cuerpo es
-- idéntico al de gamification.sql.
--
-- REPARACIÓN: al final se recalcula la racha viva de todos los perfiles a
-- partir de sus días respondidos. Solo SUBE valores (greatest), nunca los
-- baja, porque un "Congelar racha" consumido no deja huella en
-- `daily_rankings` y recalcular a la baja rompería rachas legítimas.
--
-- CÓMO APLICARLO: SQL Editor de Supabase, entero. Idempotente. No depende
-- de nada de la 2.2.0 (is_premium, etc.). Cuando se apliquen las
-- migraciones PRO, `pro_perks_v1` vuelve a definir la función ya con este
-- mismo arreglo.
-- ─────────────────────────────────────────────────────────────

begin;

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

  -- Faltó exactamente un día: intenta consumir un "Congelar racha".
  if v_last_date = current_date - 2 then
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

  update public.profiles set streak = 1 where id = p_user_id;
end;
$streak_fn$;

-- ─── Reparación de los perfiles afectados ────────────────────
-- Tramos de días consecutivos por usuario: `date - row_number()` es constante
-- dentro de cada tramo (las fechas son únicas por usuario).
with runs as (
  select user_id,
         date,
         date - (row_number() over (partition by user_id order by date))::int as grp
    from public.daily_rankings
),
run_len as (
  select user_id, count(*)::int as len, max(date) as last_date
    from runs
   group by user_id, grp
),
per_user as (
  select user_id,
         -- Tramo vivo: termina hoy o ayer (ayer = aún no está rota).
         max(len) filter (where last_date >= current_date - 1) as live_len,
         max(len)                                              as best_len
    from run_len
   group by user_id
)
update public.profiles p
   set streak      = greatest(p.streak, coalesce(u.live_len, 0)),
       best_streak = greatest(p.best_streak, u.best_len)
  from per_user u
 where p.id = u.user_id
   and (p.streak < coalesce(u.live_len, 0) or p.best_streak < u.best_len);

commit;
