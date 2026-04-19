import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { CategoryBadge } from '@/components/CategoryBadge';
import { QUESTIONS, CAT_COLORS, CAT_ICONS, CAT_NAMES, ALL_CATEGORIES } from '@/constants/questions';
import { AnswerState, Category } from '@/types';

export default function LearnScreen() {
  const [cat, setCat] = useState<Category | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showCtx, setShowCtx] = useState(false);

  const qs = cat ? QUESTIONS[cat] : [];
  const q = qs[qIdx % qs.length];

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (q && i !== q.ans) setShowCtx(true);
  };

  const next = () => {
    setQIdx(x => x + 1);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
  };

  const goBack = () => {
    setCat(null);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
  };

  // Category selection screen
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
              return (
                <Pressable key={c} onPress={() => setCat(c)}>
                  <View style={{
                    backgroundColor: col.bg,
                    borderWidth: 1, borderColor: col.accent + '30',
                    borderRadius: 18, padding: 16,
                    flexDirection: 'row', alignItems: 'center', gap: 14,
                  }}>
                    <Text style={{ fontSize: 28 }}>{CAT_ICONS[c]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: col.text, fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                        {CAT_NAMES[c]}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>
                        {QUESTIONS[c].length} preguntas
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

  if (!q) return null;

  const col = CAT_COLORS[cat];
  const correct = selected === q.ans;

  const getState = (i: number): AnswerState => {
    if (!answered) return selected === i ? 'selected' : null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  const isLast = qIdx % qs.length === qs.length - 1;

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
            {qs.map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1, height: 3, borderRadius: 99,
                  backgroundColor: i <= qIdx % qs.length ? col.accent : '#1a1a1a',
                }}
              />
            ))}
          </View>

          {/* Question */}
          <Text style={{ color: '#fff', fontSize: 19, fontFamily: 'Outfit_700Bold', lineHeight: 28, marginBottom: 24 }}>
            {q.q}
          </Text>

          {/* Options */}
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

        {/* Context (shown when wrong) */}
        {showCtx && (
          <View style={{
            marginHorizontal: 20, marginBottom: 16, padding: 16,
            backgroundColor: 'rgba(232,48,96,0.06)',
            borderRadius: 16, borderWidth: 1, borderColor: 'rgba(232,48,96,0.2)',
          }}>
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold', marginBottom: 6, fontSize: 13 }}>
              💡 Contexto histórico
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
