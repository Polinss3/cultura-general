import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { showInterstitialAd } from '@/lib/admob';
import { fetchQuestions, incrementProfileStats, reportQuestion } from '@/lib/db';
import { awardProgress, bumpMissions } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { getLocalQuestions, CAT_COLORS, CAT_ICONS, ALL_CATEGORIES } from '@/constants/questions';
import { getCurrentLang } from '@/lib/i18n';
import { pickRandomFresh, shuffleQuestion } from '@/lib/utils';
import { getRecentIds, pushSeen } from '@/lib/questionHistory';
import { AnswerState, Category, Question } from '@/types';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type LearnCat = Category | 'random';

const DIFFICULTIES: Difficulty[] = ['all', 'easy', 'medium', 'hard'];

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const LEARN_INTERSTITIAL_INTERVAL = 9;

const RANDOM_META = { bg: '#161616', accent: '#cfcfcf', text: '#f0f0f0' };
const RANDOM_ICON = '🎲';

const getMeta = (c: LearnCat) => (c === 'random' ? RANDOM_META : CAT_COLORS[c]);

function filterByDifficulty(questions: Question[], diff: Difficulty): Question[] {
  if (diff === 'all') return questions;
  return questions.filter((q: any) => q.difficulty === diff);
}

export default function LearnScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const [cat, setCat] = useState<LearnCat | null>(null);
  const reportedRef = useRef(new Set<string>());
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showCtx, setShowCtx] = useState(false);
  const completedQuestionsRef = useRef(0);

  useEffect(() => {
    if (!cat) return;
    setLoadingQ(true);
    setAllQuestions([]);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    completedQuestionsRef.current = 0;
    setDifficulty('all');

    (async () => {
      let remote: Question[] = [];
      try {
        remote = cat === 'random' ? await fetchQuestions() : await fetchQuestions(cat);
      } catch {
        // Sin red / sin caché: usamos el banco local empaquetado.
      }
      const localBank = getLocalQuestions(getCurrentLang());
      const fallback = cat === 'random'
        ? ALL_CATEGORIES.flatMap(c => localBank[c])
        : localBank[cat];
      const source = remote.length > 0 ? remote : fallback;
      const recent = await getRecentIds('learn', cat);
      const ordered = pickRandomFresh(source, recent, q => q.id, source.length);
      setAllQuestions(ordered);
      setQuestions(ordered);
      setLoadingQ(false);
    })();
    // Recargar al cambiar de idioma para servir preguntas en el idioma activo.
  }, [cat, i18n.language]);

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

  const baseQ = questions[qIdx % Math.max(questions.length, 1)];
  // Shuffle options once per question (stable across re-renders of the same qIdx)
  const q = useMemo(() => (baseQ ? shuffleQuestion(baseQ) : undefined), [baseQ, qIdx]);

  const handle = (i: number) => {
    if (answered || !q) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.ans;
    if (!correct) setShowCtx(true);

    if (user && !guest && !offline) {
      incrementProfileStats(user.id, 1, correct ? 1 : 0);
      bumpMissions('learn_answer', 1);
      if (correct) {
        bumpMissions('learn_correct', 1);
        awardProgress(REWARDS.learnCorrect.xp, REWARDS.learnCorrect.coins, true, 'learn').then(a => {
          celebrate(a);
          if (a?.gainedCoins) bumpMissions('coins_earned', a.gainedCoins);
        });
      }
    }
    if (cat && q.id) {
      pushSeen('learn', cat, [q.id]);
    }
  };

  const next = () => {
    completedQuestionsRef.current += 1;
    if (completedQuestionsRef.current % LEARN_INTERSTITIAL_INTERVAL === 0) {
      showInterstitialAd('learn_checkpoint');
    }
    setQIdx(x => x + 1);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
  };

  const finishTopic = () => {
    completedQuestionsRef.current += 1;
    if (completedQuestionsRef.current % LEARN_INTERSTITIAL_INTERVAL === 0) {
      showInterstitialAd('learn_checkpoint');
    }
    goBack();
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
    completedQuestionsRef.current = 0;
  };

  // ─ Category picker
  if (!cat) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            {t('learn.pickerTitle')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 24 }}>
            {t('learn.pickerSub')}
          </Text>

          <View style={{ gap: 10 }}>
            <Pressable onPress={() => setCat('random')}>
              <View style={{ backgroundColor: RANDOM_META.bg, borderWidth: 1, borderColor: RANDOM_META.accent + '30', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Text style={{ fontSize: 28 }}>{RANDOM_ICON}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: RANDOM_META.text, fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                    {t('learn.randomName')}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>
                    {t('learn.randomDesc')}
                  </Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>›</Text>
              </View>
            </Pressable>
            {ALL_CATEGORIES.map(c => {
              const col = CAT_COLORS[c];
              const count = getLocalQuestions(getCurrentLang())[c].length;
              return (
                <Pressable key={c} onPress={() => setCat(c)}>
                  <View style={{ backgroundColor: col.bg, borderWidth: 1, borderColor: col.accent + '30', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <Text style={{ fontSize: 28 }}>{CAT_ICONS[c]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: col.text, fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                        {t(`categories.${c}`)}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>
                        {t('learn.countQuestions', { count })}
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
    const col = getMeta(cat);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={col.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!q) return null;

  const col = getMeta(cat);
  const correct = selected === q.ans;
  const isLast = qIdx % questions.length === questions.length - 1;

  const handleReport = () => {
    if (!user || !q.id || reportedRef.current.has(q.id)) return;
    const sendReport = (reason: 'incorrect' | 'confusing' | 'other') => {
      if (!q.id) return;
      reportedRef.current.add(q.id);
      reportQuestion(user.id, q.id, reason);
      Alert.alert(t('learn.thanks'), t('learn.reportSent'));
    };
    Alert.alert(t('learn.reportTitle'), undefined, [
      { text: t('learn.reportIncorrect'), onPress: () => sendReport('incorrect') },
      { text: t('learn.reportConfusing'), onPress: () => sendReport('confusing') },
      { text: t('learn.reportOther'), onPress: () => sendReport('other') },
      { text: t('common.cancel'), style: 'cancel' },
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
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>{t('learn.topics')}</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable onPress={handleReport} style={{ padding: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>⚑</Text>
              </Pressable>
              {cat === 'random' && q.category ? (
                <CategoryBadge cat={q.category} small />
              ) : cat === 'random' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: RANDOM_META.bg, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, borderWidth: 1, borderColor: RANDOM_META.accent + '30' }}>
                  <Text style={{ fontSize: 11 }}>{RANDOM_ICON}</Text>
                  <Text style={{ color: RANDOM_META.text, fontSize: 11, fontFamily: 'Outfit_600SemiBold' }}>{t('learn.randomName')}</Text>
                </View>
              ) : (
                <CategoryBadge cat={cat} small />
              )}
            </View>
          </View>

          {/* Difficulty filter */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 18 }}>
            {DIFFICULTIES.map(d => {
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
                    {t(`learn.diff.${d}`)}
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
              {t('learn.context')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
              {q.ctx}
            </Text>
          </View>
        )}

        {/* Next button */}
        {answered && (
          <View style={{ paddingHorizontal: 20 }}>
            <Pressable onPress={isLast ? finishTopic : next}>
              <LinearGradient
                colors={correct ? ['#2ec87a', '#1a9a5c'] : [col.accent, col.accent + '99']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>
                  {isLast ? t('learn.topicDone') : t('learn.next')}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
