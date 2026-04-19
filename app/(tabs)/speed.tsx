import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { QUESTIONS } from '@/constants/questions';
import { AnswerState, Question } from '@/types';

type Phase = 'intro' | 'playing' | 'done';

const DURATION = 30;

export default function SpeedScreen() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const allQ: Question[] = useMemo(() => {
    const arr: Question[] = [];
    Object.values(QUESTIONS).forEach(qs => arr.push(...qs));
    return arr.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const reset = () => {
    setPhase('intro');
    setTimeLeft(DURATION);
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
  };

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === allQ[qIdx % allQ.length].ans) setScore(s => s + 1);
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      setQIdx(q => q + 1);
    }, 500);
  };

  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>⚡</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>
              Contrarreloj
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', lineHeight: 24, textAlign: 'center', maxWidth: 260, marginBottom: 40 }}>
              Responde el máximo de preguntas posible en{' '}
              <Text style={{ color: '#a030e8', fontFamily: 'Outfit_700Bold' }}>30 segundos</Text>.
              Cada acierto suma 1 punto.
            </Text>

            <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 20, marginBottom: 40, width: '100%', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>
                Tu récord actual
              </Text>
              <Text style={{ color: '#a030e8', fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>
                8 preguntas
              </Text>
            </View>

            <Pressable onPress={() => setPhase('playing')} style={{ width: '100%' }}>
              <LinearGradient
                colors={['#a030e8', '#7020b8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>¡Empezar!</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'done') {
    const total = qIdx || 1;
    const accuracy = Math.round((score / total) * 100);
    const newRecord = score >= 8;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>
            {score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}
          </Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            {score} correctas
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 6 }}>
            en {DURATION} segundos
          </Text>
          {newRecord ? (
            <Text style={{ color: '#e8a030', fontSize: 13, fontFamily: 'Outfit_600SemiBold', marginBottom: 28 }}>
              🎉 ¡Nuevo récord personal!
            </Text>
          ) : (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
              Récord: 8 · Te faltan {8 - score} para superarlo
            </Text>
          )}

          <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginBottom: 30 }}>
            {[
              { label: 'Respondidas', value: String(qIdx) },
              { label: 'Precisión', value: `${accuracy}%` },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_700Bold' }}>{s.value}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Pressable
              onPress={reset}
              style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Reiniciar</Text>
            </Pressable>
            <Pressable onPress={() => { reset(); setTimeout(() => setPhase('playing'), 50); }} style={{ flex: 2 }}>
              <LinearGradient
                colors={['#a030e8', '#7020b8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>Otra vez</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Playing phase
  const q = allQ[qIdx % allQ.length];
  const pct = timeLeft / DURATION;
  const timerColor = timeLeft > 10 ? '#a030e8' : '#e83060';

  const getState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Timer row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>#{qIdx + 1}</Text>
          <Text style={{ color: timerColor, fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>
            {timeLeft}s
          </Text>
          <Text style={{ color: '#a030e8', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>{score} ✓</Text>
        </View>

        {/* Progress bar */}
        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 22 }}>
          {q.q}
        </Text>

        <View style={{ gap: 9 }}>
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
      </View>
    </SafeAreaView>
  );
}
