import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { fetchAnsweredDates } from '@/lib/db';
import { feedback } from '@/lib/feedback';
import { StreakMonthGrid, monthKey, monthLabel, pad } from '@/components/StreakMonthGrid';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type } from '@/constants/theme';

interface Props {
  visible: boolean;
  userId: string;
  streak: number;
  bestStreak: number;
  onClose: () => void;
}

/** Meses hacia atrás que se pueden recorrer aunque no haya nada jugado. */
const MIN_MONTHS_BACK = 11;

/** Hasta dónde se piden fechas al servidor: más allá de esto no hay nada que ver. */
const FETCH_MONTHS_BACK = 36;

interface YearMonth {
  year: number;
  month: number;
}

function shift({ year, month }: YearMonth, delta: number): YearMonth {
  const d = new Date(Date.UTC(year, month + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

function compare(a: YearMonth, b: YearMonth): number {
  return a.year !== b.year ? a.year - b.year : a.month - b.month;
}

function currentMonth(): YearMonth {
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
}

/**
 * Sheet de la racha: el calendario mensual con flechas para recorrer meses
 * anteriores. Se abre desde la tarjeta de racha de la home y del perfil.
 *
 * Se puede retroceder hasta el mes más antiguo con algo jugado (o un año, lo
 * que quede más atrás) y avanzar solo hasta el mes actual: el futuro no tiene
 * nada que enseñar.
 */
export function StreakSheet({ visible, userId, streak, bestStreak, onClose }: Props) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [cursor, setCursor] = useState<YearMonth>(currentMonth);

  // Al abrir: volver al mes actual y traer las fechas jugadas. Se piden todas
  // de una vez (una fila por día jugado, como mucho unos cientos) para que
  // cambiar de mes sea instantáneo.
  useEffect(() => {
    if (!visible) return;
    const today = currentMonth();
    setCursor(today);
    const from = shift(today, -FETCH_MONTHS_BACK);
    let cancelled = false;
    fetchAnsweredDates(userId, monthKey(from.year, from.month)).then(dates => {
      if (!cancelled) setAnswered(new Set(dates));
    });
    return () => { cancelled = true; };
  }, [visible, userId]);

  const maxMonth = currentMonth();
  const minMonth = useMemo(() => {
    const floor = shift(maxMonth, -MIN_MONTHS_BACK);
    let earliest: string | null = null;
    for (const d of answered) if (earliest === null || d < earliest) earliest = d;
    if (!earliest) return floor;
    const first = { year: Number(earliest.slice(0, 4)), month: Number(earliest.slice(5, 7)) - 1 };
    return compare(first, floor) < 0 ? first : floor;
  }, [answered, maxMonth.year, maxMonth.month]);

  const canGoBack = compare(cursor, minMonth) > 0;
  const canGoForward = compare(cursor, maxMonth) < 0;

  const go = (delta: number) => {
    feedback.tap();
    setCursor(c => shift(c, delta));
  };

  const prefix = `${cursor.year}-${pad(cursor.month + 1)}-`;
  let playedThisMonth = 0;
  for (const d of answered) if (d.startsWith(prefix)) playedThisMonth++;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
        }}>
          <Text style={{ color: C.text, ...Type.navTitle }}>{t('streak.title')}</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.close')}>
            <Text style={{ color: C.textMuted, fontSize: 22 }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: Space.screen, paddingTop: 8, gap: 12 }} showsVerticalScrollIndicator={false}>
          {/* Racha actual + récord */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 12,
            backgroundColor: C.surface, borderRadius: Radius.card, padding: 16,
            borderWidth: 1, borderColor: C.border,
          }}>
            <Text style={{ fontSize: 28 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 22 }}>
                {t('streak.days', { count: streak })}
              </Text>
              <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12 }}>
                {t('streak.best', { count: bestStreak })}
              </Text>
            </View>
          </View>

          {/* Calendario con navegación por meses */}
          <View style={{ backgroundColor: C.surface, borderRadius: Radius.card, padding: 16, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <MonthArrow label={t('streak.previousMonth')} glyph="‹" enabled={canGoBack} onPress={() => go(-1)} />
              <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16, textTransform: 'capitalize' }}>
                {monthLabel(cursor.year, cursor.month)}
              </Text>
              <MonthArrow label={t('streak.nextMonth')} glyph="›" enabled={canGoForward} onPress={() => go(1)} />
            </View>

            <StreakMonthGrid year={cursor.year} month={cursor.month} answered={answered} />

            <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12, textAlign: 'center', marginTop: 12 }}>
              {t('streak.playedThisMonth', { count: playedThisMonth })}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function MonthArrow({ label, glyph, enabled, onPress }: {
  label: string;
  glyph: string;
  enabled: boolean;
  onPress: () => void;
}) {
  const { C } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 36, height: 36, borderRadius: Radius.pill,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: C.surfaceSunk, borderWidth: 1, borderColor: C.border,
        opacity: !enabled ? 0.3 : pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 22, lineHeight: 26 }}>{glyph}</Text>
    </Pressable>
  );
}
