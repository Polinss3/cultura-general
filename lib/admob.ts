import { Platform } from 'react-native';
import { getTrackingPermissionsAsync, PermissionStatus } from 'expo-tracking-transparency';
import mobileAds, {
  AdsConsent,
  AdsConsentInfo,
  AdsConsentStatus,
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  MaxAdContentRating,
  TestIds,
} from 'react-native-google-mobile-ads';

export type AdPlacement = 'daily_answered' | 'speed_complete' | 'learn_checkpoint' | 'ladder_complete';
export type RewardedPlacement = 'shop_coins' | 'ladder_revive' | 'speed_time';

const INTERSTITIAL_COOLDOWN_MS = 45_000;

let initPromise: Promise<void> | null = null;
let interstitial: InterstitialAd | null = null;
let interstitialUnitId: string | null = null;
let loadingInterstitial = false;
let showingInterstitial = false;
let lastInterstitialShownAt = 0;
let consentPromise: Promise<boolean> | null = null;
let canRequestAds = false;
let requestNonPersonalizedAdsOnly = true;

function isNativePlatform() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

function getProductionInterstitialUnitId() {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID;
  }
  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID;
  }
  return undefined;
}

function getInterstitialUnitId() {
  if (!isNativePlatform()) return null;
  if (__DEV__) return TestIds.INTERSTITIAL;
  return getProductionInterstitialUnitId() || null;
}

export function isAdMobReadyForProduction() {
  return isNativePlatform() && Boolean(getProductionInterstitialUnitId());
}

async function gatherConsent() {
  if (!isNativePlatform()) return false;
  if (consentPromise) return consentPromise;

  consentPromise = (async () => {
    try {
      const info: AdsConsentInfo = await AdsConsent.gatherConsent({
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
      });
      canRequestAds = info.canRequestAds;
      requestNonPersonalizedAdsOnly = !(await canRequestPersonalizedAds(info));
      return canRequestAds;
    } catch {
      canRequestAds = __DEV__;
      requestNonPersonalizedAdsOnly = true;
      return canRequestAds;
    }
  })();

  return consentPromise;
}

async function canRequestPersonalizedAds(info: AdsConsentInfo) {
  let consentAllowsPersonalization = info.status === AdsConsentStatus.NOT_REQUIRED;

  if (info.status === AdsConsentStatus.OBTAINED) {
    try {
      const choices = await AdsConsent.getUserChoices();
      consentAllowsPersonalization =
        choices.storeAndAccessInformationOnDevice &&
        choices.createAPersonalisedAdsProfile &&
        choices.selectPersonalisedAds;
    } catch {
      consentAllowsPersonalization = false;
    }
  }

  if (Platform.OS === 'ios') {
    try {
      const tracking = await getTrackingPermissionsAsync();
      if (tracking.status !== PermissionStatus.GRANTED) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return consentAllowsPersonalization;
}

function ensureInterstitial() {
  const unitId = getInterstitialUnitId();
  if (!unitId || !canRequestAds) return null;
  if (interstitial && interstitialUnitId === unitId) return interstitial;

  interstitial?.removeAllListeners();
  interstitialUnitId = unitId;
  loadingInterstitial = false;
  showingInterstitial = false;

  interstitial = InterstitialAd.createForAdRequest(unitId, {
    keywords: ['education', 'quiz', 'trivia', 'culture'],
    requestNonPersonalizedAdsOnly,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    loadingInterstitial = false;
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    loadingInterstitial = false;
    setTimeout(() => {
      preloadInterstitialAd();
    }, 30_000);
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    showingInterstitial = false;
    lastInterstitialShownAt = Date.now();
    preloadInterstitialAd();
  });

  return interstitial;
}

export async function initializeAdMob() {
  if (!isNativePlatform() || !getInterstitialUnitId()) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const consentAllowsAds = await gatherConsent();
      if (!consentAllowsAds) return;

      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
      });
      await mobileAds().initialize();
      preloadInterstitialAd();
    } catch {
      initPromise = null;
    }
  })();

  return initPromise;
}

export function preloadInterstitialAd() {
  const ad = ensureInterstitial();
  if (!ad || ad.loaded || loadingInterstitial || showingInterstitial) return;

  try {
    loadingInterstitial = true;
    ad.load();
  } catch {
    loadingInterstitial = false;
  }
}

export async function showInterstitialAd(_placement: AdPlacement) {
  if (!isNativePlatform()) return false;

  await initializeAdMob();

  const ad = ensureInterstitial();
  if (!ad || showingInterstitial) return false;

  const elapsed = Date.now() - lastInterstitialShownAt;
  if (lastInterstitialShownAt > 0 && elapsed < INTERSTITIAL_COOLDOWN_MS) {
    preloadInterstitialAd();
    return false;
  }

  if (!ad.loaded) {
    preloadInterstitialAd();
    return false;
  }

  try {
    showingInterstitial = true;
    await ad.show();
    return true;
  } catch {
    showingInterstitial = false;
    preloadInterstitialAd();
    return false;
  }
}

// ─── Rewarded ads (monedas / vida extra / +tiempo) ───────────
let showingRewarded = false;

function getProductionRewardedUnitId() {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID;
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID;
  return undefined;
}

function getRewardedUnitId() {
  if (!isNativePlatform()) return null;
  if (__DEV__) return TestIds.REWARDED;
  return getProductionRewardedUnitId() || null;
}

export function isRewardedReady() {
  return isNativePlatform() && (__DEV__ || Boolean(getProductionRewardedUnitId()));
}

// Muestra un anuncio recompensado. Resuelve true SOLO si el usuario
// completó el anuncio y se ganó la recompensa.
export async function showRewardedAd(_placement: RewardedPlacement): Promise<boolean> {
  const unitId = getRewardedUnitId();
  if (!unitId || showingRewarded) return false;

  await initializeAdMob();
  if (!canRequestAds) return false;

  return new Promise<boolean>(resolve => {
    let settled = false;
    let earned = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      showingRewarded = false;
      try { ad.removeAllListeners(); } catch {}
      resolve(value);
    };

    const ad = RewardedAd.createForAdRequest(unitId, {
      keywords: ['education', 'quiz', 'trivia', 'culture'],
      requestNonPersonalizedAdsOnly,
    });

    ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      try {
        showingRewarded = true;
        ad.show();
      } catch {
        finish(false);
      }
    });
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => { earned = true; });
    ad.addAdEventListener(AdEventType.CLOSED, () => finish(earned));
    ad.addAdEventListener(AdEventType.ERROR, () => finish(false));

    // Salvaguarda: si no carga/abre en 12 s, abortamos.
    setTimeout(() => finish(earned), 12_000);

    try {
      ad.load();
    } catch {
      finish(false);
    }
  });
}
