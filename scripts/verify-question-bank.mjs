const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!base || !key) throw new Error('Missing Supabase public environment variables');

async function fetchAll(table, select, filters = {}) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const url = new URL(`/rest/v1/${table}`, base);
    url.searchParams.set('select', select);
    url.searchParams.set('order', table === 'questions' ? 'id' : 'level,slot');
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', '1000');
    for (const [name, value] of Object.entries(filters)) url.searchParams.set(name, value);
    const response = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!response.ok) throw new Error(`${table}: ${await response.text()}`);
    const batch = await response.json();
    rows.push(...batch);
    if (batch.length < 1000) return rows;
  }
}

const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const stopwords = new Set('a al an and are as cual cuales como con de del did do does el en es esta este for fue how in is la las los of on por que se the to un una what which who y'.split(' '));
const tokenSet = value => new Set(normalize(value).split(' ').filter(token => token.length > 2 && !stopwords.has(token)));
const tokenSimilarity = (left, right) => {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (a.size < 4 || b.size < 4) return 0;
  const common = [...a].filter(token => b.has(token)).length;
  return common / new Set([...a, ...b]).size;
};
const questions = await fetchAll('questions', 'id,category,question,options,answer_index,context,difficulty,question_en,options_en,context_en', { active: 'eq.true' });
const assignments = await fetchAll('adventure_question_assignments', 'version,level,slot,question_id', { version: 'eq.1' });
const errors = [];

if (questions.length !== 2000) errors.push(`Expected 2000 active questions, found ${questions.length}`);
for (const language of ['question', 'question_en']) {
  const keys = questions.map(row => normalize(row[language] ?? ''));
  if (keys.some(key => !key)) errors.push(`Missing ${language}`);
  if (new Set(keys).size !== questions.length) errors.push(`Repeated ${language}`);
}
for (const row of questions) {
  if (!Array.isArray(row.options) || row.options.length !== 4) errors.push(`${row.id}: invalid Spanish options`);
  if (!Array.isArray(row.options_en) || row.options_en.length !== 4) errors.push(`${row.id}: invalid English options`);
  if (![0, 1, 2, 3].includes(row.answer_index)) errors.push(`${row.id}: invalid answer`);
  if (!row.context?.trim() || !row.context_en?.trim()) errors.push(`${row.id}: missing context`);
}

if (assignments.length !== 2000) errors.push(`Expected 2000 assignments, found ${assignments.length}`);
if (new Set(assignments.map(row => row.question_id)).size !== 2000) errors.push('Adventure repeats question IDs');
const activeIds = new Set(questions.map(row => row.id));
if (assignments.some(row => !activeIds.has(row.question_id))) errors.push('Adventure contains an inactive or missing question');
for (let level = 1; level <= 200; level++) {
  const levelRows = assignments.filter(row => row.level === level);
  if (levelRows.length !== 10 || new Set(levelRows.map(row => row.slot)).size !== 10) errors.push(`Level ${level} is incomplete`);
}

const categories = Object.fromEntries([...new Set(questions.map(row => row.category))]
  .sort()
  .map(category => [category, questions.filter(row => row.category === category).length]));
const nearDuplicateCandidates = [];
for (let left = 0; left < questions.length; left++) {
  for (let right = left + 1; right < questions.length; right++) {
    const score = Math.max(
      tokenSimilarity(questions[left].question, questions[right].question),
      tokenSimilarity(questions[left].question_en, questions[right].question_en),
    );
    if (score >= 0.8) nearDuplicateCandidates.push({
      score: Number(score.toFixed(2)),
      left: questions[left].question,
      right: questions[right].question,
    });
  }
}
nearDuplicateCandidates.sort((a, b) => b.score - a.score);
console.log(JSON.stringify({
  ok: errors.length === 0,
  activeQuestions: questions.length,
  bilingualQuestions: questions.filter(row => row.question_en && row.options_en?.length === 4 && row.context_en).length,
  adventureLevels: new Set(assignments.map(row => row.level)).size,
  adventureAssignments: assignments.length,
  uniqueAdventureQuestions: new Set(assignments.map(row => row.question_id)).size,
  categories,
  nearDuplicateCandidates,
  errors: errors.slice(0, 20),
}, null, 2));
if (errors.length > 0) process.exitCode = 1;
