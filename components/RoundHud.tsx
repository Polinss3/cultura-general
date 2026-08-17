import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/constants/colors';
import { Font, Radius, tint } from '@/constants/theme';

interface Props {
  onExit: () => void;
  /** Emoji y nombre del ámbito elegido (continente, época…). */
  scopeIcon: string;
  scopeLabel: string;
  /** 0-based. */
  index: number;
  total: number;
  correctCount: number;
}

/**
 * Cabecera de una ronda: salida, ámbito, barra de progreso y marcador.
 * Compartida por Banderas y Años, que juegan exactamente igual salvo por lo
 * que va dentro de la pregunta.
 */
export function RoundHud({
  onExit, scopeIcon, scopeLabel, index, total, correctCount,
}: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();

  return (
    <>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
      }}>
        <Pressable
          onPress={onExit}
          style={{
            paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.pill,
            backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
          }}
          hitSlop={8}
        >
          <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.bold }}>
            ✕ {t('round.exit')}
          </Text>
        </Pressable>
        <View style={{
          paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.pill,
          backgroundColor: tint(C.social, isDark),
          // Sin tope, un ámbito largo empuja al botón de salir fuera de pantalla.
          flexShrink: 1, marginLeft: 10,
        }}>
          <Text numberOfLines={1} style={{ color: C.social, fontSize: 13, fontFamily: Font.extra }}>
            {scopeIcon} {scopeLabel}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 14 }}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={{
            flex: 1, height: 5, borderRadius: Radius.pill,
            backgroundColor: i <= index ? C.brand : C.track,
          }} />
        ))}
      </View>

      <View style={{
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra }}>
          {index + 1} / {total}
        </Text>
        <Text style={{ color: C.correctText, fontSize: 13, fontFamily: Font.extra }}>
          {t('round.hits', { n: correctCount })}
        </Text>
      </View>
    </>
  );
}
