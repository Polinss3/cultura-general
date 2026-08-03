export const AUTO_INTERSTITIAL_MIN_RESULTS = 3;
export const AUTO_INTERSTITIAL_MIN_SESSION_MS = 90_000;
export const AUTO_INTERSTITIAL_COOLDOWN_MS = 120_000;
export const FULLSCREEN_SHARED_WINDOW_MS = 25_000;
export const AUTO_INTERSTITIAL_HOURLY_LIMIT = 8;
export const RESULT_INTERSTITIAL_DELAY_MS = 600;

const ONE_HOUR_MS = 60 * 60 * 1000;

export type AdPolicyState = {
  sessionStartedAt: number;
  completedResults: number;
  lastAutomaticInterstitialAt: number | null;
  automaticInterstitials: number[];
  lastFullscreenClosedAt: number | null;
};

export function createAdPolicyState(now = Date.now()): AdPolicyState {
  return {
    sessionStartedAt: now,
    completedResults: 0,
    lastAutomaticInterstitialAt: null,
    automaticInterstitials: [],
    lastFullscreenClosedAt: null,
  };
}

export function recordCompletedResult(state: AdPolicyState): AdPolicyState {
  return { ...state, completedResults: state.completedResults + 1 };
}

export function canShowAutomaticInterstitial(state: AdPolicyState, now = Date.now()): boolean {
  if (state.completedResults < AUTO_INTERSTITIAL_MIN_RESULTS) return false;
  if (now - state.sessionStartedAt < AUTO_INTERSTITIAL_MIN_SESSION_MS) return false;
  if (
    state.lastAutomaticInterstitialAt !== null &&
    now - state.lastAutomaticInterstitialAt < AUTO_INTERSTITIAL_COOLDOWN_MS
  ) return false;
  if (
    state.lastFullscreenClosedAt !== null &&
    now - state.lastFullscreenClosedAt < FULLSCREEN_SHARED_WINDOW_MS
  ) return false;

  const withinLastHour = state.automaticInterstitials.filter(
    timestamp => now - timestamp < ONE_HOUR_MS,
  );
  return withinLastHour.length < AUTO_INTERSTITIAL_HOURLY_LIMIT;
}

export function recordFullscreenClosed(
  state: AdPolicyState,
  format: 'interstitial' | 'rewarded',
  now = Date.now(),
): AdPolicyState {
  const automaticInterstitials = state.automaticInterstitials.filter(
    timestamp => now - timestamp < ONE_HOUR_MS,
  );

  if (format === 'interstitial') automaticInterstitials.push(now);

  return {
    ...state,
    lastFullscreenClosedAt: now,
    lastAutomaticInterstitialAt:
      format === 'interstitial' ? now : state.lastAutomaticInterstitialAt,
    automaticInterstitials,
  };
}

