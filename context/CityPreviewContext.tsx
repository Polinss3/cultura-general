import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ImageRef } from 'expo-image';
import type { City } from '@/lib/cityCatalog';

interface CityPreview {
  city: City;
  image: ImageRef;
  onDismiss: () => void;
}
const CityPreviewContext = createContext<{
  preview: CityPreview | null;
  openPreview: (preview: CityPreview) => void;
  endPreview: () => void;
} | null>(null);

/** Retain the decoded image while the native sheet is presented. No second fetch. */
export function CityPreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<CityPreview | null>(null);
  const current = useRef<CityPreview | null>(null);
  const openPreview = useCallback((next: CityPreview) => {
    current.current = next;
    setPreview(next);
  }, []);
  const endPreview = useCallback(() => {
    const previous = current.current;
    current.current = null;
    setPreview(null);
    previous?.onDismiss();
  }, []);
  const value = useMemo(() => ({ preview, openPreview, endPreview }), [preview, openPreview, endPreview]);
  return <CityPreviewContext.Provider value={value}>{children}</CityPreviewContext.Provider>;
}

export function useCityPreview() {
  const value = useContext(CityPreviewContext);
  if (!value) throw new Error('CityPreviewProvider is missing');
  return value;
}
