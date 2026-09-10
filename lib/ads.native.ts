// ─── Publicidad propia (In-House Ads) ────────────────────────────────────────
//
// Sustituye a AppLovin MAX desde la 2.2.0. El servidor es nuestro
// (https://inhouseads.pablobrasero.com) y solo promociona apps y webs propias,
// así que aquí no hay identificadores publicitarios, ni ATT, ni mediación, ni
// almacenamiento persistente del SDK: el cliente vive en memoria y muere con
// el proceso.
//
// Tres reglas que este módulo hace cumplir y que no dependen del servidor:
//
//  1. **Fail-closed por edad.** Sin una respuesta explícita de "adulto" el
//     tramo es `unknown` y no se pide un solo anuncio. La clasificación de la
//     tienda no acredita la edad de nadie.
//  2. **PRO no pide anuncios.** El estado de suscripción se sincroniza con el
//     contexto del SDK, que además invalida al instante lo que hubiera cargado.
//  3. **Intersticiales solo en pausas naturales.** La política de
//     `utils/adPolicy` es anterior a este proveedor y se conserva entera: es
//     nuestra, no suya.
//
// El SDK dibuja el anuncio con un componente React (`AdView`), no con una
// llamada imperativa. El puente es `fullscreen`: la pantalla que quiere un
// anuncio deja aquí la presentación y espera; `AdFullscreenHost`, montado en el
// layout raíz, la pinta y avisa al cerrarse.

import { AppState, Platform } from 'react-native';
import { createNativeAdsClient } from '@inhouse/mobile-sdk/react-native';
import type { AdPresentation, AdsClient } from '@inhouse/mobile-sdk';
import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import type {
  AdPlacement,
  AdsDiagnostics,
  AdsMode,
  ApplyReward,
  FullscreenAdSlot,
  RewardedOutcome,
  RewardedPlacement,
} from '@/lib/adTypes';
import {
  canShowAutomaticInterstitial,
  createAdPolicyState,
  recordCompletedResult,
  recordFullscreenClosed,
} from '@/utils/adPolicy';
import Constants from 'expo-constants';
import i18n, { getCurrentLang } from '@/lib/i18n';
import { getPremiumState, subscribeToPremium } from '@/lib/premium';

export type {
  AdPlacement,
  AdsMode,
  ApplyReward,
  FullscreenAdSlot,
  RewardGrant,
  RewardedOutcome,
  RewardedPlacement,
} from '@/lib/adTypes';

/**
 * Tiempo máximo que una pantalla espera el intersticial antes de enseñar su
 * resultado. El SDK tarda dos viajes (manifest + serve), normalmente menos de
 * un segundo; más de esto ya es una red mala y el usuario no debe quedarse
 * mirando la última pregunta. Si el anuncio llega después de este plazo se
 * descarta sin mostrarse.
 */
const INTERSTITIAL_WAIT_MS = 4_000;

let client: AdsClient | null = null;
let ageBracket: 'adult' | 'minor' | 'unknown' = 'unknown';
let policyState = createAdPolicyState();
let fullscreen: FullscreenAdSlot | null = null;
const stateListeners = new Set<() => void>();
const bannerPresentations = new Set<AdPresentation>();

function isNativePlatform() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

function parseMode(raw = process.env.EXPO_PUBLIC_ADS_MODE): AdsMode {
  const normalized = raw?.trim().toLowerCase();
  if (normalized !== 'off' && normalized !== 'test' && normalized !== 'live') return 'off';
  if (__DEV__ && normalized === 'live') return 'test';
  return normalized;
}

function currentMode() {
  return parseMode();
}

/**
 * Las métricas de `test` quedan aparte en el panel, bajo el filtro «Pruebas».
 * No restringe la entrega: eso lo decide la campaña.
 */
function testMode() {
  return currentMode() === 'test';
}

/**
 * Metro sustituye `process.env.EXPO_PUBLIC_*` en tiempo de compilación solo si
 * la lectura es literal, así que no vale indexar un objeto por variable.
 */
function envValue(name: string): string | null {
  const value = (() => {
    switch (name) {
      case 'EXPO_PUBLIC_INHOUSE_ADS_URL': return process.env.EXPO_PUBLIC_INHOUSE_ADS_URL;
      case 'EXPO_PUBLIC_INHOUSE_APP_ID': return process.env.EXPO_PUBLIC_INHOUSE_APP_ID;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_DAILY_RESULT': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_DAILY_RESULT;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_SPEED_RESULT': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_SPEED_RESULT;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_RESULT': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_RESULT;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_FLAGS_RESULT': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_FLAGS_RESULT;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_YEARS_RESULT': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_YEARS_RESULT;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_SHOP_COINS': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_SHOP_COINS;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_REVIVE': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_REVIVE;
      case 'EXPO_PUBLIC_INHOUSE_PLACEMENT_BANNER': return process.env.EXPO_PUBLIC_INHOUSE_PLACEMENT_BANNER;
      default: return undefined;
    }
  })()?.trim();
  return value || null;
}

function parseBoolean(raw: string | undefined) {
  return raw?.trim().toLowerCase() === 'true';
}

function baseUrl() {
  return envValue('EXPO_PUBLIC_INHOUSE_ADS_URL');
}

function appId() {
  return envValue('EXPO_PUBLIC_INHOUSE_APP_ID');
}

function interstitialPlacementId(placement: AdPlacement) {
  switch (placement) {
    case 'daily_answered': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_DAILY_RESULT');
    case 'speed_complete': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_SPEED_RESULT');
    case 'ladder_complete': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_RESULT');
    case 'flags_complete': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_FLAGS_RESULT');
    case 'years_complete': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_YEARS_RESULT');
  }
}

function rewardedPlacementId(placement: RewardedPlacement) {
  switch (placement) {
    case 'shop_coins': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_SHOP_COINS');
    case 'ladder_revive': return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_REVIVE');
  }
}

export function getBannerPlacementId() {
  return envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_BANNER');
}

function configuredPlacementIds() {
  return [
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_DAILY_RESULT'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_SPEED_RESULT'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_RESULT'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_FLAGS_RESULT'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_YEARS_RESULT'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_SHOP_COINS'),
    envValue('EXPO_PUBLIC_INHOUSE_PLACEMENT_LADDER_REVIVE'),
    getBannerPlacementId(),
  ].filter((id): id is string => Boolean(id));
}

/**
 * ¿Puede esta build llegar a pedir un anuncio? Son exactamente las condiciones
 * con las que se crea el cliente, menos el tramo de edad, que es justo lo que
 * hay que preguntar.
 *
 * Existe para no montar el aviso de edad en una versión que se publica con los
 * anuncios apagados: preguntar por algo que no puede tener ningún efecto
 * confunde al usuario y no cuadra con la ficha de la tienda.
 */
export function adsConfigured(): boolean {
  if (!isNativePlatform()) return false;
  if (currentMode() === 'off') return false;
  return Boolean(baseUrl()) && Boolean(appId()) && configuredPlacementIds().length > 0;
}

function notifyState() {
  stateListeners.forEach(listener => listener());
}

export function subscribeAdsState(listener: () => void) {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

function isPremium() {
  return getPremiumState().isPro;
}

function ensureClient(): AdsClient | null {
  if (client) return client;
  const url = baseUrl();
  const id = appId();
  if (!adsConfigured() || !url || !id) return null;
  try {
    client = createNativeAdsClient({
      baseUrl: url,
      context: {
        appId: id,
        ageBracket,
        isPremium: isPremium(),
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        locale: getCurrentLang(),
        appVersion: Constants.expoConfig?.version ?? '0.0.0',
        testMode: testMode(),
      },
    });
  } catch {
    // `baseUrl` mal formada o sin HTTPS: la app sigue entera, sin anuncios.
    client = null;
  }
  return client;
}

/** Único punto que decide si sale una petición a la red. */
function requestsEnabled() {
  return adsConfigured() && ageBracket === 'adult' && !isPremium() && Boolean(ensureClient());
}

// ─── Contexto: PRO e idioma ──────────────────────────────────────────────────
//
// `updateContext` invalida al instante lo que hubiera cargado y vacía cola y
// caché, que es exactamente lo que queremos cuando alguien compra PRO con un
// anuncio abierto.

if (isNativePlatform()) {
  subscribeToPremium(() => {
    if (!client) return;
    if (client.currentContext.isPremium === isPremium()) return;
    client.updateContext({ isPremium: isPremium() });
    if (isPremium()) closeFullscreen();
    notifyState();
  });
  i18n.on('languageChanged', () => {
    if (!client || client.currentContext.locale === getCurrentLang()) return;
    client.updateContext({ locale: getCurrentLang() });
    notifyState();
  });
}

// ─── Ciclo de vida ───────────────────────────────────────────────────────────

/** Frontera real de sesión de la app, nunca por anuncio. */
export function markAdsSessionStarted() {
  policyState = createAdPolicyState();
  client?.resetSession();
}

export async function initializeAds(decision: AdsConsentDecision): Promise<boolean> {
  if (!adsConfigured() || decision.ageBracket !== 'adult') {
    disableAds(decision.ageBracket === 'minor' ? 'minor' : 'unknown');
    return false;
  }
  ageBracket = 'adult';
  const active = ensureClient();
  if (!active) return false;
  active.updateContext({
    ageBracket: 'adult',
    isPremium: isPremium(),
    locale: getCurrentLang(),
    testMode: testMode(),
  });
  notifyState();
  return true;
}

/**
 * `bracket` conserva lo que el usuario declaró. Para el SDK `minor` y `unknown`
 * son igual de inelegibles, pero mentir en el diagnóstico no ayuda a nadie a
 * entender por qué una build no pide anuncios.
 */
export function disableAds(bracket: 'minor' | 'unknown' = 'unknown') {
  ageBracket = bracket;
  closeFullscreen();
  // Invalida presentaciones vivas (los banners se desmontan solos al verlo).
  client?.updateContext({ ageBracket: bracket });
  bannerPresentations.clear();
  notifyState();
}

// ─── Puente con `AdFullscreenHost` ───────────────────────────────────────────

export function getFullscreenAd(): FullscreenAdSlot | null {
  return fullscreen;
}

export function subscribeFullscreenAd(listener: () => void) {
  return subscribeAdsState(listener);
}

/** Lo llama el host cuando `AdView` se cierra, por la razón que sea. */
export function closeFullscreenAd() {
  fullscreen?.close();
}

function closeFullscreen() {
  const slot = fullscreen;
  if (!slot) return;
  // `dismiss` antes que `invalidate`: registra el cierre y vacía la cola
  // mientras la presentación todavía es válida. Si ya la invalidó un cambio de
  // contexto, no emite nada y tampoco pasa nada.
  slot.presentation.dismiss();
  slot.close();
}

/**
 * Un cliente admite una sola presentación activa. Un banner montado bloquearía
 * el intersticial de la misma pantalla, así que se retira antes de pedirlo.
 */
function releaseBanners() {
  for (const presentation of bannerPresentations) presentation.dismiss();
  bannerPresentations.clear();
  notifyState();
}

export function registerBannerPresentation(presentation: AdPresentation) {
  bannerPresentations.add(presentation);
  return () => {
    bannerPresentations.delete(presentation);
  };
}

// ─── Intersticiales ──────────────────────────────────────────────────────────

/**
 * Se llama SIEMPRE al terminar un resultado, aunque no vaya a haber anuncio:
 * la política cuenta resultados completados, no anuncios mostrados.
 *
 * Contrato con las pantallas: se llama **antes** de enseñar el resultado y se
 * espera (`await`). La promesa se resuelve cuando el anuncio se cierra, o en
 * cuanto se sabe que no lo habrá, así que la pantalla puede encadenar
 * `setPhase('done')` detrás sin que el usuario vea el marcador y arranque otra
 * partida con el anuncio todavía en camino: ese era exactamente el fallo que
 * hacía aparecer un intersticial en mitad de la siguiente ronda.
 */
export async function showResultInterstitial(
  placement: AdPlacement,
  allowShow = true,
): Promise<boolean> {
  policyState = recordCompletedResult(policyState);
  const placementId = interstitialPlacementId(placement);
  if (
    !allowShow || !placementId || fullscreen || AppState.currentState !== 'active' ||
    !requestsEnabled() || !canShowAutomaticInterstitial(policyState)
  ) return false;

  releaseBanners();

  // Carrera entre la petición y el plazo. Si gana el plazo, la pantalla sigue
  // y el anuncio, si llega, se descarta: mostrarlo tarde es peor que no
  // mostrarlo. Cuesta un hueco de frecuencia, pero solo en redes malas.
  let timedOut = false;
  const request = requestAd(placementId, 'interstitial');
  const presentation = await Promise.race([
    request,
    new Promise<null>(resolve => setTimeout(() => { timedOut = true; resolve(null); }, INTERSTITIAL_WAIT_MS)),
  ]);
  if (timedOut) {
    void request.then(late => late?.dismiss());
    return false;
  }
  // Sin campaña, sin red o fuera de límite: la app sigue su curso normal.
  if (!presentation) return false;
  if (fullscreen || AppState.currentState !== 'active') {
    presentation.dismiss();
    return false;
  }

  return new Promise<boolean>(resolve => {
    fullscreen = {
      presentation,
      format: 'interstitial',
      close: () => {
        fullscreen = null;
        policyState = recordFullscreenClosed(policyState, 'interstitial');
        notifyState();
        resolve(true);
      },
    };
    notifyState();
  });
}

async function requestAd(placementId: string, format: 'interstitial' | 'rewarded') {
  try {
    return await ensureClient()!.request({
      placementId,
      format,
      ...(format === 'interstitial' ? { naturalBreak: true } : { voluntary: true }),
    });
  } catch {
    return null;
  }
}

// ─── Recompensados ───────────────────────────────────────────────────────────

/**
 * No hay precarga: el SDK pide el anuncio en el momento. Esto responde a "¿tiene
 * sentido ofrecer el botón?", no a "¿hay un anuncio esperando?".
 */
export function isRewardedReady() {
  return requestsEnabled() && rewardedEnabled() && !fullscreen;
}

function rewardedEnabled() {
  return parseBoolean(process.env.EXPO_PUBLIC_REWARDED_ADS);
}

/**
 * Solo tras una elección explícita del usuario.
 *
 * `applyReward` recibe el recibo firmado por el servidor y debe aplicar el
 * efecto **una sola vez**; se le llama únicamente con una recompensa
 * confirmada. Si lanza, el visor deja el anuncio abierto con un botón de
 * reintento y el mismo recibo, que es justo lo que queremos: cerrar, fallar o
 * no tener campaña nunca concede nada.
 */
export async function showRewardedAd(
  placement: RewardedPlacement,
  applyReward: ApplyReward,
): Promise<RewardedOutcome> {
  const placementId = rewardedPlacementId(placement);
  if (!placementId || fullscreen || !requestsEnabled() || !rewardedEnabled()) return 'unavailable';

  releaseBanners();
  const presentation = await requestAd(placementId, 'rewarded');
  if (!presentation) return 'unavailable';

  let granted = false;
  return new Promise<RewardedOutcome>(resolve => {
    fullscreen = {
      presentation,
      format: 'rewarded',
      onReward: async result => {
        if (!result.granted || !result.receipt) return;
        await applyReward({ receipt: result.receipt, reward: result.reward });
        granted = true;
      },
      close: () => {
        fullscreen = null;
        policyState = recordFullscreenClosed(policyState, 'rewarded');
        notifyState();
        resolve(granted ? 'granted' : 'dismissed');
      },
    };
    notifyState();
  });
}

// ─── Banner ──────────────────────────────────────────────────────────────────

export function isBannerEnabled() {
  return (
    requestsEnabled() &&
    parseBoolean(process.env.EXPO_PUBLIC_BANNER_ADS) &&
    Boolean(getBannerPlacementId())
  );
}

export async function requestBannerAd(): Promise<AdPresentation | null> {
  const placementId = getBannerPlacementId();
  if (!placementId || !isBannerEnabled() || fullscreen) return null;
  try {
    return await ensureClient()!.request({ placementId, format: 'banner' });
  } catch {
    return null;
  }
}

// ─── Diagnóstico ─────────────────────────────────────────────────────────────

export function getAdsDiagnostics(): AdsDiagnostics {
  return {
    mode: currentMode(),
    initialized: Boolean(client),
    requestsEnabled: requestsEnabled(),
    testMode: testMode(),
    ageBracket,
    isPremium: isPremium(),
    queuedEvents: client?.queuedEvents ?? 0,
  };
}

/** Al recuperar conexión conviene vaciar la cola de eventos pendientes. */
export function flushAdEvents() {
  void client?.flush();
}
