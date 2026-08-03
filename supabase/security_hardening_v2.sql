-- ─────────────────────────────────────────────────────────────
-- Cultura General — Security hardening v2 (fase 1)
--
-- QUÉ HACE: impide que un usuario autenticado se reescriba monedas, XP,
-- nivel, racha o estadísticas llamando directamente a la API REST.
--
-- QUÉ NO HACE: no borra ni modifica NI UNA SOLA FILA de datos. No hay DELETE,
-- ni DROP TABLE, ni TRUNCATE, ni UPDATE de datos en todo el fichero. Las
-- cuentas, el progreso, las monedas y los rankings actuales se quedan
-- exactamente como están. Solo se tocan permisos, una constraint y una
-- función.
--
-- COMPATIBILIDAD: es compatible con la 1.3.0 que hay publicada. Los clientes
-- antiguos siguen funcionando igual, porque lo único que la app escribe
-- directamente en `profiles` es el nombre de usuario; todo lo demás ya pasa
-- por funciones SECURITY DEFINER, que se ejecutan como el dueño de la función
-- y por tanto no se ven afectadas por los permisos de columna.
--
-- Idempotente: se puede ejecutar varias veces sin efecto acumulativo.
-- Transaccional: si algo falla, no se aplica nada.
--
-- Al final hay un bloque de VERIFICACIÓN y, comentado, el ROLLBACK.
-- ─────────────────────────────────────────────────────────────

begin;

-- ─── A. profiles: solo el nombre de usuario es escribible ────
--
-- El problema: la política `for update using (auth.uid() = id)` deja que el
-- dueño de la fila cambie CUALQUIER columna, incluidas coins, xp, level,
-- streak, total_correct o ladder_best. RLS en PostgreSQL no sabe restringir
-- columnas; eso solo se consigue con permisos de columna.
--
-- Se conceden `id` y `username` juntos, no solo `username`, porque la app
-- llama a `upsert({ id, username })` y PostgREST traduce eso a
-- `INSERT ... ON CONFLICT (id) DO UPDATE SET id = ..., username = ...`:
-- si `id` no fuera escribible, el cambio de nombre fallaría con
-- "permission denied for column id" y romperíamos a los usuarios de la 1.3.0.
--
-- Conceder `id` es seguro gracias al bloque B de más abajo.

revoke insert, update on public.profiles from anon, authenticated;

grant insert (id, username) on public.profiles to authenticated;
grant update (id, username) on public.profiles to authenticated;

-- Nota: no se toca SELECT (ver bloque E) ni DELETE (no tiene política, así que
-- RLS ya lo deniega, y la baja de cuenta va por su propia función).


-- ─── B. La fila resultante debe seguir siendo tuya ───────────
--
-- Cuando una política de UPDATE no declara WITH CHECK, PostgreSQL reutiliza el
-- USING para validar también la fila resultante, así que hoy ya es correcto.
-- Se deja explícito para que nadie lo rompa por accidente al editar la
-- política más adelante: sin esto, poder escribir `id` permitiría reasignarse
-- la fila a otra cuenta.

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ─── C. Logros: solo los del catálogo ────────────────────────
--
-- `claim_achievement(p_achievement_id)` inserta el logro y paga, pero
-- `achievement_id` es texto libre sin clave foránea: cualquier cadena
-- inventada cae en el `else 50` de la función y paga 50 monedas. Como la clave
-- primaria es (user_id, achievement_id), cada cadena distinta es un cobro
-- nuevo, así que un bucle da monedas infinitas.
--
-- NOT VALID a propósito: la constraint se aplica a lo que entre a partir de
-- ahora y NO revisa ni toca las filas que ya existen. Si alguien ya farmeó,
-- sus filas se quedan donde están; simplemente no podrá crear más.

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'user_achievements_id_catalog_check'
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
      'mult_max'
    ))
    not valid;
end $$;


-- ─── D. Estadísticas: topes por llamada ──────────────────────
--
-- `increment_profile_stats` validaba que `correct <= answered` y que ninguno
-- fuera negativo, pero no tenía techo: una sola llamada con 999999 disparaba
-- el ranking global, que se ordena por total_correct.
--
-- El techo es 200 por llamada. En juego real el máximo es una partida de
-- contrarreloj de 30 segundos (unas 40 respuestas siendo muy rápido); el resto
-- de modos llaman de una en una. 200 deja muchísimo margen.
--
-- Se mantienen la firma y el resto del comportamiento intactos.

create or replace function public.increment_profile_stats(
  p_answered int,
  p_correct int,
  p_speed_record int default null
)
returns void language plpgsql security definer as $stats_fn$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'unauthorized';
  end if;

  if p_answered < 0 or p_correct < 0 or p_correct > p_answered then
    raise exception 'invalid stats payload';
  end if;

  if p_answered > 200 or coalesce(p_speed_record, 0) > 200 then
    raise exception 'stats payload out of range';
  end if;

  update public.profiles
     set total_answered = coalesce(total_answered, 0) + p_answered,
         total_correct  = coalesce(total_correct, 0) + p_correct,
         speed_record   = case
           when p_speed_record is not null and p_speed_record > coalesce(speed_record, 0)
             then p_speed_record
           else speed_record
         end
   where id = v_uid;
end;
$stats_fn$;


commit;


-- ─────────────────────────────────────────────────────────────
-- VERIFICACIÓN — ejecuta esto después y revisa que todo diga OK
-- ─────────────────────────────────────────────────────────────

select
  'A. columnas escribibles por authenticated' as comprobacion,
  coalesce(string_agg(column_name, ', ' order by column_name), '(ninguna)') as resultado,
  case when coalesce(string_agg(column_name, ', ' order by column_name), '') = 'id, username'
       then 'OK' else 'REVISAR' end as estado
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles'
  and grantee = 'authenticated' and privilege_type = 'UPDATE'

union all

select
  'B. política de UPDATE con WITH CHECK',
  coalesce(with_check, '(sin with check)'),
  case when with_check is not null then 'OK' else 'REVISAR' end
from pg_policies
where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users update own profile'

union all

select
  'C. catálogo de logros',
  case when count(*) > 0 then 'constraint presente' else 'ausente' end,
  case when count(*) > 0 then 'OK' else 'REVISAR' end
from pg_constraint where conname = 'user_achievements_id_catalog_check'

union all

select
  'D. tope en increment_profile_stats',
  case when prosrc like '%out of range%' then 'con tope' else 'sin tope' end,
  case when prosrc like '%out of range%' then 'OK' else 'REVISAR' end
from pg_proc where proname = 'increment_profile_stats'

union all

select
  'Datos intactos: perfiles',
  count(*)::text || ' perfiles',
  'INFO'
from public.profiles

union all

select
  'Datos intactos: monedas totales',
  coalesce(sum(coins), 0)::text || ' monedas',
  'INFO'
from public.profiles;


-- ─────────────────────────────────────────────────────────────
-- E. OPCIONAL — cerrar la lectura anónima de perfiles
--
-- Hoy la política de SELECT es `using (...)` sin filtro de rol, así que
-- cualquiera con la anon key —que va dentro del binario de la app, o sea, es
-- pública— puede volcar la tabla entera de perfiles sin iniciar sesión:
-- nombres de usuario, monedas, XP y estadísticas de todo el mundo.
--
-- NO se aplica en este script porque hay que comprobar antes que no rompe el
-- modo invitado. Las pantallas que leen perfiles (Diario, Ligas, Amigos) están
-- detrás de GuestGate, así que en principio es seguro, pero conviene probarlo
-- en el dispositivo antes de dejarlo puesto.
--
-- Para activarlo, ejecuta esto por separado y prueba la app como invitado:
--
--   drop policy if exists "Active profiles viewable by all" on public.profiles;
--   create policy "Active profiles viewable by authenticated"
--     on public.profiles for select
--     to authenticated
--     using (coalesce(is_paused, false) = false or auth.uid() = id);
--
-- Y para deshacerlo:
--
--   drop policy if exists "Active profiles viewable by authenticated" on public.profiles;
--   create policy "Active profiles viewable by all"
--     on public.profiles for select
--     using (coalesce(is_paused, false) = false or auth.uid() = id);
-- ─────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────
-- ROLLBACK — deja la base como estaba antes de este script.
-- No borra datos tampoco.
--
--   begin;
--
--   grant insert, update on public.profiles to authenticated;
--
--   drop policy if exists "Users update own profile" on public.profiles;
--   create policy "Users update own profile" on public.profiles
--     for update using (auth.uid() = id);
--
--   alter table public.user_achievements
--     drop constraint if exists user_achievements_id_catalog_check;
--
--   create or replace function public.increment_profile_stats(
--     p_answered int, p_correct int, p_speed_record int default null
--   )
--   returns void language plpgsql security definer as $rb$
--   declare v_uid uuid := auth.uid();
--   begin
--     if v_uid is null then raise exception 'unauthorized'; end if;
--     if p_answered < 0 or p_correct < 0 or p_correct > p_answered then
--       raise exception 'invalid stats payload';
--     end if;
--     update public.profiles
--        set total_answered = coalesce(total_answered, 0) + p_answered,
--            total_correct  = coalesce(total_correct, 0) + p_correct,
--            speed_record   = case
--              when p_speed_record is not null and p_speed_record > coalesce(speed_record, 0)
--                then p_speed_record else speed_record end
--      where id = v_uid;
--   end;
--   $rb$;
--
--   commit;
-- ─────────────────────────────────────────────────────────────
