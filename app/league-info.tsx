import { ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DIVISIONS } from '@/lib/leagues';
import { readableOn, useTheme } from '@/constants/colors';
import { Font, Radius, Space } from '@/constants/theme';
import { SheetHeader } from '@/components/SheetHeader';

export default function LeagueInfoSheet() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ size?: string; promote?: string; relegate?: string }>();
  const size = Math.min(30, Math.max(1, Number(params.size) || 30));
  const promote = Math.min(7, Math.max(1, Number(params.promote) || 7));
  const relegate = Math.min(5, Math.max(0, Number(params.relegate) || 0));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: Space.screen, paddingBottom: 36 }} stickyHeaderIndices={[0]}>
      <SheetHeader title={t('leagues.how.title')} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8, marginBottom: 22 }}>
        {DIVISIONS.map(d => (
          <View key={d.id} style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 28 }}>{d.emoji}</Text>
            <Text style={{ color: readableOn(d.color, isDark), fontFamily: Font.bold, fontSize: 13 }}>
              {t(`leagues.divisions.${d.id}`)}
            </Text>
          </View>
        ))}
      </View>
      {[
        { icon: '🎮', text: t('leagues.how.compete') },
        { icon: '👥', text: t('leagues.how.groups', { size }) },
        { icon: '⬆️', text: t('leagues.how.promote', { count: promote }) },
        ...(relegate > 0 ? [{ icon: '⬇️', text: t('leagues.how.relegate', { count: relegate }) }] : []),
        { icon: '🪙', text: t('leagues.how.rewards') },
        { icon: '🏅', text: t('leagues.how.badge') },
      ].map(item => (
        <View key={item.icon} style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 19 }}>{item.icon}</Text>
          <Text style={{ flex: 1, color: C.textBody, fontFamily: Font.regular, fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
        </View>
      ))}
      <Pressable accessibilityRole="button" onPress={() => router.back()}
        style={{ marginTop: 8, backgroundColor: C.brand, borderRadius: Radius.row, minHeight: 48, padding: 12, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 16 }}>{t('leagues.how.close')}</Text>
      </Pressable>
    </ScrollView>
  );
}
