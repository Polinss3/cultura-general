import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { progressToNext } from '@/lib/leveling';
import { readableOn, useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  xp: number;
  showLabel?: boolean;
  height?: number;
}

export function XpBar({ xp, showLabel = true, height = 10 }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const p = progressToNext(xp);

  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: readableOn(p.rank.color, isDark), fontFamily: Font.bold, fontSize: 13 }}>
            {t(`ranks.${p.rank.id}`)}
          </Text>
          <Text style={{ color: C.textFaint, fontFamily: Font.bold, fontSize: 12 }}>
            {t('components.xpBar.toNext', { xp: p.toNext, level: p.level + 1 })}
          </Text>
        </View>
      )}
      <View style={{ height, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
        <LinearGradient
          colors={[p.rank.color, p.rank.color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: '100%',
            width: `${Math.max(4, p.pct * 100)}%`,
            borderRadius: Radius.pill,
          }}
        />
      </View>
    </View>
  );
}
