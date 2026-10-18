import assert from 'node:assert/strict';
import test from 'node:test';
import { REMOVE_ADS_NUDGE_GAP_MS, shouldShowRemoveAdsNudge } from './removeAdsNudge';

const NOW = 1_800_000_000_000;

test('se enseña la primera vez', () => {
  assert.equal(shouldShowRemoveAdsNudge(null, NOW, false), true);
});

test('nunca a quien ya tiene PRO', () => {
  assert.equal(shouldShowRemoveAdsNudge(null, NOW, true), false);
});

test('como mucho una vez al día', () => {
  assert.equal(shouldShowRemoveAdsNudge(NOW - REMOVE_ADS_NUDGE_GAP_MS + 1, NOW, false), false);
  assert.equal(shouldShowRemoveAdsNudge(NOW - REMOVE_ADS_NUDGE_GAP_MS, NOW, false), true);
});

test('un reloj atrasado no lo bloquea', () => {
  assert.equal(shouldShowRemoveAdsNudge(NOW + 60_000, NOW, false), true);
  assert.equal(shouldShowRemoveAdsNudge(Number.NaN, NOW, false), true);
});
