import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import { adsConfigured, disableAds, initializeAds } from '@/lib/ads';
import {
  startAppsFlyerAfterPersonalizedConsent,
  stopAppsFlyerForPrivacy,
} from '@/lib/appsflyer';
import { startMetaAfterPersonalizedConsent, stopMetaForPrivacy } from '@/lib/metaSdk';
import { ensureTrackingPermission } from '@/lib/tracking';

let generation = 0;
let lastDecision: AdsConsentDecision | null = null;
let adsLockedUntilRestart = false;

export async function applyAdvertisingDecision(decision: AdsConsentDecision): Promise<void> {
  // Cierre último: en una build sin anuncios posibles no hay nada que aplicar
  // y, sobre todo, nada que pedir. Las pantallas que llevan aquí ya comprueban
  // `adsConfigured()`, pero esta es la única función que dispara ATT, AppsFlyer
  // y Meta, así que la condición vive también donde no se puede olvidar.
  // Detener tampoco hace falta: si nada arrancó, no hay nada que parar.
  if (!adsConfigured()) return;

  const operation = ++generation;
  const previousDecision = lastDecision;
  lastDecision = decision;

  if (decision.ageBracket === 'minor') {
    adsLockedUntilRestart = true;
    disableAds();
    stopAppsFlyerForPrivacy();
    await stopMetaForPrivacy();
    return;
  }

  if (decision.choice === 'contextual') {
    // Si se retira una elección personalizada, cortamos solicitudes de esta
    // sesión. El siguiente arranque podrá iniciar MAX ya en modo contextual.
    if (previousDecision?.choice === 'personalized') adsLockedUntilRestart = true;
    if (adsLockedUntilRestart) {
      disableAds();
      stopAppsFlyerForPrivacy();
      await stopMetaForPrivacy();
      return;
    }
    stopAppsFlyerForPrivacy();
    await stopMetaForPrivacy();
    if (operation !== generation) return;
    await initializeAds(decision);
    return;
  }

  // Orden obligatorio: elección -> ATT -> MAX -> AppsFlyer/Meta.
  adsLockedUntilRestart = false;
  const trackingDecision = await ensureTrackingPermission();
  if (operation !== generation) return;
  await initializeAds(decision);
  if (operation !== generation) return;
  await startAppsFlyerAfterPersonalizedConsent();
  await startMetaAfterPersonalizedConsent(trackingDecision === 'granted');
}
