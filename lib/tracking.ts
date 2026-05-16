import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  PermissionStatus,
} from 'expo-tracking-transparency';

const ASKED_KEY = 'att_prompt_asked_v1';

export type TrackingDecision = 'granted' | 'denied' | 'unavailable';

/**
 * Pide el permiso de ATT (App Tracking Transparency) en iOS la primera
 * vez. En Android o si ya se preguntó antes, no hace nada.
 *
 * Llamar UNA VEZ tras ocultar el splash. La decisión del usuario se
 * persiste en el propio sistema (iOS), aquí solo evitamos volver a
 * llamar al SDK innecesariamente.
 */
export async function ensureTrackingPermission(): Promise<TrackingDecision> {
  if (Platform.OS !== 'ios') return 'unavailable';

  try {
    const current = await getTrackingPermissionsAsync();
    if (current.status !== PermissionStatus.UNDETERMINED) {
      // El usuario ya respondió (o el sistema lo restringe).
      return current.status === PermissionStatus.GRANTED ? 'granted' : 'denied';
    }

    // Solo preguntamos la primera vez; iOS no nos deja preguntar dos veces.
    const alreadyAsked = await AsyncStorage.getItem(ASKED_KEY);
    if (alreadyAsked) return 'denied';

    const result = await requestTrackingPermissionsAsync();
    await AsyncStorage.setItem(ASKED_KEY, '1');
    return result.status === PermissionStatus.GRANTED ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}
