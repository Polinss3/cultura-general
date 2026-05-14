-- ─────────────────────────────────────────────────────────────
-- Migración: ampliar las categorías permitidas en public.questions
-- Añade: deportes, biologia, cine, musica, literatura, tecnologia,
--        mitologia, astronomia.
-- Idempotente: se puede ejecutar varias veces sin error.
-- Ejecutar ANTES de cargar preguntas de las nuevas categorías
-- (questions_v3_nuevas_categorias.sql).
-- ─────────────────────────────────────────────────────────────

alter table public.questions
  drop constraint if exists questions_category_check;

alter table public.questions
  add constraint questions_category_check
  check (category in (
    'historia', 'geografia', 'ciencia', 'arte', 'filosofia',
    'deportes', 'biologia', 'cine', 'musica', 'literatura',
    'tecnologia', 'mitologia', 'astronomia'
  ));
