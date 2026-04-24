import { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OptionBtn } from '@/components/OptionBtn';
import { Confetti } from '@/components/Confetti';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchOrAssignDailyQuestion,
  checkDailyAnswered,
  saveDailyAnswer,
  fetchDailyRanking,
  fetchWeeklyRanking,
  fetchAllTimeRanking,
  fetchFriendDailyRanking,
  reportQuestion,
  RankRow,
  WeeklyRow,
  GlobalRow,
} from '@/lib/db';
import { AnswerState, Question } from '@/types';

type Phase = 'loading' | 'question' | 'ranking';
type RankingTab = 'daily' | 'weekly' | 'global' | 'friends';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const MEDALS = ['🥇', '🥈', '🥉'];
const RANKING_TABS: { key: RankingTab; label: string }[] = [
  { key: 'daily',   label: '🗓 Hoy' },
  { key: 'weekly',  label: '📅 Semana' },
  { key: 'global',  label: '🌍 Global' },
  { key: 'friends', label: '👥 Amigos' },
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
  position, name, sub, value, isMe,
}: { position: number; name: string; sub: string; value: string; isMe: boolean }) {
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
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isMe ? '#e8a030' : '#222',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
          {name[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: isMe ? '#e8a030' : '#fff', fontFamily: isMe ? 'Outfit_700Bold' : 'Outfit_500Medium', fontSize: 14 }}>
          {name}{isMe ? ' (tú)' : ''}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>{sub}</Text>
      </View>
      <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>{value}</Text>
    </View>
  );
}

export default function DailyScreen() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('loading');
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const reported = useRef(false);

  const [rankingTab, setRankingTab] = useState<RankingTab>('daily');
  const [dailyRanking, setDailyRanking] = useState<RankRow[]>([]);
  const [weeklyRanking, setWeeklyRanking] = useState<WeeklyRow[]>([]);
  const [globalRanking, setGlobalRanking] = useState<GlobalRow[]>([]);
  const [friendRanking, setFriendRanking] = useState<RankRow[]>([]);
  const loadedTabs = useRef(new Set<RankingTab>());

  useEffect(() => {
    if (!user) return;
    init();
  }, [user?.id]);

  // Lazy-load ranking tabs
  useEffect(() => {
    if (phase !== 'ranking' || !user || loadedTabs.current.has(rankingTab)) return;
    loadedTabs.current.add(rankingTab);

    if (rankingTab === 'weekly') {
      fetchWeeklyRanking().then(setWeeklyRanking);
    } else if (rankingTab === 'global') {
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
    setQuestion(q);

    if (already.answered) {
      setIsCorrect(already.score > 0);
      const r = await fetchDailyRanking();
      setDailyRanking(r);
      loadedTabs.current.add('daily');
      setPhase('ranking');
    } else {
      setPhase('question');
    }
  };

  const handle = async (i: number) => {
    if (selected !== null || !question || !user) return;
    setSelected(i);
    const correct = i === question.ans;
    setIsCorrect(correct);
    if (correct) setShowConfetti(true);

    setTimeout(async () => {
      setPhase('loading');
      if (question.id) {
        await saveDailyAnswer(user.id, question.id, i, correct);
      }
      const r = await fetchDailyRanking();
      setDailyRanking(r);
      loadedTabs.current = new Set(['daily']);
      setRankingTab('daily');
      setPhase('ranking');
    }, 1400);
  };

  const handleReport = () => {
    if (!user || !question?.id || reported.current) return;
    Alert.alert(
      '¿Qué problema tiene esta pregunta?',
      undefined,
      [
        { text: 'Respuesta incorrecta', onPress: () => doReport('incorrect') },
        { text: 'Es confusa', onPress: () => doReport('confusing') },
        { text: 'Está duplicada', onPress: () => doReport('duplicate') },
        { text: 'Otro', onPress: () => doReport('other') },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  const doReport = async (reason: 'incorrect' | 'confusing' | 'duplicate' | 'other') => {
    if (!user || !question?.id) return;
    reported.current = true;
    await reportQuestion(user.id, question.id, reason);
    Alert.alert('Gracias', 'Tu reporte ayuda a mejorar la calidad de las preguntas.');
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
    const isLoading = (tab: RankingTab) =>
      !loadedTabs.current.has(tab) ||
      (tab === 'weekly' && weeklyRanking.length === 0 && loadedTabs.current.has('weekly') ? false : false);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <Confetti active={showConfetti} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Result header */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>{isCorrect ? '🏆' : '💪'}</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>
              {isCorrect ? '+100 puntos' : 'Sin puntos hoy'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
              {dailyRanking.length > 0
                ? `${dailyRanking.length} ${dailyRanking.length === 1 ? 'jugador ha' : 'jugadores han'} respondido hoy`
                : 'Sé el primero en responder'}
            </Text>
          </View>

          {/* Tab switcher */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#151515', borderRadius: 12, padding: 4, gap: 2 }}>
              {RANKING_TABS.map(({ key, label }) => (
                <Pressable
                  key={key}
                  onPress={() => setRankingTab(key)}
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
                position: i, name: p.username, sub: `🔥 ${p.streak} días`,
                value: String(p.score), isMe: p.userId === user?.id,
              }))}
              emptyText="¡Eres el primero en responder hoy!"
            />
          )}

          {/* Weekly */}
          {rankingTab === 'weekly' && (
            weeklyRanking.length === 0 && loadedTabs.current.has('weekly') ?
              <ActivityIndicator color="#e8a030" style={{ marginTop: 20 }} /> :
              <RankingList
                items={weeklyRanking.map((p, i) => ({
                  position: i, name: p.username, sub: `🔥 ${p.streak} días`,
                  value: `${p.weekScore} pts`, isMe: p.userId === user?.id,
                }))}
                emptyText="Nadie ha respondido esta semana aún."
              />
          )}

          {/* Global */}
          {rankingTab === 'global' && (
            globalRanking.length === 0 && loadedTabs.current.has('global') ?
              <ActivityIndicator color="#e8a030" style={{ marginTop: 20 }} /> :
              <RankingList
                items={globalRanking.map((p, i) => ({
                  position: i, name: p.username, sub: `🔥 ${p.streak} · ⚡ ${p.speedRecord}`,
                  value: `${p.totalCorrect} ✓`, isMe: p.userId === user?.id,
                }))}
                emptyText="Sin datos globales aún."
              />
          )}

          {/* Friends */}
          {rankingTab === 'friends' && (
            friendRanking.length === 0 && loadedTabs.current.has('friends') ?
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>👥</Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center' }}>
                  Aún no tienes amigos añadidos.{'\n'}¡Busca a alguien en la pestaña Amigos!
                </Text>
              </View> :
              <RankingList
                items={friendRanking.map((p, i) => ({
                  position: i, name: p.username, sub: `🔥 ${p.streak} días`,
                  value: String(p.score), isMe: p.userId === user?.id,
                }))}
                emptyText="Ningún amigo ha respondido hoy."
              />
          )}

          <Text style={{ marginTop: 24, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            Nueva pregunta en {timeUntilMidnight()}
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
            No hay pregunta disponible hoy.{'\n'}Vuelve más tarde.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Question phase
  const answered = selected !== null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <Confetti active={showConfetti} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ backgroundColor: 'rgba(232,160,48,0.1)', borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 99 }}>
            <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>🏆 PREGUNTA DEL DÍA</Text>
          </View>
          <Pressable onPress={handleReport} style={{ padding: 6 }}>
            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>⚑</Text>
          </Pressable>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 20 }}>
          ¿Serás el primero en responder hoy?
        </Text>

        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold', lineHeight: 28, marginBottom: 28 }}>
          {question.q}
        </Text>

        <View style={{ gap: 10 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
          ))}
        </View>

        {answered && (
          <View style={{
            marginTop: 20, padding: 14, borderRadius: 14,
            backgroundColor: isCorrect ? 'rgba(46,200,122,0.08)' : 'rgba(232,48,96,0.08)',
            borderWidth: 1,
            borderColor: isCorrect ? 'rgba(46,200,122,0.2)' : 'rgba(232,48,96,0.2)',
          }}>
            <Text style={{ color: isCorrect ? '#2ec87a' : '#e83060', fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>
              {isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}
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

function RankingList({ items, emptyText }: {
  items: { position: number; name: string; sub: string; value: string; isMe: boolean }[];
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
        <RankRowView key={item.position} {...item} />
      ))}
    </View>
  );
}
