import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const framing = JSON.parse(readFileSync(new URL('constants/cityDioramaFraming.json', root), 'utf8'));
const target = new URL('docs/ciudades/encuadre.html', root);
const page = readFileSync(target, 'utf8');
const registration = /(const framing = )[\s\S]*?(;\n  const labels =)/;

if (!registration.test(page)) {
  throw new Error('No se encuentra el bloque de calibración del comparador.');
}

writeFileSync(target, page.replace(registration, (_match, prefix, suffix) =>
  prefix + JSON.stringify(framing, null, 2) + suffix,
));
console.log('Comparador actualizado desde constants/cityDioramaFraming.json.');
