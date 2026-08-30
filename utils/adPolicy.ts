export const AUTO_INTERSTITIAL_MIN_RESULTS = 3;
export const AUTO_INTERSTITIAL_MIN_SESSION_MS = 90_000;
export const AUTO_INTERSTITIAL_COOLDOWN_MS = 120_000;
export const FULLSCREEN_SHARED_WINDOW_MS = 25_000;
export const AUTO_INTERSTITIAL_HOURLY_LIMIT = 8;
export const RESULT_INTERSTITIAL_DELAY_MS = 600;

export type AdMode = 'off' | 'test' | 'live';
export type AdPlatform = 'ios' | 'android' | 'other';

export type AppodealRuntimeConfig = {
  mode: AdMode;
  appKey: string | null;
  enabled: boolean;
};

export function resolveAdMode(value: string | undefined, isDev: boolean): AdMode {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'off' || normalized === 'test') return normalized;
  if (normalized === 'live') return isDev ? 'test' : 'live';
  return 'off';
}

/** Cada plataforma falla cerrada si no tiene su propia App Key. */
export function resolveAppodealRuntimeConfig({
  modeValue,
  isDev,
  platform,
  iosAppKey,
  androidAppKey,
}: {
  modeValue: string | undefined;
  isDev: boolean;
  platform: AdPlatform;
  iosAppKey: string | undefined;
  androidAppKey: string | undefined;
}): AppodealRuntimeConfig {
  const mode = resolveAdMode(modeValue, isDev);
  const appKey = platform === 'ios'
    ? iosAppKey?.trim() || null
    : platform === 'android'
      ? androidAppKey?.trim() || null
      : null;
  return { mode, appKey, enabled: mode !== 'off' && appKey !== null };
}

export function attributionAllowed(trackingDecision: string): boolean {
  return trackingDecision === 'granted';
}

export function getAdRetryDelayMs(failureAttempt: number): number {
  const safeAttempt = Math.max(1, Math.floor(failureAttempt));
  return 2 ** Math.min(6, safeAttempt) * 1000;
}

export type AppodealPaidAmount = {
  value: number;
  currency: 'USD';
  networkName: string;
  adUnitName: string;
  placement?: string;
  precision?: string;
};

/** Valida el callback ILRD: Appodeal entrega USD en unidades, no micros. */
export function parseAppodealPaidAmount(payload: unknown): AppodealPaidAmount | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const source = payload as Record<string, unknown>;
  if (
    typeof source.revenue !== 'number' || !Number.isFinite(source.revenue) || source.revenue < 0 ||
    source.currency !== 'USD' ||
    typeof source.networkName !== 'string' || source.networkName.trim().length === 0 ||
    typeof source.adUnitName !== 'string' || source.adUnitName.trim().length === 0
  ) return null;

  return {
    value: source.revenue,
    currency: 'USD',
    networkName: source.networkName,
    adUnitName: source.adUnitName,
    ...(typeof source.placement === 'string' && source.placement
      ? { placement: source.placement }
      : {}),
    ...(typeof source.revenuePrecision === 'string' && source.revenuePrecision
      ? { precision: source.revenuePrecision }
      : {}),
  };
}

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
