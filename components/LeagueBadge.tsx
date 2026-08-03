import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { divisionMeta } from '@/lib/leagues';
import { readableOn, useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  division: number;
  // 'chip' = píldora con emoji + nombre (home). 'mini' = solo emoji (filas de ranking).
  variant?: 'chip' | 'mini';
}

// Insignia de liga: emoji + color de la división. Se muestra en la home y en las
// filas de los rankings (diario, global, liga).
export function LeagueBadge({ division, variant = 'mini' }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const meta = divisionMeta(division);

  if (variant === 'mini') {
    return <Text style={{ fontSize: 14 }}>{meta.emoji}</Text>;
  }

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: C.surface,
      borderColor: C.borderStrong, borderWidth: 1,
      borderRadius: Radius.pill, paddingVertical: 5, paddingHorizontal: 12,
    }}>
      <Text style={{ fontSize: 13 }}>{meta.emoji}</Text>
      <Text style={{ color: readableOn(meta.color, isDark), fontFamily: Font.extra, fontSize: 12 }}>
        {t(`leagues.divisions.${meta.id}`)}
      </Text>
    </View>
  );
}
