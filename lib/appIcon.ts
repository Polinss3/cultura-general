// ─── Icono de la app: cosmético PRO ──────────────────────────────────────────
// Los PNG a 1024 viven en assets/app-icons y los copia al proyecto nativo el
// plugin `expo-alternate-app-icons` (ver app.json). Aquí solo se elige cuál está
// activo. Cambiar la lista exige build nueva: no se puede mandar por OTA.

import { Platform, type ImageSourcePropType } from 'react-native';
import { iconChangedDespiteError } from './appIconVerification';

export type AppIconId =
  | 'default'
  | 'oro'
  | 'crema'
  | 'medianoche'
  | 'contrarreloj'
  | 'pergamino'
  | 'neon'
  | 'acierto'
  | 'tinta'
  | 'pixel';

export interface AppIconOption {
  id: AppIconId;
  /** Nombre que registra el plugin en el proyecto nativo. `null` = icono principal. */
  nativeName: string | null;
  preview: ImageSourcePropType;
  pro: boolean;
}

/** En el orden en que se muestran en la pantalla de selección. */
export const APP_ICONS: readonly AppIconOption[] = [
  { id: 'default', nativeName: null, preview: require('../assets/app-icons/previews/pulido.png'), pro: false },
  { id: 'oro', nativeName: 'Oro', preview: require('../assets/app-icons/previews/oro.png'), pro: true },
  { id: 'crema', nativeName: 'Crema', preview: require('../assets/app-icons/previews/crema.png'), pro: true },
  { id: 'medianoche', nativeName: 'Medianoche', preview: require('../assets/app-icons/previews/medianoche.png'), pro: true },
  { id: 'contrarreloj', nativeName: 'Contrarreloj', preview: require('../assets/app-icons/previews/contrarreloj.png'), pro: true },
  { id: 'pergamino', nativeName: 'Pergamino', preview: require('../assets/app-icons/previews/pergamino.png'), pro: true },
  { id: 'neon', nativeName: 'Neon', preview: require('../assets/app-icons/previews/neon.png'), pro: true },
  { id: 'acierto', nativeName: 'Acierto', preview: require('../assets/app-icons/previews/acierto.png'), pro: true },
  { id: 'tinta', nativeName: 'Tinta', preview: require('../assets/app-icons/previews/tinta.png'), pro: true },
  { id: 'pixel', nativeName: 'Pixel', preview: require('../assets/app-icons/previews/pixel.png'), pro: true },
];

type AltIconsModule = typeof import('expo-alternate-app-icons');

let mod: AltIconsModule | null = null;
let modChecked = false;

// Carga perezosa: el módulo nativo no existe en web ni en un cliente que no
// se haya recompilado tras añadirlo, y un import directo tumbaría la app.
function loadModule(): AltIconsModule | null {
  if (modChecked) return mod;
  modChecked = true;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
  try {
    mod = require('expo-alternate-app-icons') as AltIconsModule;
  } catch {
    mod = null;
  }
  return mod;
}

export function appIconsSupported(): boolean {
  const m = loadModule();
  return !!m && m.supportsAlternateIcons;
}

export function getCurrentAppIcon(): AppIconId {
  const m = loadModule();
  if (!m) return 'default';
  try {
    const name = m.getAppIconName();
    return APP_ICONS.find(i => i.nativeName !== null && i.nativeName === name)?.id ?? 'default';
  } catch {
    return 'default';
  }
}

/**
 * Cambia el icono. iOS enseña su propio aviso del sistema tras el cambio, así
 * que esto solo debe llamarse desde un gesto del usuario.
 */
export async function setAppIcon(id: AppIconId): Promise<boolean> {
  const m = loadModule();
  const option = APP_ICONS.find(i => i.id === id);
  if (!m || !option) return false;
  try {
    await m.setAlternateAppIcon(option.nativeName);
    return true;
  } catch {
    return iconChangedDespiteError(option.nativeName, () => m.getAppIconName());
  }
}

/** Un icono PRO puesto sin PRO activo debe volver al principal. */
export function needsIconReset(current: AppIconId, isPro: boolean): boolean {
  if (isPro) return false;
  return APP_ICONS.find(i => i.id === current)?.pro ?? false;
}
