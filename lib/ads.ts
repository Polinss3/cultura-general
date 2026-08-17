import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import type { AdInfo } from 'react-native-applovin-max';

export type AdPlacement =
  | 'daily_answered'
  | 'speed_complete'
  | 'ladder_complete'
  | 'flags_complete'
  | 'years_complete';
export type RewardedPlacement = 'shop_coins' | 'ladder_revive' | 'speed_time';
export type AdsMode = 'off' | 'test' | 'live';

export function adsConfigured() { return false; }
export function markAdsSessionStarted() {}
export async function initializeAds(_decision: AdsConsentDecision) { return false; }
export function disableAds() {}
export async function showResultInterstitial(_placement: AdPlacement, _allowShow = true) { return false; }
export async function showRewardedAd(_placement: RewardedPlacement) { return false; }
export function isRewardedReady() { return false; }
export function isBannerEnabled() { return false; }
export function subscribeAdsState(_listener: () => void) { return () => {}; }
export function getBannerAdUnitId() { return null; }
export function handleAdRevenue(_adInfo?: AdInfo) {}
export function getAdsDiagnostics() {
  return { mode: 'off' as AdsMode, initialized: false, requestsEnabled: false, testMode: false };
}
