// ─── Cosméticos (marcos, color/estilo/icono de nombre) ──────────────────────
// Traduce los item_id de la tienda a su efecto visual. Se muestran para todos
// los usuarios (leídos de profiles.cosmetics en los rankings) y para el propio
// (leídos del inventario equipado). Un cosmético equipado por "slot".

import type { TextStyle } from 'react-native';
import { fetchInventory } from './shop';
import { PRO_ACCENT } from './pro';

export type CosmeticSlot = 'frame' | 'name_color' | 'name_icon' | 'name_style';

interface CosmeticMeta {
  slot: CosmeticSlot;
  color?: string;      // frame / name_color
  /** name_color sobre fondo claro, si `color` no se lee (los dorados). */
  colorLight?: string;
  glow?: boolean;      // frame: halo del color del marco
  emoji?: string;      // name_icon
  textStyle?: TextStyle; // name_style
  /** name_style sobre fondo claro: halo más suave para no empastar el nombre. */
  textStyleLight?: TextStyle;
}

const halo = (color: string, radius: number): TextStyle =>
  ({ textShadowColor: color, textShadowRadius: radius, textShadowOffset: { width: 0, height: 0 } });

export const COSMETICS: Record<string, CosmeticMeta> = {
  // Marcos de avatar
  frame_bronze: { slot: 'frame', color: '#c08040' },
  frame_silver: { slot: 'frame', color: '#c0c8d0' },
  frame_gold:   { slot: 'frame', color: '#e8c030' },
  frame_pro:    { slot: 'frame', color: PRO_ACCENT },
  frame_pro_glow: { slot: 'frame', color: PRO_ACCENT, glow: true },
  // Color de nombre
  name_neon:    { slot: 'name_color', color: '#b14dff' },
  // Los dorados brillantes no se leen sobre crema ni sobre las filas
  // resaltadas: en claro van tostados, que siguen leyéndose como oro.
  name_gold:    { slot: 'name_color', color: '#e8c030', colorLight: '#8F6400' },
  name_pro:     { slot: 'name_color', color: PRO_ACCENT },
  name_pro_ember: { slot: 'name_color', color: '#F0A93B', colorLight: '#A3520A' },
  // Icono/emoji antes del nombre
  icon_fire:    { slot: 'name_icon', emoji: '🔥' },
  icon_star:    { slot: 'name_icon', emoji: '⭐' },
  icon_crown:   { slot: 'name_icon', emoji: '👑' },
  icon_rocket:  { slot: 'name_icon', emoji: '🚀' },
  icon_gem:     { slot: 'name_icon', emoji: '💎' },
  icon_pro_owl: { slot: 'name_icon', emoji: '🦉' },
  // Estilo del nombre
  style_italic: { slot: 'name_style', textStyle: { fontStyle: 'italic' } },
  style_upper:  { slot: 'name_style', textStyle: { textTransform: 'uppercase', letterSpacing: 0.5 } },
  style_glow:   { slot: 'name_style', textStyle: halo('#e8a030', 8), textStyleLight: halo('#e8a03080', 7) },
  style_pro:    { slot: 'name_style', textStyle: halo(PRO_ACCENT, 10), textStyleLight: halo(`${PRO_ACCENT}66`, 8) },
};

export interface ResolvedCosmetics {
  frameColor?: string;
  frameGlow?: boolean;
  nameColor?: string;
  nameColorLight?: string;
  nameIcon?: string;
  nameStyle?: TextStyle;
  nameStyleLight?: TextStyle;
}

/**
 * Color y estilo del nombre para el tema actual. Con halo, el texto lleva
 * relleno del tamaño del halo (compensado con margen negativo, así no mueve
 * nada): iOS recorta la sombra en el borde del propio texto y sin ese hueco el
 * resplandor acababa en un corte recto.
 */
export function themedName(c: ResolvedCosmetics, isDark: boolean, { inline = false } = {}): { color?: string; style?: TextStyle } {
  const color = (!isDark && c.nameColorLight) || c.nameColor;
  const style = (!isDark && c.nameStyleLight) || c.nameStyle;
  const r = style?.textShadowRadius;
  // Un <Text> anidado no admite relleno ni márgenes.
  if (!r || inline) return { color, style };
  return { color, style: { ...style, paddingHorizontal: r, paddingVertical: r, marginHorizontal: -r, marginVertical: -r } };
}

// `map` = slot → item_id (formato de profiles.cosmetics). Devuelve los efectos.
export function resolveCosmetics(map?: Record<string, string> | null): ResolvedCosmetics {
  const r: ResolvedCosmetics = {};
  if (!map) return r;
  const frame = COSMETICS[map['frame']];
  if (frame?.color) r.frameColor = frame.color;
  if (frame?.glow) r.frameGlow = true;
  const nc = COSMETICS[map['name_color']];
  if (nc?.color) r.nameColor = nc.color;
  if (nc?.colorLight) r.nameColorLight = nc.colorLight;
  const ic = COSMETICS[map['name_icon']];
  if (ic?.emoji) r.nameIcon = ic.emoji;
  const st = COSMETICS[map['name_style']];
  if (st?.textStyle) r.nameStyle = st.textStyle;
  if (st?.textStyleLight) r.nameStyleLight = st.textStyleLight;
  return r;
}

// Cosméticos equipados del usuario propio (leídos del inventario).
export async function fetchEquippedCosmetics(userId: string): Promise<ResolvedCosmetics> {
  const inv = await fetchInventory(userId);
  const map: Record<string, string> = {};
  for (const it of inv) {
    if (!it.equipped) continue;
    const meta = COSMETICS[it.itemId];
    if (meta) map[meta.slot] = it.itemId;
  }
  return resolveCosmetics(map);
}
