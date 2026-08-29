import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADVENTURE_CHAPTER_ACCENTS,
  ADVENTURE_MAX_LEVELS,
  ADVENTURE_QUESTION_VERSION,
  ADVENTURE_QUESTIONS_PER_LEVEL,
  adventureAccentForChapter,
  adventureLevelStatus,
  adventureRegionForLevel,
  adventureStarThresholdsForLevel,
  adventureStarsForTime,
  adventureStarsInRange,
  createAdventureProgress,
  markAdventureRewarded,
  mergeAdventureProgress,
  normalizeAdventureProgress,
  resolveAdventureAttempt,
  markAdventureStarRewarded,
  type AdventureProgress,
} from './adventure';
import {
  adventureProgressStorageKey,
  createAdventureProgressRepository,
  migrateGuestAdventureProgressToUser,
  type AdventureRemoteSync,
  type KeyValueStorage,
} from './adventure-progress';
import {
  ADVENTURE_CHAPTER_DECORATIONS,
  ADVENTURE_PATH_PATTERNS,
  adventureDecorationsForChapter,
} from './adventure-map-design';
import { shuffleQuestionForAttempt } from './utils';
import { createAsyncGate } from './async-gate';
import { pickDailyMissions } from './missions';

test('the async gate blocks a duplicate action in the same render tick', async () => {
  const gate = createAsyncGate();
  let release!: () => void;
  let calls = 0;
  const first = gate.run(async () => {
    calls += 1;
    await new Promise<void>(resolve => { release = resolve; });
  });
  const duplicate = await gate.run(async () => { calls += 1; });

  assert.equal(duplicate.started, false);
  assert.equal(calls, 1);
  assert.equal(gate.isLocked(), true);
  release();
  await first;
  assert.equal(gate.isLocked(), false);
});

test('the async gate releases its lock after a failure', async () => {
  const gate = createAsyncGate();
  await assert.rejects(gate.run(async () => { throw new Error('storage failed'); }));
  const retry = await gate.run(async () => 'saved');

  assert.equal(retry.started, true);
  assert.equal(retry.value, 'saved');
});

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
  assert.equal(adventureStarsForTime(65_000, 1), 3);
  assert.equal(adventureStarsForTime(65_001, 1), 2);
  assert.equal(adventureStarsForTime(110_001, 1), 1);
  assert.deepEqual(adventureStarThresholdsForLevel(1), {
    twoStarsMs: 110_000,
    threeStarsMs: 65_000,
  });
  assert.deepEqual(adventureStarThresholdsForLevel(200), {
    twoStarsMs: 92_000,
    threeStarsMs: 51_500,
  });

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
  assert.equal(ADVENTURE_QUESTION_VERSION, 2);
});

test('daily mission rotation includes Adventure without exceeding three missions', () => {
  const rotations = Array.from({ length: 90 }, (_, day) =>
    pickDailyMissions(`2026-09-${String(day + 1).padStart(2, '0')}`));
  const ids = new Set(rotations.flatMap(missions => missions.map(mission => mission.id)));

  assert.ok(rotations.every(missions => missions.length === 3));
  assert.ok(rotations.every(missions => new Set(missions.map(mission => mission.id)).size === 3));
  assert.ok(ids.has('m_adventure_play'));
  assert.ok(ids.has('m_adventure_perfect'));
  assert.ok(ids.has('m_adventure_stars'));
});

test('progress from two devices merges without losing either best result', () => {
  const deviceA = resolveAdventureAttempt(
    createAdventureProgress(),
    1,
    10,
    { activeTimeMs: 110_000 },
  ).progress;
  const deviceB = resolveAdventureAttempt(
    createAdventureProgress(),
    1,
    10,
    { activeTimeMs: 65_000 },
  ).progress;
  deviceA.bestScores['2'] = 7;
  deviceB.bestScores['2'] = 9;

  const merged = mergeAdventureProgress(deviceA, deviceB, '2026-08-29T10:00:00.000Z');

  assert.deepEqual(merged.completedLevels, [1]);
  assert.equal(merged.unlockedLevel, 2);
  assert.equal(merged.bestScores['2'], 9);
  assert.equal(merged.bestTimesMs['1'], 65_000);
  assert.equal(merged.stars['1'], 3);
});

class MemoryStorage implements KeyValueStorage {
  values = new Map<string, string>();

  async getItem(key: string) { return this.values.get(key) ?? null; }
  async setItem(key: string, value: string) { this.values.set(key, value); }
  async removeItem(key: string) { this.values.delete(key); }
}

test('the synced repository remains playable when Supabase is unavailable', async () => {
  const storage = new MemoryStorage();
  const remote: AdventureRemoteSync = { sync: async () => { throw new Error('offline'); } };
  const repository = createAdventureProgressRepository('user-a', {
    remoteEnabled: true,
    remote,
    storage,
  });
  const completed = resolveAdventureAttempt(createAdventureProgress(), 1, 10).progress;

  await repository.save(completed);
  const loaded = await repository.load();

  assert.deepEqual(loaded.completedLevels, [1]);
  assert.ok(storage.values.has(adventureProgressStorageKey('user-a')));
});

test('saving a finished level locally never waits for the remote sync', async () => {
  const storage = new MemoryStorage();
  let remoteCalls = 0;
  const remote: AdventureRemoteSync = {
    sync: async progress => {
      remoteCalls += 1;
      return progress;
    },
  };
  const repository = createAdventureProgressRepository('user-local-first', {
    remoteEnabled: true,
    remote,
    storage,
  });
  const completed = resolveAdventureAttempt(createAdventureProgress(), 1, 10).progress;

  await repository.saveLocal(completed);
  assert.equal(remoteCalls, 0);
  assert.deepEqual((await repository.loadLocal()).completedLevels, [1]);

  await repository.sync(completed);
  assert.equal(remoteCalls, 1);
});

test('a stalled remote sync times out without losing local progress', async () => {
  const storage = new MemoryStorage();
  const remote: AdventureRemoteSync = {
    sync: async () => new Promise<AdventureProgress>(() => {}),
  };
  const repository = createAdventureProgressRepository('user-timeout', {
    remoteEnabled: true,
    remote,
    remoteTimeoutMs: 5,
    storage,
  });
  const completed = resolveAdventureAttempt(createAdventureProgress(), 1, 10).progress;

  await repository.saveLocal(completed);
  await assert.rejects(repository.sync(completed), /timed out/);
  assert.deepEqual((await repository.loadLocal()).completedLevels, [1]);
});

test('guest progress is removed only after a successful account sync', async () => {
  const storage = new MemoryStorage();
  const guest = createAdventureProgressRepository('guest', { remoteEnabled: false, storage });
  await guest.save(resolveAdventureAttempt(createAdventureProgress(), 1, 10).progress);
  const failingRemote: AdventureRemoteSync = { sync: async () => { throw new Error('offline'); } };

  assert.equal(await migrateGuestAdventureProgressToUser('user-b', storage, failingRemote), false);
  assert.ok(storage.values.has(adventureProgressStorageKey('guest')));

  const remote: AdventureRemoteSync = {
    sync: async progress => mergeAdventureProgress(createAdventureProgress(), progress),
  };
  assert.equal(await migrateGuestAdventureProgressToUser('user-b', storage, remote), true);
  assert.equal(storage.values.has(adventureProgressStorageKey('guest')), false);

  const account = createAdventureProgressRepository('user-b', { remoteEnabled: false, storage });
  assert.deepEqual((await account.load()).completedLevels, [1]);
});

test('all current chapters have their own theme, accent, path and decorations', () => {
  const regions = Array.from({ length: 10 }, (_, index) =>
    adventureRegionForLevel(index * 20 + 1));

  assert.equal(new Set(regions.map(region => region.theme)).size, 10);
  assert.equal(new Set(regions.map(region => region.accent)).size, 10);
  assert.equal(new Set(ADVENTURE_PATH_PATTERNS.map(pattern => pattern.join(','))).size, 10);
  assert.ok(ADVENTURE_PATH_PATTERNS.every(pattern =>
    pattern.length === 20 && pattern.every(x => x >= 0 && x <= 1)));
  assert.ok(regions.every(region => {
    const motifs = ADVENTURE_CHAPTER_DECORATIONS[region.theme];
    return motifs.length === 16 && new Set(motifs.map(item => item.symbol)).size === 16;
  }));
  assert.ok(regions.every(region => {
    const decorations = adventureDecorationsForChapter(region.theme, region.number);
    return decorations.length === 16
      && new Set(decorations.map(item => item.symbol)).size === 16
      && decorations.every(item => item.size >= 43);
  }));
});

test('adventure retries keep the question but move its correct answer', () => {
  const question = {
    id: 'fixed-question',
    q: 'Which option is correct?',
    opts: ['First', 'Second', 'Correct', 'Fourth'],
    ans: 2,
  };
  const attempts = Array.from({ length: 8 }, (_, index) =>
    shuffleQuestionForAttempt(question, 'level-1-slot-1-session', index + 1));

  attempts.forEach(attempt => {
    assert.equal(attempt.q, question.q);
    assert.equal(attempt.opts[attempt.ans], 'Correct');
  });
  for (let index = 1; index < attempts.length; index += 1) {
    assert.notEqual(attempts[index].ans, attempts[index - 1].ans);
  }
  assert.deepEqual(question.opts, ['First', 'Second', 'Correct', 'Fourth']);
  assert.equal(question.ans, 2);
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
