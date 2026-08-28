import { useMemo } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  ADVENTURE_LEVELS_PER_REGION,
  adventureRegionForLevel,
  type AdventureRegion,
} from '@/lib/adventure';
import { alpha, readableOn, useTheme } from '@/constants/colors';
import { Font, HIT_MIN, Radius, Space, Type } from '@/constants/theme';

interface Props {
  visible: boolean;
  currentRegion: number;
  totalRegions: number;
  unlockedLevel: number;
  onClose: () => void;
  onSelect: (regionNumber: number) => void;
}

export function ChapterPickerModal({
  visible,
  currentRegion,
  totalRegions,
  unlockedLevel,
  onClose,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const regions = useMemo(
    () => Array.from({ length: totalRegions }, (_, index) =>
      adventureRegionForLevel(index * ADVENTURE_LEVELS_PER_REGION + 1)),
    [totalRegions],
  );

  const renderRegion = ({ item }: { item: AdventureRegion }) => {
    const selected = item.number === currentRegion;
    const locked = item.startLevel > unlockedLevel;
    const title = t(`adventure.regions.${item.theme}`);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('adventure.chapter', { number: item.number })}. ${title}. ${t('adventure.levelRange', { start: item.startLevel, end: item.endLevel })}`}
        accessibilityHint={t('adventure.chapterPickerItemHint')}
        accessibilityState={{ selected }}
        onPress={() => onSelect(item.number)}
        style={({ pressed }) => ({
          flex: 1,
          maxWidth: '48.5%',
          minHeight: 142,
          opacity: pressed ? 0.72 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <LinearGradient
          colors={[
            alpha(item.accent, isDark ? 0.3 : 0.17),
            alpha(item.accent, isDark ? 0.13 : 0.055),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: Radius.card,
            borderCurve: 'continuous',
            borderWidth: selected ? 2.5 : 1.5,
            borderColor: alpha(item.accent, selected ? 0.82 : 0.34),
            padding: 14,
            gap: 7,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{
              width: 42,
              height: 42,
              borderRadius: Radius.icon,
              backgroundColor: alpha(item.accent, isDark ? 0.3 : 0.2),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <Text style={{ fontSize: selected ? 19 : 17 }}>
              {selected ? '✓' : locked ? '🔒' : ''}
            </Text>
          </View>

          <Text style={{ color: readableOn(item.accent, isDark), ...Type.sectionLabel }}>
            {t('adventure.chapter', { number: item.number })}
          </Text>
          <Text numberOfLines={2} style={{ color: C.text, fontFamily: Font.black, fontSize: 15, lineHeight: 19 }}>
            {title}
          </Text>
          <Text style={{ color: C.textMuted, ...Type.small }}>
            {t('adventure.levelRange', { start: item.startLevel, end: item.endLevel })}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      allowSwipeDismissal
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <View style={{
          paddingHorizontal: Space.screen,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: C.text, ...Type.navTitle }}>{t('adventure.chapterPickerTitle')}</Text>
            <Text style={{ color: C.textMuted, ...Type.secondary }}>
              {t('adventure.chapterPickerDescription')}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('adventure.closeChapterPicker')}
            hitSlop={8}
            onPress={onClose}
            style={({ pressed }) => ({
              minWidth: HIT_MIN,
              minHeight: HIT_MIN,
              paddingHorizontal: 10,
              borderRadius: Radius.pill,
              backgroundColor: C.surfaceSunk,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.65 : 1,
            })}
          >
            <Text style={{ color: C.textBody, fontFamily: Font.bold, fontSize: 14 }}>
              {t('common.close')}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={regions}
          keyExtractor={item => String(item.number)}
          renderItem={renderRegion}
          numColumns={2}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: Space.screen, paddingBottom: 40, gap: 12 }}
        />
      </SafeAreaView>
    </Modal>
  );
}
