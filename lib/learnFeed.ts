// ─── Mezcla de Aprender ──────────────────────────────────────────────────────
//
// Aprender es el modo "todo": además de la trivia del banco, sirve preguntas de
// bandera y de año. Los otros dos modos siguen siendo puros — en Retos, Banderas
// solo pregunta banderas y Años solo años.
//
// Aquí se proyectan los tres orígenes al mismo tipo `Question`, que es lo que la
// pantalla ya sabe pintar, y se reparten intercalados para que no salgan a
// rachas.

import i18n from './i18n';
import { YEAR_EVENTS } from '@/constants/years';
import { flagEmoji } from '@/constants/flags';
import { buildRound as buildFlagRound, countryName } from './flags';
import { buildRoundFromPool as buildYearRound, eventText, formatYear } from './years';
import { shuffle } from './utils';
import type { Category, Question } from '@/types';

/**
 * Qué proporción de la tanda ocupa cada origen añadido. El banco de trivia sigue
 * siendo la mayoría: estas preguntas son un cambio de ritmo, no el plato.
 */
export const LEARN_MIX = { flags: 0.2, years: 0.2 } as const;

/** Banderas solo tienen sentido en Geografía (y en el modo aleatorio). */
const FLAGS_CATEGORY: Category = 'geografia';

/**
 * Los catálogos puntúan 1/2/3 y el banco usa easy/medium/hard. Sin traducir la
 * escala, el filtro de dificultad de Aprender se llevaba por delante todas las
 * banderas y años en cuanto se elegía algo que no fuera "Todas".
 */
const DIFFICULTY: Record<1 | 2 | 3, 'easy' | 'medium' | 'hard'> = {
  1: 'easy', 2: 'medium', 3: 'hard',
};

type LearnCat = Category | 'random';

// ─── Proyección a `Question` ─────────────────────────────────────────────────
// Cada sentido se presenta igual que en su propio modo: el token grande arriba
// cuando la respuesta es texto, y la rejilla cuando la respuesta es corta.

function flagQuestions(n: number): Question[] {
  return buildFlagRound('all', 'all', n).map(q => {
    const opts = q.options;
    const ans = opts.findIndex(o => o.cc === q.answer.cc);

    if (q.direction === 'flagToName') {
      return {
        localId: `flag:${q.answer.cc}`,
        category: FLAGS_CATEGORY,
        difficulty: DIFFICULTY[q.answer.difficulty],
        media: { kind: 'flag' as const, value: flagEmoji(q.answer.cc) },
        q: i18n.t('world.whichCountry'),
        opts: opts.map(countryName),
        ans,
      };
    }
    return {
      localId: `flag:${q.answer.cc}`,
      category: FLAGS_CATEGORY,
      difficulty: DIFFICULTY[q.answer.difficulty],
      lead: i18n.t('world.whichFlag'),
      q: countryName(q.answer),
      opts: opts.map(o => flagEmoji(o.cc)),
      ans,
      layout: 'flags' as const,
    };
  });
}

function yearQuestions(pool: typeof YEAR_EVENTS, n: number): Question[] {
  return buildYearRound(pool, n).map(q => {
    if (q.direction === 'eventToYear') {
      const years = q.years!;
      return {
        localId: `year:${q.answer.id}`,
        category: q.answer.category,
        difficulty: DIFFICULTY[q.answer.difficulty],
        lead: i18n.t('years.whichYear'),
        q: eventText(q.answer),
        opts: years.map(formatYear),
        ans: years.indexOf(q.answer.year),
        layout: 'years' as const,
      };
    }
    const events = q.events!;
    return {
      localId: `year:${q.answer.id}`,
      category: q.answer.category,
      difficulty: DIFFICULTY[q.answer.difficulty],
      media: { kind: 'year' as const, value: formatYear(q.answer.year) },
      q: i18n.t('years.whatHappened'),
      opts: events.map(eventText),
      ans: events.findIndex(e => e.id === q.answer.id),
    };
  });
}

// ─── Reparto ─────────────────────────────────────────────────────────────────

/**
 * Cuántas añadidas hacen falta para que supongan `ratio` del total. Si la
 * trivia trae 80 y el ratio es 0,2, salen 20: 20 de 100.
 */
function countForRatio(baseLength: number, ratio: number): number {
  return Math.round((baseLength * ratio) / (1 - ratio));
}

/** Reparte `extra` por posiciones regulares de `base`, sin amontonarlas. */
function interleave(base: Question[], extra: Question[]): Question[] {
  if (extra.length === 0) return base;
  if (base.length === 0) return extra;

  const out: Question[] = [];
  const step = base.length / extra.length;
  let next = 0;

  for (let i = 0; i < base.length; i++) {
    out.push(base[i]);
    // `>=` y no `===`: con step fraccionario el corte casi nunca cae justo.
    while (next < extra.length && i + 1 >= (next + 1) * step) {
      out.push(extra[next++]);
    }
  }
  out.push(...extra.slice(next));
  return out;
}

/**
 * La tanda de Aprender para un tema: la trivia que llega del banco más las
 * banderas y años que le tocan.
 *
 * - `random` lo mezcla todo.
 * - Geografía recibe banderas.
 * - Cada tema recibe los años etiquetados con esa categoría (los de cine en
 *   cine, los de deportes en deportes…).
 */
export function buildLearnFeed(trivia: Question[], cat: LearnCat): Question[] {
  const wantsFlags = cat === 'random' || cat === FLAGS_CATEGORY;
  const yearPool = cat === 'random'
    ? YEAR_EVENTS
    : YEAR_EVENTS.filter(e => e.category === cat);

  // Con muy pocas de trivia (un tema recién estrenado, o sin red) el ratio da
  // casi cero; el mínimo evita que el tema se quede sin variedad.
  const base = trivia.length;
  const flags = wantsFlags
    ? flagQuestions(Math.max(3, countForRatio(base, LEARN_MIX.flags)))
    : [];
  const years = yearPool.length > 0
    ? yearQuestions(yearPool, Math.max(3, countForRatio(base, LEARN_MIX.years)))
    : [];

  return interleave(trivia, shuffle([...flags, ...years]));
}
