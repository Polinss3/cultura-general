import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { YearOption } from '@/components/YearOption';
import { RoundHud } from '@/components/RoundHud';
import { RoundResult } from '@/components/RoundResult';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { awardProgress } from '@/lib/gamification';
import { REWARDS } from '@/lib/economy';
import { markDailyPlayed } from '@/lib/dailyRoute';
import { showResultInterstitial } from '@/lib/ads';
import {
  ERAS, buildRound, eventText, formatYear, poolFor, getYearRecords, saveYearRecord,
  type Scope, type YearDifficulty, type YearQuestion, type YearRecords,
} from '@/lib/years';
import { AnswerState } from '@/types';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, tint, warmGradient } from '@/constants/theme';

type Phase = 'picker' | 'playing' | 'done';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const DIFFICULTIES: YearDifficulty[] = ['all', 1, 2, 3];
const ALL_ICON = '🕰️';

interface Props {
  /** Conmutador de modo; solo se pinta en el selector, no durante la ronda. */
  header?: ReactNode;
  /** Avisa al anfitrión de que el récord pudo cambiar, para refrescarlo. */
  onRoundFinished?: () => void;
}

export function YearsGame({ header, onRoundFinished }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('picker');
  const [scope, setScope] = useState<Scope>('all');
  const [difficulty, setDifficulty] = useState<YearDifficulty>('all');
  const [records, setRecords] = useState<YearRecords>({});

  const [round, setRound] = useState<YearQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  /** Índice de la opción elegida dentro de la pregunta actual. */
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const finishedRef = useRef(false);

  // Igual que Banderas: el catálogo va empaquetado, así que se juega sin
  // conexión y como invitado. Solo las recompensas necesitan sesión.
  const canEarn = !!user && !guest && !offline;

  const loadRecords = useCallback(() => { getYearRecords().then(setRecords); }, []);
  useEffect(loadRecords, [loadRecords]);

  const start = (nextScope: Scope) => {
    const questions = buildRound(nextScope, difficulty);
    if (questions.length === 0) return;
    finishedRef.current = false;
    setScope(nextScope);
    setRound(questions);
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setNewRecord(false);
    setPhase('playing');
  };

  const finish = async (finalCorrect: number) => {
    // Una ronda solo se cierra una vez: ni doble recompensa ni doble
    // intersticial si `handleAnswer` llegara a reentrar.
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase('done');
    markDailyPlayed(); // cuenta como "practica hoy" en la ruta diaria
    const isRecord = await saveYearRecord(scope, finalCorrect);
    setNewRecord(isRecord);
    loadRecords();
    onRoundFinished?.();

    if (canEarn && finalCorrect > 0) {
      const award = await awardProgress(
        REWARDS.yearPerCorrect.xp * finalCorrect,
        REWARDS.yearPerCorrect.coins * finalCorrect,
        true,
        'years',
      );
      celebrate(award);
    }
    showResultInterstitial('years_complete');
  };

  /** `idx` es la posición de la opción pulsada; `isCorrect`, si era la buena. */
  const handleAnswer = (idx: number, isCorrect: boolean) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrectCount(nextCorrect);

    setTimeout(() => {
      if (qIdx + 1 >= round.length) {
        if (nextCorrect === round.length) setConfetti(true);
        finish(nextCorrect);
      } else {
        setQIdx(i => i + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 900);
  };

  const stateFor = (idx: number, isCorrect: boolean): AnswerState => {
    if (!answered) return null;
    if (isCorrect) return 'correct';
    if (idx === selected) return 'wrong';
    return null;
  };

  const scopeLabel = (s: Scope) =>
    s === 'all' ? t('years.allTime') : t(`years.eras.${s}`);

  const scopeIcon = (s: Scope) =>
    s === 'all' ? ALL_ICON : (ERAS.find(e => e.id === s)?.icon ?? ALL_ICON);

  // ─ Selector
  if (phase === 'picker') {
    const allCount = poolFor('all', difficulty).length;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
          {header}

          <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 16, lineHeight: 23 }}>
            {t('years.pickerSub')}
          </Text>

          {/* Dificultad */}
          <View style={{ flexDirection: 'row', gap: 7, marginBottom: 16 }}>
            {DIFFICULTIES.map(d => {
              const active = difficulty === d;
              return (
                <Pressable
                  key={String(d)}
                  onPress={() => setDifficulty(d)}
                  style={{
                    paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radius.pill,
                    backgroundColor: active ? C.brand : C.surface,
                    borderWidth: 1, borderColor: active ? C.brand : C.border,
                  }}
                >
                  <Text style={{
                    color: active ? C.onBrand : C.textMuted,
                    fontFamily: active ? Font.extra : Font.bold,
                    fontSize: 13,
                  }}>
                    {t(`years.difficulty.${d}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Toda la historia, a ancho completo */}
          <Pressable onPress={() => start('all')}>
            <LinearGradient
              colors={warmGradient(isDark)}
              start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }}
              style={{
                borderRadius: Radius.cardLg, padding: 16,
                borderWidth: 1.5, borderColor: C.borderWarm,
                flexDirection: 'row', alignItems: 'center', gap: 14,
              }}
            >
              <Text style={{ fontSize: 32 }}>{ALL_ICON}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black }}>
                  {t('years.allTime')}
                </Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
                  {t('years.countEvents', { count: allCount })}
                  {records.all ? ` · ${t('round.best', { n: records.all })}` : ''}
                </Text>
              </View>
              <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
            </LinearGradient>
          </Pressable>

          {/* Épocas */}
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', rowGap: 10, marginTop: 14,
          }}>
            {ERAS.map(era => {
              const count = poolFor(era.id, difficulty).length;
              const record = records[era.id];
              const disabled = count < 4;

              return (
                <Pressable
                  key={era.id}
                  onPress={() => !disabled && start(era.id)}
                  style={{ width: '48.5%', opacity: disabled ? 0.5 : 1 }}
                >
                  <View style={{
                    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                    borderRadius: Radius.card, padding: 14, gap: 7, minHeight: 118,
                  }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 13,
                      backgroundColor: tint(C.streak, isDark),
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 20 }}>{era.icon}</Text>
                    </View>
                    <View>
                      <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>
                        {t(`years.eras.${era.id}`)}
                      </Text>
                      <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginTop: 2 }}>
                        {t('years.countEvents', { count })}
                      </Text>
                      {record != null && (
                        <Text style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.bold, marginTop: 2 }}>
                          {t('round.best', { n: record })}
                        </Text>
                      )}
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

  // ─ Resultado
  if (phase === 'done') {
    return (
      <RoundResult
        correct={correctCount}
        total={round.length}
        scopeLabel={scopeLabel(scope)}
        newRecord={newRecord}
        confetti={confetti}
        onChangeScope={() => { setConfetti(false); setPhase('picker'); }}
        onPlayAgain={() => { setConfetti(false); start(scope); }}
      />
    );
  }

  // ─ Partida
  const q = round[qIdx];
  if (!q) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
        <RoundHud
          onExit={() => setPhase('picker')}
          scopeIcon={scopeIcon(scope)}
          scopeLabel={scopeLabel(scope)}
          index={qIdx}
          total={round.length}
          correctCount={correctCount}
        />

        {q.direction === 'eventToYear' ? (
          <>
            {/* Evento arriba y años en rejilla: una cifra ocupa poco y las
                cuatro se comparan de un vistazo, igual que las banderas. */}
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 6 }}>
              {t('years.whichYear')}
            </Text>
            <Text style={{ color: C.text, ...Type.question, marginBottom: 20 }}>
              {eventText(q.answer)}
            </Text>
            <View style={{
              flexDirection: 'row', flexWrap: 'wrap',
              justifyContent: 'space-between', rowGap: 11,
            }}>
              {q.years!.map((year, i) => (
                <YearOption
                  key={year}
                  year={formatYear(year)}
                  state={stateFor(i, year === q.answer.year)}
                  dimmed={answered && stateFor(i, year === q.answer.year) === null}
                  onPress={() => handleAnswer(i, year === q.answer.year)}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Año enorme arriba y eventos debajo en columna: los enunciados
                largos no caben en media celda. */}
            <View style={{
              backgroundColor: C.surface, borderRadius: 24, paddingVertical: 28,
              alignItems: 'center', borderWidth: 1, borderColor: C.border,
              marginBottom: 18, ...cardShadow(isDark),
            }}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: C.text, fontSize: 64, fontFamily: Font.black, letterSpacing: -1 }}
              >
                {formatYear(q.answer.year)}
              </Text>
            </View>
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 14 }}>
              {t('years.whatHappened')}
            </Text>
            <View style={{ gap: 11 }}>
              {q.events!.map((e, i) => (
                <OptionBtn
                  key={e.id}
                  text={eventText(e)}
                  letter={LETTERS[i]}
                  state={stateFor(i, e.id === q.answer.id)}
                  dimmed={answered && stateFor(i, e.id === q.answer.id) === null}
                  onPress={() => handleAnswer(i, e.id === q.answer.id)}
                />
              ))}
            </View>
          </>
        )}

        {/* Al revelar, año y hecho juntos: se aprende la pareja aunque falles.
            Solo hace falta en el sentido de rejilla; en el otro el año ya está
            enorme arriba y la correcta queda marcada en la lista. */}
        {answered && q.direction === 'eventToYear' && (
          <View style={{
            marginTop: 18, padding: 16, borderRadius: Radius.card,
            backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.borderWarm,
            flexDirection: 'row', alignItems: 'center', gap: 12,
          }}>
            <Text style={{ color: C.brandDeep, fontSize: 22, fontFamily: Font.black }}>
              {formatYear(q.answer.year)}
            </Text>
            <Text style={{ flex: 1, color: C.textBody, fontSize: 15, fontFamily: Font.bold }}>
              {eventText(q.answer)}
            </Text>
          </View>
        )}
      </ScrollView>
      <AdBannerSlot />
    </SafeAreaView>
  );
}
