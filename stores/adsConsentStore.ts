import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADS_CONSENT_STORAGE_KEY = 'cg-ads-consent';
const LEGACY_ADS_CONSENT_STORAGE_KEY = 'g101-ads-consent';
export const ADS_NOTICE_VERSION = '2026-08-30-appodeal-cmp';

/**
 * Umbral conservador alineado con la integración de 101 Offline Games.
 * No guardamos fecha de nacimiento: únicamente el tramo elegido.
 */
export const ADS_MIN_AGE = 18;

export type AdsAgeBracket = 'minor' | 'adult';

export type AdsConsentDecision = {
  ageBracket: AdsAgeBracket;
  decidedAt: string;
  language: string;
  noticeVersion: typeof ADS_NOTICE_VERSION;
};

type DecisionListener = (decision: AdsConsentDecision | null) => void;
type ReviewListener = () => void;

let hydrated = false;
let currentDecision: AdsConsentDecision | null = null;
const decisionListeners = new Set<DecisionListener>();
const reviewListeners = new Set<ReviewListener>();

function isValidDecision(value: unknown): value is AdsConsentDecision {
  if (!value || typeof value !== 'object') return false;
  const decision = value as Partial<AdsConsentDecision>;
  return (
    decision.noticeVersion === ADS_NOTICE_VERSION &&
    (decision.ageBracket === 'minor' || decision.ageBracket === 'adult') &&
    typeof decision.decidedAt === 'string' &&
    typeof decision.language === 'string'
  );
}

function publish(decision: AdsConsentDecision | null) {
  currentDecision = decision;
  decisionListeners.forEach(listener => listener(decision));
}

export async function hydrateAdsConsent(): Promise<AdsConsentDecision | null> {
  if (hydrated) return currentDecision;
  hydrated = true;
  try {
    // La decisión del proveedor anterior incluía una preferencia propia que ya no
    // gobierna nada: Appodeal debe emitir su propia cadena IAB TCF.
    await AsyncStorage.removeItem(LEGACY_ADS_CONSENT_STORAGE_KEY);
    const raw = await AsyncStorage.getItem(ADS_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidDecision(parsed)) {
      await AsyncStorage.removeItem(ADS_CONSENT_STORAGE_KEY);
      return null;
    }
    publish(parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function getAdsConsentDecision() {
  return currentDecision;
}

export async function saveAdsConsentDecision(
  input: Pick<AdsConsentDecision, 'ageBracket' | 'language'>,
): Promise<AdsConsentDecision> {
  const decision: AdsConsentDecision = {
    ...input,
    decidedAt: new Date().toISOString(),
    noticeVersion: ADS_NOTICE_VERSION,
  };
  if (!isValidDecision(decision)) throw new Error('Invalid advertising age decision');
  await AsyncStorage.setItem(ADS_CONSENT_STORAGE_KEY, JSON.stringify(decision));
  hydrated = true;
  publish(decision);
  return decision;
}

export function subscribeAdsConsent(listener: DecisionListener) {
  decisionListeners.add(listener);
  return () => { decisionListeners.delete(listener); };
}

export function requestAdsPreferencesReview() {
  reviewListeners.forEach(listener => listener());
}

export function subscribeAdsPreferencesReview(listener: ReviewListener) {
  reviewListeners.add(listener);
  return () => { reviewListeners.delete(listener); };
}
