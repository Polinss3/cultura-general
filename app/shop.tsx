import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useToast } from '@/context/ToastContext';
import { CoinPill } from '@/components/CoinPill';
import { ProBadge } from '@/components/ProBadge';
import { useIsPro } from '@/hooks/usePremium';
import { PRO_ACCENT } from '@/lib/pro';
import {
  fetchShopItems, fetchInventory, buyItem, equipItem, ShopItem,
} from '@/lib/shop';
import { awardProgress, bumpMissions } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { showRewardedAd, isRewardedReady } from '@/lib/ads';
import { grantRewardOnce } from '@/lib/adRewards';
import { alpha, readableOn, useTheme, type Palette } from '@/constants/colors';
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
  const isPro = useIsPro();

  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [equipped, setEquipped] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [category, setCategory] = useState<'powerups' | 'cosmetics'>('powerups');

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

  const goToPaywall = () => router.push('/paywall?source=shop_cosmetic' as any);

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
    // Las monedas las concede el servidor de anuncios con un recibo firmado, y
    // el libro mayor garantiza que ese recibo solo se cobra una vez. Si el RPC
    // falla, lanzamos: el visor deja el anuncio abierto con su botón de
    // reintento y el mismo recibo, en vez de tragarse la recompensa ganada.
    const outcome = await showRewardedAd('shop_coins', async ({ receipt }) => {
      const applied = await grantRewardOnce(receipt, async () => {
        const award = await awardProgress(0, REWARDS.rewardedAdCoins, false, 'rewarded_ad');
        return award !== null;
      });
      if (applied !== 'applied') throw new Error('reward_not_applied');
    });
    if (outcome === 'granted') {
      showToast({ type: 'success', message: t('shop.adReward', { coins: REWARDS.rewardedAdCoins }) });
      bumpMissions('coins_earned', REWARDS.rewardedAdCoins);
      refresh();
    } else if (outcome === 'unavailable') {
      showToast({ type: 'info', message: t('shop.adUnavailable') });
    }
    // 'dismissed' es una decisión del usuario: cerró el anuncio antes de
    // ganarlo y ya se lo avisó el propio visor. No hace falta insistir.
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
        <>
        <View style={{ flexDirection: 'row', gap: 6, marginHorizontal: 20, marginTop: 8, marginBottom: 8, padding: 5, borderRadius: Radius.row, backgroundColor: C.surfaceSunk }}>
          {(['powerups', 'cosmetics'] as const).map(tab => (
            <Pressable
              key={tab}
              onPress={() => setCategory(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: category === tab }}
              style={{
                flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
                borderRadius: 12, backgroundColor: category === tab ? C.surface : 'transparent',
                borderWidth: 1, borderColor: category === tab ? C.borderWarm : 'transparent',
                ...(category === tab ? cardShadow(isDark) : {}),
              }}
            >
              <Text style={{ fontSize: 18 }}>{tab === 'powerups' ? '⚡' : '✨'}</Text>
              <Text style={{ color: category === tab ? C.text : C.textMuted, fontFamily: category === tab ? Font.black : Font.bold, fontSize: 15 }}>
                {t(`shop.${tab}`)}
              </Text>
            </Pressable>
          ))}
        </View>
        <ScrollView key={category} contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 25, marginBottom: 4 }}>
            {category === 'powerups' ? `⚡ ${t('shop.powerups')}` : `✨ ${t('shop.cosmetics')}`}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, lineHeight: 21, marginBottom: 14 }}>
            {t(category === 'powerups' ? 'shop.powerupsDescription' : 'shop.cosmeticsDescription')}
          </Text>

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

          {category === 'powerups' && (
            <>
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
          <SectionTitle>{t('shop.powerupsAvailable')}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
            {powerups.map(item => (
              <ShopCard
                key={item.itemId}
                item={item}
                owned={inventory[item.itemId] ?? 0}
                coins={coins}
                busy={busy === item.itemId}
                isPro={isPro}
                onBuy={() => handleBuy(item)}
                onLocked={goToPaywall}
              />
            ))}
          </View>
            </>
          )}

          {/* Cosméticos, separados por subsecciones (2 columnas) */}
          {category === 'cosmetics' && COSMETIC_SECTIONS.map(({ slot, title }) => {
            const list = cosmetics.filter(c => c.slot === slot);
            if (list.length === 0) return null;
            return (
              <View key={slot}>
                <SectionTitle>{t(title)}</SectionTitle>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 }}>
                  {list.map(item => (
                    <ShopCard
                      key={item.itemId}
                      item={item}
                      owned={inventory[item.itemId] ?? 0}
                      coins={coins}
                      busy={busy === item.itemId}
                      cosmetic
                      equipped={equipped.has(item.itemId)}
                      isPro={isPro}
                      onBuy={() => handleBuy(item)}
                      onEquip={() => handleEquip(item)}
                      onLocked={goToPaywall}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

function ShopCard({
  item, owned, coins, busy, cosmetic, equipped, isPro, onBuy, onEquip, onLocked,
}: {
  item: ShopItem;
  owned: number;
  coins: number;
  busy: boolean;
  cosmetic?: boolean;
  equipped?: boolean;
  isPro: boolean;
  onBuy: () => void;
  onEquip?: () => void;
  onLocked: () => void;
}) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const isOwnedCosmetic = cosmetic && owned > 0;
  const affordable = coins >= item.price;
  // Los cosméticos PRO se siguen pagando con monedas: lo exclusivo es el
  // acceso, no el precio. Para eso está el estipendio mensual.
  const proLocked = item.proOnly && !isPro && owned === 0;
  return (
    <View style={{ width: '48%', backgroundColor: C.surface, borderRadius: 18, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: equipped ? C.correct : C.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: C.surfaceSunk, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        </View>
        {item.proOnly && <ProBadge />}
        {!cosmetic && owned > 0 && (
          <View style={{ backgroundColor: tint(C.streak, isDark), borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>×{owned}</Text>
          </View>
        )}
      </View>

      <Text numberOfLines={2} style={{ color: C.text, fontFamily: Font.bold, fontSize: 15, minHeight: 37 }}>{item.name}</Text>
      <Text numberOfLines={2} style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 3, marginBottom: 14, minHeight: 36 }}>
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
      ) : proLocked ? (
        <Pressable onPress={onLocked}>
          <View style={{
            borderRadius: 10, paddingVertical: 8, alignItems: 'center',
            backgroundColor: alpha(PRO_ACCENT, isDark ? 0.28 : 0.14),
            borderWidth: 1, borderColor: alpha(PRO_ACCENT, 0.4),
          }}>
            <Text style={{ color: isDark ? '#C4A8F5' : PRO_ACCENT, fontFamily: Font.bold, fontSize: 12 }}>
              {t('shop.proOnly')}
            </Text>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={onBuy} disabled={busy || !affordable} accessibilityRole="button" accessibilityLabel={`${t('shop.buy')} ${item.name}, ${item.price} ${t('shop.coins')}`}>
          <LinearGradient
            colors={affordable ? ['#FFE2A5', '#F7B650', '#E7932D'] : [C.surfaceSunk, C.surfaceSunk, C.surfaceSunk]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }}
            style={{
              borderRadius: 12, minHeight: 54, alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: affordable ? '#D88E2F' : C.border,
              shadowColor: '#A9621C', shadowOpacity: affordable && !isDark ? 0.16 : 0,
              shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Text style={{ color: affordable ? '#493019' : C.textMuted, fontFamily: Font.bold, fontSize: 11, lineHeight: 15, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('shop.buy')}
            </Text>
            <Text style={{ color: affordable ? '#352416' : C.textMuted, fontFamily: Font.black, fontSize: 16, lineHeight: 20 }}>
              {busy ? '…' : `${item.price} 🪙`}
            </Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const { C } = useTheme();
  return (
    <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black, letterSpacing: 0.2, marginTop: 28, marginBottom: 16 }}>
      {children}
    </Text>
  );
}
