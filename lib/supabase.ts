import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const isServerRender = typeof window === 'undefined';

// Expo Router evalúa los módulos durante el render estático web. El adapter
// web de AsyncStorage necesita `window`, así que en SSR usamos almacenamiento
// efímero y dejamos la sesión real para la hidratación del cliente.
const serverStorage = {
  getItem: async (_key: string) => null,
  setItem: async (_key: string, _value: string) => undefined,
  removeItem: async (_key: string) => undefined,
};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Define them in eas.json (build.<profile>.env) or via `eas env:create`.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isServerRender ? serverStorage : AsyncStorage,
    autoRefreshToken: !isServerRender,
    persistSession: !isServerRender,
    detectSessionInUrl: false,
  },
});
