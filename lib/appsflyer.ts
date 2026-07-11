import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import { prepareAdvertisingConsent } from './admob';

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

/**
 * Prepara el SDK sin enviar atribución todavía. El arranque es manual para
 * resolver primero el consentimiento europeo y ATT.
 */
export async function initializeAppsFlyer(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  if (initPromise) return initPromise;

  const devKey = getDevKey();
  if (!devKey) return false;

  initPromise = (async () => {
    try {
      // Lee las señales IAB TCF generadas por el CMP de Google cuando aplican.
      appsFlyer.enableTCFDataCollection(true);
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

/**
 * Arranca la atribución solo después de que el CMP haya resuelto si se puede
 * medir. ATT puede estar concedido o denegado: AppsFlyer respetará ese estado.
 */
export async function startAppsFlyerAfterConsent(): Promise<boolean> {
  if (started) return true;
  if (startPromise) return startPromise;

  startPromise = (async () => {
    const consentResolved = await prepareAdvertisingConsent();
    if (!consentResolved) return false;

    const initialized = await initializeAppsFlyer();
    if (!initialized) return false;

    try {
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
