import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { divisionMeta } from '@/lib/leagues';

interface Props {
  division: number;
  // 'chip' = píldora con emoji + nombre (home). 'mini' = solo emoji (filas de ranking).
  variant?: 'chip' | 'mini';
}

// Insignia de liga: emoji + color de la división. Se muestra en la home y en las
// filas de los rankings (diario, global, liga).
export function LeagueBadge({ division, variant = 'mini' }: Props) {
  const { t } = useTranslation();
  const meta = divisionMeta(division);

  if (variant === 'mini') {
    return <Text style={{ fontSize: 14 }}>{meta.emoji}</Text>;
  }

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: meta.color + '1f', borderColor: meta.color + '66', borderWidth: 1,
      borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10,
    }}>
      <Text style={{ fontSize: 13 }}>{meta.emoji}</Text>
      <Text style={{ color: meta.color, fontFamily: 'Outfit_700Bold', fontSize: 12 }}>
        {t(`leagues.divisions.${meta.id}`)}
      </Text>
    </View>
  );
}
