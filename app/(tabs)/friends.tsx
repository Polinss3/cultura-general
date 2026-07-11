import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { OptionBtn } from '@/components/OptionBtn';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { OfflineNotice } from '@/components/OfflineNotice';
import { getLocalQuestions } from '@/constants/questions';
import { getCurrentLang } from '@/lib/i18n';
import { fetchQuestions } from '@/lib/db';
import { pickRandomFresh, shuffleQuestion } from '@/lib/utils';
import { getRecentIds, pushSeen } from '@/lib/questionHistory';
import { AnswerState, Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────

type Screen = 'modes' | 'pasa' | 'duelo' | 'survivor' | 'trivia' | 'marcador';

// ─── Helpers ──────────────────────────────────────────────────

function buildLocal(): Question[] {
  const arr: Question[] = [];
  Object.values(getLocalQuestions(getCurrentLang())).forEach(qs => arr.push(...qs));
  return arr;
}

async function buildFreshPool(): Promise<Question[]> {
  let remote: Question[] = [];
  try {
    remote = await fetchQuestions();
  } catch {
    // Sin red / sin caché: usamos el banco local empaquetado.
  }
  const recent = await getRecentIds('friends');
  const source = remote.length > 0 ? remote : buildLocal();
  return pickRandomFresh(source, recent, q => q.id, source.length);
}

const DURATION = 30;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function BackBtn({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 }}>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>{t('party.back')}</Text>
    </Pressable>
  );
}

function ExitBtn({ onExit }: { onExit: () => void }) {
  const { t } = useTranslation();
  const handlePress = () => {
    Alert.alert(
      t('party.exitTitle'),
      t('party.exitBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('party.exitConfirm'), style: 'destructive', onPress: onExit },
      ],
    );
  };
  return (
    <Pressable
      onPress={handlePress}
      style={{
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99,
        backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
      }}
      hitSlop={8}
    >
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_600SemiBold' }}>{t('party.exit')}</Text>
    </Pressable>
  );
}

function PrimaryBtn({ label, onPress, colors = ['#30a8e8', '#1a78b8'] }: {
  label: string; onPress: () => void; colors?: [string, string];
}) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Modes screen ─────────────────────────────────────────────

function ModesScreen({ onSelect }: { onSelect: (s: Screen) => void }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { guest } = useGuest();
  const MODE_META = [
    { id: 'pasa' as Screen, icon: '📱', color: '#30a8e8', bg: '#0a1f2d', border: 'rgba(48,168,232,0.3)' },
    { id: 'marcador' as Screen, icon: '🎯', color: '#a060e8', bg: '#1a0d2d', border: 'rgba(160,96,232,0.3)' },
    { id: 'duelo' as Screen, icon: '⚔️', color: '#e83060', bg: '#2d0a18', border: 'rgba(232,48,96,0.3)' },
    { id: 'survivor' as Screen, icon: '💀', color: '#e8a030', bg: '#2d1f0a', border: 'rgba(232,160,48,0.3)' },
    { id: 'trivia' as Screen, icon: '🧩', color: '#2ec87a', bg: '#0d2214', border: 'rgba(46,200,122,0.3)' },
  ];
  const modes = MODE_META.map(m => ({
    ...m,
    tag: t(`party.modes.${m.id}.tag`),
    title: t(`party.modes.${m.id}.title`),
    desc: t(`party.modes.${m.id}.desc`),
    players: t(`party.modes.${m.id}.players`),
    btn: t('party.playCta'),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold' }}>
            {t('party.header')}
          </Text>
          {!guest && (
            <Pressable
              onPress={() => router.push('/friends-list')}
              style={{ backgroundColor: 'rgba(48,168,232,0.12)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(48,168,232,0.25)' }}
            >
              <Text style={{ fontSize: 14 }}>👥</Text>
              <Text style={{ color: '#30a8e8', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>{t('party.friendsBtn')}</Text>
            </Pressable>
          )}
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 24 }}>
          {t('party.subtitle')}
        </Text>
        <View style={{ gap: 12 }}>
          {modes.map(m => (
            <Pressable key={m.id} onPress={() => onSelect(m.id)}>
              <View style={{ backgroundColor: m.bg, borderWidth: 1, borderColor: m.border, borderRadius: 20, padding: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: m.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22 }}>{m.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: m.color, fontSize: 11, fontFamily: 'Outfit_600SemiBold' }}>{m.tag}</Text>
                    <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{m.title}</Text>
                  </View>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20, marginBottom: 10 }}>
                  {m.desc}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
                    👥 {m.players}
                  </Text>
                  <View style={{ backgroundColor: m.color, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 99 }}>
                    <Text style={{ color: m.id === 'pasa' ? '#000' : '#fff', fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
                      {m.btn}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// PASA EL MÓVIL
// ══════════════════════════════════════════════════════════════

function PasaGame({ onBack }: { onBack: () => void }) {
  type PS = 'setup' | 'countdown' | 'playing' | 'between' | 'results';
  const [screen, setScreen] = useState<PS>('setup');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answeredCounts, setAnsweredCounts] = useState<number[]>([]);
  const [sharedQ, setSharedQ] = useState<Question[]>([]);

  const startGame = (names: string[]) => {
    setPlayers(names);
    setScores(new Array(names.length).fill(0));
    setAnsweredCounts(new Array(names.length).fill(0));
    setCurrentIdx(0);
    buildFreshPool().then(setSharedQ);
    setScreen('countdown');
  };

  const handlePlayerDone = (score: number, answered: number) => {
    setScores(s => { const n = [...s]; n[currentIdx] = score; return n; });
    setAnsweredCounts(a => { const n = [...a]; n[currentIdx] = answered; return n; });
    setScreen('between');
  };

  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= players.length) { setScreen('results'); }
    else { setCurrentIdx(next); setScreen('countdown'); }
  };

  const replay = () => {
    setScores(new Array(players.length).fill(0));
    setAnsweredCounts(new Array(players.length).fill(0));
    setCurrentIdx(0);
    buildFreshPool().then(setSharedQ);
    setScreen('countdown');
  };

  if (screen === 'setup') return <PasaSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'countdown') return <PasaCountdown playerName={players[currentIdx]} onDone={() => setScreen('playing')} onExit={onBack} />;
  if (screen === 'playing') return (
    <PasaPlaying playerName={players[currentIdx]} playerIdx={currentIdx} totalPlayers={players.length} questions={sharedQ} onDone={handlePlayerDone} onExit={onBack} />
  );
  if (screen === 'between') return (
    <PasaBetween playerName={players[currentIdx]} score={scores[currentIdx]} answered={answeredCounts[currentIdx]}
      isLast={currentIdx === players.length - 1} onNext={handleNext} onExit={onBack} />
  );
  if (screen === 'results') return <PasaResults players={players} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function PasaSetup({ onStart, onBack }: { onStart: (players: string[]) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState(['', '']);
  const addPlayer = () => { if (players.length < 8) setPlayers(p => [...p, '']); };
  const removePlayer = (i: number) => { if (players.length > 2) setPlayers(p => p.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i: number, name: string) => { setPlayers(p => { const n = [...p]; n[i] = name; return n; }); };
  const handleStart = () => onStart(players.map((p, i) => p.trim() || t('party.playerN', { n: i + 1 })));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>📱</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.modes.pasa.title')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('party.pasa.setupDesc')}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('party.playersCount', { count: players.length })}
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(48,168,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#30a8e8', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={p} onChangeText={val => updatePlayer(i, val)} placeholder={t('party.playerN', { n: i + 1 })}
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              {players.length > 2 && (
                <Pressable onPress={() => removePlayer(i)} style={{ padding: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
        {players.length < 8 && (
          <Pressable onPress={addPlayer} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 28, borderStyle: 'dashed' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>{t('party.addPlayer')}</Text>
          </Pressable>
        )}
        <PrimaryBtn label={t('party.start')} onPress={handleStart} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PasaCountdown({ playerName, onDone, onExit }: { playerName: string; onDone: () => void; onExit: () => void }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <ExitBtn onExit={onExit} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>{t('party.turnFor')}</Text>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 48 }}>{playerName}</Text>
        <Text style={{ color: '#30a8e8', fontSize: 96, fontFamily: 'Outfit_800ExtraBold' }}>{count}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 24 }}>{t('party.pasa.getReady')}</Text>
      </View>
    </SafeAreaView>
  );
}

function PasaPlaying({ playerName, playerIdx, totalPlayers, questions, onDone, onExit }: {
  playerName: string; playerIdx: number; totalPlayers: number; questions: Question[];
  onDone: (score: number, answered: number) => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!doneRef.current) { doneRef.current = true; onDone(score, total); }
      return;
    }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const baseQ = questions.length > 0 ? questions[qIdx % questions.length] : undefined;
  const q = useMemo(() => (baseQ ? shuffleQuestion(baseQ) : undefined), [baseQ, qIdx]);

  const handle = (i: number) => {
    if (answered || !q) return;
    setSelected(i); setAnswered(true);
    if (i === q.ans) setScore(s => s + 1);
    setTotal(t => t + 1);
    if (q.id) pushSeen('friends', undefined, [q.id]);
    setTimeout(() => { setAnswered(false); setSelected(null); setQIdx(x => x + 1); }, 400);
  };

  if (!q) return null;
  const pct = timeLeft / DURATION;
  const timerColor = timeLeft > 10 ? '#30a8e8' : '#e83060';
  const getState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === q.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
          <ExitBtn onExit={onExit} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>{t('party.pasa.playerOfTotal', { n: playerIdx + 1, total: totalPlayers })}</Text>
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>{playerName}</Text>
          </View>
          <Text style={{ color: timerColor, fontSize: 36, fontFamily: 'Outfit_800ExtraBold' }}>{timeLeft}s</Text>
          <Text style={{ color: '#30a8e8', fontSize: 18, fontFamily: 'Outfit_700Bold' }}>{score} ✓</Text>
        </View>
        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 20 }}>{q.q}</Text>
        <View style={{ gap: 9 }}>
          {q.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function PasaBetween({ playerName, score, answered, isLast, onNext, onExit }: {
  playerName: string; score: number; answered: number; isLast: boolean; onNext: () => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <ExitBtn onExit={onExit} />
      </View>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>{t('party.pasa.betweenDone', { name: playerName })}</Text>
        <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.pasa.correctCount', { count: score })}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
          {t('party.pasa.betweenStats', { answered, accuracy })}
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label={isLast ? t('party.seeResults') : t('party.next')} onPress={onNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PasaResults({ players, scores, onReplay, onBack }: {
  players: string[]; scores: number[]; onReplay: () => void; onBack: () => void;
}) {
  const { t } = useTranslation();
  const ranked = players.map((name, i) => ({ name, score: scores[i] })).sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🏆</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold' }}>{t('party.results')}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
            {t('party.pasa.resultsCongrats', { name: ranked[0].name })}
          </Text>
        </View>
        <View style={{ gap: 8, marginBottom: 32 }}>
          {ranked.map((p, i) => (
            <View key={`${i}-${p.name}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: i === 0 ? 'rgba(48,168,232,0.08)' : '#151515', borderWidth: 1, borderColor: i === 0 ? 'rgba(48,168,232,0.3)' : 'transparent', borderRadius: 14, padding: 14 }}>
              <Text style={{ fontSize: 22, width: 28 }}>{i < 3 ? medals[i] : `${i + 1}`}</Text>
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: i === 0 ? '#30a8e8' : '#222', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{p.name[0].toUpperCase()}</Text>
              </View>
              <Text style={{ flex: 1, color: i === 0 ? '#30a8e8' : '#fff', fontSize: 16, fontFamily: i === 0 ? 'Outfit_700Bold' : 'Outfit_500Medium' }}>{p.name}</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>{p.score}</Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.rematch')} onPress={onReplay} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('party.backToModes')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// DUELO 1VS1
// ══════════════════════════════════════════════════════════════

const DUELO_ROUNDS = 10;

function DueloGame({ onBack }: { onBack: () => void }) {
  type DS = 'setup' | 'playing' | 'results';
  const [screen, setScreen] = useState<DS>('setup');
  const [players, setPlayers] = useState<[string, string]>(['', '']);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const startGame = (names: [string, string]) => {
    setPlayers(names);
    setScores([0, 0]);
    setRound(0);
    buildFreshPool().then(setQuestions);
    setScreen('playing');
  };

  const handleRoundEnd = (winner: 0 | 1) => {
    const newScores: [number, number] = [...scores] as [number, number];
    newScores[winner] += 1;
    setScores(newScores);
    const nextRound = round + 1;
    if (nextRound >= DUELO_ROUNDS) { setScreen('results'); }
    else { setRound(nextRound); }
  };

  const replay = () => {
    setScores([0, 0]);
    setRound(0);
    buildFreshPool().then(setQuestions);
    setScreen('playing');
  };

  if (screen === 'setup') return <DueloSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'playing') return (
    <DueloPlaying key={round} players={players} scores={scores} round={round}
      question={questions[round % Math.max(questions.length, 1)]} onRoundEnd={handleRoundEnd} onExit={onBack} />
  );
  if (screen === 'results') return <DueloResults players={players} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function DueloSetup({ onStart, onBack }: { onStart: (names: [string, string]) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const [names, setNames] = useState<[string, string]>(['', '']);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>⚔️</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.modes.duelo.title')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('party.duelo.setupDesc')}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('party.playersLabel')}
        </Text>
        <View style={{ gap: 10, marginBottom: 28 }}>
          {([0, 1] as const).map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: i === 0 ? 'rgba(232,48,96,0.15)' : 'rgba(48,168,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: i === 0 ? '#e83060' : '#30a8e8', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={names[i]} onChangeText={val => { const n: [string, string] = [...names] as [string, string]; n[i] = val; setNames(n); }}
                placeholder={t('party.playerN', { n: i + 1 })} placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            </View>
          ))}
        </View>
        <PrimaryBtn label={t('party.duelo.start')} onPress={() => onStart([names[0].trim() || t('party.playerN', { n: 1 }), names[1].trim() || t('party.playerN', { n: 2 })])}
          colors={['#e83060', '#a010a0']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DueloPlaying({ players, scores, round, question: rawQuestion, onRoundEnd, onExit }: {
  players: [string, string]; scores: [number, number]; round: number;
  question: Question | undefined; onRoundEnd: (winner: 0 | 1) => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  const [buzzed, setBuzzed] = useState<0 | 1 | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const question = useMemo(
    () => (rawQuestion ? shuffleQuestion(rawQuestion) : undefined),
    [rawQuestion],
  );

  if (!question) return null;

  const handleBuzz = (player: 0 | 1) => {
    if (buzzed !== null || done) return;
    setBuzzed(player);
  };

  const handleAnswer = (optIdx: number) => {
    if (done || buzzed === null) return;
    setSelected(optIdx);
    setDone(true);
    const correct = optIdx === question.ans;
    const winner: 0 | 1 = correct ? buzzed : (buzzed === 0 ? 1 : 0);
    if (question.id) pushSeen('friends', undefined, [question.id]);
    setTimeout(() => onRoundEnd(winner), 1200);
  };

  const getState = (i: number): AnswerState => {
    if (!done) return null;
    if (i === question.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  const colors: [string, string] = ['#e83060', '#30a8e8'];
  const bgs = ['#2d0a18', '#0a1f2d'];

  if (buzzed === null) {
    const Side = ({ player, rotated }: { player: 0 | 1; rotated: boolean }) => (
      <Pressable
        onPress={() => handleBuzz(player)}
        style={{ flex: 1, backgroundColor: bgs[player] }}
      >
        <View style={{
          flex: 1, alignItems: 'center', justifyContent: 'center',
          padding: 24, gap: 18,
          transform: [{ rotate: rotated ? '180deg' : '0deg' }],
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1 }}>
            {t('party.duelo.roundUpper', { n: round + 1, total: DUELO_ROUNDS })}
          </Text>
          <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold', textAlign: 'center', lineHeight: 24 }}>
            {question.q}
          </Text>
          <View style={{ backgroundColor: colors[player] + '20', borderRadius: 99, paddingVertical: 16, paddingHorizontal: 32, borderWidth: 2, borderColor: colors[player] }}>
            <Text style={{ color: colors[player], fontSize: 22, fontFamily: 'Outfit_800ExtraBold' }}>{t('party.duelo.buzz')}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>
            {t('party.duelo.playerPts', { name: players[player], pts: scores[player] })}
          </Text>
        </View>
      </Pressable>
    );

    return (
      <View style={{ flex: 1, backgroundColor: '#111' }}>
        <Side player={0} rotated />
        <View style={{
          paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#0a0a0a',
          borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222',
          alignItems: 'center',
        }}>
          <ExitBtn onExit={onExit} />
        </View>
        <Side player={1} rotated={false} />
      </View>
    );
  }

  // After buzz: question hidden, options oriented toward whoever buzzed.
  const rotated = buzzed === 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top', 'bottom']}>
      <View style={{
        flex: 1, padding: 20,
        transform: [{ rotate: rotated ? '180deg' : '0deg' }],
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
          <ExitBtn onExit={onExit} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            {t('party.duelo.round', { n: round + 1, total: DUELO_ROUNDS })}
          </Text>
          <View style={{ backgroundColor: colors[buzzed] + '20', borderRadius: 99, paddingVertical: 4, paddingHorizontal: 12 }}>
            <Text style={{ color: colors[buzzed], fontSize: 13, fontFamily: 'Outfit_700Bold' }}>⚡ {players[buzzed]}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            {scores[0]} – {scores[1]}
          </Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Outfit_600SemiBold', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5 }}>
          {t('party.duelo.chooseCorrect')}
        </Text>
        <View style={{ gap: 9 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handleAnswer(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function DueloResults({ players, scores, onReplay, onBack }: {
  players: [string, string]; scores: [number, number]; onReplay: () => void; onBack: () => void;
}) {
  const { t } = useTranslation();
  const winner = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
  const tied = winner === -1;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 12 }}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4, textAlign: 'center' }}>
            {tied ? t('party.tie') : t('party.winnerIs', { name: players[winner] })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            {t('party.duelo.scoreAfterRounds', { a: scores[0], b: scores[1], rounds: DUELO_ROUNDS })}
          </Text>
          {/* Score cards */}
          <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginBottom: 40 }}>
            {([0, 1] as const).map(i => {
              const isWinner = winner === i;
              return (
                <View key={i} style={{ flex: 1, backgroundColor: isWinner ? 'rgba(232,48,96,0.1)' : '#151515', borderWidth: 1, borderColor: isWinner ? '#e83060' : 'transparent', borderRadius: 16, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: i === 0 ? '#e83060' : '#30a8e8', fontSize: 13, fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>{players[i]}</Text>
                  <Text style={{ color: '#fff', fontSize: 36, fontFamily: 'Outfit_800ExtraBold' }}>{scores[i]}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>{t('party.points')}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.rematch')} onPress={onReplay} colors={['#e83060', '#a010a0']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('party.backToModes')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// SUPERVIVIENTE
// ══════════════════════════════════════════════════════════════

function SurvivorGame({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  type SS = 'setup' | 'ready' | 'question' | 'answered' | 'reveal' | 'results';
  const [screen, setScreen] = useState<SS>('setup');
  const [players, setPlayers] = useState<string[]>([]);
  const [alive, setAlive] = useState<boolean[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aliveOrder, setAliveOrder] = useState<number[]>([]);
  const [answeringPos, setAnsweringPos] = useState(0);
  const [roundAnswers, setRoundAnswers] = useState<Record<number, number>>({});
  const [pendingAlive, setPendingAlive] = useState<boolean[]>([]);

  const currentPlayerIdx = aliveOrder[answeringPos];
  const baseQ = questions[roundIdx % Math.max(questions.length, 1)];
  const currentQ = useMemo(() => (baseQ ? shuffleQuestion(baseQ) : undefined), [baseQ, roundIdx]);

  const startGame = (names: string[]) => {
    const initial = new Array(names.length).fill(true);
    const order = names.map((_, i) => i);
    setPlayers(names);
    setAlive(initial);
    setRoundIdx(0);
    buildFreshPool().then(setQuestions);
    setAliveOrder(order);
    setAnsweringPos(0);
    setRoundAnswers({});
    setScreen('ready');
  };

  const handleAnswer = (answerIdx: number) => {
    setRoundAnswers(prev => ({ ...prev, [currentPlayerIdx]: answerIdx }));
    setScreen('answered');
  };

  const handlePassToNext = () => {
    const next = answeringPos + 1;
    if (next >= aliveOrder.length) {
      // Compute eliminations
      const newAlive = [...alive];
      aliveOrder.forEach(pidx => {
        if (roundAnswers[pidx] !== currentQ?.ans && roundAnswers[pidx] === undefined) return;
        if (roundAnswers[pidx] !== currentQ?.ans) newAlive[pidx] = false;
      });
      // Also add the just-answered player
      const lastAnswers = { ...roundAnswers };
      if (lastAnswers[currentPlayerIdx] !== currentQ?.ans) newAlive[currentPlayerIdx] = false;

      const stillAlive = newAlive.filter(Boolean).length;
      // If everyone eliminated in this round, nobody is eliminated (edge case)
      const prevAliveCount = alive.filter(Boolean).length;
      const wouldElimAll = newAlive.filter(Boolean).length === 0;
      if (wouldElimAll) {
        // Keep everyone alive (nobody eliminated this round)
        setPendingAlive([...alive]);
      } else {
        setPendingAlive(newAlive);
      }
      setScreen('reveal');
    } else {
      setAnsweringPos(next);
      setScreen('ready');
    }
  };

  const handleRevealNext = () => {
    if (currentQ?.id) pushSeen('friends', undefined, [currentQ.id]);
    const newAlive = pendingAlive;
    setAlive(newAlive);
    const stillAlive = newAlive.filter(Boolean).length;
    if (stillAlive <= 1) {
      setScreen('results');
    } else {
      const nextRound = roundIdx + 1;
      const nextOrder = players.map((_, i) => i).filter(i => newAlive[i]);
      setRoundIdx(nextRound);
      setAliveOrder(nextOrder);
      setAnsweringPos(0);
      setRoundAnswers({});
      setScreen('ready');
    }
  };

  const replay = () => {
    const initial = new Array(players.length).fill(true);
    const order = players.map((_, i) => i);
    setAlive(initial);
    setRoundIdx(0);
    buildFreshPool().then(setQuestions);
    setAliveOrder(order);
    setAnsweringPos(0);
    setRoundAnswers({});
    setScreen('ready');
  };

  const winner = pendingAlive.length > 0
    ? players[pendingAlive.findIndex(Boolean)]
    : alive.length > 0 ? players[alive.findIndex(Boolean)] : '';

  if (screen === 'setup') return <SurvivorSetup onStart={startGame} onBack={onBack} />;

  if (screen === 'ready') return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <ExitBtn onExit={onBack} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>💀</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>
          {t('party.survivor.readyRound', { round: roundIdx + 1, pos: answeringPos + 1, total: aliveOrder.length })}
        </Text>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>
          {players[currentPlayerIdx]}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 48, textAlign: 'center' }}>
          {t('party.survivor.readyDontLook')}
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label={t('party.imReady')} onPress={() => setScreen('question')} colors={['#e8a030', '#c06010']} />
        </View>
      </View>
    </SafeAreaView>
  );

  if (screen === 'question') return (
    <SurvivorQuestion playerName={players[currentPlayerIdx]} question={currentQ} onAnswer={handleAnswer} onExit={onBack} />
  );

  if (screen === 'answered') return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <ExitBtn onExit={onBack} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>✅</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>{t('party.survivor.answered')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 48, textAlign: 'center' }}>
          {t('party.survivor.coverPass')}
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label={answeringPos + 1 >= aliveOrder.length ? t('party.survivor.seeRoundResults') : t('party.nextPlayer')}
            onPress={handlePassToNext} colors={['#e8a030', '#c06010']} />
        </View>
      </View>
    </SafeAreaView>
  );

  if (screen === 'reveal') return (
    <SurvivorReveal players={players} aliveOrder={aliveOrder} question={currentQ}
      roundAnswers={{ ...roundAnswers, [currentPlayerIdx]: roundAnswers[currentPlayerIdx] ?? -1 }}
      newAlive={pendingAlive} onNext={handleRevealNext} onExit={onBack} />
  );

  if (screen === 'results') return (
    <SurvivorResults winner={winner} players={players} alive={pendingAlive.length > 0 ? pendingAlive : alive}
      rounds={roundIdx + 1} onReplay={replay} onBack={onBack} />
  );

  return null;
}

function SurvivorSetup({ onStart, onBack }: { onStart: (names: string[]) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState(['', '', '']);
  const addPlayer = () => { if (players.length < 8) setPlayers(p => [...p, '']); };
  const removePlayer = (i: number) => { if (players.length > 3) setPlayers(p => p.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i: number, name: string) => { setPlayers(p => { const n = [...p]; n[i] = name; return n; }); };
  const handleStart = () => onStart(players.map((p, i) => p.trim() || t('party.playerN', { n: i + 1 })));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>💀</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.modes.survivor.title')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('party.survivor.setupDesc')}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('party.playersCount', { count: players.length })}
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#e8a030', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={p} onChangeText={val => updatePlayer(i, val)} placeholder={t('party.playerN', { n: i + 1 })}
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              {players.length > 3 && (
                <Pressable onPress={() => removePlayer(i)} style={{ padding: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
        {players.length < 8 && (
          <Pressable onPress={addPlayer} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 28, borderStyle: 'dashed' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>{t('party.addPlayer')}</Text>
          </Pressable>
        )}
        <PrimaryBtn label={t('party.start')} onPress={handleStart} colors={['#e8a030', '#c06010']} />
      </ScrollView>
    </SafeAreaView>
  );
}

const SURVIVOR_TURN_SECONDS = 15;

function SurvivorQuestion({ playerName, question, onAnswer, onExit }: {
  playerName: string; question: Question | undefined; onAnswer: (i: number) => void; onExit: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(SURVIVOR_TURN_SECONDS);
  const answeredRef = useRef(false);

  useEffect(() => {
    answeredRef.current = false;
    setSelected(null);
    setSecondsLeft(SURVIVOR_TURN_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!answeredRef.current) {
            answeredRef.current = true;
            // Timeout: report -1 as "no answer" so the player is eliminated.
            setTimeout(() => onAnswer(-1), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question?.id]);

  if (!question) return null;

  const handle = (i: number) => {
    if (selected !== null || answeredRef.current) return;
    answeredRef.current = true;
    setSelected(i);
    setTimeout(() => onAnswer(i), 300);
  };

  const danger = secondsLeft <= 5;
  const timerColor = danger ? '#e83060' : '#e8a030';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <ExitBtn onExit={onExit} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>💀</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }} numberOfLines={1}>{playerName}</Text>
          </View>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: timerColor + '20', borderWidth: 1, borderColor: timerColor,
            borderRadius: 99, paddingVertical: 4, paddingHorizontal: 12,
          }}>
            <Text style={{ fontSize: 14 }}>⏱</Text>
            <Text style={{ color: timerColor, fontSize: 15, fontFamily: 'Outfit_800ExtraBold', minWidth: 22, textAlign: 'right' }}>
              {secondsLeft}s
            </Text>
          </View>
        </View>
        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
          <View style={{
            height: '100%',
            width: `${(secondsLeft / SURVIVOR_TURN_SECONDS) * 100}%`,
            backgroundColor: timerColor,
          }} />
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 24 }}>{question.q}</Text>
        <View style={{ gap: 9 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]}
              state={selected === null ? null : i === selected ? 'selected' : null}
              onPress={() => handle(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function SurvivorReveal({ players, aliveOrder, question, roundAnswers, newAlive, onNext, onExit }: {
  players: string[]; aliveOrder: number[]; question: Question | undefined;
  roundAnswers: Record<number, number>; newAlive: boolean[]; onNext: () => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  if (!question) return null;
  const eliminated = aliveOrder.filter(pidx => newAlive[pidx] === false);
  const isGameOver = newAlive.filter(Boolean).length <= 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <ExitBtn onExit={onExit} />
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.survivor.roundResults')}</Text>
        <View style={{ backgroundColor: 'rgba(46,200,122,0.08)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', marginBottom: 4 }}>{t('party.correctAnswerLabel')}</Text>
          <Text style={{ color: '#2ec87a', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>{question.opts[question.ans]}</Text>
        </View>
        <View style={{ gap: 8, marginBottom: 24 }}>
          {aliveOrder.map(pidx => {
            const answer = roundAnswers[pidx];
            const correct = answer === question.ans;
            const isElim = !newAlive[pidx];
            return (
              <View key={pidx} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: isElim ? 'rgba(232,48,96,0.08)' : 'rgba(46,200,122,0.08)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: isElim ? 'rgba(232,48,96,0.2)' : 'transparent' }}>
                <Text style={{ fontSize: 20 }}>{correct ? '✅' : '❌'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isElim ? '#e83060' : '#fff', fontFamily: 'Outfit_600SemiBold' }}>{players[pidx]}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
                    {answer !== undefined && answer >= 0 ? question.opts[answer] : '—'}
                  </Text>
                </View>
                {isElim && <View style={{ backgroundColor: 'rgba(232,48,96,0.2)', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 }}>
                  <Text style={{ color: '#e83060', fontSize: 11, fontFamily: 'Outfit_700Bold' }}>{t('party.survivor.eliminatedTag')}</Text>
                </View>}
              </View>
            );
          })}
        </View>
        {eliminated.length === 0 && (
          <View style={{ backgroundColor: '#151515', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', fontFamily: 'Outfit_500Medium' }}>
              {t('party.survivor.allFailed')}
            </Text>
          </View>
        )}
        <PrimaryBtn label={isGameOver ? t('party.survivor.seeWinner') : t('party.survivor.nextRound')} onPress={onNext} colors={['#e8a030', '#c06010']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SurvivorResults({ winner, players, alive, rounds, onReplay, onBack }: {
  winner: string; players: string[]; alive: boolean[]; rounds: number; onReplay: () => void; onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>🏆</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>{t('party.survivor.survivorIs')}</Text>
          <Text style={{ color: '#e8a030', fontSize: 32, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8, textAlign: 'center' }}>{winner}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 48 }}>
            {t('party.survivor.survivedRounds', { count: rounds })}
          </Text>
          <View style={{ gap: 8, width: '100%', marginBottom: 40 }}>
            {players.map((name, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#151515', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 18 }}>{alive[i] ? '🏆' : '💀'}</Text>
                <Text style={{ color: alive[i] ? '#e8a030' : 'rgba(255,255,255,0.3)', fontSize: 15, fontFamily: alive[i] ? 'Outfit_700Bold' : 'Outfit_400Regular', flex: 1 }}>
                  {name}
                </Text>
                <Text style={{ color: alive[i] ? '#e8a030' : 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>
                  {alive[i] ? t('party.survivor.winnerTag') : t('party.survivor.eliminatedTag')}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.rematch')} onPress={onReplay} colors={['#e8a030', '#c06010']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('party.backToModes')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// TRIVIA NIGHT
// ══════════════════════════════════════════════════════════════

const TRIVIA_TOTAL = 20;

function TriviaGame({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  type TS = 'setup' | 'playing' | 'results';
  const [screen, setScreen] = useState<TS>('setup');
  const [teamNames, setTeamNames] = useState<[string, string]>([t('party.teamN', { n: 1 }), t('party.teamN', { n: 2 })]);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [currentTeam, setCurrentTeam] = useState<0 | 1>(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const startGame = (names: [string, string]) => {
    setTeamNames(names);
    setScores([0, 0]);
    setCurrentTeam(0);
    setQuestionIdx(0);
    buildFreshPool().then(setQuestions);
    setScreen('playing');
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScores(s => {
        const n: [number, number] = [...s] as [number, number];
        n[currentTeam] += 1;
        return n;
      });
    }
    const next = questionIdx + 1;
    if (next >= TRIVIA_TOTAL) {
      setScreen('results');
    } else {
      setQuestionIdx(next);
      setCurrentTeam(t => (t === 0 ? 1 : 0));
    }
  };

  const replay = () => {
    setScores([0, 0]);
    setCurrentTeam(0);
    setQuestionIdx(0);
    buildFreshPool().then(setQuestions);
    setScreen('playing');
  };

  if (screen === 'setup') return <TriviaSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'playing') return (
    <TriviaPlaying key={questionIdx} teamNames={teamNames} scores={scores} currentTeam={currentTeam}
      questionIdx={questionIdx} question={questions[questionIdx % Math.max(questions.length, 1)]}
      onAnswer={handleAnswer} onExit={onBack} />
  );
  if (screen === 'results') return <TriviaResults teamNames={teamNames} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function TriviaSetup({ onStart, onBack }: { onStart: (names: [string, string]) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const [names, setNames] = useState<[string, string]>([t('party.teamN', { n: 1 }), t('party.teamN', { n: 2 })]);
  const colors = ['#e83060', '#2ec87a'];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>🧩</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.modes.trivia.title')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('party.trivia.setupDesc', { total: TRIVIA_TOTAL })}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('party.trivia.teamNamesLabel')}
        </Text>
        <View style={{ gap: 10, marginBottom: 32 }}>
          {([0, 1] as const).map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors[i] + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors[i], fontSize: 16 }}>{i === 0 ? '🔴' : '🟢'}</Text>
              </View>
              <TextInput value={names[i]} onChangeText={val => { const n: [string, string] = [...names] as [string, string]; n[i] = val; setNames(n); }}
                placeholder={t('party.teamN', { n: i + 1 })} placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            </View>
          ))}
        </View>
        <PrimaryBtn label={t('party.trivia.start')} onPress={() => onStart([names[0].trim() || t('party.teamN', { n: 1 }), names[1].trim() || t('party.teamN', { n: 2 })])}
          colors={['#2ec87a', '#1a7845']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TriviaPlaying({ teamNames, scores, currentTeam, questionIdx, question: rawQuestion, onAnswer, onExit }: {
  teamNames: [string, string]; scores: [number, number]; currentTeam: 0 | 1;
  questionIdx: number; question: Question | undefined; onAnswer: (correct: boolean) => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const teamColors: [string, string] = ['#e83060', '#2ec87a'];
  const teamColor = teamColors[currentTeam];

  const question = useMemo(
    () => (rawQuestion ? shuffleQuestion(rawQuestion) : undefined),
    [rawQuestion],
  );

  if (!question) return null;

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (question.id) pushSeen('friends', undefined, [question.id]);
    setTimeout(() => onAnswer(i === question.ans), 1000);
  };

  const getState = (i: number): AnswerState => {
    if (!answered) return null;
    if (i === question.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <ExitBtn onExit={onExit} />
        </View>
        {/* Header */}
        <View style={{ backgroundColor: teamColor + '15', borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: teamColor + '40' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: teamColor, fontSize: 11, fontFamily: 'Outfit_600SemiBold', marginBottom: 2 }}>{t('party.trivia.turnOf')}</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>{teamNames[currentTeam]}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
                {questionIdx + 1}/{TRIVIA_TOTAL}
              </Text>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                {scores[0]} – {scores[1]}
              </Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${((questionIdx + 1) / TRIVIA_TOTAL) * 100}%`, backgroundColor: teamColor, borderRadius: 99 }} />
          </View>
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 20 }}>{question.q}</Text>
        <View style={{ gap: 9 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => handle(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function TriviaResults({ teamNames, scores, onReplay, onBack }: {
  teamNames: [string, string]; scores: [number, number]; onReplay: () => void; onBack: () => void;
}) {
  const { t } = useTranslation();
  const tied = scores[0] === scores[1];
  const winner = tied ? -1 : scores[0] > scores[1] ? 0 : 1;
  const teamColors: [string, string] = ['#e83060', '#2ec87a'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 64, marginBottom: 12 }}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4, textAlign: 'center' }}>
            {tied ? t('party.tie') : t('party.winnerIs', { name: winner >= 0 ? teamNames[winner as 0 | 1] : '' })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>
            {t('party.trivia.totalQuestions', { total: TRIVIA_TOTAL })}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          {([0, 1] as const).map(i => {
            const isW = winner === i;
            return (
              <View key={i} style={{ flex: 1, backgroundColor: isW ? teamColors[i] + '15' : '#151515', borderWidth: 1, borderColor: isW ? teamColors[i] : 'transparent', borderRadius: 16, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: teamColors[i], fontSize: 13, fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>{teamNames[i]}</Text>
                <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Outfit_800ExtraBold' }}>{scores[i]}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
                  {t('party.trivia.accuracyPct', { pct: Math.round((scores[i] / TRIVIA_TOTAL) * 100) })}
                </Text>
                {isW && <Text style={{ color: teamColors[i], fontSize: 11, fontFamily: 'Outfit_700Bold', marginTop: 6 }}>{t('party.trivia.winnersTag')}</Text>}
              </View>
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.rematch')} onPress={onReplay} colors={['#2ec87a', '#1a7845']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('party.backToModes')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// MARCADOR — preguntas random por turnos, sin tiempo ni rondas
// ══════════════════════════════════════════════════════════════

const MARCADOR_COLOR = '#a060e8';
const MARCADOR_GRAD: [string, string] = ['#a060e8', '#6020b0'];

function MarcadorGame({ onBack }: { onBack: () => void }) {
  type MS = 'setup' | 'ready' | 'question' | 'feedback' | 'results';
  const [screen, setScreen] = useState<MS>('setup');
  const [players, setPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [turns, setTurns] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean>(false);
  const [lastSelected, setLastSelected] = useState<number>(-1);

  const baseQ = questions.length > 0 ? questions[qIdx % questions.length] : undefined;
  const currentQ = useMemo(() => (baseQ ? shuffleQuestion(baseQ) : undefined), [baseQ, qIdx]);

  const startGame = (names: string[]) => {
    setPlayers(names);
    setScores(new Array(names.length).fill(0));
    setTurns(new Array(names.length).fill(0));
    setCurrentIdx(0);
    setQIdx(0);
    buildFreshPool().then(setQuestions);
    setScreen('ready');
  };

  const handleAnswer = (i: number) => {
    if (!currentQ) return;
    const correct = i === currentQ.ans;
    setLastCorrect(correct);
    setLastSelected(i);
    setScores(s => { const n = [...s]; if (correct) n[currentIdx] = n[currentIdx] + 1; return n; });
    setTurns(t => { const n = [...t]; n[currentIdx] = n[currentIdx] + 1; return n; });
    if (currentQ.id) pushSeen('friends', undefined, [currentQ.id]);
    setScreen('feedback');
  };

  const handleNextPlayer = () => {
    setCurrentIdx(i => (i + 1) % players.length);
    setQIdx(i => i + 1);
    setLastSelected(-1);
    setScreen('ready');
  };

  const handleFinish = () => setScreen('results');

  const replay = () => {
    setScores(new Array(players.length).fill(0));
    setTurns(new Array(players.length).fill(0));
    setCurrentIdx(0);
    setQIdx(0);
    buildFreshPool().then(setQuestions);
    setScreen('ready');
  };

  if (screen === 'setup') return <MarcadorSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'ready') return (
    <MarcadorReady playerName={players[currentIdx]} players={players} scores={scores}
      currentIdx={currentIdx} onReady={() => setScreen('question')} onFinish={handleFinish} onExit={onBack} />
  );
  if (screen === 'question') return (
    <MarcadorQuestion playerName={players[currentIdx]} question={currentQ} onAnswer={handleAnswer} onFinish={handleFinish} onExit={onBack} />
  );
  if (screen === 'feedback') return (
    <MarcadorFeedback playerName={players[currentIdx]} question={currentQ} selected={lastSelected}
      correct={lastCorrect} players={players} scores={scores} onNext={handleNextPlayer} onFinish={handleFinish} onExit={onBack} />
  );
  if (screen === 'results') return (
    <MarcadorResults players={players} scores={scores} turns={turns} onReplay={replay} onBack={onBack} />
  );
  return null;
}

function MarcadorSetup({ onStart, onBack }: { onStart: (names: string[]) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState(['', '']);
  const addPlayer = () => { if (players.length < 8) setPlayers(p => [...p, '']); };
  const removePlayer = (i: number) => { if (players.length > 2) setPlayers(p => p.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i: number, name: string) => { setPlayers(p => { const n = [...p]; n[i] = name; return n; }); };
  const handleStart = () => onStart(players.map((p, i) => p.trim() || t('party.playerN', { n: i + 1 })));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>🎯</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{t('party.modes.marcador.title')}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('party.marcador.setupDesc')}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('party.playersCountMax', { count: players.length })}
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(160,96,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: MARCADOR_COLOR, fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={p} onChangeText={val => updatePlayer(i, val)} placeholder={t('party.playerN', { n: i + 1 })}
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              {players.length > 2 && (
                <Pressable onPress={() => removePlayer(i)} style={{ padding: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
        {players.length < 8 && (
          <Pressable onPress={addPlayer} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 28, borderStyle: 'dashed' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>{t('party.addPlayer')}</Text>
          </Pressable>
        )}
        <PrimaryBtn label={t('party.start')} onPress={handleStart} colors={MARCADOR_GRAD} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MarcadorScoreboard({ players, scores, currentIdx }: {
  players: string[]; scores: number[]; currentIdx: number;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {players.map((name, i) => {
        const active = i === currentIdx;
        return (
          <View key={i} style={{
            flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6,
            backgroundColor: active ? 'rgba(160,96,232,0.12)' : '#151515',
            borderWidth: 1, borderColor: active ? MARCADOR_COLOR : 'transparent',
            borderRadius: 12,
          }}>
            <Text numberOfLines={1} style={{
              color: active ? MARCADOR_COLOR : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontFamily: 'Outfit_600SemiBold', marginBottom: 2,
            }}>{name}</Text>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold' }}>{scores[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

function MarcadorReady({ playerName, players, scores, currentIdx, onReady, onFinish, onExit }: {
  playerName: string; players: string[]; scores: number[]; currentIdx: number;
  onReady: () => void; onFinish: () => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Outfit_600SemiBold' }}>{t('party.marcador.scoreboardTag')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={onFinish} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('party.marcador.finish')}</Text>
            </Pressable>
            <ExitBtn onExit={onExit} />
          </View>
        </View>

        <MarcadorScoreboard players={players} scores={scores} currentIdx={currentIdx} />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>🎯</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>
            {t('party.turnFor')}
          </Text>
          <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Outfit_800ExtraBold', textAlign: 'center', marginBottom: 8 }}>
            {playerName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginBottom: 32 }}>
            {t('party.marcador.turnPass', { name: playerName })}
          </Text>
        </View>

        <PrimaryBtn label={t('party.imReady')} onPress={onReady} colors={MARCADOR_GRAD} />
      </View>
    </SafeAreaView>
  );
}

function MarcadorQuestion({ playerName, question, onAnswer, onFinish, onExit }: {
  playerName: string; question: Question | undefined; onAnswer: (i: number) => void; onFinish: () => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => { setSelected(null); }, [question?.id]);

  if (!question) return null;

  const handle = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onAnswer(i), 250);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(160,96,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>🎯</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }} numberOfLines={1}>{playerName}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={onFinish} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 99, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('party.marcador.finish')}</Text>
            </Pressable>
            <ExitBtn onExit={onExit} />
          </View>
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 24 }}>{question.q}</Text>
        <View style={{ gap: 9 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]}
              state={selected === null ? null : i === selected ? 'selected' : null}
              onPress={() => handle(i)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function MarcadorFeedback({ playerName, question, selected, correct, players, scores, onNext, onFinish, onExit }: {
  playerName: string; question: Question | undefined; selected: number; correct: boolean;
  players: string[]; scores: number[]; onNext: () => void; onFinish: () => void; onExit: () => void;
}) {
  const { t } = useTranslation();
  if (!question) return null;
  const getState = (i: number): AnswerState => {
    if (i === question.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <ExitBtn onExit={onExit} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }} numberOfLines={1}>{playerName}</Text>
          <View style={{
            paddingVertical: 4, paddingHorizontal: 12, borderRadius: 99,
            backgroundColor: correct ? 'rgba(46,200,122,0.12)' : 'rgba(232,48,96,0.12)',
            borderWidth: 1, borderColor: correct ? '#2ec87a' : '#e83060',
          }}>
            <Text style={{ color: correct ? '#2ec87a' : '#e83060', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
              {correct ? t('party.marcador.feedbackCorrect') : t('party.marcador.feedbackWrong')}
            </Text>
          </View>
        </View>

        <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold', lineHeight: 24, marginBottom: 16 }}>{question.q}</Text>
        <View style={{ gap: 9, marginBottom: 16 }}>
          {question.opts.map((opt, i) => (
            <OptionBtn key={i} text={opt} letter={LETTERS[i]} state={getState(i)} onPress={() => {}} />
          ))}
        </View>

        {question.ctx && (
          <View style={{
            padding: 14, borderRadius: 14, marginBottom: 16,
            backgroundColor: 'rgba(160,96,232,0.08)',
            borderWidth: 1, borderColor: 'rgba(160,96,232,0.2)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
              {question.ctx}
            </Text>
          </View>
        )}

        <View style={{ marginBottom: 16 }}>
          <MarcadorScoreboard players={players} scores={scores} currentIdx={-1} />
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.nextPlayer')} onPress={onNext} colors={MARCADOR_GRAD} />
          <Pressable onPress={onFinish} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>{t('party.marcador.finishGame')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MarcadorResults({ players, scores, turns, onReplay, onBack }: {
  players: string[]; scores: number[]; turns: number[]; onReplay: () => void; onBack: () => void;
}) {
  const { t } = useTranslation();
  const totalTurns = turns.reduce((a, b) => a + b, 0);
  const ranked = players
    .map((name, i) => ({ name, score: scores[i], turns: turns[i] }))
    .sort((a, b) => b.score - a.score);
  const tied = ranked.length > 1 && ranked[0].score === ranked[1].score;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 56, marginBottom: 8 }}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', textAlign: 'center' }}>
            {tied ? t('party.tie') : t('party.winnerIs', { name: ranked[0].name })}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
            {t('party.marcador.questionsPlayed', { count: totalTurns })}
          </Text>
        </View>

        <View style={{ gap: 8, marginBottom: 28 }}>
          {ranked.map((p, i) => {
            const top = i === 0 && !tied;
            const accuracy = p.turns > 0 ? Math.round((p.score / p.turns) * 100) : 0;
            return (
              <View key={`${i}-${p.name}`} style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                backgroundColor: top ? 'rgba(160,96,232,0.08)' : '#151515',
                borderWidth: 1, borderColor: top ? MARCADOR_COLOR : 'transparent',
                borderRadius: 14, padding: 14,
              }}>
                <Text style={{ fontSize: 22, width: 28 }}>{i < 3 ? medals[i] : `${i + 1}`}</Text>
                <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: top ? MARCADOR_COLOR : '#222', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{p.name[0]?.toUpperCase() ?? '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: top ? MARCADOR_COLOR : '#fff', fontSize: 16, fontFamily: top ? 'Outfit_700Bold' : 'Outfit_500Medium' }}>{p.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
                    {t('party.marcador.playerStats', { turns: p.turns, accuracy })}
                  </Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold' }}>{p.score}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryBtn label={t('party.rematch')} onPress={onReplay} colors={MARCADOR_GRAD} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>{t('party.backToModes')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════

export default function FriendsScreen() {
  const { t } = useTranslation();
  const offline = useOffline();
  const [screen, setScreen] = useState<Screen>('modes');

  if (offline) {
    return (
      <OfflineNotice
        title={t('party.offlineTitle')}
        description={t('party.offlineDesc')}
      />
    );
  }

  if (screen === 'modes') return <ModesScreen onSelect={setScreen} />;
  if (screen === 'pasa') return <PasaGame onBack={() => setScreen('modes')} />;
  if (screen === 'duelo') return <DueloGame onBack={() => setScreen('modes')} />;
  if (screen === 'survivor') return <SurvivorGame onBack={() => setScreen('modes')} />;
  if (screen === 'trivia') return <TriviaGame onBack={() => setScreen('modes')} />;
  if (screen === 'marcador') return <MarcadorGame onBack={() => setScreen('modes')} />;
  return null;
}
