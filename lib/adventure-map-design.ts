import type { AdventureRegionTheme } from './adventure';

export interface AdventureDecoration {
  symbol: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

// Coordenadas X normalizadas, de abajo arriba. Cada capítulo tiene veinte
// puntos propios para que su silueta completa sea distinta, no solo su color.
export const ADVENTURE_PATH_PATTERNS: ReadonlyArray<readonly number[]> = [
  [0.14, 0.31, 0.55, 0.79, 0.88, 0.76, 0.51, 0.25, 0.10, 0.18, 0.42, 0.70, 0.86, 0.80, 0.59, 0.32, 0.13, 0.20, 0.47, 0.74],
  [0.12, 0.46, 0.84, 0.58, 0.20, 0.33, 0.72, 0.88, 0.52, 0.15, 0.24, 0.63, 0.82, 0.43, 0.11, 0.39, 0.78, 0.67, 0.29, 0.16],
  [0.18, 0.25, 0.41, 0.65, 0.83, 0.88, 0.75, 0.52, 0.29, 0.13, 0.09, 0.22, 0.46, 0.71, 0.87, 0.79, 0.58, 0.34, 0.17, 0.11],
  [0.50, 0.72, 0.86, 0.76, 0.48, 0.20, 0.11, 0.27, 0.57, 0.84, 0.80, 0.54, 0.24, 0.12, 0.31, 0.64, 0.88, 0.69, 0.38, 0.16],
  [0.10, 0.20, 0.36, 0.58, 0.81, 0.88, 0.68, 0.39, 0.14, 0.21, 0.50, 0.79, 0.85, 0.60, 0.31, 0.11, 0.26, 0.55, 0.82, 0.73],
  [0.86, 0.61, 0.34, 0.13, 0.25, 0.54, 0.82, 0.73, 0.41, 0.12, 0.20, 0.49, 0.79, 0.87, 0.65, 0.34, 0.10, 0.28, 0.59, 0.84],
  [0.16, 0.52, 0.86, 0.64, 0.26, 0.12, 0.44, 0.82, 0.70, 0.31, 0.10, 0.39, 0.78, 0.76, 0.35, 0.13, 0.48, 0.87, 0.60, 0.22],
  [0.48, 0.25, 0.12, 0.23, 0.50, 0.77, 0.88, 0.75, 0.47, 0.21, 0.11, 0.27, 0.56, 0.82, 0.84, 0.60, 0.32, 0.14, 0.30, 0.63],
  [0.12, 0.38, 0.70, 0.88, 0.75, 0.43, 0.16, 0.22, 0.55, 0.84, 0.81, 0.49, 0.18, 0.15, 0.45, 0.78, 0.86, 0.58, 0.27, 0.11],
  [0.78, 0.86, 0.67, 0.36, 0.13, 0.18, 0.47, 0.79, 0.83, 0.55, 0.22, 0.10, 0.34, 0.69, 0.88, 0.72, 0.38, 0.12, 0.24, 0.58],
] as const;

export const ADVENTURE_CHAPTER_DECORATIONS: Record<AdventureRegionTheme, readonly AdventureDecoration[]> = {
  roots: [
    { symbol: '📜', x: 0.78, y: 0.10, size: 25, rotation: 10 }, { symbol: '🏺', x: 0.13, y: 0.27, size: 26, rotation: -12 },
    { symbol: '⚖', x: 0.76, y: 0.48, size: 23, rotation: 7 }, { symbol: '✍', x: 0.15, y: 0.68, size: 24, rotation: -15 },
    { symbol: '🏛', x: 0.78, y: 0.84, size: 27, rotation: 0 },
  ],
  world: [
    { symbol: '▲', x: 0.14, y: 0.12, size: 25, rotation: 0 }, { symbol: '🗺', x: 0.77, y: 0.29, size: 27, rotation: 8 },
    { symbol: '≈', x: 0.13, y: 0.50, size: 29, rotation: -8 }, { symbol: '🌍', x: 0.77, y: 0.67, size: 25, rotation: 0 },
    { symbol: '⌖', x: 0.16, y: 0.87, size: 25, rotation: -12 },
  ],
  ideas: [
    { symbol: 'π', x: 0.13, y: 0.13, size: 28, rotation: -8 }, { symbol: '⚗', x: 0.77, y: 0.29, size: 26, rotation: 9 },
    { symbol: '∴', x: 0.15, y: 0.49, size: 27, rotation: 0 }, { symbol: '🔬', x: 0.77, y: 0.68, size: 25, rotation: -10 },
    { symbol: '△', x: 0.17, y: 0.86, size: 27, rotation: 12 },
  ],
  nature: [
    { symbol: '🌱', x: 0.15, y: 0.12, size: 25, rotation: -8 }, { symbol: '🧬', x: 0.78, y: 0.28, size: 25, rotation: 9 },
    { symbol: '🦋', x: 0.14, y: 0.49, size: 24, rotation: -12 }, { symbol: '🍄', x: 0.77, y: 0.68, size: 25, rotation: 8 },
    { symbol: '❀', x: 0.17, y: 0.87, size: 29, rotation: -7 },
  ],
  arts: [
    { symbol: '✎', x: 0.15, y: 0.12, size: 27, rotation: -18 }, { symbol: '🎭', x: 0.77, y: 0.29, size: 26, rotation: 8 },
    { symbol: '🎬', x: 0.14, y: 0.50, size: 25, rotation: -9 }, { symbol: '◇', x: 0.78, y: 0.68, size: 28, rotation: 15 },
    { symbol: '🖼', x: 0.16, y: 0.86, size: 25, rotation: -6 },
  ],
  music: [
    { symbol: '♫', x: 0.14, y: 0.12, size: 30, rotation: -10 }, { symbol: '🎻', x: 0.77, y: 0.29, size: 25, rotation: 9 },
    { symbol: '♪', x: 0.14, y: 0.50, size: 29, rotation: 12 }, { symbol: '🎹', x: 0.76, y: 0.68, size: 25, rotation: -8 },
    { symbol: '𝄞', x: 0.17, y: 0.86, size: 31, rotation: 5 },
  ],
  legends: [
    { symbol: '⚔', x: 0.14, y: 0.12, size: 28, rotation: -10 }, { symbol: '🛡', x: 0.77, y: 0.29, size: 25, rotation: 8 },
    { symbol: '🐉', x: 0.14, y: 0.50, size: 27, rotation: -8 }, { symbol: '♜', x: 0.77, y: 0.68, size: 29, rotation: 8 },
    { symbol: '🔥', x: 0.16, y: 0.86, size: 25, rotation: 0 },
  ],
  arena: [
    { symbol: '⚽', x: 0.14, y: 0.12, size: 25, rotation: -8 }, { symbol: '🏀', x: 0.77, y: 0.29, size: 25, rotation: 9 },
    { symbol: '⚡', x: 0.14, y: 0.50, size: 26, rotation: -10 }, { symbol: '🏆', x: 0.77, y: 0.68, size: 25, rotation: 6 },
    { symbol: '🏁', x: 0.16, y: 0.86, size: 25, rotation: -7 },
  ],
  inventions: [
    { symbol: '⚙', x: 0.14, y: 0.12, size: 28, rotation: -10 }, { symbol: '🖥', x: 0.77, y: 0.29, size: 25, rotation: 7 },
    { symbol: '🤖', x: 0.14, y: 0.50, size: 25, rotation: -6 }, { symbol: '📡', x: 0.77, y: 0.68, size: 25, rotation: 10 },
    { symbol: '⌘', x: 0.16, y: 0.86, size: 27, rotation: -8 },
  ],
  cosmos: [
    { symbol: '✦', x: 0.14, y: 0.12, size: 29, rotation: -8 }, { symbol: '🪐', x: 0.77, y: 0.29, size: 26, rotation: 8 },
    { symbol: '🔭', x: 0.14, y: 0.50, size: 25, rotation: -8 }, { symbol: '☄', x: 0.77, y: 0.68, size: 28, rotation: 10 },
    { symbol: '🛰', x: 0.16, y: 0.86, size: 26, rotation: -8 },
  ],
};

const DECORATION_ROWS = [
  0.04, 0.12, 0.20, 0.28, 0.36, 0.44,
  0.52, 0.60, 0.68, 0.76, 0.84, 0.92,
] as const;

export function adventurePathPatternForChapter(chapter: number): readonly number[] {
  const safeChapter = Math.max(1, Math.trunc(chapter) || 1);
  return ADVENTURE_PATH_PATTERNS[(safeChapter - 1) % ADVENTURE_PATH_PATTERNS.length];
}

/**
 * Convierte los cinco motivos temáticos en una escena de doce elementos.
 * Cada dibujo se sitúa en el lado contrario al camino en esa altura para que
 * tenga presencia sin competir con los nodos ni con sus etiquetas.
 */
export function adventureDecorationsForChapter(
  theme: AdventureRegionTheme,
  chapter: number,
): readonly AdventureDecoration[] {
  const motifs = ADVENTURE_CHAPTER_DECORATIONS[theme];
  const pattern = adventurePathPatternForChapter(chapter);

  return DECORATION_ROWS.map((y, index) => {
    const pathIndex = Math.min(
      pattern.length - 1,
      Math.max(0, Math.round((1 - y) * (pattern.length - 1))),
    );
    const pathX = pattern[pathIndex];
    const motif = motifs[(index + chapter - 1) % motifs.length];
    const nearEdge = index % 3 === 0;

    return {
      symbol: motif.symbol,
      x: pathX >= 0.5 ? (nearEdge ? 0.11 : 0.18) : (nearEdge ? 0.89 : 0.82),
      y,
      size: Math.round(motif.size * (1.55 + (index % 3) * 0.12)),
      rotation: motif.rotation + ((index % 3) - 1) * 7,
    };
  });
}
