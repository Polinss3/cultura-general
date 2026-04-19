import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { fetchQuestions, saveSpeedGame } from '@/lib/db';
import { QUESTIONS } from '@/constants/questions';
import { shuffle } from '@/lib/utils';
import { AnswerState, Question } from '@/types';

type Phase = 'loading' | 'intro' | 'playing' | 'done';

const DURATION = 30;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function buildLocal(): Question[] {
  const arr: Question[] = [];
  Object.values(QUESTIONS).forEach(qs => arr.push(...qs));
  return shuffle(arr);
}

export default function SpeedScreen() {
  const { user } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();

  const [phase, setPhase] = useState<Phase>('loading');
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const savedRef = useRef(false);

  // Load questions from Supabase on mount, fall back to local
  useEffect(() => {
    fetchQuestions().then(remote => {
      setAllQ(shuffle(remote.length > 0 ? remote : buildLocal()));
      setPhase('intro');
    });
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Save game when done
  useEffect(() => {
    if (phase !== 'done' || !user || savedRef.current) return;
    savedRef.current = true;
    const record = profile?.speed_record ?? 0;
    saveSpeedGame(user.id, score, qIdx, record).then(({ isNewRecord }) => {
      setNewRecord(isNewRecord);
      refreshProfile();
    });
  }, [phase]);

  const reset = (startPlaying = false) => {
    savedRef.current = false;
    setNewRecord(false);
    setAllQ(shuffle(allQ.length > 0 ? allQ : buildLocal()));
    setPhase(startPlaying ? 'playing' : 'intro');
    setTimeLeft(DURATION);
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
  };

  const handle = (i: number) => {
    if (answered || allQ.length === 0) return;
    setSelected(i);
    setAnswered(true);
    if (i === allQ[qIdx % allQ.length].ans) setScore(s => s + 1);
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      setQIdx(q => q + 1);
    }, 500);
  };

  // ─ Loading
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#a030e8" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Intro
  if (phase === 'intro') {
    const record = profile?.speed_record ?? 0;
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
                {record} {record === 1 ? 'pregunta' : 'preguntas'}
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

  // ─ Done
  if (phase === 'done') {
    const total = Math.max(qIdx, 1);
    const accuracy = Math.round((score / total) * 100);
    const record = profile?.speed_record ?? 0;
    const diff = record - score;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>
            {score >= record && record > 0 ? '🏆' : score >= 5 ? '⭐' : '💪'}
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
              {record > 0
                ? diff > 0
                  ? `Récord: ${record} · Te faltan ${diff} para superarlo`
                  : `Récord igualado: ${record}`
                : 'Primera partida registrada'}
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
              onPress={() => reset(false)}
              style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Inicio</Text>
            </Pressable>
            <Pressable onPress={() => reset(true)} style={{ flex: 2 }}>
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

  // ─ Playing
  if (allQ.length === 0) return null;
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>#{qIdx + 1}</Text>
          <Text style={{ color: timerColor, fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>{timeLeft}s</Text>
          <Text style={{ color: '#a030e8', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>{score} ✓</Text>
        </View>

        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 22 }}>
          {q.q}
        </Text>

        <View style={{ gap: 9 }}>
          {q.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
