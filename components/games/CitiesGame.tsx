import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, BackHandler, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
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
interface Props { header?: ReactNode; onRoundFinished?: () => void }

export function CitiesGame({ header, onRoundFinished }: Props) {
  const { t, i18n } = useTranslation();
  const lang: CityLanguage = i18n.language.startsWith('en') ? 'en' : 'es';
  const { C, isDark } = useTheme();
  const { height } = useWindowDimensions();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const review = useReviewPrompt();
  const [phase, setPhase] = useState<Phase>('picker');
  const [scope, setScope] = useState<CityScope>('all');
  const [difficulty, setDifficulty] = useState<CityDifficulty>('all');
  const [records, setRecords] = useState<CityRecords>({});
  const [round, setRound] = useState<CityQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const { catalog, refreshing, error, retry } = useCities(phase === 'picker');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const finished = useRef(false);
  const generation = useRef(0);
  const clearTimer = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; }, []);
  const exit = useCallback(() => {
    clearTimer(); generation.current++; locked.current = true; setPhase('picker');
  }, [clearTimer]);
  const loadRecords = useCallback(() => { getCityRecords().then(setRecords); }, []);
  useEffect(loadRecords, [loadRecords]);
  useEffect(() => () => { clearTimer(); generation.current++; }, [clearTimer]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useFocusEffect(useCallback(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (phaseRef.current === 'picker') return false;
      exit(); return true;
    });
    return () => {
      back.remove();
      exit(); // Leaving the tab also cancels pending answers and rewards.
    };
  }, [exit]));

  const start = (nextScope: CityScope) => {
    const questions = buildCityRound(catalog ?? [], nextScope, difficulty);
    if (!questions.length) return;
    clearTimer(); generation.current++; locked.current = false; finished.current = false;
    setScope(nextScope); setRound(questions); setIndex(0); setSelected(null);
    setCorrectCount(0); setNewRecord(false); setImageReady(false); setPhase('playing');
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
    if (locked.current || !imageReady) return;
    locked.current = true;
    const nextCorrect = correctCount + (id === round[index].answer.id ? 1 : 0);
    setSelected(id); setCorrectCount(nextCorrect);
    timer.current = setTimeout(() => {
      if (index + 1 === round.length) { void finish(nextCorrect); return; }
      setIndex(n => n + 1); setSelected(null); setImageReady(false); locked.current = false;
    }, 1300);
  };
  const scopeLabel = (s: CityScope) => s === 'all' ? t('world.allWorld') : t(`world.continents.${s}`);
  const action = (label: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ paddingVertical: 12 }}>
      <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{label}</Text>
    </Pressable>
  );

  if (phase === 'picker') {
    const available = cityPool(catalog ?? [], 'all', difficulty).length;
    const recordFor = (s: CityScope, n: number) => records[cityRecordKey(s, difficulty, Math.min(CITY_ROUND_SIZE, n))];
    const best = recordFor('all', available);
    return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
        {header}
        <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 16, lineHeight: 23 }}>{t('cities.pickerSub')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {DIFFICULTIES.map(d => <Pressable key={d} onPress={() => setDifficulty(d)} accessibilityRole="button" accessibilityState={{ selected: d === difficulty }}
            style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: Radius.pill, borderWidth: 1,
              backgroundColor: d === difficulty ? C.brand : C.surface, borderColor: d === difficulty ? C.brand : C.border }}>
            <Text style={{ color: d === difficulty ? C.onBrand : C.textMuted, fontFamily: Font.bold, fontSize: 13 }}>{t(`world.difficulty.${d}`)}</Text>
          </Pressable>)}
        </View>
        {catalog === null && refreshing && <View style={{ padding: 24, gap: 12, alignItems: 'center' }}>
          <ActivityIndicator color={C.brand} /><Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t('cities.loading')}</Text>
        </View>}
        {error && <View accessibilityLiveRegion="polite" style={{ padding: 16, borderRadius: Radius.card, backgroundColor: C.surface, marginBottom: 14 }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular }}>{t(catalog?.length ? 'cities.cachedNotice' : 'cities.loadError')}</Text>
          {action(t('cities.retry'), retry)}
        </View>}
        {catalog !== null && <>
          <Pressable disabled={!available} accessibilityRole="button" accessibilityState={{ disabled: !available }} onPress={() => start('all')}>
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
              const count = cityPool(catalog, cont, difficulty).length;
              const best = recordFor(cont, count);
              return <Pressable key={cont} disabled={!count} accessibilityRole="button" accessibilityState={{ disabled: !count }} onPress={() => start(cont)}
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
    </SafeAreaView>;
  }
  if (phase === 'done') return <RoundResult correct={correctCount} total={round.length} scopeLabel={`${t('challenges.cities')} · ${scopeLabel(scope)}`}
    newRecord={newRecord} confetti={correctCount === round.length} onChangeScope={exit} onPlayAgain={() => start(scope)} />;
  const question = round[index];
  if (!question) return null;
  const stateFor = (id: string): AnswerState => selected === null ? null : id === question.answer.id ? 'correct' : id === selected ? 'wrong' : null;
  return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
      <RoundHud onExit={exit} scopeIcon={ICONS[scope]} scopeLabel={scopeLabel(scope)} index={index} total={round.length} correctCount={correctCount} />
      <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 18, marginBottom: 12 }}>{t('cities.whichCity')}</Text>
      <View style={{ width: '100%', maxWidth: Math.min(360, height * 0.34), alignSelf: 'center', marginBottom: 16 }}>
        <CityQuestionImage key={`${generation.current}:${question.answer.id}`} city={question.answer} onReady={() => setImageReady(true)} />
      </View>
      <View style={{ gap: 10 }}>
        {question.options.map((city, i) => <OptionBtn key={`${index}:${city.id}`} text={city.name[lang]} letter={LETTERS[i]}
          state={stateFor(city.id)} disabled={selected !== null || !imageReady} dimmed={selected !== null && stateFor(city.id) === null} onPress={() => answer(city.id)} />)}
      </View>
      {selected !== null && <Text accessibilityLiveRegion="polite" style={{ marginTop: 14, color: C.textBody, fontFamily: Font.bold, fontSize: 15 }}>
        {t('cities.answer', { name: question.answer.name[lang] })}
      </Text>}
    </ScrollView>
    <AdBannerSlot />
  </SafeAreaView>;
}
