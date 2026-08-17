import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { ScrollView, View, Text, ActivityIndicator, Pressable, Alert, Share, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { LeagueBadge } from '@/components/LeagueBadge';
import { UserName } from '@/components/UserName';
import { Pop } from '@/components/Pop';
import { DailyRoute } from '@/components/DailyRoute';
import { usePowerups } from '@/hooks/usePowerups';
import { resolveCosmetics } from '@/lib/cosmetics';
import { Confetti } from '@/components/Confetti';
import { GuestGate } from '@/components/GuestGate';
import { OfflineNotice } from '@/components/OfflineNotice';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';
import { showResultInterstitial } from '@/lib/ads';
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import { planReviewAfterDailyCompletion, REVIEW_PROMPT_DELAY_MS } from '@/lib/appReview';
import { noteReviewBlocker } from '@/lib/reviewGate';
import {
  fetchOrAssignDailyQuestion,
  checkDailyAnswered,
  saveDailyAnswer,
  fetchDailyRanking,
  fetchFriendDailyRanking,
  reportQuestion,
  RankRow,
} from '@/lib/db';
import { shuffleQuestionSeeded, pickRandomFresh, ShuffledQuestion } from '@/lib/utils';
import { AnswerState, Question } from '@/types';
import { useTheme, type Palette } from '@/constants/colors';
import {
  Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton,
} from '@/constants/theme';

type Phase = 'loading' | 'question' | 'ranking';
type RankingTab = 'daily' | 'league' | 'global' | 'friends';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const MEDALS = ['🥇', '🥈', '🥉'];

const getRankingTabs = (t: TFunction): { key: RankingTab; label: string }[] => [
  { key: 'daily',   label: t('daily.tabToday') },
  { key: 'league',  label: t('daily.tabLeague') },
  { key: 'global',  label: t('daily.tabGlobal') },
  { key: 'friends', label: t('daily.tabFriends') },
];

function timeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function RankRowView({
  position, name, sub, value, isMe, badge, leagueDivision, cosmetics, C, isDark,
}: {
  position: number;
  name: string;
  sub: string;
  value: string;
  isMe: boolean;
  badge?: { kind: 'correct' | 'wrong'; text: string };
  leagueDivision?: number;
  cosmetics?: Record<string, string> | null;
  C: Palette;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  const cos = resolveCosmetics(cosmetics);

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: isMe ? C.brandTint : C.surface,
      borderWidth: isMe ? 1.5 : 1,
      borderColor: isMe ? C.borderWarm : C.border,
      borderRadius: 18, paddingVertical: 13, paddingHorizontal: 14,
    }}>
      <Text style={{
        width: 26, fontSize: position < 3 ? 17 : 14, fontFamily: Font.black, textAlign: 'center',
        color: C.textFaint,
      }}>
        {position < 3 ? MEDALS[position] : `${position + 1}`}
      </Text>
      <View style={cos.frameColor ? { borderWidth: 2, borderColor: cos.frameColor, borderRadius: 15, padding: 1.5 } : undefined}>
        {isMe ? (
          <LinearGradient
            colors={[C.streak, C.brand]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: C.onBrand, fontSize: 15, fontFamily: Font.black }}>
              {name[0]?.toUpperCase() ?? '?'}
            </Text>
          </LinearGradient>
        ) : (
          <View style={{
            width: 38, height: 38, borderRadius: 13, backgroundColor: C.track,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.black }}>
              {name[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <UserName
          name={name}
          cosmetics={cos}
          suffix={isMe ? t('daily.you') : ''}
          color={isMe ? C.brandDeep : C.text}
          fontFamily={isMe ? Font.black : Font.bold}
          fontSize={15}
        />
        <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular }}>{sub}</Text>
      </View>
      {leagueDivision != null && (
        <View style={{ marginRight: 4 }}>
          <LeagueBadge division={leagueDivision} variant="mini" />
        </View>
      )}
      {badge && (
        <View style={{
          paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9,
          backgroundColor: badge.kind === 'correct' ? C.correctTint : C.wrongTint, marginRight: 6,
        }}>
          <Text style={{
            color: badge.kind === 'correct' ? C.correctText : C.wrongText,
            fontSize: 12, fontFamily: Font.black,
          }}>
            {badge.text}
          </Text>
        </View>
      )}
      <Text style={{ color: C.text, fontFamily: isMe ? Font.black : Font.extra, fontSize: 15 }}>{value}</Text>
    </View>
  );
}

function formatTime(ms: number | null): string {
  if (ms === null || ms < 0) return '—';
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(s < 10 ? 1 : 0)}s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s - m * 60);
  return `${m}m ${rs}s`;
}

export default function DailyScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();

  if (offline) {
    return (
      <OfflineNotice
        title={t('daily.offlineTitle')}
        description={t('daily.offlineDesc')}
      />
    );
  }

  if (guest) {
    return (
      <GuestGate
        icon="🏆"
        title={t('daily.gateTitle')}
        description={t('daily.gateDesc')}
      />
    );
  }

  return <DailyContent user={user} />;
}

function DailyContent({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { celebrate } = useProgress();
  const { showToast } = useToast();
  const { profile, refresh: refreshProfile } = useProfile();
  const { C, isDark } = useTheme();
  const [phase, setPhase] = useState<Phase>('loading');
  const [question, setQuestion] = useState<ShuffledQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const reported = useRef(false);

  // Power-ups usables antes de responder (50/50 y pista).
  const { inventory, consume } = usePowerups(!!user, user?.id);
  const [fiftyHidden, setFiftyHidden] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);

  const [rankingTab, setRankingTab] = useState<RankingTab>('daily');
  const [dailyRanking, setDailyRanking] = useState<RankRow[]>([]);
  const [friendRanking, setFriendRanking] = useState<RankRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const loadedTabs = useRef(new Set<RankingTab>());
  const questionStartAt = useRef<number>(0);
  const reviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingReview = useCallback(() => {
    if (!reviewTimer.current) return;
    clearTimeout(reviewTimer.current);
    reviewTimer.current = null;
  }, []);

  // Si el usuario se va de la pestaña antes de que salte el diálogo, se cancela:
  // pedir la valoración fuera de este momento gastaría uno de los pocos intentos
  // que iOS concede al año.
  useFocusEffect(useCallback(() => cancelPendingReview, [cancelPendingReview]));

  useEffect(() => {
    if (!user) return;
    init();
    // Recargar (pregunta + rankings) al cambiar de idioma.
  }, [user?.id, i18n.language]);

  // Lazy-load ranking tabs
  useEffect(() => {
    if (phase !== 'ranking' || !user || loadedTabs.current.has(rankingTab)) return;
    loadedTabs.current.add(rankingTab);

    if (rankingTab === 'friends') {
      fetchFriendDailyRanking(user.id).then(setFriendRanking);
    }
  }, [rankingTab, phase]);

  // Recarga por gesto de los rankings de esta pantalla. Se refrescan los dos
  // que viven aquí, no solo el visible: cambiar de pestaña después no vuelve a
  // pedir datos (`loadedTabs` ya los da por cargados).
  const onRefreshRanking = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await Promise.all([
      fetchDailyRanking().then(setDailyRanking),
      fetchFriendDailyRanking(user.id).then(setFriendRanking),
    ]);
    loadedTabs.current.add('friends');
    setRefreshing(false);
  }, [user?.id]);

  const init = async () => {
    setPhase('loading');
    reported.current = false;
    const [q, already] = await Promise.all([
      fetchOrAssignDailyQuestion(),
      user ? checkDailyAnswered(user.id) : Promise.resolve({ answered: false, score: 0 }),
    ]);
    if (q) {
      // Seed per-user-per-day so the order is stable on refresh but changes daily.
      const today = new Date().toISOString().slice(0, 10);
      setQuestion(shuffleQuestionSeeded(q, `${user?.id ?? 'anon'}-${today}`));
    } else {
      setQuestion(null);
    }

    if (already.answered) {
      setIsCorrect(already.score > 0);
      const r = await fetchDailyRanking();
      setDailyRanking(r);
      loadedTabs.current.add('daily');
      setPhase('ranking');
    } else {
      questionStartAt.current = Date.now();
      setPhase('question');
    }
  };

  const usePowerUp = (id: string) => {
    if (selected !== null || (inventory[id] ?? 0) <= 0) return;
    if (id === 'pw_5050' && question) {
      const wrong = question.opts.map((_, idx) => idx).filter(idx => idx !== question.ans);
      setFiftyHidden(pickRandomFresh(wrong, [], () => undefined, 2));
    } else if (id === 'pw_hint') {
      setHintShown(true);
    } else {
      return;
    }
    consume(id);
  };

  const handle = async (i: number) => {
    if (selected !== null || !question || !user) return;
    const elapsedMs = Math.max(0, Date.now() - questionStartAt.current);
    setSelected(i);
    const correct = i === question.ans;
    setIsCorrect(correct);
    if (correct) setShowConfetti(true);

    setTimeout(async () => {
      setPhase('loading');
      let award = null;
      if (question.id) {
        // Translate display-index back to original (DB) index for consistency
        const originalIdx = question.originalIndexMap[i] ?? i;
        try {
          award = await saveDailyAnswer(user.id, question.id, originalIdx, correct, elapsedMs);
        } catch {
          // No llegó a guardarse: se vuelve a la pregunta en vez de enseñar un
          // resultado que el servidor no tiene. `questionStartAt` NO se
          // reinicia a propósito — el tiempo sigue corriendo desde que se vio
          // la pregunta, así que un fallo de red no puede convertirse en un
          // tiempo mejor ahora que la respuesta ya está a la vista.
          setShowConfetti(false);
          setSelected(null);
          setPhase('question');
          showToast({ type: 'error', message: t('daily.saveFailed') });
          return;
        }
        celebrate(award);
      }
      const r = await fetchDailyRanking();
      setDailyRanking(r);
      loadedTabs.current = new Set(['daily']);
      setRankingTab('daily');
      setPhase('ranking');
      logAppsFlyerEvent('cg_daily_quiz_completed', {
        correct,
        response_time_ms: elapsedMs,
      });

      // Valoración en tienda: se decide ahora (para no lanzar un intersticial
      // que taparía el diálogo del sistema) pero se pide más tarde, con la
      // pantalla de ranking ya montada y quieta.
      const askReview = await planReviewAfterDailyCompletion(user.id, {
        correct,
        streak: r.find(row => row.userId === user.id)?.streak,
        leveledUp: award?.leveledUp,
      });
      showResultInterstitial('daily_answered', !askReview);
      if (askReview) {
        cancelPendingReview();
        reviewTimer.current = setTimeout(() => {
          reviewTimer.current = null;
          askReview();
        }, REVIEW_PROMPT_DELAY_MS);
      }
    }, 1400);
  };

  const handleShare = async () => {
    const streakLine = dailyRanking.find(r => r.userId === user?.id);
    const streak = streakLine?.streak ?? 0;
    const appName = t('common.appName');
    const msg = isCorrect
      ? t('daily.shareWin', { appName, days: t('common.days', { count: streak }) })
      : t('daily.shareLose', { appName });
    try {
      await Share.share({ message: msg, title: appName });
    } catch {
      // user cancelled, ignore
    }
  };

  const handleReport = () => {
    if (!user || !question?.id || reported.current) return;
    Alert.alert(
      t('learn.reportTitle'),
      undefined,
      [
        { text: t('learn.reportIncorrect'), onPress: () => doReport('incorrect') },
        { text: t('learn.reportConfusing'), onPress: () => doReport('confusing') },
        { text: t('daily.reportDuplicate'), onPress: () => doReport('duplicate') },
        { text: t('learn.reportOther'), onPress: () => doReport('other') },
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  };

  const doReport = async (reason: 'incorrect' | 'confusing' | 'duplicate' | 'other') => {
    if (!user || !question?.id) return;
    reported.current = true;
    // Quien acaba de avisarnos de un fallo no es a quien pedirle 5 estrellas.
    cancelPendingReview();
    noteReviewBlocker();
    await reportQuestion(user.id, question.id, reason);
    Alert.alert(t('learn.thanks'), t('daily.reportThanksBody'));
  };

  const getState = (i: number): AnswerState => {
    if (selected === null) return null;
    if (i === question?.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  // ─ Loading
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Ranking
  if (phase === 'ranking') {
    const ink = inkButton(isDark);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Confetti active={showConfetti} />
        <ScrollView
          contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshRanking} tintColor={C.textMuted} colors={[C.brand]} />
          }
        >
          {/* Result header */}
          <Pop>
            <LinearGradient
              colors={highlightGradient(isDark)}
              locations={[0, 0.7]}
              start={{ x: 0, y: 0 }} end={{ x: 0.4, y: 1 }}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 13,
                borderRadius: Radius.cardLg, padding: 14,
                borderWidth: 1.5, borderColor: C.borderWarm,
                ...cardShadow(isDark),
              }}
            >
              <Text style={{ fontSize: 34 }}>{isCorrect ? '🎉' : '💪'}</Text>
              <View style={{ flex: 1, gap: 1 }}>
                <Text style={{ color: C.text, fontSize: 17, fontFamily: Font.black }}>
                  {isCorrect ? t('daily.resultWin') : t('daily.resultLose')}
                </Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
                  {dailyRanking.length > 0
                    ? t('daily.playersAnswered', { count: dailyRanking.length })
                    : t('daily.beFirst')}
                </Text>
              </View>
              <Pressable
                onPress={handleShare}
                style={{
                  backgroundColor: ink.backgroundColor, borderRadius: Radius.pill,
                  paddingVertical: 9, paddingHorizontal: 14,
                }}
                hitSlop={8}
              >
                <Text style={{ color: ink.color, fontFamily: Font.extra, fontSize: 14 }}>🔗</Text>
              </Pressable>
            </LinearGradient>
          </Pop>

          {/* Ruta de hoy: el resto del ritual diario, bajo el resultado. */}
          {user && (
            <DailyRoute userId={user.id} profile={profile} refresh={refreshProfile} />
          )}

          {/* Tab switcher */}
          <View style={{
            flexDirection: 'row', gap: 4, marginTop: 18, marginBottom: 16,
            backgroundColor: C.surface, borderRadius: Radius.row, padding: 5,
            borderWidth: 1, borderColor: C.border,
          }}>
            {getRankingTabs(t).map(({ key, label }) => (
              <Pressable
                key={key}
                // Liga y Global son pantallas propias, con su clasificación
                // completa; las otras dos se intercambian aquí mismo.
                onPress={() =>
                  key === 'league' ? router.push('/leagues' as any)
                  : key === 'global' ? router.push('/ranking' as any)
                  : setRankingTab(key)
                }
                style={{
                  flex: 1,
                  paddingVertical: 9, paddingHorizontal: 4, borderRadius: 12,
                  backgroundColor: rankingTab === key ? C.brand : 'transparent',
                }}
              >
                <Text numberOfLines={1} style={{
                  color: rankingTab === key ? C.onBrand : C.textMuted,
                  fontFamily: rankingTab === key ? Font.extra : Font.bold,
                  fontSize: 13,
                  textAlign: 'center',
                }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Daily */}
          {rankingTab === 'daily' && (
            <RankingList
              C={C} isDark={isDark}
              items={dailyRanking.map((p, i) => ({
                position: i,
                name: p.username,
                sub: `🔥 ${t('common.days', { count: p.streak })}`,
                value: formatTime(p.timeMs),
                isMe: p.userId === user?.id,
                leagueDivision: p.division,
                cosmetics: p.cosmetics,
                badge: { kind: p.isCorrect ? 'correct' as const : 'wrong' as const, text: p.isCorrect ? '✓' : '✗' },
              }))}
              emptyText={t('daily.emptyDaily')}
            />
          )}

          {/* Friends */}
          {rankingTab === 'friends' && (
            friendRanking.length === 0 && loadedTabs.current.has('friends') ?
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>👥</Text>
                <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 15, textAlign: 'center', lineHeight: 23 }}>
                  {t('daily.noFriends')}
                </Text>
              </View> :
              <RankingList
                C={C} isDark={isDark}
                items={friendRanking.map((p, i) => ({
                  position: i,
                  name: p.username,
                  sub: `🔥 ${t('common.days', { count: p.streak })}`,
                  value: formatTime(p.timeMs),
                  isMe: p.userId === user?.id,
                  leagueDivision: p.division,
                  cosmetics: p.cosmetics,
                  badge: { kind: p.isCorrect ? 'correct' as const : 'wrong' as const, text: p.isCorrect ? '✓' : '✗' },
                }))}
                emptyText={t('daily.emptyFriends')}
              />
          )}

          <Text style={{ marginTop: 24, textAlign: 'center', color: C.textFaint, fontSize: 13, fontFamily: Font.bold }}>
            {t('daily.newQuestionIn', { time: timeUntilMidnight() })}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─ No question
  if (!question) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
          <Text style={{ color: C.textMuted, fontSize: 15, textAlign: 'center', fontFamily: Font.regular, lineHeight: 24 }}>
            {t('daily.noQuestion')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Question phase
  const answered = selected !== null;
  const dailyPowerUps: PowerUpButton[] = [
    { id: 'pw_5050', icon: '✂️', label: '50/50', count: inventory['pw_5050'] ?? 0 },
    { id: 'pw_hint', icon: '💡', label: t('ladder.pwHint'), count: inventory['pw_hint'] ?? 0 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <Confetti active={showConfetti} />
      <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{
            backgroundColor: C.brandTint, borderWidth: 1, borderColor: C.borderWarm,
            paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radius.pill,
          }}>
            <Text style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.black, letterSpacing: 0.7 }}>
              {t('daily.badge')}
            </Text>
          </View>
          <Pressable onPress={handleReport} style={{ padding: 8 }} hitSlop={8}>
            <Text style={{ color: C.textFaint, fontSize: 18 }}>⚑</Text>
          </Pressable>
        </View>

        <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 10, lineHeight: 21 }}>
          {t('daily.subtitle')}
        </Text>

        <Text style={{ color: C.text, ...Type.questionLg, marginBottom: 22 }}>
          {question.q}
        </Text>

        <View style={{ gap: 11 }}>
          {question.opts.map((opt, i) =>
            fiftyHidden.includes(i) ? (
              <View key={i} style={{
                borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surfaceSunk,
                borderRadius: 18, paddingVertical: 16, paddingHorizontal: 16, opacity: 0.5, minHeight: 60,
                justifyContent: 'center',
              }}>
                <Text style={{ color: C.textFaint, fontSize: 16, fontFamily: Font.semi }}>—</Text>
              </View>
            ) : (
              <OptionBtn
                key={i}
                text={opt}
                letter={LETTERS[i]}
                state={getState(i)}
                dimmed={answered && getState(i) === null}
                onPress={() => handle(i)}
              />
            ),
          )}
        </View>

        {/* Pista (power-up) */}
        {hintShown && !answered && question.ctx && (
          <View style={{
            marginTop: 16, padding: 16, backgroundColor: C.surface, borderRadius: Radius.card,
            borderWidth: 1.5, borderColor: C.borderWarm,
          }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 15, marginBottom: 6 }}>
              {t('ladder.hint')}
            </Text>
            <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 22 }}>
              {question.ctx}
            </Text>
          </View>
        )}

        {/* Power-ups */}
        {!answered && dailyPowerUps.some(p => p.count > 0) && (
          <View style={{ marginTop: 18, gap: 9 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, fontSize: 12 }}>
              {t('common.yourHelpers')}
            </Text>
            <PowerUpBar items={dailyPowerUps} onUse={usePowerUp} />
          </View>
        )}

        {answered && (
          <View style={{
            marginTop: 20, padding: 16, borderRadius: Radius.card,
            backgroundColor: isCorrect ? C.correctTint : C.wrongTint,
            borderWidth: 1,
            borderColor: isCorrect ? C.correct : C.wrong,
          }}>
            <Text style={{
              color: isCorrect ? C.correctText : C.wrongText,
              fontFamily: Font.black, fontSize: 16, marginBottom: 6,
            }}>
              {isCorrect ? t('daily.correct') : t('daily.incorrect')}
            </Text>
            {question.ctx && (
              <Text style={{ color: C.textBody, fontSize: 14, fontFamily: Font.regular, lineHeight: 22 }}>
                {question.ctx}
              </Text>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

type RankItem = {
  position: number;
  name: string;
  sub: string;
  value: string;
  isMe: boolean;
  badge?: { kind: 'correct' | 'wrong'; text: string };
  leagueDivision?: number;
  cosmetics?: Record<string, string> | null;
};

function RankingList({ items, emptyText, C, isDark }: {
  items: RankItem[];
  emptyText: string;
  C: Palette;
  isDark: boolean;
}) {
  if (items.length === 0) {
    return (
      <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, textAlign: 'center', marginTop: 20, lineHeight: 23 }}>
        {emptyText}
      </Text>
    );
  }
  return (
    <View style={{ gap: 9 }}>
      {items.map(item => (
        <RankRowView key={`${item.position}-${item.name}`} {...item} C={C} isDark={isDark} />
      ))}
    </View>
  );
}
