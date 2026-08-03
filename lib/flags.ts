import AsyncStorage from '@react-native-async-storage/async-storage';
import { COUNTRIES, type Continent, type Country } from '@/constants/flags';
import { getCurrentLang } from './i18n';

// ─── Selección de partida ────────────────────────────────────────────────────

export type FlagDifficulty = 'all' | 1 | 2 | 3;
/** 'flagToName' = bandera arriba y nombres debajo. 'nameToFlag' = al revés. */
export type FlagDirection = 'flagToName' | 'nameToFlag';

export const ROUND_SIZE = 10;
const OPTIONS = 4;

export interface FlagQuestion {
  direction: FlagDirection;
  answer: Country;
  /** Las 4 opciones ya barajadas; una de ellas es `answer`. */
  options: Country[];
}

export function countryName(c: Country): string {
  return getCurrentLang() === 'en' ? c.name.en : c.name.es;
}

export function poolFor(continent: Continent | 'all', difficulty: FlagDifficulty): Country[] {
  return COUNTRIES.filter(c =>
    (continent === 'all' || c.continent === continent) &&
    (difficulty === 'all' || c.difficulty === difficulty),
  );
}

// ─── Distractores ────────────────────────────────────────────────────────────
// Cuatro países al azar convierten la pregunta en un regalo. Los rivales tienen
// que ser plausibles: primero banderas que se confunden de verdad, luego del
// mismo continente, y solo al final relleno.

/**
 * Parejas y grupos que se confunden a ojo: mismos colores, misma disposición o
 * diferencias de detalle. Es lo que hace difícil un test de banderas.
 */
const LOOKALIKES: string[][] = [
  ['TD', 'RO', 'MD', 'AD'],        // tricolores azul-amarillo-rojo
  ['ID', 'MC', 'PL', 'SG'],        // rojo y blanco en dos franjas
  ['NL', 'LU', 'RU', 'HR'],        // tricolores horizontales rojo-blanco-azul
  ['IE', 'CI', 'IT', 'MX'],        // tricolores verticales verde-blanco-naranja/rojo
  ['NO', 'IS', 'DK', 'FI', 'SE'],  // cruces nórdicas
  ['AU', 'NZ', 'FJ', 'TV'],        // Union Jack en el cantón
  ['VE', 'CO', 'EC'],              // amarillo-azul-rojo de la Gran Colombia
  ['SV', 'NI', 'HN', 'GT', 'AR'],  // azul-blanco-azul centroamericanas
  ['SN', 'ML', 'GN', 'CM'],        // panafricanas verticales
  ['ET', 'GH', 'BJ', 'TG', 'GW'],  // panafricanas rojo-amarillo-verde
  ['EG', 'SY', 'IQ', 'YE', 'SD'],  // rojo-blanco-negro árabes
  ['AT', 'LV', 'PE', 'CA'],        // franjas rojo-blanco-rojo
  ['CL', 'CU'],                    // estrella blanca sobre cantón
  ['MY', 'US', 'LR'],              // barras y estrellas
  ['SK', 'SI', 'RS', 'CZ'],        // eslavas azul-blanco-rojo con escudo
  ['AE', 'KW', 'JO', 'PS', 'SS'],  // rojo-verde-blanco-negro
  ['BE', 'DE', 'CD'],              // negro-amarillo-rojo
  ['ES', 'PT'],
  ['CN', 'VN', 'MA', 'TR', 'TN'],  // rojo con estrella/creciente
  ['IN', 'NE'],                    // naranja-blanco-verde con círculo
  ['JP', 'BD', 'PW'],              // disco centrado sobre fondo liso
  ['CH', 'DK'],                    // cruz centrada
];

const lookalikeIndex = new Map<string, Set<string>>();
for (const group of LOOKALIKES) {
  for (const cc of group) {
    const set = lookalikeIndex.get(cc) ?? new Set<string>();
    for (const other of group) if (other !== cc) set.add(other);
    lookalikeIndex.set(cc, set);
  }
}

const byCode = new Map(COUNTRIES.map(c => [c.cc, c]));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Rivales para `answer`, tomados en este orden: banderas que se le parecen, del
 * mismo continente, y por último cualquiera. `pool` acota de dónde se puede
 * sacar cuando el jugador ha elegido un continente concreto.
 */
export function distractorsFor(answer: Country, pool: Country[]): Country[] {
  const picked: Country[] = [];
  const used = new Set([answer.cc]);

  const take = (candidates: Country[]) => {
    for (const c of shuffle(candidates)) {
      if (picked.length >= OPTIONS - 1) return;
      if (used.has(c.cc)) continue;
      used.add(c.cc);
      picked.push(c);
    }
  };

  // 1. Las que se confunden de verdad, aunque estén fuera del pool: si juegas
  //    "Europa" y sale Rumanía, Chad es el mejor rival aunque sea africano.
  const lookalikes = [...(lookalikeIndex.get(answer.cc) ?? [])]
    .map(cc => byCode.get(cc))
    .filter((c): c is Country => !!c);
  take(lookalikes);

  // 2. Mismo continente.
  take(pool.filter(c => c.continent === answer.continent));

  // 3. Relleno: el pool entero y, si aún falta, el mundo.
  take(pool);
  take(COUNTRIES);

  return picked;
}

export function buildRound(
  continent: Continent | 'all',
  difficulty: FlagDifficulty,
  size = ROUND_SIZE,
): FlagQuestion[] {
  const pool = poolFor(continent, difficulty);
  if (pool.length < OPTIONS) return [];

  const answers = shuffle(pool).slice(0, Math.min(size, pool.length));

  return answers.map((answer, i) => ({
    // Se alternan los dos sentidos: la bandera arriba con nombres debajo, y el
    // nombre arriba con banderas en rejilla. Cada uno usa el layout que le va.
    direction: i % 2 === 0 ? 'flagToName' : 'nameToFlag',
    answer,
    options: shuffle([answer, ...distractorsFor(answer, pool)]),
  }));
}

// ─── Récords por continente ──────────────────────────────────────────────────

const RECORDS_KEY = 'flag_records_v1';

export type FlagRecords = Partial<Record<Continent | 'all', number>>;

export async function getFlagRecords(): Promise<FlagRecords> {
  try {
    const raw = await AsyncStorage.getItem(RECORDS_KEY);
    return raw ? (JSON.parse(raw) as FlagRecords) : {};
  } catch {
    return {};
  }
}

/** Guarda el récord si mejora al anterior. Devuelve true si era nuevo récord. */
export async function saveFlagRecord(
  key: Continent | 'all',
  correct: number,
): Promise<boolean> {
  try {
    const records = await getFlagRecords();
    if ((records[key] ?? 0) >= correct) return false;
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify({ ...records, [key]: correct }));
    return true;
  } catch {
    return false;
  }
}
