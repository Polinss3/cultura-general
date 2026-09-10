// ─── Lore y guardianes de Aventura ───────────────────────────────────────────
//
// El mapa ya tenía identidad visual (silueta de camino, motivos y acento por
// capítulo) pero ninguna narrativa: el nivel 47 era "el nivel 47". Esto le pone
// un relato encima sin tocar la mecánica ni el banco de preguntas.
//
// El lore vive entero en i18n (`adventure.lore.<tema>.*`), así que añadir un
// capítulo nuevo es añadir texto, no código. Y como la app es de cultura
// general, el relato es divulgativo a propósito: cuenta de qué va el capítulo
// en vez de inventar mitología hueca.

import {
  ADVENTURE_LEVELS_PER_REGION,
  adventureRegionForLevel,
  type AdventureRegionTheme,
} from './adventure';

export interface AdventureGuardian {
  chapter: number;
  /** Clave i18n bajo `adventure.guardians.<id>`. */
  id: AdventureRegionTheme;
  symbol: string;
  accent: string;
}

/**
 * Un guardián por capítulo, en el nivel final. Los símbolos no se repiten con
 * los iconos de región ni con los de las reliquias: en el mapa y en la vitrina
 * llegan a verse los tres a la vez.
 */
const GUARDIAN_SYMBOLS: Record<AdventureRegionTheme, string> = {
  roots: '🗿',
  world: '🌋',
  ideas: '🦉',
  nature: '🐺',
  arts: '🃏',
  music: '🧜',
  legends: '🐲',
  arena: '🦁',
  inventions: '🤖',
  cosmos: '🛸',
  language: '🦜',
  societies: '🕊️',
  oceans: '🐙',
  earth: '🦅',
  medicine: '🐍',
  power: '🦊',
  exploration: '🐋',
  numbers: '🐢',
  future: '🐦‍🔥',
  time: '🦋',
};

export function adventureGuardianForChapter(chapter: number): AdventureGuardian {
  const region = adventureRegionForLevel(
    (Math.max(1, Math.trunc(chapter) || 1) - 1) * ADVENTURE_LEVELS_PER_REGION + 1,
  );
  return {
    chapter: region.number,
    id: region.theme,
    symbol: GUARDIAN_SYMBOLS[region.theme],
    accent: region.accent,
  };
}

export function adventureGuardianForLevel(level: number): AdventureGuardian {
  return adventureGuardianForChapter(adventureRegionForLevel(level).number);
}

/**
 * Los guardianes se juegan sin ayudas.
 *
 * Es el único cambio de reglas del final de capítulo, y es deliberado: la
 * asignación de preguntas es inmutable (diez por nivel, con `unique(version,
 * question_id)` en Supabase), así que subir el número de preguntas del jefe
 * exigiría rehacer el manifiesto entero y romper la compatibilidad con las
 * builds anteriores. Quitar las ayudas da la misma sensación de examen final y
 * no toca ni un dato.
 */
export function adventureAllowsPowerUps(level: number): boolean {
  return adventureRegionForLevel(level).endLevel !== level;
}

/** Clave i18n del texto de entrada de un capítulo. */
export function adventureLoreKey(theme: AdventureRegionTheme, part: 'intro' | 'outro'): string {
  return `adventure.lore.${theme}.${part}`;
}
