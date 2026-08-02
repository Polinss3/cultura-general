import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUTO_INTERSTITIAL_COOLDOWN_MS,
  AUTO_INTERSTITIAL_HOURLY_LIMIT,
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

test('blocks the first two results and the first 90 seconds', () => {
  const twoResults = recordCompletedResult(recordCompletedResult(createAdPolicyState(0)));
  assert.equal(canShowAutomaticInterstitial(twoResults, AUTO_INTERSTITIAL_MIN_SESSION_MS), false);
  assert.equal(canShowAutomaticInterstitial(withThreeResults(0), AUTO_INTERSTITIAL_MIN_SESSION_MS - 1), false);
  assert.equal(canShowAutomaticInterstitial(withThreeResults(0), AUTO_INTERSTITIAL_MIN_SESSION_MS), true);
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

test('caps automatic interstitials at eight in a rolling hour', () => {
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

