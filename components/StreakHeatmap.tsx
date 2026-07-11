import { useState, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { fetchDailyActivity } from '@/lib/db';
import { getPlayedDates } from '@/lib/dailyRoute';

interface Props {
  userId: string;
  streak: number;
}

const DAYS = 14;

// Amarillo de la racha (mismo que el perfil), con opacidad según intensidad.
function squareColor(intensity: number): string {
  if (intensity <= 0) return 'rgba(255,255,255,0.06)';
  const op = intensity >= 3 ? 1 : intensity === 2 ? 0.62 : 0.33;
  return `rgba(232,160,48,${op})`;
}

export function StreakHeatmap({ userId, streak }: Props) {
  const { t } = useTranslation();
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
      marginTop: 16, backgroundColor: '#151515', borderRadius: 16, padding: 14,
    }}>
      {/* Racha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Text style={{ fontSize: 24 }}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>
            {t('home.streakDays', { count: streak })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 1 }}>
            {streak > 0 ? t('home.streakKeep') : t('home.streakStart')}
          </Text>
        </View>
        <Text style={{ color: '#e8a030', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>
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
                aspectRatio: 1,
                borderRadius: 4,
                backgroundColor: squareColor(intensity),
                borderWidth: isToday ? 1 : 0,
                borderColor: isToday ? 'rgba(255,255,255,0.5)' : 'transparent',
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
