/** Serializable content contract shared by the app, publisher and tests. */
export const CITY_CONTINENTS = ['europa', 'america', 'africa', 'asia', 'oceania'] as const;
export type CityContinent = typeof CITY_CONTINENTS[number];
export type CityScope = CityContinent | 'all';
export type CityDifficulty = 'all' | 1 | 2 | 3;
export type CityLanguage = 'es' | 'en';
export interface CityFraming {
  left: number; top: number; width: number; height: number; background: string;
}
export interface City {
  id: string;
  name: Record<CityLanguage, string>;
  continent: CityContinent;
  difficulty: 1 | 2 | 3;
  architecture_tags: string[];
  similar_city_ids: string[];
  /** Null entries may be answer options, never questions. */
  image_url: string | null;
  framing: CityFraming | null;
}
export interface CityQuestion { answer: City; options: City[] }
export const CITY_ROUND_SIZE = 10;
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const nonempty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(nonempty);

export function isCity(v: unknown): v is City {
  if (!isObject(v) || !nonempty(v.id) || !isObject(v.name) ||
    !nonempty(v.name.es) || !nonempty(v.name.en) ||
    !CITY_CONTINENTS.includes(v.continent as CityContinent) ||
    ![1, 2, 3].includes(v.difficulty as number) || !strings(v.architecture_tags) ||
    !strings(v.similar_city_ids)) return false;
  if (v.image_url === null) return v.framing === null;
  if (typeof v.image_url !== 'string' || !/^https:\/\//.test(v.image_url) || !isObject(v.framing)) return false;
  const f = v.framing;
  return ['left', 'top', 'width', 'height'].every(k => typeof f[k] === 'number' && Number.isFinite(f[k])) &&
    (f.width as number) > 0 && (f.width as number) <= 2 &&
    (f.height as number) > 0 && (f.height as number) <= 2 &&
    (f.left as number) >= -1 && (f.left as number) <= 1 &&
    (f.top as number) >= -1 && (f.top as number) <= 1 &&
    typeof f.background === 'string' && /^#[0-9a-f]{6}$/i.test(f.background);
}

export function parseCityCatalog(raw: unknown): City[] {
  if (!Array.isArray(raw)) throw new Error('Invalid city catalog');
  const ids = new Set<string>();
  return raw.filter(isCity).filter(c => {
    if (ids.has(c.id)) return false;
    ids.add(c.id);
    return true;
  });
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Architecture wins over geography. Ties are shuffled afresh for each round. */
export function citySimilarity(answer: City, candidate: City): number {
  const curated = answer.similar_city_ids.includes(candidate.id) || candidate.similar_city_ids.includes(answer.id);
  const overlap = candidate.architecture_tags.filter(t => answer.architecture_tags.includes(t)).length;
  return (curated ? 100 : 0) + overlap * 10 + (answer.continent === candidate.continent ? 1 : 0);
}
const nameKey = (s: string) => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase();
export function cityDistractors(answer: City, catalog: City[], random = Math.random): City[] {
  const usedIds = new Set([answer.id]);
  const es = new Set([nameKey(answer.name.es)]), en = new Set([nameKey(answer.name.en)]);
  const ranked = shuffle(catalog, random).sort((a, b) => citySimilarity(answer, b) - citySimilarity(answer, a));
  const picked: City[] = [];
  for (const c of ranked) {
    // Never fill with unrelated cities, nor two identically named options.
    if (citySimilarity(answer, c) < 10 || usedIds.has(c.id) || es.has(nameKey(c.name.es)) || en.has(nameKey(c.name.en))) continue;
    picked.push(c); usedIds.add(c.id); es.add(nameKey(c.name.es)); en.add(nameKey(c.name.en));
    if (picked.length === 3) break;
  }
  return picked;
}
/**
 * ¿Tiene tres distractores válidos? Lo mismo que pedir `cityDistractors` y
 * mirar si salen tres, pero sin barajar ni ordenar el catálogo: un recorrido
 * que para al tercero. Con 250 ciudades, ordenar por cada una costaba cientos
 * de milisegundos en el móvil al abrir el modo.
 */
function hasThreeDistractors(answer: City, catalog: City[]): boolean {
  const es = new Set([nameKey(answer.name.es)]), en = new Set([nameKey(answer.name.en)]);
  let found = 0;
  for (const c of catalog) {
    if (c.id === answer.id || citySimilarity(answer, c) < 10) continue;
    const ces = nameKey(c.name.es), cen = nameKey(c.name.en);
    if (es.has(ces) || en.has(cen)) continue;
    es.add(ces); en.add(cen);
    if (++found === 3) return true;
  }
  return false;
}
// El catálogo se sustituye entero al refrescarlo, así que la identidad del
// array sirve de clave.
const playableCache = new WeakMap<City[], City[]>();
function playableCities(catalog: City[]): City[] {
  let playable = playableCache.get(catalog);
  if (!playable) {
    playable = catalog.filter(c => c.image_url && c.framing && hasThreeDistractors(c, catalog));
    playableCache.set(catalog, playable);
  }
  return playable;
}
export function cityPool(catalog: City[], scope: CityScope, difficulty: CityDifficulty): City[] {
  return playableCities(catalog).filter(c =>
    (scope === 'all' || c.continent === scope) && (difficulty === 'all' || c.difficulty === difficulty));
}
export function buildCityRound(catalog: City[], scope: CityScope, difficulty: CityDifficulty,
  size = CITY_ROUND_SIZE, random = Math.random): CityQuestion[] {
  return shuffle(cityPool(catalog, scope, difficulty), random).slice(0, Math.max(0, size)).map(answer => ({
    answer, options: shuffle([answer, ...cityDistractors(answer, catalog, random)], random),
  }));
}
export function cityRecordKey(scope: CityScope, difficulty: CityDifficulty, size: number): string {
  return `${scope}:${difficulty}:${size}`;
}
