import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useToast } from '@/context/ToastContext';
import { CoinPill } from '@/components/CoinPill';
import {
  fetchShopItems, fetchInventory, buyItem, equipItem, ShopItem,
} from '@/lib/shop';
import { awardProgress, bumpMissions } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { showRewardedAd, isRewardedReady } from '@/lib/admob';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

// Marcos de avatar y color de nombre ya se muestran en tu home y perfil.
// (theme_emerald está desactivado en BD hasta que tenga efecto.)
const COSMETICS_ENABLED = true;

// Subsecciones de cosméticos por slot (orden de aparición en la tienda).
const COSMETIC_SECTIONS: { slot: string; title: string }[] = [
  { slot: 'frame',      title: 'shop.cosmeticsFrames' },
  { slot: 'name_color', title: 'shop.cosmeticsColor' },
  { slot: 'name_style', title: 'shop.cosmeticsStyle' },
  { slot: 'name_icon',  title: 'shop.cosmeticsIcons' },
];

export default function ShopScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const { guest } = useGuest();
  const offline = useOffline();
  const { showToast } = useToast();

  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [equipped, setEquipped] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const available = !!user && !guest && !offline;

  const load = useCallback(async () => {
    if (!available || !user) { setLoading(false); return; }
    const [its, inv] = await Promise.all([fetchShopItems(), fetchInventory(user.id)]);
    setItems(its);
    const map: Record<string, number> = {};
    const eq = new Set<string>();
    for (const it of inv) {
      map[it.itemId] = it.quantity;
      if (it.equipped) eq.add(it.itemId);
    }
    setInventory(map);
    setEquipped(eq);
    setLoading(false);
  }, [available, user?.id]);

  useFocusEffect(useCallback(() => { refresh(); load(); }, [load, refresh]));

  const coins = profile?.coins ?? 0;

  const handleBuy = async (item: ShopItem) => {
    if (busy) return;
    if (coins < item.price) { showToast({ type: 'info', message: t('errors.insufficientCoins') }); return; }
    setBusy(item.itemId);
    const { error } = await buyItem(item.itemId);
    setBusy(null);
    if (error) { showToast({ type: 'info', message: error }); return; }
    showToast({ type: 'success', message: t('shop.bought', { name: item.name }) });
    refresh();
    load();
  };

  const handleEquip = async (item: ShopItem) => {
    const isEq = equipped.has(item.itemId);
    setEquipped(prev => {
      const next = new Set(prev);
      if (isEq) next.delete(item.itemId); else next.add(item.itemId);
      return next;
    });
    await equipItem(item.itemId, !isEq);
    // Recargar: equipar es exclusivo por slot (el servidor desequipa el resto).
    load();
  };

  const handleWatchAd = async () => {
    if (busy) return;
    setBusy('ad');
    const ok = await showRewardedAd('shop_coins');
    if (ok) {
      await awardProgress(0, REWARDS.rewardedAdCoins, false, 'rewarded_ad');
      showToast({ type: 'success', message: t('shop.adReward', { coins: REWARDS.rewardedAdCoins }) });
      bumpMissions('coins_earned', REWARDS.rewardedAdCoins);
      refresh();
    } else {
      showToast({ type: 'info', message: t('shop.adUnavailable') });
    }
    setBusy(null);
  };

  const powerups = items.filter(i => i.type === 'powerup');
  const cosmetics = COSMETICS_ENABLED ? items.filter(i => i.type === 'cosmetic') : [];
  const ownedPowerups = powerups.filter(p => (inventory[p.itemId] ?? 0) > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
          </Pressable>
          <Text style={{ color: C.text, fontSize: 20, fontFamily: Font.black }}>{t('shop.title')}</Text>
        </View>
        <CoinPill coins={coins} />
      </View>

      {!available ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🛒</Text>
          <Text style={{ color: C.textMuted, fontSize: 15, textAlign: 'center', fontFamily: Font.regular, lineHeight: 22 }}>
            {offline ? t('shop.offlineMsg') : t('shop.guestMsg')}
          </Text>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

          {/* Anuncio recompensado */}
          {isRewardedReady() && (
            <Pressable onPress={handleWatchAd} disabled={busy === 'ad'} style={{ marginBottom: 18 }}>
              <View style={{ backgroundColor: tint(C.correct, isDark), borderWidth: 1, borderColor: C.correct, borderRadius: Radius.card, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>🎬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 14 }}>{t('shop.watchAd')}</Text>
                  <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12 }}>
                    {t('shop.watchAdSub', { coins: REWARDS.rewardedAdCoins })}
                  </Text>
                </View>
                <View style={{ backgroundColor: C.correct, borderRadius: Radius.pill, paddingVertical: 6, paddingHorizontal: 14 }}>
                  <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 13 }}>
                    {busy === 'ad' ? '…' : `+${REWARDS.rewardedAdCoins} 🪙`}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Inventario: tus objetos */}
          <SectionTitle>{t('shop.inventoryTitle')}</SectionTitle>
          {ownedPowerups.length === 0 ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 16, marginBottom: 22, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, lineHeight: 20 }}>
                {t('shop.inventoryEmpty')}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {ownedPowerups.map(p => (
                <View key={p.itemId} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderRadius: Radius.row, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: C.streak }}>
                  <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                  <Text style={{ color: C.text, fontFamily: Font.semi, fontSize: 13 }}>{p.name}</Text>
                  <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 13 }}>×{inventory[p.itemId]}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Power-ups (2 columnas) */}
          <SectionTitle>{t('shop.powerups')}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 }}>
            {powerups.map(item => (
              <ShopCard
                key={item.itemId}
                item={item}
                owned={inventory[item.itemId] ?? 0}
                coins={coins}
                busy={busy === item.itemId}
                onBuy={() => handleBuy(item)}
              />
            ))}
          </View>

          {/* Cosméticos, separados por subsecciones (2 columnas) */}
          {COSMETIC_SECTIONS.map(({ slot, title }) => {
            const list = cosmetics.filter(c => c.slot === slot);
            if (list.length === 0) return null;
            return (
              <View key={slot}>
                <SectionTitle>{t(title)}</SectionTitle>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 }}>
                  {list.map(item => (
                    <ShopCard
                      key={item.itemId}
                      item={item}
                      owned={inventory[item.itemId] ?? 0}
                      coins={coins}
                      busy={busy === item.itemId}
                      cosmetic
                      equipped={equipped.has(item.itemId)}
                      onBuy={() => handleBuy(item)}
                      onEquip={() => handleEquip(item)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ShopCard({
  item, owned, coins, busy, cosmetic, equipped, onBuy, onEquip,
}: {
  item: ShopItem;
  owned: number;
  coins: number;
  busy: boolean;
  cosmetic?: boolean;
  equipped?: boolean;
  onBuy: () => void;
  onEquip?: () => void;
}) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const isOwnedCosmetic = cosmetic && owned > 0;
  const affordable = coins >= item.price;
  return (
    <View style={{ width: '48%', backgroundColor: C.surface, borderRadius: 18, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: equipped ? C.correct : 'transparent' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: C.surfaceSunk, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        {!cosmetic && owned > 0 && (
          <View style={{ backgroundColor: tint(C.streak, isDark), borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>×{owned}</Text>
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={{ color: C.text, fontFamily: Font.bold, fontSize: 13 }}>{item.name}</Text>
      <Text numberOfLines={2} style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12, marginTop: 2, marginBottom: 10, minHeight: 28 }}>
        {item.description}
      </Text>

      {isOwnedCosmetic ? (
        <Pressable onPress={onEquip}>
          <View style={{
            borderRadius: 10, paddingVertical: 8, alignItems: 'center',
            backgroundColor: equipped ? C.correct : C.surfaceSunk,
            borderWidth: 1, borderColor: equipped ? C.correct : C.border,
          }}>
            <Text style={{ color: equipped ? C.text : C.text, fontFamily: Font.bold, fontSize: 12 }}>
              {equipped ? t('shop.equipped') : t('shop.equip')}
            </Text>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={onBuy} disabled={busy || !affordable}>
          <View style={{
            borderRadius: 10, paddingVertical: 8, alignItems: 'center',
            backgroundColor: affordable ? C.streak : C.surfaceSunk,
            opacity: affordable ? 1 : 0.6,
          }}>
            <Text style={{ color: affordable ? C.text : C.textMuted, fontFamily: Font.bold, fontSize: 12 }}>
              {busy ? '…' : `${item.price} 🪙`}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const { C, isDark } = useTheme();
  return (
    <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra, letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 12 }}>
      {children}
    </Text>
  );
}
