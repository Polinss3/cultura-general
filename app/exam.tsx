import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
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
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import { markDailyPlayed } from '@/lib/dailyRoute';
import {
  EXAM_DURATION_MS,
  EXAM_QUESTIONS,
  buildExam,
  examBand,
  examGrade,
  examPassed,
  examRewards,
  formatExamClock,
} from '@/lib/exam';
import { PRO_ACCENT } from '@/lib/pro';
import type { Question } from '@/types';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

type Phase = 'loading' | 'intro' | 'playing' | 'result';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

interface ExamOutcome {
  grade: number;
  best: number | null;
  percentile: number | null;
}

export default function ExamScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const isPro = useIsPro();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [remainingMs, setRemainingMs] = useState(EXAM_DURATION_MS);
  const [outcome, setOutcome] = useState<ExamOutcome | null>(null);
  const [saving, setSaving] = useState(false);

  const startedAt = useRef<number>(0);
  const finishedRef = useRef(false);

  // El examen es contenido PRO puro (no es contenido retirado), así que aquí
  // no hay excepción de herencia como en Aventura.
  useEffect(() => {
    if (!isPro) router.replace('/paywall?source=exam' as any);
  }, [isPro, router]);

  useEffect(() => {
    let cancelled = false;
    fetchQuestions().then(pool => {
      if (cancelled) return;
      setQuestions(buildExam(pool).map(shuffleQuestion));
      setPhase('intro');
    }).catch(() => {
      if (!cancelled) setPhase('intro');
    });
    return () => { cancelled = true; };
  }, []);

  const finish = useCallback(async (finalAnswers: (number | null)[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const correct = finalAnswers.reduce<number>(
      (total, selected, i) => total + (selected !== null && selected === questions[i]?.ans ? 1 : 0),
      0,
    );
    const total = questions.length;
    const grade = examGrade(correct, total);
    const durationMs = Date.now() - startedAt.current;

    setPhase('result');
    setOutcome({ grade, best: null, percentile: null });
    void logAppsFlyerEvent('cg_pro_exam_completed', { grade, correct, total });
    void markDailyPlayed();

    if (!user || guest || offline) return;

    setSaving(true);
    const { data } = await supabase.rpc('save_exam_result', {
      p_correct: correct,
      p_total: total,
      p_duration_ms: Math.max(0, Math.round(durationMs)),
    });
    if (data) {
      setOutcome({
        grade: Number((data as any).grade ?? grade),
        best: (data as any).best != null ? Number((data as any).best) : null,
        percentile: (data as any).percentile ?? null,
      });
    }

    const { xp, coins } = examRewards(correct, total);
    // Sin multiplicador de racha: el examen se puede repetir a voluntad y no
    // debe convertirse en el atajo para farmear XP.
    const award = await awardProgress(xp, coins, false, 'exam');
    setSaving(false);
    if (award) celebrate(award);
  }, [celebrate, guest, offline, questions, user]);

  // Cronómetro. Al agotarse, lo que quede sin contestar cuenta como en blanco.
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      const left = EXAM_DURATION_MS - (Date.now() - startedAt.current);
      setRemainingMs(Math.max(0, left));
      if (left <= 0) {
        clearInterval(timer);
        setAnswers(current => { void finish(current); return current; });
      }
    }, 500);
    return () => clearInterval(timer);
  }, [finish, phase]);

  const start = () => {
    if (questions.length === 0) return;
    startedAt.current = Date.now();
    finishedRef.current = false;
    setAnswers(new Array(questions.length).fill(null));
    setIndex(0);
    setRemainingMs(EXAM_DURATION_MS);
    setPhase('playing');
    void logAppsFlyerEvent('cg_pro_exam_started', {});
  };

  const answer = (selected: number | null) => {
    feedback.tap();
    setAnswers(current => {
      const next = [...current];
      next[index] = selected;
      if (index + 1 >= questions.length) void finish(next);
      return next;
    });
    if (index + 1 < questions.length) setIndex(index + 1);
  };

  const confirmExit = () => {
    if (phase !== 'playing') { router.back(); return; }
    Alert.alert(t('exam.exitTitle'), t('exam.exitMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('exam.exitConfirm'), style: 'destructive', onPress: () => router.back() },
    ]);
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

  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ padding: Space.screen, gap: 18 }}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ color: C.textMuted, fontSize: 21 }}>←</Text>
          </Pressable>

          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 52 }}>📝</Text>
            <Text style={{ color: C.text, ...Type.screenTitle, textAlign: 'center' }}>{t('exam.title')}</Text>
            <Text style={{ color: C.textMuted, ...Type.bodyRegular, textAlign: 'center', maxWidth: 320 }}>
              {t('exam.intro')}
            </Text>
          </View>

          <View style={{
            backgroundColor: C.surface, borderRadius: Radius.cardLg, borderWidth: 1,
            borderColor: C.border, padding: 18, gap: 12, ...cardShadow(isDark),
          }}>
            <Rule icon="🧠" text={t('exam.ruleQuestions', { count: questions.length || EXAM_QUESTIONS })} />
            <Rule icon="⏱️" text={t('exam.ruleTime')} />
            <Rule icon="🙈" text={t('exam.ruleNoFeedback')} />
            <Rule icon="🎓" text={t('exam.ruleGrade')} />
          </View>

          <Pressable onPress={start} disabled={questions.length === 0}>
            <LinearGradient
              colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: Radius.card, padding: 17, alignItems: 'center', opacity: questions.length === 0 ? 0.5 : 1 }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 17 }}>{t('exam.start')}</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'playing') {
    const question = questions[index];
    const urgent = remainingMs < 60_000;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
        <View style={{ padding: Space.screen, gap: 14, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable onPress={confirmExit} hitSlop={10}>
              <Text style={{ color: C.textMuted, fontSize: 21 }}>✕</Text>
            </Pressable>
            <Text style={{ color: C.textMuted, fontFamily: Font.extra, fontSize: 14, fontVariant: ['tabular-nums'] }}>
              {index + 1}/{questions.length}
            </Text>
            <Text style={{
              color: urgent ? C.wrongText : C.textMuted,
              fontFamily: Font.black, fontSize: 16, fontVariant: ['tabular-nums'],
            }}>
              {formatExamClock(remainingMs)}
            </Text>
          </View>

          <View style={{ height: 5, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' }}>
            <View style={{
              width: `${Math.round(((index) / questions.length) * 100)}%`,
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
                  // Un examen no corrige sobre la marcha: ninguna opción se
                  // pinta de verde ni de rojo hasta el final.
                  state={null}
                  onPress={() => answer(i)}
                />
              ))}
            </View>

            <Pressable onPress={() => answer(null)} style={{ alignSelf: 'center', paddingVertical: 12 }}>
              <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 14 }}>
                {t('exam.skip')}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Resultado ─────────────────────────────────────────────────────────────
  const correct = answers.reduce<number>(
    (total, selected, i) => total + (selected !== null && selected === questions[i]?.ans ? 1 : 0),
    0,
  );
  const grade = outcome?.grade ?? examGrade(correct, questions.length);
  const band = examBand(grade);
  const passed = examPassed(grade);
  // Fallos y preguntas en blanco: las dos cosas hay que repasarlas, y una en
  // blanco (`selected === null`) nunca coincide con la respuesta correcta.
  const mistakes = questions
    .map((question, i) => ({ question, selected: answers[i], i }))
    .filter(({ question, selected }) => selected !== question.ans);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: Space.screen, gap: 18, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ color: C.textMuted, ...Type.sectionLabel }}>{t('exam.yourGrade')}</Text>
          <Text style={{
            color: passed ? C.correctText : C.wrongText,
            fontSize: 66, fontFamily: Font.black, fontVariant: ['tabular-nums'],
          }}>
            {grade.toFixed(1).replace('.', ',')}
          </Text>
          <Text style={{ color: C.text, ...Type.cardTitleLg }}>{t(`exam.bands.${band}`)}</Text>
          <Text style={{ color: C.textMuted, ...Type.secondary }}>
            {t('exam.correctCount', { correct, total: questions.length })}
          </Text>
          {saving ? <ActivityIndicator color={PRO_ACCENT} style={{ marginTop: 6 }} /> : null}
          {outcome?.percentile != null && (
            <Text style={{ color: PRO_ACCENT, fontFamily: Font.bold, fontSize: 14, marginTop: 4 }}>
              {t('exam.percentile', { percentile: outcome.percentile })}
            </Text>
          )}
          {outcome?.best != null && outcome.best > grade && (
            <Text style={{ color: C.textFaint, ...Type.small }}>
              {t('exam.best', { grade: outcome.best.toFixed(1).replace('.', ',') })}
            </Text>
          )}
        </View>

        {mistakes.length > 0 && (
          <View style={{ gap: 10 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel }}>{t('exam.reviewTitle')}</Text>
            {mistakes.map(({ question, selected, i }) => (
              <View key={i} style={{
                backgroundColor: C.surface, borderRadius: Radius.card,
                borderWidth: 1, borderColor: C.border, padding: 14, gap: 6,
              }}>
                <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>{question.q}</Text>
                <Text style={{ color: C.wrongText, ...Type.small }}>
                  {selected === null
                    ? t('exam.blank')
                    : t('exam.youAnswered', { answer: question.opts[selected] })}
                </Text>
                <Text style={{ color: C.correctText, ...Type.small }}>
                  {t('exam.correctAnswer', { answer: question.opts[question.ans] })}
                </Text>
                {question.ctx ? (
                  <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 19 }}>{question.ctx}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

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

function Rule({ icon, text }: { icon: string; text: string }) {
  const { C } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Text style={{ fontSize: 19, width: 26, textAlign: 'center' }}>{icon}</Text>
      <Text style={{ color: C.textBody, ...Type.body, flex: 1 }}>{text}</Text>
    </View>
  );
}
