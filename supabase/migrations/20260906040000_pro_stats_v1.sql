-- Estadísticas avanzadas (CG PRO).
-- Aditiva e idempotente: solo añade una función de lectura.
begin;

-- Índice que sostiene los recuentos por semana y por dificultad. Sin él, un
-- usuario con mucho historial paga un seq scan cada vez que abre la pantalla.
create index if not exists user_answers_user_answered_idx
  on public.user_answers (user_id, answered_at desc);

-- Todo el panel en una sola llamada.
--
-- Va en un único RPC y no en cinco consultas desde el cliente porque la
-- comparativa global necesita leer filas de otros usuarios, y eso no puede
-- salir por PostgREST con las políticas actuales: aquí se devuelve agregado,
-- que es lo único que la pantalla enseña.
create or replace function public.fetch_pro_stats()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $stats$
declare
  v_uid uuid := auth.uid();
  v_by_difficulty jsonb;
  v_weekly jsonb;
  v_exams jsonb;
  v_mine numeric;
  v_global numeric;
begin
  if v_uid is null then raise exception 'unauthorized'; end if;
  if not public.is_premium(v_uid) then raise exception 'premium required'; end if;

  -- Precisión por dificultad.
  select coalesce(jsonb_agg(row order by row->>'difficulty'), '[]'::jsonb)
  into v_by_difficulty
  from (
    select jsonb_build_object(
      'difficulty', coalesce(q.difficulty, 'medium'),
      'answered', count(*),
      'correct', count(*) filter (where a.is_correct)
    ) as row
    from public.user_answers a
    join public.questions q on q.id = a.question_id
    where a.user_id = v_uid
    group by coalesce(q.difficulty, 'medium')
  ) d;

  -- Últimas doce semanas de actividad: es la "evolución en el tiempo" sin
  -- necesidad de snapshots, porque user_answers ya guarda answered_at.
  select coalesce(jsonb_agg(row order by row->>'week'), '[]'::jsonb)
  into v_weekly
  from (
    select jsonb_build_object(
      'week', to_char(date_trunc('week', a.answered_at), 'YYYY-MM-DD'),
      'answered', count(*),
      'correct', count(*) filter (where a.is_correct)
    ) as row
    from public.user_answers a
    where a.user_id = v_uid
      and a.answered_at >= now() - interval '12 weeks'
    group by date_trunc('week', a.answered_at)
  ) w;

  -- Historial de exámenes (la tabla puede no existir aún si esa migración no
  -- se ha aplicado; se resuelve con to_regclass en vez de reventar el panel).
  if to_regclass('public.exam_results') is not null then
    select coalesce(jsonb_agg(row order by row->>'createdAt' desc), '[]'::jsonb)
    into v_exams
    from (
      select jsonb_build_object(
        'grade', grade,
        'correct', correct,
        'total', total,
        'createdAt', created_at
      ) as row
      from public.exam_results
      where user_id = v_uid
      order by created_at desc
      limit 10
    ) e;
  else
    v_exams := '[]'::jsonb;
  end if;

  -- Comparativa: mi precisión frente a la media de quienes han respondido lo
  -- bastante como para que su porcentaje signifique algo.
  select case when coalesce(total_answered, 0) > 0
    then round((total_correct::numeric / total_answered) * 100, 1)
    else null end
  into v_mine
  from public.profiles where id = v_uid;

  select round(avg((total_correct::numeric / total_answered) * 100), 1)
  into v_global
  from public.profiles
  where coalesce(total_answered, 0) >= 50;

  return jsonb_build_object(
    'byDifficulty', v_by_difficulty,
    'weekly', v_weekly,
    'exams', v_exams,
    'accuracy', jsonb_build_object('mine', v_mine, 'global', v_global)
  );
end;
$stats$;

grant execute on function public.fetch_pro_stats() to authenticated;

commit;
