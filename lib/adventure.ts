export const ADVENTURE_MAX_LEVELS = 200;
export const ADVENTURE_QUESTIONS_PER_LEVEL = 10;
export const ADVENTURE_LEVELS_PER_REGION = 20;
export const ADVENTURE_QUESTION_VERSION = 1;

export interface AdventureProgress {
  version: 1;
  unlockedLevel: number;
  completedLevels: number[];
  rewardedLevels: number[];
  bestScores: Record<string, number>;
  updatedAt: string;
}

export type AdventureLevelStatus = 'completed' | 'current' | 'locked';

export interface AdventureRegion {
  number: number;
  theme: 'roots' | 'world' | 'ideas' | 'nature' | 'future';
  icon: string;
  accent: string;
  startLevel: number;
  endLevel: number;
}

export interface AdventureAttemptResult {
  progress: AdventureProgress;
  perfect: boolean;
  newlyUnlocked: boolean;
  shouldReward: boolean;
}

const REGION_THEMES = [
  { theme: 'roots', icon: '🏛️', accent: '#C77A36' },
  { theme: 'world', icon: '🧭', accent: '#3E77B4' },
  { theme: 'ideas', icon: '💡', accent: '#7B57BE' },
  { theme: 'nature', icon: '🌿', accent: '#3F9E6C' },
  { theme: 'future', icon: '🚀', accent: '#B14E68' },
] as const;

function clampLevel(level: number): number {
  return Math.min(ADVENTURE_MAX_LEVELS, Math.max(1, Math.trunc(level) || 1));
}

function validLevels(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((item): item is number => Number.isInteger(item))
    .map(clampLevel))]
    .sort((a, b) => a - b);
}

export function createAdventureProgress(now = new Date().toISOString()): AdventureProgress {
  return {
    version: 1,
    unlockedLevel: 1,
    completedLevels: [],
    rewardedLevels: [],
    bestScores: {},
    updatedAt: now,
  };
}

export function normalizeAdventureProgress(
  value: unknown,
  now = new Date().toISOString(),
): AdventureProgress {
  if (!value || typeof value !== 'object') return createAdventureProgress(now);
  const raw = value as Partial<AdventureProgress>;
  const completedLevels = validLevels(raw.completedLevels);
  const rewardedLevels = validLevels(raw.rewardedLevels)
    .filter(level => completedLevels.includes(level));
  const bestScores = Object.fromEntries(
    Object.entries(raw.bestScores ?? {})
      .filter(([key, score]) => {
        const level = Number(key);
        return Number.isInteger(level) && level >= 1 && level <= ADVENTURE_MAX_LEVELS &&
          typeof score === 'number' && Number.isFinite(score);
      })
      .map(([key, score]) => [key, Math.min(ADVENTURE_QUESTIONS_PER_LEVEL, Math.max(0, Math.trunc(score as number)))]),
  );

  return {
    version: 1,
    unlockedLevel: clampLevel(raw.unlockedLevel ?? 1),
    completedLevels,
    rewardedLevels,
    bestScores,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
  };
}

export function adventureLevelStatus(
  level: number,
  progress: AdventureProgress,
): AdventureLevelStatus {
  if (progress.completedLevels.includes(level)) return 'completed';
  if (level <= progress.unlockedLevel) return 'current';
  return 'locked';
}

export function resolveAdventureAttempt(
  progress: AdventureProgress,
  level: number,
  correct: number,
  now = new Date().toISOString(),
): AdventureAttemptResult {
  const safeLevel = clampLevel(level);
  if (safeLevel > progress.unlockedLevel) {
    throw new Error(`Adventure level ${safeLevel} is locked`);
  }

  const safeCorrect = Math.min(
    ADVENTURE_QUESTIONS_PER_LEVEL,
    Math.max(0, Math.trunc(correct) || 0),
  );
  const perfect = safeCorrect === ADVENTURE_QUESTIONS_PER_LEVEL;
  const completed = new Set(progress.completedLevels);
  const wasCompleted = completed.has(safeLevel);
  if (perfect) completed.add(safeLevel);

  const unlockedLevel = perfect
    ? Math.max(progress.unlockedLevel, Math.min(ADVENTURE_MAX_LEVELS, safeLevel + 1))
    : progress.unlockedLevel;

  return {
    progress: {
      ...progress,
      unlockedLevel,
      completedLevels: [...completed].sort((a, b) => a - b),
      bestScores: {
        ...progress.bestScores,
        [safeLevel]: Math.max(progress.bestScores[String(safeLevel)] ?? 0, safeCorrect),
      },
      updatedAt: now,
    },
    perfect,
    newlyUnlocked: perfect && !wasCompleted && unlockedLevel > progress.unlockedLevel,
    shouldReward: perfect && !progress.rewardedLevels.includes(safeLevel),
  };
}

export function markAdventureRewarded(
  progress: AdventureProgress,
  level: number,
  now = new Date().toISOString(),
): AdventureProgress {
  const safeLevel = clampLevel(level);
  if (!progress.completedLevels.includes(safeLevel)) return progress;
  return {
    ...progress,
    rewardedLevels: [...new Set([...progress.rewardedLevels, safeLevel])].sort((a, b) => a - b),
    updatedAt: now,
  };
}

export function adventureRegionForLevel(level: number): AdventureRegion {
  const safeLevel = clampLevel(level);
  const regionIndex = Math.floor((safeLevel - 1) / ADVENTURE_LEVELS_PER_REGION);
  const visual = REGION_THEMES[regionIndex % REGION_THEMES.length];
  const startLevel = regionIndex * ADVENTURE_LEVELS_PER_REGION + 1;
  return {
    number: regionIndex + 1,
    ...visual,
    startLevel,
    endLevel: Math.min(ADVENTURE_MAX_LEVELS, startLevel + ADVENTURE_LEVELS_PER_REGION - 1),
  };
}
