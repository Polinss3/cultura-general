import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { LevelBadge } from '@/components/LevelBadge';
import { XpBar } from '@/components/XpBar';
import { rankForLevel, progressToNext } from '@/lib/leveling';
import { formatMultiplier } from '@/lib/economy';
import { getLocaleTag } from '@/lib/i18n';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';

interface Props {
  userId: string | null;
  streak: number;
  bestStreak: number;
  level: number;
  xp: number;
  coins: number;
  onLevelPress: () => void;
}

export function HomeProgressRow({ userId, streak, bestStreak, level, xp, coins, onLevelPress }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const rank = rankForLevel(level);
  const mult = formatMultiplier(streak);
  const xpProgress = progressToNext(xp);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8, marginTop: 12 }}>
      <View style={{ flex: 1 }}>
        {userId ? (
          <StreakHeatmap compact userId={userId} streak={streak} bestStreak={bestStreak} />
        ) : (
          <View style={{ flex: 1, minHeight: 70, backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 10, borderWidth: 1, borderColor: C.border, justifyContent: 'center' }}>
            <Text style={{ color: C.text, fontSize: 14, lineHeight: 18, fontFamily: Font.extra }}>🔥 {t('home.streakDays', { count: streak })}</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Pressable accessibilityRole="button"
          accessibilityLabel={`${t('components.levelUp.level', { level })}. ${t(`ranks.${rank.id}`)}. ${t('components.xpBar.toNext', { xp: xpProgress.toNext, level: xpProgress.level + 1 })}. ${coins} 🪙`}
          onPress={onLevelPress}
          style={({ pressed }) => ({
            flex: 1, minHeight: 70, padding: 10, gap: 8, justifyContent: 'space-between',
            backgroundColor: C.surface, borderRadius: Radius.cardLg, borderWidth: 1, borderColor: C.border,
            opacity: pressed ? 0.8 : 1, ...cardShadow(isDark),
          })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LevelBadge level={level} size={32} />
            <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9} style={{ color: C.coinText, fontFamily: Font.extra, fontSize: 14 }}>
                🪙 {coins.toLocaleString(getLocaleTag())}
              </Text>
              {mult && <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>{mult} XP</Text>}
            </View>
          </View>
          <XpBar xp={xp} showLabel={false} height={5} />
        </Pressable>
      </View>
    </View>
  );
}
