import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Preferencia de apariencia. 'auto' sigue el ajuste del sistema, que es lo que
// hacía la app antes de que esto existiera y sigue siendo el valor por defecto.
//
// Es un store propio y no un contexto de React a propósito: `useTheme()` vive
// en constants/colors.ts, y si ese módulo importara un contexto que a su vez
// importa las paletas tendríamos un ciclo. Un store plano se puede importar
// desde cualquier capa.

export type ThemePreference = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'theme_preference_v1';

let preference: ThemePreference = 'auto';
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): ThemePreference {
  return preference;
}

/** Preferencia actual, reactiva. */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Lectura puntual fuera de React (p. ej. la StatusBar del layout). */
export function getThemePreference(): ThemePreference {
  return preference;
}

/**
 * Carga la preferencia guardada al arrancar. Se resuelve bajo el BootScreen
 * para que no haya un fogonazo de tema al entrar.
 */
export async function loadThemePreference(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      preference = stored;
      emit();
    }
  } catch {
    // Sin storage: nos quedamos siguiendo al sistema.
  }
}

export async function setThemePreference(pref: ThemePreference): Promise<void> {
  preference = pref;
  emit(); // el cambio se ve al instante, aunque el guardado falle
  try {
    if (pref === 'auto') await AsyncStorage.removeItem(STORAGE_KEY);
    else await AsyncStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // El tema de la sesión ya ha cambiado; solo se pierde la persistencia.
  }
}
