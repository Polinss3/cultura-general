import { Platform, AppState } from 'react-native';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  PermissionStatus,
} from 'expo-tracking-transparency';

export type TrackingDecision = 'granted' | 'denied' | 'unavailable';

// iOS solo muestra el prompt de ATT cuando UIApplicationState === Active.
// Si se llama mientras la app está en transición, iOS deniega silenciosamente
// y nunca vuelve a mostrar el diálogo (es lo que estaba ocurriendo en
// iPadOS 26.5 según el rechazo de Apple).
async function waitForActive(timeoutMs = 4000): Promise<boolean> {
  if (AppState.currentState === 'active') return true;
  return new Promise<boolean>(resolve => {
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      sub.remove();
      clearTimeout(timer);
      resolve(ok);
    };
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') finish(true);
    });
    const timer = setTimeout(() => finish(false), timeoutMs);
  });
}

/**
 * Pide el permiso de ATT (App Tracking Transparency) en iOS.
 *
 * Debe llamarse desde una acción del usuario, con la app en foreground
 * (por ejemplo, al final del onboarding). Si la app aún no está Active
 * espera a que lo esté antes de invocar al SDK del sistema.
 *
 * iOS persiste la decisión del usuario, así que esta función es
 * idempotente: si ya se respondió, devuelve el estado actual sin
 * mostrar nada.
 */
export async function ensureTrackingPermission(): Promise<TrackingDecision> {
  if (Platform.OS !== 'ios') return 'unavailable';

  try {
    const current = await getTrackingPermissionsAsync();
    if (current.status !== PermissionStatus.UNDETERMINED) {
      return current.status === PermissionStatus.GRANTED ? 'granted' : 'denied';
    }

    const active = await waitForActive();
    if (!active) return 'unavailable';

    // Pequeño respiro tras pasar a Active para que la ventana esté
    // totalmente visible antes de que iOS intente presentar el diálogo.
    await new Promise(r => setTimeout(r, 300));

    const result = await requestTrackingPermissionsAsync();
    return result.status === PermissionStatus.GRANTED ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}
