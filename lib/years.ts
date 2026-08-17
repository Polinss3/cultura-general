import AsyncStorage from '@react-native-async-storage/async-storage';
import { YEAR_EVENTS, type YearEvent } from '@/constants/years';
import { shuffle } from './utils';
import { getCurrentLang } from './i18n';

// ─── Selección de partida ────────────────────────────────────────────────────

export type YearDifficulty = 'all' | 1 | 2 | 3;
/** 'eventToYear' = evento arriba y años en rejilla. 'yearToEvent' = al revés. */
export type YearDirection = 'eventToYear' | 'yearToEvent';

export const ROUND_SIZE = 10;
const OPTIONS = 4;
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Tramos del selector. El catálogo está muy concentrado en el siglo XX, así que
 * de momento se agrupa todo lo anterior a 1900 en un solo tramo: separar las
 * seis épocas dejaría cuatro celdas con menos eventos que una ronda. Cuando el
 * catálogo crezca, partir este array es lo único que hay que tocar —
 * `scripts/build-years.mjs` imprime el reparto por época para saber cuándo.
 */
export interface EraScope {
  id: string;
  icon: string;
  from: number;
  to: number;
}

export const ERAS: EraScope[] = [
  { id: 'preXX', icon: '🏛️', from: -Infinity, to: 1899 },
  { id: 'xx',    icon: '📻', from: 1900,       to: 1999 },
  { id: 'xxi',   icon: '📱', from: 2000,       to: Infinity },
];

export type Scope = string | 'all';

export interface YearQuestion {
  /**
   * Las dos direcciones no comparten forma: en una las opciones son años y en
   * la otra son eventos. Una unión discriminada evita el tipo común artificial
   * y hace que la pantalla no pueda leer el campo equivocado.
   */
  direction: YearDirection;
  answer: YearEvent;
  /** Solo en 'eventToYear': los 4 años ya barajados. */
  years?: number[];
  /** Solo en 'yearToEvent': los 4 eventos ya barajados. */
  events?: YearEvent[];
}

export function eventText(e: YearEvent): string {
  return getCurrentLang() === 'en' ? e.text.en : e.text.es;
}

/** "1989", "44 a.C." / "44 BC". No hay año 0. */
export function formatYear(year: number): string {
  if (year >= 0) return String(year);
  return getCurrentLang() === 'en' ? `${-year} BC` : `${-year} a.C.`;
}

export function eraOf(year: number): EraScope | undefined {
  return ERAS.find(e => year >= e.from && year <= e.to);
}

export function poolFor(scope: Scope, difficulty: YearDifficulty): YearEvent[] {
  const era = scope === 'all' ? null : ERAS.find(e => e.id === scope);
  return YEAR_EVENTS.filter(e =>
    (!era || (e.year >= era.from && e.year <= era.to)) &&
    (difficulty === 'all' || e.difficulty === difficulty),
  );
}

// ─── Distractores ────────────────────────────────────────────────────────────
// Es lo que separa un test de años de un regalo. Si la respuesta es 1989 y las
// otras opciones son 1492, 1789 y 2001, no hace falta saber la fecha: basta con
// situar el hecho en el siglo. Los rivales tienen que caer lo bastante cerca
// como para que haya que acordarse del año de verdad.

/**
 * Cuánto se pueden separar los años rivales, según lo lejano que sea el hecho.
 * Nadie discute si la caída de Roma fue en 476 o en 478, pero sí si el primer
 * iPhone salió en 2006 o en 2007: cuanto más reciente, más fina la ventana.
 */
function spreadFor(year: number): [min: number, max: number] {
  if (year >= 1900) return [1, 12];
  if (year >= 1800) return [3, 25];
  if (year >= 1500) return [8, 40];
  if (year >= 1000) return [15, 70];
  return [25, 120];
}

/**
 * Tres años rivales alrededor de `year`. Sintéticos a propósito: un año no
 * necesita corresponder a ningún evento del catálogo para ser una opción
 * plausible, y generarlos evita quedarse sin rivales en los tramos con pocos
 * eventos.
 */
export function distractorYears(year: number): number[] {
  const [min, max] = spreadFor(year);
  const used = new Set<number>([year]);
  const out: number[] = [];

  const place = (sign: -1 | 1): boolean => {
    for (let attempt = 0; attempt < 40; attempt++) {
      const delta = min + Math.floor(Math.random() * (max - min + 1));
      const candidate = year + sign * delta;
      // Un año futuro delata la respuesta al instante; el año 0 no existe.
      if (candidate > CURRENT_YEAR || candidate === 0 || used.has(candidate)) continue;
      used.add(candidate);
      out.push(candidate);
      return true;
    }
    return false;
  };

  // Cuántos rivales van por debajo del año correcto (0 a 3), sorteado de una
  // vez. Es lo que reparte la respuesta por las cuatro posiciones: si cada
  // rival tirase su signo por separado, la correcta quedaría en medio el 78 %
  // de las veces y bastaría con no elegir nunca los extremos para acertar muy
  // por encima del azar.
  const below = Math.floor(Math.random() * OPTIONS);
  for (let i = 0; i < OPTIONS - 1; i++) {
    const sign: -1 | 1 = i < below ? -1 : 1;
    // Con hechos muy recientes el lado de arriba se queda sin sitio (choca con
    // el año actual): en ese caso se cae al otro lado en vez de dejar hueco.
    if (!place(sign)) place(sign === -1 ? 1 : -1);
  }

  // Relleno determinista por si ambos lados se atascaran.
  for (let step = 1; out.length < OPTIONS - 1; step++) {
    const candidate = year - step;
    if (candidate === 0 || used.has(candidate)) continue;
    used.add(candidate);
    out.push(candidate);
  }

  return out;
}

/**
 * Tres eventos rivales para el sentido año → evento. Del mismo tramo cuando se
 * puede, y NUNCA del mismo año que la respuesta: el catálogo tiene años
 * compartidos (1945 son el fin de la guerra y la fundación de la ONU) y ahí
 * habría dos opciones correctas a la vez.
 */
export function distractorEvents(answer: YearEvent, pool: YearEvent[]): YearEvent[] {
  const picked: YearEvent[] = [];
  const used = new Set([answer.id]);

  const take = (candidates: YearEvent[]) => {
    for (const e of shuffle(candidates)) {
      if (picked.length >= OPTIONS - 1) return;
      if (used.has(e.id) || e.year === answer.year) continue;
      used.add(e.id);
      picked.push(e);
    }
  };

  take(pool);
  take(YEAR_EVENTS); // relleno si el tramo elegido se queda corto
  return picked;
}

export function buildRound(
  scope: Scope,
  difficulty: YearDifficulty,
  size = ROUND_SIZE,
): YearQuestion[] {
  return buildRoundFromPool(poolFor(scope, difficulty), size);
}

/**
 * Igual que `buildRound` pero sobre una bolsa ya filtrada. Lo usa Aprender, que
 * acota por categoría (los años de cine solo en el tema de cine) en vez de por
 * época.
 */
export function buildRoundFromPool(
  pool: YearEvent[],
  size = ROUND_SIZE,
): YearQuestion[] {
  // Basta con un evento: los años rivales son sintéticos y los eventos rivales
  // se sacan del catálogo entero si la bolsa se queda corta. Es lo que permite
  // que un tema con pocos años (Arte tiene uno) siga aportando algo a Aprender.
  if (pool.length === 0) return [];

  const answers = shuffle(pool).slice(0, Math.min(size, pool.length));

  return answers.map((answer, i) => {
    // Se alternan los dos sentidos, como en Banderas: el evento arriba con los
    // años en rejilla, y el año enorme con los eventos en columna. Cada uno usa
    // el layout que le va: lo corto en rejilla, lo largo en columna.
    if (i % 2 === 0) {
      return {
        direction: 'eventToYear' as const,
        answer,
        years: shuffle([answer.year, ...distractorYears(answer.year)]),
      };
    }
    return {
      direction: 'yearToEvent' as const,
      answer,
      events: shuffle([answer, ...distractorEvents(answer, pool)]),
    };
  });
}

// ─── Récords por tramo ───────────────────────────────────────────────────────
// Locales, igual que los de Banderas: no hacen falta ni sesión ni columna nueva
// en `profiles`, y el modo sigue funcionando sin conexión y como invitado.

const RECORDS_KEY = 'year_records_v1';

export type YearRecords = Record<string, number>;

export async function getYearRecords(): Promise<YearRecords> {
  try {
    const raw = await AsyncStorage.getItem(RECORDS_KEY);
    return raw ? (JSON.parse(raw) as YearRecords) : {};
  } catch {
    return {};
  }
}

/** Guarda el récord si mejora al anterior. Devuelve true si era nuevo récord. */
export async function saveYearRecord(key: Scope, correct: number): Promise<boolean> {
  try {
    const records = await getYearRecords();
    if ((records[key] ?? 0) >= correct) return false;
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify({ ...records, [key]: correct }));
    return true;
  } catch {
    return false;
  }
}
