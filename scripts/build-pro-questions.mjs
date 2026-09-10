import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = path.join(root, 'data/questions-pro-v1-2000.json');
const outputPath = path.join(root, 'supabase/pro_questions_seed_v1.sql');

if (!fs.existsSync(inputPath)) {
  throw new Error(
    'Falta data/questions-pro-v1-2000.json. ' +
    'Añade las 2.000 preguntas revisadas antes de generar el SQL de rollout.',
  );
}

const rows = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const categories = new Set([
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes',
  'biologia', 'cine', 'musica', 'literatura', 'tecnologia', 'mitologia', 'astronomia',
]);
const difficulties = new Set(['easy', 'medium', 'hard']);
const normalize = value => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

if (!Array.isArray(rows) || rows.length !== 2000) {
  throw new Error(`Se esperaban 2.000 preguntas PRO; recibidas: ${rows?.length ?? 'formato inválido'}`);
}

for (const [index, row] of rows.entries()) {
  const label = `Pregunta PRO ${index + 1}`;
  if (!categories.has(row.category)) throw new Error(`${label}: categoría inválida`);
  if (!difficulties.has(row.difficulty)) throw new Error(`${label}: dificultad inválida`);
  if (![row.question, row.context, row.question_en, row.context_en]
    .every(value => typeof value === 'string' && value.trim())) {
    throw new Error(`${label}: texto bilingüe incompleto`);
  }
  if (!Number.isInteger(row.answer_index) || row.answer_index < 0 || row.answer_index > 3) {
    throw new Error(`${label}: answer_index inválido`);
  }
  for (const key of ['options', 'options_en']) {
    const options = row[key];
    if (!Array.isArray(options) || options.length !== 4 ||
        options.some(value => typeof value !== 'string' || !value.trim()) ||
        new Set(options.map(normalize)).size !== 4) {
      throw new Error(`${label}: ${key} debe contener cuatro opciones distintas`);
    }
  }
}

for (const key of ['question', 'question_en']) {
  const normalized = rows.map(row => normalize(row[key]));
  if (new Set(normalized).size !== rows.length) {
    throw new Error(`El catálogo PRO contiene preguntas duplicadas en ${key}`);
  }
}

// Un duplicado del banco gratuito tampoco aporta valor PRO. Esta comprobación
// exacta-normalizada es automática; la revisión semántica sigue siendo humana.
const corePath = path.join(root, 'data/questions-v5-2000.json');
if (!fs.existsSync(corePath)) throw new Error('Falta el catálogo core de referencia');
const coreRows = JSON.parse(fs.readFileSync(corePath, 'utf8'));
for (const key of ['question', 'question_en']) {
  const coreQuestions = new Set(coreRows.map(row => normalize(row[key])));
  const duplicateIndex = rows.findIndex(row => coreQuestions.has(normalize(row[key])));
  if (duplicateIndex >= 0) {
    throw new Error(`Pregunta PRO ${duplicateIndex + 1}: ya existe en el catálogo core (${key})`);
  }
}

// El manifiesto distribuye cada dificultad progresivamente. Reproducimos aquí
// su aritmética para impedir que un catálogo muy desequilibrado genere un nivel
// con más de diez objetivos o con una cantidad negativa de preguntas medias.
const difficultyTotals = Object.fromEntries(
  [...difficulties].map(difficulty => [
    difficulty,
    rows.filter(row => row.difficulty === difficulty).length,
  ]),
);
let previousEasy = 0;
let previousHard = 0;
for (let localLevel = 1; localLevel <= 200; localLevel += 1) {
  const easyCumulative = Math.floor(
    difficultyTotals.easy * (localLevel * (401 - localLevel) / 2) / 20100,
  );
  const hardCumulative = Math.floor(
    difficultyTotals.hard * (localLevel * (localLevel + 1) / 2 + 54 * localLevel) / 30900,
  );
  const easyCount = easyCumulative - previousEasy;
  const hardCount = hardCumulative - previousHard;
  if (easyCount < 0 || hardCount < 0 || easyCount + hardCount > 10) {
    throw new Error(
      `Distribución de dificultad inválida para el nivel ${localLevel + 200}: ` +
      `${easyCount} easy + ${hardCount} hard`,
    );
  }
  previousEasy = easyCumulative;
  previousHard = hardCumulative;
}

const sqlString = value => `'${String(value).replaceAll("'", "''")}'`;
const sqlJson = value => `${sqlString(JSON.stringify(value))}::jsonb`;
const values = rows.map(row => `  (${[
  sqlString(row.category), sqlString(row.question), sqlJson(row.options), row.answer_index,
  sqlString(row.context), sqlString(row.difficulty), sqlString(row.question_en),
  sqlJson(row.options_en), sqlString(row.context_en),
].join(', ')})`).join(',\n');

const sql = `-- Generado por scripts/build-pro-questions.mjs. No editar a mano.
-- ⚠️ Ejecutar DESPUÉS de supabase/pro_question_catalog_v1.sql y únicamente
-- durante el rollout de la 2.2.0. No pertenece a supabase/migrations.
begin;

create temp table pro_questions_seed (
  category text not null,
  question text not null,
  options jsonb not null,
  answer_index int not null,
  context text not null,
  difficulty text not null,
  question_en text not null,
  options_en jsonb not null,
  context_en text not null
) on commit drop;

insert into pro_questions_seed
  (category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)
values
${values};

insert into public.pro_questions
  (category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)
select category, question, options, answer_index, context, difficulty, question_en, options_en, context_en
from pro_questions_seed
on conflict do nothing;

do $$
declare v_count int;
begin
  select count(*) into v_count from public.pro_questions where active = true;
  if v_count <> 2000 then
    raise exception 'Expected 2000 active PRO questions, found %', v_count;
  end if;
end $$;

delete from public.pro_adventure_question_assignments where version = 1;
with difficulty_totals as (
  select
    count(*) filter (where difficulty = 'easy')::int as easy_total,
    count(*) filter (where difficulty = 'medium')::int as medium_total,
    count(*) filter (where difficulty = 'hard')::int as hard_total
  from public.pro_questions where active = true
), cumulative_plan as (
  select
    local_level,
    floor(easy_total * (local_level * (401 - local_level) / 2.0) / 20100.0)::int as easy_cumulative,
    floor(hard_total * (local_level * (local_level + 1) / 2.0 + 54 * local_level) / 30900.0)::int as hard_cumulative
  from generate_series(1, 200) levels(local_level)
  cross join difficulty_totals
), level_plan as (
  select
    local_level,
    easy_cumulative - lag(easy_cumulative, 1, 0) over (order by local_level) as easy_count,
    hard_cumulative - lag(hard_cumulative, 1, 0) over (order by local_level) as hard_count
  from cumulative_plan
), targets as (
  select local_level, 'easy'::text as difficulty, ordinal
  from level_plan cross join lateral generate_series(1, easy_count) ordinal
  union all
  select local_level, 'medium'::text, ordinal
  from level_plan cross join lateral generate_series(1, 10 - easy_count - hard_count) ordinal
  union all
  select local_level, 'hard'::text, ordinal
  from level_plan cross join lateral generate_series(1, hard_count) ordinal
), ranked_targets as (
  select local_level, difficulty, ordinal,
    row_number() over (partition by difficulty order by local_level, ordinal) as difficulty_position
  from targets
), ranked_questions as (
  select id, difficulty,
    row_number() over (
      partition by difficulty order by md5(lower(btrim(question)) || ':adventure-pro-v1'), id
    ) as difficulty_position
  from public.pro_questions where active = true
), placed as (
  select
    target.local_level + 200 as level,
    question.id as question_id,
    row_number() over (
      partition by target.local_level
      order by md5(target.local_level::text || ':' || target.difficulty || ':' || target.ordinal::text || ':pro-slot')
    )::int as slot
  from ranked_targets target
  join ranked_questions question using (difficulty, difficulty_position)
)
insert into public.pro_adventure_question_assignments (version, level, slot, question_id)
select 1, level, slot, question_id from placed;

do $$
declare v_assigned int; v_unique int;
begin
  select count(*), count(distinct question_id) into v_assigned, v_unique
  from public.pro_adventure_question_assignments where version = 1;
  if v_assigned <> 2000 or v_unique <> 2000 then
    raise exception 'Invalid PRO adventure manifest: % assignments, % unique', v_assigned, v_unique;
  end if;
end $$;

commit;
`;

fs.writeFileSync(outputPath, sql);
console.log(JSON.stringify({
  ok: true,
  questions: rows.length,
  output: path.relative(root, outputPath),
  categories: Object.fromEntries([...categories].map(category => [
    category, rows.filter(row => row.category === category).length,
  ])),
}, null, 2));
