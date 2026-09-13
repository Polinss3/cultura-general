import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { fetchAnsweredDates } from '@/lib/db';
import { feedback } from '@/lib/feedback';
import { StreakMonthGrid, monthKey, monthLabel } from '@/components/StreakMonthGrid';
import { StreakSheet } from '@/components/StreakSheet';
import { useTheme } from '@/constants/colors';
import { Font, Radius, tint } from '@/constants/theme';

interface Props {
  userId: string;
  streak: number;
  bestStreak: number;
}

const MILESTONES = [3, 7, 14, 30];

export function StreakCalendar({ userId, streak, bestStreak }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

  // Mes actual en UTC (coherente con cómo el resto de la app calcula "hoy").
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const since = monthKey(year, month);

  useFocusEffect(
    useCallback(() => {
      fetchAnsweredDates(userId, since).then(dates => setAnswered(new Set(dates)));
    }, [userId, since]),
  );

  const nextMilestone = MILESTONES.find(m => m > streak);

  return (
    <>
      {/* Toda la tarjeta abre la sheet: es donde se recorren los meses
          anteriores, que aquí no caben. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('streak.openCalendar')}
        onPress={() => { feedback.tap(); setSheetOpen(true); }}
        style={({ pressed }) => ({
          backgroundColor: C.surface, borderRadius: Radius.card, padding: 16,
          borderWidth: 1, borderColor: C.border,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {/* Cabecera: racha actual + récord */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 28 }}>🔥</Text>
            <View>
              <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 22 }}>
                {t('streak.days', { count: streak })}
              </Text>
              <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12 }}>
                {t('streak.best', { count: bestStreak })}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 13, textTransform: 'capitalize' }}>
              {monthLabel(year, month)}
            </Text>
            <Text style={{ color: C.textFaint, fontSize: 18, lineHeight: 20 }}>›</Text>
          </View>
        </View>

        <StreakMonthGrid year={year} month={month} answered={answered} />

        {/* Hitos */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {MILESTONES.map(m => {
            const reached = streak >= m;
            return (
              <View key={m} style={{
                flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10,
                backgroundColor: reached ? tint(C.streak, isDark) : C.border,
                borderWidth: 1, borderColor: reached ? C.streak + '66' : 'transparent',
              }}>
                <Text style={{ fontSize: 15, opacity: reached ? 1 : 0.4 }}>🔥</Text>
                <Text style={{ color: reached ? C.streak : C.textMuted, fontFamily: Font.bold, fontSize: 12, marginTop: 2 }}>
                  {m}
                </Text>
              </View>
            );
          })}
        </View>
        {nextMilestone && (
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            {t('streak.nextMilestone', { count: nextMilestone - streak, milestone: nextMilestone })}
          </Text>
        )}
      </Pressable>

      <StreakSheet
        visible={sheetOpen}
        userId={userId}
        streak={streak}
        bestStreak={bestStreak}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
