import { cityDistractors, cityPool, type City, type CityQuestion } from './cityCatalog';

/**
 * Días UTC desde el 1970-01-01, que fue jueves. Es el mismo índice con el que
 * `fetchOrAssignDailyQuestion` elige la pregunta normal, así que el cambio de
 * día de la ciudad coincide con el del resto de la diaria.
 */
export const utcDayIndex = (now = Date.now()) => Math.floor(now / 86_400_000);

/**
 * Los domingos la diaria es una ciudad. Una de cada siete se acerca a lo que
 * pesan las ~250 ciudades frente a las ~1.600 preguntas de texto. Además, como
 * los días normales no cambian, todos los usuarios de 2.4.0 en adelante siguen
 * viendo la misma pregunta que las versiones anteriores salvo el domingo.
 */
const CITY_WEEKDAY = 3; // 0 = jueves … 3 = domingo
export const isCityDay = (day: number) => ((day % 7) + 7) % 7 === CITY_WEEKDAY;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const byId = (a: City, b: City) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/**
 * La ciudad del día y sus opciones, iguales en todos los móviles: la ciudad
 * recorre el catálogo por orden de id, un domingo tras otro, sin repetirse
 * hasta agotarlo; las opciones salen con una semilla del día. El orden en
 * pantalla lo baraja luego la diaria por usuario. La respuesta va siempre en
 * `options[0]`.
 */
export function dailyCityQuestion(catalog: City[], day: number): CityQuestion | null {
  if (!isCityDay(day)) return null;
  const sorted = [...catalog].sort(byId);
  const pool = cityPool(sorted, 'all', 'all');
  if (!pool.length) return null;
  const answer = pool[Math.floor(day / 7) % pool.length];
  const distractors = cityDistractors(answer, sorted, mulberry32(day));
  return distractors.length === 3 ? { answer, options: [answer, ...distractors] } : null;
}
