import { supabase } from './supabase';
import i18n from './i18n';
import { getCurrentLang } from './i18n';

// ─── Tienda e inventario ──────────────────────────────────────

export type ShopItemType = 'powerup' | 'cosmetic';

export interface ShopItem {
  itemId: string;
  name: string;
  description: string;
  price: number;
  type: ShopItemType;
  icon: string;
  sort: number;
  slot: string | null; // frame | name_color | name_style | name_icon (cosméticos)
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  equipped: boolean;
}

export async function fetchShopItems(): Promise<ShopItem[]> {
  const { data } = await supabase
    .from('shop_items')
    .select('item_id, name, description, name_en, description_en, price, type, icon, sort, slot')
    .eq('active', true)
    .order('sort');

  const en = getCurrentLang() === 'en';
  return (data ?? []).map(r => ({
    itemId: r.item_id,
    name: en && r.name_en ? r.name_en : r.name,
    description: (en && r.description_en ? r.description_en : r.description) ?? '',
    price: r.price,
    type: r.type as ShopItemType,
    icon: r.icon ?? '🎁',
    sort: r.sort ?? 0,
    slot: (r as any).slot ?? null,
  }));
}

export async function fetchInventory(userId: string): Promise<InventoryItem[]> {
  const { data } = await supabase
    .from('user_items')
    .select('item_id, quantity, equipped')
    .eq('user_id', userId);

  return (data ?? []).map(r => ({
    itemId: r.item_id,
    quantity: r.quantity ?? 0,
    equipped: !!r.equipped,
  }));
}

// Devuelve un mapa item_id → cantidad para consultas rápidas.
export async function fetchInventoryMap(userId: string): Promise<Record<string, number>> {
  const items = await fetchInventory(userId);
  const map: Record<string, number> = {};
  for (const it of items) map[it.itemId] = it.quantity;
  return map;
}

export async function buyItem(itemId: string): Promise<{ coins?: number; error?: string }> {
  const { data, error } = await supabase.rpc('buy_item', { p_item_id: itemId });
  if (error) {
    const msg = error.message || '';
    if (msg.includes('insufficient')) return { error: i18n.t('errors.insufficientCoins') };
    if (msg.includes('already owned')) return { error: i18n.t('errors.alreadyOwned') };
    return { error: i18n.t('errors.purchaseFailed') };
  }
  return { coins: (data as any)?.coins };
}

// Consume un power-up. Devuelve true si quedaba al menos uno.
export async function consumeItem(itemId: string): Promise<boolean> {
  const { error } = await supabase.rpc('consume_item', { p_item_id: itemId });
  return !error;
}

export async function equipItem(itemId: string, equipped: boolean): Promise<void> {
  await supabase.rpc('equip_item', { p_item_id: itemId, p_equipped: equipped });
}
