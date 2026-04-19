import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useAuth } from '@/hooks/useAuth';
import { fetchQuestions, incrementProfileStats } from '@/lib/db';
import { QUESTIONS, CAT_COLORS, CAT_ICONS, CAT_NAMES, ALL_CATEGORIES } from '@/constants/questions';
import { AnswerState, Category, Question } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function LearnScreen() {
  const { user } = useAuth();
  const [cat, setCat] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showCtx, setShowCtx] = useState(false);

  // Fetch questions from Supabase when category is selected
  useEffect(() => {
    if (!cat) return;
    setLoadingQ(true);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);

    fetchQuestions(cat).then(remote => {
      setQuestions(remote.length > 0 ? remote : QUESTIONS[cat]);
      setLoadingQ(false);
    });
  }, [cat]);

  const q = questions[qIdx % Math.max(questions.length, 1)];

  const handle = (i: number) => {
    if (answered || !q) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.ans;
    if (!correct) setShowCtx(true);

    // Save stats (fire-and-forget)
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
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
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
              // Show local count as placeholder (DB count loads on entry)
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

  // ─ Loading questions
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Pressable onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>Temas</Text>
            </Pressable>
            <CategoryBadge cat={cat} small />
          </View>

          {/* Progress dots */}
          <View style={{ flexDirection: 'row', gap: 3, marginBottom: 20 }}>
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

        {/* Context (shown when wrong) */}
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
