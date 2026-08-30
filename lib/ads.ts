import type { AdsConsentDecision } from '@/stores/adsConsentStore';

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
} as const;

export function adsConfigured() { return false; }
export function adsConsentGranted() { return false; }
export function markAdsSessionStarted() {}
export async function resolveAdsConsent(_decision: AdsConsentDecision) {
  return { resolved: false, canRequestAds: false };
}
export async function initializeAds(_decision: AdsConsentDecision) { return false; }
export function disableAds() {}
export async function showResultInterstitial(_placement: AdPlacement, _allowShow = true) { return false; }
export async function showRewardedAd(_placement: RewardedPlacement) { return false; }
export function isRewardedReady() { return false; }
export function isBannerEnabled() { return false; }
export function subscribeAdsState(_listener: () => void) { return () => {}; }
export function handleAdRevenue(_payload?: unknown) {}
export async function openAppodealPrivacyOptions() { return false; }
export function getAdsDiagnostics() {
  return { mode: 'off' as AdsMode, initialized: false, requestsEnabled: false, testMode: false };
}
