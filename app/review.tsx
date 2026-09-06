import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useIsPro } from '@/hooks/usePremium';
import { useProgress } from '@/context/ProgressContext';
import { fetchQuestions } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { awardProgress } from '@/lib/gamification';
import { shuffleQuestion } from '@/lib/utils';
import { feedback } from '@/lib/feedback';
import { markDailyPlayed } from '@/lib/dailyRoute';
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import { REVIEW_SESSION_SIZE, type ReviewItem } from '@/lib/review';
import { PRO_ACCENT } from '@/lib/pro';
import type { AnswerState, Question } from '@/types';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

type Phase = 'loading' | 'empty' | 'playing' | 'done';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function ReviewScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const isPro = useIsPro();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('loading');
  const [queue, setQueue] = useState<Question[]>([]);
  const [dueTotal, setDueTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    if (!isPro) router.replace('/paywall?source=review' as any);
  }, [isPro, router]);

  const load = useCallback(async () => {
    if (!user || guest || offline) { setPhase('empty'); return; }

    // Sembrar antes de leer: así la primera sesión ya viene con todo lo que el
    // usuario había fallado históricamente, en vez de estar vacía.
    // Un fallo aquí (migración sin aplicar, red) no puede impedir la sesión:
    // la cola que ya existiera sigue sirviendo.
    try { await supabase.rpc('seed_review_items'); } catch { /* no bloquea */ }

    const [{ data }, pool] = await Promise.all([
      supabase.rpc('fetch_review_queue', { p_limit: REVIEW_SESSION_SIZE }),
      fetchQuestions(),
    ]);

    const items: ReviewItem[] = (data as any)?.items ?? [];
    setDueTotal((data as any)?.due ?? items.length);

    // El servidor manda los ids ya ordenados; el banco completo ya está en
    // caché, así que las preguntas se resuelven en local sin otra consulta.
    const byId = new Map(pool.filter(q => q.id).map(q => [q.id!, q]));
    const resolved = items
      .map(item => byId.get(item.questionId))
      .filter((question): question is Question => !!question)
      .map(shuffleQuestion);

    setQueue(resolved);
    setPhase(resolved.length === 0 ? 'empty' : 'playing');
  }, [guest, offline, user?.id]);

  useEffect(() => { void load(); }, [load]);

  const question = queue[index];
  const answered = selected !== null;

  const answer = async (choice: number) => {
    if (answered || !question?.id) return;
    const right = choice === question.ans;
    setSelected(choice);
    setCorrectCount(current => current + (right ? 1 : 0));
    if (right) feedback.correct(); else feedback.wrong();

    const { data } = await supabase.rpc('record_review_answer', {
      p_question_id: question.id,
      p_correct: right,
    });
    if ((data as any)?.mastered) setMastered(current => current + 1);
  };

  const next = async () => {
    setSelected(null);
    if (index + 1 < queue.length) { setIndex(index + 1); return; }

    setPhase('done');
    void markDailyPlayed();
    void logAppsFlyerEvent('cg_pro_review_completed', {
      answered: queue.length,
      correct: correctCount,
    });
    // Recompensa modesta y sin multiplicador: repasar ya tiene premio propio.
    const award = await awardProgress(queue.length * 4, queue.length, false, 'review');
    if (award) celebrate(award);
  };

  const optionState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === question.ans) return 'correct';
    return i === selected ? 'wrong' : null;
  };

  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={PRO_ACCENT} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'empty' || phase === 'done') {
    const finished = phase === 'done';
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: Space.screen, gap: 16 }}>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 56 }}>{finished ? '🎉' : '✅'}</Text>
            <Text style={{ color: C.text, ...Type.screenTitle, textAlign: 'center' }}>
              {t(finished ? 'review.doneTitle' : 'review.emptyTitle')}
            </Text>
            <Text style={{ color: C.textMuted, ...Type.bodyRegular, textAlign: 'center', maxWidth: 320 }}>
              {finished
                ? t('review.doneBody', { correct: correctCount, total: queue.length })
                : offline || guest || !user
                  ? t('review.needsAccount')
                  : t('review.emptyBody')}
            </Text>
            {finished && mastered > 0 && (
              <Text style={{ color: PRO_ACCENT, fontFamily: Font.bold, fontSize: 15 }}>
                {t('review.mastered', { count: mastered })}
              </Text>
            )}
            {finished && dueTotal > queue.length && (
              <Text style={{ color: C.textFaint, ...Type.small }}>
                {t('review.remaining', { count: dueTotal - queue.length })}
              </Text>
            )}
          </View>

          <Pressable onPress={() => router.back()}>
            <LinearGradient
              colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: Radius.card, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 16 }}>{t('common.close')}</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: Space.screen, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={{ color: C.textMuted, fontSize: 21 }}>✕</Text>
          </Pressable>
          <Text style={{ color: C.textMuted, fontFamily: Font.extra, fontSize: 14, fontVariant: ['tabular-nums'] }}>
            {index + 1}/{queue.length}
          </Text>
          <Text style={{ color: PRO_ACCENT, fontFamily: Font.extra, fontSize: 13 }}>
            🔁 {t('review.title')}
          </Text>
        </View>

        <View style={{ height: 5, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' }}>
          <View style={{
            width: `${Math.round((index / queue.length) * 100)}%`,
            height: '100%', backgroundColor: PRO_ACCENT,
          }} />
        </View>

        <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {question?.category ? <CategoryBadge cat={question.category} small /> : null}
          <Text style={{ color: C.text, ...Type.question }}>{question?.q}</Text>

          <View style={{ gap: 10 }}>
            {question?.opts.map((option, i) => (
              <OptionBtn
                key={`${index}-${i}`}
                text={option}
                letter={LETTERS[i]}
                state={optionState(i)}
                dimmed={answered && i !== selected && i !== question.ans}
                disabled={answered}
                onPress={() => void answer(i)}
              />
            ))}
          </View>

          {answered && question?.ctx ? (
            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.card,
              borderWidth: 1, borderColor: C.border, padding: 14,
              ...cardShadow(isDark),
            }}>
              <Text style={{ color: C.textBody, ...Type.secondary, lineHeight: 22 }}>{question.ctx}</Text>
            </View>
          ) : null}
        </ScrollView>

        {answered && (
          <Pressable onPress={() => void next()}>
            <LinearGradient
              colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: Radius.card, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 16 }}>
                {index + 1 < queue.length ? t('common.next') : t('review.finish')}
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
