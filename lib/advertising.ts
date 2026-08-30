import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import {
  adsConfigured,
  disableAds,
  initializeAds,
  resolveAdsConsent,
} from '@/lib/ads';
import {
  startAppsFlyerAfterPersonalizedConsent,
  stopAppsFlyerForPrivacy,
} from '@/lib/appsflyer';
import { startMetaAfterPersonalizedConsent, stopMetaForPrivacy } from '@/lib/metaSdk';
import { ensureTrackingPermission } from '@/lib/tracking';
import { attributionAllowed } from '@/utils/adPolicy';

let generation = 0;
let lastDecision: AdsConsentDecision | null = null;
let adsLockedUntilRestart = false;

async function stopAttribution() {
  stopAppsFlyerForPrivacy();
  await stopMetaForPrivacy();
}

export async function applyAdvertisingDecision(decision: AdsConsentDecision): Promise<void> {
  if (!adsConfigured()) return;

  const operation = ++generation;
  const previousDecision = lastDecision;
  lastDecision = decision;

  if (decision.ageBracket === 'minor') {
    if (previousDecision?.ageBracket === 'adult') adsLockedUntilRestart = true;
    disableAds();
    await stopAttribution();
    return;
  }

  // Tras haber retirado la elegibilidad no reutilizamos en esta sesión un SDK
  // ya inicializado. El siguiente arranque aplicará la nueva edad desde cero.
  if (adsLockedUntilRestart) {
    disableAds();
    await stopAttribution();
    return;
  }

  // Orden vinculante: edad → CMP Appodeal → ATT → Appodeal → atribución.
  const consent = await resolveAdsConsent(decision);
  if (operation !== generation) return;
  if (!consent.resolved || !consent.canRequestAds) {
    disableAds();
    await stopAttribution();
    return;
  }

  // Evita solapar la hoja del CMP con el prompt del sistema.
  await new Promise(resolve => setTimeout(resolve, 800));
  const trackingDecision = await ensureTrackingPermission();
  if (operation !== generation) return;

  const adsStarted = await initializeAds(decision);
  if (operation !== generation) return;

  const attribution = adsStarted && attributionAllowed(trackingDecision);
  if (!attribution) {
    await stopAttribution();
    return;
  }

  await startAppsFlyerAfterPersonalizedConsent();
  await startMetaAfterPersonalizedConsent(true);
}
