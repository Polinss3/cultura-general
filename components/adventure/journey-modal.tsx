import { useMemo } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  ADVENTURE_LEVELS_PER_REGION,
  ADVENTURE_MAX_LEVELS,
  adventureChapterLocked,
  adventureRegionForLevel,
  adventureStarsInRange,
  type AdventureProgress,
  type AdventureRegion,
} from '@/lib/adventure';
import {
  ADVENTURE_TOTAL_RELICS,
  adventureRelicFor,
  adventureRelicsEarned,
} from '@/lib/adventure-relics';
import type { AdventureAccess } from '@/lib/pro';
import { ProBadge } from '@/components/ProBadge';
import { RelicBadge } from './relic-badge';
import { alpha, readableOn, useTheme } from '@/constants/colors';
import { Font, HIT_MIN, Radius, Space, Type } from '@/constants/theme';

interface Props {
  visible: boolean;
  currentRegion: number;
  totalRegions: number;
  progress: AdventureProgress;
  access: AdventureAccess;
  onClose: () => void;
  onSelect: (regionNumber: number) => void;
}

const SHEET_CONTENT_INSET = Radius.cardLg;
const RAIL_WIDTH = 46;
const NODE_SIZE = 38;

/**
 * El mapa del viaje: los diez capítulos como un solo recorrido.
 *
 * Sustituye a la rejilla de dos columnas que había antes. El mapa de juego solo
 * enseña un capítulo cada vez, así que no existía ninguna vista donde se viera
 * la escala del asunto —doscientos niveles— ni lo lejos que has llegado. Un
 * riel vertical que une los capítulos lo cuenta de un vistazo, y de paso es la
 * superficie natural donde enseñar qué hay detrás del muro de pago.
 */
export function JourneyModal({
  visible,
  currentRegion,
  totalRegions,
  progress,
  access,
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

  const completedTotal = progress.completedLevels.length;
  const starsTotal = adventureStarsInRange(progress, 1, ADVENTURE_MAX_LEVELS);
  const relicsEarned = adventureRelicsEarned(progress);

  const renderRegion = ({ item, index }: { item: AdventureRegion; index: number }) => {
    const selected = item.number === currentRegion;
    const locked = item.startLevel > progress.unlockedLevel;
    // El candado de pago manda sobre el de progreso: es el único de los dos que
    // el usuario puede resolver ahora mismo.
    const proLocked = adventureChapterLocked(item.number, access);
    const title = t(`adventure.regions.${item.theme}`);
    const relic = adventureRelicFor(item.number, progress);
    const chapterStars = adventureStarsInRange(progress, item.startLevel, item.endLevel);
    const maxChapterStars = (item.endLevel - item.startLevel + 1) * 3;
    const reached = !locked;
    const ratio = relic.total > 0 ? relic.completed / relic.total : 0;

    return (
      <View style={{ flexDirection: 'row' }}>
        {/* Riel: la línea que convierte diez tarjetas sueltas en un camino. */}
        <View style={{ width: RAIL_WIDTH, alignItems: 'center' }}>
          <View style={{
            position: 'absolute',
            top: index === 0 ? NODE_SIZE / 2 : 0,
            bottom: index === regions.length - 1 ? undefined : 0,
            height: index === regions.length - 1 ? NODE_SIZE / 2 : undefined,
            width: 2,
            backgroundColor: reached ? alpha(item.accent, 0.45) : C.border,
          }} />
          <View style={{
            width: NODE_SIZE,
            height: NODE_SIZE,
            borderRadius: NODE_SIZE / 2,
            borderWidth: selected ? 2.5 : 1.5,
            borderColor: reached ? item.accent : C.borderStrong,
            backgroundColor: reached ? alpha(item.accent, isDark ? 0.3 : 0.18) : C.surfaceSunk,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 17, opacity: reached ? 1 : 0.35 }}>{item.icon}</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t('adventure.chapter', { number: item.number })}. ${title}. ${t('adventure.levelRange', { start: item.startLevel, end: item.endLevel })}. ${t(proLocked ? 'adventure.chapterProStatus' : locked ? 'adventure.chapterLockedStatus' : 'adventure.chapterAvailableStatus')}`}
          accessibilityHint={t('adventure.chapterPickerItemHint')}
          accessibilityState={{ selected }}
          onPress={() => onSelect(item.number)}
          style={({ pressed }) => ({
            flex: 1,
            marginBottom: 12,
            opacity: pressed ? 0.72 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}
        >
          <LinearGradient
            colors={[
              alpha(item.accent, isDark ? 0.28 : 0.15),
              alpha(item.accent, isDark ? 0.11 : 0.045),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: Radius.card,
              borderCurve: 'continuous',
              borderWidth: selected ? 2.5 : 1.5,
              borderColor: alpha(item.accent, selected ? 0.82 : 0.3),
              padding: 14,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: readableOn(item.accent, isDark), ...Type.sectionLabel }}>
                  {t('adventure.chapter', { number: item.number })}
                </Text>
                <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16, lineHeight: 20 }}>
                  {title}
                </Text>
              </View>
              {proLocked ? <ProBadge /> : <RelicBadge relic={relic} size={34} />}
            </View>

            <Text numberOfLines={2} style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>
              {t(`adventure.lore.${item.theme}.intro`)}
            </Text>

            {/* Barra de progreso del capítulo. */}
            <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' }}>
              <View style={{
                width: `${Math.round(ratio * 100)}%`,
                height: '100%',
                borderRadius: 3,
                backgroundColor: item.accent,
              }} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: C.textMuted, ...Type.tiny }}>
                {t('adventure.levelRange', { start: item.startLevel, end: item.endLevel })}
                {' · '}
                {relic.completed}/{relic.total}
              </Text>
              <Text style={{ color: readableOn(item.accent, isDark), fontFamily: Font.extra, fontSize: 12 }}>
                {chapterStars}/{maxChapterStars} ⭐
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
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
          paddingTop: SHEET_CONTENT_INSET,
          paddingBottom: 16,
          paddingHorizontal: SHEET_CONTENT_INSET,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: C.text, ...Type.navTitle }}>{t('adventure.journeyTitle')}</Text>
            <Text style={{ color: C.textMuted, ...Type.secondary }}>
              {t('adventure.journeySummary', {
                completed: completedTotal,
                total: ADVENTURE_MAX_LEVELS,
                stars: starsTotal,
                relics: relicsEarned,
                maxRelics: ADVENTURE_TOTAL_RELICS,
              })}
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
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}
        />
      </SafeAreaView>
    </Modal>
  );
}
