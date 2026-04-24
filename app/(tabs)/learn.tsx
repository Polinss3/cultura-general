import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useAuth } from '@/hooks/useAuth';
import { fetchQuestions, incrementProfileStats, reportQuestion } from '@/lib/db';
import { QUESTIONS, CAT_COLORS, CAT_ICONS, CAT_NAMES, ALL_CATEGORIES } from '@/constants/questions';
import { AnswerState, Category, Question } from '@/types';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

const DIFF_LABELS: Record<Difficulty, string> = {
  all: 'Todas',
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};

const LETTERS = ['A', 'B', 'C', 'D'] as const;

function filterByDifficulty(questions: Question[], diff: Difficulty): Question[] {
  if (diff === 'all') return questions;
  return questions.filter((q: any) => q.difficulty === diff);
}

export default function LearnScreen() {
  const { user } = useAuth();
  const [cat, setCat] = useState<Category | null>(null);
  const reportedRef = useRef(new Set<string>());
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showCtx, setShowCtx] = useState(false);

  useEffect(() => {
    if (!cat) return;
    setLoadingQ(true);
    setAllQuestions([]);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    setDifficulty('all');

    fetchQuestions(cat).then(remote => {
      const qs = remote.length > 0 ? remote : QUESTIONS[cat];
      setAllQuestions(qs);
      setQuestions(qs);
      setLoadingQ(false);
    });
  }, [cat]);

  // Refilter when difficulty changes
  useEffect(() => {
    if (allQuestions.length === 0) return;
    const filtered = filterByDifficulty(allQuestions, difficulty);
    setQuestions(filtered.length > 0 ? filtered : allQuestions);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
  }, [difficulty]);

  const q = questions[qIdx % Math.max(questions.length, 1)];

  const handle = (i: number) => {
    if (answered || !q) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.ans;
    if (!correct) setShowCtx(true);

    if (user) {
      incrementProfileStats(user.id, 1, correct ? 1 : 0);
    }
  };

  const next = () => {
    setQIdx(x => x + 1);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
  };

  const goBack = () => {
    setCat(null);
    setAllQuestions([]);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    setDifficulty('all');
  };

  // ─ Category picker
  if (!cat) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            ¿Qué quieres aprender?
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 24 }}>
            Elige un tema y empieza a practicar
          </Text>

          <View style={{ gap: 10 }}>
            {ALL_CATEGORIES.map(c => {
              const col = CAT_COLORS[c];
              const count = QUESTIONS[c].length;
              return (
                <Pressable key={c} onPress={() => setCat(c)}>
                  <View style={{ backgroundColor: col.bg, borderWidth: 1, borderColor: col.accent + '30', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Text style={{ fontSize: 28 }}>{CAT_ICONS[c]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: col.text, fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                        {CAT_NAMES[c]}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>
                        {count}+ preguntas
                      </Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>›</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─ Loading
  if (loadingQ) {
    const col = CAT_COLORS[cat];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={col.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!q) return null;

  const col = CAT_COLORS[cat];
  const correct = selected === q.ans;
  const isLast = qIdx % questions.length === questions.length - 1;

  const handleReport = () => {
    if (!user || !q.id || reportedRef.current.has(q.id)) return;
    Alert.alert('¿Qué problema tiene esta pregunta?', undefined, [
      { text: 'Respuesta incorrecta', onPress: () => { if (q.id) { reportedRef.current.add(q.id); reportQuestion(user.id, q.id, 'incorrect'); Alert.alert('Gracias', 'Reporte enviado.'); } } },
      { text: 'Es confusa', onPress: () => { if (q.id) { reportedRef.current.add(q.id); reportQuestion(user.id, q.id, 'confusing'); Alert.alert('Gracias', 'Reporte enviado.'); } } },
      { text: 'Otro', onPress: () => { if (q.id) { reportedRef.current.add(q.id); reportQuestion(user.id, q.id, 'other'); Alert.alert('Gracias', 'Reporte enviado.'); } } },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const getState = (i: number): AnswerState => {
    if (!answered) return selected === i ? 'selected' : null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: 20 }}>
          {/* Nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Pressable onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>Temas</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable onPress={handleReport} style={{ padding: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>⚑</Text>
              </Pressable>
              <CategoryBadge cat={cat} small />
            </View>
          </View>

          {/* Difficulty filter */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 18 }}>
            {(Object.keys(DIFF_LABELS) as Difficulty[]).map(d => {
              const active = difficulty === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(d)}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 12,
                    borderRadius: 99,
                    backgroundColor: active ? col.accent : '#1a1a1a',
                    borderWidth: 1,
                    borderColor: active ? col.accent : 'transparent',
                  }}
                >
                  <Text style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontFamily: active ? 'Outfit_600SemiBold' : 'Outfit_400Regular',
                    fontSize: 12,
                  }}>
                    {DIFF_LABELS[d]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Progress dots */}
          <View style={{ flexDirection: 'row', gap: 3, marginBottom: 16 }}>
            {questions.map((_, i) => (
              <View key={i} style={{ flex: 1, height: 3, borderRadius: 99, backgroundColor: i <= qIdx % questions.length ? col.accent : '#1a1a1a' }} />
            ))}
          </View>

          {/* Question counter */}
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', marginBottom: 12 }}>
            {(qIdx % questions.length) + 1} / {questions.length}
          </Text>

          {/* Question */}
          <Text style={{ color: '#fff', fontSize: 19, fontFamily: 'Outfit_700Bold', lineHeight: 28, marginBottom: 24 }}>
            {q.q}
          </Text>

          {/* Options */}
          <View style={{ gap: 9 }}>
            {q.opts.map((opt, i) => (
              <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
            ))}
          </View>
        </View>

        {/* Context */}
        {showCtx && q.ctx && (
          <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: 'rgba(232,48,96,0.06)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(232,48,96,0.2)' }}>
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold', marginBottom: 6, fontSize: 13 }}>
              💡 Contexto
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
              {q.ctx}
            </Text>
          </View>
        )}

        {/* Next button */}
        {answered && (
          <View style={{ paddingHorizontal: 20 }}>
            <Pressable onPress={isLast ? goBack : next}>
              <LinearGradient
                colors={correct ? ['#2ec87a', '#1a9a5c'] : [col.accent, col.accent + '99']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>
                  {isLast ? '🎉 ¡Tema completado!' : 'Siguiente →'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
