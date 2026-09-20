import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getStreakAtRiskNotice,
  getStreakRecoveryOffer,
  streakRecoveryPrice,
} from './streakRecovery';

test('price is 10 coins per day, clamped to 50-500', () => {
  assert.equal(streakRecoveryPrice(0), 50);
  assert.equal(streakRecoveryPrice(3), 50);
  assert.equal(streakRecoveryPrice(5), 50);
  assert.equal(streakRecoveryPrice(12), 120);
  assert.equal(streakRecoveryPrice(50), 500);
  assert.equal(streakRecoveryPrice(365), 500);
});

const NOW = Date.parse('2026-09-21T10:00:00Z');

test('no offer without a lost streak', () => {
  assert.equal(getStreakRecoveryOffer(null, NOW), null);
  assert.equal(getStreakRecoveryOffer({ streak: 1, coins: 999, lost_streak: 0, lost_streak_at: null }, NOW), null);
  assert.equal(getStreakRecoveryOffer({ streak: 1, coins: 999, lost_streak: 8, lost_streak_at: null }, NOW), null);
});

test('offer inside the 48h window adds the current streak', () => {
  const offer = getStreakRecoveryOffer({
    streak: 2, coins: 200, lost_streak: 10, lost_streak_at: '2026-09-20T09:00:00Z',
  }, NOW);
  assert.ok(offer);
  assert.equal(offer.lostStreak, 10);
  assert.equal(offer.price, 100);
  assert.equal(offer.recoveredStreak, 12);
  assert.equal(offer.canAfford, true);
  assert.equal(offer.expiresAt, Date.parse('2026-09-22T09:00:00Z'));
});

test('offer expires after 48h and reports when coins are short', () => {
  assert.equal(getStreakRecoveryOffer({
    streak: 1, coins: 200, lost_streak: 10, lost_streak_at: '2026-09-19T09:00:00Z',
  }, NOW), null);

  const poor = getStreakRecoveryOffer({
    streak: 1, coins: 40, lost_streak: 10, lost_streak_at: '2026-09-21T09:00:00Z',
  }, NOW);
  assert.ok(poor);
  assert.equal(poor.canAfford, false);
});

test('at-risk notice only after two full days without answering', () => {
  const today = '2026-09-21';
  assert.equal(getStreakAtRiskNotice({ streak: 1 }, [], today), null);
  assert.equal(getStreakAtRiskNotice({ streak: 7 }, ['2026-09-21'], today), null);
  assert.equal(getStreakAtRiskNotice({ streak: 7 }, ['2026-09-20'], today), null);
  // One-day gap: PRO or a streak freeze may still save it → no alarm.
  assert.equal(getStreakAtRiskNotice({ streak: 7 }, ['2026-09-19'], today), null);

  const notice = getStreakAtRiskNotice({ streak: 7 }, ['2026-09-18'], today);
  assert.ok(notice);
  assert.equal(notice.streak, 7);
  assert.equal(notice.price, 70);
});
