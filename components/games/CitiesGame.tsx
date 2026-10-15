import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, BackHandler, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useChallengeBottomInset } from '@/hooks/useChallengeBottomInset';
import type { ImageRef } from 'expo-image';
import { cityImages, warmCityImages } from '@/lib/cityImages';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCityPreview } from '@/context/CityPreviewContext';
import { OptionBtn } from '@/components/OptionBtn';
import { RoundHud } from '@/components/RoundHud';
import { RoundResult } from '@/components/RoundResult';
import { CityQuestionImage } from '@/components/city-question-image';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { useCities } from '@/hooks/useCities';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { useReviewPrompt } from '@/hooks/useReviewPrompt';
import { awardProgress } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { markDailyPlayed } from '@/lib/dailyRoute';
import { showResultInterstitial } from '@/lib/ads';
import { planReviewAfterMilestone } from '@/lib/appReview';
import { getCityRecords, saveCityRecord, type CityRecords } from '@/lib/cities';
import { CITY_CONTINENTS, CITY_ROUND_SIZE, buildCityRound, cityPool, cityRecordKey,
  type CityDifficulty, type CityLanguage, type CityQuestion, type CityScope } from '@/lib/cityCatalog';
import type { AnswerState } from '@/types';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, warmGradient } from '@/constants/theme';

const ICONS = { all: '🏙️', europa: '🏰', america: '🗽', africa: '🕌', asia: '🏯', oceania: '🌉' };
const DIFFICULTIES: CityDifficulty[] = ['all', 1, 2, 3];
const LETTERS = ['A', 'B', 'C', 'D'];
type Phase = 'picker' | 'playing' | 'done';
interface Props { header?: ReactNode; onPickerChange?: (visible: boolean) => void; onRoundFinished?: () => void }

export function CitiesGame({ header, onRoundFinished, onPickerChange }: Props) {
  const { t, i18n } = useTranslation();
  const lang: CityLanguage = i18n.language.startsWith('en') ? 'en' : 'es';
  const { C, isDark } = useTheme();
  const { height, width } = useWindowDimensions();
  const router = useRouter();
  const { openPreview } = useCityPreview();
  const previewActive = useRef(false);
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const review = useReviewPrompt();
  const [phase, setLocalPhase] = useState<Phase>('picker');
  const bottomInset = useChallengeBottomInset();
  const setPhase = useCallback((next: Phase) => {
    setLocalPhase(next); onPickerChange?.(next === 'picker');
  }, [onPickerChange]);
  const [scope, setScope] = useState<CityScope>('all');
  const [difficulty, setDifficulty] = useState<CityDifficulty>('all');
  const [records, setRecords] = useState<CityRecords>({});
  const [round, setRound] = useState<CityQuestion[]>([]);
  const imageCropTop = useMemo(() => Math.max(0, Math.min(0.18, ...round.map(q => q.answer.framing!.top - 0.01))), [round]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [image, setImage] = useState<ImageRef | null>(null);
  const [preparing, setPreparing] = useState(false);
  const preparingRef = useRef(false);
  const [advancePending, setAdvancePending] = useState(false);
  const [imageError, setImageError] = useState(false);
  const retryImage = useRef<() => void>(() => {});
  const { catalog, refreshing, error, retry } = useCities(phase === 'picker');
  const playable = useMemo(() => cityPool(catalog ?? [], 'all', difficulty), [catalog, difficulty]);
  const [roundSeed, setRoundSeed] = useState(0);
  const preparedRound = useMemo(() => buildCityRound(catalog ?? [], 'all', difficulty), [catalog, difficulty, roundSeed]);
  useEffect(() => {
    if (phase !== 'playing') warmCityImages(preparedRound, 0, 3);
  }, [phase, preparedRound]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAnswer = useRef<(() => void) | null>(null);
  const answerDeadline = useRef(0);
  const answerRemaining = useRef(1300);
  const locked = useRef(false);
  const finished = useRef(false);
  const generation = useRef(0);
  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const scheduleAnswer = useCallback(() => {
    if (!pendingAnswer.current || previewActive.current) return;
    answerDeadline.current = Date.now() + answerRemaining.current;
    timer.current = setTimeout(() => {
      timer.current = null;
      const next = pendingAnswer.current;
      pendingAnswer.current = null;
      next?.();
    }, answerRemaining.current);
  }, []);
  const exit = useCallback(() => {
    pendingAnswer.current = null;
    clearTimer(); generation.current++; locked.current = true; preparingRef.current = false;
    setPreparing(false); setAdvancePending(false); setImageError(false); setPhase('picker');
  }, [clearTimer, setPhase]);
  const loadRecords = useCallback(() => { getCityRecords().then(setRecords); }, []);
  useEffect(loadRecords, [loadRecords]);
  useEffect(() => () => { clearTimer(); pendingAnswer.current = null; generation.current++; }, [clearTimer]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useFocusEffect(useCallback(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (phaseRef.current === 'picker') return false;
      exit(); return true;
    });
    return () => {
      back.remove();
      if (!previewActive.current) exit(); // A preview preserves the current round.
    };
  }, [exit]));

  const start = async (nextScope: CityScope, retryRound?: CityQuestion[]) => {
    if (preparingRef.current) return;
    const questions = retryRound ?? (nextScope === 'all' ? preparedRound : buildCityRound(catalog ?? [], nextScope, difficulty));
    if (!questions.length) return;
    clearTimer(); const run = ++generation.current;
    preparingRef.current = true; locked.current = true; finished.current = false;
    setPreparing(true); setImageError(false);
    retryImage.current = () => { void start(nextScope, questions); };
    warmCityImages(questions, 0, 5);
    try {
      const first = await Promise.all(questions.slice(0, 2).map(q => cityImages.ensure(q.answer.image_url!, true)));
      if (run !== generation.current) return;
      setScope(nextScope); setRound(questions); setImage(first[0]); setIndex(0); setSelected(null);
      setCorrectCount(0); setNewRecord(false); locked.current = false; setPhase('playing');
      if (nextScope === 'all') setRoundSeed(n => n + 1);
    } catch {
      if (run === generation.current) setImageError(true);
    } finally {
      if (run === generation.current) { preparingRef.current = false; setPreparing(false); }
    }
  };
  const advance = async (next: number) => {
    const run = generation.current;
    const url = round[next].answer.image_url!;
    setImageError(false);
    const cached = cityImages.get(url);
    if (!cached) setAdvancePending(true);
    retryImage.current = () => { void advance(next); };
    try {
      const decoded = cached ?? await cityImages.ensure(url, true);
      if (run !== generation.current) return;
      // Pixels and answer options change in the same React commit. The old city
      // remains visible while a slow network is finishing the next image.
      setImage(decoded); setIndex(next); setSelected(null); locked.current = false;
      warmCityImages(round, next + 1, 4);
    } catch {
      if (run === generation.current) setImageError(true);
    } finally {
      if (run === generation.current) setAdvancePending(false);
    }
  };
  const finish = async (correct: number) => {
    if (finished.current) return;
    finished.current = true;
    const run = generation.current;
    const isRecord = await saveCityRecord(cityRecordKey(scope, difficulty, round.length), correct);
    const askReview = await planReviewAfterMilestone('challenge', {
      qualifies: isRecord || correct >= Math.ceil(round.length * 0.8),
    });
    if (run !== generation.current) return;
    await showResultInterstitial('cities_complete', !askReview);
    if (run !== generation.current) return;
    setNewRecord(isRecord); setPhase('done'); markDailyPlayed(); loadRecords(); onRoundFinished?.();
    if (user && !guest && !offline && correct > 0) {
      const award = await awardProgress(REWARDS.cityPerCorrect.xp * correct, REWARDS.cityPerCorrect.coins * correct, true, 'cities');
      if (run !== generation.current) return;
      if (award) celebrate(award);
      if (award?.leveledUp) return;
    }
    review.schedule(askReview);
  };
  const answer = (id: string) => {
    if (locked.current || !image) return;
    locked.current = true;
    const nextCorrect = correctCount + (id === round[index].answer.id ? 1 : 0);
    setSelected(id); setCorrectCount(nextCorrect);
    pendingAnswer.current = () => {
      if (index + 1 === round.length) { void finish(nextCorrect); return; }
      void advance(index + 1);
    };
    answerRemaining.current = 1300;
    scheduleAnswer();
  };
  const enlargeImage = () => {
    if (!image || previewActive.current || advancePending || finished.current) return;
    const run = generation.current;
    previewActive.current = true;
    if (timer.current) answerRemaining.current = Math.max(0, answerDeadline.current - Date.now());
    clearTimer();
    openPreview({ city: round[index].answer, image, onDismiss: () => {
      previewActive.current = false;
      if (run === generation.current) scheduleAnswer();
    } });
    router.push('/city-preview');
  };
  const scopeLabel = (s: CityScope) => s === 'all' ? t('world.allWorld') : t(`world.continents.${s}`);
  const action = (label: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingVertical: 12 }}>
      <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{label}</Text>
    </Pressable>
  );

  if (phase === 'picker') {
    const available = playable.length;
    const recordFor = (s: CityScope, n: number) => records[cityRecordKey(s, difficulty, Math.min(CITY_ROUND_SIZE, n))];
    const best = recordFor('all', available);
    return <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustContentInsets={false} contentContainerStyle={{ paddingHorizontal: Space.screen, paddingBottom: bottomInset }}>
        {header}
        <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 16, lineHeight: 23 }}>{t('cities.pickerSub')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {DIFFICULTIES.map(d => <Pressable key={d} disabled={preparing} onPress={() => setDifficulty(d)} accessibilityRole="button" accessibilityState={{ selected: d === difficulty }}
            style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: Radius.pill, borderWidth: 1,
              backgroundColor: d === difficulty ? C.brand : C.surface, borderColor: d === difficulty ? C.brand : C.border }}>
            <Text style={{ color: d === difficulty ? C.onBrand : C.textMuted, fontFamily: Font.bold, fontSize: 13 }}>{t(`world.difficulty.${d}`)}</Text>
          </Pressable>)}
        </View>
        {preparing && <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <ActivityIndicator color={C.brand} /><Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t('cities.preparing')}</Text>
        </View>}
        {imageError && <View style={{ marginBottom: 14 }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t('cities.imageError')}</Text>
          {action(t('cities.retry'), () => retryImage.current())}
        </View>}
        {catalog === null && refreshing && <View style={{ padding: 24, gap: 12, alignItems: 'center' }}>
          <ActivityIndicator color={C.brand} /><Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t('cities.loading')}</Text>
        </View>}
        {error && <View accessibilityLiveRegion="polite" style={{ padding: 16, borderRadius: Radius.card, backgroundColor: C.surface, marginBottom: 14 }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t(catalog?.length ? 'cities.cachedNotice' : 'cities.loadError')}</Text>
          {action(t('cities.retry'), retry)}
        </View>}
        {catalog !== null && <>
          <Pressable disabled={!available || preparing} accessibilityRole="button" accessibilityState={{ disabled: !available || preparing }} onPress={() => start('all')}>
            <LinearGradient colors={warmGradient(isDark)} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }}
              style={{ borderRadius: Radius.cardLg, padding: 18, borderWidth: 1.5, borderColor: C.borderWarm, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: available ? 1 : 0.5 }}>
              <Text style={{ fontSize: 32 }}>🏙️</Text>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black }}>{t('world.allWorld')}</Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>{t('cities.count', { count: available })}{best != null ? ` · ${t('round.best', { n: best })}` : ''}</Text>
                {available > 0 && <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular }}>{t('cities.roundSize', { count: Math.min(10, available) })}</Text>}
              </View>
              <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
            </LinearGradient>
          </Pressable>
          {!available && <View style={{ marginTop: 14 }}>
            <Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t(catalog.length ? 'cities.emptyFilter' : 'cities.empty')}</Text>
            {action(t('cities.refresh'), retry)}
          </View>}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 14 }}>
            {CITY_CONTINENTS.map(cont => {
              const count = playable.filter(c => c.continent === cont).length;
              const best = recordFor(cont, count);
              return <Pressable key={cont} disabled={!count || preparing} accessibilityRole="button" accessibilityState={{ disabled: !count || preparing }} onPress={() => start(cont)}
                style={{ width: '48.5%', opacity: count ? 1 : 0.5 }}>
                <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: Radius.card, padding: 14, gap: 7, minHeight: 118 }}>
                  <Text style={{ fontSize: 24 }}>{ICONS[cont]}</Text>
                  <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>{scopeLabel(cont)}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular }}>{count ? t('cities.count', { count }) : t('cities.comingSoon')}</Text>
                  {best != null && <Text style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.bold }}>{t('round.best', { n: best })}</Text>}
                </View>
              </Pressable>;
            })}
          </View>
          {!refreshing && !error && action(t('cities.refresh'), retry)}
        </>}
      </ScrollView>
    </View>;
  }
  if (phase === 'done') return <RoundResult embedded playAgainPending={preparing} correct={correctCount} total={round.length} scopeLabel={`${t('challenges.cities')} · ${scopeLabel(scope)}`}
    playAgainError={imageError ? t('cities.imageError') : undefined}
    newRecord={newRecord} confetti={correctCount === round.length} onChangeScope={exit}
    onPlayAgain={() => imageError ? retryImage.current() : void start(scope)} />;
  const question = round[index];
  if (!question || !image) return null;
  const stateFor = (id: string): AnswerState => selected === null ? null : id === question.answer.id ? 'correct' : id === selected ? 'wrong' : null;
  return <View style={{ flex: 1, backgroundColor: C.bg }}>
    <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustContentInsets={false} contentContainerStyle={{ padding: Space.screen, paddingBottom: bottomInset }}>
      <RoundHud compact onExit={exit} scopeIcon={ICONS[scope]} scopeLabel={scopeLabel(scope)} index={index} total={round.length} correctCount={correctCount} />
      <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 18, marginBottom: 8 }}>{t('cities.whichCity')}</Text>
      <Pressable onPress={enlargeImage} disabled={advancePending} accessibilityRole="button" accessibilityLabel={t('cities.enlargeImage')} style={{ alignSelf: 'center', marginBottom: 12 }}>
        <CityQuestionImage cropTop={imageCropTop} city={question.answer} image={image} size={Math.min(360, height * 0.34, width - Space.screen * 2)} />
      </Pressable>
      <View style={{ gap: 8 }}>
        {question.options.map((city, i) => <OptionBtn compact key={`${index}:${city.id}`} text={city.name[lang]} letter={LETTERS[i]}
          state={stateFor(city.id)} disabled={selected !== null} dimmed={selected !== null && stateFor(city.id) === null} onPress={() => answer(city.id)} />)}
      </View>
      <Text accessibilityLiveRegion="polite" style={{ marginTop: 8, minHeight: 22, color: C.textBody, fontFamily: Font.bold, fontSize: 14 }}>
        {imageError ? t('cities.nextError') : advancePending ? t('cities.nextLoading') : ' '}
      </Text>
      {imageError && action(t('cities.retry'), () => retryImage.current())}
    </ScrollView>
    <AdBannerSlot />
  </View>;
}
