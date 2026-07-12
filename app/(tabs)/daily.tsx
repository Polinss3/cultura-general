import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { ScrollView, View, Text, ActivityIndicator, Pressable, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { LeagueBadge } from '@/components/LeagueBadge';
import { UserName } from '@/components/UserName';
import { usePowerups } from '@/hooks/usePowerups';
import { resolveCosmetics } from '@/lib/cosmetics';
import { Confetti } from '@/components/Confetti';
import { GuestGate } from '@/components/GuestGate';
import { OfflineNotice } from '@/components/OfflineNotice';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { showInterstitialAd } from '@/lib/admob';
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import {
  fetchOrAssignDailyQuestion,
  checkDailyAnswered,
  saveDailyAnswer,
  fetchDailyRanking,
  fetchAllTimeRanking,
  fetchFriendDailyRanking,
  reportQuestion,
  RankRow,
  GlobalRow,
} from '@/lib/db';
import { shuffleQuestionSeeded, pickRandomFresh, ShuffledQuestion } from '@/lib/utils';
import { AnswerState, Question } from '@/types';

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
  position, name, sub, value, isMe, badge, leagueDivision, cosmetics,
}: {
  position: number;
  name: string;
  sub: string;
  value: string;
  isMe: boolean;
  badge?: { text: string; color: string; bg: string };
  leagueDivision?: number;
  cosmetics?: Record<string, string> | null;
}) {
  const { t } = useTranslation();
  const cos = resolveCosmetics(cosmetics);
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: isMe ? 'rgba(232,160,48,0.08)' : '#151515',
      borderWidth: 1,
      borderColor: isMe ? 'rgba(232,160,48,0.3)' : 'transparent',
      borderRadius: 14, padding: 12,
    }}>
      <Text style={{ width: 24, fontSize: 14, fontFamily: 'Outfit_800ExtraBold', textAlign: 'center',
        color: position < 3 ? (['#e8a030', '#aaa', '#cd7f32'] as const)[position] : 'rgba(255,255,255,0.2)',
      }}>
        {position < 3 ? MEDALS[position] : `${position + 1}`}
      </Text>
      <View style={cos.frameColor ? { borderWidth: 2, borderColor: cos.frameColor, borderRadius: 12, padding: 1.5 } : undefined}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isMe ? '#e8a030' : '#222',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
            {name[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <UserName
          name={name}
          cosmetics={cos}
          suffix={isMe ? t('daily.you') : ''}
          color={isMe ? '#e8a030' : '#fff'}
          fontFamily={isMe ? 'Outfit_700Bold' : 'Outfit_500Medium'}
        />
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>{sub}</Text>
      </View>
      {leagueDivision != null && (
        <View style={{ marginRight: 4 }}>
          <LeagueBadge division={leagueDivision} variant="mini" />
        </View>
      )}
      {badge && (
        <View style={{
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
          backgroundColor: badge.bg, marginRight: 6,
        }}>
          <Text style={{ color: badge.color, fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
            {badge.text}
          </Text>
        </View>
      )}
      <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>{value}</Text>
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
  const [globalRanking, setGlobalRanking] = useState<GlobalRow[]>([]);
  const [friendRanking, setFriendRanking] = useState<RankRow[]>([]);
  const loadedTabs = useRef(new Set<RankingTab>());
  const questionStartAt = useRef<number>(0);

  useEffect(() => {
    if (!user) return;
    init();
    // Recargar (pregunta + rankings) al cambiar de idioma.
  }, [user?.id, i18n.language]);

  // Lazy-load ranking tabs
  useEffect(() => {
    if (phase !== 'ranking' || !user || loadedTabs.current.has(rankingTab)) return;
    loadedTabs.current.add(rankingTab);

    if (rankingTab === 'global') {
      fetchAllTimeRanking().then(setGlobalRanking);
    } else if (rankingTab === 'friends') {
      fetchFriendDailyRanking(user.id).then(setFriendRanking);
    }
  }, [rankingTab, phase]);

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
      if (question.id) {
        // Translate display-index back to original (DB) index for consistency
        const originalIdx = question.originalIndexMap[i] ?? i;
        const award = await saveDailyAnswer(user.id, question.id, originalIdx, correct, elapsedMs);
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
      showInterstitialAd('daily_answered');
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#e8a030" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Ranking
  if (phase === 'ranking') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <Confetti active={showConfetti} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Result header */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>{isCorrect ? '🏆' : '💪'}</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>
              {isCorrect ? t('daily.resultWin') : t('daily.resultLose')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4, marginBottom: 16 }}>
              {dailyRanking.length > 0
                ? t('daily.playersAnswered', { count: dailyRanking.length })
                : t('daily.beFirst')}
            </Text>
            <Pressable
              onPress={handleShare}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a1a1a', borderRadius: 99, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Text style={{ fontSize: 16 }}>🔗</Text>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 14 }}>{t('daily.share')}</Text>
            </Pressable>
          </View>

          {/* Tab switcher */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <View style={{ flexDirection: 'row', backgroundColor: '#151515', borderRadius: 12, padding: 4, gap: 2 }}>
              {getRankingTabs(t).map(({ key, label }) => (
                <Pressable
                  key={key}
                  onPress={() => key === 'league' ? router.push('/leagues' as any) : setRankingTab(key)}
                  style={{
                    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9,
                    backgroundColor: rankingTab === key ? '#e8a030' : 'transparent',
                  }}
                >
                  <Text style={{
                    color: rankingTab === key ? '#000' : 'rgba(255,255,255,0.4)',
                    fontFamily: rankingTab === key ? 'Outfit_700Bold' : 'Outfit_400Regular',
                    fontSize: 12,
                  }}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Daily */}
          {rankingTab === 'daily' && (
            <RankingList
              items={dailyRanking.map((p, i) => ({
                position: i,
                name: p.username,
                sub: `🔥 ${t('common.days', { count: p.streak })}`,
                value: formatTime(p.timeMs),
                isMe: p.userId === user?.id,
                leagueDivision: p.division,
                cosmetics: p.cosmetics,
                badge: p.isCorrect
                  ? { text: '✓', color: '#2ec87a', bg: 'rgba(46,200,122,0.12)' }
                  : { text: '✗', color: '#e83060', bg: 'rgba(232,48,96,0.12)' },
              }))}
              emptyText={t('daily.emptyDaily')}
            />
          )}

          {/* Global */}
          {rankingTab === 'global' && (
            globalRanking.length === 0 && loadedTabs.current.has('global') ?
              <ActivityIndicator color="#e8a030" style={{ marginTop: 20 }} /> :
              <RankingList
                items={globalRanking.map((p, i) => ({
                  position: i, name: p.username, sub: t('daily.globalSub', { streak: p.streak, speed: p.speedRecord }),
                  value: t('daily.globalCorrect', { count: p.totalCorrect }), isMe: p.userId === user?.id,
                  leagueDivision: p.division, cosmetics: p.cosmetics,
                }))}
                emptyText={t('daily.emptyGlobal')}
              />
          )}

          {/* Friends */}
          {rankingTab === 'friends' && (
            friendRanking.length === 0 && loadedTabs.current.has('friends') ?
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>👥</Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center' }}>
                  {t('daily.noFriends')}
                </Text>
              </View> :
              <RankingList
                items={friendRanking.map((p, i) => ({
                  position: i,
                  name: p.username,
                  sub: `🔥 ${t('common.days', { count: p.streak })}`,
                  value: formatTime(p.timeMs),
                  isMe: p.userId === user?.id,
                  leagueDivision: p.division,
                  cosmetics: p.cosmetics,
                  badge: p.isCorrect
                    ? { text: '✓', color: '#2ec87a', bg: 'rgba(46,200,122,0.12)' }
                    : { text: '✗', color: '#e83060', bg: 'rgba(232,48,96,0.12)' },
                }))}
                emptyText={t('daily.emptyFriends')}
              />
          )}

          <Text style={{ marginTop: 24, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            {t('daily.newQuestionIn', { time: timeUntilMidnight() })}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─ No question
  if (!question) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', fontFamily: 'Outfit_400Regular', lineHeight: 24 }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <Confetti active={showConfetti} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ backgroundColor: 'rgba(232,160,48,0.1)', borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 99 }}>
            <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('daily.badge')}</Text>
          </View>
          <Pressable onPress={handleReport} style={{ padding: 6 }}>
            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>⚑</Text>
          </Pressable>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 20 }}>
          {t('daily.subtitle')}
        </Text>

        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold', lineHeight: 28, marginBottom: 28 }}>
          {question.q}
        </Text>

        <View style={{ gap: 10 }}>
          {question.opts.map((opt, i) =>
            fiftyHidden.includes(i) ? (
              <View key={i} style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.04)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, opacity: 0.3 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 15, fontFamily: 'Outfit_500Medium' }}>—</Text>
              </View>
            ) : (
              <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
            ),
          )}
        </View>

        {/* Pista (power-up) */}
        {hintShown && !answered && question.ctx && (
          <View style={{ marginTop: 14, padding: 12, backgroundColor: 'rgba(232,160,48,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(232,160,48,0.25)' }}>
            <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 12, marginBottom: 3 }}>{t('ladder.hint')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit_400Regular', fontSize: 12, lineHeight: 18 }}>{question.ctx}</Text>
          </View>
        )}

        {/* Power-ups */}
        {!answered && dailyPowerUps.some(p => p.count > 0) && (
          <View style={{ marginTop: 18 }}>
            <PowerUpBar items={dailyPowerUps} onUse={usePowerUp} />
          </View>
        )}

        {answered && (
          <View style={{
            marginTop: 20, padding: 14, borderRadius: 14,
            backgroundColor: isCorrect ? 'rgba(46,200,122,0.08)' : 'rgba(232,48,96,0.08)',
            borderWidth: 1,
            borderColor: isCorrect ? 'rgba(46,200,122,0.2)' : 'rgba(232,48,96,0.2)',
          }}>
            <Text style={{ color: isCorrect ? '#2ec87a' : '#e83060', fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>
              {isCorrect ? t('daily.correct') : t('daily.incorrect')}
            </Text>
            {question.ctx && (
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
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
  badge?: { text: string; color: string; bg: string };
  leagueDivision?: number;
  cosmetics?: Record<string, string> | null;
};

function RankingList({ items, emptyText }: {
  items: RankItem[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginTop: 20 }}>
        {emptyText}
      </Text>
    );
  }
  return (
    <View style={{ gap: 8 }}>
      {items.map(item => (
        <RankRowView key={`${item.position}-${item.name}`} {...item} />
      ))}
    </View>
  );
}
