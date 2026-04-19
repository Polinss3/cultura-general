import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OptionBtn } from '@/components/OptionBtn';
import { DAILY_QUESTION, RANKING } from '@/constants/questions';
import { AnswerState } from '@/types';

type Phase = 'question' | 'ranking';

export default function DailyScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [phase, setPhase] = useState<Phase>('question');
  const q = DAILY_QUESTION;
  const correct = selected === q.ans;

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    setTimeout(() => setPhase('ranking'), 1200);
  };

  const getState = (i: number): AnswerState => {
    if (!answered) return selected === i ? 'selected' : null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  if (phase === 'ranking') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>{correct ? '🏆' : '💪'}</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>
              {correct ? '+100 puntos ganados' : 'Sin puntos hoy'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
              Ranking de hoy entre amigos
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            {RANKING.map((p, i) => (
              <View
                key={p.name}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: p.isMe ? 'rgba(232,160,48,0.08)' : '#151515',
                  borderWidth: 1,
                  borderColor: p.isMe ? 'rgba(232,160,48,0.3)' : 'transparent',
                  borderRadius: 14, padding: 12,
                }}
              >
                <Text style={{
                  width: 22, fontSize: 16, fontFamily: 'Outfit_800ExtraBold',
                  color: i < 3 ? (['#e8a030', '#aaa', '#cd7f32'] as const)[i] : 'rgba(255,255,255,0.2)',
                }}>
                  {i < 3 ? (['🥇', '🥈', '🥉'] as const)[i] : `${i + 1}`}
                </Text>
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: p.isMe ? '#e8a030' : '#222',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Outfit_700Bold' }}>{p.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: p.isMe ? '#e8a030' : '#fff',
                    fontFamily: p.isMe ? 'Outfit_700Bold' : 'Outfit_500Medium',
                    fontSize: 14,
                  }}>
                    {p.name}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
                    🔥 {p.streak} días
                  </Text>
                </View>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                  {p.score.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          <Text style={{ marginTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            Próxima pregunta en 23h 41m
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <View style={{
            backgroundColor: 'rgba(232,160,48,0.1)',
            borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)',
            paddingVertical: 3, paddingHorizontal: 10, borderRadius: 99,
          }}>
            <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>
              🏆 PREGUNTA DEL DÍA
            </Text>
          </View>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 20 }}>
          127 personas ya han respondido hoy
        </Text>

        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold', lineHeight: 28, marginBottom: 28 }}>
          {q.q}
        </Text>

        <View style={{ gap: 10 }}>
          {q.opts.map((opt, i) => (
            <OptionBtn
              key={i}
              text={opt}
              letter={(['A', 'B', 'C', 'D'] as const)[i]}
              state={getState(i)}
              onPress={() => handle(i)}
            />
          ))}
        </View>

        {answered && (
          <View style={{
            marginTop: 20, padding: 14, borderRadius: 14,
            backgroundColor: correct ? 'rgba(46,200,122,0.08)' : 'rgba(232,48,96,0.08)',
            borderWidth: 1,
            borderColor: correct ? 'rgba(46,200,122,0.2)' : 'rgba(232,48,96,0.2)',
          }}>
            <Text style={{ color: correct ? '#2ec87a' : '#e83060', fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>
              {correct ? '✓ ¡Correcto!' : '✗ Incorrecto'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
              {q.ctx}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
