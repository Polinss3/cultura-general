-- ─────────────────────────────────────────────────────────────
-- Cultura General — añadir detalles al ranking diario
-- (acertado/fallado + tiempo de respuesta)
-- Idempotente, re-ejecutable.
-- ─────────────────────────────────────────────────────────────

alter table public.daily_rankings
  add column if not exists is_correct boolean,
  add column if not exists time_ms    int;

-- Backfill de filas existentes: deducir is_correct a partir de score.
update public.daily_rankings
   set is_correct = (score > 0)
 where is_correct is null;

-- Index para ordenar el ranking del día sin escaneo completo.
create index if not exists daily_rankings_date_score_time_idx
  on public.daily_rankings (date, score desc, time_ms asc nulls last);
