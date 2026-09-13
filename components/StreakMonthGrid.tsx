import { View, Text } from 'react-native';
import { getLocaleTag } from '@/lib/i18n';
import { useTheme } from '@/constants/colors';
import { Font } from '@/constants/theme';

interface Props {
  /** Año y mes (0-11) en UTC, coherente con cómo el resto de la app calcula "hoy". */
  year: number;
  month: number;
  /** Fechas `YYYY-MM-DD` con la pregunta del día respondida. */
  answered: Set<string>;
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** `YYYY-MM-DD` de hoy en UTC. */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Primer día del mes como `YYYY-MM-01`. */
export function monthKey(year: number, month: number): string {
  return `${year}-${pad(month + 1)}-01`;
}

/** Nombre del mes con año, en el idioma de la app ("septiembre de 2026"). */
export function monthLabel(year: number, month: number): string {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString(getLocaleTag(), {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

/**
 * Rejilla de un mes: cabecera Lun..Dom y una celda por día. Marca los días
 * jugados, hoy con borde y atenúa el futuro. La comparten la tarjeta de racha
 * del perfil y la sheet que permite recorrer meses anteriores.
 */
export function StreakMonthGrid({ year, month, answered }: Props) {
  const { C } = useTheme();
  const today = todayKey();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // Lun=0

  // Etiquetas de días (Lun..Dom) según idioma, formato estrecho.
  const weekdayFmt = new Intl.DateTimeFormat(getLocaleTag(), { weekday: 'narrow', timeZone: 'UTC' });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    // 2024-01-01 fue lunes; recorremos Lun..Dom.
    weekdayFmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );

  // Celdas: huecos iniciales + días del mes.
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {weekdays.map((w, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', color: C.textFaint, fontFamily: Font.semi, fontSize: 12, textTransform: 'uppercase' }}>
            {w}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d === null) return <View key={`e${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isAnswered = answered.has(dateStr);
          const isToday = dateStr === today;
          const isFuture = dateStr > today;
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
    </View>
  );
}
