#!/usr/bin/env node
// Verifica paridad entre locales/es.json y locales/en.json:
// - mismas claves (tratando pares _one/_other como una unidad)
// - mismos placeholders {{var}} por clave
// - sin valores vacíos
// Y hace un barrido de literales con caracteres españoles en el código fuente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const es = JSON.parse(fs.readFileSync(path.join(root, 'locales/es.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.json'), 'utf8'));

let errors = 0;
const err = (m) => { console.error('  ✗ ' + m); errors++; };

// Aplana el objeto a { 'a.b.c': valor }. Colapsa sufijos de plural.
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      const base = key.replace(/_(one|other|zero|two|few|many)$/, '');
      out[base] = v;
    }
  }
  return out;
}

const flatEs = flatten(es);
const flatEn = flatten(en);

const keysEs = new Set(Object.keys(flatEs));
const keysEn = new Set(Object.keys(flatEn));

console.log(`Claves ES: ${keysEs.size} · EN: ${keysEn.size}`);

for (const k of keysEs) if (!keysEn.has(k)) err(`Falta en EN: ${k}`);
for (const k of keysEn) if (!keysEs.has(k)) err(`Falta en ES: ${k}`);

// Placeholders + no vacíos.
const ph = (s) => new Set([...String(s).matchAll(/\{\{\s*(\w+)/g)].map(m => m[1]));
for (const k of keysEs) {
  if (!keysEn.has(k)) continue;
  const a = flatEs[k], b = flatEn[k];
  if (typeof a === 'string' && a.trim() === '') err(`Valor vacío ES: ${k}`);
  if (typeof b === 'string' && b.trim() === '') err(`Valor vacío EN: ${k}`);
  const pa = ph(a), pb = ph(b);
  const missing = [...pa].filter(x => !pb.has(x));
  const extra = [...pb].filter(x => !pa.has(x));
  if (missing.length || extra.length) {
    err(`Placeholders difieren en ${k}: ES{${[...pa]}} EN{${[...pb]}}`);
  }
}

// Barrido de caracteres españoles en literales de código (best-effort).
const SRC_DIRS = ['app', 'components', 'lib', 'constants', 'context', 'hooks'];
const SKIP = new Set(['constants/questions.ts', 'constants/questionsEn.ts']); // bancos de preguntas
const spanishRe = /[¿¡áéíóúñ]/i;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) scanFile(p);
  }
}
let spanishHits = 0;
function scanFile(file) {
  const rel = path.relative(root, file);
  if (SKIP.has(rel)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    // literales entre comillas simples, dobles o backticks
    const lits = code.match(/'[^']*'|"[^"]*"|`[^`]*`/g) || [];
    for (const lit of lits) {
      if (spanishRe.test(lit)) {
        console.warn(`  ⚠ posible ES en ${rel}:${i + 1} → ${lit.trim().slice(0, 60)}`);
        spanishHits++;
      }
    }
  });
}
SRC_DIRS.forEach(d => { const abs = path.join(root, d); if (fs.existsSync(abs)) walk(abs); });

console.log(`\nAvisos de literales españoles: ${spanishHits}`);
if (errors > 0) {
  console.error(`\n❌ ${errors} errores de paridad i18n`);
  process.exit(1);
}
console.log('\n✅ Paridad i18n OK');
