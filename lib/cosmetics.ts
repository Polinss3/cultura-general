// ─── Cosméticos (marcos de avatar y color de nombre) ────────────────────────
// Traduce los item_id de la tienda a su efecto visual. De momento se muestran
// para el usuario propio (home y perfil). Los cosméticos se equipan con
// equipItem() y se leen del inventario (user_items.equipped).

import { fetchInventory } from './shop';

export type CosmeticKind = 'frame' | 'name';

export interface CosmeticMeta {
  id: string;
  kind: CosmeticKind;
  color: string;
}

export const COSMETICS: Record<string, CosmeticMeta> = {
  frame_bronze: { id: 'frame_bronze', kind: 'frame', color: '#c08040' },
  frame_silver: { id: 'frame_silver', kind: 'frame', color: '#c0c8d0' },
  frame_gold:   { id: 'frame_gold',   kind: 'frame', color: '#e8c030' },
  name_neon:    { id: 'name_neon',    kind: 'name',  color: '#b14dff' },
  name_gold:    { id: 'name_gold',    kind: 'name',  color: '#e8c030' },
};

export interface EquippedCosmetics {
  frameColor?: string;
  nameColor?: string;
}

export async function fetchEquippedCosmetics(userId: string): Promise<EquippedCosmetics> {
  const inv = await fetchInventory(userId);
  const result: EquippedCosmetics = {};
  for (const it of inv) {
    if (!it.equipped) continue;
    const meta = COSMETICS[it.itemId];
    if (!meta) continue;
    if (meta.kind === 'frame') result.frameColor = meta.color;
    else if (meta.kind === 'name') result.nameColor = meta.color;
  }
  return result;
}
