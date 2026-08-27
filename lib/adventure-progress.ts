import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createAdventureProgress,
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
}

const STORAGE_PREFIX = 'adventure_progress_v1';

export function createLocalAdventureRepository(
  scope: string,
  storage: KeyValueStorage = AsyncStorage,
): AdventureProgressRepository {
  const safeScope = scope.trim() || 'guest';
  const key = `${STORAGE_PREFIX}:${safeScope}`;

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

