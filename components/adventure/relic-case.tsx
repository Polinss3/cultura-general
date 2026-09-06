import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RelicBadge } from './relic-badge';
import { ProBadge } from '@/components/ProBadge';
import { adventureChapterLocked, type AdventureProgress } from '@/lib/adventure';
import {
  ADVENTURE_TOTAL_RELICS,
  RELIC_GRADE_COLORS,
  adventureRelics,
  adventureRelicsEarned,
} from '@/lib/adventure-relics';
import type { AdventureAccess } from '@/lib/pro';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type } from '@/constants/theme';

interface Props {
  visible: boolean;
  progress: AdventureProgress;
  access: AdventureAccess;
  onClose: () => void;
}

/** La vitrina: las diez reliquias, conseguidas y por conseguir. */
export function RelicCaseModal({ visible, progress, access, onClose }: Props) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const relics = adventureRelics(progress);
  const earned = adventureRelicsEarned(progress);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, ...Type.navTitle }}>{t('adventure.relicCase.title')}</Text>
            <Text style={{ color: C.textMuted, ...Type.small, marginTop: 2 }}>
              {t('adventure.relicCase.progress', { earned, total: ADVENTURE_TOTAL_RELICS })}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
            <Text style={{ color: C.textMuted, fontSize: 22 }}>✕</Text>
          </Pressable>
        </View>

        <FlatList
          data={relics}
          keyExtractor={relic => String(relic.chapter)}
          contentContainerStyle={{ padding: Space.screen, gap: 10 }}
          renderItem={({ item: relic }) => {
            const locked = adventureChapterLocked(relic.chapter, access);
            const earnedRelic = relic.grade !== 'none';

            return (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                backgroundColor: C.surface, borderRadius: Radius.card,
                borderWidth: 1, borderColor: C.border, padding: 14,
              }}>
                <RelicBadge relic={relic} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
                    {earnedRelic ? t(`adventure.relics.${relic.id}`) : t('adventure.relicCase.unknown')}
                  </Text>
                  <Text style={{ color: C.textMuted, ...Type.small, marginTop: 2 }}>
                    {t('adventure.chapter', { number: relic.chapter })} · {relic.stars}/{relic.maxStars} ⭐
                  </Text>
                </View>
                {locked ? (
                  <ProBadge />
                ) : relic.grade !== 'none' ? (
                  <Text style={{
                    color: RELIC_GRADE_COLORS[relic.grade],
                    fontFamily: Font.extra, fontSize: 12, letterSpacing: 0.6,
                  }}>
                    {t(`adventure.relicCase.grades.${relic.grade}`).toUpperCase()}
                  </Text>
                ) : (
                  <Text style={{ color: C.textFaint, ...Type.tiny }}>
                    {relic.completed}/{relic.total}
                  </Text>
                )}
              </View>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
