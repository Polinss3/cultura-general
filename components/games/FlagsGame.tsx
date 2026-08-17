import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { FlagOption } from '@/components/FlagOption';
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
import { CONTINENTS, flagEmoji, type Continent } from '@/constants/flags';
import {
  buildRound, countryName, poolFor, getFlagRecords, saveFlagRecord,
  type FlagDifficulty, type FlagQuestion, type FlagRecords,
} from '@/lib/flags';
import { AnswerState } from '@/types';
import { useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, tint, warmGradient } from '@/constants/theme';

type Phase = 'picker' | 'playing' | 'done';
type Scope = Continent | 'all';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const DIFFICULTIES: FlagDifficulty[] = ['all', 1, 2, 3];

export const CONTINENT_ICON: Record<Continent, string> = {
  europa: '🏰',
  america: '🗽',
  africa: '🦁',
  asia: '🏯',
  oceania: '🏝️',
};

interface Props {
  /** Conmutador de modo; solo se pinta en el selector, no durante la ronda. */
  header?: ReactNode;
  /** Avisa al anfitrión de que el récord pudo cambiar, para refrescarlo. */
  onRoundFinished?: () => void;
}

export function FlagsGame({ header, onRoundFinished }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('picker');
  const [scope, setScope] = useState<Scope>('all');
  const [difficulty, setDifficulty] = useState<FlagDifficulty>('all');
  const [records, setRecords] = useState<FlagRecords>({});

  const [round, setRound] = useState<FlagQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const finishedRef = useRef(false);

  // El catálogo va empaquetado, así que Banderas funciona sin conexión y como
  // invitado. Solo las recompensas necesitan sesión.
  const canEarn = !!user && !guest && !offline;

  const loadRecords = useCallback(() => { getFlagRecords().then(setRecords); }, []);
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
    const isRecord = await saveFlagRecord(scope, finalCorrect);
    setNewRecord(isRecord);
    loadRecords();
    onRoundFinished?.();

    if (canEarn && finalCorrect > 0) {
      const award = await awardProgress(
        REWARDS.flagPerCorrect.xp * finalCorrect,
        REWARDS.flagPerCorrect.coins * finalCorrect,
        true,
        'flags',
      );
      celebrate(award);
    }
    showResultInterstitial('flags_complete');
  };

  const handleAnswer = (cc: string) => {
    if (answered) return;
    const q = round[qIdx];
    setSelected(cc);
    setAnswered(true);
    const isCorrect = cc === q.answer.cc;
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

  const stateFor = (cc: string): AnswerState => {
    if (!answered) return null;
    if (cc === round[qIdx].answer.cc) return 'correct';
    if (cc === selected) return 'wrong';
    return null;
  };

  const scopeLabel = (s: Scope) =>
    s === 'all' ? t('world.allWorld') : t(`world.continents.${s}`);

  // ─ Selector
  if (phase === 'picker') {
    const worldCount = poolFor('all', difficulty).length;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: Space.screen, paddingBottom: 40 }}>
          {header}

          <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 16, lineHeight: 23 }}>
            {t('world.pickerSub')}
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
                    {t(`world.difficulty.${d}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Todo el mundo, a ancho completo */}
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
              <Text style={{ fontSize: 32 }}>🌍</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black }}>
                  {t('world.allWorld')}
                </Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
                  {t('world.countFlags', { count: worldCount })}
                  {records.all ? ` · ${t('round.best', { n: records.all })}` : ''}
                </Text>
              </View>
              <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
            </LinearGradient>
          </Pressable>

          {/* Continentes */}
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', rowGap: 10, marginTop: 14,
          }}>
            {CONTINENTS.map(cont => {
              const count = poolFor(cont, difficulty).length;
              const record = records[cont];
              const disabled = count < 4;

              return (
                <Pressable
                  key={cont}
                  onPress={() => !disabled && start(cont)}
                  style={{ width: '48.5%', opacity: disabled ? 0.5 : 1 }}
                >
                  <View style={{
                    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                    borderRadius: Radius.card, padding: 14, gap: 7, minHeight: 118,
                  }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 13,
                      backgroundColor: tint(C.social, isDark),
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ fontSize: 20 }}>{CONTINENT_ICON[cont]}</Text>
                    </View>
                    <View>
                      <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>
                        {t(`world.continents.${cont}`)}
                      </Text>
                      <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginTop: 2 }}>
                        {t('world.countFlags', { count })}
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
          scopeIcon={scope === 'all' ? '🌍' : CONTINENT_ICON[scope]}
          scopeLabel={scopeLabel(scope)}
          index={qIdx}
          total={round.length}
          correctCount={correctCount}
        />

        {q.direction === 'flagToName' ? (
          <>
            {/* Bandera grande arriba, nombres debajo en una columna: los nombres
                largos no caben en media celda. */}
            <View style={{
              backgroundColor: C.surface, borderRadius: 24, paddingVertical: 24,
              alignItems: 'center', borderWidth: 1, borderColor: C.border,
              marginBottom: 18, ...cardShadow(isDark),
            }}>
              <Text style={{ fontSize: 96 }}>{flagEmoji(q.answer.cc)}</Text>
            </View>
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 14 }}>
              {t('world.whichCountry')}
            </Text>
            <View style={{ gap: 11 }}>
              {q.options.map((opt, i) => (
                <OptionBtn
                  key={opt.cc}
                  text={countryName(opt)}
                  letter={LETTERS[i]}
                  state={stateFor(opt.cc)}
                  dimmed={answered && stateFor(opt.cc) === null}
                  onPress={() => handleAnswer(opt.cc)}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Nombre arriba y banderas en rejilla: aquí el 2×2 encaja perfecto. */}
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 6 }}>
              {t('world.whichFlag')}
            </Text>
            <Text style={{ color: C.text, ...Type.question, marginBottom: 20 }}>
              {countryName(q.answer)}
            </Text>
            <View style={{
              flexDirection: 'row', flexWrap: 'wrap',
              justifyContent: 'space-between', rowGap: 11,
            }}>
              {q.options.map(opt => (
                <FlagOption
                  key={opt.cc}
                  flag={flagEmoji(opt.cc)}
                  state={stateFor(opt.cc)}
                  dimmed={answered && stateFor(opt.cc) === null}
                  onPress={() => handleAnswer(opt.cc)}
                />
              ))}
            </View>
          </>
        )}

        {/* Al revelar, el nombre de la correcta: se aprende algo aunque falles. */}
        {answered && q.direction === 'nameToFlag' && (
          <View style={{
            marginTop: 18, padding: 16, borderRadius: Radius.card,
            backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.borderWarm,
            flexDirection: 'row', alignItems: 'center', gap: 12,
          }}>
            <Text style={{ fontSize: 34 }}>{flagEmoji(q.answer.cc)}</Text>
            <Text style={{ flex: 1, color: C.textBody, fontSize: 15, fontFamily: Font.bold }}>
              {countryName(q.answer)}
            </Text>
          </View>
        )}
      </ScrollView>
      <AdBannerSlot />
    </SafeAreaView>
  );
}
