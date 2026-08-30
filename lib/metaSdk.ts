import { Platform } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';

let initialized = false;

// Meta permanece completamente parado hasta que el CMP termine y ATT se conceda.
export async function startMetaAfterPersonalizedConsent(trackingGranted: boolean): Promise<void> {
  try {
    Settings.setAutoLogAppEventsEnabled(true);
    Settings.setAdvertiserIDCollectionEnabled(trackingGranted);
    if (Platform.OS === 'ios') {
      await Settings.setAdvertiserTrackingEnabled(trackingGranted);
    }
    if (!initialized) {
      Settings.initializeSDK();
      initialized = true;
    }
  } catch {
    // La atribución no puede bloquear la app.
  }
}

export async function stopMetaForPrivacy(): Promise<void> {
  if (!initialized) return;
  try {
    Settings.setAutoLogAppEventsEnabled(false);
    Settings.setAdvertiserIDCollectionEnabled(false);
    if (Platform.OS === 'ios') await Settings.setAdvertiserTrackingEnabled(false);
  } catch {
    // El módulo puede no existir en Expo Go o web.
  }
}
