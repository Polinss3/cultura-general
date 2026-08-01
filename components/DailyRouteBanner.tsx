import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { checkDailyAnswered } from '@/lib/db';
import { computeRouteState, getDailyPlayed, todayStr } from '@/lib/dailyRoute';
import type { Profile } from '@/hooks/useProfile';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow, highlightGradient } from '@/constants/theme';

interface Props {
  userId: string;
  profile: Profile | null;
}

/**
 * Resumen de la ruta de hoy para Inicio: progreso y poco más. La ruta completa,
 * con sus pasos y sus recompensas, vive en Diario; esto solo la anuncia y
 * lleva hasta allí.
 */
export function DailyRouteBanner({ userId, profile }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { C, isDark } = useTheme();

  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [played, setPlayed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([checkDailyAnswered(userId), getDailyPlayed()]).then(([daily, didPlay]) => {
        if (cancelled) return;
        setDailyAnswered(daily.answered);
        setPlayed(didPlay);
      });
      return () => { cancelled = true; };
    }, [userId]),
  );

  const chestClaimed = !!profile && profile.last_chest_at === todayStr();
  const route = computeRouteState(dailyAnswered, chestClaimed, played);
  const pct = (route.coreDone / route.coreTotal) * 100;

  return (
    <Pressable onPress={() => router.push('/(tabs)/daily')} style={{ marginTop: 10 }}>
      <LinearGradient
        colors={highlightGradient(isDark)}
        locations={[0, 0.6]}
        start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }}
        style={{
          borderRadius: Radius.cardLg, padding: 12, gap: 10,
          borderWidth: 1.5, borderColor: C.borderWarm,
          ...cardShadow(isDark),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 21 }}>🗓️</Text>
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.black }}>
              {t('home.route.title')}
            </Text>
            <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
              {route.complete ? t('home.route.bannerDone') : t('home.route.subtitle')}
            </Text>
          </View>
          <View style={{
            backgroundColor: route.complete ? C.correct : C.brand,
            borderRadius: Radius.pill, paddingVertical: 8, paddingHorizontal: 16,
          }}>
            <Text style={{ color: C.onBrand, fontSize: 14, fontFamily: Font.extra }}>
              {t('home.route.see')}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, height: 8, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
            <View style={{
              height: '100%', width: `${pct}%`, borderRadius: Radius.pill,
              backgroundColor: route.complete ? C.correct : C.brand,
            }} />
          </View>
          <Text style={{
            color: route.complete ? C.correctText : C.brandDeep,
            fontSize: 13, fontFamily: Font.black,
          }}>
            {route.coreDone}/{route.coreTotal}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
