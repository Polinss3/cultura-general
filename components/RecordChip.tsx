import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

/**
 * Récord de una zona en las rejillas de Retos. Va en la esquina, junto al
 * icono: como línea propia hacía más alta solo la tarjeta que tenía récord y
 * descuadraba la rejilla.
 */
export function RecordChip({ n }: { n: number }) {
  const { t } = useTranslation();
  const { C } = useTheme();
  return (
    <View style={{ backgroundColor: C.brandTint, borderRadius: Radius.pill, paddingVertical: 3, paddingHorizontal: 8, flexShrink: 1 }}>
      <Text numberOfLines={1} style={{ color: C.brandDeep, fontSize: 11, fontFamily: Font.bold }}>
        {t('round.best', { n })}
      </Text>
    </View>
  );
}
