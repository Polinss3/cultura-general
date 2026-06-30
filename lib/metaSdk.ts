import { Platform } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import { getTrackingPermissionsAsync, PermissionStatus } from 'expo-tracking-transparency';

// Integración del SDK de Meta (Facebook) para medición y atribución de
// instalaciones en campañas de App Promotion. El registro de eventos de
// instalación/activación lo hace el SDK de forma automática (autoLogAppEvents +
// isAutoInit en el config plugin); aquí solo nos encargamos de inicializarlo de
// forma idempotente y de respetar la decisión de ATT del usuario en iOS.

export function initMetaSdk(): void {
  try {
    Settings.initializeSDK();
  } catch {
    // SDK no disponible (p. ej. en Expo Go o si el módulo nativo no está
    // presente). No es crítico: en producción el plugin lo provee.
  }
}

// Activa/desactiva el uso del IDFA por parte de Meta según el permiso ATT.
// Llamar tras resolver el prompt de ATT y al arrancar (para usuarios que ya
// respondieron en una sesión anterior). En Android no aplica.
export async function syncMetaAdvertiserTracking(granted?: boolean): Promise<void> {
  if (Platform.OS !== 'ios') return;
  try {
    let enabled = granted;
    if (enabled === undefined) {
      const { status } = await getTrackingPermissionsAsync();
      enabled = status === PermissionStatus.GRANTED;
    }
    await Settings.setAdvertiserTrackingEnabled(enabled);
  } catch {
    // ignore
  }
}
