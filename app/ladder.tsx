import { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { Confetti } from '@/components/Confetti';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { fetchQuestions } from '@/lib/db';
import { fetchInventoryMap, consumeItem } from '@/lib/shop';
import {
  saveLadderRun, bumpMissions, fetchLadderRanking, AwardResult, LadderRankRow,
} from '@/lib/gamification';
import { showRewardedAd, isRewardedReady, showInterstitialAd } from '@/lib/admob';
import {
  getGuestLadderBest, setGuestLadderBest, getLocalLadderBest, setLocalLadderBest,
} from '@/lib/guest';
import {
  LADDER_LIVES, LADDER_CHECKPOINT_EVERY, ladderFloorCoins, ladderDifficulty, ladderTimeLimit,
} from '@/lib/economy';
import { QUESTIONS } from '@/constants/questions';
import { pickRandomFresh, shuffleQuestion, ShuffledQuestion } from '@/lib/utils';
import { AnswerState, Question } from '@/types';

type Phase = 'loading' | 'intro' | 'playing' | 'checkpoint' | 'gameover' | 'done';
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function buildLocal(): Question[] {
  const arr: Question[] = [];
  Object.values(QUESTIONS).forEach(qs => arr.push(...qs));
  return arr;
}

export default function LadderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();

  const [phase, setPhase] = useState<Phase>('loading');
  const [allQ, setAllQ] = useState<Question[]>([]);
  const [floor, setFloor] = useState(1);
  const [lives, setLives] = useState(LADDER_LIVES);
  const [bote, setBote] = useState(0);
  const [banked, setBanked] = useState(0);
  const [current, setCurrent] = useState<ShuffledQuestion | undefined>();
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [qKey, setQKey] = useState(0);
  const [fiftyHidden, setFiftyHidden] = useState<number[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [award, setAward] = useState<AwardResult | null>(null);
  const [recordBest, setRecordBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [runFloor, setRunFloor] = useState(0);
  const [ranking, setRanking] = useState<LadderRankRow[]>([]);

  const usedIds = useRef<Set<string>>(new Set());
  const savedRef = useRef(false);
  const adShownRef = useRef(false);
  const canUsePowerups = !!user && !guest && !offline;

  // Cargar récord y banco de preguntas.
  useEffect(() => {
    (async () => {
      let remote: Question[] = [];
      try { remote = await fetchQuestions(); } catch { /* banco local */ }
      setAllQ(remote.length > 0 ? remote : buildLocal());

      if (guest) setRecordBest(await getGuestLadderBest());
      else if (offline) setRecordBest(Math.max(await getLocalLadderBest(), profile?.ladder_best ?? 0));
      else setRecordBest(profile?.ladder_best ?? 0);

      setPhase('intro');
    })();
  }, []);

  useEffect(() => {
    if (canUsePowerups && user) fetchInventoryMap(user.id).then(setInventory);
  }, [canUsePowerups, user?.id]);

  // Timer por piso.
  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) { onTimeUp(); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, answered, timeLeft]);

  // Intersticial al terminar una escalada.
  useEffect(() => {
    if (phase !== 'done' || adShownRef.current) return;
    adShownRef.current = true;
    showInterstitialAd('ladder_complete');
  }, [phase]);

  const pickForFloor = (f: number): ShuffledQuestion | undefined => {
    if (allQ.length === 0) return undefined;
    const diff = ladderDifficulty(f);
    const byDiff = allQ.filter(q => (q as any).difficulty === diff);
    const source = byDiff.length >= 4 ? byDiff : allQ;
    const fresh = pickRandomFresh(source, [...usedIds.current], q => q.id, 1);
    const base = fresh[0] ?? source[Math.floor(Math.random() * source.length)];
    if (base?.id) usedIds.current.add(base.id);
    return base ? shuffleQuestion(base) : undefined;
  };

  const loadFloor = (f: number) => {
    setCurrent(pickForFloor(f));
    setSelected(null);
    setAnswered(false);
    setFiftyHidden([]);
    setHintShown(false);
    setTimeLeft(ladderTimeLimit(f));
    setQKey(k => k + 1);
  };

  const start = () => {
    usedIds.current = new Set();
    savedRef.current = false;
    adShownRef.current = false;
    setFloor(1);
    setLives(LADDER_LIVES);
    setBote(0);
    setBanked(0);
    setAward(null);
    setNewBest(false);
    setPhase('playing');
    loadFloor(1);
  };

  const advance = (nextFloor: number) => {
    setFloor(nextFloor);
    loadFloor(nextFloor);
    setPhase('playing');
  };

  const onCorrect = () => {
    const earned = ladderFloorCoins(floor);
    const newBote = bote + earned;
    setBote(newBote);
    if (floor % LADDER_CHECKPOINT_EVERY === 0) {
      setBanked(newBote);     // asegura el bote en el checkpoint
      setPhase('checkpoint');
    } else {
      advance(floor + 1);
    }
  };

  const onWrong = () => {
    const nl = lives - 1;
    setLives(nl);
    if (nl <= 0) {
      setPhase('gameover');
    } else {
      loadFloor(floor); // reintenta el mismo piso con otra pregunta
    }
  };

  const handle = (i: number) => {
    if (answered || !current || fiftyHidden.includes(i)) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === current.ans;
    setTimeout(() => (correct ? onCorrect() : onWrong()), 850);
  };

  const onTimeUp = () => {
    if (answered) return;
    setSelected(null);
    setAnswered(true);
    setTimeout(() => onWrong(), 850);
  };

  const usePowerUp = async (id: string) => {
    if (!canUsePowerups || (inventory[id] ?? 0) <= 0 || answered) return;
    if (id === 'pw_5050' && current) {
      const wrong = current.opts.map((_, idx) => idx).filter(idx => idx !== current.ans);
      setFiftyHidden(pickRandomFresh(wrong, [], () => undefined, 2));
    } else if (id === 'pw_hint') {
      setHintShown(true);
    } else if (id === 'pw_skip') {
      loadFloor(floor);
    } else {
      return;
    }
    setInventory(inv => ({ ...inv, [id]: (inv[id] ?? 0) - 1 }));
    await consumeItem(id);
  };

  // Reanimar tras game over (item o anuncio).
  const reviveWithItem = async () => {
    if ((inventory['pw_revive'] ?? 0) <= 0) return;
    setInventory(inv => ({ ...inv, pw_revive: (inv['pw_revive'] ?? 0) - 1 }));
    await consumeItem('pw_revive');
    setLives(1);
    loadFloor(floor);
    setPhase('playing');
  };

  const reviveWithAd = async () => {
    const ok = await showRewardedAd('ladder_revive');
    if (!ok) return;
    setLives(1);
    loadFloor(floor);
    setPhase('playing');
  };

  // Finalizar la partida (retirarse o terminar tras game over).
  const finishRun = useCallback(async (passedFloors: number, coins: number) => {
    if (savedRef.current) return;
    savedRef.current = true;
    setRunFloor(passedFloors);
    setPhase('done');

    const isBest = passedFloors > recordBest;
    setNewBest(isBest);

    if (guest) {
      if (isBest) { await setGuestLadderBest(passedFloors); setRecordBest(passedFloors); }
      return;
    }
    if (offline) {
      if (isBest) { await setLocalLadderBest(passedFloors); setRecordBest(passedFloors); }
      return;
    }
    if (!user) return;

    const a = await saveLadderRun(passedFloors, coins);
    setAward(a);
    celebrate(a);
    if (a?.ladderBest !== undefined) setRecordBest(a.ladderBest);
    await bumpMissions('ladder_play', 1);
    if (passedFloors > 0) await bumpMissions('ladder_floor', passedFloors);
    if (a?.gainedCoins) await bumpMissions('coins_earned', a.gainedCoins);
    refreshProfile();
    fetchLadderRanking().then(setRanking);
  }, [recordBest, guest, offline, user?.id, celebrate, refreshProfile]);

  const retire = () => finishRun(floor, bote);
  const endGame = () => finishRun(floor - 1, banked);

  const powerUps: PowerUpButton[] = [
    { id: 'pw_5050', icon: '✂️', label: '50/50', count: inventory['pw_5050'] ?? 0 },
    { id: 'pw_hint', icon: '💡', label: 'Pista', count: inventory['pw_hint'] ?? 0 },
    { id: 'pw_skip', icon: '⏭️', label: 'Saltar', count: inventory['pw_skip'] ?? 0 },
  ];

  // ─ Loading
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#e8a030" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Intro
  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🪜</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>
            Modo Ascenso
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', lineHeight: 24, textAlign: 'center', maxWidth: 280, marginBottom: 14 }}>
            Sube pisos de dificultad creciente. Tienes{' '}
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold' }}>{LADDER_LIVES} vidas</Text>.
            Cada piso engorda el bote 🪙. En cada checkpoint decides:{' '}
            <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold' }}>retirarte</Text> y asegurarlo, o arriesgar para subir más.
          </Text>
          <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 20, marginBottom: 32, width: '100%', alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>
              Tu mejor escalada
            </Text>
            <Text style={{ color: '#e8a030', fontSize: 32, fontFamily: 'Outfit_800ExtraBold' }}>
              Piso {recordBest}
            </Text>
          </View>
          <Pressable onPress={start} style={{ width: '100%' }}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>¡Empezar a escalar!</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Checkpoint
  if (phase === 'checkpoint') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 10 }}>🛡️</Text>
          <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_600SemiBold', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
            Checkpoint · Piso {floor}
          </Text>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 36, marginVertical: 6 }}>
            {bote} 🪙
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 32, maxWidth: 280 }}>
            Bote asegurado. ¿Te retiras y te lo llevas, o sigues subiendo arriesgándolo hasta el próximo checkpoint?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <Pressable onPress={retire} style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46,200,122,0.35)' }}>
              <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>Retirarme</Text>
            </Pressable>
            <Pressable onPress={() => advance(floor + 1)} style={{ flex: 1 }}>
              <LinearGradient colors={['#e8a030', '#e83060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>Seguir subiendo</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Game over (oportunidad de revivir)
  if (phase === 'gameover') {
    const reviveItems = inventory['pw_revive'] ?? 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 10 }}>💔</Text>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 24 }}>
            Caíste en el piso {floor}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 28 }}>
            Si terminas ahora conservas {banked} 🪙 (lo asegurado en el último checkpoint).
          </Text>

          <View style={{ width: '100%', gap: 10 }}>
            {canUsePowerups && reviveItems > 0 && (
              <Pressable onPress={reviveWithItem}>
                <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,48,96,0.4)' }}>
                  <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>❤️ Usar vida extra (×{reviveItems})</Text>
                </View>
              </Pressable>
            )}
            {!guest && !offline && isRewardedReady() && (
              <Pressable onPress={reviveWithAd}>
                <View style={{ backgroundColor: 'rgba(46,200,122,0.1)', borderRadius: 14, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46,200,122,0.4)' }}>
                  <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>🎬 Ver anuncio para revivir</Text>
                </View>
              </Pressable>
            )}
            <Pressable onPress={endGame}>
              <LinearGradient colors={['#e8a030', '#e83060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>Terminar y cobrar</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Done
  if (phase === 'done') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        <Confetti active={newBest} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
          <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
            <Text style={{ fontSize: 56, marginBottom: 8 }}>{newBest ? '🏆' : '🪜'}</Text>
            <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 28 }}>
              Piso {runFloor}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 14, marginTop: 2 }}>
              {newBest ? '¡Nueva mejor escalada!' : `Tu récord: piso ${recordBest}`}
            </Text>
            {award && (award.gainedXp > 0 || award.gainedCoins > 0) && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View style={{ backgroundColor: 'rgba(48,168,232,0.15)', borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                  <Text style={{ color: '#30a8e8', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>+{award.gainedXp} XP</Text>
                </View>
                <View style={{ backgroundColor: 'rgba(232,160,48,0.15)', borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 }}>
                  <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>+{award.gainedCoins} 🪙</Text>
                </View>
              </View>
            )}
          </View>

          {ranking.length > 0 && (
            <>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                Mejores escaladas
              </Text>
              <View style={{ gap: 8, marginBottom: 22 }}>
                {ranking.slice(0, 10).map((r, i) => {
                  const isMe = r.userId === user?.id;
                  return (
                    <View key={r.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: isMe ? 'rgba(232,160,48,0.08)' : '#151515', borderRadius: 12, padding: 11, borderWidth: 1, borderColor: isMe ? 'rgba(232,160,48,0.3)' : 'transparent' }}>
                      <Text style={{ width: 22, textAlign: 'center', color: i < 3 ? '#e8a030' : 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_800ExtraBold', fontSize: 13 }}>
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                      </Text>
                      <Text style={{ flex: 1, color: isMe ? '#e8a030' : '#fff', fontFamily: isMe ? 'Outfit_700Bold' : 'Outfit_500Medium', fontSize: 14 }}>
                        {r.username}{isMe ? ' (tú)' : ''}
                      </Text>
                      <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>Piso {r.ladderBest}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={() => router.back()} style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 15, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>Salir</Text>
            </Pressable>
            <Pressable onPress={start} style={{ flex: 2 }}>
              <LinearGradient colors={['#e8a030', '#e83060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>Escalar de nuevo</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─ Playing
  if (!current) return null;
  const pct = timeLeft / ladderTimeLimit(floor);
  const timerColor = timeLeft > 4 ? '#e8a030' : '#e83060';
  const isCheckpointNext = (floor + 1) % LADDER_CHECKPOINT_EVERY === 0;

  const getState = (i: number): AnswerState => {
    if (!answered) return selected === i ? 'selected' : null;
    if (i === current.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header: piso, vidas, bote */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 11 }}>PISO</Text>
            <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 22 }}>{floor}</Text>
          </View>
          <Text style={{ fontSize: 16 }}>
            {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, LADDER_LIVES - lives))}
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 11 }}>BOTE</Text>
            <Text style={{ color: '#e8a030', fontFamily: 'Outfit_800ExtraBold', fontSize: 18 }}>{bote} 🪙</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 6, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${Math.max(0, pct * 100)}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_500Medium', fontSize: 11 }}>
            Dificultad: {ladderDifficulty(floor) === 'easy' ? 'Fácil' : ladderDifficulty(floor) === 'medium' ? 'Media' : 'Difícil'}
          </Text>
          <Text style={{ color: timerColor, fontFamily: 'Outfit_700Bold', fontSize: 13 }}>{timeLeft}s</Text>
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 18 }}>
          {current.q}
        </Text>

        <View style={{ gap: 9 }}>
          {current.opts.map((opt, i) =>
            fiftyHidden.includes(i) ? (
              <View key={i} style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.04)', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, opacity: 0.3 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 15, fontFamily: 'Outfit_500Medium' }}>—</Text>
              </View>
            ) : (
              <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
            ),
          )}
        </View>

        {hintShown && current.ctx && (
          <View style={{ marginTop: 14, padding: 12, backgroundColor: 'rgba(232,160,48,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(232,160,48,0.25)' }}>
            <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 12, marginBottom: 3 }}>💡 Pista</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit_400Regular', fontSize: 12, lineHeight: 18 }}>{current.ctx}</Text>
          </View>
        )}

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {isCheckpointNext && (
            <Text style={{ color: 'rgba(46,200,122,0.7)', fontFamily: 'Outfit_600SemiBold', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>
              🛡️ Acierta este piso para llegar a un checkpoint
            </Text>
          )}
          {canUsePowerups && powerUps.some(p => p.count > 0) && (
            <PowerUpBar items={powerUps} onUse={usePowerUp} disabled={answered} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
