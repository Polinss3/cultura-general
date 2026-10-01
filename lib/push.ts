// ─── Push reales (servidor → dispositivo) ────────────────────────────────────
//
// El servidor manda los avisos con hora (9:00, 20:00, liga) y los de evento
// (un amigo te ha superado) a través de Expo; ver supabase/functions/send-push.
// Aquí solo se registra el token del dispositivo, con su idioma y zona
// horaria, y se da de baja al cerrar sesión o apagar los avisos.
//
// Mientras el push está activo, los avisos locales de 9:00/20:00 NO se
// programan (lib/notifications.ts consulta `isPushActive`), para no avisar
// dos veces. Si el registro falla (simulador, Expo Go, sin red) el push queda
// inactivo y los locales siguen como siempre: no se pierde nada.

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { getCurrentLang } from './i18n';

const PUSH_TOKEN_KEY = 'push_token_v1';
const PUSH_ACTIVE_KEY = 'push_active_v1';

export async function isPushActive(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(PUSH_ACTIVE_KEY)) === 'true';
  } catch {
    return false;
  }
}

function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid';
  } catch {
    return 'Europe/Madrid';
  }
}

async function getExpoToken(): Promise<string | null> {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  if (!projectId) return null;
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data || null;
  } catch {
    // Simulador, Expo Go o sin credenciales push: sin token, sin push.
    return null;
  }
}

/**
 * Registra (o refresca) el token del dispositivo para el usuario con sesión.
 * Se llama al arrancar y al volver a primer plano; es barata y repetible.
 * Devuelve si el push ha quedado activo.
 */
export async function syncPushRegistration(userId: string | null | undefined): Promise<boolean> {
  try {
    if (!userId) return false;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await AsyncStorage.setItem(PUSH_ACTIVE_KEY, 'false');
      return false;
    }
    const token = await getExpoToken();
    if (!token) {
      await AsyncStorage.setItem(PUSH_ACTIVE_KEY, 'false');
      return false;
    }
    const { error } = await supabase.rpc('register_push_token', {
      p_token: token,
      p_platform: Platform.OS,
      p_locale: getCurrentLang(),
      p_timezone: deviceTimezone(),
      p_app_version: Constants.expoConfig?.version ?? null,
    });
    if (error) {
      // Migración sin aplicar o sin red: se reintenta en la próxima sincronización.
      await AsyncStorage.setItem(PUSH_ACTIVE_KEY, 'false');
      return false;
    }
    await AsyncStorage.multiSet([[PUSH_TOKEN_KEY, token], [PUSH_ACTIVE_KEY, 'true']]);
    return true;
  } catch {
    return false;
  }
}

/** Da de baja el token (apagar avisos, cerrar sesión). Best-effort. */
export async function unregisterPush(): Promise<void> {
  try {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    await AsyncStorage.multiSet([[PUSH_ACTIVE_KEY, 'false'], [PUSH_TOKEN_KEY, '']]);
    if (token) await supabase.rpc('unregister_push_token', { p_token: token });
  } catch {
    // Sin red: el servidor lo dará de baja solo cuando Expo devuelva
    // DeviceNotRegistered o cuando otro usuario registre el mismo token.
  }
}
