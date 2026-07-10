#!/usr/bin/env node
// Extrae las preguntas de los 4 seeds SQL a translations/questions.es.json.
// Parser char-level (no regex por líneas): tolera tuplas multilínea,
// comentarios `-- ...`, y comillas escapadas ''.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEEDS = [
  'supabase/questions.sql',
  'supabase/questions2.sql',
  'supabase/questions_v3_nuevas_categorias.sql',
  'supabase/questions_v4_completar_150.sql',
];
const CATEGORIES = new Set([
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes',
  'biologia', 'cine', 'musica', 'literatura', 'tecnologia', 'mitologia', 'astronomia',
]);

// Parsea las tuplas de un statement `insert ... values` empezando en `start`.
function parseTuples(sql, start) {
  const tuples = [];
  let i = start, depth = 0, inStr = false;
  let fieldStr = '', fieldRaw = '', fieldIsString = false, fields = [];

  const pushField = () => {
    if (fieldIsString) fields.push({ v: fieldStr, s: true });
    else {
      const raw = fieldRaw.trim();
      if (raw === '') return; // separador espurio
      if (raw.toUpperCase() === 'NULL') fields.push({ v: null, s: false });
      else fields.push({ v: raw, s: false });
    }
    fieldStr = ''; fieldRaw = ''; fieldIsString = false;
  };

  for (; i < sql.length; i++) {
    const c = sql[i], n = sql[i + 1];
    if (inStr) {
      if (c === "'") {
        if (n === "'") { fieldStr += "'"; i++; }
        else inStr = false;
      } else fieldStr += c;
      continue;
    }
    if (c === '-' && n === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === "'") { inStr = true; fieldIsString = true; continue; }
    if (c === '(') { depth++; if (depth === 1) { fields = []; fieldStr = ''; fieldRaw = ''; fieldIsString = false; } continue; }
    if (c === ')') {
      if (depth === 1) { pushField(); tuples.push(fields); }
      depth--; continue;
    }
    if (c === ',' && depth === 1) { pushField(); continue; }
    if (c === ';' && depth === 0) break;
    if (depth === 1 && !fieldIsString) fieldRaw += c;
  }
  return { tuples, end: i };
}

const byCategory = {};
for (const c of CATEGORIES) byCategory[c] = [];
const seen = new Map();       // `${cat}|||${q}` -> primer registro
const collisions = [];
let total = 0, malformed = 0;

for (const rel of SEEDS) {
  const file = path.join(root, rel);
  const sql = fs.readFileSync(file, 'utf8');
  const re = /insert\s+into\s+public\.questions\s*\([^)]*\)\s*values/gi;
  let m;
  while ((m = re.exec(sql))) {
    const { tuples, end } = parseTuples(sql, re.lastIndex);
    re.lastIndex = end;
    for (const f of tuples) {
      if (f.length < 6) { malformed++; continue; }
      const [cat, q, opts, ans, ctx, diff] = f;
      if (!cat.s || !CATEGORIES.has(cat.v)) { malformed++; continue; }
      let options;
      try { options = JSON.parse(opts.v); } catch { malformed++; continue; }
      if (!Array.isArray(options) || options.length !== 4) { malformed++; continue; }
      const answer_index = Number(ans.v);
      if (!Number.isInteger(answer_index) || answer_index < 0 || answer_index > 3) { malformed++; continue; }
      const record = {
        question: q.v,
        options,
        answer_index,
        context: ctx.s ? ctx.v : (ctx.v === null ? null : ctx.v),
        difficulty: diff.s ? diff.v : diff.v,
        category: cat.v,
      };
      total++;
      const key = `${cat.v}|||${q.v}`;
      const prev = seen.get(key);
      if (prev) {
        const same = JSON.stringify(prev.options) === JSON.stringify(options) &&
          prev.answer_index === answer_index && (prev.context ?? '') === (record.context ?? '');
        if (!same) collisions.push({ category: cat.v, question: q.v });
        continue; // duplicado: no lo añadimos otra vez
      }
      seen.set(key, record);
      byCategory[cat.v].push(record);
    }
  }
}

// Numera por categoría (orden de carga = orden de traducción).
const categories = {};
let unique = 0;
for (const c of CATEGORIES) {
  categories[c] = byCategory[c].map((r, i) => ({
    i,
    question: r.question,
    options: r.options,
    answer_index: r.answer_index,
    context: r.context,
    difficulty: r.difficulty,
  }));
  unique += categories[c].length;
}

const out = { count: unique, totalRows: total, malformed, collisions, categories };
const outDir = path.join(root, 'translations');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'questions.es.json'), JSON.stringify(out, null, 2));

console.log(`Filas parseadas: ${total} · únicas: ${unique} · malformadas: ${malformed} · colisiones: ${collisions.length}`);
for (const c of CATEGORIES) console.log(`  ${c}: ${categories[c].length}`);
if (collisions.length) console.log('Colisiones (excluir de traducción por texto):', collisions.slice(0, 10));
console.log(`\n→ translations/questions.es.json`);
