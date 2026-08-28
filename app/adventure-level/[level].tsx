import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, type PowerUpButton } from '@/components/PowerUpBar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { CoinPill } from '@/components/CoinPill';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { usePowerups } from '@/hooks/usePowerups';
import { useProfile } from '@/hooks/useProfile';
import { useProgress } from '@/context/ProgressContext';
import {
  ADVENTURE_MAX_LEVELS,
  ADVENTURE_QUESTIONS_PER_LEVEL,
  adventureRegionForLevel,
  markAdventureRewarded,
  resolveAdventureAttempt,
  type AdventureProgress,
} from '@/lib/adventure';
import { fetchAdventureLevelQuestions } from '@/lib/adventure-questions';
import { createLocalAdventureRepository } from '@/lib/adventure-progress';
import { getCurrentLang } from '@/lib/i18n';
import { shuffleQuestionSeeded } from '@/lib/utils';
import { awardAdventureLevel, bumpMissions } from '@/lib/gamification';
import { incrementProfileStats } from '@/lib/db';
import { REWARDS } from '@/lib/economy';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, inkButton, warmGradient } from '@/constants/theme';
import type { AnswerState, Question } from '@/types';

type Stage = 'preparing' | 'questions' | 'result';
const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function AdventureLevelScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();
  const parsedLevel = Number(params.level);
  const level = Number.isInteger(parsedLevel)
    ? Math.min(ADVENTURE_MAX_LEVELS, Math.max(1, parsedLevel))
    : 1;
  const { C, isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const { guest, loading: guestLoading } = useGuest();
  const offline = useOffline();
  const { profile, refresh: refreshProfile } = useProfile();
  const { celebrate } = useProgress();
  const scope = guestLoading
    ? null
    : guest
      ? 'guest'
      : authLoading
        ? null
        : user?.id ?? 'local';
  const repository = useMemo(
    () => scope ? createLocalAdventureRepository(scope) : null,
    [scope],
  );
  const region = adventureRegionForLevel(level);
  const canUseEconomy = !!user && !guest && !offline;
  const { inventory, consume, refresh: refreshPowerups } = usePowerups(canUseEconomy, user?.id);
  const [progress, setProgress] = useState<AdventureProgress | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState(false);
  const [questionsReload, setQuestionsReload] = useState(0);
  const [stage, setStage] = useState<Stage>('preparing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [fiftyHidden, setFiftyHidden] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);
  const mountedRef = useRef(true);

  useFocusEffect(useCallback(() => {
    if (!repository) return;
    mountedRef.current = true;
    repository.load().then(stored => {
      if (!mountedRef.current) return;
      if (level > stored.unlockedLevel) {
        Alert.alert(t('adventure.lockedTitle'), t('adventure.lockedMessage'));
        router.replace('/(tabs)/adventure' as any);
        return;
      }
      setProgress(stored);
    });
    refreshPowerups();
    if (user) refreshProfile();
    return () => { mountedRef.current = false; };
  }, [level, repository, refreshPowerups, refreshProfile, router, t, user?.id]));

  useEffect(() => {
    let active = true;
    setQuestionsLoading(true);
    setQuestionsError(false);
    fetchAdventureLevelQuestions(level, getCurrentLang())
      .then(loaded => {
        if (!active) return;
        setQuestions(loaded);
        setQuestionsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setQuestions([]);
        setQuestionsError(true);
        setQuestionsLoading(false);
      });
    return () => { active = false; };
  }, [i18n.resolvedLanguage, level, questionsReload]);

  const baseQuestion = questions[questionIndex];
  const question = useMemo(
    () => baseQuestion
      ? shuffleQuestionSeeded(baseQuestion, `adventure-v1-${level}-${questionIndex}`)
      : undefined,
    [baseQuestion, level, questionIndex],
  );
  const answered = selected !== null;
  const answerWasCorrect = selected === question?.ans;
  const ink = inkButton(isDark);

  useEffect(() => {
    setStage('preparing');
    setQuestionIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setFiftyHidden([]);
    setHintShown(false);
    setRewardGranted(false);
  }, [level]);

  const resetQuestionState = () => {
    setSelected(null);
    setFiftyHidden([]);
    setHintShown(false);
  };

  const start = () => {
    setQuestionIndex(0);
    setCorrectCount(0);
    setRewardGranted(false);
    resetQuestionState();
    setStage('questions');
  };

  const answer = (index: number) => {
    if (answered || !question) return;
    setSelected(index);
    const correct = index === question.ans;
    if (correct) setCorrectCount(value => value + 1);
    if (user && !guest && !offline) {
      incrementProfileStats(user.id, 1, correct ? 1 : 0);
    }
  };

  const usePowerUp = (id: string) => {
    if (!question || answered || (inventory[id] ?? 0) <= 0) return;
    if (id === 'pw_5050') {
      setFiftyHidden(question.opts
        .map((_, index) => index)
        .filter(index => index !== question.ans)
        .slice(0, 2));
    } else if (id === 'pw_hint' && question.ctx) {
      setHintShown(true);
    } else {
      return;
    }
    consume(id);
  };

  const finish = async (finalCorrect: number) => {
    if (!progress || !repository || finishing) return;
    setFinishing(true);
    setCorrectCount(finalCorrect);
    const latest = await repository.load();
    const result = resolveAdventureAttempt(latest, level, finalCorrect);
    await repository.save(result.progress);
    let saved = result.progress;
    let granted = false;

    if (result.shouldReward && canUseEconomy) {
      const award = await awardAdventureLevel(
        level,
        REWARDS.adventureLevel.xp,
        REWARDS.adventureLevel.coins,
      );
      if (award) {
        saved = markAdventureRewarded(saved, level);
        await repository.save(saved);
        celebrate(award);
        feedback.reward();
        if (award.gainedCoins) bumpMissions('coins_earned', award.gainedCoins);
        refreshProfile();
        granted = true;
      }
    }

    if (mountedRef.current) {
      setProgress(saved);
      setRewardGranted(granted);
      setFinishing(false);
      setStage('result');
    }
  };

  const next = () => {
    if (!answered || !question) return;
    if (questionIndex === ADVENTURE_QUESTIONS_PER_LEVEL - 1) {
      finish(correctCount);
      return;
    }
    setQuestionIndex(value => value + 1);
    resetQuestionState();
  };

  if (!progress || questionsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={region.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (questionsError || !question) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, padding: Space.screen, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Text style={{ fontSize: 42 }}>🧭</Text>
          <Text style={{ color: C.text, ...Type.cardTitle, textAlign: 'center' }}>{t('adventure.questionsUnavailableTitle')}</Text>
          <Text style={{ color: C.textMuted, ...Type.secondary, textAlign: 'center' }}>{t('adventure.questionsUnavailableMessage')}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setQuestionsReload(value => value + 1)}
            style={({ pressed }) => ({ minHeight: 50, minWidth: 180, borderRadius: Radius.row, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}
          >
            <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 16 }}>{t('common.retry')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)/adventure' as any)} hitSlop={8}>
            <Text style={{ color: C.textMuted, fontFamily: Font.bold, fontSize: 15 }}>{t('adventure.backToMap')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const powerUps: PowerUpButton[] = [
    { id: 'pw_5050', icon: '✂️', label: '50/50', count: inventory.pw_5050 ?? 0 },
    { id: 'pw_hint', icon: '💡', label: t('adventure.hint'), count: inventory.pw_hint ?? 0 },
  ];

  if (stage === 'preparing') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: Space.screen, gap: 18, paddingBottom: 36 }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7 }}
          >
            <Text style={{ color: C.textMuted, fontSize: 21 }}>←</Text>
            <Text style={{ color: C.textMuted, fontFamily: Font.bold, fontSize: 15 }}>{t('adventure.backToMap')}</Text>
          </Pressable>

          <LinearGradient
            colors={warmGradient(isDark)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radius.cardLg, borderWidth: 1.5, borderColor: C.borderWarm, padding: 22, gap: 14 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: C.brandDeep, ...Type.sectionLabel }}>{t('adventure.chapter', { number: region.number })}</Text>
                <Text style={{ color: C.text, fontSize: 32, fontFamily: Font.black }}>{t('adventure.level', { level })}</Text>
                <Text style={{ color: C.textMuted, ...Type.secondary }}>{t(`adventure.regions.${region.theme}`)}</Text>
              </View>
              {!guest && <CoinPill coins={profile?.coins ?? 0} onPress={() => router.push('/shop')} showPlus small />}
            </View>
            <View style={{ height: 1, backgroundColor: C.borderWarm }} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <PrepStat icon="🧠" value="10" label={t('adventure.questions')} />
              <PrepStat icon="🎯" value="10/10" label={t('adventure.toUnlock')} />
              <PrepStat icon="🪙" value={`+${REWARDS.adventureLevel.coins}`} label={t('adventure.firstWin')} />
            </View>
          </LinearGradient>

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, ...Type.cardTitle }}>{t('adventure.prepareTitle')}</Text>
                <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('adventure.prepareDescription')}</Text>
              </View>
              {!guest && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push('/shop')}
                  hitSlop={8}
                  style={{ minHeight: 44, justifyContent: 'center' }}
                >
                  <Text style={{ color: C.brandDeep, fontFamily: Font.extra, fontSize: 14 }}>{t('adventure.openShop')}</Text>
                </Pressable>
              )}
            </View>
            {canUseEconomy && powerUps.some(item => item.count > 0) ? (
              <PowerUpBar items={powerUps} onUse={() => {}} disabled />
            ) : (
              <View style={{ backgroundColor: C.surface, borderRadius: Radius.row, borderWidth: 1, borderColor: C.border, padding: 14 }}>
                <Text style={{ color: C.textMuted, ...Type.secondary }}>
                  {guest || offline ? t('adventure.helpersAccountOnly') : t('adventure.noHelpers')}
                </Text>
              </View>
            )}
          </View>

          <Pressable accessibilityRole="button" onPress={start}>
            {({ pressed }) => (
              <View style={{
                minHeight: 54,
                borderRadius: Radius.row,
                backgroundColor: ink.backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.75 : 1,
              }}>
                <Text style={{ color: ink.color, fontFamily: Font.extra, fontSize: 17 }}>{t('adventure.startLevel')}</Text>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === 'result') {
    const perfect = correctCount === ADVENTURE_QUESTIONS_PER_LEVEL;
    const canGoNext = perfect && level < ADVENTURE_MAX_LEVELS;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: Space.screen, gap: 18 }}>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Text accessibilityElementsHidden style={{ fontSize: 58 }}>{perfect ? '🌟' : '🧭'}</Text>
            <Text style={{ color: C.text, fontSize: 28, fontFamily: Font.black, textAlign: 'center' }}>
              {t(perfect ? 'adventure.resultPerfect' : 'adventure.resultRetry')}
            </Text>
            <Text style={{ color: C.textMuted, ...Type.bodyRegular, textAlign: 'center' }}>
              {t(perfect ? 'adventure.resultPerfectDescription' : 'adventure.resultRetryDescription', {
                correct: correctCount,
                total: ADVENTURE_QUESTIONS_PER_LEVEL,
              })}
            </Text>
          </View>

          <View style={{ backgroundColor: C.surface, borderRadius: Radius.cardLg, borderWidth: 1, borderColor: C.border, padding: 18, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.score')}</Text>
              <Text style={{ color: perfect ? C.correctText : C.text, fontFamily: Font.black, fontSize: 17, fontVariant: ['tabular-nums'] }}>
                {correctCount} / {ADVENTURE_QUESTIONS_PER_LEVEL}
              </Text>
            </View>
            {rewardGranted && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.reward')}</Text>
                <Text style={{ color: C.coinText, fontFamily: Font.black, fontSize: 16 }}>+{REWARDS.adventureLevel.coins} 🪙</Text>
              </View>
            )}
            {perfect && !rewardGranted && (guest || offline) && (
              <Text style={{ color: C.textMuted, ...Type.small }}>{t('adventure.rewardNeedsAccount')}</Text>
            )}
          </View>

          <View style={{ gap: 10 }}>
            {canGoNext && (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace(`/adventure-level/${level + 1}` as any)}
                style={({ pressed }) => ({ minHeight: 54, borderRadius: Radius.row, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.75 : 1 })}
              >
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 17 }}>{t('adventure.nextLevel')}</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={perfect ? () => router.replace('/(tabs)/adventure' as any) : start}
              style={({ pressed }) => ({ minHeight: 52, borderRadius: Radius.row, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
            >
              <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16 }}>
                {t(perfect ? 'adventure.backToMap' : 'adventure.retryLevel')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const getState = (index: number): AnswerState => {
    if (!answered) return null;
    if (index === question.ans) return 'correct';
    if (index === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: Space.screen, gap: 14, paddingBottom: 36 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={() => router.back()} hitSlop={8} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.textMuted, fontSize: 22 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1, height: 7, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
            <View style={{ width: `${((questionIndex + 1) / ADVENTURE_QUESTIONS_PER_LEVEL) * 100}%`, height: '100%', backgroundColor: region.accent }} />
          </View>
          <Text style={{ color: C.textFaint, fontFamily: Font.extra, fontSize: 13, fontVariant: ['tabular-nums'] }}>
            {questionIndex + 1}/{ADVENTURE_QUESTIONS_PER_LEVEL}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <Text style={{ color: C.textMuted, ...Type.smallBold }}>{t('adventure.level', { level })}</Text>
          {question.category && <CategoryBadge cat={question.category} small />}
        </View>

        <Text style={{ color: C.text, ...Type.question }}>{question.q}</Text>

        <View style={{ gap: 11 }}>
          {question.opts.map((option, index) => fiftyHidden.includes(index) ? (
            <View key={index} style={{ minHeight: 60, borderRadius: 18, backgroundColor: C.surfaceSunk, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', opacity: 0.55 }}>
              <Text style={{ color: C.textFaint, fontFamily: Font.semi, fontSize: 16 }}>—</Text>
            </View>
          ) : (
            <OptionBtn
              key={index}
              text={option}
              letter={LETTERS[index]}
              state={getState(index)}
              dimmed={answered && getState(index) === null}
              onPress={() => answer(index)}
            />
          ))}
        </View>

        {hintShown && !answered && question.ctx && (
          <View style={{ padding: 15, borderRadius: Radius.row, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.borderWarm, gap: 5 }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 14 }}>{t('adventure.hint')}</Text>
            <Text style={{ color: C.textBody, ...Type.secondary }}>{question.ctx}</Text>
          </View>
        )}

        {canUseEconomy && !answered && powerUps.some(item => item.count > 0) && (
          <View style={{ gap: 8 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel }}>{t('common.yourHelpers')}</Text>
            <PowerUpBar items={powerUps} onUse={usePowerUp} />
          </View>
        )}

        {answered && (
          <View style={{ gap: 10 }}>
            {!answerWasCorrect && question.ctx && (
              <View style={{ padding: 15, borderRadius: Radius.row, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, gap: 5 }}>
                <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 14 }}>{t('adventure.explanation')}</Text>
                <Text style={{ color: C.textBody, ...Type.secondary }}>{question.ctx}</Text>
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              disabled={finishing}
              onPress={next}
              style={({ pressed }) => ({ minHeight: 54, borderRadius: Radius.row, backgroundColor: answerWasCorrect ? C.correct : C.brand, alignItems: 'center', justifyContent: 'center', opacity: pressed || finishing ? 0.7 : 1 })}
            >
              {finishing ? (
                <ActivityIndicator color={C.onBrand} />
              ) : (
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 16 }}>
                  {questionIndex === ADVENTURE_QUESTIONS_PER_LEVEL - 1 ? t('adventure.finishLevel') : t('common.next')}
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PrepStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  const { C } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 19 }}>{icon}</Text>
      <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16, fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text maxFontSizeMultiplier={1.4} style={{ color: C.textMuted, fontFamily: Font.bold, fontSize: 11, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}
