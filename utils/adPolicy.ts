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
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

export type InterstitialLimits = {
  minResults: number;
  minSessionMs: number;
  cooldownMs: number;
  hourlyLimit: number;
};

export const STANDARD_INTERSTITIAL_LIMITS: InterstitialLimits = {
  minResults: AUTO_INTERSTITIAL_MIN_RESULTS,
  minSessionMs: AUTO_INTERSTITIAL_MIN_SESSION_MS,
  cooldownMs: AUTO_INTERSTITIAL_COOLDOWN_MS,
  hourlyLimit: AUTO_INTERSTITIAL_HOURLY_LIMIT,
};

/**
 * Primeros días de una instalación (2.4.0). El 52 % de quienes juegan no
 * vuelve ningún otro día, y con la política estándar el primer intersticial
 * salía justo después de la primera pregunta del día. Así que:
 *
 *  · el primer día (24 h desde la primera apertura) no hay intersticiales;
 *  · el segundo y el tercero, la cadencia de la época de AppLovin: 3 partidas
 *    y 90 s de sesión antes del primero, 2 minutos entre uno y otro.
 */
export const FIRST_DAY_AD_FREE_MS = ONE_DAY_MS;
export const GENTLE_AD_PERIOD_MS = 3 * ONE_DAY_MS;

export const GENTLE_INTERSTITIAL_LIMITS: InterstitialLimits = {
  minResults: 3,
  minSessionMs: 90_000,
  cooldownMs: 120_000,
  hourlyLimit: 8,
};

/**
 * Límites según lo que lleva instalada la app. `null` = ningún intersticial
 * automático. Sin la antigüedad cargada todavía (`installAgeMs === null`) se
 * aplica la suave: es mejor quedarse corto unos segundos que estrenar a un
 * usuario nuevo con un anuncio.
 */
export function interstitialLimitsForInstallAge(
  installAgeMs: number | null,
): InterstitialLimits | null {
  if (installAgeMs === null) return GENTLE_INTERSTITIAL_LIMITS;
  if (installAgeMs < FIRST_DAY_AD_FREE_MS) return null;
  if (installAgeMs < GENTLE_AD_PERIOD_MS) return GENTLE_INTERSTITIAL_LIMITS;
  return STANDARD_INTERSTITIAL_LIMITS;
}

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

export function canShowAutomaticInterstitial(
  state: AdPolicyState,
  now = Date.now(),
  limits: InterstitialLimits | null = STANDARD_INTERSTITIAL_LIMITS,
): boolean {
  if (!limits) return false;
  if (state.completedResults < limits.minResults) return false;
  if (now - state.sessionStartedAt < limits.minSessionMs) return false;
  if (
    state.lastAutomaticInterstitialAt !== null &&
    now - state.lastAutomaticInterstitialAt < limits.cooldownMs
  ) return false;
  if (
    state.lastFullscreenClosedAt !== null &&
    now - state.lastFullscreenClosedAt < FULLSCREEN_SHARED_WINDOW_MS
  ) return false;

  const withinLastHour = state.automaticInterstitials.filter(
    timestamp => now - timestamp < ONE_HOUR_MS,
  );
  return withinLastHour.length < limits.hourlyLimit;
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

