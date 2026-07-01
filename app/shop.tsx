import { useState, useCallback } from 'react';
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

// Los cosméticos (marcos, color de nombre, temas) todavía no tienen
// efecto visual en el resto de la app — ocultos hasta que lo tengan.
const COSMETICS_ENABLED = false;

export default function ShopScreen() {
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
    if (coins < item.price) { showToast({ type: 'info', message: 'No tienes monedas suficientes.' }); return; }
    setBusy(item.itemId);
    const { error } = await buyItem(item.itemId);
    setBusy(null);
    if (error) { showToast({ type: 'info', message: error }); return; }
    showToast({ type: 'success', message: `¡${item.name} comprado!` });
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
  };

  const handleWatchAd = async () => {
    if (busy) return;
    setBusy('ad');
    const ok = await showRewardedAd('shop_coins');
    if (ok) {
      await awardProgress(0, REWARDS.rewardedAdCoins, false, 'rewarded_ad');
      showToast({ type: 'success', message: `+${REWARDS.rewardedAdCoins} 🪙 por ver el anuncio` });
      bumpMissions('coins_earned', REWARDS.rewardedAdCoins);
      refresh();
    } else {
      showToast({ type: 'info', message: 'Anuncio no disponible ahora mismo.' });
    }
    setBusy(null);
  };

  const powerups = items.filter(i => i.type === 'powerup');
  const cosmetics = COSMETICS_ENABLED ? items.filter(i => i.type === 'cosmetic') : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>Tienda</Text>
        </View>
        <CoinPill coins={coins} />
      </View>

      {!available ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🛒</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', fontFamily: 'Outfit_400Regular', lineHeight: 22 }}>
            {offline ? 'La tienda necesita conexión.' : 'Crea una cuenta para acceder a la tienda y gastar tus monedas.'}
          </Text>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#e8a030" size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

          {/* Anuncio recompensado */}
          {isRewardedReady() && (
            <Pressable onPress={handleWatchAd} disabled={busy === 'ad'} style={{ marginBottom: 18 }}>
              <View style={{ backgroundColor: 'rgba(46,200,122,0.1)', borderWidth: 1, borderColor: 'rgba(46,200,122,0.35)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>🎬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>Ver anuncio</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>
                    Consigue +{REWARDS.rewardedAdCoins} monedas gratis
                  </Text>
                </View>
                <View style={{ backgroundColor: '#2ec87a', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 14 }}>
                  <Text style={{ color: '#000', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
                    {busy === 'ad' ? '...' : '+30 🪙'}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Power-ups */}
          <SectionTitle>Power-ups</SectionTitle>
          <View style={{ gap: 10, marginBottom: 22 }}>
            {powerups.map(item => (
              <ShopRow
                key={item.itemId}
                item={item}
                owned={inventory[item.itemId] ?? 0}
                coins={coins}
                busy={busy === item.itemId}
                onBuy={() => handleBuy(item)}
              />
            ))}
          </View>

          {/* Cosméticos (ocultos hasta que tengan efecto visual) */}
          {cosmetics.length > 0 && (
            <>
              <SectionTitle>Cosméticos</SectionTitle>
              <View style={{ gap: 10 }}>
                {cosmetics.map(item => (
                  <ShopRow
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
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ShopRow({
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
  const isOwnedCosmetic = cosmetic && owned > 0;
  const affordable = coins >= item.price;
  return (
    <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#1f1f1f', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22 }}>{item.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>{item.name}</Text>
          {!cosmetic && owned > 0 && (
            <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 12 }}>×{owned}</Text>
          )}
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 1 }}>
          {item.description}
        </Text>
      </View>

      {isOwnedCosmetic ? (
        <Pressable onPress={onEquip}>
          <View style={{
            borderRadius: 99, paddingVertical: 7, paddingHorizontal: 14,
            backgroundColor: equipped ? '#2ec87a' : '#1f1f1f',
            borderWidth: 1, borderColor: equipped ? '#2ec87a' : 'rgba(255,255,255,0.12)',
          }}>
            <Text style={{ color: equipped ? '#000' : '#fff', fontFamily: 'Outfit_700Bold', fontSize: 12 }}>
              {equipped ? 'Equipado' : 'Equipar'}
            </Text>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={onBuy} disabled={busy || !affordable}>
          <View style={{
            borderRadius: 99, paddingVertical: 7, paddingHorizontal: 14,
            backgroundColor: affordable ? '#e8a030' : '#1f1f1f',
            opacity: affordable ? 1 : 0.6,
          }}>
            <Text style={{ color: affordable ? '#000' : 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_700Bold', fontSize: 12 }}>
              {busy ? '...' : `${item.price} 🪙`}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
      {children}
    </Text>
  );
}
