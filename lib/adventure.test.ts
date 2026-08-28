import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADVENTURE_MAX_LEVELS,
  ADVENTURE_QUESTIONS_PER_LEVEL,
  adventureLevelStatus,
  adventureRegionForLevel,
  createAdventureProgress,
  markAdventureRewarded,
  normalizeAdventureProgress,
  resolveAdventureAttempt,
} from './adventure';

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
});
