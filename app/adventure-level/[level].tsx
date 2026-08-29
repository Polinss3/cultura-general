import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
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
import { AdventureStars } from '@/components/adventure/adventure-stars';
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
  markAdventureStarRewarded,
  mergeAdventureProgress,
  resolveAdventureAttempt,
  type AdventureProgress,
} from '@/lib/adventure';
import { fetchAdventureLevelQuestions } from '@/lib/adventure-questions';
import { createAdventureProgressRepository } from '@/lib/adventure-progress';
import { getCurrentLang } from '@/lib/i18n';
import { shuffleQuestionForAttempt } from '@/lib/utils';
import { awardAdventureLevel, awardAdventureStar, bumpMissions } from '@/lib/gamification';
import { incrementProfileStats } from '@/lib/db';
import { REWARDS } from '@/lib/economy';
import { feedback } from '@/lib/feedback';
import { createAsyncGate } from '@/lib/async-gate';
import { captureSentryException } from '@/lib/sentry';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, inkButton, warmGradient } from '@/constants/theme';
import type { AnswerState, Question } from '@/types';

type Stage = 'preparing' | 'questions' | 'result';
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function createAttemptSessionSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

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
    () => scope ? createAdventureProgressRepository(scope, {
      remoteEnabled: !!user && !guest && !offline,
    }) : null,
    [guest, offline, scope, user?.id],
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
  const [rewardPending, setRewardPending] = useState(false);
  const [resultTimeMs, setResultTimeMs] = useState(0);
  const [resultStars, setResultStars] = useState(0);
  const [previousStars, setPreviousStars] = useState(0);
  const [starCoinsGranted, setStarCoinsGranted] = useState(0);
  const [displayElapsedMs, setDisplayElapsedMs] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(0);
  const mountedRef = useRef(true);
  const activeTimeMsRef = useRef(0);
  const questionStartedAtRef = useRef<number | null>(null);
  const attemptNumberRef = useRef(0);
  const attemptSessionSeedRef = useRef(createAttemptSessionSeed());
  const finishGateRef = useRef(createAsyncGate());

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
      ? shuffleQuestionForAttempt(
        baseQuestion,
        `adventure-v2-${level}-${questionIndex}-${attemptSessionSeedRef.current}`,
        attemptNumber,
      )
      : undefined,
    [attemptNumber, baseQuestion, level, questionIndex],
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
    setRewardPending(false);
    attemptNumberRef.current = 0;
    attemptSessionSeedRef.current = createAttemptSessionSeed();
    setAttemptNumber(0);
    activeTimeMsRef.current = 0;
    questionStartedAtRef.current = null;
  }, [level]);

  const pauseQuestionTimer = useCallback(() => {
    if (questionStartedAtRef.current === null) return;
    activeTimeMsRef.current += Date.now() - questionStartedAtRef.current;
    questionStartedAtRef.current = null;
  }, []);

  useEffect(() => {
    if (stage !== 'questions' || answered) return;
    questionStartedAtRef.current = Date.now();
    return pauseQuestionTimer;
  }, [answered, pauseQuestionTimer, questionIndex, stage]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && stage === 'questions' && !answered) {
        if (questionStartedAtRef.current === null) questionStartedAtRef.current = Date.now();
      } else {
        pauseQuestionTimer();
      }
    });
    return () => subscription.remove();
  }, [answered, pauseQuestionTimer, stage]);

  useEffect(() => {
    if (stage !== 'questions') return;
    const update = () => setDisplayElapsedMs(
      activeTimeMsRef.current + (questionStartedAtRef.current === null ? 0 : Date.now() - questionStartedAtRef.current),
    );
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  const resetQuestionState = () => {
    setSelected(null);
    setFiftyHidden([]);
    setHintShown(false);
  };

  const start = () => {
    const nextAttempt = attemptNumberRef.current + 1;
    attemptNumberRef.current = nextAttempt;
    setAttemptNumber(nextAttempt);
    setQuestionIndex(0);
    setCorrectCount(0);
    setRewardGranted(false);
    setRewardPending(false);
    setStarCoinsGranted(0);
    setDisplayElapsedMs(0);
    activeTimeMsRef.current = 0;
    questionStartedAtRef.current = null;
    resetQuestionState();
    setStage('questions');
  };

  const answer = (index: number) => {
    if (answered || !question) return;
    pauseQuestionTimer();
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
    if (!progress || !repository) return;

    await finishGateRef.current.run(async () => {
      if (mountedRef.current) setFinishing(true);
      const activeTimeMs = activeTimeMsRef.current;

      try {
        // La copia de memoria evita una regresión si AsyncStorage estuviera
        // temporalmente ilegible justo al terminar el nivel.
        const latest = mergeAdventureProgress(progress, await repository.loadLocal());
        const result = resolveAdventureAttempt(latest, level, finalCorrect, { activeTimeMs });

        // Este es el único paso crítico: confirmamos el resultado en el
        // dispositivo antes de cambiar de pantalla o contactar con Supabase.
        await repository.saveLocal(result.progress);

        if (mountedRef.current) {
          const bestStars = result.progress.stars[String(level)] ?? result.stars;
          setProgress(result.progress);
          setCorrectCount(finalCorrect);
          setRewardGranted(false);
          setRewardPending(false);
          setResultTimeMs(activeTimeMs);
          setResultStars(bestStars);
          setPreviousStars(result.previousStars);
          setStarCoinsGranted(0);
          if (bestStars > result.previousStars) feedback.reward();
          setStage('result');
        }

        if (!canUseEconomy) return;

        // Sincronización y recompensas son deliberadamente secundarias: el
        // resultado ya está guardado y el jugador nunca espera a la red.
        void (async () => {
          let saved = result.progress;
          let granted = false;
          let grantedStarCoins = 0;
          let pending = false;

          try {
            saved = mergeAdventureProgress(saved, await repository.sync(saved));

            if (result.shouldReward) {
              const award = await awardAdventureLevel(level);
              if (!award) {
                pending = true;
              } else {
                saved = markAdventureRewarded(saved, level);
                try {
                  await repository.saveLocal(saved);
                } catch (error) {
                  captureSentryException(error, { feature: 'adventure_finish', phase: 'save_level_reward_marker', level });
                }
                if (!award.alreadyClaimed) celebrate(award);
                if (award.gainedCoins) {
                  void bumpMissions('coins_earned', award.gainedCoins).catch(error => {
                    captureSentryException(error, { feature: 'adventure_finish', phase: 'level_reward_missions', level });
                  });
                }
                granted = !award.alreadyClaimed;
              }
            }

            if (result.perfect) {
              const alreadyRewarded = saved.rewardedStarMilestones[String(level)] ?? 0;
              const achievedStars = saved.stars[String(level)] ?? result.stars;
              for (const milestone of [2, 3] as const) {
                if (achievedStars < milestone || alreadyRewarded >= milestone) continue;
                const award = await awardAdventureStar(level, milestone);
                if (!award) {
                  pending = true;
                  break;
                }
                saved = markAdventureStarRewarded(saved, level, milestone);
                try {
                  await repository.saveLocal(saved);
                } catch (error) {
                  captureSentryException(error, { feature: 'adventure_finish', phase: 'save_star_reward_marker', level, milestone });
                }
                grantedStarCoins += award.gainedCoins;
                if (award.gainedCoins) {
                  void bumpMissions('coins_earned', award.gainedCoins).catch(error => {
                    captureSentryException(error, { feature: 'adventure_finish', phase: 'star_reward_missions', level, milestone });
                  });
                }
              }
            }
          } catch (error) {
            pending = true;
            captureSentryException(error, { feature: 'adventure_finish', phase: 'remote_settlement', level });
          }

          if (granted || grantedStarCoins > 0) void refreshProfile();
          if (!mountedRef.current) return;
          setProgress(current => current ? mergeAdventureProgress(current, saved) : saved);
          setRewardGranted(granted);
          setRewardPending(pending);
          setStarCoinsGranted(grantedStarCoins);
          if (granted) feedback.reward();
        })();
      } catch (error) {
        captureSentryException(error, { feature: 'adventure_finish', phase: 'persist_result', level });
        if (mountedRef.current) {
          Alert.alert(t('adventure.saveFailedTitle'), t('adventure.saveFailedMessage'));
        }
      } finally {
        if (mountedRef.current) setFinishing(false);
      }
    });
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

          <View style={{ backgroundColor: C.surface, borderRadius: Radius.row, borderWidth: 1, borderColor: C.border, padding: 14, gap: 4 }}>
            <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 15 }}>{t('adventure.starGoals')}</Text>
            <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('adventure.starGoalsDescription')}</Text>
          </View>

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
            {perfect ? (
              <AdventureStars
                count={resultStars}
                size={52}
                animated
                accessibilityLabel={t('adventure.starsEarned', { count: resultStars })}
              />
            ) : <Text accessibilityElementsHidden style={{ fontSize: 58 }}>🧭</Text>}
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.activeTime')}</Text>
              <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 17, fontVariant: ['tabular-nums'] }}>
                {formatAdventureTime(resultTimeMs)}
              </Text>
            </View>
            {perfect && progress.bestTimesMs[String(level)] && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.bestTime')}</Text>
                <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16, fontVariant: ['tabular-nums'] }}>
                  {formatAdventureTime(progress.bestTimesMs[String(level)])}
                </Text>
              </View>
            )}
            {perfect && resultStars > previousStars && (
              <Text style={{ color: C.correctText, ...Type.smallBold, textAlign: 'center' }}>
                {t('adventure.newStarRecord')}
              </Text>
            )}
            {rewardGranted && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.reward')}</Text>
                <Text style={{ color: C.coinText, fontFamily: Font.black, fontSize: 16 }}>+{REWARDS.adventureLevel.coins} 🪙</Text>
              </View>
            )}
            {starCoinsGranted > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: C.textMuted, ...Type.body }}>{t('adventure.starBonus')}</Text>
                <Text style={{ color: C.coinText, fontFamily: Font.black, fontSize: 16 }}>+{starCoinsGranted} 🪙</Text>
              </View>
            )}
            {perfect && !rewardGranted && (guest || offline) && (
              <Text style={{ color: C.textMuted, ...Type.small }}>{t('adventure.rewardNeedsAccount')}</Text>
            )}
            {rewardPending && (
              <Text style={{ color: C.textMuted, ...Type.small }}>{t('adventure.rewardPending')}</Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Text style={{ color: C.textMuted, fontFamily: Font.extra, fontSize: 13, fontVariant: ['tabular-nums'] }}>
              ⏱ {formatAdventureTime(displayElapsedMs, false)}
            </Text>
            {question.category && <CategoryBadge cat={question.category} small />}
          </View>
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

function formatAdventureTime(milliseconds: number, tenths = true): string {
  const seconds = Math.max(0, milliseconds) / 1000;
  return `${tenths ? seconds.toFixed(1) : Math.floor(seconds)} s`;
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
