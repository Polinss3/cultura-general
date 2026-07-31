import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CAT_COLORS, CAT_ICONS, catTint } from '@/constants/questions';
import { Category, CategoryMeta } from '@/types';
import { useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  cat: Category | string;
  small?: boolean;
}

const FALLBACK_META: CategoryMeta = {
  accent: '#888888',
  bg: '#1a1a1a',
  text: '#cccccc',
  bgLight: '#EFE9E1',
  textLight: '#5C554D',
};

export function CategoryBadge({ cat, small }: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const meta = CAT_COLORS[cat as Category] ?? FALLBACK_META;
  const c = catTint(meta, isDark);
  const icon = CAT_ICONS[cat as Category] ?? '❓';
  const name = t(`categories.${cat}`, { defaultValue: String(cat) });

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: c.bg,
      paddingVertical: small ? 6 : 7,
      paddingHorizontal: small ? 12 : 14,
      borderRadius: Radius.pill,
      alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize: small ? 12 : 13 }}>{icon}</Text>
      <Text style={{ color: c.text, fontSize: small ? 12 : 13, fontFamily: Font.extra }}>
        {name}
      </Text>
    </View>
  );
}
