import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADS_CONSENT_STORAGE_KEY = 'g101-ads-consent';
// Subirla invalida las decisiones guardadas y vuelve a preguntar. Sufijo `b`
// porque el corte de edad bajó de 18 a 16 el mismo día que se publicó `a`.
export const ADS_NOTICE_VERSION = '2026-08-02b';

/**
 * Edad mínima a partir de la cual tratamos al usuario como adulto a efectos
 * publicitarios. AppLovin no fija ninguna cifra: prohíbe inicializar el SDK
 * con quien sea "child" según la ley aplicable y deja la determinación al
 * publisher. 16 es el número más bajo que vale en todo el EEE sin lógica por
 * país, porque Alemania, Irlanda, Países Bajos y Croacia no bajan del 16 en
 * el art. 8 del RGPD. Bajar más exigiría resolver el país del usuario.
 */
export const ADS_MIN_AGE = 16;

export type AdsAgeBracket = 'minor' | 'adult';
export type AdsChoice = 'contextual' | 'personalized';

export type AdsConsentDecision = {
  ageBracket: AdsAgeBracket;
  choice: AdsChoice | null;
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
  if (decision.noticeVersion !== ADS_NOTICE_VERSION) return false;
  if (decision.ageBracket !== 'minor' && decision.ageBracket !== 'adult') return false;
  if (decision.ageBracket === 'minor' && decision.choice !== null) return false;
  if (
    decision.ageBracket === 'adult' &&
    decision.choice !== 'contextual' &&
    decision.choice !== 'personalized'
  ) return false;
  return typeof decision.decidedAt === 'string' && typeof decision.language === 'string';
}

function publish(decision: AdsConsentDecision | null) {
  currentDecision = decision;
  decisionListeners.forEach(listener => listener(decision));
}

export async function hydrateAdsConsent(): Promise<AdsConsentDecision | null> {
  if (hydrated) return currentDecision;
  hydrated = true;
  try {
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
  input: Pick<AdsConsentDecision, 'ageBracket' | 'choice' | 'language'>,
): Promise<AdsConsentDecision> {
  const decision: AdsConsentDecision = {
    ...input,
    decidedAt: new Date().toISOString(),
    noticeVersion: ADS_NOTICE_VERSION,
  };
  if (!isValidDecision(decision)) throw new Error('Invalid advertising consent decision');
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
