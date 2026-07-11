import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CAT_COLORS, CAT_ICONS } from '@/constants/questions';
import { Category } from '@/types';

interface Props {
  cat: Category | string;
  small?: boolean;
}

const FALLBACK_META = { bg: '#1a1a1a', accent: '#888888', text: '#cccccc' };

export function CategoryBadge({ cat, small }: Props) {
  const { t } = useTranslation();
  const c = CAT_COLORS[cat as Category] ?? FALLBACK_META;
  const icon = CAT_ICONS[cat as Category] ?? '❓';
  const name = t(`categories.${cat}`, { defaultValue: String(cat) });
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: c.bg,
      paddingVertical: small ? 3 : 4,
      paddingHorizontal: small ? 8 : 10,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: c.accent + '30',
      alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize: small ? 11 : 12 }}>{icon}</Text>
      <Text style={{ color: c.text, fontSize: small ? 11 : 12, fontFamily: 'Outfit_600SemiBold' }}>
        {name}
      </Text>
    </View>
  );
}
