// ─── Dominio por categoría ──────────────────────────────────────────────────
//
// Cada categoría tiene su propio "nivel de dominio" derivado de los aciertos
// acumulados en ella, con una insignia (tier) que sube por hitos. Es puramente
// derivado de las stats que ya calcula `fetchCategoryStats` — no añade estado.

// Aciertos acumulados necesarios para ALCANZAR el nivel L (L>=0):
//   totalForLevel(L) = 5 · L·(L+1)/2  → 0, 5, 15, 30, 50, 75, 105, 140, …
export function totalForLevel(level: number): number {
  const l = Math.max(0, level);
  return (5 * l * (l + 1)) / 2;
}

export function levelFromCorrect(correct: number): number {
  const c = Math.max(0, correct || 0);
  let level = 0;
  while (totalForLevel(level + 1) <= c) level++;
  return level;
}

export interface MasteryTier {
  id: string;      // clave i18n bajo `mastery.tiers.<id>`
  emoji: string;
  color: string;
}

// Tiers por nivel alcanzado (de mayor a menor).
const TIERS: { min: number; tier: MasteryTier }[] = [
  { min: 7, tier: { id: 'diamante', emoji: '💎', color: '#30c8e8' } },
  { min: 5, tier: { id: 'oro',      emoji: '🥇', color: '#e8c030' } },
  { min: 3, tier: { id: 'plata',    emoji: '🥈', color: '#c0c8d0' } },
  { min: 1, tier: { id: 'bronce',   emoji: '🥉', color: '#c08040' } },
  { min: 0, tier: { id: 'novato',   emoji: '🌱', color: '#5b8def' } },
];

export function tierForLevel(level: number): MasteryTier {
  for (const { min, tier } of TIERS) {
    if (level >= min) return tier;
  }
  return TIERS[TIERS.length - 1].tier;
}

export interface Mastery {
  level: number;
  tier: MasteryTier;
  into: number;         // aciertos dentro del nivel actual
  span: number;         // aciertos que abarca el nivel actual
  pct: number;          // 0..1 progreso al siguiente nivel
  correctToNext: number; // aciertos que faltan para subir
}

export function masteryFor(correct: number): Mastery {
  const c = Math.max(0, correct || 0);
  const level = levelFromCorrect(c);
  const base = totalForLevel(level);
  const nextBase = totalForLevel(level + 1);
  const span = Math.max(1, nextBase - base);
  const into = c - base;
  return {
    level,
    tier: tierForLevel(level),
    into,
    span,
    pct: Math.min(1, into / span),
    correctToNext: Math.max(0, nextBase - c),
  };
}
