import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { parseCityCatalog, type City } from './cityCatalog';
let memoryCatalog: City[] | null = null;
export const getImmediateCities = () => memoryCatalog;
const CACHE_KEY = 'city_catalog_v1';
const RECORDS_KEY = 'city_records_v1';
export type CityRecords = Record<string, number>;
export async function readCachedCities(): Promise<City[] | null> {
  try {
    if (memoryCatalog) return memoryCatalog;
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    memoryCatalog = raw ? parseCityCatalog(JSON.parse(raw)) : null;
    return memoryCatalog;
  } catch { return null; }
}
/** Paginate so growth past the PostgREST row limit requires no app update. */
export async function fetchCities(signal: AbortSignal): Promise<City[]> {
  const rows: unknown[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('city_catalog')
      .select('id,name,continent,difficulty,architecture_tags,similar_city_ids,image_url,framing')
      .eq('is_published', true).order('id').range(offset, offset + 499).abortSignal(signal);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < 500) break;
  }
  if (signal.aborted) throw new Error('Aborted');
  const catalog = parseCityCatalog(rows);
  // Do not replace a good offline copy with a malformed server response.
  if (rows.length && !catalog.length) throw new Error('Invalid city catalog');
  memoryCatalog = catalog;
  try { await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(catalog)); } catch { /* Storage may be full. */ }
  return catalog;
}
export async function getCityRecords(): Promise<CityRecords> {
  try {
    const raw = JSON.parse(await AsyncStorage.getItem(RECORDS_KEY) ?? '{}');
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    return Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, number] =>
      typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] >= 0));
  } catch { return {}; }
}
export async function saveCityRecord(key: string, correct: number): Promise<boolean> {
  const records = await getCityRecords();
  if (correct <= (records[key] ?? 0)) return false;
  try {
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify({ ...records, [key]: correct }));
    return true;
  } catch { return false; }
}
