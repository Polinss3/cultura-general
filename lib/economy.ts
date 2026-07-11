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
