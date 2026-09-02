export const ADVENTURE_MAX_LEVELS = 200;
export const ADVENTURE_QUESTIONS_PER_LEVEL = 10;
export const ADVENTURE_LEVELS_PER_REGION = 20;
// La v1 permanece publicada en Supabase para builds anteriores. La 2.1 usa un
// manifiesto nuevo con una curva de dificultad creciente y el mismo orden en
// todos los dispositivos.
export const ADVENTURE_QUESTION_VERSION = 2;
export const ADVENTURE_TWO_STAR_TIME_MS = 110_000;
export const ADVENTURE_THREE_STAR_TIME_MS = 65_000;
const ADVENTURE_TWO_STAR_CHAPTER_STEP_MS = 2_000;
const ADVENTURE_THREE_STAR_CHAPTER_STEP_MS = 1_500;

export interface AdventureProgress {
  version: 1;
  unlockedLevel: number;
  completedLevels: number[];
  rewardedLevels: number[];
  bestScores: Record<string, number>;
  bestTimesMs: Record<string, number>;
  stars: Record<string, number>;
  rewardedStarMilestones: Record<string, number>;
  updatedAt: string;
}

export type AdventureLevelStatus = 'completed' | 'current' | 'locked';

export type AdventureRegionTheme =
  | 'roots'
  | 'world'
  | 'ideas'
  | 'nature'
  | 'arts'
  | 'music'
  | 'legends'
  | 'arena'
  | 'inventions'
  | 'cosmos';

export interface AdventureRegion {
  number: number;
  theme: AdventureRegionTheme;
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
  stars: number;
  previousStars: number;
  bestTimeMs: number | null;
  newBestTime: boolean;
}

const REGION_THEMES: ReadonlyArray<{ theme: AdventureRegionTheme; icon: string }> = [
  { theme: 'roots', icon: '🏛️' },
  { theme: 'world', icon: '🧭' },
  { theme: 'ideas', icon: '💡' },
  { theme: 'nature', icon: '🌿' },
  { theme: 'arts', icon: '🎨' },
  { theme: 'music', icon: '🎼' },
  { theme: 'legends', icon: '⚔️' },
  { theme: 'arena', icon: '🏅' },
  { theme: 'inventions', icon: '💻' },
  { theme: 'cosmos', icon: '🚀' },
] as const;

// Preparada para crecer: un color no vuelve a aparecer hasta el capítulo 26.
// Las identidades temáticas pueden ciclar antes, pero el mapa conserva una
// personalidad cromática distinta durante al menos 25 capítulos.
export const ADVENTURE_CHAPTER_ACCENTS = [
  '#C7772F', '#3478B9', '#7954B6', '#348B62', '#B54F70',
  '#B66338', '#526BB2', '#C08A20', '#287F87', '#6B58A7',
  '#A85E2A', '#3C879C', '#8B4E8C', '#4D8738', '#B24949',
  '#426EA4', '#A27625', '#2F8A77', '#815A9E', '#C06355',
  '#5A73A8', '#9A6A36', '#3D8270', '#A44E78', '#657A32',
] as const;

export function adventureAccentForChapter(chapter: number): string {
  const safeChapter = Math.max(1, Math.trunc(chapter) || 1);
  return ADVENTURE_CHAPTER_ACCENTS[(safeChapter - 1) % ADVENTURE_CHAPTER_ACCENTS.length];
}

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
    bestTimesMs: {},
    stars: {},
    rewardedStarMilestones: {},
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
  const validMetricRecord = (record: unknown, max: number) => Object.fromEntries(
    Object.entries(record && typeof record === 'object' ? record as Record<string, unknown> : {})
      .filter(([key, value]) => Number.isInteger(Number(key)) && Number(key) >= 1 &&
        Number(key) <= ADVENTURE_MAX_LEVELS && typeof value === 'number' &&
        Number.isFinite(value) && value > 0)
      .map(([key, value]) => [key, Math.min(max, Math.max(1, Math.trunc(value as number)))]),
  );
  const bestTimesMs = validMetricRecord(raw.bestTimesMs, 86_400_000);
  const storedStars = validMetricRecord(raw.stars, 3);
  const stars = Object.fromEntries(completedLevels.map(level => [
    String(level), Math.max(1, storedStars[String(level)] ?? 0),
  ]));
  const rewardedStarMilestones = validMetricRecord(raw.rewardedStarMilestones, 3);

  return {
    version: 1,
    unlockedLevel: clampLevel(raw.unlockedLevel ?? 1),
    completedLevels,
    rewardedLevels,
    bestScores,
    bestTimesMs,
    stars,
    rewardedStarMilestones,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now,
  };
}

/**
 * Une dos copias de progreso sin permitir regresiones. Es la misma estrategia
 * que aplica Supabase al sincronizar dos dispositivos: maximo para puntos y
 * estrellas, minimo para el mejor tiempo y union para niveles completados.
 */
export function mergeAdventureProgress(
  left: unknown,
  right: unknown,
  now = new Date().toISOString(),
): AdventureProgress {
  const a = normalizeAdventureProgress(left, now);
  const b = normalizeAdventureProgress(right, now);
  const completedLevels = [...new Set([...a.completedLevels, ...b.completedLevels])]
    .sort((x, y) => x - y);
  const completed = new Set(completedLevels);
  const keys = (first: Record<string, number>, second: Record<string, number>) =>
    [...new Set([...Object.keys(first), ...Object.keys(second)])];
  const maxRecord = (first: Record<string, number>, second: Record<string, number>) =>
    Object.fromEntries(keys(first, second).map(key => [
      key,
      Math.max(first[key] ?? 0, second[key] ?? 0),
    ]));
  const minPositiveRecord = (first: Record<string, number>, second: Record<string, number>) =>
    Object.fromEntries(keys(first, second).flatMap(key => {
      const values = [first[key], second[key]].filter(
        (value): value is number => typeof value === 'number' && value > 0,
      );
      return values.length > 0 ? [[key, Math.min(...values)]] : [];
    }));
  const lastCompleted = completedLevels.at(-1) ?? 0;

  return normalizeAdventureProgress({
    version: 1,
    unlockedLevel: Math.max(
      a.unlockedLevel,
      b.unlockedLevel,
      Math.min(ADVENTURE_MAX_LEVELS, lastCompleted + 1),
    ),
    completedLevels,
    rewardedLevels: [...new Set([...a.rewardedLevels, ...b.rewardedLevels])]
      .filter(level => completed.has(level))
      .sort((x, y) => x - y),
    bestScores: maxRecord(a.bestScores, b.bestScores),
    bestTimesMs: minPositiveRecord(a.bestTimesMs, b.bestTimesMs),
    stars: maxRecord(a.stars, b.stars),
    rewardedStarMilestones: maxRecord(
      a.rewardedStarMilestones,
      b.rewardedStarMilestones,
    ),
    updatedAt: now,
  }, now);
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
  options: string | { activeTimeMs?: number; now?: string } = new Date().toISOString(),
): AdventureAttemptResult {
  const now = typeof options === 'string' ? options : options.now ?? new Date().toISOString();
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
  const activeTimeMs = typeof options === 'object' && typeof options.activeTimeMs === 'number' &&
    Number.isFinite(options.activeTimeMs) && options.activeTimeMs > 0
    ? Math.trunc(options.activeTimeMs)
    : null;
  const previousStars = progress.stars[String(safeLevel)] ?? (wasCompleted ? 1 : 0);
  const earnedStars = perfect ? adventureStarsForTime(activeTimeMs, safeLevel) : 0;
  const stars = Math.max(previousStars, earnedStars);
  const previousBestTime = progress.bestTimesMs[String(safeLevel)] ?? null;
  const newBestTime = perfect && activeTimeMs !== null &&
    (previousBestTime === null || activeTimeMs < previousBestTime);
  const bestTimeMs = newBestTime ? activeTimeMs : previousBestTime;

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
      bestTimesMs: bestTimeMs === null ? progress.bestTimesMs : {
        ...progress.bestTimesMs,
        [safeLevel]: bestTimeMs,
      },
      stars: perfect ? { ...progress.stars, [safeLevel]: stars } : progress.stars,
      updatedAt: now,
    },
    perfect,
    newlyUnlocked: perfect && !wasCompleted && unlockedLevel > progress.unlockedLevel,
    shouldReward: perfect && !progress.rewardedLevels.includes(safeLevel),
    stars: perfect ? earnedStars : 0,
    previousStars,
    bestTimeMs,
    newBestTime,
  };
}

export function adventureStarThresholdsForLevel(level: number): {
  twoStarsMs: number;
  threeStarsMs: number;
} {
  const safeLevel = clampLevel(level);
  const chapter = Math.floor((safeLevel - 1) / ADVENTURE_LEVELS_PER_REGION) + 1;
  return {
    twoStarsMs: ADVENTURE_TWO_STAR_TIME_MS - (chapter - 1) * ADVENTURE_TWO_STAR_CHAPTER_STEP_MS,
    threeStarsMs: ADVENTURE_THREE_STAR_TIME_MS - (chapter - 1) * ADVENTURE_THREE_STAR_CHAPTER_STEP_MS,
  };
}

export function adventureStarsForTime(activeTimeMs: number | null, level = 1): number {
  if (activeTimeMs === null || !Number.isFinite(activeTimeMs) || activeTimeMs <= 0) return 1;
  const thresholds = adventureStarThresholdsForLevel(level);
  if (activeTimeMs <= thresholds.threeStarsMs) return 3;
  if (activeTimeMs <= thresholds.twoStarsMs) return 2;
  return 1;
}

export function adventureStarsInRange(progress: AdventureProgress, start: number, end: number): number {
  let total = 0;
  for (let level = start; level <= end; level += 1) total += progress.stars[String(level)] ?? 0;
  return total;
}

export function isAdventureChapterFinal(level: number): boolean {
  const safeLevel = Math.trunc(level);
  return safeLevel >= ADVENTURE_LEVELS_PER_REGION &&
    safeLevel <= ADVENTURE_MAX_LEVELS &&
    safeLevel % ADVENTURE_LEVELS_PER_REGION === 0;
}

export function markAdventureStarRewarded(
  progress: AdventureProgress,
  level: number,
  milestone: 2 | 3,
  now = new Date().toISOString(),
): AdventureProgress {
  const safeLevel = clampLevel(level);
  if ((progress.stars[String(safeLevel)] ?? 0) < milestone) return progress;
  return {
    ...progress,
    rewardedStarMilestones: {
      ...progress.rewardedStarMilestones,
      [safeLevel]: Math.max(progress.rewardedStarMilestones[String(safeLevel)] ?? 0, milestone),
    },
    updatedAt: now,
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
    accent: adventureAccentForChapter(regionIndex + 1),
    startLevel,
    endLevel: Math.min(ADVENTURE_MAX_LEVELS, startLevel + ADVENTURE_LEVELS_PER_REGION - 1),
  };
}
