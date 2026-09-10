// Política de pausas naturales para publicidad PROPIA (2.2.0). Con AppLovin
// exigía 3 partidas y 90 s de sesión antes del primero y 2 minutos entre
// intersticiales; eran anuncios ajenos y molestos. Los nuestros solo
// promocionan apps propias, así que salen al acabar cada partida. El único
// freno es no encadenar dos: en Contrarreloj o Ascenso una partida puede durar
// diez segundos.
export const AUTO_INTERSTITIAL_MIN_RESULTS = 1;
export const AUTO_INTERSTITIAL_MIN_SESSION_MS = 0;
export const AUTO_INTERSTITIAL_COOLDOWN_MS = 30_000;
export const FULLSCREEN_SHARED_WINDOW_MS = 15_000;
export const AUTO_INTERSTITIAL_HOURLY_LIMIT = 20;

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

