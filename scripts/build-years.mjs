// Genera constants/years.ts a partir de esta tabla.
//
// Uso:  node scripts/build-years.mjs
//
// ─── De dónde sale esta tabla ────────────────────────────────────────────────
// El grueso se extrajo del banco de preguntas con scripts/mine-year-questions.mjs,
// que localiza las preguntas cuya respuesta es un año y las empareja con su
// traducción de supabase/questions_en.sql. Pero el banco NO se lee en tiempo de
// build: lo minado se curó a mano y vive aquí como dato, igual que los países en
// build-flags.mjs. Vuelve a pasar el minador cuando crezca el banco y añade a
// mano lo que falte.
//
// ─── Por qué el texto es un sintagma nominal ─────────────────────────────────
// "La caída del Muro de Berlín", no "¿En qué año cayó el Muro de Berlín?". El
// modo pregunta en los dos sentidos (evento → año y año → evento) y solo un
// sintagma nominal se lee bien en ambos: como enunciado y como opción de una
// lista. Convertir la pregunta al vuelo no es viable, sobre todo en inglés,
// donde "did the Wall fall" → "the Wall fell" exige conjugar.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Catálogo ────────────────────────────────────────────────────────────────
// d = dificultad: 1 de sobra conocida, 2 intermedia, 3 para quien controla.
// cat = una de las 13 categorías de la app; alimenta la mezcla de Aprender.
// year negativo = a.C.

const EVENTS = [
  // ── Antigüedad y Edad Media ──
  { id: 'cesar-asesinato',      year:  -44, cat: 'historia',   d: 2, es: 'El asesinato de Julio César',                        en: 'The assassination of Julius Caesar' },
  { id: 'vesubio-pompeya',      year:   79, cat: 'historia',   d: 2, es: 'La erupción del Vesubio que sepultó Pompeya',        en: 'The eruption of Vesuvius that buried Pompeii' },
  { id: 'roma-caida-occidente', year:  476, cat: 'historia',   d: 3, es: 'La caída del Imperio Romano de Occidente',           en: 'The fall of the Western Roman Empire' },
  { id: 'hastings',             year: 1066, cat: 'historia',   d: 3, es: 'La batalla de Hastings',                             en: 'The Battle of Hastings' },
  { id: 'carta-magna',          year: 1215, cat: 'historia',   d: 3, es: 'La firma de la Carta Magna en Inglaterra',           en: 'The signing of the Magna Carta in England' },
  { id: 'peste-negra',          year: 1348, cat: 'historia',   d: 3, es: 'La llegada de la peste negra a Europa',              en: 'The arrival of the Black Death in Europe' },
  { id: 'constantinopla',       year: 1453, cat: 'historia',   d: 2, es: 'La caída de Constantinopla',                         en: 'The fall of Constantinople' },
  { id: 'biblia-gutenberg',     year: 1455, cat: 'tecnologia', d: 3, es: 'La impresión de la Biblia de Gutenberg',             en: 'The printing of the Gutenberg Bible' },

  // ── Edad Moderna ──
  { id: 'colon-america',        year: 1492, cat: 'historia',   d: 1, es: 'La llegada de Cristóbal Colón a América',            en: 'Christopher Columbus reaching America' },
  { id: 'lutero-tesis',         year: 1517, cat: 'historia',   d: 3, es: 'Las 95 tesis de Lutero',                             en: "Luther's 95 Theses" },
  { id: 'vuelta-al-mundo',      year: 1522, cat: 'historia',   d: 2, es: 'La primera vuelta al mundo, completada por Elcano',  en: 'The first circumnavigation of the globe, completed by Elcano' },
  { id: 'armada-invencible',    year: 1588, cat: 'historia',   d: 3, es: 'La derrota de la Armada Invencible',                 en: 'The defeat of the Spanish Armada' },
  { id: 'quijote-primera',      year: 1605, cat: 'literatura', d: 2, es: 'La publicación de la primera parte del Quijote',     en: 'The publication of the first part of Don Quixote' },
  { id: 'newton-principia',     year: 1687, cat: 'ciencia',    d: 3, es: 'La publicación de los «Principia» de Newton',        en: "The publication of Newton's 'Principia'" },
  { id: 'terremoto-lisboa',     year: 1755, cat: 'historia',   d: 3, es: 'El terremoto de Lisboa',                             en: 'The Lisbon earthquake' },
  { id: 'eeuu-independencia',   year: 1776, cat: 'historia',   d: 1, es: 'La independencia de Estados Unidos',                 en: 'The independence of the United States' },
  { id: 'revolucion-francesa',  year: 1789, cat: 'historia',   d: 1, es: 'El comienzo de la Revolución Francesa',              en: 'The start of the French Revolution' },
  { id: 'mozart-muerte',        year: 1791, cat: 'musica',     d: 2, es: 'La muerte de Mozart',                                en: 'The death of Mozart' },

  // ── Siglo XIX ──
  { id: 'napoleon-coronacion',  year: 1804, cat: 'historia',   d: 2, es: 'La coronación de Napoleón como emperador',           en: "Napoleon's coronation as emperor" },
  { id: 'waterloo',             year: 1815, cat: 'historia',   d: 2, es: 'La batalla de Waterloo',                             en: 'The Battle of Waterloo' },
  { id: 'darwin-especies',      year: 1859, cat: 'ciencia',    d: 2, es: 'La publicación de «El origen de las especies»',      en: "The publication of 'On the Origin of Species'" },
  { id: 'cruz-roja',            year: 1863, cat: 'historia',   d: 3, es: 'La fundación de la Cruz Roja',                       en: 'The founding of the Red Cross' },
  { id: 'lincoln-asesinato',    year: 1865, cat: 'historia',   d: 2, es: 'El asesinato de Abraham Lincoln',                    en: 'The assassination of Abraham Lincoln' },
  { id: 'canal-suez',           year: 1869, cat: 'historia',   d: 3, es: 'La apertura del canal de Suez',                      en: 'The opening of the Suez Canal' },
  { id: 'telefono-bell',        year: 1876, cat: 'tecnologia', d: 2, es: 'La patente del teléfono de Alexander Graham Bell',   en: "Alexander Graham Bell's telephone patent" },
  { id: 'coca-cola',            year: 1886, cat: 'tecnologia', d: 3, es: 'La invención de la Coca-Cola',                       en: 'The invention of Coca-Cola' },
  { id: 'torre-eiffel',         year: 1889, cat: 'arte',       d: 2, es: 'La construcción de la Torre Eiffel',                 en: 'The building of the Eiffel Tower' },
  { id: 'voleibol',             year: 1895, cat: 'deportes',   d: 3, es: 'La invención del voleibol',                          en: 'The invention of volleyball' },
  { id: 'jjoo-modernos',        year: 1896, cat: 'deportes',   d: 2, es: 'Los primeros Juegos Olímpicos modernos, en Atenas',  en: 'The first modern Olympic Games, in Athens' },
  { id: 'electron',             year: 1897, cat: 'ciencia',    d: 3, es: 'El descubrimiento del electrón',                     en: 'The discovery of the electron' },
  { id: 'fc-barcelona',         year: 1899, cat: 'deportes',   d: 2, es: 'La fundación del FC Barcelona',                      en: 'The founding of FC Barcelona' },

  // ── Siglo XX ──
  { id: 'futbol-olimpico',      year: 1900, cat: 'deportes',   d: 3, es: 'El debut del fútbol como deporte olímpico',          en: 'The debut of football as an Olympic sport' },
  { id: 'real-madrid',          year: 1902, cat: 'deportes',   d: 2, es: 'La fundación del Real Madrid',                       en: 'The founding of Real Madrid' },
  { id: 'fifa',                 year: 1904, cat: 'deportes',   d: 2, es: 'La fundación de la FIFA',                            en: 'The founding of FIFA' },
  { id: 'revolucion-rusa',      year: 1917, cat: 'historia',   d: 2, es: 'La Revolución Rusa',                                 en: 'The Russian Revolution' },
  { id: 'ww1-final',            year: 1918, cat: 'historia',   d: 1, es: 'El final de la Primera Guerra Mundial',              en: 'The end of World War I' },
  { id: 'versalles',            year: 1919, cat: 'historia',   d: 2, es: 'La firma del Tratado de Versalles',                  en: 'The signing of the Treaty of Versailles' },
  { id: 'jjoo-invierno',        year: 1924, cat: 'deportes',   d: 3, es: 'Los primeros Juegos Olímpicos de Invierno',          en: 'The first Winter Olympic Games' },
  { id: 'primer-mundial',       year: 1930, cat: 'deportes',   d: 2, es: 'El primer Mundial de fútbol',                        en: 'The first football World Cup' },
  { id: 'elvis-nacimiento',     year: 1935, cat: 'musica',     d: 3, es: 'El nacimiento de Elvis Presley',                     en: 'The birth of Elvis Presley' },
  { id: 'lorca-asesinato',      year: 1936, cat: 'literatura', d: 2, es: 'El asesinato de Federico García Lorca',              en: 'The murder of Federico García Lorca' },
  { id: 'ww2-final',            year: 1945, cat: 'historia',   d: 1, es: 'El final de la Segunda Guerra Mundial',              en: 'The end of World War II' },
  { id: 'onu',                  year: 1945, cat: 'historia',   d: 2, es: 'La fundación de la ONU',                             en: 'The founding of the UN' },
  { id: 'nba',                  year: 1946, cat: 'deportes',   d: 3, es: 'La fundación de la NBA',                             en: 'The founding of the NBA' },
  { id: 'india-independencia',  year: 1947, cat: 'historia',   d: 2, es: 'La independencia de la India',                       en: 'The independence of India' },
  { id: 'ddhh',                 year: 1948, cat: 'historia',   d: 2, es: 'La Declaración Universal de los Derechos Humanos',   en: 'The Universal Declaration of Human Rights' },
  { id: 'otan',                 year: 1949, cat: 'historia',   d: 2, es: 'La fundación de la OTAN',                            en: 'The founding of NATO' },
  { id: 'bannister-milla',      year: 1954, cat: 'deportes',   d: 3, es: 'La primera milla por debajo de cuatro minutos',      en: 'The first sub-four-minute mile' },
  { id: 'pacto-varsovia',       year: 1955, cat: 'historia',   d: 3, es: 'La firma del Pacto de Varsovia',                     en: 'The signing of the Warsaw Pact' },
  { id: 'sputnik',              year: 1957, cat: 'astronomia', d: 2, es: 'El lanzamiento del Sputnik 1, primer satélite',      en: 'The launch of Sputnik 1, the first satellite' },
  { id: 'revolucion-cubana',    year: 1959, cat: 'historia',   d: 2, es: 'La Revolución Cubana',                               en: 'The Cuban Revolution' },
  { id: 'paralimpicos',         year: 1960, cat: 'deportes',   d: 3, es: 'Los primeros Juegos Paralímpicos',                   en: 'The first Paralympic Games' },
  { id: 'kennedy-asesinato',    year: 1963, cat: 'historia',   d: 2, es: 'El asesinato de John F. Kennedy',                    en: 'The assassination of John F. Kennedy' },
  { id: 'super-bowl',           year: 1967, cat: 'deportes',   d: 3, es: 'La primera Super Bowl',                              en: 'The first Super Bowl' },
  { id: 'alunizaje',            year: 1969, cat: 'astronomia', d: 1, es: 'La llegada del ser humano a la Luna',                en: 'Humans reaching the Moon' },
  { id: 'beatles-separacion',   year: 1970, cat: 'musica',     d: 2, es: 'La separación de The Beatles',                       en: 'The break-up of The Beatles' },
  { id: 'apolo-ultima',         year: 1972, cat: 'astronomia', d: 3, es: 'La última misión Apolo tripulada a la Luna',         en: 'The last crewed Apollo mission to the Moon' },
  { id: 'apple',                year: 1976, cat: 'tecnologia', d: 2, es: 'La fundación de Apple',                              en: 'The founding of Apple' },
  { id: 'star-wars',            year: 1977, cat: 'cine',       d: 2, es: 'El estreno de la primera «Star Wars»',               en: "The release of the first 'Star Wars'" },
  { id: 'elvis-muerte',         year: 1977, cat: 'musica',     d: 2, es: 'La muerte de Elvis Presley',                         en: 'The death of Elvis Presley' },
  { id: 'constitucion-es',      year: 1978, cat: 'historia',   d: 2, es: 'La promulgación de la Constitución española vigente', en: 'The enactment of the current Spanish Constitution' },
  { id: 'nba-triple',           year: 1979, cat: 'deportes',   d: 3, es: 'La introducción de la línea de tres puntos en la NBA', en: 'The introduction of the 3-point line in the NBA' },
  { id: 'nobel-garcia-marquez', year: 1982, cat: 'literatura', d: 2, es: 'El Nobel de Literatura de García Márquez',           en: "García Márquez's Nobel Prize in Literature" },
  { id: 'macintosh',            year: 1984, cat: 'tecnologia', d: 2, es: 'El lanzamiento del primer Macintosh',                en: 'The launch of the first Macintosh' },
  { id: 'mundial-rugby',        year: 1987, cat: 'deportes',   d: 3, es: 'El primer Mundial de Rugby',                         en: 'The first Rugby World Cup' },
  { id: 'muro-berlin',          year: 1989, cat: 'historia',   d: 1, es: 'La caída del Muro de Berlín',                        en: 'The fall of the Berlin Wall' },
  { id: 'nobel-cela',           year: 1989, cat: 'literatura', d: 2, es: 'El Nobel de Literatura de Camilo José Cela',         en: "Camilo José Cela's Nobel Prize in Literature" },
  { id: 'alemania-reunificada', year: 1990, cat: 'historia',   d: 2, es: 'La reunificación de Alemania',                       en: 'The reunification of Germany' },
  { id: 'urss-disolucion',      year: 1991, cat: 'historia',   d: 2, es: 'La disolución de la Unión Soviética',                en: 'The dissolution of the Soviet Union' },
  { id: 'mundial-femenino',     year: 1991, cat: 'deportes',   d: 2, es: 'El primer Mundial de fútbol femenino',               en: "The first Women's Football World Cup" },
  { id: 'jjoo-barcelona',       year: 1992, cat: 'deportes',   d: 1, es: 'Los Juegos Olímpicos de Barcelona',                  en: 'The Barcelona Olympic Games' },
  { id: 'cobain-muerte',        year: 1994, cat: 'musica',     d: 3, es: 'La muerte de Kurt Cobain',                           en: 'The death of Kurt Cobain' },
  { id: 'amazon',               year: 1994, cat: 'tecnologia', d: 2, es: 'La fundación de Amazon',                             en: 'The founding of Amazon' },
  { id: 'windows-95',           year: 1995, cat: 'tecnologia', d: 2, es: 'El lanzamiento de Windows 95',                       en: 'The release of Windows 95' },
  { id: 'futbol-fem-olimpico',  year: 1996, cat: 'deportes',   d: 3, es: 'El debut del fútbol femenino en los Juegos Olímpicos', en: "The debut of women's football at the Olympics" },
  { id: 'titanic-pelicula',     year: 1997, cat: 'cine',       d: 1, es: 'El estreno de «Titanic»',                            en: "The release of 'Titanic'" },
  { id: 'google',               year: 1998, cat: 'tecnologia', d: 2, es: 'La fundación de Google',                             en: 'The founding of Google' },

  // ── Siglo XXI ──
  { id: 'torres-gemelas',       year: 2001, cat: 'historia',   d: 1, es: 'Los atentados del 11-S contra las Torres Gemelas',   en: 'The 9/11 attacks on the Twin Towers' },
  { id: 'windows-xp',           year: 2001, cat: 'tecnologia', d: 3, es: 'El lanzamiento de Windows XP',                       en: 'The release of Windows XP' },
  { id: 'euro-circulacion',     year: 2002, cat: 'historia',   d: 2, es: 'La entrada en circulación del euro',                 en: 'The euro entering circulation' },
  { id: 'messi-debut',          year: 2004, cat: 'deportes',   d: 2, es: 'El debut de Lionel Messi con el FC Barcelona',       en: "Lionel Messi's debut with FC Barcelona" },
  { id: 'facebook',             year: 2004, cat: 'tecnologia', d: 2, es: 'La fundación de Facebook',                           en: 'The founding of Facebook' },
  { id: 'youtube',              year: 2005, cat: 'tecnologia', d: 2, es: 'La fundación de YouTube',                            en: 'The founding of YouTube' },
  { id: 'pluton-planeta',       year: 2006, cat: 'astronomia', d: 2, es: 'La pérdida de la condición de planeta de Plutón',    en: "Pluto's loss of planet status" },
  { id: 'iphone',               year: 2007, cat: 'tecnologia', d: 1, es: 'El lanzamiento del primer iPhone',                   en: 'The launch of the first iPhone' },
  { id: 'bitcoin-whitepaper',   year: 2008, cat: 'tecnologia', d: 2, es: 'La publicación del whitepaper de Bitcoin',           en: 'The publication of the Bitcoin whitepaper' },
  { id: 'avatar-pelicula',      year: 2009, cat: 'cine',       d: 2, es: 'El estreno de «Avatar»',                             en: "The release of 'Avatar'" },
  { id: 'espana-mundial',       year: 2010, cat: 'deportes',   d: 1, es: 'El único Mundial de fútbol masculino ganado por España', en: "Spain's only men's football World Cup win" },
  { id: 'jobs-muerte',          year: 2011, cat: 'tecnologia', d: 2, es: 'La muerte de Steve Jobs',                            en: 'The death of Steve Jobs' },
  { id: 'netflix-originales',   year: 2013, cat: 'tecnologia', d: 3, es: 'Las primeras series originales de Netflix',          en: "Netflix's first original series" },
  { id: 'usb-c',                year: 2014, cat: 'tecnologia', d: 3, es: 'El lanzamiento del USB-C',                           en: 'The launch of USB-C' },
  { id: 'ethereum',             year: 2015, cat: 'tecnologia', d: 3, es: 'El lanzamiento de Ethereum',                         en: 'The launch of Ethereum' },
  { id: 'tiktok',               year: 2017, cat: 'tecnologia', d: 3, es: 'El lanzamiento internacional de TikTok',             en: 'The international launch of TikTok' },
  { id: 'var-liga',             year: 2018, cat: 'deportes',   d: 3, es: 'La introducción del VAR en la Liga española',        en: 'The introduction of VAR in the Spanish league' },
  { id: 'covid-pandemia',       year: 2020, cat: 'historia',   d: 1, es: 'La declaración de pandemia de COVID-19 por la OMS',  en: 'The WHO declaring COVID-19 a pandemic' },
  { id: 'jjoo-tokio',           year: 2021, cat: 'deportes',   d: 2, es: 'Los Juegos Olímpicos de Tokio, aplazados por la pandemia', en: 'The Tokyo Olympic Games, postponed by the pandemic' },
  { id: 'windows-11',           year: 2021, cat: 'tecnologia', d: 3, es: 'El lanzamiento de Windows 11',                       en: 'The release of Windows 11' },
  { id: 'ucrania-invasion',     year: 2022, cat: 'historia',   d: 1, es: 'El comienzo de la invasión rusa de Ucrania',         en: 'The start of the Russian invasion of Ukraine' },
];

// ─── Qué se dejó fuera del minado, y por qué ─────────────────────────────────
// · "¿En qué año aterrizó el Apolo 11?" y "¿…pisó el ser humano la Luna?": son
//   el mismo hecho que `alunizaje`. Tres eventos con el mismo año harían que en
//   el sentido año → evento hubiera varias opciones correctas a la vez.
// · "Inicio de la Revolución Industrial (aprox.)": un año aproximado no vale
//   para un modo que exige la cifra exacta.
// · "Última Copa del Rey del Athletic (antes de 2024)": el enunciado ya nació
//   caducado y envejece cada temporada.
// · "¿En qué año se popularizó masivamente Zoom?": "popularizarse" no es un
//   hecho con fecha. Se sustituyó por la declaración de pandemia de la OMS.

// ─── Validación y generación ─────────────────────────────────────────────────

const CATEGORIES = new Set([
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes', 'biologia',
  'cine', 'musica', 'literatura', 'tecnologia', 'mitologia', 'astronomia',
]);

const CURRENT_YEAR = new Date().getFullYear();
const errors = [];
const seenIds = new Set();

for (const e of EVENTS) {
  if (seenIds.has(e.id)) errors.push(`id duplicado: ${e.id}`);
  seenIds.add(e.id);
  if (!/^[a-z0-9-]+$/.test(e.id)) errors.push(`id no kebab-case: ${e.id}`);
  if (!Number.isInteger(e.year) || e.year > CURRENT_YEAR) errors.push(`año inválido en ${e.id}: ${e.year}`);
  if (![1, 2, 3].includes(e.d)) errors.push(`dificultad inválida en ${e.id}: ${e.d}`);
  if (!CATEGORIES.has(e.cat)) errors.push(`categoría desconocida en ${e.id}: ${e.cat}`);
  if (!e.es?.trim() || !e.en?.trim()) errors.push(`falta texto es/en en ${e.id}`);
}

if (errors.length) {
  console.error('✗ Errores en el catálogo:\n  ' + errors.join('\n  '));
  process.exit(1);
}

// Diagnóstico por época. No condiciona la generación: el selector agrupa tramos
// en lib/years.ts. Sirve para saber CUÁNDO merece la pena separar más épocas.
const ERA_OF = y =>
  y < 500 ? 'antigüedad' : y < 1492 ? 'edad media' : y < 1789 ? 'moderna'
  : y < 1900 ? 's. XIX' : y < 2000 ? 's. XX' : 's. XXI';

const byEra = {};
for (const e of EVENTS) byEra[ERA_OF(e.year)] = (byEra[ERA_OF(e.year)] ?? 0) + 1;

// Años repetidos: legítimos (1945 tiene dos hitos), pero el generador de rondas
// nunca debe poner dos eventos del mismo año como opciones de la misma pregunta.
const byYear = {};
for (const e of EVENTS) (byYear[e.year] ??= []).push(e.id);
const collisions = Object.entries(byYear).filter(([, ids]) => ids.length > 1);

const sorted = [...EVENTS].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));

const body = sorted.map(e =>
  `  { id: ${pad(q(e.id) + ',', 26)} year: ${String(e.year).padStart(5)}, difficulty: ${e.d}, ` +
  `category: ${pad(q(e.cat) + ',', 14)} text: { es: ${q(e.es)}, en: ${q(e.en)} } },`
).join('\n');

const out = `// @generado por scripts/build-years.mjs — no editar a mano.
// Para cambiar eventos, años o dificultades, edita el script y vuelve a
// ejecutarlo: node scripts/build-years.mjs

import type { Category } from '@/types';

export interface YearEvent {
  /** Estable: se usa para el historial de "ya vistas" en Aprender. */
  id: string;
  /** Negativo = a.C. */
  year: number;
  /** 1 = de sobra conocido, 2 = intermedio, 3 = para quien controla. */
  difficulty: 1 | 2 | 3;
  /** Alimenta la mezcla por temas de Aprender. */
  category: Category;
  /**
   * Sintagma nominal, no pregunta: tiene que leerse bien como enunciado
   * ("¿En qué año fue…?") y como opción de una lista ("¿Qué pasó en 1989?").
   */
  text: { es: string; en: string };
}

export const YEAR_EVENTS: YearEvent[] = [
${body}
];
`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
fs.writeFileSync(path.join(root, 'constants/years.ts'), out);

console.log(`✓ constants/years.ts — ${EVENTS.length} eventos`);
console.log('  Por época:', byEra);
if (collisions.length) {
  console.log(`  Años compartidos (${collisions.length}):`,
    collisions.map(([y, ids]) => `${y}→${ids.join('/')}`).join(', '));
}
