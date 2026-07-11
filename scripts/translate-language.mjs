#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// translate-language.mjs — traducción automática de TODA la app a un idioma nuevo
// usando la API de Anthropic (Claude). El español es la fuente; para cualquier
// idioma != es la marca es "CG Trivia".
//
// Traduce:
//   • ui        → locales/es.json  → locales/<lang>.json  (strings de la app)
//   • questions → translations/questions.es.json → translations/<lang>/<cat>.json
//   • shop      → 12 items de la tienda            → supabase/i18n_<lang>.sql
//   • store     → store/*-es.md                    → store/*-<lang>.md
//   + genera    → supabase/questions_<lang>.sql (UPDATEs keyed por category+texto ES)
//
// Requisitos:
//   npm i -D @anthropic-ai/sdk
//   export ANTHROPIC_API_KEY=sk-ant-...      (o `ant auth login`)
//
// Uso:
//   node scripts/translate-language.mjs fr
//   node scripts/translate-language.mjs de --only=ui,questions
//   node scripts/translate-language.mjs pt-BR --language-name="Brazilian Portuguese"
//   node scripts/translate-language.mjs it --model=claude-haiku-4-5   (más barato)
//   node scripts/translate-language.mjs fr --categories=historia,arte --force
//
// Es RESUMIBLE: si una categoría ya está traducida y completa, se salta
// (usa --force para rehacerla). Si se corta, se reanuda sin perder progreso.
// ─────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ── args ──────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const positional = argv.filter(a => !a.startsWith('--'));
const flags = Object.fromEntries(
  argv.filter(a => a.startsWith('--')).map(a => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k, rest.length ? rest.join('=') : true];
  }),
);

const LANG = positional[0];
if (!LANG || LANG === 'es') {
  console.error('Uso: node scripts/translate-language.mjs <lang> [--only=ui,questions,shop,store] [--categories=..] [--model=..] [--language-name=".."] [--concurrency=4] [--force]');
  console.error('     <lang> es un código como fr, de, pt, it, nl... (no puede ser "es").');
  process.exit(1);
}

const MODEL = flags.model || process.env.TRANSLATE_MODEL || 'claude-opus-4-8';
const ONLY = flags.only ? String(flags.only).split(',').map(s => s.trim()) : ['ui', 'questions', 'shop', 'store'];
const CATS_FILTER = flags.categories ? String(flags.categories).split(',').map(s => s.trim()) : null;
const CONCURRENCY = Math.max(1, Number(flags.concurrency || 4));
const FORCE = !!flags.force;
const APP_NAME = 'CG Trivia'; // marca para todos los idiomas != es

const LANG_NAMES = {
  en: 'English', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
  'pt-BR': 'Brazilian Portuguese', nl: 'Dutch', pl: 'Polish', ru: 'Russian',
  tr: 'Turkish', ja: 'Japanese', ko: 'Korean', 'zh': 'Simplified Chinese',
  ar: 'Arabic', hi: 'Hindi', id: 'Indonesian', sv: 'Swedish', da: 'Danish',
  no: 'Norwegian', fi: 'Finnish', cs: 'Czech', el: 'Greek', ro: 'Romanian',
  uk: 'Ukrainian', vi: 'Vietnamese', th: 'Thai',
};
const LANG_NAME = flags['language-name'] || LANG_NAMES[LANG] || LANG;

// ── cliente Anthropic (SDK oficial) ──────────────────────────
let Anthropic;
try {
  ({ default: Anthropic } = await import('@anthropic-ai/sdk'));
} catch {
  console.error('Falta el SDK. Instálalo:  npm i -D @anthropic-ai/sdk');
  process.exit(1);
}
const client = new Anthropic(); // resuelve ANTHROPIC_API_KEY o perfil `ant auth login`

// ── util ─────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJSON = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };

function parseJSONLoose(text) {
  let t = text.trim();
  // quitar ```json ... ```
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // recortar a la primera estructura JSON
  const first = Math.min(...['{', '['].map(c => { const i = t.indexOf(c); return i === -1 ? Infinity : i; }));
  const lastObj = t.lastIndexOf('}'); const lastArr = t.lastIndexOf(']');
  const last = Math.max(lastObj, lastArr);
  if (Number.isFinite(first) && last > first) t = t.slice(first, last + 1);
  return JSON.parse(t);
}

async function callJSON(system, user, { maxTokens = 8000, tries = 4 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      });
      const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('');
      return parseJSONLoose(text);
    } catch (e) {
      lastErr = e;
      if (attempt < tries) await sleep(700 * attempt);
    }
  }
  throw lastErr;
}

// pool de concurrencia simple
async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

const placeholders = s => (String(s).match(/\{\{[^}]+\}\}/g) || []).sort();
const samePlaceholders = (a, b) => { const A = placeholders(a), B = placeholders(b); return A.length === B.length && A.every((x, i) => x === B[i]); };

function chunk(arr, n) { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }

// dollar-quoting seguro para SQL (rota el tag si el texto lo contiene)
function dq(text, base) {
  let tag = base;
  let n = 0;
  while (String(text).includes(`$${tag}$`)) tag = `${base}${++n}`;
  return `$${tag}$${text}$${tag}$`;
}

// ── módulo UI (locales/es.json) ──────────────────────────────
function walkStrings(node, pathArr, out) {
  if (typeof node === 'string') out.push({ path: pathArr.slice(), value: node });
  else if (Array.isArray(node)) node.forEach((v, i) => walkStrings(v, [...pathArr, i], out));
  else if (node && typeof node === 'object') for (const k of Object.keys(node)) walkStrings(node[k], [...pathArr, k], out);
}
function setPath(obj, pathArr, val) {
  let o = obj;
  for (let i = 0; i < pathArr.length - 1; i++) o = o[pathArr[i]];
  o[pathArr[pathArr.length - 1]] = val;
}

async function translateUI() {
  const src = readJSON(path.join(ROOT, 'locales/es.json'));
  const leaves = [];
  walkStrings(src, [], leaves);
  console.log(`  [ui] ${leaves.length} strings a traducir…`);

  const system = `You are a professional software localizer. Translate UI strings for a mobile trivia game from Spanish to ${LANG_NAME}.
Rules:
- Keep the meaning, tone and length appropriate for mobile UI.
- PRESERVE every interpolation placeholder EXACTLY, e.g. {{count}}, {{name}} — do not translate or reorder them.
- Do NOT translate the app brand name; if a value is exactly "Cultura General" or "CG Trivia", return "${APP_NAME}".
- Return ONLY a JSON object mapping each given id (string) to its translation (string). No prose, no code fences.`;

  const batches = chunk(leaves.map((l, i) => ({ id: i, text: l.value })), 40);
  const translated = {};
  await runPool(batches, async (batch) => {
    const doOnce = async () => {
      const user = `Translate these ${batch.length} strings to ${LANG_NAME}. Input JSON:\n${JSON.stringify(batch)}`;
      const map = await callJSON(system, user, { maxTokens: 6000 });
      for (const { id, text } of batch) {
        const t = map[id] ?? map[String(id)];
        if (typeof t === 'string' && samePlaceholders(text, t)) translated[id] = t;
      }
    };
    await doOnce();
    // reintento para los que fallaron placeholders/faltantes
    const missing = batch.filter(b => translated[b.id] === undefined);
    if (missing.length) {
      try {
        const user = `Translate these ${missing.length} strings to ${LANG_NAME}. Keep {{placeholders}} exactly. Input JSON:\n${JSON.stringify(missing)}`;
        const map = await callJSON(system, user, { maxTokens: 4000 });
        for (const { id, text } of missing) {
          const t = map[id] ?? map[String(id)];
          if (typeof t === 'string' && samePlaceholders(text, t)) translated[id] = t;
        }
      } catch { /* se rellena con la fuente abajo */ }
    }
  }, CONCURRENCY);

  const out = structuredClone(src);
  let fallbackCount = 0;
  leaves.forEach((l, i) => {
    if (translated[i] !== undefined) setPath(out, l.path, translated[i]);
    else { fallbackCount++; /* deja el ES como fallback: nunca clave cruda */ }
  });

  // pin de marca y endónimos de idioma
  if (out.common) out.common.appName = APP_NAME;
  if (out.onboarding?.language) { out.onboarding.language.es = 'Español'; out.onboarding.language.en = 'English'; }

  writeJSON(path.join(ROOT, `locales/${LANG}.json`), out);
  console.log(`  [ui] escrito locales/${LANG}.json (${fallbackCount ? fallbackCount + ' con fallback ES' : 'sin fallbacks'})`);
}

// ── módulo QUESTIONS ─────────────────────────────────────────
async function translateQuestions() {
  const master = readJSON(path.join(ROOT, 'translations/questions.es.json'));
  let cats = Object.keys(master.categories);
  if (CATS_FILTER) cats = cats.filter(c => CATS_FILTER.includes(c));

  const system = `You translate trivia questions from Spanish to ${LANG_NAME} for a general-knowledge quiz game.
Rules:
- Translate the question, all 4 options, and the context faithfully and naturally.
- KEEP THE 4 OPTIONS IN THE SAME ORDER (the correct-answer index is stored separately and must not move).
- Keep proper nouns, names, numbers, dates and units correct for ${LANG_NAME}; use the internationally common form.
- Return ONLY a JSON array of objects {"i": number, "question": string, "options": [4 strings], "context": string}. No prose, no code fences.`;

  for (const cat of cats) {
    const es = master.categories[cat];
    const outPath = path.join(ROOT, `translations/${LANG}/${cat}.json`);
    if (!FORCE && fs.existsSync(outPath)) {
      try {
        const prev = readJSON(outPath);
        if (Array.isArray(prev) && prev.length === es.length) { console.log(`  [q:${cat}] ya completo (${prev.length}) — skip`); continue; }
      } catch { /* rehacer */ }
    }
    console.log(`  [q:${cat}] traduciendo ${es.length}…`);
    const batches = chunk(es.map(q => ({ i: q.i, question: q.question, options: q.options, context: q.context || '' })), 15);
    const byIndex = new Map();
    await runPool(batches, async (batch) => {
      const user = `Translate these ${batch.length} trivia questions to ${LANG_NAME}. Input JSON:\n${JSON.stringify(batch)}`;
      let arr;
      try { arr = await callJSON(system, user, { maxTokens: 8000 }); } catch (e) { console.error(`    ! fallo lote ${cat}:`, e.message); return; }
      for (const item of (Array.isArray(arr) ? arr : [])) {
        if (typeof item?.i !== 'number') continue;
        if (typeof item.question !== 'string' || !item.question.trim()) continue;
        if (!Array.isArray(item.options) || item.options.length !== 4 || item.options.some(o => typeof o !== 'string' || !o.trim())) continue;
        byIndex.set(item.i, { i: item.i, question: item.question.trim(), options: item.options.map(o => o.trim()), context: typeof item.context === 'string' ? item.context.trim() : '' });
      }
    }, CONCURRENCY);

    const result = [];
    let missing = 0;
    for (const q of es) { if (byIndex.has(q.i)) result.push(byIndex.get(q.i)); else missing++; }
    writeJSON(outPath, result);
    console.log(`  [q:${cat}] escrito translations/${LANG}/${cat}.json (${result.length}/${es.length}${missing ? `, faltan ${missing} — reejecuta para completar` : ''})`);
  }
}

// ── módulo SHOP (12 items) → i18n_<lang>.sql ─────────────────
function parseShopItemsFromEnSql() {
  const p = path.join(ROOT, 'supabase/i18n_en.sql');
  if (!fs.existsSync(p)) return [];
  const sql = fs.readFileSync(p, 'utf8');
  const re = /update public\.shop_items set name_en = '([^']*)',\s*description_en = '([^']*)'\s*where item_id = '([^']*)'/gi;
  const out = []; let m;
  while ((m = re.exec(sql))) out.push({ item_id: m[3], name: m[1], description: m[2] });
  return out;
}

async function translateShop() {
  const items = parseShopItemsFromEnSql();
  if (!items.length) { console.log('  [shop] no encuentro supabase/i18n_en.sql — skip'); return; }
  console.log(`  [shop] traduciendo ${items.length} items…`);
  const system = `Translate shop item names and descriptions for a trivia game from English to ${LANG_NAME}. Keep names short (they are buttons/labels). Return ONLY a JSON array of {"item_id": string, "name": string, "description": string}. No prose.`;
  const arr = await callJSON(system, `Input JSON:\n${JSON.stringify(items)}`, { maxTokens: 3000 });
  const byId = new Map((Array.isArray(arr) ? arr : []).map(x => [x.item_id, x]));
  const col = `_${LANG.replace(/-/g, '_')}`; // p.ej. _fr, _pt_BR

  const esc = s => String(s).replace(/'/g, "''");
  const lines = [];
  lines.push('-- ─────────────────────────────────────────────────────────────');
  lines.push(`-- i18n ${LANG.toUpperCase()}: columnas de idioma para preguntas y tienda (generado)`);
  lines.push('-- Pegar en el SQL editor de Supabase. Idempotente.');
  lines.push('-- ─────────────────────────────────────────────────────────────\n');
  lines.push('alter table public.questions');
  lines.push(`  add column if not exists question${col} text,`);
  lines.push(`  add column if not exists options${col}  jsonb,`);
  lines.push(`  add column if not exists context${col}  text;\n`);
  lines.push('alter table public.questions');
  lines.push(`  drop constraint if exists questions_options${col}_len;`);
  lines.push('alter table public.questions');
  lines.push(`  add constraint questions_options${col}_len`);
  lines.push(`  check (options${col} is null or jsonb_array_length(options${col}) = 4);\n`);
  lines.push('alter table public.shop_items');
  lines.push(`  add column if not exists name${col}        text,`);
  lines.push(`  add column if not exists description${col} text;\n`);
  for (const it of items) {
    const t = byId.get(it.item_id) || {};
    const name = esc(t.name || it.name);
    const desc = esc(t.description || it.description);
    lines.push(`update public.shop_items set name${col} = '${name}', description${col} = '${desc}' where item_id = '${it.item_id}';`);
  }
  lines.push('\n-- Cobertura (missing debe ser 0 en activas antes de publicar la ficha)');
  lines.push(`select count(*) as missing from public.questions where active and (question${col} is null or options${col} is null);`);
  fs.writeFileSync(path.join(ROOT, `supabase/i18n_${LANG}.sql`), lines.join('\n') + '\n');
  console.log(`  [shop] escrito supabase/i18n_${LANG}.sql`);
}

// ── generar questions_<lang>.sql desde translations/<lang>/ ──
function buildQuestionsSql() {
  const master = readJSON(path.join(ROOT, 'translations/questions.es.json'));
  const dir = path.join(ROOT, `translations/${LANG}`);
  if (!fs.existsSync(dir)) { console.log('  [sql] no hay traducciones de preguntas todavía — skip'); return; }
  const col = `_${LANG.replace(/-/g, '_')}`;
  let cats = Object.keys(master.categories);
  const out = [];
  out.push('-- ─────────────────────────────────────────────────────────────');
  out.push(`-- Traducciones ${LANG.toUpperCase()} de preguntas (generado por translate-language.mjs)`);
  out.push(`-- Requiere haber ejecutado antes supabase/i18n_${LANG}.sql (columnas ${col}).`);
  out.push('-- Idempotente (UPDATE por texto ES exacto).');
  out.push('-- ─────────────────────────────────────────────────────────────\n');
  out.push('begin;\n');
  let total = 0;
  const seen = new Set();
  for (const cat of cats) {
    const fp = path.join(dir, `${cat}.json`);
    if (!fs.existsSync(fp)) continue;
    const es = master.categories[cat];
    const tr = readJSON(fp);
    const byI = new Map(tr.map(x => [x.i, x]));
    out.push(`-- ── ${cat} ──`);
    for (const q of es) {
      const t = byI.get(q.i);
      if (!t) continue;
      if (!Array.isArray(t.options) || t.options.length !== 4) continue;
      const key = `${cat} ${q.question}`;
      if (seen.has(key)) continue; // colisiones: un UPDATE por texto (casa todas las filas)
      seen.add(key);
      out.push('update public.questions set');
      out.push(`  question${col} = ${dq(t.question, 't')},`);
      out.push(`  options${col}  = ${dq(JSON.stringify(t.options), 't')}::jsonb,`);
      out.push(`  context${col}  = ${dq(t.context || '', 't')}`);
      out.push(`where category = '${cat}' and question = ${dq(q.question, 'q')};\n`);
      total++;
    }
  }
  out.push('commit;\n');
  out.push('-- Cobertura tras aplicar: debe dar 0');
  out.push(`select count(*) as missing from public.questions where active and (question${col} is null or options${col} is null);`);
  fs.writeFileSync(path.join(ROOT, `supabase/questions_${LANG}.sql`), out.join('\n') + '\n');
  console.log(`  [sql] escrito supabase/questions_${LANG}.sql (${total} UPDATEs)`);
}

// ── módulo STORE (fichas markdown) ───────────────────────────
async function translateStore() {
  const files = ['store/app-store-es.md', 'store/google-play-es.md'].filter(f => fs.existsSync(path.join(ROOT, f)));
  if (!files.length) { console.log('  [store] no hay fichas ES — skip'); return; }
  const system = `You are a professional app-store localizer. Translate the following app-store listing from Spanish to ${LANG_NAME}.
Rules:
- Preserve the Markdown structure (headings, bullets, blank lines) and any character-limit notes.
- The app is named "${APP_NAME}" in ${LANG_NAME}; use that brand name.
- Where the text says the app is available in Spanish and English, add ${LANG_NAME} to that list.
- Return ONLY the translated Markdown. No code fences, no extra commentary.`;
  for (const f of files) {
    const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
    let out;
    try {
      const res = await client.messages.create({ model: MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content }] });
      out = res.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    } catch (e) { console.error(`  [store] fallo ${f}:`, e.message); continue; }
    const dest = f.replace('-es.md', `-${LANG}.md`);
    fs.writeFileSync(path.join(ROOT, dest), out + '\n');
    console.log(`  [store] escrito ${dest}`);
  }
}

// ── main ─────────────────────────────────────────────────────
console.log(`\n▶ Traduciendo a ${LANG} (${LANG_NAME}) con ${MODEL}. Marca = "${APP_NAME}". Módulos: ${ONLY.join(', ')}\n`);
try {
  if (ONLY.includes('ui')) await translateUI();
  if (ONLY.includes('questions')) await translateQuestions();
  if (ONLY.includes('shop')) await translateShop();
  if (ONLY.includes('store')) await translateStore();
  if (ONLY.includes('questions')) buildQuestionsSql();
} catch (e) {
  console.error('\n✖ Error:', e?.message || e);
  if (String(e?.message || e).match(/api key|authentication|401/i)) {
    console.error('  Configura credenciales:  export ANTHROPIC_API_KEY=sk-ant-...   (o `ant auth login`)');
  }
  process.exit(1);
}

console.log(`\n✅ Hecho. Siguiente (manual):`);
console.log(`  1. Ejecuta en Supabase, en orden: supabase/i18n_${LANG}.sql  y luego  supabase/questions_${LANG}.sql`);
console.log(`  2. Registra el idioma en la app: importa locales/${LANG}.json en lib/i18n.ts (resources.${LANG}) y añade '${LANG}' a los idiomas soportados / selector.`);
console.log(`  3. En lib/db.ts mapQuestion: usa las columnas *_${LANG.replace(/-/g, '_')} cuando el idioma activo sea '${LANG}' (fallback atómico a ES).`);
console.log(`  4. En app.json añade la localización nativa (expo.locales.${LANG}) con nombre "${APP_NAME}".`);
console.log(`  5. Revisa locales/${LANG}.json (cadenas con fallback ES) y las fichas store/*-${LANG}.md.\n`);
