import { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { fetchAnsweredDates } from '@/lib/db';
import { recoverStreak } from '@/lib/gamification';
import { todayStr } from '@/lib/dailyRoute';
import {
  getStreakAtRiskNotice,
  getStreakRecoveryOffer,
  type StreakAtRiskNotice,
  type StreakRecoveryOffer,
} from '@/lib/streakRecovery';
import { feedback } from '@/lib/feedback';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';
import type { Profile } from '@/hooks/useProfile';

interface Props {
  userId: string;
  profile: Profile | null;
  /** Vuelve a leer el perfil tras recuperar (monedas y racha cambian). */
  refresh: () => void;
}

// Tarjeta bajo la racha en Inicio y en el resultado del día. Dos estados:
//  · rota → botón para pagar y recuperarla (el servidor cobra y decide);
//  · en peligro → aviso para responder hoy, porque el reinicio (y por tanto la
//    oferta de pago) solo ocurre al responder.
// Si no hay nada que contar, no se pinta.
export function StreakRecoveryCard({ userId, profile, refresh }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const { C, isDark } = useTheme();

  const [atRisk, setAtRisk] = useState<StreakAtRiskNotice | null>(null);
  const [busy, setBusy] = useState(false);

  const offer: StreakRecoveryOffer | null = getStreakRecoveryOffer(profile);

  useFocusEffect(
    useCallback(() => {
      // Con oferta de pago ya no hace falta el aviso previo.
      if (offer || !profile || (profile.streak ?? 0) < 2) {
        setAtRisk(null);
        return;
      }
      let cancelled = false;
      const today = todayStr();
      const since = new Date(`${today}T00:00:00Z`);
      since.setUTCDate(since.getUTCDate() - 2);
      fetchAnsweredDates(userId, since.toISOString().slice(0, 10))
        .then(dates => {
          if (!cancelled) setAtRisk(getStreakAtRiskNotice(profile, dates, today));
        })
        .catch(() => { if (!cancelled) setAtRisk(null); });
      return () => { cancelled = true; };
    }, [userId, profile?.streak, profile?.lost_streak, profile?.lost_streak_at, !!offer]),
  );

  const onRecover = async () => {
    if (!offer || busy) return;
    feedback.tap();
    setBusy(true);
    const result = await recoverStreak();
    setBusy(false);
    if ('error' in result) {
      showToast({ message: result.error, type: 'error' });
      // Quizá ya caducó: releer deja la tarjeta en su estado real.
      refresh();
      return;
    }
    feedback.reward();
    showToast({ message: t('streak.recovery.success', { streak: result.streak }), type: 'success' });
    refresh();
  };

  if (!offer && !atRisk) return null;

  const card = {
    marginTop: 10,
    backgroundColor: C.surface,
    borderRadius: Radius.cardLg,
    borderWidth: 1,
    borderColor: C.streak,
    padding: 14,
    gap: 10,
    ...cardShadow(isDark),
  } as const;

  if (offer) {
    const expires = new Date(offer.expiresAt).toLocaleTimeString(i18n.language, {
      hour: '2-digit', minute: '2-digit',
    });
    const missing = offer.price - (profile?.coins ?? 0);
    return (
      <View style={card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <View style={{
            width: 40, height: 40, borderRadius: 13,
            backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 20 }}>💔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>
              {t('streak.recovery.brokenTitle', { count: offer.lostStreak })}
            </Text>
            <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 2, lineHeight: 18 }}>
              {t('streak.recovery.brokenSub', { streak: offer.recoveredStreak })}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable
            accessibilityRole="button"
            disabled={busy || !offer.canAfford}
            onPress={onRecover}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: offer.canAfford ? C.brand : C.surfaceSunk,
              borderRadius: Radius.pill,
              paddingVertical: 11,
              alignItems: 'center',
              opacity: pressed || busy ? 0.8 : 1,
            })}
          >
            <Text style={{ color: offer.canAfford ? C.onBrand : C.textMuted, fontFamily: Font.extra, fontSize: 14 }}>
              {busy
                ? t('streak.recovery.recovering')
                : offer.canAfford
                  ? t('streak.recovery.cta', { price: offer.price })
                  : t('streak.recovery.ctaPoor', { missing })}
            </Text>
          </Pressable>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12 }}>
            {t('streak.recovery.brokenExpires', { time: expires })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => { feedback.tap(); router.push('/(tabs)/daily'); }}
      style={({ pressed }) => ({ ...card, opacity: pressed ? 0.85 : 1 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        <View style={{
          width: 40, height: 40, borderRadius: 13,
          backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 20 }}>⚠️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>
            {t('streak.recovery.atRiskTitle', { count: atRisk!.streak })}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 2, lineHeight: 18 }}>
            {t('streak.recovery.atRiskSub', { price: atRisk!.price })}
          </Text>
        </View>
        <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
      </View>
    </Pressable>
  );
}
