import { AppState, Platform } from 'react-native';
import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import {
  RESULT_INTERSTITIAL_DELAY_MS,
  canShowAutomaticInterstitial,
  createAdPolicyState,
  getAdRetryDelayMs,
  parseAppodealPaidAmount,
  recordCompletedResult,
  recordFullscreenClosed,
  resolveAppodealRuntimeConfig,
} from '@/utils/adPolicy';
import { logAppsFlyerAdRevenue, type AdRevenueFormat } from '@/lib/appsflyer';

type AdsModule = typeof import('react-native-appodeal');

export type AdPlacement =
  | 'daily_answered'
  | 'speed_complete'
  | 'ladder_complete'
  | 'flags_complete'
  | 'years_complete';
export type RewardedPlacement = 'shop_coins' | 'ladder_revive' | 'speed_time';
export type AdsMode = 'off' | 'test' | 'live';

export const APPODEAL_PLACEMENTS = {
  gameplayBanner: 'gameplay_banner',
  resultInterstitial: {
    daily_answered: 'daily_result_interstitial',
    speed_complete: 'speed_result_interstitial',
    ladder_complete: 'ladder_result_interstitial',
    flags_complete: 'flags_result_interstitial',
    years_complete: 'years_result_interstitial',
  },
  rewarded: {
    shop_coins: 'shop_coins_rewarded',
    ladder_revive: 'ladder_revive_rewarded',
    speed_time: 'speed_time_rewarded',
  },
} as const satisfies {
  gameplayBanner: string;
  resultInterstitial: Record<AdPlacement, string>;
  rewarded: Record<RewardedPlacement, string>;
};

const CONSENT_INFO_TIMEOUT_MS = 10_000;

let modTried = false;
let mod: AdsModule | null = null;
let initPromise: Promise<boolean> | null = null;
let cmpPromise: Promise<void> | null = null;
let initialized = false;
let consentAllowsAds = false;
let requestsEnabled = false;
let listenersInstalled = false;
let interstitialLoading = false;
let rewardedLoading = false;
let showingInterstitial = false;
let showingRewarded = false;
let interstitialFailureAttempt = 0;
let rewardedFailureAttempt = 0;
let interstitialRetryTimer: ReturnType<typeof setTimeout> | null = null;
let rewardedRetryTimer: ReturnType<typeof setTimeout> | null = null;
let resultTimer: ReturnType<typeof setTimeout> | null = null;
let rewardedTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingReward: { earned: boolean; resolve: (value: boolean) => void } | null = null;
let policyState = createAdPolicyState();
let adsGeneration = 0;
const stateListeners = new Set<() => void>();

const runtime = resolveAppodealRuntimeConfig({
  modeValue: process.env.EXPO_PUBLIC_ADS_MODE,
  isDev: __DEV__,
  platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'other',
  iosAppKey: process.env.EXPO_PUBLIC_APPODEAL_IOS_APP_KEY,
  androidAppKey: process.env.EXPO_PUBLIC_APPODEAL_ANDROID_APP_KEY,
});

function getAdsModule(): AdsModule | null {
  if (!modTried) {
    modTried = true;
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        // El SDK solo se evalúa desde módulos nativos y siempre detrás de las
        // puertas de modo, App Key, edad y CMP.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        mod = require('react-native-appodeal');
      } catch {
        mod = null;
      }
    }
  }
  return mod;
}

function parseBoolean(raw: string | undefined) {
  return raw?.trim().toLowerCase() === 'true';
}

function bannerFeatureEnabled() {
  return parseBoolean(process.env.EXPO_PUBLIC_BANNER_ADS);
}

function rewardedFeatureEnabled() {
  return parseBoolean(process.env.EXPO_PUBLIC_REWARDED_HINTS);
}

function notifyState() {
  stateListeners.forEach(listener => listener());
}

export function subscribeAdsState(listener: () => void) {
  stateListeners.add(listener);
  return () => { stateListeners.delete(listener); };
}

export function adsConsentGranted() {
  return consentAllowsAds && initialized && requestsEnabled;
}

/** Configurada para esta plataforma; no implica que edad/CMP ya permitan pedir anuncios. */
export function adsConfigured(): boolean {
  return runtime.enabled;
}

function clearTimer(timer: ReturnType<typeof setTimeout> | null) {
  if (timer) clearTimeout(timer);
}

async function runAppodealCmp(m: AdsModule, appKey: string): Promise<void> {
  try {
    await Promise.race([
      m.default.requestConsentInfoUpdate(appKey),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Appodeal consent info timed out')), CONSENT_INFO_TIMEOUT_MS);
      }),
    ]);
    await m.default.showConsentFormIfNeeded();
  } catch {
    // Sin una cadena TCF válida, el fallback más restrictivo es contextual.
    m.default.setNonPersonalized(true);
  }
}

/**
 * Orden previo al SDK: edad propia → CMP oficial de Appodeal.
 * La respuesta de personalización vive en la cadena IAB TCF y la aplica el SDK;
 * no interpretamos AppodealConsentStatus como si fuera un sí/no.
 */
export async function resolveAdsConsent(
  decision: AdsConsentDecision,
): Promise<{ resolved: boolean; canRequestAds: boolean }> {
  if (!runtime.enabled || !runtime.appKey) {
    consentAllowsAds = false;
    notifyState();
    return { resolved: false, canRequestAds: false };
  }
  if (decision.ageBracket !== 'adult') {
    disableAds();
    return { resolved: true, canRequestAds: false };
  }

  const m = getAdsModule();
  if (!m) {
    consentAllowsAds = false;
    notifyState();
    return { resolved: false, canRequestAds: false };
  }

  const generation = adsGeneration;
  // Test y privacidad se fijan antes del CMP y, sobre todo, antes de initialize().
  m.default.setTesting(runtime.mode === 'test');
  m.default.setLogLevel(
    runtime.mode === 'test' ? m.AppodealLogLevel.VERBOSE : m.AppodealLogLevel.NONE,
  );
  m.default.setChildDirectedTreatment(false);
  m.default.setNonPersonalized(false);

  cmpPromise ??= runAppodealCmp(m, runtime.appKey);
  await cmpPromise;
  if (generation !== adsGeneration) {
    return { resolved: false, canRequestAds: false };
  }

  consentAllowsAds = true;
  notifyState();
  return { resolved: true, canRequestAds: true };
}

function initializedAdTypes(m: AdsModule): import('react-native-appodeal').AppodealAdType {
  let types = m.AppodealAdType.INTERSTITIAL;
  if (rewardedFeatureEnabled()) types |= m.AppodealAdType.REWARDED_VIDEO;
  if (bannerFeatureEnabled()) types |= m.AppodealAdType.BANNER;
  return types as import('react-native-appodeal').AppodealAdType;
}

async function waitUntilInitialized(
  m: AdsModule,
  types: import('react-native-appodeal').AppodealAdType,
): Promise<void> {
  const deadline = Date.now() + 20_000;
  while (!m.default.isInitialized(types)) {
    if (Date.now() >= deadline) throw new Error('Appodeal initialization timed out');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export async function initializeAds(decision: AdsConsentDecision): Promise<boolean> {
  if (!runtime.enabled || !runtime.appKey || decision.ageBracket !== 'adult') return false;
  if (initialized) {
    requestsEnabled = consentAllowsAds;
    notifyState();
    if (requestsEnabled) {
      preloadInterstitial();
      preloadRewarded();
    }
    return requestsEnabled;
  }
  if (initPromise) return initPromise;

  const initializationGeneration = adsGeneration;
  initPromise = (async () => {
    const consent = await resolveAdsConsent(decision);
    if (!consent.resolved || !consent.canRequestAds) {
      initPromise = null;
      return false;
    }

    const m = getAdsModule();
    if (!m) {
      initPromise = null;
      return false;
    }

    try {
      installListeners(m);
      const types = initializedAdTypes(m);
      m.default.setAutoCache(m.AppodealAdType.INTERSTITIAL, true);
      m.default.setAutoCache(m.AppodealAdType.REWARDED_VIDEO, rewardedFeatureEnabled());
      m.default.setSmartBanners(true);
      m.default.setBannerAnimation(true);
      m.default.initialize(runtime.appKey!, types);
      await waitUntilInitialized(m, types);

      initialized = true;
      requestsEnabled =
        initializationGeneration === adsGeneration && consentAllowsAds;
      notifyState();
      if (!requestsEnabled) return false;

      preloadInterstitial();
      preloadRewarded();
      return true;
    } catch {
      initPromise = null;
      initialized = false;
      requestsEnabled = false;
      notifyState();
      return false;
    }
  })();

  return initPromise;
}

export function markAdsSessionStarted() {
  policyState = createAdPolicyState();
}

function finishRewarded(value: boolean) {
  if (!pendingReward) return;
  clearTimer(rewardedTimeout);
  rewardedTimeout = null;
  const { resolve } = pendingReward;
  pendingReward = null;
  showingRewarded = false;
  notifyState();
  resolve(value);
}

export function disableAds() {
  adsGeneration += 1;
  consentAllowsAds = false;
  requestsEnabled = false;
  interstitialLoading = false;
  rewardedLoading = false;
  showingInterstitial = false;
  clearTimer(interstitialRetryTimer);
  clearTimer(rewardedRetryTimer);
  clearTimer(resultTimer);
  interstitialRetryTimer = null;
  rewardedRetryTimer = null;
  resultTimer = null;

  const m = mod;
  if (m) {
    try {
      m.default.setNonPersonalized(true);
      m.default.setAutoCache(m.AppodealAdType.ALL, false);
      m.default.hide(m.AppodealAdType.BANNER);
    } catch {}
  }
  finishRewarded(false);
  notifyState();
}

function scheduleInterstitialRetry() {
  clearTimer(interstitialRetryTimer);
  if (!requestsEnabled) return;
  interstitialFailureAttempt += 1;
  interstitialRetryTimer = setTimeout(() => {
    interstitialRetryTimer = null;
    preloadInterstitial();
  }, getAdRetryDelayMs(interstitialFailureAttempt));
}

function scheduleRewardedRetry() {
  clearTimer(rewardedRetryTimer);
  if (!requestsEnabled || !rewardedFeatureEnabled()) return;
  rewardedFailureAttempt += 1;
  rewardedRetryTimer = setTimeout(() => {
    rewardedRetryTimer = null;
    preloadRewarded();
  }, getAdRetryDelayMs(rewardedFailureAttempt));
}

function preloadInterstitial() {
  const m = getAdsModule();
  if (!m || !adsConsentGranted() || interstitialLoading || showingInterstitial) return;
  try {
    if (!m.default.isLoaded(m.AppodealAdType.INTERSTITIAL)) {
      interstitialLoading = true;
      m.default.cache(m.AppodealAdType.INTERSTITIAL);
    }
  } catch {
    interstitialLoading = false;
    scheduleInterstitialRetry();
  }
}

function preloadRewarded() {
  const m = getAdsModule();
  if (
    !m || !rewardedFeatureEnabled() || !adsConsentGranted() ||
    rewardedLoading || showingRewarded || pendingReward
  ) return;
  try {
    if (!m.default.isLoaded(m.AppodealAdType.REWARDED_VIDEO)) {
      rewardedLoading = true;
      m.default.cache(m.AppodealAdType.REWARDED_VIDEO);
    }
  } catch {
    rewardedLoading = false;
    scheduleRewardedRetry();
  }
}

export async function showResultInterstitial(
  placement: AdPlacement,
  allowShow = true,
): Promise<boolean> {
  policyState = recordCompletedResult(policyState);
  if (
    !allowShow || !requestsEnabled || showingInterstitial || resultTimer ||
    !canShowAutomaticInterstitial(policyState)
  ) {
    preloadInterstitial();
    return false;
  }

  return new Promise(resolve => {
    resultTimer = setTimeout(() => {
      resultTimer = null;
      const m = getAdsModule();
      const appodealPlacement = APPODEAL_PLACEMENTS.resultInterstitial[placement];
      if (
        !m || !adsConsentGranted() || AppState.currentState !== 'active' ||
        showingInterstitial || !canShowAutomaticInterstitial(policyState) ||
        !m.default.isLoaded(m.AppodealAdType.INTERSTITIAL) ||
        !m.default.canShow(m.AppodealAdType.INTERSTITIAL, appodealPlacement)
      ) {
        preloadInterstitial();
        resolve(false);
        return;
      }

      try {
        showingInterstitial = true;
        notifyState();
        m.default.show(m.AppodealAdType.INTERSTITIAL, appodealPlacement);
        resolve(true);
      } catch {
        showingInterstitial = false;
        preloadInterstitial();
        resolve(false);
      }
    }, RESULT_INTERSTITIAL_DELAY_MS);
  });
}

export function isRewardedReady() {
  const m = mod;
  if (!m || !requestsEnabled || !rewardedFeatureEnabled() || showingRewarded || pendingReward) {
    return false;
  }
  try {
    return m.default.isLoaded(m.AppodealAdType.REWARDED_VIDEO);
  } catch {
    return false;
  }
}

export async function showRewardedAd(placement: RewardedPlacement): Promise<boolean> {
  if (!requestsEnabled || !rewardedFeatureEnabled() || showingRewarded || pendingReward) {
    return false;
  }
  const m = getAdsModule();
  const appodealPlacement = APPODEAL_PLACEMENTS.rewarded[placement];
  if (!m) return false;
  try {
    if (
      !m.default.isLoaded(m.AppodealAdType.REWARDED_VIDEO) ||
      !m.default.canShow(m.AppodealAdType.REWARDED_VIDEO, appodealPlacement)
    ) {
      preloadRewarded();
      return false;
    }
  } catch {
    preloadRewarded();
    return false;
  }

  return new Promise(resolve => {
    pendingReward = { earned: false, resolve };
    showingRewarded = true;
    rewardedTimeout = setTimeout(() => {
      finishRewarded(false);
      preloadRewarded();
    }, 120_000);
    notifyState();
    try {
      m.default.show(m.AppodealAdType.REWARDED_VIDEO, appodealPlacement);
    } catch {
      finishRewarded(false);
      preloadRewarded();
    }
  });
}

export function isBannerEnabled() {
  return adsConsentGranted() && bannerFeatureEnabled();
}

function adFormatFromType(m: AdsModule, adType: unknown): AdRevenueFormat | null {
  if (adType === m.AppodealAdType.BANNER) return 'banner';
  if (adType === m.AppodealAdType.INTERSTITIAL) return 'interstitial';
  if (adType === m.AppodealAdType.REWARDED_VIDEO) return 'rewarded';
  return null;
}

export function handleAdRevenue(payload?: unknown) {
  if (runtime.mode !== 'live' || !payload || typeof payload !== 'object') return;
  const m = getAdsModule();
  const paid = parseAppodealPaidAmount(payload);
  const format = m
    ? adFormatFromType(m, (payload as Record<string, unknown>).adType)
    : null;
  if (!paid || !format) return;
  logAppsFlyerAdRevenue({ ...paid, format });
}

function installListeners(m: AdsModule) {
  if (listenersInstalled) return;
  listenersInstalled = true;

  m.default.addEventListener(m.AppodealSdkEvents.AD_REVENUE, handleAdRevenue);

  m.default.addEventListener(m.AppodealInterstitialEvents.LOADED, () => {
    interstitialLoading = false;
    interstitialFailureAttempt = 0;
    notifyState();
  });
  m.default.addEventListener(m.AppodealInterstitialEvents.FAILED_TO_LOAD, () => {
    interstitialLoading = false;
    notifyState();
    scheduleInterstitialRetry();
  });
  m.default.addEventListener(m.AppodealInterstitialEvents.SHOWN, () => {
    showingInterstitial = true;
    notifyState();
  });
  m.default.addEventListener(m.AppodealInterstitialEvents.FAILED_TO_SHOW, () => {
    showingInterstitial = false;
    notifyState();
    preloadInterstitial();
  });
  m.default.addEventListener(m.AppodealInterstitialEvents.CLOSED, () => {
    showingInterstitial = false;
    policyState = recordFullscreenClosed(policyState, 'interstitial');
    notifyState();
    preloadInterstitial();
  });

  m.default.addEventListener(m.AppodealRewardedEvents.LOADED, () => {
    rewardedLoading = false;
    rewardedFailureAttempt = 0;
    notifyState();
  });
  m.default.addEventListener(m.AppodealRewardedEvents.FAILED_TO_LOAD, () => {
    rewardedLoading = false;
    notifyState();
    finishRewarded(false);
    scheduleRewardedRetry();
  });
  m.default.addEventListener(m.AppodealRewardedEvents.SHOWN, () => {
    showingRewarded = true;
    notifyState();
  });
  m.default.addEventListener(m.AppodealRewardedEvents.REWARD, () => {
    if (pendingReward) pendingReward.earned = true;
  });
  m.default.addEventListener(m.AppodealRewardedEvents.FAILED_TO_SHOW, () => {
    finishRewarded(false);
    preloadRewarded();
  });
  m.default.addEventListener(m.AppodealRewardedEvents.CLOSED, () => {
    policyState = recordFullscreenClosed(policyState, 'rewarded');
    finishRewarded(Boolean(pendingReward?.earned));
    preloadRewarded();
  });
}

export async function openAppodealPrivacyOptions(): Promise<boolean> {
  if (!runtime.enabled || !runtime.appKey) return false;
  const m = getAdsModule();
  if (!m) return false;
  try {
    await m.default.requestConsentInfoUpdate(runtime.appKey);
    await m.default.showPrivacyOptionsForm();
    return true;
  } catch {
    return false;
  }
}

export function getAdsDiagnostics() {
  return {
    mode: runtime.mode as AdsMode,
    initialized,
    requestsEnabled,
    testMode: runtime.mode === 'test',
  };
}
