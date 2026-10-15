import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchCities, getImmediateCities, readCachedCities } from '@/lib/cities';
import type { City } from '@/lib/cityCatalog';

export function useCities(enabled = true) {
  const [catalog, setCatalog] = useState<City[] | null>(getImmediateCities);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision(n => n + 1), []);
  useFocusEffect(useCallback(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let active = true;
    let fresh = false;
    setRefreshing(true);
    setError(false);
    readCachedCities().then(cached => {
      if (active && !fresh && cached) setCatalog(cached);
    });
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetchCities(controller.signal).then(cities => {
      fresh = true;
      if (active) setCatalog(cities);
    }).catch(() => {
      if (active) setError(true);
    }).finally(() => {
      clearTimeout(timeout);
      if (active) setRefreshing(false);
    });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [enabled, revision]));
  return { catalog, refreshing, error, retry };
}
