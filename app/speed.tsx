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
import { fetchQuestions, saveSpeedGame } from '@/lib/db';
import { fetchInventoryMap, consumeItem } from '@/lib/shop';
import { AwardResult } from '@/lib/gamification';
import { getGuestSpeedRecord, setGuestSpeedRecord, getLocalSpeedRecord, setLocalSpeedRecord } from '@/lib/guest';
import { getLocalQuestions } from '@/constants/questions';
import { getCurrentLang } from '@/lib/i18n';
import { pickRandomFresh, shuffleQuestion } from '@/lib/utils';
import { getRecentIds, pushSeen } from '@/lib/questionHistory';
import { AnswerState, Question } from '@/types';

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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#a030e8" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Intro
  if (phase === 'intro') {
    const record = currentRecord;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>⚡</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>
              {t('speed.title')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', lineHeight: 24, textAlign: 'center', maxWidth: 260, marginBottom: 12 }}>
              {t('speed.introDescPre')}
              <Text style={{ color: '#a030e8', fontFamily: 'Outfit_700Bold' }}>{t('speed.seconds')}</Text>
              {t('speed.introDescPost')}
            </Text>
            <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 20, marginBottom: 32, width: '100%', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>
                {t('speed.recordLabel')}
              </Text>
              <Text style={{ color: '#a030e8', fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>
                {t('speed.questions', { count: record })}
              </Text>
            </View>
            <Pressable onPress={() => setPhase('playing')} style={{ width: '100%' }}>
              <LinearGradient
                colors={['#a030e8', '#7020b8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('speed.start')}</Text>
              </LinearGradient>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>
            {score >= record && record > 0 ? '🏆' : score >= 5 ? '⭐' : '💪'}
          </Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            {t('speed.correctCount', { count: score })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 6 }}>
            {t('speed.inSeconds', { seconds: DURATION })}
          </Text>
          {newRecord ? (
            <Text style={{ color: '#e8a030', fontSize: 13, fontFamily: 'Outfit_600SemiBold', marginBottom: 10 }}>
              {t('speed.newRecord')}
            </Text>
          ) : (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Outfit_400Regular', marginBottom: 10 }}>
              {record > 0
                ? diff > 0
                  ? t('speed.recordBeat', { record, diff })
                  : t('speed.recordTied', { record })
                : t('speed.firstGame')}
            </Text>
          )}

          {award && (award.gainedXp > 0 || award.gainedCoins > 0) && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
              <View style={{ backgroundColor: 'rgba(48,168,232,0.15)', borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                <Text style={{ color: '#30a8e8', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>+{award.gainedXp} XP</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(232,160,48,0.15)', borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>+{award.gainedCoins} 🪙</Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginBottom: 30 }}>
            {[
              { label: t('profile.stats.answered'), value: String(qIdx) },
              { label: t('profile.stats.accuracy'), value: `${accuracy}%` },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_700Bold' }}>{s.value}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <Pressable
              onPress={() => router.back()}
              style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('speed.exit')}</Text>
            </Pressable>
            <Pressable onPress={() => reset(true)} style={{ flex: 2 }}>
              <LinearGradient
                colors={['#a030e8', '#7020b8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>{t('speed.again')}</Text>
              </LinearGradient>
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
  const timerColor = timeLeft > 10 ? '#a030e8' : '#e83060';

  const getState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>#{qIdx + 1}</Text>
          <Text style={{ color: timerColor, fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>{timeLeft}s</Text>
          <Text style={{ color: '#a030e8', fontFamily: 'Outfit_700Bold', fontSize: 20 }}>{score} ✓</Text>
        </View>

        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 18 }}>
          {q.q}
        </Text>

        <View style={{ gap: 9 }}>
          {q.opts.map((opt, i) =>
            fiftyHidden.includes(i) ? (
              <View key={i} style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.04)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, opacity: 0.3 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 15, fontFamily: 'Outfit_500Medium' }}>—</Text>
              </View>
            ) : (
              <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
            ),
          )}
        </View>

        {canUsePowerups && (powerUps.some(p => p.count > 0)) && (
          <View style={{ marginTop: 18 }}>
            <PowerUpBar items={powerUps} onUse={usePowerUp} disabled={answered} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
