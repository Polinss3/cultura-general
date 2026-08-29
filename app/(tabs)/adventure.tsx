import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion as useSystemReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AdventureMap } from '@/components/adventure/adventure-map';
import { ChapterPickerModal } from '@/components/adventure/chapter-picker-modal';
import { CoinPill } from '@/components/CoinPill';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProfile } from '@/hooks/useProfile';
import {
  ADVENTURE_LEVELS_PER_REGION,
  ADVENTURE_MAX_LEVELS,
  adventureStarsInRange,
  adventureRegionForLevel,
  type AdventureProgress,
} from '@/lib/adventure';
import { createAdventureProgressRepository } from '@/lib/adventure-progress';
import { prefetchAdventureQuestionBank } from '@/lib/adventure-questions';
import {
  bumpMissions,
  claimPendingAdventureChapterRewards,
  claimPendingAdventureRewards,
} from '@/lib/gamification';
import { feedback } from '@/lib/feedback';
import { alpha, readableOn, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

export default function AdventureScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { C, isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { guest, loading: guestLoading } = useGuest();
  const offline = useOffline();
  const { profile, refresh } = useProfile();
  const scope = guestLoading
    ? null
    : guest
      ? 'guest'
      : authLoading
        ? null
        : user?.id ?? 'local';
  const repository = useMemo(
    () => scope ? createAdventureProgressRepository(scope, {
      remoteEnabled: !!user && !guest && !offline,
    }) : null,
    [guest, offline, scope, user?.id],
  );
  const [progress, setProgress] = useState<AdventureProgress | null>(null);
  const [regionNumber, setRegionNumber] = useState(1);
  const [initialPositioned, setInitialPositioned] = useState(false);
  const [chapterPickerOpen, setChapterPickerOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const translateX = useSharedValue(0);
  const reducedMotion = useSystemReducedMotion();

  const load = useCallback(async () => {
    if (!repository) return;
    let stored = await repository.load();
    if (user && !guest && !offline) {
      const [pending, pendingChapters] = await Promise.all([
        claimPendingAdventureRewards(),
        claimPendingAdventureChapterRewards(),
      ]);
      if ((pending?.claimedCount ?? 0) > 0 || (pendingChapters?.claimedCount ?? 0) > 0) {
        const gainedCoins = (pending?.gainedCoins ?? 0) + (pendingChapters?.gainedCoins ?? 0);
        if (gainedCoins) void bumpMissions('coins_earned', gainedCoins);
        stored = await repository.load();
      }
    }
    setProgress(stored);
    setRegionNumber(adventureRegionForLevel(stored.unlockedLevel).number);
    setInitialPositioned(false);
    if (user) refresh();
  }, [guest, offline, repository, refresh, user?.id]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  useEffect(() => {
    if (offline) return;
    void prefetchAdventureQuestionBank().catch(() => {
      // La precarga es oportunista: abrir un nivel mantiene su descarga normal
      // y el siguiente acceso con red reintentara el banco completo.
    });
  }, [offline]);

  const region = adventureRegionForLevel((regionNumber - 1) * ADVENTURE_LEVELS_PER_REGION + 1);
  const maxRegion = Math.ceil(ADVENTURE_MAX_LEVELS / ADVENTURE_LEVELS_PER_REGION);
  const mapWidth = Math.max(280, Math.min(width, 620));

  const goToRegion = useCallback((nextRegion: number) => {
    const bounded = Math.max(1, Math.min(maxRegion, nextRegion));
    if (bounded === regionNumber) return;
    feedback.select();
    setRegionNumber(bounded);
    setInitialPositioned(true);
  }, [maxRegion, regionNumber]);

  const swipeGesture = useMemo(() => Gesture.Pan()
    .activeOffsetX([-22, 22])
    .failOffsetY([-14, 14])
    .onUpdate(event => {
      const beyondFirst = event.translationX > 0 && regionNumber === 1;
      const beyondLast = event.translationX < 0 && regionNumber === maxRegion;
      translateX.value = reducedMotion
        ? 0
        : event.translationX * (beyondFirst || beyondLast ? 0.22 : 1);
    })
    .onEnd(event => {
      const projectedX = event.translationX + event.velocityX * 0.18;
      if (projectedX < -72 && regionNumber < maxRegion) {
        scheduleOnRN(goToRegion, regionNumber + 1);
      } else if (projectedX > 72 && regionNumber > 1) {
        scheduleOnRN(goToRegion, regionNumber - 1);
      }
      translateX.value = reducedMotion
        ? 0
        : withSpring(0, {
          duration: 400,
          dampingRatio: 0.8,
          velocity: event.velocityX,
          reduceMotion: ReduceMotion.System,
        });
    })
    .onFinalize((_event, success) => {
      if (!success && translateX.value !== 0) {
        translateX.value = reducedMotion
          ? 0
          : withSpring(0, {
            duration: 400,
            dampingRatio: 0.8,
            reduceMotion: ReduceMotion.System,
          });
      }
    }), [goToRegion, maxRegion, reducedMotion, regionNumber, translateX]);

  const swipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const openLevel = useCallback((level: number) => {
    feedback.tap();
    router.push(`/adventure-level/${level}` as any);
  }, [router]);

  const openChapterPicker = useCallback(() => {
    feedback.tap();
    setChapterPickerOpen(true);
  }, []);

  const selectChapter = useCallback((nextRegion: number) => {
    if (nextRegion === regionNumber) feedback.select();
    else goToRegion(nextRegion);
    setChapterPickerOpen(false);
  }, [goToRegion, regionNumber]);

  useEffect(() => {
    if (!progress || initialPositioned) return;
    const timer = setTimeout(() => {
      const offsetInRegion = progress.unlockedLevel - region.startLevel;
      const visibleFromBottom = Math.max(0, offsetInRegion - 2) * 96;
      scrollRef.current?.scrollToEnd({ animated: false });
      if (visibleFromBottom > 0) {
        setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, 1900 - visibleFromBottom), animated: false }), 0);
      }
      setInitialPositioned(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialPositioned, progress, region.startLevel]);

  if (!progress) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const completed = progress.completedLevels.length;
  const regionTitle = t(`adventure.regions.${region.theme}`);
  const regionIsFuture = region.startLevel > progress.unlockedLevel;
  const regionStars = adventureStarsInRange(progress, region.startLevel, region.endLevel);
  const totalStars = adventureStarsInRange(progress, 1, ADVENTURE_MAX_LEVELS);
  const regionMaxStars = (region.endLevel - region.startLevel + 1) * 3;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[{ flex: 1 }, swipeStyle]}>
          <View style={{ paddingHorizontal: Space.screen, paddingTop: 10, paddingBottom: 10, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: C.text, ...Type.screenTitle }}>{t('adventure.title')}</Text>
            <Text style={{ color: C.textMuted, ...Type.secondary }}>
              {t('adventure.progressSummaryStars', { completed, total: ADVENTURE_MAX_LEVELS, stars: totalStars, maxStars: ADVENTURE_MAX_LEVELS * 3 })}
            </Text>
          </View>
          {!guest && (
            <CoinPill coins={profile?.coins ?? 0} onPress={() => router.push('/shop')} showPlus small />
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('adventure.openChapterPicker')}
          onPress={openChapterPicker}
          style={({ pressed }) => ({
            opacity: pressed ? 0.76 : 1,
            transform: [{ scale: pressed && !reducedMotion ? 0.985 : 1 }],
          })}
        >
          <LinearGradient
            colors={[
              alpha(region.accent, isDark ? 0.34 : 0.2),
              alpha(region.accent, isDark ? 0.16 : 0.08),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: Radius.cardLg,
              borderCurve: 'continuous',
              borderWidth: 1.5,
              borderColor: alpha(region.accent, isDark ? 0.56 : 0.36),
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              ...cardShadow(isDark),
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: Radius.row,
              backgroundColor: alpha(region.accent, isDark ? 0.3 : 0.2),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 24 }}>{region.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: readableOn(region.accent, isDark), ...Type.sectionLabel }}>
                {t('adventure.chapter', { number: region.number })}
              </Text>
              <Text style={{ color: C.text, ...Type.cardTitle }}>{regionTitle}</Text>
              <Text style={{ color: C.textMuted, ...Type.small }}>
                {t('adventure.levelRange', { start: region.startLevel, end: region.endLevel })} · {regionStars}/{regionMaxStars} ⭐
              </Text>
            </View>
            <View style={{ alignItems: 'center', gap: 2 }}>
              {regionIsFuture && <Text style={{ fontSize: 20 }}>🔒</Text>}
              <Text style={{ color: readableOn(region.accent, isDark), fontFamily: Font.black, fontSize: 20 }}>⌄</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('adventure.previousChapter')}
            disabled={regionNumber === 1}
            hitSlop={8}
            onPress={() => goToRegion(regionNumber - 1)}
            style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: regionNumber === 1 ? 0.35 : 1 }}
          >
            <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 22 }}>‹</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('adventure.openChapterPicker')}
            onPress={openChapterPicker}
            style={({ pressed }) => ({
              minWidth: 96,
              minHeight: 44,
              backgroundColor: C.surface,
              borderRadius: Radius.pill,
              borderWidth: 1,
              borderColor: C.border,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: pressed ? 0.65 : 1,
            })}
          >
            <Text style={{ color: C.textMuted, fontFamily: Font.extra, fontSize: 14, lineHeight: 18, fontVariant: ['tabular-nums'] }}>
              {regionNumber}/{maxRegion}
            </Text>
            <View
              accessibilityElementsHidden
              style={{
                width: 8,
                height: 8,
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderColor: C.textMuted,
                transform: [{ rotate: '45deg' }, { translateY: -2 }],
              }}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('adventure.nextChapter')}
            disabled={regionNumber === maxRegion}
            hitSlop={8}
            onPress={() => goToRegion(regionNumber + 1)}
            style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: regionNumber === maxRegion ? 0.35 : 1 }}
          >
            <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 22 }}>›</Text>
          </Pressable>
        </View>
          </View>

          <ScrollView
            ref={scrollRef}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}
          >
            <AdventureMap
              width={mapWidth}
              region={region}
              progress={progress}
              onLevelPress={openLevel}
            />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
      <ChapterPickerModal
        visible={chapterPickerOpen}
        currentRegion={regionNumber}
        totalRegions={maxRegion}
        unlockedLevel={progress.unlockedLevel}
        stars={progress.stars}
        onClose={() => setChapterPickerOpen(false)}
        onSelect={selectChapter}
      />
    </SafeAreaView>
  );
}
