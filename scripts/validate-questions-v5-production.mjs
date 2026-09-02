import fs from 'node:fs';

const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!base || !key) throw new Error('Missing Supabase public environment variables');

const seed = JSON.parse(fs.readFileSync('data/questions-v5-2000.json', 'utf8'));
const normalize = value => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const active = [];
for (let offset = 0; ; offset += 1000) {
  const url = new URL('/rest/v1/questions', base);
  url.searchParams.set('select', 'id,category,question,question_en,active');
  url.searchParams.set('active', 'eq.true');
  url.searchParams.set('order', 'id');
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', '1000');
  const response = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(await response.text());
  const batch = await response.json();
  active.push(...batch);
  if (batch.length < 1000) break;
}

const spanish = new Map(active.map(row => [normalize(row.question), row]));
const english = new Map(active.filter(row => row.question_en).map(row => [normalize(row.question_en), row]));
const conflicts = seed.flatMap(row => {
  const es = spanish.get(normalize(row.question));
  const en = english.get(normalize(row.question_en));
  return es || en ? [{ candidate: row.question, existingEs: es?.question, existingEn: en?.question_en }] : [];
});

const stopwords = new Set('a al an and are as cual cuáles como con de del did do does el en es esta este for fue how in is la las los of on por que qué se the to un una what which who y'.split(' '));
const tokens = value => new Set(normalize(value).split(' ').filter(token => token.length > 2 && !stopwords.has(token)));
const similarity = (left, right) => {
  const a = tokens(left);
  const b = tokens(right);
  if (a.size < 3 || b.size < 3) return 0;
  const intersection = [...a].filter(token => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
};
const possibleSemanticDuplicates = [];
for (const candidate of seed) {
  for (const existing of active) {
    const scoreEs = similarity(candidate.question, existing.question);
    const scoreEn = existing.question_en ? similarity(candidate.question_en, existing.question_en) : 0;
    const score = Math.max(scoreEs, scoreEn);
    if (score >= 0.67) {
      possibleSemanticDuplicates.push({ score: Number(score.toFixed(2)), candidate: candidate.question, existing: existing.question });
    }
  }
}
possibleSemanticDuplicates.sort((a, b) => b.score - a.score);

const quotedTerms = value => [...value.matchAll(/[“”«»"]([^“”«»"]{4,})[“”«»"]/g)].map(match => normalize(match[1]));
const sharedQuotedSubjects = [];
for (const candidate of seed) {
  const subjects = quotedTerms(candidate.question);
  if (subjects.length === 0) continue;
  for (const existing of active) {
    const existingText = normalize(existing.question);
    const subject = subjects.find(value => existingText.includes(value));
    if (subject) sharedQuotedSubjects.push({ subject, candidate: candidate.question, existing: existing.question });
  }
}

console.log(JSON.stringify({
  active: active.length,
  seed: seed.length,
  exactConflicts: conflicts.length,
  conflicts,
  possibleSemanticDuplicates: possibleSemanticDuplicates.slice(0, 50),
  sharedQuotedSubjects,
}, null, 2));
if (active.length === 1589 && conflicts.length > 0) process.exitCode = 1;
