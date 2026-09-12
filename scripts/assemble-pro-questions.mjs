// Ensambla el catálogo PRO a partir de data/pro/<categoria>.json y lo valida
// con más dureza que scripts/build-pro-questions.mjs, que solo comprueba
// duplicados exactos. Aquí también se buscan duplicados APROXIMADOS contra el
// banco core de producción y dentro del propio catálogo PRO, y se comprueba la
// coherencia entre los dos idiomas.
//
//   node scripts/assemble-pro-questions.mjs            → informe + ensamblado si está completo
//   node scripts/assemble-pro-questions.mjs --report   → solo informe (no escribe nada)
//
// Salida: data/questions-pro-v1-2000.json (solo cuando las 13 categorías suman
// 2.000 preguntas sin ningún error).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const proDir = path.join(root, 'data/pro');
const outputPath = path.join(root, 'data/questions-pro-v1-2000.json');
const reportOnly = process.argv.includes('--report');

// ─── Reparto objetivo ────────────────────────────────────────────────────────
// 2.000 / 13 = 153,8. Once categorías con 154 y dos con 153. La dificultad se
// escora hacia arriba respecto al core (453/969/578) porque estas preguntas
// alimentan los niveles 201-400, los más altos de Aventura.
export const TARGET = {
  historia:   { total: 154, easy: 31, medium: 69, hard: 54 },
  geografia:  { total: 154, easy: 31, medium: 69, hard: 54 },
  ciencia:    { total: 153, easy: 30, medium: 69, hard: 54 },
  arte:       { total: 154, easy: 31, medium: 69, hard: 54 },
  filosofia:  { total: 154, easy: 31, medium: 69, hard: 54 },
  deportes:   { total: 154, easy: 31, medium: 69, hard: 54 },
  biologia:   { total: 154, easy: 31, medium: 69, hard: 54 },
  cine:       { total: 154, easy: 31, medium: 69, hard: 54 },
  musica:     { total: 154, easy: 31, medium: 69, hard: 54 },
  literatura: { total: 154, easy: 31, medium: 69, hard: 54 },
  tecnologia: { total: 154, easy: 31, medium: 69, hard: 54 },
  mitologia:  { total: 153, easy: 30, medium: 69, hard: 54 },
  astronomia: { total: 154, easy: 31, medium: 69, hard: 54 },
};

const CATEGORIES = Object.keys(TARGET);
const DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

// ─── Normalización y similitud ──────────────────────────────────────────────

const normalize = value => String(value ?? '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const STOPWORDS_ES = new Set(`
  a al algo alguna algunas alguno algunos ante antes aquel aquella aquellas aquello
  aquellos aqui bajo cada como con contra cual cuales cuando cuanta cuantas cuanto
  cuantos de del desde donde dos e el ella ellas ellos en entre era eran es esa esas
  ese eso esos esta estaba estaban estamos estan estar estas este esto estos fue
  fueron ha habia han hasta hay la las le les lo los mas me mi mis mucho muy nada
  ni no nos nosotros o os otra otras otro otros para pero poco por porque que quien
  quienes se sea segun ser si sin sobre su sus tambien tanto te tiene tienen todo
  todos tu tus un una unas uno unos y ya
  cual es el la nombre llama llamaba se denomina como conoce considera famoso
  famosa primer primera principal mayor obra autor pais ciudad ano siglo
  poblado poblada habitantes grande pequeno largo alto alta bajo baja extenso
  extensa profundo mundo continente region encuentra encuentran esta estan
`.split(/\s+/).filter(Boolean));

const STOPWORDS_EN = new Set(`
  a an and are as at be been by for from has have he her his how i in is it its
  of on or she that the their there these they this those to was were what when
  where which who whom whose why will with you your
  name called known considered famous first main largest work author country city
  year century most populous biggest smallest longest highest deepest lowest
  world continent region located lies
`.split(/\s+/).filter(Boolean));

function tokens(text, stopwords) {
  return new Set(normalize(text).split(' ').filter(t => t.length > 2 && !stopwords.has(t)));
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / (a.size + b.size - inter);
}

// Umbrales: por encima de FAIL se considera la misma pregunta; entre WARN y
// FAIL se lista para revisión manual pero no bloquea.
const SIM_FAIL = 0.6;
const SIM_WARN = 0.45;

// ─── Carga ──────────────────────────────────────────────────────────────────

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const coreFiles = ['data/questions-core-prod-2000.json', 'data/questions-v5-2000.json']
  .map(f => path.join(root, f))
  .filter(f => fs.existsSync(f));
if (coreFiles.length === 0) throw new Error('Falta el catálogo core de referencia en data/');

const core = [];
const seenCore = new Set();
for (const file of coreFiles) {
  for (const row of loadJson(file)) {
    const key = normalize(row.question);
    if (seenCore.has(key)) continue;
    seenCore.add(key);
    core.push(row);
  }
}

const pro = [];
const errors = [];
const warnings = [];
const perCategory = {};

// Cada categoría puede venir en varios ficheros: historia.json, historia-2.json…
// Se escriben por lotes para poder revisarlos y validarlos según avanzan.
const proFiles = fs.existsSync(proDir)
  ? fs.readdirSync(proDir).filter(f => f.endsWith('.json')).sort()
  : [];

for (const category of CATEGORIES) {
  perCategory[category] = { present: 0, easy: 0, medium: 0, hard: 0 };
  const files = proFiles.filter(f => f === `${category}.json` || f.startsWith(`${category}-`));
  for (const name of files) {
    let rows;
    try {
      rows = loadJson(path.join(proDir, name));
    } catch (error) {
      errors.push(`${name}: JSON inválido (${error.message})`);
      continue;
    }
    if (!Array.isArray(rows)) { errors.push(`${name}: no es un array`); continue; }
    rows.forEach((row, index) => {
      row.__source = `${name}#${index + 1}`;
      if (row.category !== category) errors.push(`${row.__source}: categoría "${row.category}" no coincide con el fichero`);
      pro.push(row);
      perCategory[category].present += 1;
      if (DIFFICULTIES.has(row.difficulty)) perCategory[category][row.difficulty] += 1;
    });
  }
}

// ─── Validación por fila ────────────────────────────────────────────────────

const numbersIn = text => (String(text).match(/\d+(?:[.,]\d+)?/g) ?? [])
  .map(n => n.replace(',', '.').replace(/\.0+$/, ''))
  .sort()
  .join('|');

for (const row of pro) {
  const at = row.__source;
  if (!DIFFICULTIES.has(row.difficulty)) errors.push(`${at}: dificultad inválida "${row.difficulty}"`);

  for (const key of ['question', 'context', 'question_en', 'context_en']) {
    if (typeof row[key] !== 'string' || !row[key].trim()) errors.push(`${at}: falta ${key}`);
  }
  if (typeof row.question === 'string') {
    if (!row.question.trim().startsWith('¿')) errors.push(`${at}: la pregunta ES debe empezar por ¿`);
    if (!row.question.trim().endsWith('?')) errors.push(`${at}: la pregunta ES debe acabar en ?`);
    if (row.question.length > 180) warnings.push(`${at}: pregunta ES larga (${row.question.length})`);
  }
  if (typeof row.question_en === 'string') {
    if (!row.question_en.trim().endsWith('?')) errors.push(`${at}: la pregunta EN debe acabar en ?`);
    if (/[¿¡]/.test(row.question_en)) errors.push(`${at}: signos ¿¡ en la pregunta EN`);
  }
  for (const key of ['context', 'context_en']) {
    if (typeof row[key] === 'string' && row[key].trim().length < 40) {
      errors.push(`${at}: ${key} demasiado corto (${row[key].trim().length} caracteres)`);
    }
  }

  if (!Number.isInteger(row.answer_index) || row.answer_index < 0 || row.answer_index > 3) {
    errors.push(`${at}: answer_index inválido`);
  }
  for (const key of ['options', 'options_en']) {
    const options = row[key];
    if (!Array.isArray(options) || options.length !== 4) { errors.push(`${at}: ${key} debe tener 4 opciones`); continue; }
    if (options.some(o => typeof o !== 'string' || !o.trim())) errors.push(`${at}: ${key} con opción vacía`);
    if (new Set(options.map(normalize)).size !== 4) errors.push(`${at}: ${key} con opciones repetidas`);
    if (options.some(o => typeof o === 'string' && o.length > 70)) warnings.push(`${at}: ${key} con una opción muy larga`);
  }

  // Coherencia entre idiomas: los números de la respuesta correcta deben ser
  // los mismos en las dos lenguas (años, cantidades, porcentajes).
  if (Array.isArray(row.options) && Array.isArray(row.options_en) && Number.isInteger(row.answer_index)) {
    const es = row.options[row.answer_index];
    const en = row.options_en[row.answer_index];
    if (es && en && numbersIn(es) !== numbersIn(en)) {
      errors.push(`${at}: la respuesta correcta no coincide numéricamente entre idiomas ("${es}" / "${en}")`);
    }
    // Y la explicación no debe ser una copia de la pregunta.
    if (normalize(row.context) === normalize(row.question)) errors.push(`${at}: context igual a la pregunta`);
  }
}

// ─── Duplicados exactos ─────────────────────────────────────────────────────

for (const key of ['question', 'question_en']) {
  const seen = new Map();
  for (const row of pro) {
    const k = normalize(row[key]);
    if (!k) continue;
    if (seen.has(k)) errors.push(`${row.__source}: ${key} idéntica a ${seen.get(k)}`);
    else seen.set(k, row.__source);
  }
  const coreSet = new Set(core.map(r => normalize(r[key])));
  for (const row of pro) {
    if (coreSet.has(normalize(row[key]))) errors.push(`${row.__source}: ${key} ya existe en el core`);
  }
}

// ─── Duplicados aproximados ────────────────────────────────────────────────
// Se compara pregunta + respuesta correcta, en español, con Jaccard sobre
// tokens sin palabras vacías. Dos preguntas que comparten la respuesta y más
// de la mitad del vocabulario significativo son, casi siempre, la misma.

const sig = row => tokens(
  `${row.question} ${Array.isArray(row.options) ? row.options[row.answer_index] ?? '' : ''}`,
  STOPWORDS_ES,
);
const sigEn = row => tokens(
  `${row.question_en} ${Array.isArray(row.options_en) ? row.options_en[row.answer_index] ?? '' : ''}`,
  STOPWORDS_EN,
);
const answerOf = row => normalize(Array.isArray(row.options) ? row.options[row.answer_index] : '');

const coreSigs = core.map(r => ({ row: r, es: sig(r), en: sigEn(r), answer: answerOf(r) }));
const proSigs = pro.map(r => ({ row: r, es: sig(r), en: sigEn(r), answer: answerOf(r) }));

function compare(a, b, label) {
  const s = Math.max(jaccard(a.es, b.es), jaccard(a.en, b.en));
  const sameAnswer = a.answer && a.answer === b.answer;
  // Misma respuesta correcta baja el listón: basta con menos solapamiento.
  const fail = s >= SIM_FAIL || (sameAnswer && s >= SIM_WARN);
  const warn = s >= SIM_WARN || (sameAnswer && s >= 0.3);
  if (fail) errors.push(`${label} (similitud ${s.toFixed(2)}${sameAnswer ? ', misma respuesta' : ''})`);
  else if (warn) warnings.push(`${label} (similitud ${s.toFixed(2)}${sameAnswer ? ', misma respuesta' : ''})`);
}

for (const p of proSigs) {
  for (const c of coreSigs) {
    if (p.row.category !== c.row.category) continue;
    compare(p, c, `${p.row.__source} se parece al core: "${c.row.question}"`);
  }
}
for (let i = 0; i < proSigs.length; i += 1) {
  for (let j = i + 1; j < proSigs.length; j += 1) {
    if (proSigs[i].row.category !== proSigs[j].row.category) continue;
    compare(proSigs[i], proSigs[j], `${proSigs[i].row.__source} se parece a ${proSigs[j].row.__source}: "${proSigs[j].row.question}"`);
  }
}

// ─── Reparto de dificultad (misma aritmética que el manifiesto) ─────────────

const totals = { easy: 0, medium: 0, hard: 0 };
for (const row of pro) if (DIFFICULTIES.has(row.difficulty)) totals[row.difficulty] += 1;

function checkLevelPlan(easyTotal, hardTotal) {
  let prevEasy = 0, prevHard = 0;
  for (let L = 1; L <= 200; L += 1) {
    const easyCum = Math.floor(easyTotal * (L * (401 - L) / 2) / 20100);
    const hardCum = Math.floor(hardTotal * (L * (L + 1) / 2 + 54 * L) / 30900);
    const e = easyCum - prevEasy, h = hardCum - prevHard;
    if (e < 0 || h < 0 || e + h > 10) return `nivel ${L + 200}: ${e} easy + ${h} hard`;
    prevEasy = easyCum; prevHard = hardCum;
  }
  return null;
}
const targetTotals = Object.values(TARGET).reduce((acc, t) => {
  acc.easy += t.easy; acc.medium += t.medium; acc.hard += t.hard; return acc;
}, { easy: 0, medium: 0, hard: 0 });
const planProblem = checkLevelPlan(targetTotals.easy, targetTotals.hard);
if (planProblem) errors.push(`El reparto objetivo no cabe en el manifiesto: ${planProblem}`);

// ─── Informe ────────────────────────────────────────────────────────────────

const pad = (s, n) => String(s).padEnd(n);
console.log('\nCategoría    presentes/objetivo   easy      medium    hard');
let complete = true;
for (const category of CATEGORIES) {
  const t = TARGET[category], c = perCategory[category];
  const ok = c.present === t.total && c.easy === t.easy && c.medium === t.medium && c.hard === t.hard;
  if (!ok) complete = false;
  console.log(
    `${pad(category, 12)} ${pad(`${c.present}/${t.total}`, 20)} ${pad(`${c.easy}/${t.easy}`, 9)} ${pad(`${c.medium}/${t.medium}`, 9)} ${pad(`${c.hard}/${t.hard}`, 9)} ${ok ? '✓' : ''}`,
  );
}
console.log(`\nTotal: ${pro.length}/2000 · easy ${totals.easy} · medium ${totals.medium} · hard ${totals.hard}`);
console.log(`Core de referencia: ${core.length} preguntas (${coreFiles.map(f => path.basename(f)).join(', ')})`);

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} avisos (revisar, no bloquean):`);
  for (const w of warnings.slice(0, 80)) console.log('   ' + w);
  if (warnings.length > 80) console.log(`   … y ${warnings.length - 80} más`);
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} errores:`);
  for (const e of errors.slice(0, 120)) console.log('   ' + e);
  if (errors.length > 120) console.log(`   … y ${errors.length - 120} más`);
  process.exitCode = 1;
} else {
  console.log('\n✅ Sin errores.');
}

if (!reportOnly && errors.length === 0 && complete && pro.length === 2000) {
  const clean = pro.map(({ __source, ...row }) => ({
    category: row.category,
    question: row.question.trim(),
    options: row.options.map(o => o.trim()),
    answer_index: row.answer_index,
    context: row.context.trim(),
    difficulty: row.difficulty,
    question_en: row.question_en.trim(),
    options_en: row.options_en.map(o => o.trim()),
    context_en: row.context_en.trim(),
  }));
  fs.writeFileSync(outputPath, JSON.stringify(clean, null, 1) + '\n');
  console.log(`\n📦 Escrito ${path.relative(root, outputPath)} (${clean.length} preguntas).`);
} else if (!reportOnly && errors.length === 0) {
  console.log('\nCatálogo incompleto: no se escribe el fichero final todavía.');
}
