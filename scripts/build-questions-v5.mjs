import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ADDITIONAL, OVERRIDES } from './questions-v5-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const es = JSON.parse(fs.readFileSync(path.join(root, 'translations/questions.es.json'), 'utf8'));

const RECOVER = {
  deportes: Array.from({ length: 50 }, (_, i) => i),
  biologia: Array.from({ length: 50 }, (_, i) => i).filter(i => ![7, 28].includes(i)),
  cine: Array.from({ length: 50 }, (_, i) => i).filter(i => i !== 31),
  musica: Array.from({ length: 50 }, (_, i) => i).filter(i => i !== 12),
  literatura: Array.from({ length: 50 }, (_, i) => i).filter(i => i !== 10),
  tecnologia: Array.from({ length: 50 }, (_, i) => i),
  mitologia: Array.from({ length: 50 }, (_, i) => i),
  astronomia: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
};

const normalize = value => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const rows = [];
for (const [category, indexes] of Object.entries(RECOVER)) {
  const en = JSON.parse(fs.readFileSync(path.join(root, `translations/en/${category}.json`), 'utf8'));
  const enByIndex = new Map(en.map(item => [item.i, item]));

  for (const index of indexes) {
    const source = es.categories[category]?.find(item => item.i === index);
    const translation = enByIndex.get(index);
    if (!source || !translation) throw new Error(`Missing source or translation for ${category}:${index}`);
    rows.push({
      category,
      question: source.question,
      options: source.options,
      answer_index: source.answer_index,
      context: source.context,
      difficulty: source.difficulty,
      question_en: translation.question_en,
      options_en: translation.options_en,
      context_en: translation.context_en,
      ...OVERRIDES[`${category}:${index}`],
      source: `${category}:${index}`,
    });
  }
}
rows.push(...ADDITIONAL.map((row, index) => ({ ...row, source: `new:${index + 1}` })));

const allowedCategories = new Set([
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes',
  'biologia', 'cine', 'musica', 'literatura', 'tecnologia', 'mitologia', 'astronomia',
]);
const allowedDifficulty = new Set(['easy', 'medium', 'hard']);

if (rows.length !== 411) throw new Error(`Expected 411 questions, got ${rows.length}`);
for (const row of rows) {
  if (!allowedCategories.has(row.category)) throw new Error(`${row.source}: invalid category`);
  if (!allowedDifficulty.has(row.difficulty)) throw new Error(`${row.source}: invalid difficulty`);
  if (![row.question, row.context, row.question_en, row.context_en].every(v => typeof v === 'string' && v.trim())) {
    throw new Error(`${row.source}: incomplete bilingual text`);
  }
  if (!Number.isInteger(row.answer_index) || row.answer_index < 0 || row.answer_index > 3) {
    throw new Error(`${row.source}: invalid answer index`);
  }
  for (const key of ['options', 'options_en']) {
    const options = row[key];
    if (!Array.isArray(options) || options.length !== 4 || options.some(v => typeof v !== 'string' || !v.trim())) {
      throw new Error(`${row.source}: ${key} must contain four non-empty options`);
    }
    if (new Set(options.map(value => value.toLocaleLowerCase().trim())).size !== 4) {
      throw new Error(`${row.source}: repeated ${key}`);
    }
  }
}

for (const languageKey of ['question', 'question_en']) {
  const seen = new Map();
  for (const row of rows) {
    const key = normalize(row[languageKey]);
    if (seen.has(key)) throw new Error(`${languageKey} duplicate: ${seen.get(key)} / ${row.source}`);
    seen.set(key, row.source);
  }
}

const cleanRows = rows.map(({ source, ...row }) => row);
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/questions-v5-2000.json'), `${JSON.stringify(cleanRows, null, 2)}\n`);

const sqlString = value => `'${String(value).replaceAll("'", "''")}'`;
const sqlJson = value => `${sqlString(JSON.stringify(value))}::jsonb`;
const values = cleanRows.map(row => `  (${[
  sqlString(row.category), sqlString(row.question), sqlJson(row.options), row.answer_index,
  sqlString(row.context), sqlString(row.difficulty), sqlString(row.question_en),
  sqlJson(row.options_en), sqlString(row.context_en),
].join(', ')})`).join(',\n');

const sql = `-- Generado por scripts/build-questions-v5.mjs. No editar a mano.
-- Lleva el banco activo de 1.589 a 2.000 preguntas bilingües y congela
-- una asignación única de 10 preguntas para cada uno de los 200 niveles.
begin;

create temp table questions_v5_seed (
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

insert into questions_v5_seed
  (category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)
values
${values};

do $$
declare
  current_active int;
  seed_conflicts int;
begin
  select count(*) into current_active from public.questions where active = true;
  if current_active not in (1589, 2000) then
    raise exception 'Expected 1589 questions before first run or 2000 on rerun; found %', current_active;
  end if;

  select count(*) into seed_conflicts
  from questions_v5_seed seed
  where exists (
    select 1 from public.questions q
    where q.active = true and (
      lower(btrim(q.question)) = lower(btrim(seed.question)) or
      lower(btrim(coalesce(q.question_en, ''))) = lower(btrim(seed.question_en))
    )
  );
  if (current_active = 1589 and seed_conflicts <> 0) or (current_active = 2000 and seed_conflicts <> 411) then
    raise exception 'Unexpected duplicate state: % seed questions already active', seed_conflicts;
  end if;
end $$;

insert into public.questions
  (category, question, options, answer_index, context, difficulty, question_en, options_en, context_en, active)
select category, question, options, answer_index, context, difficulty, question_en, options_en, context_en, true
from questions_v5_seed seed
where not exists (
  select 1 from public.questions q
  where q.active = true and (
    lower(btrim(q.question)) = lower(btrim(seed.question)) or
    lower(btrim(coalesce(q.question_en, ''))) = lower(btrim(seed.question_en))
  )
);

do $$
declare final_active int;
begin
  select count(*) into final_active from public.questions where active = true;
  if final_active <> 2000 then
    raise exception 'Migration aborted: expected 2000 active questions, found %', final_active;
  end if;
end $$;

create table if not exists public.adventure_question_assignments (
  version int not null,
  level int not null check (level between 1 and 200),
  slot int not null check (slot between 1 and 10),
  question_id uuid not null references public.questions(id),
  primary key (version, level, slot),
  unique (version, question_id)
);

alter table public.adventure_question_assignments enable row level security;
drop policy if exists "Adventure assignments readable by all" on public.adventure_question_assignments;
create policy "Adventure assignments readable by all"
  on public.adventure_question_assignments for select using (true);

delete from public.adventure_question_assignments where version = 1;
with ordered as (
  select id, row_number() over (order by md5(id::text || ':adventure-v1')) as position
  from public.questions
  where active = true
)
insert into public.adventure_question_assignments (version, level, slot, question_id)
select 1, ((position - 1) / 10 + 1)::int, ((position - 1) % 10 + 1)::int, id
from ordered;

do $$
declare assigned int;
begin
  select count(*) into assigned from public.adventure_question_assignments where version = 1;
  if assigned <> 2000 then
    raise exception 'Migration aborted: expected 2000 adventure assignments, found %', assigned;
  end if;
end $$;

commit;
`;
const migrationDir = path.join(root, 'supabase/migrations');
fs.mkdirSync(migrationDir, { recursive: true });
fs.writeFileSync(path.join(migrationDir, '20260828020000_questions_v5_2000.sql'), sql);

const counts = Object.fromEntries([...allowedCategories].map(category => [
  category,
  cleanRows.filter(row => row.category === category).length,
]).filter(([, count]) => count > 0));
console.log(JSON.stringify({ total: cleanRows.length, counts }, null, 2));
