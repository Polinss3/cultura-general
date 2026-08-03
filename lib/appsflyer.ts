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

// Solo se invoca tras elección personalizada y después de ATT + MAX.
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

export function logAppsFlyerAdRevenue(input: {
  revenue: number;
  networkName: string;
  adUnitId: string;
  placement?: string | null;
  adFormat: string;
}): boolean {
  if (!started) return false;
  if (!Number.isFinite(input.revenue) || input.revenue < 0) return false;
  if (!input.networkName.trim() || !input.adUnitId.trim()) return false;
  try {
    appsFlyer.logAdRevenue({
      monetizationNetwork: input.networkName,
      mediationNetwork: MEDIATION_NETWORK.APPLOVIN_MAX,
      currencyIso4217Code: 'USD',
      revenue: input.revenue,
      additionalParameters: {
        ad_unit_id: input.adUnitId,
        ad_format: input.adFormat,
        ...(input.placement ? { placement: input.placement } : {}),
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
