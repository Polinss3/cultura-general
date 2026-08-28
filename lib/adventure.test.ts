import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADVENTURE_CHAPTER_ACCENTS,
  ADVENTURE_MAX_LEVELS,
  ADVENTURE_QUESTIONS_PER_LEVEL,
  adventureAccentForChapter,
  adventureLevelStatus,
  adventureRegionForLevel,
  adventureStarsForTime,
  adventureStarsInRange,
  createAdventureProgress,
  markAdventureRewarded,
  normalizeAdventureProgress,
  resolveAdventureAttempt,
  markAdventureStarRewarded,
} from './adventure';
import {
  ADVENTURE_CHAPTER_DECORATIONS,
  ADVENTURE_PATH_PATTERNS,
  adventureDecorationsForChapter,
} from './adventure-map-design';

test('a failed attempt records the best score without unlocking a future level', () => {
  const initial = createAdventureProgress('2026-01-01T00:00:00.000Z');
  const result = resolveAdventureAttempt(initial, 1, 9, '2026-01-02T00:00:00.000Z');

  assert.equal(result.perfect, false);
  assert.equal(result.newlyUnlocked, false);
  assert.equal(result.shouldReward, false);
  assert.equal(result.progress.unlockedLevel, 1);
  assert.equal(result.progress.bestScores['1'], 9);
  assert.equal(adventureLevelStatus(2, result.progress), 'locked');
});

test('ten correct answers unlock exactly the next level', () => {
  const result = resolveAdventureAttempt(createAdventureProgress(), 1, 10);

  assert.equal(result.perfect, true);
  assert.equal(result.newlyUnlocked, true);
  assert.equal(result.shouldReward, true);
  assert.equal(result.progress.unlockedLevel, 2);
  assert.deepEqual(result.progress.completedLevels, [1]);
  assert.equal(adventureLevelStatus(1, result.progress), 'completed');
  assert.equal(adventureLevelStatus(2, result.progress), 'current');
  assert.equal(adventureLevelStatus(3, result.progress), 'locked');
});

test('completed levels remain replayable and never grant their reward twice', () => {
  const first = resolveAdventureAttempt(createAdventureProgress(), 1, 10);
  const rewarded = markAdventureRewarded(first.progress, 1);
  const replay = resolveAdventureAttempt(rewarded, 1, 10);

  assert.equal(adventureLevelStatus(1, replay.progress), 'completed');
  assert.equal(replay.shouldReward, false);
  assert.equal(replay.newlyUnlocked, false);
  assert.equal(replay.progress.unlockedLevel, 2);
});

test('active answer time grants one to three stars and keeps the best result', () => {
  assert.equal(adventureStarsForTime(69_999), 3);
  assert.equal(adventureStarsForTime(70_001), 2);
  assert.equal(adventureStarsForTime(120_001), 1);

  const first = resolveAdventureAttempt(createAdventureProgress(), 1, 10, { activeTimeMs: 110_000 });
  const faster = resolveAdventureAttempt(first.progress, 1, 10, { activeTimeMs: 65_000 });
  const slower = resolveAdventureAttempt(faster.progress, 1, 10, { activeTimeMs: 130_000 });

  assert.equal(first.stars, 2);
  assert.equal(faster.stars, 3);
  assert.equal(faster.previousStars, 2);
  assert.equal(slower.progress.stars['1'], 3);
  assert.equal(slower.progress.bestTimesMs['1'], 65_000);
  assert.equal(adventureStarsInRange(slower.progress, 1, 20), 3);
});

test('star reward milestones are recorded only after they have been achieved', () => {
  const completed = resolveAdventureAttempt(createAdventureProgress(), 1, 10, { activeTimeMs: 60_000 }).progress;
  const two = markAdventureStarRewarded(completed, 1, 2);
  const three = markAdventureStarRewarded(two, 1, 3);
  assert.equal(three.rewardedStarMilestones['1'], 3);
  assert.equal(markAdventureStarRewarded(createAdventureProgress(), 1, 2).rewardedStarMilestones['1'], undefined);
});

test('a locked level cannot be opened through the domain API', () => {
  assert.throws(
    () => resolveAdventureAttempt(createAdventureProgress(), 2, 10),
    /locked/,
  );
});

test('the adventure has 200 levels and exactly 2,000 question slots', () => {
  assert.equal(ADVENTURE_MAX_LEVELS, 200);
  assert.equal(ADVENTURE_MAX_LEVELS * ADVENTURE_QUESTIONS_PER_LEVEL, 2000);
  assert.equal(adventureRegionForLevel(1).number, 1);
  assert.equal(adventureRegionForLevel(21).number, 2);
  assert.equal(adventureRegionForLevel(ADVENTURE_MAX_LEVELS).number, 10);
});

test('all current chapters have their own theme, accent, path and decorations', () => {
  const regions = Array.from({ length: 10 }, (_, index) =>
    adventureRegionForLevel(index * 20 + 1));

  assert.equal(new Set(regions.map(region => region.theme)).size, 10);
  assert.equal(new Set(regions.map(region => region.accent)).size, 10);
  assert.equal(new Set(ADVENTURE_PATH_PATTERNS.map(pattern => pattern.join(','))).size, 10);
  assert.ok(ADVENTURE_PATH_PATTERNS.every(pattern =>
    pattern.length === 20 && pattern.every(x => x >= 0 && x <= 1)));
  assert.ok(regions.every(region => ADVENTURE_CHAPTER_DECORATIONS[region.theme].length >= 5));
  assert.ok(regions.every(region => {
    const decorations = adventureDecorationsForChapter(region.theme, region.number);
    return decorations.length === 16 && decorations.every(item => item.size >= 43);
  }));
});

test('chapter accents do not repeat before the twenty-sixth chapter', () => {
  assert.equal(ADVENTURE_CHAPTER_ACCENTS.length, 25);
  assert.equal(new Set(ADVENTURE_CHAPTER_ACCENTS).size, 25);
  assert.equal(adventureAccentForChapter(1), adventureAccentForChapter(26));
});

test('malformed persisted state is normalized and clamped', () => {
  const normalized = normalizeAdventureProgress({
    unlockedLevel: 999,
    completedLevels: [1, 1, 0, 201],
    rewardedLevels: [1, 2],
    bestScores: { 1: 99, nope: 4 },
  });

  assert.equal(normalized.unlockedLevel, ADVENTURE_MAX_LEVELS);
  assert.deepEqual(normalized.completedLevels, [1, ADVENTURE_MAX_LEVELS]);
  assert.deepEqual(normalized.rewardedLevels, [1]);
  assert.equal(normalized.bestScores['1'], ADVENTURE_QUESTIONS_PER_LEVEL);
  assert.equal(normalized.stars['1'], 1);
});
