// ─── Embudo de la primera sesión ─────────────────────────────────────────────
//
// Dos cosas que necesitan saber "quién es este dispositivo" sin depender de una
// cuenta:
//
//  · `install_id`: aleatorio, persistido, agrupa los eventos de una misma
//    instalación aunque sea un invitado o aún no haya cuenta. Escribe en
//    `funnel_events` vía `log_funnel_event()`
//    (supabase/migrations/20261018030000_funnel_events.sql).
//  · La antigüedad de la instalación, para que los anuncios sean más suaves
//    los primeros días (utils/adPolicy.ts).
//
// Fire-and-forget: medir nunca espera a la red ni rompe un flujo.

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { getCurrentLang } from './i18n';
import { ONBOARDED_STORAGE_KEY } from './onboarding';

const INSTALL_ID_KEY = 'install_id_v1';
const FIRST_OPEN_KEY = 'install_first_open_v1';
const ONCE_PREFIX = 'funnel_once_v1:';

/**
 * `firstOpenAt` de las instalaciones que ya existían antes de la 2.4.0. No
 * sabemos cuándo se instalaron, pero no son nuevas: no se les aplica el trato
 * de los primeros días.
 */
const LEGACY_FIRST_OPEN = 0;

let installId: string | null = null;
let firstOpenAt: number | null = null;
let loading: Promise<void> | null = null;
// Dos llamadas seguidas al mismo evento "una vez" verían las dos el storage
// vacío; esto lo cierra dentro de la sesión.
const onceSeen = new Set<string>();

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Idempotente. Se llama al arrancar; los eventos la esperan si hace falta. */
export function loadInstallInfo(): Promise<void> {
  if (!loading) {
    loading = (async () => {
      try {
        const [[, id], [, first], [, onboarded]] = await AsyncStorage.multiGet([
          INSTALL_ID_KEY, FIRST_OPEN_KEY, ONBOARDED_STORAGE_KEY,
        ]);
        installId = id || randomId();
        if (first !== null && Number.isFinite(Number(first))) {
          firstOpenAt = Number(first);
        } else {
          // Sin fecha guardada: o es la primera apertura de verdad, o es una
          // instalación de antes de la 2.4.0 (ya pasó por el onboarding).
          firstOpenAt = onboarded && onboarded !== '0' ? LEGACY_FIRST_OPEN : Date.now();
        }
        await AsyncStorage.multiSet([
          [INSTALL_ID_KEY, installId],
          [FIRST_OPEN_KEY, String(firstOpenAt)],
        ]);
      } catch {
        // Sin storage: id de esta sesión y trato de instalación antigua.
        installId = installId ?? randomId();
        firstOpenAt = firstOpenAt ?? LEGACY_FIRST_OPEN;
      }
    })();
  }
  return loading;
}

/**
 * Milisegundos desde la primera apertura. `Infinity` en instalaciones de antes
 * de la 2.4.0 y `null` mientras no se ha cargado.
 */
export function getInstallAgeMs(now = Date.now()): number | null {
  if (firstOpenAt === null) return null;
  if (firstOpenAt === LEGACY_FIRST_OPEN) return Number.POSITIVE_INFINITY;
  return Math.max(0, now - firstOpenAt);
}

export function logFunnelEvent(event: string, detail?: string | null): void {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  void (async () => {
    await loadInstallInfo();
    if (!installId) return;
    await supabase.rpc('log_funnel_event', {
      p_install_id: installId,
      p_event: event,
      p_detail: detail ?? null,
      p_platform: Platform.OS,
      p_app_version: Constants.expoConfig?.version ?? null,
      p_lang: getCurrentLang(),
    });
  })().catch(() => {});
}

/** Igual, pero una sola vez por instalación (p. ej. "primer resultado"). */
export function logFunnelEventOnce(event: string, detail?: string | null): void {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  void (async () => {
    const key = ONCE_PREFIX + event;
    if (onceSeen.has(key)) return;
    onceSeen.add(key);
    if (await AsyncStorage.getItem(key)) return;
    await AsyncStorage.setItem(key, '1');
    logFunnelEvent(event, detail);
  })().catch(() => {});
}
