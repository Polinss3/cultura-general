import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { showInterstitialAd } from '@/lib/admob';
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import { fetchQuestions, saveSpeedGame } from '@/lib/db';
import { fetchInventoryMap, consumeItem } from '@/lib/shop';
import { AwardResult } from '@/lib/gamification';
import { getGuestSpeedRecord, setGuestSpeedRecord, getLocalSpeedRecord, setLocalSpeedRecord } from '@/lib/guest';
import { markDailyPlayed } from '@/lib/dailyRoute';
import { getLocalQuestions } from '@/constants/questions';
import { getCurrentLang } from '@/lib/i18n';
import { pickRandomFresh, shuffleQuestion } from '@/lib/utils';
import { getRecentIds, pushSeen } from '@/lib/questionHistory';
import { AnswerState, Question } from '@/types';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

type Phase = 'loading' | 'intro' | 'playing' | 'done';

const DURATION = 30;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function buildLocal(): Question[] {
  const arr: Question[] = [];
  Object.values(getLocalQuestions(getCurrentLang())).forEach(qs => arr.push(...qs));
  return arr;
}

export default function SpeedScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('loading');
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const [guestRecord, setGuestRecord] = useState(0);
  const [localRecord, setLocalRecord] = useState(0);
  const [award, setAward] = useState<AwardResult | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [fiftyHidden, setFiftyHidden] = useState<number[]>([]);
  const savedRef = useRef(false);
  const adShownRef = useRef(false);

  const canUsePowerups = !!user && !guest && !offline;

  useEffect(() => {
    if (guest) getGuestSpeedRecord().then(setGuestRecord);
  }, [guest]);

  useEffect(() => {
    if (offline && !guest) getLocalSpeedRecord().then(setLocalRecord);
  }, [offline, guest]);

  useEffect(() => {
    if (canUsePowerups && user) fetchInventoryMap(user.id).then(setInventory);
  }, [canUsePowerups, user?.id]);

  const currentRecord = guest
    ? guestRecord
    : offline
      ? Math.max(localRecord, profile?.speed_record ?? 0)
      : (profile?.speed_record ?? 0);

  const baseQ = allQ.length > 0 ? allQ[qIdx % allQ.length] : undefined;
  const displayQ = useMemo(() => (baseQ ? shuffleQuestion(baseQ) : undefined), [baseQ, qIdx]);

  // Reiniciar el 50/50 al cambiar de pregunta.
  useEffect(() => { setFiftyHidden([]); }, [qIdx]);

  useEffect(() => {
    (async () => {
      let remote: Question[] = [];
      try {
        remote = await fetchQuestions();
      } catch {
        // Sin red / sin caché: banco local.
      }
      const source = remote.length > 0 ? remote : buildLocal();
      const recent = await getRecentIds('speed');
      setAllQ(pickRandomFresh(source, recent, q => q.id, source.length));
      setPhase('intro');
    })();
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Guardar partida al terminar
  useEffect(() => {
    if (phase !== 'done' || savedRef.current) return;
    savedRef.current = true;
    markDailyPlayed(); // paso "practica hoy" de la ruta diaria
    if (guest) {
      const isNew = score > guestRecord;
      if (isNew) setGuestSpeedRecord(score).then(() => setGuestRecord(score));
      setNewRecord(isNew);
      return;
    }
    if (offline) {
      const isNew = score > localRecord;
      if (isNew) setLocalSpeedRecord(score).then(() => setLocalRecord(score));
      setNewRecord(isNew);
      return;
    }
    if (!user) return;
    const record = profile?.speed_record ?? 0;
    saveSpeedGame(user.id, score, qIdx, record).then(({ isNewRecord, award: a }) => {
      setNewRecord(isNewRecord);
      setAward(a);
      celebrate(a);
      refreshProfile();
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== 'done' || adShownRef.current) return;
    adShownRef.current = true;
    logAppsFlyerEvent('cg_speed_quiz_completed', {
      score,
      questions_answered: qIdx,
    });
    showInterstitialAd('speed_complete');
  }, [phase]);

  const reset = (startPlaying = false) => {
    savedRef.current = false;
    adShownRef.current = false;
    setNewRecord(false);
    setAward(null);
    (async () => {
      const source = allQ.length > 0 ? allQ : buildLocal();
      const recent = await getRecentIds('speed');
      setAllQ(pickRandomFresh(source, recent, q => q.id, source.length));
      setPhase(startPlaying ? 'playing' : 'intro');
      setTimeLeft(DURATION);
      setQIdx(0);
      setScore(0);
      setSelected(null);
      setAnswered(false);
      setFiftyHidden([]);
      if (canUsePowerups && user) fetchInventoryMap(user.id).then(setInventory);
    })();
  };

  const handle = (i: number) => {
    if (answered || allQ.length === 0 || fiftyHidden.includes(i)) return;
    setSelected(i);
    setAnswered(true);
    const current = displayQ;
    if (current && i === current.ans) setScore(s => s + 1);
    if (current?.id) pushSeen('speed', undefined, [current.id]);
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      setQIdx(q => q + 1);
    }, 500);
  };

  const usePowerUp = async (id: string) => {
    if (!canUsePowerups || (inventory[id] ?? 0) <= 0) return;
    if (id === 'pw_time') {
      setTimeLeft(t => t + 5);
    } else if (id === 'pw_5050') {
      if (answered || !displayQ) return;
      const wrong = displayQ.opts.map((_, idx) => idx).filter(idx => idx !== displayQ.ans);
      const hide = pickRandomFresh(wrong, [], () => undefined, 2);
      setFiftyHidden(hide);
    }
    setInventory(inv => ({ ...inv, [id]: (inv[id] ?? 0) - 1 }));
    await consumeItem(id);
  };

  const powerUps: PowerUpButton[] = [
    { id: 'pw_time', icon: '⏱️', label: '+5s', count: inventory['pw_time'] ?? 0 },
    { id: 'pw_5050', icon: '✂️', label: '50/50', count: inventory['pw_5050'] ?? 0 },
  ];

  // ─ Loading
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.speed} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Intro
  if (phase === 'intro') {
    const record = currentRecord;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>⚡</Text>
            <Text style={{ color: C.text, fontSize: 26, fontFamily: Font.black, marginBottom: 8 }}>
              {t('speed.title')}
            </Text>
            <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, lineHeight: 24, textAlign: 'center', maxWidth: 260, marginBottom: 12 }}>
              {t('speed.introDescPre')}
              <Text style={{ color: C.speed, fontFamily: Font.bold }}>{t('speed.seconds')}</Text>
              {t('speed.introDescPost')}
            </Text>
            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 20,
              marginBottom: 30, width: '100%', alignItems: 'center',
              borderWidth: 1, borderColor: C.border, ...cardShadow(isDark),
            }}>
              <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginBottom: 4 }}>
                {t('speed.recordLabel')}
              </Text>
              <Text style={{ color: C.speedText, fontSize: 32, fontFamily: Font.black }}>
                {t('speed.questions', { count: record })}
              </Text>
            </View>
            <Pressable onPress={() => setPhase('playing')} style={{ width: '100%' }}>
              <View style={{ backgroundColor: C.speed, borderRadius: 18, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontSize: 17, fontFamily: Font.extra }}>{t('speed.start')}</Text>
              </View>
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
    const record = currentRecord;
    const diff = record - score;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>
            {score >= record && record > 0 ? '🏆' : score >= 5 ? '⭐' : '💪'}
          </Text>
          <Text style={{ color: C.text, fontSize: 28, fontFamily: Font.black, marginBottom: 4 }}>
            {t('speed.correctCount', { count: score })}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, marginBottom: 6 }}>
            {t('speed.inSeconds', { seconds: DURATION })}
          </Text>
          {newRecord ? (
            <Text style={{ color: C.brandDeep, fontSize: 13, fontFamily: Font.semi, marginBottom: 10 }}>
              {t('speed.newRecord')}
            </Text>
          ) : (
            <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.regular, marginBottom: 10 }}>
              {record > 0
                ? diff > 0
                  ? t('speed.recordBeat', { record, diff })
                  : t('speed.recordTied', { record })
                : t('speed.firstGame')}
            </Text>
          )}

          {award && (award.gainedXp > 0 || award.gainedCoins > 0) && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
              <View style={{ backgroundColor: tint(C.social, isDark), borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                <Text style={{ color: C.social, fontFamily: Font.extra, fontSize: 13 }}>+{award.gainedXp} XP</Text>
              </View>
              <View style={{ backgroundColor: tint(C.streak, isDark), borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                <Text style={{ color: C.coinText, fontFamily: Font.extra, fontSize: 13 }}>+{award.gainedCoins} 🪙</Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginBottom: 30 }}>
            {[
              { label: t('profile.stats.answered'), value: String(qIdx) },
              { label: t('profile.stats.accuracy'), value: `${accuracy}%` },
            ].map(s => (
              <View key={s.label} style={{
                flex: 1, backgroundColor: C.surface, borderRadius: 18, padding: 14, alignItems: 'center',
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ color: C.text, fontSize: 22, fontFamily: Font.black }}>{s.value}</Text>
                <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                flex: 1, backgroundColor: C.surface, borderRadius: 18, padding: 15, alignItems: 'center',
                borderWidth: 1, borderColor: C.borderStrong,
              }}
            >
              <Text style={{ color: C.textBody, fontSize: 15, fontFamily: Font.extra }}>{t('speed.exit')}</Text>
            </Pressable>
            <Pressable onPress={() => reset(true)} style={{ flex: 2 }}>
              <View style={{ backgroundColor: C.speed, borderRadius: 18, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontSize: 15, fontFamily: Font.extra }}>{t('speed.again')}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Playing
  if (allQ.length === 0 || !displayQ) return null;
  const q = displayQ;
  const pct = timeLeft / DURATION;
  const timerColor = timeLeft > 10 ? C.speed : C.wrong;

  const getState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{ flex: 1, padding: Space.screen, gap: 20 }}>
        {/* Salida + distintivo del modo */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.pill,
              backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
            }}
            hitSlop={8}
          >
            <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.bold }}>✕ {t('speed.exit')}</Text>
          </Pressable>
          <View style={{
            paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.pill,
            backgroundColor: tint(C.speed, isDark),
          }}>
            <Text style={{ color: C.speedText, fontSize: 13, fontFamily: Font.extra }}>⚡ {t('speed.title')}</Text>
          </View>
        </View>

        {/* Marcador: tiempo restante y aciertos */}
        <View style={{
          backgroundColor: C.surface, borderRadius: 24, padding: 20, gap: 14,
          borderWidth: 1, borderColor: C.border, ...cardShadow(isDark),
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra, letterSpacing: 1 }}>
                {t('speed.questionN', { n: qIdx + 1 })}
              </Text>
              <Text style={{ color: timerColor, fontSize: 44, fontFamily: Font.black, lineHeight: 48 }}>{timeLeft}s</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra, letterSpacing: 1 }}>
                {t('speed.hitsLabel')}
              </Text>
              <Text style={{ color: C.text, fontSize: 44, fontFamily: Font.black, lineHeight: 48 }}>{score} ✓</Text>
            </View>
          </View>
          <View style={{ height: 12, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: Radius.pill }} />
          </View>
        </View>

        <Text style={{ color: C.text, ...Type.question }}>
          {q.q}
        </Text>

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

        {canUsePowerups && (powerUps.some(p => p.count > 0)) && (
          <View style={{ gap: 9 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, fontSize: 12 }}>
              {t('common.yourHelpers')}
            </Text>
            <PowerUpBar items={powerUps} onUse={usePowerUp} disabled={answered} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
