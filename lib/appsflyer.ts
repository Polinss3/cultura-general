import { Platform } from 'react-native';
import appsFlyer, { MEDIATION_NETWORK } from 'react-native-appsflyer';

const IOS_APP_ID = '6766927114';

let initPromise: Promise<boolean> | null = null;
let startPromise: Promise<boolean> | null = null;
let started = false;

function getDevKey() {
  return process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY?.trim() || null;
}

export function isAppsFlyerConfigured() {
  return Boolean(getDevKey());
}

async function initializeAppsFlyer(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  if (initPromise) return initPromise;

  const devKey = getDevKey();
  if (!devKey) return false;

  initPromise = (async () => {
    try {
      await appsFlyer.initSdk({
        devKey,
        ...(Platform.OS === 'ios' ? { appId: IOS_APP_ID } : {}),
        isDebug: __DEV__,
        manualStart: true,
        onInstallConversionDataListener: false,
        onDeepLinkListener: false,
      });
      return true;
    } catch {
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
}

// Solo se invoca después del CMP de Appodeal y de un ATT concedido.
export async function startAppsFlyerAfterPersonalizedConsent(): Promise<boolean> {
  if (started) return true;
  if (startPromise) return startPromise;

  startPromise = (async () => {
    const initialized = await initializeAppsFlyer();
    if (!initialized) return false;
    try {
      appsFlyer.stop(false);
      appsFlyer.startSdk();
      started = true;
      return true;
    } catch {
      return false;
    }
  })();

  const result = await startPromise;
  if (!result) startPromise = null;
  return result;
}

export function stopAppsFlyerForPrivacy(): void {
  if (!initPromise && !started) return;
  try {
    appsFlyer.stop(true);
  } catch {
    // El módulo puede no existir en Expo Go o web.
  }
  started = false;
  startPromise = null;
}

export type AdRevenueFormat = 'banner' | 'interstitial' | 'rewarded';

export function logAppsFlyerAdRevenue(input: {
  value: number;
  currency: string;
  networkName: string;
  adUnitName: string;
  placement?: string | null;
  precision?: string | null;
  format: AdRevenueFormat;
}): boolean {
  if (!started) return false;
  if (!Number.isFinite(input.value) || input.value < 0) return false;
  if (!input.networkName.trim() || !input.adUnitName.trim()) return false;
  try {
    appsFlyer.logAdRevenue({
      monetizationNetwork: input.networkName,
      mediationNetwork: MEDIATION_NETWORK.APPODEAL,
      currencyIso4217Code: input.currency,
      revenue: input.value,
      additionalParameters: {
        ad_unit_name: input.adUnitName,
        ad_format: input.format,
        ...(input.placement ? { placement: input.placement } : {}),
        ...(input.precision ? { revenue_precision: input.precision } : {}),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function logAppsFlyerEvent(
  eventName: string,
  eventValues: Record<string, string | number | boolean> = {},
): Promise<boolean> {
  if (!started) return false;
  try {
    await appsFlyer.logEvent(eventName, eventValues);
    return true;
  } catch {
    return false;
  }
}

export function logTutorialCompletion(skipped: boolean) {
  return logAppsFlyerEvent('af_tutorial_completion', { skipped });
}

export function logLevelAchieved(level: number) {
  return logAppsFlyerEvent('af_level_achieved', { af_level: level });
}
