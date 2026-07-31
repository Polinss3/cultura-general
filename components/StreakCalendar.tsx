import { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { fetchAnsweredDates } from '@/lib/db';
import { getLocaleTag } from '@/lib/i18n';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

interface Props {
  userId: string;
  streak: number;
  bestStreak: number;
}

const MILESTONES = [3, 7, 14, 30];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function StreakCalendar({ userId, streak, bestStreak }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  // Mes actual en UTC (coherente con cómo el resto de la app calcula "hoy").
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const todayDate = now.getUTCDate();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // Lun=0
  const since = `${year}-${pad(month + 1)}-01`;

  useFocusEffect(
    useCallback(() => {
      fetchAnsweredDates(userId, since).then(dates => setAnswered(new Set(dates)));
    }, [userId, since]),
  );

  const localeTag = getLocaleTag();
  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString(localeTag, {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  // Etiquetas de días (Lun..Dom) según idioma, formato estrecho.
  const weekdayFmt = new Intl.DateTimeFormat(localeTag, { weekday: 'narrow', timeZone: 'UTC' });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    // 2024-01-01 fue lunes; recorremos Lun..Dom.
    weekdayFmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );

  // Celdas: huecos iniciales + días del mes.
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const nextMilestone = MILESTONES.find(m => m > streak);

  return (
    <View style={{ backgroundColor: C.surface, borderRadius: Radius.card, padding: 16, borderWidth: 1, borderColor: C.border }}>
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
        <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 13, textTransform: 'capitalize' }}>
          {monthLabel}
        </Text>
      </View>

      {/* Cabecera de días de la semana */}
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {weekdays.map((w, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', color: C.textFaint, fontFamily: Font.semi, fontSize: 12, textTransform: 'uppercase' }}>
            {w}
          </Text>
        ))}
      </View>

      {/* Rejilla del mes */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d === null) return <View key={`e${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isAnswered = answered.has(dateStr);
          const isToday = d === todayDate;
          const isFuture = d > todayDate;
          return (
            <View key={d} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}>
              <View style={{
                flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isAnswered ? C.streak : C.border,
                borderWidth: isToday ? 1.5 : 0,
                borderColor: isToday ? C.text : 'transparent',
                opacity: isFuture ? 0.35 : 1,
              }}>
                <Text style={{
                  color: isAnswered ? C.text : C.textMuted,
                  fontFamily: isAnswered ? Font.bold : Font.regular,
                  fontSize: 12,
                }}>
                  {d}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

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
    </View>
  );
}
