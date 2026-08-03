import { useState, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { fetchDailyActivity } from '@/lib/db';
import { getPlayedDates } from '@/lib/dailyRoute';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';

interface Props {
  userId: string;
  streak: number;
}

const DAYS = 14;

// Escala cálida de la racha: de la pista vacía al ámbar pleno, en tres pasos.
const STEPS_LIGHT = ['#F7D9A8', '#F3C377', '#EFAE46'];
const STEPS_DARK = ['#5C4526', '#8F6A2C', '#F0A93B'];

function squareColor(intensity: number, C: Palette, isDark: boolean): string {
  if (intensity <= 0) return C.track;
  const steps = isDark ? STEPS_DARK : STEPS_LIGHT;
  return steps[Math.min(intensity, steps.length) - 1];
}

export function StreakHeatmap({ userId, streak }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const [intensities, setIntensities] = useState<number[]>(() => new Array(DAYS).fill(0));

  // Últimos 14 días (UTC, coherente con el resto de la app), terminando hoy.
  const days = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - (DAYS - 1 - i));
      return d.toISOString().slice(0, 10);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([
        fetchDailyActivity(userId, days[0]),
        getPlayedDates(days),
      ]).then(([act, playedSet]) => {
        if (cancelled) return;
        const answered = new Set(act.answered);
        const missions = new Set(act.missionsClaimed);
        setIntensities(days.map(d =>
          (answered.has(d) ? 1 : 0) + (missions.has(d) ? 1 : 0) + (playedSet.has(d) ? 1 : 0),
        ));
      });
      return () => { cancelled = true; };
    }, [userId, days]),
  );

  return (
    <View style={{
      marginTop: 12,
      backgroundColor: C.surface,
      borderRadius: Radius.cardLg,
      borderWidth: 1,
      borderColor: C.border,
      padding: 10,
      ...cardShadow(isDark),
    }}>
      {/* Racha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 }}>
        <View style={{
          width: 36, height: 36, borderRadius: 12,
          backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 18 }}>🔥</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.extra }}>
            {t('home.streakDays', { count: streak })}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 2 }}>
            {streak > 0 ? t('home.streakKeep') : t('home.streakStart')}
          </Text>
        </View>
        <Text style={{ color: C.streakText, fontSize: 26, fontFamily: Font.black, lineHeight: 30 }}>
          {streak}
        </Text>
      </View>

      {/* Heatmap últimas 2 semanas */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {intensities.map((intensity, i) => {
          const isToday = i === DAYS - 1;
          return (
            <View
              key={days[i]}
              style={{
                flex: 1,
                height: 14,
                borderRadius: 4,
                backgroundColor: squareColor(intensity, C, isDark),
                borderWidth: isToday ? 2 : 0,
                borderColor: isToday ? C.brand : 'transparent',
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
