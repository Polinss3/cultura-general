// Saca del banco de preguntas las que se responden con un año, emparejadas con
// su traducción de questions_en.sql. Es la materia prima del catálogo del modo
// Años: la salida se cura a mano y se pega en la tabla de build-years.mjs.
//
// NO se ejecuta en cada build. Pásalo cuando el banco crezca, para ver qué
// eventos nuevos hay que incorporar.
//
// Uso:  node scripts/mine-year-questions.mjs
//       → imprime el reparto por época/categoría y escribe mined.json al lado.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ES_FILES = [
  'questions.sql', 'questions2.sql',
  'questions_v3_nuevas_categorias.sql', 'questions_v4_completar_150.sql',
];

// ─── Parser de tuplas SQL ────────────────────────────────────────────────────
// ('cat', 'texto', '["a","b"]', 2, 'ctx', 'easy'),  con '' como escape.
function parseTuples(sql) {
  // Un fichero puede traer VARIOS insert (v4 los reparte en lotes).
  const rows = [];
  const insertRe = /insert into public\.questions[^;]*?values/gi;
  let stmt;
  while ((stmt = insertRe.exec(sql)) !== null) {
    rows.push(...parseOneInsert(sql, stmt.index + stmt[0].length));
  }
  return rows;
}

function parseOneInsert(sql, from) {
  let i = from;
  const rows = [];
  let depth = 0, inStr = false, cur = '';

  while (i < sql.length) {
    const ch = sql[i];
    if (inStr) {
      if (ch === "'" && sql[i + 1] === "'") { cur += "''"; i += 2; continue; }
      if (ch === "'") { inStr = false; cur += ch; i++; continue; }
      cur += ch; i++; continue;
    }
    if (ch === "'") { inStr = true; cur += ch; i++; continue; }
    if (ch === '(') { depth++; if (depth === 1) { cur = ''; i++; continue; } }
    if (ch === ')') {
      depth--;
      if (depth === 0) { rows.push(cur); cur = ''; i++; continue; }
    }
    if (depth === 0 && ch === ';') break;
    if (depth > 0) cur += ch;
    i++;
  }
  return rows;
}

function splitFields(tuple) {
  const out = [];
  let inStr = false, cur = '', depth = 0;
  for (let i = 0; i < tuple.length; i++) {
    const ch = tuple[i];
    if (inStr) {
      if (ch === "'" && tuple[i + 1] === "'") { cur += "'"; i++; continue; }
      if (ch === "'") { inStr = false; continue; }
      cur += ch; continue;
    }
    if (ch === "'") { inStr = true; continue; }
    if (ch === '[') depth++;
    if (ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// ─── ES ──────────────────────────────────────────────────────────────────────
const esRows = [];
for (const f of ES_FILES) {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase', f), 'utf8');
  for (const tuple of parseTuples(sql)) {
    const fields = splitFields(tuple);
    if (fields.length < 5) continue;
    const [category, question, optionsRaw, ansRaw, context, difficulty] = fields;
    let options;
    try { options = JSON.parse(optionsRaw); } catch { continue; }
    if (!Array.isArray(options)) continue;
    esRows.push({
      file: f, category, question, options,
      ans: Number(ansRaw), context: context ?? '', difficulty: difficulty ?? '',
    });
  }
}

// ─── EN ──────────────────────────────────────────────────────────────────────
const enSql = fs.readFileSync(path.join(ROOT, 'supabase/questions_en.sql'), 'utf8');
const enMap = new Map();
const blockRe = /update public\.questions set\s+question_en\s*=\s*\$t\$([\s\S]*?)\$t\$,\s*options_en\s*=\s*\$t\$([\s\S]*?)\$t\$::jsonb,\s*context_en\s*=\s*\$t\$([\s\S]*?)\$t\$\s*where category = '([^']+)' and question = \$q\$([\s\S]*?)\$q\$;/g;
let m;
while ((m = blockRe.exec(enSql)) !== null) {
  const [, qEn, optsEn, ctxEn, cat, qEs] = m;
  let options;
  try { options = JSON.parse(optsEn); } catch { options = null; }
  enMap.set(cat + '␟' + qEs, { qEn, options, ctxEn });
}

// ─── Filtro: respuesta = año ─────────────────────────────────────────────────
const YEAR_RE = /^\s*(-?\d{1,4})\s*(a\.?\s?C\.?|d\.?\s?C\.?)?\s*$/i;

function parseYear(s) {
  const mm = String(s).match(YEAR_RE);
  if (!mm) return null;
  const n = Number(mm[1]);
  const bc = mm[2] && /a/i.test(mm[2]);
  return bc ? -n : n;
}

// "¿Cuántos jugadores tiene un equipo?" con opciones ["9","10","11","12"] parsea
// como años perfectamente válidos. Hace falta que la PREGUNTA sea de fecha.
// Con la precondición de que las 4 opciones ya parsean como años, basta con que
// el enunciado pregunte por una fecha.
const ASKS_YEAR = /\baño\b|\bcuándo\b|\bsiglo\b|\bfecha\b/i;

// "¿Cuántos/Cuántas X?" nunca es una pregunta de fecha, por mucho que las
// opciones parezcan años.
const ASKS_COUNT = /cuánt[oa]s/i;

const mined = [];
const rejected = [];
for (const r of esRows) {
  const years = r.options.map(parseYear);
  if (years.some(y => y === null)) continue;       // las 4 opciones deben ser años
  const answerYear = years[r.ans];
  if (answerYear === null || answerYear === undefined) continue;

  const asksYear = ASKS_YEAR.test(r.question) && !ASKS_COUNT.test(r.question);
  if (!asksYear) {
    rejected.push({ q: r.question, opts: r.options, years });
    continue;
  }
  const en = enMap.get(r.category + '␟' + r.question) ?? null;
  mined.push({ ...r, years, answerYear, en });
}

// ─── Épocas ──────────────────────────────────────────────────────────────────
function era(y) {
  if (y < 500) return 'antiguedad';
  if (y < 1492) return 'media';
  if (y < 1789) return 'moderna';
  if (y < 1900) return 'xix';
  if (y < 2000) return 'xx';
  return 'xxi';
}

const byEra = {}, byCat = {}, byDiff = {};
let withEn = 0;
for (const r of mined) {
  const e = era(r.answerYear);
  byEra[e] = (byEra[e] ?? 0) + 1;
  byCat[r.category] = (byCat[r.category] ?? 0) + 1;
  byDiff[r.difficulty] = (byDiff[r.difficulty] ?? 0) + 1;
  if (r.en) withEn++;
}

console.log('Preguntas ES parseadas:', esRows.length);
console.log('Bloques EN parseados  :', enMap.size);
console.log('Minadas (respuesta=año):', mined.length, '· con EN:', withEn);
console.log('\nPor época:', byEra);
console.log('\nPor categoría:', byCat);
console.log('\nPor dificultad:', byDiff);

// Duplicados por año+enunciado
const seen = new Map();
for (const r of mined) {
  const k = r.question.toLowerCase().replace(/[¿?¡!.,\s]/g, '');
  seen.set(k, (seen.get(k) ?? 0) + 1);
}
const dupes = [...seen.entries()].filter(([, n]) => n > 1);
console.log('\nEnunciados duplicados:', dupes.length);
console.log('\nDescartadas (numéricas no-año):', rejected.length);
// Falsos negativos: descartadas cuyas 4 opciones son años de 4 cifras
// plausibles. Si aquí aparece algo, el filtro de enunciado se deja preguntas.
const suspicious = rejected.filter(r =>
  r.years.every(y => y >= 1400 && y <= 2030));
console.log('Posibles falsos negativos:', suspicious.length);
for (const r of suspicious.slice(0, 15)) console.log('  ·', r.q, '→', JSON.stringify(r.opts));

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'mined.json');
fs.writeFileSync(outPath, JSON.stringify(mined, null, 2));
console.log('\n→', path.relative(ROOT, outPath), 'escrito');
