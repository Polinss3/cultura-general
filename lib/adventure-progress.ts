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
  loadLocal(): Promise<AdventureProgress>;
  saveLocal(progress: AdventureProgress): Promise<void>;
  sync(progress: AdventureProgress): Promise<AdventureProgress>;
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
  remoteTimeoutMs?: number;
}

const STORAGE_PREFIX = 'adventure_progress_v1';
const DEFAULT_REMOTE_TIMEOUT_MS = 12_000;

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error('Adventure remote sync timed out')), milliseconds);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

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
    async loadLocal() {
      return this.load();
    },
    async saveLocal(progress) {
      await this.save(progress);
    },
    async sync(progress) {
      return normalizeAdventureProgress(progress);
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
  const syncRemote = (progress: AdventureProgress) => withTimeout(
    remote.sync(progress),
    options.remoteTimeoutMs ?? DEFAULT_REMOTE_TIMEOUT_MS,
  );

  const synchronize = async (localProgress: AdventureProgress): Promise<AdventureProgress> => {
    if (!options.remoteEnabled) return localProgress;
    try {
      const canonical = await syncRemote(localProgress);
      await local.save(canonical);
      return canonical;
    } catch {
      // La red o una migracion aun no desplegada nunca impiden jugar. La copia
      // local se volvera a enviar al abrir Aventura con conexion.
      return localProgress;
    }
  };

  return {
    async loadLocal() {
      return local.load();
    },
    async saveLocal(progress) {
      await local.save(normalizeAdventureProgress(progress));
    },
    async sync(progress) {
      if (!options.remoteEnabled) return normalizeAdventureProgress(progress);
      const canonical = await syncRemote(normalizeAdventureProgress(progress));
      await local.save(canonical);
      return canonical;
    },
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
