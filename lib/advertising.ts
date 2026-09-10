import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import { adsConfigured, disableAds, initializeAds } from '@/lib/ads';
import {
  startAppsFlyerAfterMeasurementConsent,
  stopAppsFlyerForPrivacy,
} from '@/lib/appsflyer';
import { startMetaAfterMeasurementConsent, stopMetaForPrivacy } from '@/lib/metaSdk';
import { ensureTrackingPermission } from '@/lib/tracking';

/**
 * Aplica una decisión del aviso de edad y medición.
 *
 * Desde la 2.2.0 son dos cosas independientes y este es el único sitio donde se
 * ven juntas:
 *
 *  - **Edad** gobierna los anuncios. Son propios, sin identificadores ni ATT,
 *    así que basta con ser adulto; no hace falta consentir nada más.
 *  - **Medición** gobierna ATT, AppsFlyer y Meta, que miden de dónde vienen las
 *    instalaciones. No tienen nada que ver con qué anuncio se muestra dentro.
 *
 * El orden importa en el camino de medición: ATT primero, y solo después
 * AppsFlyer y Meta, porque en iOS el identificador que ambos pueden usar
 * depende de la respuesta al diálogo del sistema.
 */

let generation = 0;

export async function applyAdvertisingDecision(decision: AdsConsentDecision): Promise<void> {
  // Cierre último: en una build sin anuncios posibles no se llega a preguntar,
  // así que no hay nada que aplicar ni, sobre todo, nada que pedir. Detener
  // tampoco hace falta: si nada arrancó, no hay nada que parar.
  if (!adsConfigured()) return;

  const operation = ++generation;

  if (decision.ageBracket === 'minor') {
    disableAds();
    stopAppsFlyerForPrivacy();
    await stopMetaForPrivacy();
    return;
  }

  // Los anuncios propios no esperan a la elección de medición: no la necesitan.
  await initializeAds(decision);
  if (operation !== generation) return;

  if (decision.measurement !== 'accepted') {
    stopAppsFlyerForPrivacy();
    await stopMetaForPrivacy();
    return;
  }

  const trackingDecision = await ensureTrackingPermission();
  if (operation !== generation) return;
  await startAppsFlyerAfterMeasurementConsent();
  if (operation !== generation) return;
  await startMetaAfterMeasurementConsent(trackingDecision === 'granted');
}
