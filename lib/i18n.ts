// ─── i18n (ES/EN) ─────────────────────────────────────────────
// Módulo hoja: NO importa nada de lib/ para que cualquier módulo
// (db, notifications, auth...) pueda importarlo sin ciclos.
import 'intl-pluralrules'; // Hermes no trae Intl.PluralRules; debe cargarse antes del init.
import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from '../locales/es.json';
import en from '../locales/en.json';

export type AppLang = 'es' | 'en';
export type LangPreference = AppLang | 'auto';

const LANG_STORAGE_KEY = 'app_language_v1'; // 'es' | 'en'; ausente = seguir al dispositivo

export function deviceLang(): AppLang {
  return getLocales()[0]?.languageCode === 'es' ? 'es' : 'en';
}

const initOptions: InitOptions = {
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: deviceLang(),
  fallbackLng: 'es', // es.json es la fuente de verdad: peor caso = texto en español, nunca una clave cruda
  interpolation: { escapeValue: false }, // <Text> no es HTML
  initAsync: false, // init síncrono (i18next v26; antes initImmediate): los recursos van empaquetados
  returnNull: false,
  react: { useSuspense: false },
};

i18n.use(initReactI18next).init(initOptions);

export function getCurrentLang(): AppLang {
  return i18n.language?.startsWith('en') ? 'en' : 'es';
}

// Locale BCP-47 para toLocaleDateString/toLocaleString.
export function getLocaleTag(): 'es-ES' | 'en-US' {
  return getCurrentLang() === 'es' ? 'es-ES' : 'en-US';
}

export async function getLanguagePreference(): Promise<LangPreference> {
  try {
    const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'es' || stored === 'en' ? stored : 'auto';
  } catch {
    return 'auto';
  }
}

// Aplica el override guardado (si existe) al arrancar. Se resuelve bajo el
// BootScreen para que no haya flash de idioma.
export async function applyPersistedLanguage(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    if ((stored === 'es' || stored === 'en') && stored !== getCurrentLang()) {
      await i18n.changeLanguage(stored);
    }
  } catch {
    // sin storage: nos quedamos con el idioma del dispositivo
  }
}

export async function setAppLanguage(pref: LangPreference): Promise<void> {
  try {
    if (pref === 'auto') {
      await AsyncStorage.removeItem(LANG_STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(LANG_STORAGE_KEY, pref);
    }
  } catch {
    // aunque falle el guardado, cambiamos el idioma de la sesión
  }
  const target = pref === 'auto' ? deviceLang() : pref;
  if (target !== getCurrentLang()) await i18n.changeLanguage(target);
}

export default i18n;
