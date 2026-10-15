import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { buildCityCatalog } from './build-city-catalog.mjs';

const root = new URL('../', import.meta.url);
const framing = JSON.parse(readFileSync(new URL('constants/cityDioramaFraming.json', root), 'utf8'));
const catalog = JSON.parse(readFileSync(new URL('docs/ciudades/catalogo-propuesto.json', root), 'utf8'));
const art = new URL('docs/ciudades/', root);
const labels = {};
const originals = {};
for (const [id, profile] of Object.entries(framing.images)) {
  const city = catalog.cities.find((entry) => entry.id === id);
  if (!city?.name?.es || city.conceptImage !== profile.file) {
    throw new Error(`Catálogo y encuadre sin sincronizar para ${id}.`);
  }
  labels[id] = city.name.es;
  originals[id] = city.originalConceptImage || profile.file;
  for (const file of [profile.file, originals[id]]) {
    if (!existsSync(new URL(file, art))) {
      throw new Error(`Falta la imagen de ${id}: ${file}`);
    }
  }
}
if (!Object.keys(labels).length) {
  throw new Error('El visor necesita al menos una ciudad.');
}
const target = new URL('docs/ciudades/encuadre.html', root);
const page = readFileSync(target, 'utf8');
const registration = /  const framing = [\s\S]*?(?=  let selected=)/;

if (!registration.test(page)) {
  throw new Error('No se encuentra el bloque de calibración del comparador.');
}

const data = [
  `  const framing = ${JSON.stringify(framing, null, 2)};`,
  `  const labels = ${JSON.stringify(labels, null, 2)};`,
  `  const originals = ${JSON.stringify(originals, null, 2)};`,
  '',
].join('\n');
writeFileSync(target, page.replace(registration, () => data));
console.log(`Comparador actualizado: ${Object.keys(labels).length} ciudades desde encuadre y catálogo.`);
buildCityCatalog({ catalog, framing, root });
