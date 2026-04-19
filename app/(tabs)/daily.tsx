import { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OptionBtn } from '@/components/OptionBtn';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchOrAssignDailyQuestion,
  checkDailyAnswered,
  saveDailyAnswer,
  fetchDailyRanking,
} from '@/lib/db';
import { AnswerState, Question } from '@/types';

type Phase = 'loading' | 'question' | 'ranking';
type RankRow = { userId: string; username: string; score: number; streak: number };

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const MEDALS = ['🥇', '🥈', '🥉'];

function timeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function DailyScreen() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('loading');
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [ranking, setRanking] = useState<RankRow[]>([]);

  useEffect(() => {
    if (!user) return;
    init();
  }, [user?.id]);

  const init = async () => {
    setPhase('loading');
    const [q, already] = await Promise.all([
      fetchOrAssignDailyQuestion(),
      user ? checkDailyAnswered(user.id) : Promise.resolve({ answered: false, score: 0 }),
    ]);
    setQuestion(q);

    if (already.answered) {
      setIsCorrect(already.score > 0);
      const r = await fetchDailyRanking();
      setRanking(r);
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

    setTimeout(async () => {
      setPhase('loading');
      if (question.id) {
        await saveDailyAnswer(user.id, question.id, i, correct);
      }
      const r = await fetchDailyRanking();
      setRanking(r);
      setPhase('ranking');
    }, 1200);
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
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>{isCorrect ? '🏆' : '💪'}</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>
              {isCorrect ? '+100 puntos' : 'Sin puntos hoy'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
              {ranking.length > 0
                ? `${ranking.length} ${ranking.length === 1 ? 'jugador ha' : 'jugadores han'} respondido hoy`
                : 'Ranking de hoy'}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            {ranking.map((p, i) => {
              const isMe = p.userId === user?.id;
              return (
                <View key={p.userId} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: isMe ? 'rgba(232,160,48,0.08)' : '#151515',
                  borderWidth: 1,
                  borderColor: isMe ? 'rgba(232,160,48,0.3)' : 'transparent',
                  borderRadius: 14, padding: 12,
                }}>
                  <Text style={{ width: 24, fontSize: 16, fontFamily: 'Outfit_800ExtraBold', color: i < 3 ? (['#e8a030', '#aaa', '#cd7f32'])[i] : 'rgba(255,255,255,0.2)' }}>
                    {i < 3 ? MEDALS[i] : `${i + 1}`}
                  </Text>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isMe ? '#e8a030' : '#222', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
                      {p.username[0]?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isMe ? '#e8a030' : '#fff', fontFamily: isMe ? 'Outfit_700Bold' : 'Outfit_500Medium', fontSize: 14 }}>
                      {p.username}{isMe ? ' (tú)' : ''}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
                      🔥 {p.streak} días
                    </Text>
                  </View>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                    {p.score}
                  </Text>
                </View>
              );
            })}
          </View>

          {ranking.length === 0 && (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginTop: 20 }}>
              Aún no hay nadie en el ranking de hoy.{'\n'}¡Eres el primero!
            </Text>
          )}

          <Text style={{ marginTop: 24, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            Nueva pregunta en {timeUntilMidnight()}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─ Question (no question available)
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <View style={{ backgroundColor: 'rgba(232,160,48,0.1)', borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 99 }}>
            <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>🏆 PREGUNTA DEL DÍA</Text>
          </View>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 20 }}>
          {ranking.length > 0
            ? `${ranking.length} personas ya han respondido hoy`
            : '¿Serás el primero en responder hoy?'}
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
