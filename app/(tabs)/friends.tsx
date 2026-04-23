import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { QUESTIONS } from '@/constants/questions';
import { shuffle } from '@/lib/utils';
import { AnswerState, Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────

type Screen = 'modes' | 'pasa' | 'duelo' | 'survivor' | 'trivia';

// ─── Helpers ──────────────────────────────────────────────────

function buildPool(): Question[] {
  const arr: Question[] = [];
  Object.values(QUESTIONS).forEach(qs => arr.push(...qs));
  return shuffle(arr);
}

const DURATION = 30;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function BackBtn({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 }}>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>Modos</Text>
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
  const modes = [
    {
      id: 'pasa' as Screen,
      icon: '📱', color: '#30a8e8', bg: '#0a1f2d', border: 'rgba(48,168,232,0.3)',
      tag: 'CLÁSICO', title: 'Pasa el Móvil',
      desc: 'Cada jugador hace 30 segundos con las mismas preguntas. ¿Quién responde más?',
      players: '2-8 jugadores', btn: 'Jugar →',
    },
    {
      id: 'duelo' as Screen,
      icon: '⚔️', color: '#e83060', bg: '#2d0a18', border: 'rgba(232,48,96,0.3)',
      tag: 'VERSUS', title: 'Duelo 1vs1',
      desc: 'La misma pregunta para dos. El primero en buzzear y acertar gana el punto.',
      players: '2 jugadores', btn: 'Jugar →',
    },
    {
      id: 'survivor' as Screen,
      icon: '💀', color: '#e8a030', bg: '#2d1f0a', border: 'rgba(232,160,48,0.3)',
      tag: 'ELIMINACIÓN', title: 'Superviviente',
      desc: 'Una pregunta cada ronda. El que falla, eliminado. El último en pie gana.',
      players: '3-8 jugadores', btn: 'Jugar →',
    },
    {
      id: 'trivia' as Screen,
      icon: '🧩', color: '#2ec87a', bg: '#0d2214', border: 'rgba(46,200,122,0.3)',
      tag: 'EQUIPOS', title: 'Trivia Night',
      desc: 'Dos equipos se turnan. El equipo con más aciertos al final de 20 preguntas gana.',
      players: '4-10 jugadores', btn: 'Jugar →',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
          Jugar con amigos
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 24 }}>
          Pasad el móvil o competid en el mismo sitio
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
    setSharedQ(buildPool());
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
    setSharedQ(buildPool());
    setScreen('countdown');
  };

  if (screen === 'setup') return <PasaSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'countdown') return <PasaCountdown playerName={players[currentIdx]} onDone={() => setScreen('playing')} />;
  if (screen === 'playing') return (
    <PasaPlaying playerName={players[currentIdx]} playerIdx={currentIdx} totalPlayers={players.length} questions={sharedQ} onDone={handlePlayerDone} />
  );
  if (screen === 'between') return (
    <PasaBetween playerName={players[currentIdx]} score={scores[currentIdx]} answered={answeredCounts[currentIdx]}
      isLast={currentIdx === players.length - 1} onNext={handleNext} />
  );
  if (screen === 'results') return <PasaResults players={players} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function PasaSetup({ onStart, onBack }: { onStart: (players: string[]) => void; onBack: () => void }) {
  const [players, setPlayers] = useState(['', '']);
  const addPlayer = () => { if (players.length < 8) setPlayers(p => [...p, '']); };
  const removePlayer = (i: number) => { if (players.length > 2) setPlayers(p => p.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i: number, name: string) => { setPlayers(p => { const n = [...p]; n[i] = name; return n; }); };
  const handleStart = () => onStart(players.map((p, i) => p.trim() || `Jugador ${i + 1}`));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>📱</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>Pasa el Móvil</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          Cada jugador tendrá 30 segundos con las mismas preguntas.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Jugadores ({players.length})
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(48,168,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#30a8e8', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={p} onChangeText={t => updatePlayer(i, t)} placeholder={`Jugador ${i + 1}`}
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
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>+ Añadir jugador</Text>
          </Pressable>
        )}
        <PrimaryBtn label="¡Empezar! →" onPress={handleStart} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PasaCountdown({ playerName, onDone }: { playerName: string; onDone: () => void }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>Le toca a</Text>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 48 }}>{playerName}</Text>
        <Text style={{ color: '#30a8e8', fontSize: 96, fontFamily: 'Outfit_800ExtraBold' }}>{count}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 24 }}>¡Prepárate!</Text>
      </View>
    </SafeAreaView>
  );
}

function PasaPlaying({ playerName, playerIdx, totalPlayers, questions, onDone }: {
  playerName: string; playerIdx: number; totalPlayers: number; questions: Question[];
  onDone: (score: number, answered: number) => void;
}) {
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

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i); setAnswered(true);
    const q = questions[qIdx % questions.length];
    if (i === q.ans) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => { setAnswered(false); setSelected(null); setQIdx(x => x + 1); }, 400);
  };

  const q = questions[qIdx % questions.length];
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>Jugador {playerIdx + 1}/{totalPlayers}</Text>
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

function PasaBetween({ playerName, score, answered, isLast, onNext }: {
  playerName: string; score: number; answered: number; isLast: boolean; onNext: () => void;
}) {
  const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>{score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>{playerName} ha hecho</Text>
        <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>{score} correctas</Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
          {answered} respondidas · {accuracy}% de acierto
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label={isLast ? '🏆 Ver resultados' : 'Siguiente →'} onPress={onNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PasaResults({ players, scores, onReplay, onBack }: {
  players: string[]; scores: number[]; onReplay: () => void; onBack: () => void;
}) {
  const ranked = players.map((name, i) => ({ name, score: scores[i] })).sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🏆</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold' }}>Resultados</Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 4 }}>
            ¡Enhorabuena a {ranked[0].name}!
          </Text>
        </View>
        <View style={{ gap: 8, marginBottom: 32 }}>
          {ranked.map((p, i) => (
            <View key={p.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: i === 0 ? 'rgba(48,168,232,0.08)' : '#151515', borderWidth: 1, borderColor: i === 0 ? 'rgba(48,168,232,0.3)' : 'transparent', borderRadius: 14, padding: 14 }}>
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
          <PrimaryBtn label="Revancha 🔄" onPress={onReplay} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Volver a modos</Text>
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
    setQuestions(buildPool());
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
    setQuestions(buildPool());
    setScreen('playing');
  };

  if (screen === 'setup') return <DueloSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'playing') return (
    <DueloPlaying key={round} players={players} scores={scores} round={round}
      question={questions[round % Math.max(questions.length, 1)]} onRoundEnd={handleRoundEnd} />
  );
  if (screen === 'results') return <DueloResults players={players} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function DueloSetup({ onStart, onBack }: { onStart: (names: [string, string]) => void; onBack: () => void }) {
  const [names, setNames] = useState<[string, string]>(['', '']);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>⚔️</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>Duelo 1vs1</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          Cada jugador coge un extremo del móvil. El primero en buzzear y acertar gana el punto. 10 rondas.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Jugadores
        </Text>
        <View style={{ gap: 10, marginBottom: 28 }}>
          {([0, 1] as const).map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: i === 0 ? 'rgba(232,48,96,0.15)' : 'rgba(48,168,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: i === 0 ? '#e83060' : '#30a8e8', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={names[i]} onChangeText={t => { const n: [string, string] = [...names] as [string, string]; n[i] = t; setNames(n); }}
                placeholder={`Jugador ${i + 1}`} placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            </View>
          ))}
        </View>
        <PrimaryBtn label="¡Empezar duelo! →" onPress={() => onStart([names[0].trim() || 'Jugador 1', names[1].trim() || 'Jugador 2'])}
          colors={['#e83060', '#a010a0']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DueloPlaying({ players, scores, round, question, onRoundEnd }: {
  players: [string, string]; scores: [number, number]; round: number;
  question: Question | undefined; onRoundEnd: (winner: 0 | 1) => void;
}) {
  const [buzzed, setBuzzed] = useState<0 | 1 | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

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
    return (
      <View style={{ flex: 1, backgroundColor: '#111' }}>
        {/* Player 1 — top, rotated */}
        <Pressable onPress={() => handleBuzz(0)} style={{ flex: 1, backgroundColor: bgs[0], alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <View style={{ transform: [{ rotate: '180deg' }], alignItems: 'center' }}>
            <View style={{ backgroundColor: colors[0] + '20', borderRadius: 99, paddingVertical: 16, paddingHorizontal: 32, borderWidth: 2, borderColor: colors[0] }}>
              <Text style={{ color: colors[0], fontSize: 22, fontFamily: 'Outfit_800ExtraBold' }}>⚡ BUZZEAR</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Outfit_600SemiBold', marginTop: 12 }}>
              {players[0]} · {scores[0]} pts
            </Text>
          </View>
        </Pressable>

        {/* Center strip: round info + question */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222' }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_600SemiBold', textAlign: 'center', letterSpacing: 1, marginBottom: 6 }}>
            RONDA {round + 1}/{DUELO_ROUNDS}
          </Text>
          <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold', textAlign: 'center', lineHeight: 22 }}>
            {question.q}
          </Text>
        </View>

        {/* Player 2 — bottom, normal */}
        <Pressable onPress={() => handleBuzz(1)} style={{ flex: 1, backgroundColor: bgs[1], alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <View style={{ backgroundColor: colors[1] + '20', borderRadius: 99, paddingVertical: 16, paddingHorizontal: 32, borderWidth: 2, borderColor: colors[1] }}>
            <Text style={{ color: colors[1], fontSize: 22, fontFamily: 'Outfit_800ExtraBold' }}>⚡ BUZZEAR</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Outfit_600SemiBold', marginTop: 12 }}>
            {players[1]} · {scores[1]} pts
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            Ronda {round + 1}/{DUELO_ROUNDS}
          </Text>
          <View style={{ backgroundColor: colors[buzzed] + '20', borderRadius: 99, paddingVertical: 4, paddingHorizontal: 12 }}>
            <Text style={{ color: colors[buzzed], fontSize: 13, fontFamily: 'Outfit_700Bold' }}>⚡ {players[buzzed]}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
            {scores[0]} – {scores[1]}
          </Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 20 }}>{question.q}</Text>
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
  const winner = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
  const tied = winner === -1;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 12 }}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4, textAlign: 'center' }}>
            {tied ? '¡Empate!' : `¡Gana ${players[winner]}!`}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            {scores[0]} – {scores[1]} tras {DUELO_ROUNDS} rondas
          </Text>
          {/* Score cards */}
          <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginBottom: 40 }}>
            {([0, 1] as const).map(i => {
              const isWinner = winner === i;
              return (
                <View key={i} style={{ flex: 1, backgroundColor: isWinner ? 'rgba(232,48,96,0.1)' : '#151515', borderWidth: 1, borderColor: isWinner ? '#e83060' : 'transparent', borderRadius: 16, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: i === 0 ? '#e83060' : '#30a8e8', fontSize: 13, fontFamily: 'Outfit_700Bold', marginBottom: 4 }}>{players[i]}</Text>
                  <Text style={{ color: '#fff', fontSize: 36, fontFamily: 'Outfit_800ExtraBold' }}>{scores[i]}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>puntos</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryBtn label="Revancha 🔄" onPress={onReplay} colors={['#e83060', '#a010a0']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Volver a modos</Text>
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
  const currentQ = questions[roundIdx % Math.max(questions.length, 1)];

  const startGame = (names: string[]) => {
    const initial = new Array(names.length).fill(true);
    const order = names.map((_, i) => i);
    setPlayers(names);
    setAlive(initial);
    setRoundIdx(0);
    setQuestions(buildPool());
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
    setQuestions(buildPool());
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>💀</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>
          Ronda {roundIdx + 1} · {answeringPos + 1}/{aliveOrder.length}
        </Text>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>
          {players[currentPlayerIdx]}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 48, textAlign: 'center' }}>
          ¿Listo? No mires la pantalla{'\n'}hasta que le des a empezar.
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label="¡Estoy listo! →" onPress={() => setScreen('question')} colors={['#e8a030', '#c06010']} />
        </View>
      </View>
    </SafeAreaView>
  );

  if (screen === 'question') return (
    <SurvivorQuestion playerName={players[currentPlayerIdx]} question={currentQ} onAnswer={handleAnswer} />
  );

  if (screen === 'answered') return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>✅</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 }}>Respondido</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 48, textAlign: 'center' }}>
          Tapa la pantalla y pasa el móvil{'\n'}al siguiente jugador.
        </Text>
        <View style={{ width: '100%' }}>
          <PrimaryBtn label={answeringPos + 1 >= aliveOrder.length ? '📊 Ver resultados de ronda' : 'Siguiente jugador →'}
            onPress={handlePassToNext} colors={['#e8a030', '#c06010']} />
        </View>
      </View>
    </SafeAreaView>
  );

  if (screen === 'reveal') return (
    <SurvivorReveal players={players} aliveOrder={aliveOrder} question={currentQ}
      roundAnswers={{ ...roundAnswers, [currentPlayerIdx]: roundAnswers[currentPlayerIdx] ?? -1 }}
      newAlive={pendingAlive} onNext={handleRevealNext} />
  );

  if (screen === 'results') return (
    <SurvivorResults winner={winner} players={players} alive={pendingAlive.length > 0 ? pendingAlive : alive}
      rounds={roundIdx + 1} onReplay={replay} onBack={onBack} />
  );

  return null;
}

function SurvivorSetup({ onStart, onBack }: { onStart: (names: string[]) => void; onBack: () => void }) {
  const [players, setPlayers] = useState(['', '', '']);
  const addPlayer = () => { if (players.length < 8) setPlayers(p => [...p, '']); };
  const removePlayer = (i: number) => { if (players.length > 3) setPlayers(p => p.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i: number, name: string) => { setPlayers(p => { const n = [...p]; n[i] = name; return n; }); };
  const handleStart = () => onStart(players.map((p, i) => p.trim() || `Jugador ${i + 1}`));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>💀</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>Superviviente</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          Cada ronda, el que falla es eliminado. Mínimo 3 jugadores.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Jugadores ({players.length})
        </Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#e8a030', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput value={p} onChangeText={t => updatePlayer(i, t)} placeholder={`Jugador ${i + 1}`}
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
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>+ Añadir jugador</Text>
          </Pressable>
        )}
        <PrimaryBtn label="¡Empezar! →" onPress={handleStart} colors={['#e8a030', '#c06010']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SurvivorQuestion({ playerName, question, onAnswer }: {
  playerName: string; question: Question | undefined; onAnswer: (i: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!question) return null;

  const handle = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onAnswer(i), 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>💀</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>{playerName}</Text>
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

function SurvivorReveal({ players, aliveOrder, question, roundAnswers, newAlive, onNext }: {
  players: string[]; aliveOrder: number[]; question: Question | undefined;
  roundAnswers: Record<number, number>; newAlive: boolean[]; onNext: () => void;
}) {
  if (!question) return null;
  const eliminated = aliveOrder.filter(pidx => newAlive[pidx] === false);
  const isGameOver = newAlive.filter(Boolean).length <= 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>Resultados de la ronda</Text>
        <View style={{ backgroundColor: 'rgba(46,200,122,0.08)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', marginBottom: 4 }}>RESPUESTA CORRECTA</Text>
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
                  <Text style={{ color: '#e83060', fontSize: 11, fontFamily: 'Outfit_700Bold' }}>ELIMINADO</Text>
                </View>}
              </View>
            );
          })}
        </View>
        {eliminated.length === 0 && (
          <View style={{ backgroundColor: '#151515', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', fontFamily: 'Outfit_500Medium' }}>
              Todos han fallado → nadie eliminado esta ronda
            </Text>
          </View>
        )}
        <PrimaryBtn label={isGameOver ? '🏆 Ver ganador' : 'Siguiente ronda →'} onPress={onNext} colors={['#e8a030', '#c06010']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SurvivorResults({ winner, players, alive, rounds, onReplay, onBack }: {
  winner: string; players: string[]; alive: boolean[]; rounds: number; onReplay: () => void; onBack: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 80, marginBottom: 16 }}>🏆</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>El superviviente es</Text>
          <Text style={{ color: '#e8a030', fontSize: 32, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8, textAlign: 'center' }}>{winner}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 48 }}>
            Sobrevivió {rounds} {rounds === 1 ? 'ronda' : 'rondas'}
          </Text>
          <View style={{ gap: 8, width: '100%', marginBottom: 40 }}>
            {players.map((name, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#151515', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 18 }}>{alive[i] ? '🏆' : '💀'}</Text>
                <Text style={{ color: alive[i] ? '#e8a030' : 'rgba(255,255,255,0.3)', fontSize: 15, fontFamily: alive[i] ? 'Outfit_700Bold' : 'Outfit_400Regular', flex: 1 }}>
                  {name}
                </Text>
                <Text style={{ color: alive[i] ? '#e8a030' : 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>
                  {alive[i] ? 'GANADOR' : 'ELIMINADO'}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <PrimaryBtn label="Revancha 🔄" onPress={onReplay} colors={['#e8a030', '#c06010']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Volver a modos</Text>
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
  type TS = 'setup' | 'playing' | 'results';
  const [screen, setScreen] = useState<TS>('setup');
  const [teamNames, setTeamNames] = useState<[string, string]>(['Equipo 1', 'Equipo 2']);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [currentTeam, setCurrentTeam] = useState<0 | 1>(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const startGame = (names: [string, string]) => {
    setTeamNames(names);
    setScores([0, 0]);
    setCurrentTeam(0);
    setQuestionIdx(0);
    setQuestions(buildPool());
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
    setQuestions(buildPool());
    setScreen('playing');
  };

  if (screen === 'setup') return <TriviaSetup onStart={startGame} onBack={onBack} />;
  if (screen === 'playing') return (
    <TriviaPlaying key={questionIdx} teamNames={teamNames} scores={scores} currentTeam={currentTeam}
      questionIdx={questionIdx} question={questions[questionIdx % Math.max(questions.length, 1)]}
      onAnswer={handleAnswer} />
  );
  if (screen === 'results') return <TriviaResults teamNames={teamNames} scores={scores} onReplay={replay} onBack={onBack} />;
  return null;
}

function TriviaSetup({ onStart, onBack }: { onStart: (names: [string, string]) => void; onBack: () => void }) {
  const [names, setNames] = useState<[string, string]>(['Equipo 1', 'Equipo 2']);
  const colors = ['#e83060', '#2ec87a'];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <BackBtn onPress={onBack} />
        <Text style={{ fontSize: 36, marginBottom: 8 }}>🧩</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>Trivia Night</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {TRIVIA_TOTAL} preguntas, los equipos se turnan. El equipo con más aciertos gana.
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Nombre de los equipos
        </Text>
        <View style={{ gap: 10, marginBottom: 32 }}>
          {([0, 1] as const).map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors[i] + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors[i], fontSize: 16 }}>{i === 0 ? '🔴' : '🟢'}</Text>
              </View>
              <TextInput value={names[i]} onChangeText={t => { const n: [string, string] = [...names] as [string, string]; n[i] = t; setNames(n); }}
                placeholder={`Equipo ${i + 1}`} placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, backgroundColor: '#151515', color: '#fff', borderRadius: 12, padding: 14, fontFamily: 'Outfit_400Regular', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            </View>
          ))}
        </View>
        <PrimaryBtn label="¡Empezar Trivia! →" onPress={() => onStart([names[0].trim() || 'Equipo 1', names[1].trim() || 'Equipo 2'])}
          colors={['#2ec87a', '#1a7845']} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TriviaPlaying({ teamNames, scores, currentTeam, questionIdx, question, onAnswer }: {
  teamNames: [string, string]; scores: [number, number]; currentTeam: 0 | 1;
  questionIdx: number; question: Question | undefined; onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const teamColors: [string, string] = ['#e83060', '#2ec87a'];
  const teamColor = teamColors[currentTeam];

  if (!question) return null;

  const handle = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
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
        {/* Header */}
        <View style={{ backgroundColor: teamColor + '15', borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: teamColor + '40' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: teamColor, fontSize: 11, fontFamily: 'Outfit_600SemiBold', marginBottom: 2 }}>TURNO DE</Text>
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
  const tied = scores[0] === scores[1];
  const winner = tied ? -1 : scores[0] > scores[1] ? 0 : 1;
  const teamColors: [string, string] = ['#e83060', '#2ec87a'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 64, marginBottom: 12 }}>{tied ? '🤝' : '🏆'}</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4, textAlign: 'center' }}>
            {tied ? '¡Empate!' : `¡Gana ${winner >= 0 ? teamNames[winner as 0 | 1] : ''}!`}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>
            {TRIVIA_TOTAL} preguntas en total
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
                  {Math.round((scores[i] / TRIVIA_TOTAL) * 100)}% acierto
                </Text>
                {isW && <Text style={{ color: teamColors[i], fontSize: 11, fontFamily: 'Outfit_700Bold', marginTop: 6 }}>GANADORES 🏆</Text>}
              </View>
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryBtn label="Revancha 🔄" onPress={onReplay} colors={['#2ec87a', '#1a7845']} />
          <Pressable onPress={onBack} style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>Volver a modos</Text>
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
  const [screen, setScreen] = useState<Screen>('modes');

  if (screen === 'modes') return <ModesScreen onSelect={setScreen} />;
  if (screen === 'pasa') return <PasaGame onBack={() => setScreen('modes')} />;
  if (screen === 'duelo') return <DueloGame onBack={() => setScreen('modes')} />;
  if (screen === 'survivor') return <SurvivorGame onBack={() => setScreen('modes')} />;
  if (screen === 'trivia') return <TriviaGame onBack={() => setScreen('modes')} />;
  return null;
}
