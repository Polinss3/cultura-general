import { View, Text } from 'react-native';
import { CAT_COLORS, CAT_ICONS, CAT_NAMES } from '@/constants/questions';
import { Category } from '@/types';

interface Props {
  cat: Category;
  small?: boolean;
}

export function CategoryBadge({ cat, small }: Props) {
  const c = CAT_COLORS[cat];
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
      <Text style={{ fontSize: small ? 11 : 12 }}>{CAT_ICONS[cat]}</Text>
      <Text style={{ color: c.text, fontSize: small ? 11 : 12, fontFamily: 'Outfit_600SemiBold' }}>
        {CAT_NAMES[cat]}
      </Text>
    </View>
  );
}
