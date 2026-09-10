// ─── Acceso a Aventura: PRO y usuarios heredados ─────────────────────────────
//
// Desde la 2.2.0 los capítulos 3-20 exigen PRO. Eso significa limitar contenido
// que ya estaba publicado, así que hay una excepción permanente: quien ya había
// pasado del nivel 40 antes del cambio conserva para siempre la campaña que ya
// existía (capítulos 1-10). Los capítulos 11-20 son una ampliación nueva PRO.
// Sin esta excepción, la actualización castigaría a los usuarios más fieles.
//
// El marcado es una operación de una sola dirección: una vez legacy, siempre
// legacy. Nunca se retira, ni aunque el progreso se borre después.

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADVENTURE_FREE_MAX_LEVEL,
  type AdventureProgress,
} from './adventure';

const LEGACY_PREFIX = 'adventure_legacy_v1';

export function adventureLegacyStorageKey(scope: string): string {
  return `${LEGACY_PREFIX}:${scope.trim() || 'guest'}`;
}

/**
 * Nivel más alto que el usuario había alcanzado. Se mira tanto el desbloqueado
 * como el máximo completado porque un progreso fusionado entre dispositivos
 * puede tener uno por delante del otro.
 */
export function highestAdventureLevelReached(progress: AdventureProgress): number {
  const completed = progress.completedLevels.length > 0
    ? Math.max(...progress.completedLevels)
    : 0;
  return Math.max(completed, progress.unlockedLevel - 1);
}

/**
 * `true` si este progreso solo puede venir de haber jugado con las reglas
 * antiguas. Bajo las nuevas no se puede pasar del último nivel gratuito sin
 * PRO, así que cualquier avance por encima demuestra que es un usuario previo.
 */
export function qualifiesForAdventureLegacy(progress: AdventureProgress): boolean {
  return highestAdventureLevelReached(progress) > ADVENTURE_FREE_MAX_LEVEL;
}

async function readLocalFlag(scope: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(adventureLegacyStorageKey(scope))) === '1';
  } catch {
    return false;
  }
}

async function writeLocalFlag(scope: string): Promise<void> {
  try {
    await AsyncStorage.setItem(adventureLegacyStorageKey(scope), '1');
  } catch {
    // Perder el flag local solo significa volver a calcularlo en el próximo
    // arranque a partir del progreso, que sigue estando.
  }
}

interface ResolveOptions {
  /** Id de usuario, o 'guest'. */
  scope: string;
  progress: AdventureProgress;
  /** Hay sesión y red: se puede persistir el flag en Supabase. */
  remoteEnabled: boolean;
}

/**
 * Decide si este usuario es heredado y lo deja anotado.
 *
 * Local primero: el invitado y el usuario sin cobertura también tienen derecho
 * a conservar lo suyo. Cuando hay sesión y red se llama además al RPC, que
 * valida contra el progreso REMOTO —nunca contra lo que mande el cliente— para
 * que el flag no se pueda reclamar falsificando el progreso local.
 */
export async function resolveAdventureLegacy(options: ResolveOptions): Promise<boolean> {
  const { scope, progress, remoteEnabled } = options;

  if (await readLocalFlag(scope)) return true;

  const qualifiesLocally = qualifiesForAdventureLegacy(progress);
  if (qualifiesLocally) await writeLocalFlag(scope);

  if (!remoteEnabled) return qualifiesLocally;

  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase.rpc('grant_adventure_legacy_access');
    if (error) return qualifiesLocally;
    if (data === true) {
      await writeLocalFlag(scope);
      return true;
    }
  } catch {
    // Sin red o con la migración sin aplicar: vale el cálculo local.
  }

  return qualifiesLocally;
}
