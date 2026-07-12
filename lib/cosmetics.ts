// ─── Cosméticos (marcos, color/estilo/icono de nombre) ──────────────────────
// Traduce los item_id de la tienda a su efecto visual. Se muestran para todos
// los usuarios (leídos de profiles.cosmetics en los rankings) y para el propio
// (leídos del inventario equipado). Un cosmético equipado por "slot".

import type { TextStyle } from 'react-native';
import { fetchInventory } from './shop';

export type CosmeticSlot = 'frame' | 'name_color' | 'name_icon' | 'name_style';

interface CosmeticMeta {
  slot: CosmeticSlot;
  color?: string;      // frame / name_color
  emoji?: string;      // name_icon
  textStyle?: TextStyle; // name_style
}

export const COSMETICS: Record<string, CosmeticMeta> = {
  // Marcos de avatar
  frame_bronze: { slot: 'frame', color: '#c08040' },
  frame_silver: { slot: 'frame', color: '#c0c8d0' },
  frame_gold:   { slot: 'frame', color: '#e8c030' },
  // Color de nombre
  name_neon:    { slot: 'name_color', color: '#b14dff' },
  name_gold:    { slot: 'name_color', color: '#e8c030' },
  // Icono/emoji antes del nombre
  icon_fire:    { slot: 'name_icon', emoji: '🔥' },
  icon_star:    { slot: 'name_icon', emoji: '⭐' },
  icon_crown:   { slot: 'name_icon', emoji: '👑' },
  icon_rocket:  { slot: 'name_icon', emoji: '🚀' },
  // Estilo del nombre
  style_italic: { slot: 'name_style', textStyle: { fontStyle: 'italic' } },
  style_upper:  { slot: 'name_style', textStyle: { textTransform: 'uppercase', letterSpacing: 0.5 } },
  style_glow:   { slot: 'name_style', textStyle: { textShadowColor: '#e8a030', textShadowRadius: 8, textShadowOffset: { width: 0, height: 0 } } },
};

export interface ResolvedCosmetics {
  frameColor?: string;
  nameColor?: string;
  nameIcon?: string;
  nameStyle?: TextStyle;
}

// `map` = slot → item_id (formato de profiles.cosmetics). Devuelve los efectos.
export function resolveCosmetics(map?: Record<string, string> | null): ResolvedCosmetics {
  const r: ResolvedCosmetics = {};
  if (!map) return r;
  const frame = COSMETICS[map['frame']];
  if (frame?.color) r.frameColor = frame.color;
  const nc = COSMETICS[map['name_color']];
  if (nc?.color) r.nameColor = nc.color;
  const ic = COSMETICS[map['name_icon']];
  if (ic?.emoji) r.nameIcon = ic.emoji;
  const st = COSMETICS[map['name_style']];
  if (st?.textStyle) r.nameStyle = st.textStyle;
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
