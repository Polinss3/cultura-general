import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { FlagOption } from '@/components/FlagOption';
import { YearOption } from '@/components/YearOption';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { usePowerups } from '@/hooks/usePowerups';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import {
  fetchQuestions, fetchQuestionCounts, incrementProfileStats, reportQuestion,
  type CategoryCounts,
} from '@/lib/db';
import { noteReviewBlocker } from '@/lib/reviewGate';
import { awardProgress, bumpMissions } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { getLocalQuestions, CAT_COLORS, CAT_ICONS, ALL_CATEGORIES, catTint } from '@/constants/questions';
import { buildLearnFeed } from '@/lib/learnFeed';
import { getCurrentLang } from '@/lib/i18n';
import { pickRandomFresh, shuffleQuestion } from '@/lib/utils';
import { getRecentIds, pushSeen } from '@/lib/questionHistory';
import { markDailyPlayed } from '@/lib/dailyRoute';
import { feedback } from '@/lib/feedback';
import { AnswerState, Category, Question } from '@/types';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, warmGradient } from '@/constants/theme';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type LearnCat = Category | 'random';

const DIFFICULTIES: Difficulty[] = ['all', 'easy', 'medium', 'hard'];

const LETTERS = ['A', 'B', 'C', 'D'] as const;

const RANDOM_ICON = '🎲';
// Preguntas de trivia por tanda. Sin tope se servía el tema entero: en
// aleatorio son ~1.589 del banco, y `buildLearnFeed` les sumaba todas las
// banderas y todos los años, así que el contador decía "1 / 1883" y armar la
// lista —196 rondas de banderas, cada una barajando el catálogo— se hacía en el
// hilo de JS al entrar. Con 60 la tanda queda en ~90 contando la mezcla, y
// `pickRandomFresh` se encarga de que la siguiente traiga otras.
const SESSION_SIZE = 60;
// Por encima de este número de preguntas los segmentos quedan por debajo de
// 1 px y no se ven: a partir de ahí se muestra una barra continua.
const SEGMENTED_UP_TO = 14;

/**
 * Redondea a la baja para que el "+" siga siendo cierto: 182 → 180, 106 → 100,
 * 47 → 45. Por debajo de 10 se muestra la cifra exacta, que redondear ahí solo
 * quitaría información.
 */
function roundDownCount(n: number): number {
  if (n < 10) return n;
  const step = n >= 100 ? 10 : 5;
  return Math.floor(n / step) * step;
}

function filterByDifficulty(questions: Question[], diff: Difficulty): Question[] {
  if (diff === 'all') return questions;
  // Los tres orígenes traen ya la dificultad: la trivia remota (`mapQuestion`),
  // el banco local empaquetado y las banderas/años de `buildLearnFeed`. Por eso
  // el filtro es estricto; antes dejaba pasar las que no la traían y, como no la
  // traía ninguna de trivia, no acotaba nada.
  // Si alguna llegara sin ella, cuenta como 'medium' —el `default` de la tabla—
  // en vez de colarse en los tres niveles.
  return questions.filter(q => (q.difficulty ?? 'medium') === diff);
}

export default function LearnScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const { C, isDark } = useTheme();
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
  const [combo, setCombo] = useState(0);
  const comboScale = useRef(new Animated.Value(0)).current;

  // Nº real de preguntas por tema, para el selector. Sin red se queda vacío y
  // cada tema cae al tamaño del banco empaquetado.
  const [counts, setCounts] = useState<CategoryCounts>({});

  // Power-ups usables durante la pregunta (50/50, pista, saltar).
  const canUsePowerups = !!user && !guest && !offline;
  const { inventory, consume } = usePowerups(canUsePowerups, user?.id);
  const [fiftyHidden, setFiftyHidden] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);

  // Color de acento de la pantalla: el de la categoría, o la marca en aleatorio.
  const accent = cat && cat !== 'random' ? readableOn(CAT_COLORS[cat].accent, isDark) : C.brand;

  // Recuentos del catálogo: una sola petición, cacheada 6 h en el cliente.
  useEffect(() => {
    if (offline) return;
    let cancelled = false;
    fetchQuestionCounts().then(c => { if (!cancelled) setCounts(c); });
    return () => { cancelled = true; };
  }, [offline]);

  // Micro-animación de "pop" cuando el combo sube.
  const bumpCombo = () => {
    comboScale.setValue(0.6);
    Animated.spring(comboScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }).start();
  };

  useEffect(() => {
    if (!cat) return;
    setLoadingQ(true);
    setAllQuestions([]);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    setCombo(0);
    setFiftyHidden([]);
    setHintShown(false);
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
      const ordered = pickRandomFresh(source, recent, q => q.id, Math.min(source.length, SESSION_SIZE));
      // Aprender es el modo "todo": la trivia del banco más las banderas y los
      // años que le tocan al tema, ya intercalados.
      const mixed = buildLearnFeed(ordered, cat);
      setAllQuestions(mixed);
      setQuestions(mixed);
      setLoadingQ(false);
    })();
    // Recargar al cambiar de idioma para servir preguntas en el idioma activo.
  }, [cat, i18n.language]);

  // Refilter when difficulty changes
  useEffect(() => {
    if (allQuestions.length === 0) return;
    const filtered = filterByDifficulty(allQuestions, difficulty);
    // Si el nivel se queda sin preguntas servimos la tanda entera antes que una
    // pantalla vacía. Con el catálogo remoto no llega a pasar; sin red sí, porque
    // el banco empaquetado son 3-5 por tema y hay alguno (Mitología) que las
    // tiene todas del mismo nivel. Ahí la píldora vuelve a no acotar nada.
    setQuestions(filtered.length > 0 ? filtered : allQuestions);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    setCombo(0);
    setFiftyHidden([]);
    setHintShown(false);
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

    markDailyPlayed(); // paso "practica hoy" de la ruta diaria

    // Combo de aciertos consecutivos: refuerzo visual + háptico creciente.
    if (correct) {
      setCombo(c => {
        const nc = c + 1;
        if (nc >= 2) {
          bumpCombo();
          if (nc >= 3) feedback.combo(nc); // vibración extra a partir de x3
        }
        return nc;
      });
    } else {
      setCombo(0);
    }

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
    // Las de bandera/año no están en la BD y solo traen `localId`.
    const seenId = q.id ?? q.localId;
    if (cat && seenId) {
      pushSeen('learn', cat, [seenId]);
    }
  };

  const next = () => {
    setQIdx(x => x + 1);
    setSelected(null);
    setAnswered(false);
    setShowCtx(false);
    setFiftyHidden([]);
    setHintShown(false);
  };

  // Usar un power-up en la pregunta actual (antes de responder).
  const usePowerUp = (id: string) => {
    if (!canUsePowerups || (inventory[id] ?? 0) <= 0) return;
    if (id === 'pw_skip') {
      consume(id);
      next();
      return;
    }
    if (answered) return; // 50/50 y pista solo tienen sentido antes de responder
    if (id === 'pw_5050' && q) {
      const wrong = q.opts.map((_, idx) => idx).filter(idx => idx !== q.ans);
      setFiftyHidden(pickRandomFresh(wrong, [], () => undefined, 2));
    } else if (id === 'pw_hint') {
      // Las de bandera y año no traen contexto: sin esta guarda, la pista se
      // consumía igual y no mostraba nada.
      if (!q?.ctx) return;
      setHintShown(true);
    } else {
      return;
    }
    consume(id);
  };

  const finishTopic = () => {
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
    setCombo(0);
  };

  // ─ Category picker
  if (!cat) {
    const bank = getLocalQuestions(getCurrentLang());

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
          <Text style={{ color: C.text, ...Type.screenTitle, marginBottom: 4 }}>
            {t('learn.pickerTitle')}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 16, lineHeight: 23 }}>
            {t('learn.pickerSub')}
          </Text>

          {/* Sorpréndeme, a ancho completo */}
          <Pressable onPress={() => setCat('random')}>
            <LinearGradient
              colors={warmGradient(isDark)}
              start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }}
              style={{
                borderRadius: Radius.cardLg, padding: 16,
                borderWidth: 1.5, borderColor: C.borderWarm,
                flexDirection: 'row', alignItems: 'center', gap: 14,
              }}
            >
              <Text style={{ fontSize: 32 }}>{RANDOM_ICON}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black }}>
                  {t('learn.randomName')}
                </Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
                  {t('learn.randomDesc')}
                </Text>
              </View>
              <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
            </LinearGradient>
          </Pressable>

          {/* Rejilla de temas: dos columnas, y el que sobra se queda solo en la
              última fila con el mismo ancho que los demás. */}
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', rowGap: 10, marginTop: 14,
          }}>
            {ALL_CATEGORIES.map(c => {
              const tone = catTint(CAT_COLORS[c], isDark);
              // El recuento real del catálogo; sin red, el banco empaquetado.
              const count = counts[c] ?? bank[c].length;
              const shown = roundDownCount(count);

              return (
                <Pressable key={c} onPress={() => setCat(c)} style={{ width: '48.5%' }}>
                  <View style={{
                    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                    borderRadius: Radius.card, padding: 14, gap: 7, minHeight: 118,
                  }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 13,
                      backgroundColor: tone.bg, alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 20 }}>{CAT_ICONS[c]}</Text>
                    </View>
                    <View>
                      <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>
                        {t(`categories.${c}`)}
                      </Text>
                      <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginTop: 2 }}>
                        {shown < count
                          ? t('learn.countQuestions', { count: shown })
                          : t('learn.countQuestionsExact', { count: shown })}
                      </Text>
                    </View>
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
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!q) return null;

  const correct = selected === q.ans;
  const isLast = qIdx % questions.length === questions.length - 1;

  const powerUps: PowerUpButton[] = [
    { id: 'pw_5050', icon: '✂️', label: '50/50', count: inventory['pw_5050'] ?? 0 },
    // La pista solo se ofrece si hay algo que contar: las preguntas de bandera
    // y de año no llevan contexto.
    ...(q.ctx
      ? [{ id: 'pw_hint', icon: '💡', label: t('ladder.pwHint'), count: inventory['pw_hint'] ?? 0 }]
      : []),
    { id: 'pw_skip', icon: '⏭️', label: t('ladder.pwSkip'), count: inventory['pw_skip'] ?? 0 },
  ];

  const handleReport = () => {
    if (!user || !q.id || reportedRef.current.has(q.id)) return;
    const sendReport = (reason: 'incorrect' | 'confusing' | 'other') => {
      if (!q.id) return;
      reportedRef.current.add(q.id);
      // Quien acaba de avisarnos de un fallo no es a quien pedirle 5 estrellas.
      noteReviewBlocker();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ padding: Space.screen }}>
          {/* Nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Pressable onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} hitSlop={8}>
              <Text style={{ color: C.textMuted, fontSize: 20 }}>←</Text>
              <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.bold }}>{t('learn.topics')}</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {/* Solo las del banco se pueden reportar: las de bandera y año
                  salen del catálogo local y no tienen fila que señalar. */}
              {q.id && (
                <Pressable onPress={handleReport} style={{ padding: 6 }} hitSlop={8}>
                  <Text style={{ color: C.textFaint, fontSize: 18 }}>⚑</Text>
                </Pressable>
              )}
              {cat === 'random' && q.category ? (
                <CategoryBadge cat={q.category} small />
              ) : cat === 'random' ? (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: C.brandTint, paddingVertical: 6, paddingHorizontal: 12,
                  borderRadius: Radius.pill,
                }}>
                  <Text style={{ fontSize: 12 }}>{RANDOM_ICON}</Text>
                  <Text style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.extra }}>{t('learn.randomName')}</Text>
                </View>
              ) : (
                <CategoryBadge cat={cat} small />
              )}
            </View>
          </View>

          {/* Difficulty filter */}
          <View style={{ flexDirection: 'row', gap: 7, marginBottom: 18 }}>
            {DIFFICULTIES.map(d => {
              const active = difficulty === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(d)}
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    borderRadius: Radius.pill,
                    backgroundColor: active ? C.brand : C.surface,
                    borderWidth: 1,
                    borderColor: active ? C.brand : C.border,
                  }}
                >
                  <Text style={{
                    color: active ? C.onBrand : C.textMuted,
                    fontFamily: active ? Font.extra : Font.bold,
                    fontSize: 13,
                  }}>
                    {t(`learn.diff.${d}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Progreso: segmentos si el tema es corto; barra continua si no.
              Con bancos de 100+ preguntas los segmentos no caben y la fila se
              quedaba en blanco. */}
          {questions.length <= SEGMENTED_UP_TO ? (
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 14 }}>
              {questions.map((_, i) => (
                <View key={i} style={{
                  flex: 1, height: 5, borderRadius: Radius.pill,
                  backgroundColor: i <= qIdx % questions.length ? C.brand : C.track,
                }} />
              ))}
            </View>
          ) : (
            <View style={{ height: 5, borderRadius: Radius.pill, backgroundColor: C.track, marginBottom: 14, overflow: 'hidden' }}>
              <View style={{
                height: '100%', borderRadius: Radius.pill, backgroundColor: C.brand,
                width: `${(((qIdx % questions.length) + 1) / questions.length) * 100}%`,
              }} />
            </View>
          )}

          {/* Question counter + combo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra }}>
              {(qIdx % questions.length) + 1} / {questions.length}
            </Text>
            {combo >= 2 && (
              <Animated.View style={{ transform: [{ scale: comboScale }] }}>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: C.brandTint, borderWidth: 1, borderColor: C.borderWarm,
                  borderRadius: Radius.pill, paddingVertical: 5, paddingHorizontal: 12,
                }}>
                  <Text style={{ fontSize: 13 }}>🔥</Text>
                  <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>
                    {t('learn.combo', { count: combo })}
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Token grande de las preguntas de bandera y de año: la bandera a
              reconocer, o el año del que hay que decir qué pasó. */}
          {q.media && (
            <View style={{
              backgroundColor: C.surface, borderRadius: 24,
              paddingVertical: q.media.kind === 'flag' ? 24 : 28,
              alignItems: 'center', borderWidth: 1, borderColor: C.border,
              marginBottom: 18,
            }}>
              {q.media.kind === 'flag' ? (
                <Text style={{ fontSize: 96 }}>{q.media.value}</Text>
              ) : (
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ color: C.text, fontSize: 64, fontFamily: Font.black, letterSpacing: -1 }}
                >
                  {q.media.value}
                </Text>
              )}
            </View>
          )}

          {/* Question */}
          {q.lead && (
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 6 }}>
              {q.lead}
            </Text>
          )}
          <Text style={{ color: C.text, ...Type.question, marginBottom: 20 }}>
            {q.q}
          </Text>

          {/* Options */}
          {q.layout ? (
            // Banderas y años en rejilla 2×2: son opciones cortas y se comparan
            // de un vistazo, igual que en sus modos de la pestaña de Retos.
            <View style={{
              flexDirection: 'row', flexWrap: 'wrap',
              justifyContent: 'space-between', rowGap: 11,
            }}>
              {q.opts.map((opt, i) =>
                fiftyHidden.includes(i) ? (
                  <View key={i} style={{
                    width: '48.5%', borderWidth: 1.5, borderColor: C.border,
                    backgroundColor: C.surfaceSunk, borderRadius: 18, opacity: 0.5,
                    minHeight: 104, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ color: C.textFaint, fontSize: 16, fontFamily: Font.semi }}>—</Text>
                  </View>
                ) : q.layout === 'flags' ? (
                  <FlagOption
                    key={i}
                    flag={opt}
                    state={getState(i)}
                    dimmed={answered && getState(i) === null}
                    onPress={() => handle(i)}
                  />
                ) : (
                  <YearOption
                    key={i}
                    year={opt}
                    state={getState(i)}
                    dimmed={answered && getState(i) === null}
                    onPress={() => handle(i)}
                  />
                ),
              )}
            </View>
          ) : (
            <View style={{ gap: 11 }}>
              {q.opts.map((opt, i) =>
                fiftyHidden.includes(i) ? (
                  <View key={i} style={{
                    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surfaceSunk,
                    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 16, opacity: 0.5,
                    minHeight: 60, justifyContent: 'center',
                  }}>
                    <Text style={{ color: C.textFaint, fontSize: 16, fontFamily: Font.semi }}>—</Text>
                  </View>
                ) : (
                  <OptionBtn
                    key={i}
                    text={opt}
                    letter={LETTERS[i]}
                    state={getState(i)}
                    dimmed={answered && getState(i) === null}
                    onPress={() => handle(i)}
                  />
                ),
              )}
            </View>
          )}

          {/* Pista (power-up) */}
          {hintShown && !answered && q.ctx && (
            <View style={{
              marginTop: 16, padding: 16, backgroundColor: C.surface, borderRadius: Radius.card,
              borderWidth: 1.5, borderColor: C.borderWarm,
            }}>
              <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 15, marginBottom: 6 }}>
                {t('ladder.hint')}
              </Text>
              <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 22 }}>{q.ctx}</Text>
            </View>
          )}

          {/* Power-ups */}
          {canUsePowerups && !answered && powerUps.some(p => p.count > 0) && (
            <View style={{ marginTop: 18, gap: 9 }}>
              <Text style={{ color: C.textFaint, ...Type.sectionLabel, fontSize: 12 }}>
                {t('common.yourHelpers')}
              </Text>
              <PowerUpBar items={powerUps} onUse={usePowerUp} />
            </View>
          )}
        </View>

        {/* Context */}
        {showCtx && q.ctx && (
          <View style={{
            marginHorizontal: Space.screen, marginBottom: 16, padding: 16,
            backgroundColor: C.surface, borderRadius: Radius.card,
            borderWidth: 1.5, borderColor: C.borderWarm,
          }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, marginBottom: 6, fontSize: 15 }}>
              {t('learn.context')}
            </Text>
            <Text style={{ color: C.textBody, fontSize: 14, fontFamily: Font.regular, lineHeight: 22 }}>
              {q.ctx}
            </Text>
          </View>
        )}

        {/* Next button */}
        {answered && (
          <View style={{ paddingHorizontal: Space.screen }}>
            <Pressable onPress={isLast ? finishTopic : next}>
              <View style={{
                borderRadius: 18, padding: 16, alignItems: 'center',
                backgroundColor: correct ? C.correct : C.brand,
              }}>
                <Text style={{ color: C.onBrand, fontSize: 16, fontFamily: Font.extra }}>
                  {isLast ? t('learn.topicDone') : t('learn.next')}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <AdBannerSlot />
    </SafeAreaView>
  );
}
