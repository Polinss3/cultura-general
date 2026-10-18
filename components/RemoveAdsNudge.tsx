import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeInterstitialClosed } from '@/lib/ads';
import { getPremiumState } from '@/lib/premium';
import { PRO_ACCENT } from '@/lib/pro';
import {
  REMOVE_ADS_NUDGE_STORAGE_KEY,
  REMOVE_ADS_NUDGE_VISIBLE_MS,
  shouldShowRemoveAdsNudge,
} from '@/lib/removeAdsNudge';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';
import { sheetWidth } from '@/constants/layout';

/**
 * Tarjeta flotante "Quitar anuncios" que aparece al cerrar un intersticial,
 * como mucho una vez al día (lib/removeAdsNudge.ts). Va arriba y no es un
 * modal: el usuario acaba de cerrar un anuncio y no se le puede tapar el
 * resultado con otra pantalla. Se monta una vez en el root.
 */
export function RemoveAdsNudge() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true })
      .start(() => setVisible(false));
  };

  useEffect(() => subscribeInterstitialClosed(() => {
    void (async () => {
      const now = Date.now();
      let last: number | null = null;
      try {
        const raw = await AsyncStorage.getItem(REMOVE_ADS_NUDGE_STORAGE_KEY);
        last = raw ? Number(raw) : null;
      } catch { /* sin storage: se trata como la primera vez */ }
      const premium = getPremiumState();
      if (premium.unavailable || !shouldShowRemoveAdsNudge(last, now, premium.isPro)) return;
      await AsyncStorage.setItem(REMOVE_ADS_NUDGE_STORAGE_KEY, String(now)).catch(() => {});

      setVisible(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(hide, REMOVE_ADS_NUDGE_VISIBLE_MS);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  if (!visible) return null;

  const openPaywall = () => {
    feedback.tap();
    hide();
    router.push('/paywall?source=ad_interstitial' as any);
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute', top: insets.top + 8, left: 16, right: 16, zIndex: 9998,
        alignItems: 'center',
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
      }}
    >
      <View style={{
        ...sheetWidth,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: C.surface, borderRadius: Radius.card,
        borderWidth: 1, borderColor: C.border, padding: 14,
        ...cardShadow(isDark),
      }}>
        <Text style={{ fontSize: 24 }}>🚫</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
            {t('pro.removeAds.title')}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2 }}>
            {t('pro.removeAds.body')}
          </Text>
        </View>
        <Pressable
          onPress={openPaywall}
          accessibilityRole="button"
          hitSlop={6}
          style={({ pressed }) => ({
            backgroundColor: PRO_ACCENT, borderRadius: Radius.pill,
            paddingHorizontal: 14, paddingVertical: 9, opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 14 }}>
            {t('pro.removeAds.cta')}
          </Text>
        </Pressable>
        <Pressable
          onPress={hide}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={10}
        >
          <Text style={{ color: C.textMuted, fontSize: 16 }}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
