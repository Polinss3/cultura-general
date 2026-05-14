import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_HISTORY = 80;

function key(mode: string, category?: string): string {
  return `qhist_${mode}_${category ?? 'all'}_v1`;
}

export async function getRecentIds(mode: string, category?: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key(mode, category));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export async function pushSeen(
  mode: string,
  category: string | undefined,
  ids: string[],
): Promise<void> {
  const cleanIds = ids.filter((s): s is string => !!s && typeof s === 'string');
  if (cleanIds.length === 0) return;
  try {
    const prev = await getRecentIds(mode, category);
    // newest at the end; dedupe preserving order of newest occurrence
    const merged = [...prev.filter(id => !cleanIds.includes(id)), ...cleanIds];
    const trimmed = merged.slice(-MAX_HISTORY);
    await AsyncStorage.setItem(key(mode, category), JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
}

export async function clearHistory(mode?: string, category?: string): Promise<void> {
  try {
    if (mode) {
      await AsyncStorage.removeItem(key(mode, category));
    }
  } catch {
    // ignore
  }
}
