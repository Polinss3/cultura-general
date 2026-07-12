// ─── Economía: recompensas base y multiplicador ───────────────
// Espejo cliente para feedback instantáneo. El servidor (award_progress)
// es la fuente de la verdad: aplica el multiplicador y los topes diarios.

export const REWARDS = {
  learnCorrect:   { xp: 8,  coins: 1 },   // con tope diario en servidor
  dailyCorrect:   { xp: 60, coins: 25 },
  dailyWrong:     { xp: 15, coins: 5 },
  speedPerCorrect:{ xp: 6,  coins: 2 },   // al terminar, ∝ aciertos
  levelUpBonus:   50,                     // monedas por nivel (lo aplica el servidor)
  chestBase:      20,                     // ×multiplicador en servidor
  missionXp:      30,
  missionCoins:   15,
  rewardedAdCoins: 30,
  welcomeBonus:   { xp: 25, coins: 100 }, // regalo inicial tras el onboarding
  dailyRouteBonus: { xp: 40, coins: 30 }, // por completar la ruta diaria del hub
} as const;

// mult = min(1 + 0.1*streak, 2.0)
export function streakMultiplier(streak: number): number {
  return Math.min(1 + 0.1 * Math.max(0, streak || 0), 2.0);
}

// Formatea el multiplicador para UI: "×1.6" (oculta ×1.0).
export function formatMultiplier(streak: number): string | null {
  const m = streakMultiplier(streak);
  if (m <= 1) return null;
  return `×${m.toFixed(1)}`;
}

// ─── Modo Ascenso ─────────────────────────────────────────────
export const LADDER_LIVES = 3;
export const LADDER_CHECKPOINT_EVERY = 5;

// Monedas que aporta superar el piso n al "bote".
export function ladderFloorCoins(floor: number): number {
  return 5 + floor * 3;
}

// Dificultad de la pregunta según el piso.
export function ladderDifficulty(floor: number): 'easy' | 'medium' | 'hard' {
  if (floor <= 3) return 'easy';
  if (floor <= 7) return 'medium';
  return 'hard';
}

// Segundos para responder cada piso (presión creciente, con suelo).
export function ladderTimeLimit(floor: number): number {
  return Math.max(8, 18 - Math.floor(floor / 3));
}

// ─── Zonas del Ascenso (pisos con nombre) ─────────────────────
// Cada tramo de 5 pisos (= un checkpoint) es una "zona" temática con nombre,
// emoji y color. El nombre user-facing vive en i18n (`ladder.zones.<id>`).
export const LADDER_ZONE_SIZE = LADDER_CHECKPOINT_EVERY;

const LADDER_ZONES = [
  { id: 'cimientos',  emoji: '🏛️', color: '#c08040' },
  { id: 'escalinata', emoji: '🪜', color: '#2ec87a' },
  { id: 'alturas',    emoji: '⛰️', color: '#30a8e8' },
  { id: 'nubes',      emoji: '☁️', color: '#9ab4d4' },
  { id: 'firmamento', emoji: '🌌', color: '#a030e8' },
  { id: 'estrellas',  emoji: '⭐', color: '#e8c030' },
  { id: 'olimpo',     emoji: '👑', color: '#ffd700' },
] as const;

export interface LadderZone {
  id: string;
  emoji: string;
  color: string;
  index: number;      // 0-based
  startFloor: number;
  endFloor: number;
  isLast: boolean;    // última zona definida (se repite hacia arriba)
}

export function ladderZone(floor: number): LadderZone {
  const idx = Math.floor((Math.max(1, floor) - 1) / LADDER_ZONE_SIZE);
  const clamped = Math.min(idx, LADDER_ZONES.length - 1);
  const meta = LADDER_ZONES[clamped];
  const startFloor = idx * LADDER_ZONE_SIZE + 1;
  return {
    id: meta.id,
    emoji: meta.emoji,
    color: meta.color,
    index: idx,
    startFloor,
    endFloor: startFloor + LADDER_ZONE_SIZE - 1,
    isLast: clamped === LADDER_ZONES.length - 1,
  };
}
