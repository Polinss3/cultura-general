// Genera constants/flags.ts a partir de esta tabla.
//
// Los nombres de país NO se escriben a mano: los saca Intl.DisplayNames del ICU
// de Node. Hermes (el motor de la app) no trae DisplayNames, así que se
// resuelven aquí, en build, y se commitean como datos.
//
// Uso:  node scripts/build-flags.mjs

import fs from 'node:fs';
import path from 'node:path';

// ─── Países por continente (ISO 3166-1 alpha-2) ──────────────────────────────
// Estados soberanos, que es lo que espera alguien jugando a banderas. Se dejan
// fuera territorios y dependencias para que "todas las banderas del mundo" no
// se llene de casos que nadie reconoce.

const CONTINENTS = {
  europa: [
    'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
    'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT',
    'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU',
    'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA',
  ],
  america: [
    'AG', 'AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU',
    'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 'MX', 'NI',
    'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'US', 'UY', 'VE',
  ],
  africa: [
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG',
    'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW',
    'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ',
    'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
    'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW',
  ],
  asia: [
    'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID',
    'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV',
    'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR',
    'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE',
  ],
  oceania: [
    'AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO',
    'TV', 'VU',
  ],
};

// ─── Dificultad ──────────────────────────────────────────────────────────────
// 1 = de sobra conocidas, 2 = intermedias, 3 = el resto (por defecto).
// Se etiqueta por notoriedad, no por tamaño: lo que decide si alguien reconoce
// una bandera es haberla visto, no la población del país.

const EASY = [
  'ES', 'FR', 'DE', 'IT', 'GB', 'PT', 'NL', 'BE', 'CH', 'SE', 'NO', 'DK',
  'FI', 'IE', 'AT', 'GR', 'PL', 'RU', 'UA', 'TR',
  'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'CU', 'VE', 'UY',
  'CN', 'JP', 'IN', 'KR', 'TH', 'VN', 'IL', 'SA',
  'AU', 'NZ',
  'EG', 'MA', 'ZA', 'NG', 'KE',
];

const MEDIUM = [
  'CZ', 'HU', 'RO', 'BG', 'HR', 'RS', 'SK', 'SI', 'IS', 'LU', 'MC', 'AD',
  'EE', 'LV', 'LT', 'BY', 'AL', 'BA', 'MT', 'CY', 'VA', 'ME', 'MK',
  'EC', 'BO', 'PY', 'CR', 'PA', 'GT', 'DO', 'JM', 'HN', 'NI', 'SV', 'HT',
  'ID', 'PH', 'MY', 'SG', 'PK', 'BD', 'IR', 'IQ', 'AE', 'QA', 'KW', 'LB',
  'JO', 'SY', 'AF', 'NP', 'LK', 'MM', 'KH', 'KZ', 'MN', 'KP', 'GE', 'AM',
  'DZ', 'TN', 'LY', 'ET', 'GH', 'SN', 'CI', 'CM', 'TZ', 'UG', 'ZW', 'AO',
  'MZ', 'ZM', 'SD', 'SO', 'MG',
  'FJ', 'PG',
];

// ─── Generación ──────────────────────────────────────────────────────────────

const LANGS = { es: 'es', en: 'en' };

function flagEmoji(cc) {
  return String.fromCodePoint(
    ...cc.toUpperCase().split('').map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

function difficultyOf(cc) {
  if (EASY.includes(cc)) return 1;
  if (MEDIUM.includes(cc)) return 2;
  return 3;
}

const displayNames = Object.fromEntries(
  Object.entries(LANGS).map(([key, locale]) => [
    key,
    new Intl.DisplayNames([locale], { type: 'region' }),
  ]),
);

// Nombres que el CLDR da con una forma que no encaja en un quiz: desambigua
// por capital ("Congo - Kinshasa") o arrastra el nombre antiguo entre
// paréntesis. Kosovo, además, no está como región en todos los locales.
const FALLBACK_NAMES = {
  XK: { es: 'Kosovo', en: 'Kosovo' },
  CD: { es: 'República Democrática del Congo', en: 'DR Congo' },
  CG: { es: 'República del Congo', en: 'Republic of the Congo' },
  MM: { es: 'Myanmar', en: 'Myanmar' },
  ST: { es: 'Santo Tomé y Príncipe', en: 'São Tomé and Príncipe' },
  KN: { es: 'San Cristóbal y Nieves', en: 'Saint Kitts and Nevis' },
  VC: { es: 'San Vicente y las Granadinas', en: 'Saint Vincent and the Grenadines' },
  AG: { es: 'Antigua y Barbuda', en: 'Antigua and Barbuda' },
  BA: { es: 'Bosnia y Herzegovina', en: 'Bosnia and Herzegovina' },
  TT: { es: 'Trinidad y Tobago', en: 'Trinidad and Tobago' },
};

const rows = [];
const seen = new Set();
const problems = [];

for (const [continent, codes] of Object.entries(CONTINENTS)) {
  for (const cc of codes) {
    if (seen.has(cc)) {
      problems.push(`${cc} duplicado`);
      continue;
    }
    seen.add(cc);

    const names = {};
    for (const lang of Object.keys(LANGS)) {
      let name = FALLBACK_NAMES[cc]?.[lang];
      if (!name) {
        name = displayNames[lang].of(cc);
        // Si el ICU no lo conoce devuelve el propio código.
        if (!name || name === cc) {
          problems.push(`${cc}: sin nombre en ${lang}`);
          name = cc;
        }
      }
      names[lang] = name;
    }

    rows.push({ cc, continent, difficulty: difficultyOf(cc), names });
  }
}

// Las listas de dificultad no pueden nombrar países que no estén en la tabla.
for (const cc of [...EASY, ...MEDIUM]) {
  if (!seen.has(cc)) problems.push(`${cc} está en EASY/MEDIUM pero no en ningún continente`);
}

if (problems.length > 0) {
  console.error('Problemas:\n  ' + problems.join('\n  '));
  process.exit(1);
}

rows.sort((a, b) => a.cc.localeCompare(b.cc));

const byContinent = Object.fromEntries(
  Object.keys(CONTINENTS).map(c => [c, rows.filter(r => r.continent === c).length]),
);
const byDifficulty = { 1: 0, 2: 0, 3: 0 };
for (const r of rows) byDifficulty[r.difficulty]++;

const out = `// @generated por scripts/build-flags.mjs — no editar a mano.
// Para cambiar países, continentes o dificultades, edita el script y vuelve a
// ejecutarlo: node scripts/build-flags.mjs

export type Continent = ${Object.keys(CONTINENTS).map(c => `'${c}'`).join(' | ')};

export interface Country {
  /** ISO 3166-1 alpha-2, en mayúsculas. */
  cc: string;
  continent: Continent;
  /** 1 = conocida, 2 = intermedia, 3 = difícil. */
  difficulty: 1 | 2 | 3;
  name: { es: string; en: string };
}

export const CONTINENTS: Continent[] = [${Object.keys(CONTINENTS).map(c => `'${c}'`).join(', ')}];

/** Emoji de bandera a partir del código ISO (pares de indicadores regionales). */
export function flagEmoji(cc: string): string {
  return String.fromCodePoint(
    ...cc.toUpperCase().split('').map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

export const COUNTRIES: Country[] = [
${rows.map(r =>
  `  { cc: '${r.cc}', continent: '${r.continent}', difficulty: ${r.difficulty}, name: { es: ${JSON.stringify(r.names.es)}, en: ${JSON.stringify(r.names.en)} } },`
).join('\n')}
];
`;

const target = path.join(process.cwd(), 'constants', 'flags.ts');
fs.writeFileSync(target, out);

console.log(`✅ ${rows.length} países → constants/flags.ts`);
console.log('   por continente:', byContinent);
console.log('   por dificultad:', byDifficulty);
console.log('   muestra:', rows.slice(0, 3).map(r => `${flagEmoji(r.cc)} ${r.names.es}`).join('  '));
