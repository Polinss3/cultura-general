// ─── Curva de niveles ─────────────────────────────────────────
// XP para subir de nivel L→L+1 = 60 + (L-1)*40.
// Umbral acumulado para alcanzar el nivel L = 20*(L^2 - 1).
// De ahí: level = floor(sqrt(xp/20 + 1)). Idéntico al SQL `level_from_xp`.

export interface Rank {
  id: string;
  name: string;
  minLevel: number;
  color: string;   // color principal (texto, bordes)
  color2: string;  // segundo tono para gradientes
}

export const RANKS: Rank[] = [
  { id: 'novato',     name: 'Novato',     minLevel: 1,  color: '#5b8def', color2: '#9b5bef' },
  { id: 'aprendiz',   name: 'Aprendiz',   minLevel: 5,  color: '#2ec87a', color2: '#12b58f' },
  { id: 'conocedor',  name: 'Conocedor',  minLevel: 10, color: '#30a8e8', color2: '#3f6ff0' },
  { id: 'erudito',    name: 'Erudito',    minLevel: 20, color: '#a030e8', color2: '#e030b0' },
  { id: 'maestro',    name: 'Maestro',    minLevel: 35, color: '#e8a030', color2: '#e86a30' },
  { id: 'sabio',      name: 'Sabio',      minLevel: 50, color: '#e83060', color2: '#b030e8' },
  { id: 'leyenda',    name: 'Leyenda',    minLevel: 75, color: '#ffd700', color2: '#ff9500' },
];

export function levelFromXp(xp: number): number {
  const safe = Math.max(0, xp || 0);
  return Math.max(1, Math.floor(Math.sqrt(safe / 20 + 1)));
}

// XP total acumulado necesario para alcanzar el nivel L.
export function xpForLevel(level: number): number {
  const l = Math.max(1, level);
  return 20 * (l * l - 1);
}

export function rankForLevel(level: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r;
  }
  return current;
}

export interface LevelProgress {
  level: number;
  rank: Rank;
  into: number;   // XP dentro del nivel actual
  span: number;   // XP total del nivel actual
  pct: number;    // 0..1
  toNext: number; // XP que falta para el siguiente nivel
}

export function progressToNext(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  const curBase = xpForLevel(level);
  const nextBase = xpForLevel(level + 1);
  const span = Math.max(1, nextBase - curBase);
  const into = Math.max(0, (xp || 0) - curBase);
  return {
    level,
    rank: rankForLevel(level),
    into,
    span,
    pct: Math.min(1, into / span),
    toNext: Math.max(0, nextBase - (xp || 0)),
  };
}
