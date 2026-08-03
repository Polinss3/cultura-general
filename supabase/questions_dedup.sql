-- ─────────────────────────────────────────────────────────────
-- Cultura General — Limpieza de preguntas duplicadas
--
-- QUÉ HACE:
--   1. Corrige una pregunta con una opción repetida.
--   2. Desactiva las preguntas duplicadas, dejando una viva de cada grupo.
--
-- QUÉ NO HACE: no borra ninguna fila. Se marca `active = false`, que es lo que
-- filtran todas las consultas del juego, así que la pregunta desaparece de la
-- app pero se conserva la fila. Esto NO es por prudencia decorativa:
-- `user_answers.question_id` y `daily_questions.question_id` apuntan a
-- `questions` SIN `on delete cascade`, de modo que un DELETE de una pregunta ya
-- respondida fallaría por clave foránea. Y aunque no fallara, borraría
-- historial de partidas de usuarios reales.
--
-- CRITERIO para elegir cuál se queda, en este orden:
--   1. La que haya salido como pregunta del día (jamás se desactiva, o se
--      rompería el histórico del diario).
--   2. La que más veces se haya respondido.
--   3. La más antigua.
--
-- Idempotente y transaccional. Al final imprime el recuento.
-- ─────────────────────────────────────────────────────────────

begin;

-- ─── 1. Opción repetida ──────────────────────────────────────
-- "¿Quién dirigió Taxi Driver?" tenía Coppola dos veces, así que solo ofrecía
-- tres respuestas distintas. La versión inglesa ya era correcta ("Cimino"),
-- de ahí el valor. `answer_index` = 0 (Scorsese) y no cambia.

update public.questions
   set options = '["Scorsese","Coppola","Pakula","Cimino"]'::jsonb
 where question = '¿Quién dirigió "Taxi Driver" (1976)?'
   and options = '["Scorsese","Coppola","Pakula","Coppola"]'::jsonb;


-- ─── 2. Duplicados por enunciado español ─────────────────────

with ranked as (
  select
    q.id,
    row_number() over (
      partition by lower(btrim(q.question))
      order by
        exists (select 1 from public.daily_questions dq where dq.question_id = q.id) desc,
        (select count(*) from public.user_answers ua where ua.question_id = q.id) desc,
        q.created_at asc,
        q.id asc
    ) as rn
  from public.questions q
  where q.active = true
)
update public.questions
   set active = false
 where id in (select id from ranked where rn > 1);


-- ─── 3. Duplicados por enunciado inglés ──────────────────────
-- Hay pares cuyo español difiere pero cuya traducción coincide (p. ej.
-- «El Quijote» y «Don Quijote de la Mancha»): misma pregunta, dos filas. Se
-- pasa después del bloque 2 y solo sobre lo que sigue activo.

with ranked as (
  select
    q.id,
    row_number() over (
      partition by lower(btrim(q.question_en))
      order by
        exists (select 1 from public.daily_questions dq where dq.question_id = q.id) desc,
        (select count(*) from public.user_answers ua where ua.question_id = q.id) desc,
        q.created_at asc,
        q.id asc
    ) as rn
  from public.questions q
  where q.active = true
    and q.question_en is not null
    and btrim(q.question_en) <> ''
)
update public.questions
   set active = false
 where id in (select id from ranked where rn > 1);


commit;


-- ─────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ─────────────────────────────────────────────────────────────

select 'preguntas activas'            as metrica, count(*)::text as valor from public.questions where active = true
union all
select 'preguntas desactivadas',      count(*)::text from public.questions where active = false
union all
select 'duplicados ES restantes',     count(*)::text from (
  select 1 from public.questions where active = true
  group by lower(btrim(question)) having count(*) > 1
) s
union all
select 'duplicados EN restantes',     count(*)::text from (
  select 1 from public.questions
  where active = true and question_en is not null and btrim(question_en) <> ''
  group by lower(btrim(question_en)) having count(*) > 1
) s
union all
select 'con opciones repetidas',      count(*)::text from public.questions q
  where q.active = true
    and (select count(distinct lower(btrim(o::text))) from jsonb_array_elements_text(q.options) o)
      <> jsonb_array_length(q.options)
union all
select 'filas borradas',              '0 (este script no borra nada)';

-- Reparto por categoría después de la limpieza:
select category, count(*) as activas
  from public.questions where active = true
 group by category order by activas desc;


-- ─────────────────────────────────────────────────────────────
-- ROLLBACK — reactiva lo desactivado por este script.
-- Comprobado el 2026-08-03 antes de ejecutar: había 1619 preguntas activas y
-- CERO desactivadas, así que reactivar todas las inactivas deshace exactamente
-- este script y nada más. Si en el futuro se desactivan preguntas a mano, esta
-- premisa deja de valer.
--
--   update public.questions set active = true where active = false;
--   update public.questions
--      set options = '["Scorsese","Coppola","Pakula","Coppola"]'::jsonb
--    where question = '¿Quién dirigió "Taxi Driver" (1976)?';
-- ─────────────────────────────────────────────────────────────
