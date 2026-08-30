import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUTO_INTERSTITIAL_COOLDOWN_MS,
  AUTO_INTERSTITIAL_HOURLY_LIMIT,
  AUTO_INTERSTITIAL_MIN_SESSION_MS,
  FULLSCREEN_SHARED_WINDOW_MS,
  canShowAutomaticInterstitial,
  createAdPolicyState,
  attributionAllowed,
  getAdRetryDelayMs,
  parseAppodealPaidAmount,
  recordCompletedResult,
  recordFullscreenClosed,
  resolveAdMode,
  resolveAppodealRuntimeConfig,
} from './adPolicy';

test('Appodeal runtime fails closed and never reuses the iOS key on Android', () => {
  assert.equal(resolveAdMode(undefined, false), 'off');
  assert.equal(resolveAdMode('yes', false), 'off');
  assert.equal(resolveAdMode('live', true), 'test');
  assert.deepEqual(resolveAppodealRuntimeConfig({
    modeValue: 'test', isDev: false, platform: 'ios',
    iosAppKey: ' ios-key ', androidAppKey: undefined,
  }), { mode: 'test', appKey: 'ios-key', enabled: true });
  assert.deepEqual(resolveAppodealRuntimeConfig({
    modeValue: 'live', isDev: false, platform: 'android',
    iosAppKey: 'ios-key', androidAppKey: undefined,
  }), { mode: 'live', appKey: null, enabled: false });
});

test('only granted ATT enables attribution', () => {
  assert.equal(attributionAllowed('granted'), true);
  assert.equal(attributionAllowed('denied'), false);
  assert.equal(attributionAllowed('unavailable'), false);
});

test('Appodeal retry delay backs off to 64 seconds', () => {
  assert.equal(getAdRetryDelayMs(1), 2_000);
  assert.equal(getAdRetryDelayMs(2), 4_000);
  assert.equal(getAdRetryDelayMs(20), 64_000);
});

test('validates Appodeal ILRD payloads before AppsFlyer', () => {
  assert.deepEqual(parseAppodealPaidAmount({
    revenue: 0.0123,
    currency: 'USD',
    networkName: 'BidMachine',
    adUnitName: 'interstitial',
    placement: 'speed_result_interstitial',
    revenuePrecision: 'exact',
  }), {
    value: 0.0123,
    currency: 'USD',
    networkName: 'BidMachine',
    adUnitName: 'interstitial',
    placement: 'speed_result_interstitial',
    precision: 'exact',
  });
  assert.equal(parseAppodealPaidAmount({
    revenue: -1, currency: 'USD', networkName: 'BidMachine', adUnitName: 'rewarded',
  }), null);
});

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
