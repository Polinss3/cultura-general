import { AppState, Platform } from 'react-native';
import AppLovinMAX, {
  InterstitialAd,
  BannerAd,
  Privacy,
  RewardedAd,
  type AdInfo,
  type Configuration,
} from 'react-native-applovin-max';
import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import {
  RESULT_INTERSTITIAL_DELAY_MS,
  canShowAutomaticInterstitial,
  createAdPolicyState,
  recordCompletedResult,
  recordFullscreenClosed,
} from '@/utils/adPolicy';
import { logAppsFlyerAdRevenue } from '@/lib/appsflyer';

export type AdPlacement =
  | 'daily_answered'
  | 'speed_complete'
  | 'ladder_complete'
  | 'flags_complete'
  | 'years_complete';
export type RewardedPlacement = 'shop_coins' | 'ladder_revive' | 'speed_time';
export type AdsMode = 'off' | 'test' | 'live';

const RETRY_DELAYS_MS = [2_000, 4_000, 8_000, 16_000, 32_000, 64_000] as const;

let initPromise: Promise<boolean> | null = null;
let initialized = false;
let requestsEnabled = false;
let sdkConfiguration: Configuration | null = null;
let listenersInstalled = false;
let interstitialReady = false;
let interstitialLoading = false;
let rewardedReady = false;
let rewardedLoading = false;
let showingInterstitial = false;
let showingRewarded = false;
let interstitialRetryIndex = 0;
let rewardedRetryIndex = 0;
let interstitialRetryTimer: ReturnType<typeof setTimeout> | null = null;
let rewardedRetryTimer: ReturnType<typeof setTimeout> | null = null;
let resultTimer: ReturnType<typeof setTimeout> | null = null;
let rewardedTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingReward:
  | { earned: boolean; resolve: (value: boolean) => void }
  | null = null;
let policyState = createAdPolicyState();
let adsGeneration = 0;
const stateListeners = new Set<() => void>();

function isNativePlatform() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

function parseMode(raw = process.env.EXPO_PUBLIC_ADS_MODE): AdsMode {
  const normalized = raw?.trim().toLowerCase();
  if (normalized !== 'off' && normalized !== 'test' && normalized !== 'live') return 'off';
  if (__DEV__ && normalized === 'live') return 'test';
  return normalized;
}

function currentMode() {
  return parseMode();
}

function envValue(name: string): string | null {
  const value = (() => {
    switch (name) {
      case 'EXPO_PUBLIC_APPLOVIN_SDK_KEY': return process.env.EXPO_PUBLIC_APPLOVIN_SDK_KEY;
      case 'EXPO_PUBLIC_APPLOVIN_IOS_INTERSTITIAL': return process.env.EXPO_PUBLIC_APPLOVIN_IOS_INTERSTITIAL;
      case 'EXPO_PUBLIC_APPLOVIN_ANDROID_INTERSTITIAL': return process.env.EXPO_PUBLIC_APPLOVIN_ANDROID_INTERSTITIAL;
      case 'EXPO_PUBLIC_APPLOVIN_IOS_REWARDED': return process.env.EXPO_PUBLIC_APPLOVIN_IOS_REWARDED;
      case 'EXPO_PUBLIC_APPLOVIN_ANDROID_REWARDED': return process.env.EXPO_PUBLIC_APPLOVIN_ANDROID_REWARDED;
      case 'EXPO_PUBLIC_APPLOVIN_IOS_BANNER': return process.env.EXPO_PUBLIC_APPLOVIN_IOS_BANNER;
      case 'EXPO_PUBLIC_APPLOVIN_ANDROID_BANNER': return process.env.EXPO_PUBLIC_APPLOVIN_ANDROID_BANNER;
      case 'EXPO_PUBLIC_APPLOVIN_TEST_DEVICE_IDS': return process.env.EXPO_PUBLIC_APPLOVIN_TEST_DEVICE_IDS;
      default: return undefined;
    }
  })()?.trim();
  return value || null;
}

function getInterstitialAdUnitId() {
  if (Platform.OS === 'ios') return envValue('EXPO_PUBLIC_APPLOVIN_IOS_INTERSTITIAL');
  if (Platform.OS === 'android') return envValue('EXPO_PUBLIC_APPLOVIN_ANDROID_INTERSTITIAL');
  return null;
}

function getRewardedAdUnitId() {
  if (Platform.OS === 'ios') return envValue('EXPO_PUBLIC_APPLOVIN_IOS_REWARDED');
  if (Platform.OS === 'android') return envValue('EXPO_PUBLIC_APPLOVIN_ANDROID_REWARDED');
  return null;
}

export function getBannerAdUnitId() {
  if (Platform.OS === 'ios') return envValue('EXPO_PUBLIC_APPLOVIN_IOS_BANNER');
  if (Platform.OS === 'android') return envValue('EXPO_PUBLIC_APPLOVIN_ANDROID_BANNER');
  return null;
}

function parseBoolean(raw: string | undefined) {
  return raw?.trim().toLowerCase() === 'true';
}

function getConfiguredAdUnitIds() {
  return [getInterstitialAdUnitId(), getRewardedAdUnitId(), getBannerAdUnitId()].filter(
    (id): id is string => Boolean(id),
  );
}

function notifyState() {
  stateListeners.forEach(listener => listener());
}

export function subscribeAdsState(listener: () => void) {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

function clearTimer(timer: ReturnType<typeof setTimeout> | null) {
  if (timer) clearTimeout(timer);
}

function scheduleInterstitialRetry() {
  clearTimer(interstitialRetryTimer);
  if (!requestsEnabled || !getInterstitialAdUnitId()) return;
  const delay = RETRY_DELAYS_MS[Math.min(interstitialRetryIndex, RETRY_DELAYS_MS.length - 1)];
  interstitialRetryIndex += 1;
  interstitialRetryTimer = setTimeout(preloadInterstitial, delay);
}

function scheduleRewardedRetry() {
  clearTimer(rewardedRetryTimer);
  if (!requestsEnabled || !getRewardedAdUnitId() || !rewardedFeatureEnabled()) return;
  const delay = RETRY_DELAYS_MS[Math.min(rewardedRetryIndex, RETRY_DELAYS_MS.length - 1)];
  rewardedRetryIndex += 1;
  rewardedRetryTimer = setTimeout(preloadRewarded, delay);
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

function matches(info: { adUnitId: string }, expected: string | null) {
  return Boolean(expected && info.adUnitId === expected);
}

function installListeners() {
  if (listenersInstalled) return;
  listenersInstalled = true;

  InterstitialAd.addAdLoadedEventListener(info => {
    if (!matches(info, getInterstitialAdUnitId())) return;
    interstitialReady = true;
    interstitialLoading = false;
    interstitialRetryIndex = 0;
    notifyState();
  });
  InterstitialAd.addAdLoadFailedEventListener(info => {
    if (!matches(info, getInterstitialAdUnitId())) return;
    interstitialReady = false;
    interstitialLoading = false;
    notifyState();
    scheduleInterstitialRetry();
  });
  InterstitialAd.addAdDisplayedEventListener(info => {
    if (!matches(info, getInterstitialAdUnitId())) return;
    interstitialReady = false;
    showingInterstitial = true;
    notifyState();
  });
  InterstitialAd.addAdFailedToDisplayEventListener(info => {
    if (!matches(info, getInterstitialAdUnitId())) return;
    showingInterstitial = false;
    interstitialReady = false;
    notifyState();
    scheduleInterstitialRetry();
  });
  InterstitialAd.addAdHiddenEventListener(info => {
    if (!matches(info, getInterstitialAdUnitId())) return;
    showingInterstitial = false;
    policyState = recordFullscreenClosed(policyState, 'interstitial');
    notifyState();
    preloadInterstitial();
  });
  InterstitialAd.addAdRevenuePaidListener(handleAdRevenue);

  RewardedAd.addAdLoadedEventListener(info => {
    if (!matches(info, getRewardedAdUnitId())) return;
    rewardedReady = true;
    rewardedLoading = false;
    rewardedRetryIndex = 0;
    notifyState();
  });
  RewardedAd.addAdLoadFailedEventListener(info => {
    if (!matches(info, getRewardedAdUnitId())) return;
    rewardedReady = false;
    rewardedLoading = false;
    notifyState();
    finishRewarded(false);
    scheduleRewardedRetry();
  });
  RewardedAd.addAdDisplayedEventListener(info => {
    if (!matches(info, getRewardedAdUnitId())) return;
    rewardedReady = false;
    showingRewarded = true;
    notifyState();
  });
  RewardedAd.addAdFailedToDisplayEventListener(info => {
    if (!matches(info, getRewardedAdUnitId())) return;
    rewardedReady = false;
    showingRewarded = false;
    notifyState();
    finishRewarded(false);
    scheduleRewardedRetry();
  });
  RewardedAd.addAdReceivedRewardEventListener(info => {
    if (!matches(info, getRewardedAdUnitId()) || !pendingReward) return;
    pendingReward.earned = true;
  });
  RewardedAd.addAdHiddenEventListener(info => {
    if (!matches(info, getRewardedAdUnitId())) return;
    policyState = recordFullscreenClosed(policyState, 'rewarded');
    finishRewarded(Boolean(pendingReward?.earned));
    preloadRewarded();
  });
  RewardedAd.addAdRevenuePaidListener(handleAdRevenue);
}

function preloadInterstitial() {
  const adUnitId = getInterstitialAdUnitId();
  if (!requestsEnabled || !adUnitId || interstitialReady || interstitialLoading || showingInterstitial) return;
  try {
    interstitialLoading = true;
    InterstitialAd.loadAd(adUnitId);
  } catch {
    interstitialLoading = false;
    scheduleInterstitialRetry();
  }
}

function rewardedFeatureEnabled() {
  return parseBoolean(process.env.EXPO_PUBLIC_REWARDED_HINTS);
}

function preloadRewarded() {
  const adUnitId = getRewardedAdUnitId();
  if (
    !requestsEnabled || !rewardedFeatureEnabled() || !adUnitId ||
    rewardedReady || rewardedLoading || showingRewarded
  ) return;
  try {
    rewardedLoading = true;
    RewardedAd.loadAd(adUnitId);
  } catch {
    rewardedLoading = false;
    scheduleRewardedRetry();
  }
}

export function markAdsSessionStarted() {
  policyState = createAdPolicyState();
}

export async function initializeAds(decision: AdsConsentDecision): Promise<boolean> {
  if (!isNativePlatform() || decision.ageBracket !== 'adult') return false;
  if (currentMode() === 'off') return false;

  const personalized = decision.choice === 'personalized';
  Privacy.setHasUserConsent(personalized);
  Privacy.setDoNotSell(!personalized);

  if (initialized) {
    requestsEnabled = currentMode() === 'live' || sdkConfiguration?.isTestModeEnabled === true;
    if (requestsEnabled) {
      preloadInterstitial();
      preloadRewarded();
    }
    notifyState();
    return requestsEnabled;
  }
  if (initPromise) return initPromise;

  const sdkKey = envValue('EXPO_PUBLIC_APPLOVIN_SDK_KEY');
  const adUnitIds = getConfiguredAdUnitIds();
  if (!sdkKey || adUnitIds.length === 0) return false;

  const initializationGeneration = adsGeneration;
  initPromise = (async () => {
    try {
      const testDeviceIds = (envValue('EXPO_PUBLIC_APPLOVIN_TEST_DEVICE_IDS') ?? '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      if (testDeviceIds.length > 0) AppLovinMAX.setTestDeviceAdvertisingIds(testDeviceIds);

      AppLovinMAX.setInitializationAdUnitIds(adUnitIds);
      AppLovinMAX.setVerboseLogging(currentMode() === 'test');
      installListeners();

      sdkConfiguration = await AppLovinMAX.initialize(sdkKey);
      initialized = true;
      if (initializationGeneration !== adsGeneration) {
        requestsEnabled = false;
        notifyState();
        return false;
      }
      requestsEnabled = currentMode() === 'live' || sdkConfiguration.isTestModeEnabled === true;
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

export function disableAds() {
  adsGeneration += 1;
  if (initialized || initPromise) {
    try {
      Privacy.setHasUserConsent(false);
      Privacy.setDoNotSell(true);
    } catch {}
  }
  requestsEnabled = false;
  interstitialReady = false;
  rewardedReady = false;
  clearTimer(interstitialRetryTimer);
  clearTimer(rewardedRetryTimer);
  clearTimer(resultTimer);
  interstitialRetryTimer = null;
  rewardedRetryTimer = null;
  resultTimer = null;
  const bannerId = getBannerAdUnitId();
  if (bannerId) {
    try {
      BannerAd.hideAd(bannerId);
      BannerAd.stopAutoRefresh(bannerId);
      BannerAd.destroyAd(bannerId);
    } catch {}
  }
  finishRewarded(false);
  notifyState();
}

export async function showResultInterstitial(placement: AdPlacement, allowShow = true): Promise<boolean> {
  policyState = recordCompletedResult(policyState);
  if (!allowShow || !requestsEnabled || showingInterstitial || resultTimer || !canShowAutomaticInterstitial(policyState)) {
    preloadInterstitial();
    return false;
  }

  return new Promise(resolve => {
    resultTimer = setTimeout(async () => {
      resultTimer = null;
      const adUnitId = getInterstitialAdUnitId();
      if (
        !requestsEnabled || !adUnitId || AppState.currentState !== 'active' ||
        showingInterstitial || !canShowAutomaticInterstitial(policyState)
      ) {
        preloadInterstitial();
        resolve(false);
        return;
      }
      try {
        interstitialReady = await InterstitialAd.isAdReady(adUnitId);
        if (!interstitialReady) {
          preloadInterstitial();
          resolve(false);
          return;
        }
        showingInterstitial = true;
        notifyState();
        InterstitialAd.showAd(adUnitId, placement);
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
  return requestsEnabled && rewardedFeatureEnabled() && Boolean(getRewardedAdUnitId()) && !showingRewarded;
}

export async function showRewardedAd(placement: RewardedPlacement): Promise<boolean> {
  const adUnitId = getRewardedAdUnitId();
  if (!requestsEnabled || !rewardedFeatureEnabled() || !adUnitId || showingRewarded || pendingReward) {
    return false;
  }
  try {
    rewardedReady = await RewardedAd.isAdReady(adUnitId);
    if (!rewardedReady) {
      preloadRewarded();
      return false;
    }
  } catch {
    preloadRewarded();
    return false;
  }

  return new Promise(resolve => {
    pendingReward = { earned: false, resolve };
    rewardedTimeout = setTimeout(() => {
      finishRewarded(false);
      preloadRewarded();
    }, 120_000);
    try {
      RewardedAd.showAd(adUnitId, placement);
    } catch {
      finishRewarded(false);
      preloadRewarded();
    }
  });
}

export function isBannerEnabled() {
  return requestsEnabled && parseBoolean(process.env.EXPO_PUBLIC_BANNER_ADS) && Boolean(getBannerAdUnitId());
}

export function handleAdRevenue(adInfo?: AdInfo) {
  if (!adInfo || currentMode() !== 'live' || sdkConfiguration?.isTestModeEnabled) return;
  if (!Number.isFinite(adInfo.revenue) || adInfo.revenue < 0) return;
  if (!adInfo.networkName?.trim() || !adInfo.adUnitId?.trim()) return;
  logAppsFlyerAdRevenue({
    revenue: adInfo.revenue,
    networkName: adInfo.networkName,
    adUnitId: adInfo.adUnitId,
    placement: adInfo.placement,
    adFormat: adInfo.adFormat,
  });
}

export function getAdsDiagnostics() {
  return {
    mode: currentMode(),
    initialized,
    requestsEnabled,
    testMode: sdkConfiguration?.isTestModeEnabled === true,
  };
}
