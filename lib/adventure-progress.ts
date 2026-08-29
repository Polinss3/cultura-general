import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createAdventureProgress,
  mergeAdventureProgress,
  normalizeAdventureProgress,
  type AdventureProgress,
} from '@/lib/adventure';

export interface AdventureProgressRepository {
  load(): Promise<AdventureProgress>;
  save(progress: AdventureProgress): Promise<void>;
}

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem?(key: string): Promise<void>;
}

export interface AdventureRemoteSync {
  sync(progress: AdventureProgress): Promise<AdventureProgress>;
}

interface SyncedRepositoryOptions {
  remoteEnabled: boolean;
  storage?: KeyValueStorage;
  remote?: AdventureRemoteSync;
}

const STORAGE_PREFIX = 'adventure_progress_v1';

export function adventureProgressStorageKey(scope: string): string {
  return `${STORAGE_PREFIX}:${scope.trim() || 'guest'}`;
}

export function createLocalAdventureRepository(
  scope: string,
  storage: KeyValueStorage = AsyncStorage,
): AdventureProgressRepository {
  const key = adventureProgressStorageKey(scope);

  return {
    async load() {
      try {
        const raw = await storage.getItem(key);
        return raw ? normalizeAdventureProgress(JSON.parse(raw)) : createAdventureProgress();
      } catch {
        return createAdventureProgress();
      }
    },
    async save(progress) {
      await storage.setItem(key, JSON.stringify(normalizeAdventureProgress(progress)));
    },
  };
}

const supabaseAdventureRemote: AdventureRemoteSync = {
  async sync(progress) {
    // Import diferido: los tests puros y el render estatico no necesitan crear
    // el cliente de Supabase. En el dispositivo conserva la sesion segura que
    // ya gestiona lib/supabase.
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase.rpc('sync_adventure_progress', {
      p_progress: normalizeAdventureProgress(progress),
    });
    if (error) throw error;
    return normalizeAdventureProgress(data);
  },
};

/**
 * Repositorio local-first para cuentas. Cada escritura se confirma primero en
 * AsyncStorage, por lo que jugar sin red nunca depende de Supabase. Cuando hay
 * conexion, el RPC fusiona esta copia con la del resto de dispositivos.
 */
export function createAdventureProgressRepository(
  scope: string,
  options: SyncedRepositoryOptions,
): AdventureProgressRepository {
  const local = createLocalAdventureRepository(scope, options.storage ?? AsyncStorage);
  const remote = options.remote ?? supabaseAdventureRemote;

  const synchronize = async (localProgress: AdventureProgress): Promise<AdventureProgress> => {
    if (!options.remoteEnabled) return localProgress;
    try {
      const canonical = await remote.sync(localProgress);
      await local.save(canonical);
      return canonical;
    } catch {
      // La red o una migracion aun no desplegada nunca impiden jugar. La copia
      // local se volvera a enviar al abrir Aventura con conexion.
      return localProgress;
    }
  };

  return {
    async load() {
      const localProgress = await local.load();
      return synchronize(localProgress);
    },
    async save(progress) {
      const normalized = normalizeAdventureProgress(progress);
      await local.save(normalized);
      await synchronize(normalized);
    },
  };
}

/**
 * Al convertir un invitado en cuenta, une primero cualquier avance previo de
 * esa cuenta con el invitado y solo borra la copia guest tras confirmarlo en
 * Supabase. Devuelve false si se debe reintentar mas adelante.
 */
export async function migrateGuestAdventureProgressToUser(
  userId: string,
  storage: KeyValueStorage = AsyncStorage,
  remote: AdventureRemoteSync = supabaseAdventureRemote,
): Promise<boolean> {
  const guest = createLocalAdventureRepository('guest', storage);
  const account = createLocalAdventureRepository(userId, storage);
  const merged = mergeAdventureProgress(await account.load(), await guest.load());
  await account.save(merged);

  try {
    const canonical = await remote.sync(merged);
    await account.save(canonical);
    await storage.removeItem?.(adventureProgressStorageKey('guest'));
    return true;
  } catch {
    return false;
  }
}
