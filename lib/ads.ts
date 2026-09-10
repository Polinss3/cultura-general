// Stub para web: nunca hay SDK ni anuncios. Mantiene la firma de la versión
// nativa para que las pantallas no tengan que ramificar por plataforma.
import type { AdPresentation } from '@inhouse/mobile-sdk';
import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import type {
  AdPlacement,
  AdsDiagnostics,
  ApplyReward,
  FullscreenAdSlot,
  RewardedOutcome,
  RewardedPlacement,
} from '@/lib/adTypes';

export type {
  AdPlacement,
  AdsMode,
  ApplyReward,
  FullscreenAdSlot,
  RewardGrant,
  RewardedOutcome,
  RewardedPlacement,
} from '@/lib/adTypes';

export function adsConfigured() { return false; }
export function markAdsSessionStarted() {}
export async function initializeAds(_decision: AdsConsentDecision) { return false; }
export function disableAds(_bracket: 'minor' | 'unknown' = 'unknown') {}
export async function showResultInterstitial(_placement: AdPlacement, _allowShow = true) { return false; }
export async function showRewardedAd(_placement: RewardedPlacement, _applyReward: ApplyReward): Promise<RewardedOutcome> { return 'unavailable'; }
export function isRewardedReady() { return false; }
export function isBannerEnabled() { return false; }
export function subscribeAdsState(_listener: () => void) { return () => {}; }
export function subscribeFullscreenAd(_listener: () => void) { return () => {}; }
export function getFullscreenAd(): FullscreenAdSlot | null { return null; }
export function closeFullscreenAd() {}
export function getBannerPlacementId(): string | null { return null; }
export async function requestBannerAd(): Promise<AdPresentation | null> { return null; }
export function registerBannerPresentation(_presentation: AdPresentation) { return () => {}; }
export function flushAdEvents() {}
export function getAdsDiagnostics(): AdsDiagnostics {
  return {
    mode: 'off',
    initialized: false,
    requestsEnabled: false,
    testMode: false,
    ageBracket: 'unknown',
    isPremium: false,
    queuedEvents: 0,
  };
}
