import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUTO_INTERSTITIAL_COOLDOWN_MS,
  AUTO_INTERSTITIAL_HOURLY_LIMIT,
  AUTO_INTERSTITIAL_MIN_RESULTS,
  AUTO_INTERSTITIAL_MIN_SESSION_MS,
  FULLSCREEN_SHARED_WINDOW_MS,
  canShowAutomaticInterstitial,
  createAdPolicyState,
  recordCompletedResult,
  recordFullscreenClosed,
} from './adPolicy';

function withThreeResults(now = 0) {
  let state = createAdPolicyState(now);
  state = recordCompletedResult(state);
  state = recordCompletedResult(state);
  return recordCompletedResult(state);
}

test('never shows before a result and shows right after the first one', () => {
  // Publicidad propia: una partida terminada basta y no hay tiempo mínimo de
  // sesión. Lo que sigue sin poder pasar es un intersticial sin resultado.
  assert.equal(AUTO_INTERSTITIAL_MIN_RESULTS, 1);
  assert.equal(AUTO_INTERSTITIAL_MIN_SESSION_MS, 0);
  assert.equal(canShowAutomaticInterstitial(createAdPolicyState(0), 0), false);
  assert.equal(canShowAutomaticInterstitial(recordCompletedResult(createAdPolicyState(0)), 0), true);
});

test('enforces the automatic cooldown and shared fullscreen window', () => {
  const eligibleAt = AUTO_INTERSTITIAL_MIN_SESSION_MS;
  const afterInterstitial = recordFullscreenClosed(withThreeResults(0), 'interstitial', eligibleAt);
  assert.equal(canShowAutomaticInterstitial(afterInterstitial, eligibleAt + AUTO_INTERSTITIAL_COOLDOWN_MS - 1), false);
  assert.equal(canShowAutomaticInterstitial(afterInterstitial, eligibleAt + AUTO_INTERSTITIAL_COOLDOWN_MS), true);

  const afterRewarded = recordFullscreenClosed(withThreeResults(0), 'rewarded', eligibleAt);
  assert.equal(canShowAutomaticInterstitial(afterRewarded, eligibleAt + FULLSCREEN_SHARED_WINDOW_MS - 1), false);
  assert.equal(canShowAutomaticInterstitial(afterRewarded, eligibleAt + FULLSCREEN_SHARED_WINDOW_MS), true);
});

test('caps automatic interstitials per rolling hour', () => {
  const now = 10_000_000;
  const state = {
    ...withThreeResults(0),
    automaticInterstitials: Array.from(
      { length: AUTO_INTERSTITIAL_HOURLY_LIMIT },
      (_, index) => now - index * AUTO_INTERSTITIAL_COOLDOWN_MS,
    ),
    lastAutomaticInterstitialAt: now - AUTO_INTERSTITIAL_COOLDOWN_MS,
  };
  assert.equal(canShowAutomaticInterstitial(state, now), false);
  assert.equal(canShowAutomaticInterstitial(state, now + 60 * 60 * 1000), true);
});

