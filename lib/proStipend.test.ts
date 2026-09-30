import assert from 'node:assert/strict';
import test from 'node:test';
import { daysUntilNextProStipend } from './proStipend';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse('2026-09-24T12:00:00.000Z');

test('monthly PRO coins unlock exactly 28 days after the previous claim', () => {
  const claimedAt = new Date(now).toISOString();
  assert.equal(daysUntilNextProStipend(claimedAt, now), 28);
  assert.equal(daysUntilNextProStipend(claimedAt, now + 27 * DAY), 1);
  assert.equal(daysUntilNextProStipend(claimedAt, now + 28 * DAY - 1), 1);
  assert.equal(daysUntilNextProStipend(claimedAt, now + 28 * DAY), 0);
});

test('no previous claim leaves the coins available', () => {
  assert.equal(daysUntilNextProStipend(null, now), null);
  assert.equal(daysUntilNextProStipend('invalid', now), null);
});
