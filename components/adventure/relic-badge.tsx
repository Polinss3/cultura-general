import { View, Text } from 'react-native';
import { alpha, useTheme } from '@/constants/colors';
import { RELIC_GRADE_COLORS, type AdventureRelic } from '@/lib/adventure-relics';

interface Props {
  relic: AdventureRelic;
  size?: number;
}

/**
 * La reliquia de un capítulo: su símbolo dentro de un aro del color del grado.
 *
 * Sin conseguir se muestra en silueta (opacidad baja y sin color) en vez de
 * ocultarse: un hueco visible en la vitrina es justo lo que da ganas de
 * volver a por él.
 */
export function RelicBadge({ relic, size = 44 }: Props) {
  const { C, isDark } = useTheme();
  // El ternario va sobre `relic.grade` y no sobre un booleano intermedio para
  // que TypeScript estreche el tipo antes de indexar la tabla de colores.
  const color = relic.grade !== 'none' ? RELIC_GRADE_COLORS[relic.grade] : C.borderStrong;
  const earned = relic.grade !== 'none';

  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: earned ? 2 : 1.5,
      borderColor: color,
      backgroundColor: earned ? alpha(color, isDark ? 0.22 : 0.14) : C.surfaceSunk,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.45, opacity: earned ? 1 : 0.28 }}>
        {relic.symbol}
      </Text>
    </View>
  );
}
