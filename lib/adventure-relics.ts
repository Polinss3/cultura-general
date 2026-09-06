// ─── Reliquias de Aventura ───────────────────────────────────────────────────
//
// Una reliquia por capítulo, en tres grados. Todo se DERIVA de `progress.stars`
// y `progress.completedLevels`, que ya existen y ya se sincronizan entre
// dispositivos: no hay estado nuevo, ni tabla, ni migración, ni nada que se
// pueda desincronizar.
//
// El objetivo es convertir las estrellas de un número suelto en una colección.
// Un contador de 437/600 no invita a volver; una vitrina con un hueco vacío en
// el capítulo 6, sí.

import {
  ADVENTURE_LEVELS_PER_REGION,
  ADVENTURE_MAX_LEVELS,
  adventureRegionForLevel,
  type AdventureProgress,
  type AdventureRegionTheme,
} from './adventure';

export type RelicGrade = 'none' | 'bronze' | 'silver' | 'gold';

export interface AdventureRelic {
  chapter: number;
  theme: AdventureRegionTheme;
  /** Clave i18n bajo `adventure.relics.<id>`. */
  id: AdventureRegionTheme;
  symbol: string;
  grade: RelicGrade;
  stars: number;
  maxStars: number;
  /** Niveles del capítulo ya completados. */
  completed: number;
  total: number;
}

/**
 * El símbolo es propio de la reliquia, no el icono de la región: en la vitrina
 * y en la tarjeta de capítulo se ven a la vez el icono de región, la reliquia y
 * el guardián, así que los tres tienen que distinguirse. Hay un test que lo
 * comprueba capítulo a capítulo.
 */
const RELIC_SYMBOLS: Record<AdventureRegionTheme, string> = {
  roots: '📜',
  world: '🗺️',
  ideas: '📐',
  nature: '🍂',
  arts: '🎭',
  music: '🎻',
  legends: '🐉',
  arena: '🏆',
  inventions: '⚙️',
  cosmos: '🪐',
};

export const RELIC_GRADE_COLORS: Record<Exclude<RelicGrade, 'none'>, string> = {
  bronze: '#C08040',
  silver: '#B9C2CC',
  gold: '#E8C030',
};

export const ADVENTURE_TOTAL_RELICS = Math.ceil(
  ADVENTURE_MAX_LEVELS / ADVENTURE_LEVELS_PER_REGION,
);

/**
 * Grado de la reliquia de un capítulo:
 *
 *  · bronce — capítulo completado
 *  · plata  — además, media de 2 estrellas
 *  · oro    — las tres estrellas en los veinte niveles
 *
 * El bronce exige el capítulo entero a propósito: si se concediera por avanzar,
 * dejaría de significar nada y la vitrina no daría ninguna razón para volver.
 */
export function adventureRelicFor(
  chapter: number,
  progress: AdventureProgress,
): AdventureRelic {
  const safeChapter = Math.max(1, Math.min(ADVENTURE_TOTAL_RELICS, Math.trunc(chapter) || 1));
  const region = adventureRegionForLevel((safeChapter - 1) * ADVENTURE_LEVELS_PER_REGION + 1);
  const total = region.endLevel - region.startLevel + 1;
  const maxStars = total * 3;

  const completedLevels = new Set(progress.completedLevels);
  let completed = 0;
  let stars = 0;
  for (let level = region.startLevel; level <= region.endLevel; level += 1) {
    if (completedLevels.has(level)) completed += 1;
    stars += progress.stars[String(level)] ?? 0;
  }

  let grade: RelicGrade = 'none';
  if (completed >= total) {
    if (stars >= maxStars) grade = 'gold';
    else if (stars >= total * 2) grade = 'silver';
    else grade = 'bronze';
  }

  return {
    chapter: safeChapter,
    theme: region.theme,
    id: region.theme,
    symbol: RELIC_SYMBOLS[region.theme],
    grade,
    stars,
    maxStars,
    completed,
    total,
  };
}

export function adventureRelics(progress: AdventureProgress): AdventureRelic[] {
  return Array.from(
    { length: ADVENTURE_TOTAL_RELICS },
    (_, index) => adventureRelicFor(index + 1, progress),
  );
}

/** Reliquias conseguidas, sea cual sea su grado. */
export function adventureRelicsEarned(progress: AdventureProgress): number {
  return adventureRelics(progress).filter(relic => relic.grade !== 'none').length;
}
