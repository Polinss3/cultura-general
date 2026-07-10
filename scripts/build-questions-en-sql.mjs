#!/usr/bin/env node
// Combina translations/questions.es.json + translations/en/<categoria>.json
// y emite supabase/questions_en.sql (UPDATEs keyed por category + texto ES exacto,
// con dollar-quoting seguro). Resumible: solo procesa las categorías traducidas.
//
// Formato de translations/en/<categoria>.json:
//   [ { "i": 0, "question_en": "...", "options_en": ["..","..","..",".."], "context_en": "..." }, ... ]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const master = JSON.parse(fs.readFileSync(path.join(root, 'translations/questions.es.json'), 'utf8'));
const enDir = path.join(root, 'translations/en');
const split = process.argv.includes('--split');

// Elige un tag de dollar-quoting que no aparezca en el contenido.
function dq(str, base) {
  let tag = `$${base}$`;
  if (!String(str).includes(tag)) return tag;
  for (let k = 1; ; k++) {
    tag = `$${base}${k}$`;
    if (!String(str).includes(tag)) return tag;
  }
}
function quote(str, base) {
  const t = dq(str, base);
  return `${t}${str}${t}`;
}

let sql = `-- ─────────────────────────────────────────────────────────────
-- Traducciones EN de las preguntas (generado por build-questions-en-sql.mjs)
-- Requiere haber ejecutado antes supabase/i18n_en.sql (columnas *_en).
-- Pegar en el SQL editor de Supabase. Idempotente (UPDATE por texto ES exacto).
-- ─────────────────────────────────────────────────────────────

begin;
`;

let emitted = 0, warnings = 0;
const warn = (m) => { console.warn('  ⚠ ' + m); warnings++; };
const perCat = {};

// Preguntas con colisión (mismo category+question, distinto contenido) NO se
// traducen por texto: un UPDATE keyed por texto afectaría a varias filas.
const collisionSet = new Set((master.collisions ?? []).map(c => `${c.category}|||${c.question}`));

for (const [cat, rows] of Object.entries(master.categories)) {
  const enPath = path.join(enDir, `${cat}.json`);
  if (!fs.existsSync(enPath)) continue; // categoría aún sin traducir → se omite
  let enRows;
  try { enRows = JSON.parse(fs.readFileSync(enPath, 'utf8')); }
  catch { warn(`No se pudo parsear translations/en/${cat}.json`); continue; }

  const enById = new Map(enRows.map(r => [r.i, r]));
  let catSql = '';
  let catCount = 0;

  for (const es of rows) {
    const en = enById.get(es.i);
    if (!en) continue; // sin traducir aún
    if (collisionSet.has(`${cat}|||${es.question}`)) continue; // colisión: se queda en ES
    // Validación de alineación.
    if (typeof en.question_en !== 'string' || en.question_en.trim() === '') { warn(`${cat}[${es.i}] question_en vacío`); continue; }
    if (!Array.isArray(en.options_en) || en.options_en.length !== 4 || en.options_en.some(o => typeof o !== 'string' || o.trim() === '')) {
      warn(`${cat}[${es.i}] options_en debe tener 4 opciones no vacías`); continue;
    }
    if (en.question_en === es.question) warn(`${cat}[${es.i}] question_en == ES (¿sin traducir?)`);

    const optsJson = JSON.stringify(en.options_en);
    const ctxLine = (typeof en.context_en === 'string' && en.context_en.trim() !== '')
      ? `,\n  context_en  = ${quote(en.context_en, 't')}`
      : (es.context ? '' : ''); // si no hay context_en, el cliente cae a ES

    catSql += `update public.questions set
  question_en = ${quote(en.question_en, 't')},
  options_en  = ${quote(optsJson, 't')}::jsonb${ctxLine}
where category = '${cat}' and question = ${quote(es.question, 'q')};\n\n`;
    catCount++;
    emitted++;
  }

  perCat[cat] = catCount;
  sql += `\n-- ── ${cat} (${catCount}) ──\n` + catSql;

  if (split && catCount > 0) {
    const splitDir = path.join(root, 'supabase/questions_en');
    fs.mkdirSync(splitDir, { recursive: true });
    fs.writeFileSync(path.join(splitDir, `${cat}.sql`), `begin;\n${catSql}commit;\n`);
  }
}

sql += `\ncommit;\n\n`;
sql += `-- Cobertura tras aplicar:\n`;
sql += `select count(*) as missing_en from public.questions\n  where active and (question_en is null or options_en is null);\n`;

fs.writeFileSync(path.join(root, 'supabase/questions_en.sql'), sql);

console.log(`UPDATEs emitidos: ${emitted} · avisos: ${warnings}`);
for (const [c, n] of Object.entries(perCat)) console.log(`  ${c}: ${n}`);
console.log(`\n→ supabase/questions_en.sql${split ? ' (+ supabase/questions_en/*.sql)' : ''}`);
