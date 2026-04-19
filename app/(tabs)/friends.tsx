import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { QUESTIONS } from '@/constants/questions';
import { shuffle } from '@/lib/utils';
import { AnswerState, Question } from '@/types';

// ─── Types ────────────────────────────────────────────────────

type Screen =
  | 'modes'
  | 'pasaSetup'
  | 'pasaCountdown'
  | 'pasaPlaying'
  | 'pasaBetween'
  | 'pasaResults'
  | 'dueloTeaser'
  | 'survivorTeaser'
  | 'triviaTeaser';

// ─── Helpers ──────────────────────────────────────────────────

function buildPool(): Question[] {
  const arr: Question[] = [];
  Object.values(QUESTIONS).forEach(qs => arr.push(...qs));
  return shuffle(arr);
}

const DURATION = 30;
const LETTERS = ['A', 'B', 'C', 'D'] as const;

// ─── Sub-screens ──────────────────────────────────────────────

function ModesScreen({ onSelect }: { onSelect: (s: Screen) => void }) {
  const modes = [
    {
      id: 'pasaSetup' as Screen,
      icon: '📱',
      color: '#30a8e8',
      bg: '#0a1f2d',
      border: 'rgba(48,168,232,0.3)',
      tag: 'CLÁSICO',
      title: 'Pasa el Móvil',
      desc: 'Cada jugador hace 30 segundos con las mismas preguntas. ¿Quién responde más?',
      players: '2-8 jugadores',
    },
    {
      id: 'dueloTeaser' as Screen,
      icon: '⚔️',
      color: '#e83060',
      bg: '#2d0a18',
      border: 'rgba(232,48,96,0.3)',
      tag: 'PRÓXIMAMENTE',
      title: 'Duelo 1vs1',
      desc: 'La misma pregunta para dos. El primero en tocar la respuesta correcta gana el punto.',
      players: '2 jugadores',
    },
    {
      id: 'survivorTeaser' as Screen,
      icon: '💀',
      color: '#e8a030',
      bg: '#2d1f0a',
      border: 'rgba(232,160,48,0.3)',
      tag: 'PRÓXIMAMENTE',
      title: 'Superviviente',
      desc: 'Una pregunta cada ronda. El que falla, elimina­do. El último en pie gana.',
      players: '3-8 jugadores',
    },
    {
      id: 'triviaTeaser' as Screen,
      icon: '🧩',
      color: '#2ec87a',
      bg: '#0d2214',
      border: 'rgba(46,200,122,0.3)',
      tag: 'PRÓXIMAMENTE',
      title: 'Trivia Night',
      desc: 'Dos equipos se turnan. El equipo con más aciertos al final de 20 preguntas gana.',
      players: '4-10 jugadores',
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
              <View style={{
                backgroundColor: m.bg, borderWidth: 1, borderColor: m.border,
                borderRadius: 20, padding: 18,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: m.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22 }}>{m.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: m.color, fontSize: 11, fontFamily: 'Outfit_600SemiBold' }}>{m.tag}</Text>
                    </View>
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
                    <Text style={{ color: m.id === 'pasaSetup' ? '#000' : '#fff', fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
                      {m.id === 'pasaSetup' ? 'Jugar →' : 'Ver más →'}
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

// ─── Pasa el Móvil ────────────────────────────────────────────

function PasaSetup({ onStart, onBack }: { onStart: (players: string[]) => void; onBack: () => void }) {
  const [players, setPlayers] = useState(['', '']);

  const addPlayer = () => {
    if (players.length < 8) setPlayers(p => [...p, '']);
  };
  const removePlayer = (i: number) => {
    if (players.length <= 2) return;
    setPlayers(p => p.filter((_, idx) => idx !== i));
  };
  const updatePlayer = (i: number, name: string) => {
    setPlayers(p => { const n = [...p]; n[i] = name; return n; });
  };

  const handleStart = () => {
    const named = players.map((p, i) => p.trim() || `Jugador ${i + 1}`);
    onStart(named);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Pressable onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>Modos</Text>
        </Pressable>

        <Text style={{ fontSize: 36, marginBottom: 8 }}>📱</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
          Pasa el Móvil
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          Añade los jugadores. Cada uno tendrá 30 segundos con las mismas preguntas.
        </Text>

        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Jugadores ({players.length})
        </Text>

        <View style={{ gap: 10, marginBottom: 16 }}>
          {players.map((p, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#30a8e8' + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#30a8e8', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>{i + 1}</Text>
              </View>
              <TextInput
                value={p}
                onChangeText={t => updatePlayer(i, t)}
                placeholder={`Jugador ${i + 1}`}
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={{
                  flex: 1, backgroundColor: '#151515', color: '#fff',
                  borderRadius: 12, padding: 14,
                  fontFamily: 'Outfit_400Regular', fontSize: 15,
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
                }}
              />
              {players.length > 2 && (
                <Pressable onPress={() => removePlayer(i)} style={{ padding: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>×</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {players.length < 8 && (
          <Pressable onPress={addPlayer} style={{
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
            padding: 14, alignItems: 'center', marginBottom: 28,
            borderStyle: 'dashed',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>
              + Añadir jugador
            </Text>
          </Pressable>
        )}

        <Pressable onPress={handleStart}>
          <LinearGradient
            colors={['#30a8e8', '#1a78b8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
              ¡Empezar! →
            </Text>
          </LinearGradient>
        </Pressable>
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
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontFamily: 'Outfit_400Regular', marginBottom: 8 }}>
          Le toca a
        </Text>
        <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 48 }}>
          {playerName}
        </Text>
        <Text style={{ color: '#30a8e8', fontSize: 96, fontFamily: 'Outfit_800ExtraBold' }}>
          {count}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginTop: 24 }}>
          ¡Prepárate!
        </Text>
      </View>
    </SafeAreaView>
  );
}

function PasaPlaying({
  playerName, playerIdx, totalPlayers, questions, onDone,
}: {
  playerName: string;
  playerIdx: number;
  totalPlayers: number;
  questions: Question[];
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
    setSelected(i);
    setAnswered(true);
    const q = questions[qIdx % questions.length];
    const correct = i === q.ans;
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      setQIdx(x => x + 1);
    }, 400);
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
        {/* Player + timer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'Outfit_400Regular' }}>
              Jugador {playerIdx + 1}/{totalPlayers}
            </Text>
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>{playerName}</Text>
          </View>
          <Text style={{ color: timerColor, fontSize: 36, fontFamily: 'Outfit_800ExtraBold' }}>
            {timeLeft}s
          </Text>
          <Text style={{ color: '#30a8e8', fontSize: 18, fontFamily: 'Outfit_700Bold' }}>{score} ✓</Text>
        </View>

        {/* Progress bar */}
        <View style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: timerColor, borderRadius: 99 }} />
        </View>

        <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 26, marginBottom: 20 }}>
          {q.q}
        </Text>

        <View style={{ gap: 9 }}>
          {q.opts.map((opt, i) => (
            <OptionBtn
              key={i}
              text={opt}
              letter={LETTERS[i]}
              state={getState(i)}
              onPress={() => handle(i)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function PasaBetween({
  playerName, score, answered, isLast, onNext,
}: {
  playerName: string;
  score: number;
  answered: number;
  isLast: boolean;
  onNext: () => void;
}) {
  const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>
          {score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 4 }}>
          {playerName} ha hecho
        </Text>
        <Text style={{ color: '#fff', fontSize: 40, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
          {score} correctas
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
          {answered} respondidas · {accuracy}% de acierto
        </Text>

        <Pressable onPress={onNext} style={{ width: '100%' }}>
          <LinearGradient
            colors={['#30a8e8', '#1a78b8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
              {isLast ? '🏆 Ver resultados' : `Pasar a ${' '}→`}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function PasaResults({ players, scores, onReplay, onBack }: {
  players: string[];
  scores: number[];
  onReplay: () => void;
  onBack: () => void;
}) {
  const ranked = players
    .map((name, i) => ({ name, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

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
            <View key={p.name} style={{
              flexDirection: 'row', alignItems: 'center', gap: 12,
              backgroundColor: i === 0 ? 'rgba(48,168,232,0.08)' : '#151515',
              borderWidth: 1,
              borderColor: i === 0 ? 'rgba(48,168,232,0.3)' : 'transparent',
              borderRadius: 14, padding: 14,
            }}>
              <Text style={{ fontSize: 22, width: 28 }}>
                {i < 3 ? medals[i] : `${i + 1}`}
              </Text>
              <View style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: i === 0 ? '#30a8e8' : '#222',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
                  {p.name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ flex: 1, color: i === 0 ? '#30a8e8' : '#fff', fontSize: 16, fontFamily: i === 0 ? 'Outfit_700Bold' : 'Outfit_500Medium' }}>
                {p.name}
              </Text>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>
                {p.score}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <Pressable onPress={onReplay}>
            <LinearGradient
              colors={['#30a8e8', '#1a78b8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_700Bold' }}>Revancha 🔄</Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={onBack} style={{
            backgroundColor: '#1a1a1a', borderRadius: 14, padding: 14, alignItems: 'center',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>
              Volver a modos
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TeaserScreen({ icon, title, desc, onBack }: {
  icon: string; title: string; desc: string; onBack: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24 }}>
        <Pressable onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>←</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_400Regular' }}>Modos</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>{icon}</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 12, textAlign: 'center' }}>
            {title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', textAlign: 'center', lineHeight: 24, maxWidth: 280, marginBottom: 32 }}>
            {desc}
          </Text>
          <View style={{
            backgroundColor: '#151515', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>
              🚧 Próximamente
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function FriendsScreen() {
  const [screen, setScreen] = useState<Screen>('modes');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answeredCounts, setAnsweredCounts] = useState<number[]>([]);
  const [sharedQ, setSharedQ] = useState<Question[]>([]);

  const startGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setScores(new Array(playerNames.length).fill(0));
    setAnsweredCounts(new Array(playerNames.length).fill(0));
    setCurrentIdx(0);
    setSharedQ(buildPool());
    setScreen('pasaCountdown');
  };

  const handlePlayerDone = (score: number, answered: number) => {
    setScores(s => { const n = [...s]; n[currentIdx] = score; return n; });
    setAnsweredCounts(a => { const n = [...a]; n[currentIdx] = answered; return n; });
    setScreen('pasaBetween');
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= players.length) {
      setScreen('pasaResults');
    } else {
      setCurrentIdx(nextIdx);
      setScreen('pasaCountdown');
    }
  };

  const resetAll = () => {
    setScreen('modes');
    setPlayers([]);
    setScores([]);
    setAnsweredCounts([]);
    setCurrentIdx(0);
    setSharedQ([]);
  };

  const replay = () => {
    setScores(new Array(players.length).fill(0));
    setAnsweredCounts(new Array(players.length).fill(0));
    setCurrentIdx(0);
    setSharedQ(buildPool());
    setScreen('pasaCountdown');
  };

  // ─ routing
  if (screen === 'modes') return <ModesScreen onSelect={setScreen} />;

  if (screen === 'pasaSetup') return <PasaSetup onStart={startGame} onBack={() => setScreen('modes')} />;

  if (screen === 'pasaCountdown') return (
    <PasaCountdown
      playerName={players[currentIdx]}
      onDone={() => setScreen('pasaPlaying')}
    />
  );

  if (screen === 'pasaPlaying') return (
    <PasaPlaying
      playerName={players[currentIdx]}
      playerIdx={currentIdx}
      totalPlayers={players.length}
      questions={sharedQ}
      onDone={handlePlayerDone}
    />
  );

  if (screen === 'pasaBetween') return (
    <PasaBetween
      playerName={players[currentIdx]}
      score={scores[currentIdx]}
      answered={answeredCounts[currentIdx]}
      isLast={currentIdx === players.length - 1}
      onNext={handleNext}
    />
  );

  if (screen === 'pasaResults') return (
    <PasaResults
      players={players}
      scores={scores}
      onReplay={replay}
      onBack={resetAll}
    />
  );

  if (screen === 'dueloTeaser') return (
    <TeaserScreen
      icon="⚔️" title="Duelo 1vs1"
      desc="La misma pregunta para dos jugadores. El primero en tocar la respuesta correcta gana el punto. 10 rondas, el mejor de dos gana."
      onBack={() => setScreen('modes')}
    />
  );

  if (screen === 'survivorTeaser') return (
    <TeaserScreen
      icon="💀" title="Superviviente"
      desc="Todos ven la misma pregunta. El que falla es eliminado. Si varios fallan, el más lento en responder es eliminado. Última persona en pie: ganadora."
      onBack={() => setScreen('modes')}
    />
  );

  if (screen === 'triviaTeaser') return (
    <TeaserScreen
      icon="🧩" title="Trivia Night"
      desc="Dos equipos se alternan. Un portavoz por equipo responde en nombre del grupo. 20 preguntas, el equipo con más aciertos gana la noche."
      onBack={() => setScreen('modes')}
    />
  );

  return null;
}
