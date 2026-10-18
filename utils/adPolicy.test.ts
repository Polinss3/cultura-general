import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUTO_INTERSTITIAL_COOLDOWN_MS,
  AUTO_INTERSTITIAL_HOURLY_LIMIT,
  AUTO_INTERSTITIAL_MIN_RESULTS,
  AUTO_INTERSTITIAL_MIN_SESSION_MS,
  FULLSCREEN_SHARED_WINDOW_MS,
  FIRST_DAY_AD_FREE_MS,
  GENTLE_AD_PERIOD_MS,
  GENTLE_INTERSTITIAL_LIMITS,
  STANDARD_INTERSTITIAL_LIMITS,
  canShowAutomaticInterstitial,
  createAdPolicyState,
  interstitialLimitsForInstallAge,
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


test('primer día de la instalación: ningún intersticial', () => {
  const limits = interstitialLimitsForInstallAge(FIRST_DAY_AD_FREE_MS - 1);
  assert.equal(limits, null);
  assert.equal(canShowAutomaticInterstitial(withThreeResults(0), 10 * 60_000, limits), false);
});

test('días 2 y 3: cadencia suave', () => {
  assert.equal(interstitialLimitsForInstallAge(FIRST_DAY_AD_FREE_MS), GENTLE_INTERSTITIAL_LIMITS);
  assert.equal(interstitialLimitsForInstallAge(GENTLE_AD_PERIOD_MS - 1), GENTLE_INTERSTITIAL_LIMITS);

  let state = recordCompletedResult(recordCompletedResult(createAdPolicyState(0)));
  // Con 2 partidas aún no; con 3 sí, pero no antes de 90 s de sesión.
  assert.equal(canShowAutomaticInterstitial(state, 120_000, GENTLE_INTERSTITIAL_LIMITS), false);
  state = recordCompletedResult(state);
  assert.equal(canShowAutomaticInterstitial(state, 60_000, GENTLE_INTERSTITIAL_LIMITS), false);
  assert.equal(canShowAutomaticInterstitial(state, 120_000, GENTLE_INTERSTITIAL_LIMITS), true);

  // Dos minutos entre uno y otro.
  state = recordFullscreenClosed(state, 'interstitial', 120_000);
  assert.equal(canShowAutomaticInterstitial(state, 200_000, GENTLE_INTERSTITIAL_LIMITS), false);
  assert.equal(canShowAutomaticInterstitial(state, 240_000, GENTLE_INTERSTITIAL_LIMITS), true);
});

test('a partir del día 4, o en instalaciones antiguas, la estándar', () => {
  assert.equal(interstitialLimitsForInstallAge(GENTLE_AD_PERIOD_MS), STANDARD_INTERSTITIAL_LIMITS);
  assert.equal(interstitialLimitsForInstallAge(Number.POSITIVE_INFINITY), STANDARD_INTERSTITIAL_LIMITS);
});

test('sin antigüedad cargada todavía se aplica la suave', () => {
  assert.equal(interstitialLimitsForInstallAge(null), GENTLE_INTERSTITIAL_LIMITS);
});
