import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADS_CONSENT_STORAGE_KEY = 'g101-ads-consent';
// Subirla invalida las decisiones guardadas y vuelve a preguntar. La `d` es la
// 2.2.0 definitiva: al pasar de AppLovin MAX a publicidad propia se retiraron
// también AppsFlyer, Meta y ATT, y con ellos la segunda pregunta ("¿anuncios
// personalizados?" primero, "¿medimos las instalaciones?" después). El aviso
// pregunta solo el tramo de edad, y una decisión anterior guardaba una
// respuesta a algo que ya no existe.
export const ADS_NOTICE_VERSION = '2026-09-11d';

/**
 * Edad mínima a partir de la cual tratamos al usuario como adulto a efectos
 * publicitarios.
 *
 * In-House Ads no fija ninguna cifra: exige `adult` y deja la determinación al
 * host, advirtiendo de que la clasificación por edad de la tienda no acredita
 * nada. 16 es el número más bajo que vale en todo el EEE sin lógica por país,
 * porque Alemania, Irlanda, Países Bajos y Croacia no bajan del 16 en el art. 8
 * del RGPD. Bajar más exigiría resolver el país del usuario.
 *
 * Se mantiene el mismo corte que con la red anterior aunque ahora los anuncios
 * sean propios y sin identificadores: el listón no baja porque cambie quién
 * sirve el anuncio.
 */
export const ADS_MIN_AGE = 16;

export type AdsAgeBracket = 'minor' | 'adult';

/**
 * Lo único que se pregunta es el tramo de edad. Los anuncios propios no tratan
 * identificadores ni datos personales, así que no hay nada que consentir: el
 * aviso existe porque el SDK exige `adult` y no lo determina por su cuenta.
 */
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
  if (decision.noticeVersion !== ADS_NOTICE_VERSION) return false;
  if (decision.ageBracket !== 'minor' && decision.ageBracket !== 'adult') return false;
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
  input: Pick<AdsConsentDecision, 'ageBracket' | 'language'>,
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
