import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OptionBtn } from '@/components/OptionBtn';
import { PowerUpBar, PowerUpButton } from '@/components/PowerUpBar';
import { Confetti } from '@/components/Confetti';
import { AdBannerSlot } from '@/components/AdBannerSlot';
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
import { showRewardedAd, isRewardedReady, showResultInterstitial } from '@/lib/ads';
import { logAppsFlyerEvent } from '@/lib/appsflyer';
import {
  getGuestLadderBest, setGuestLadderBest, getLocalLadderBest, setLocalLadderBest,
} from '@/lib/guest';
import {
  LADDER_LIVES, LADDER_CHECKPOINT_EVERY, ladderFloorCoins, ladderDifficulty, ladderTimeLimit, ladderZone,
} from '@/lib/economy';
import { getLocalQuestions } from '@/constants/questions';
import { getCurrentLang } from '@/lib/i18n';
import { pickRandomFresh, shuffleQuestion, ShuffledQuestion } from '@/lib/utils';
import { AnswerState, Question } from '@/types';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

type Phase = 'loading' | 'intro' | 'playing' | 'checkpoint' | 'gameover' | 'done';
const LETTERS = ['A', 'B', 'C', 'D'] as const;

function buildLocal(): Question[] {
  const arr: Question[] = [];
  Object.values(getLocalQuestions(getCurrentLang())).forEach(qs => arr.push(...qs));
  return arr;
}

export default function LadderScreen() {
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
    logAppsFlyerEvent('cg_ladder_run_completed', {
      floors_completed: runFloor,
      coins_banked: banked,
    });
    showResultInterstitial('ladder_complete');
  }, [phase]);

  const pickForFloor = (f: number): ShuffledQuestion | undefined => {
    if (allQ.length === 0) return undefined;
    const diff = ladderDifficulty(f);
    const byDiff = allQ.filter(q => q.difficulty === diff);
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
    { id: 'pw_hint', icon: '💡', label: t('ladder.pwHint'), count: inventory['pw_hint'] ?? 0 },
    { id: 'pw_skip', icon: '⏭️', label: t('ladder.pwSkip'), count: inventory['pw_skip'] ?? 0 },
  ];

  // ─ Loading
  if (phase === 'loading') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ─ Intro
  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🪜</Text>
          <Text style={{ color: C.text, fontSize: 26, fontFamily: Font.black, marginBottom: 8 }}>
            {t('ladder.title')}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, lineHeight: 24, textAlign: 'center', maxWidth: 280, marginBottom: 14 }}>
            {t('ladder.introA')}
            <Text style={{ color: C.wrong, fontFamily: Font.bold }}>{t('ladder.introLives', { lives: LADDER_LIVES })}</Text>
            {t('ladder.introB')}
            <Text style={{ color: C.brandDeep, fontFamily: Font.bold }}>{t('ladder.introRetire')}</Text>
            {t('ladder.introC')}
          </Text>
          {/* Viaje por las zonas */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 20, maxWidth: 300 }}>
            {[1, 6, 11, 16, 21, 26, 31].map((f, i, arr) => {
              const z = ladderZone(f);
              const reached = recordBest >= z.startFloor;
              return (
                <View key={z.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 18, opacity: reached ? 1 : 0.35 }}>{z.emoji}</Text>
                  {i < arr.length - 1 && (
                    <Text style={{ color: C.textFaint, fontSize: 12 }}>→</Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={{ backgroundColor: C.surface, borderRadius: Radius.card, padding: 20, marginBottom: 32, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
            <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginBottom: 4 }}>
              {t('ladder.bestClimb')}
            </Text>
            <Text style={{ color: C.streak, fontSize: 32, fontFamily: Font.black }}>
              {t('profile.stats.floor', { n: recordBest })}
            </Text>
          </View>
          <Pressable onPress={start} style={{ width: '100%' }}>
            <LinearGradient
              colors={[C.brand, C.brand]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: C.onBrand, fontSize: 17, fontFamily: Font.bold }}>{t('ladder.startClimb')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─ Checkpoint (zona conquistada)
  if (phase === 'checkpoint') {
    const conquered = ladderZone(floor);          // zona que se acaba de superar
    const nextZone = ladderZone(floor + 1);       // zona que viene
    const zoneChanges = nextZone.index !== conquered.index;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Confetti active />
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 10 }}>{conquered.emoji}</Text>
          <Text style={{ color: conquered.color, fontFamily: Font.semi, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
            {t('ladder.checkpoint', { floor })}
          </Text>
          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 24, textAlign: 'center', marginBottom: 10 }}>
            {t('ladder.zoneConquered', { zone: t(`ladder.zones.${conquered.id}`) })}
          </Text>
          <View style={{ backgroundColor: tint(C.streak, isDark), borderRadius: Radius.pill, paddingVertical: 6, paddingHorizontal: 16, marginBottom: 14 }}>
            <Text style={{ color: C.streak, fontFamily: Font.black, fontSize: 22 }}>
              {bote} 🪙
            </Text>
          </View>
          {zoneChanges && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 13 }}>
                {t('ladder.nextZoneLabel')}:
              </Text>
              <Text style={{ fontSize: 15 }}>{nextZone.emoji}</Text>
              <Text style={{ color: nextZone.color, fontFamily: Font.bold, fontSize: 14 }}>
                {t(`ladder.zones.${nextZone.id}`)}
              </Text>
            </View>
          )}
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28, maxWidth: 280 }}>
            {t('ladder.checkpointDesc')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            <Pressable onPress={retire} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 18, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.correct }}>
              <Text style={{ color: C.correct, fontFamily: Font.bold, fontSize: 15 }}>{t('ladder.retire')}</Text>
            </Pressable>
            <Pressable onPress={() => advance(floor + 1)} style={{ flex: 1 }}>
              <LinearGradient colors={[C.brand, C.brand]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>{t('ladder.keepClimbing')}</Text>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 10 }}>💔</Text>
          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 24 }}>
            {t('ladder.fell', { floor })}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 28 }}>
            {t('ladder.fellDesc', { coins: banked })}
          </Text>

          <View style={{ width: '100%', gap: 10 }}>
            {canUsePowerups && reviveItems > 0 && (
              <Pressable onPress={reviveWithItem}>
                <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: C.wrong }}>
                  <Text style={{ color: C.wrong, fontFamily: Font.bold, fontSize: 15 }}>{t('ladder.reviveItem', { count: reviveItems })}</Text>
                </View>
              </Pressable>
            )}
            {!guest && !offline && isRewardedReady() && (
              <Pressable onPress={reviveWithAd}>
                <View style={{ backgroundColor: tint(C.correct, isDark), borderRadius: 18, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: C.correct }}>
                  <Text style={{ color: C.correct, fontFamily: Font.bold, fontSize: 15 }}>{t('ladder.reviveAd')}</Text>
                </View>
              </Pressable>
            )}
            <Pressable onPress={endGame}>
              <LinearGradient colors={[C.brand, C.brand]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>{t('ladder.finishCash')}</Text>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <Confetti active={newBest} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
          <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 12 }}>
            <Text style={{ fontSize: 56, marginBottom: 8 }}>{newBest ? '🏆' : '🪜'}</Text>
            <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 28 }}>
              {t('profile.stats.floor', { n: runFloor })}
            </Text>
            {runFloor > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Text style={{ fontSize: 15 }}>{ladderZone(runFloor).emoji}</Text>
                <Text style={{ color: ladderZone(runFloor).color, fontFamily: Font.bold, fontSize: 14 }}>
                  {t('ladder.zoneReached', { zone: t(`ladder.zones.${ladderZone(runFloor).id}`) })}
                </Text>
              </View>
            )}
            <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, marginTop: 4 }}>
              {newBest ? t('ladder.newBest') : t('ladder.yourRecord', { n: recordBest })}
            </Text>
            {award && (award.gainedXp > 0 || award.gainedCoins > 0) && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View style={{ backgroundColor: tint(C.social, isDark), borderRadius: Radius.pill, paddingVertical: 5, paddingHorizontal: 12 }}>
                  <Text style={{ color: C.social, fontFamily: Font.bold, fontSize: 13 }}>+{award.gainedXp} XP</Text>
                </View>
                <View style={{ backgroundColor: tint(C.streak, isDark), borderRadius: Radius.pill, paddingVertical: 5, paddingHorizontal: 12 }}>
                  <Text style={{ color: C.brandDeep, fontFamily: Font.bold, fontSize: 13 }}>+{award.gainedCoins} 🪙</Text>
                </View>
              </View>
            )}
          </View>

          {ranking.length > 0 && (
            <>
              <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.extra, letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 12 }}>
                {t('ladder.bestClimbs')}
              </Text>
              <View style={{ gap: 8, marginBottom: 22 }}>
                {ranking.slice(0, 10).map((r, i) => {
                  const isMe = r.userId === user?.id;
                  return (
                    <View key={r.userId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: isMe ? tint(C.streak, isDark) : C.surface, borderRadius: Radius.row, padding: 11, borderWidth: 1, borderColor: isMe ? C.streak : 'transparent' }}>
                      <Text style={{ width: 22, textAlign: 'center', color: i < 3 ? C.streak : C.textFaint, fontFamily: Font.black, fontSize: 13 }}>
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                      </Text>
                      <Text style={{ flex: 1, color: isMe ? C.streak : C.text, fontFamily: isMe ? Font.bold : Font.semi, fontSize: 14 }}>
                        {r.username}{isMe ? t('ladder.you') : ''}
                      </Text>
                      <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 14 }}>{t('profile.stats.floor', { n: r.ladderBest })}</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={() => router.back()} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 18, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.textBody, fontFamily: Font.semi, fontSize: 15 }}>{t('speed.exit')}</Text>
            </Pressable>
            <Pressable onPress={start} style={{ flex: 2 }}>
              <LinearGradient colors={[C.brand, C.brand]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>{t('ladder.climbAgain')}</Text>
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
  const timerColor = timeLeft > 4 ? C.streak : C.wrong;
  const isCheckpointNext = (floor + 1) % LADDER_CHECKPOINT_EVERY === 0;

  const getState = (i: number): AnswerState => {
    if (!answered) return selected === i ? 'selected' : null;
    if (i === current.ans) return 'correct';
    if (i === selected) return 'wrong';
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{ flex: 1, padding: Space.screen, gap: 16 }}>
        {/* Zona actual */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <Text style={{ fontSize: 15 }}>{ladderZone(floor).emoji}</Text>
          <Text style={{ color: readableOn(ladderZone(floor).color, isDark), fontFamily: Font.black, fontSize: 14, letterSpacing: 0.5 }}>
            {t(`ladder.zones.${ladderZone(floor).id}`)}
          </Text>
        </View>

        {/* Header: piso, vidas, bote */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: C.textFaint, fontFamily: Font.extra, fontSize: 12, letterSpacing: 1 }}>{t('ladder.floorLabel')}</Text>
            <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 30, lineHeight: 34 }}>{floor}</Text>
          </View>
          <Text style={{ fontSize: 19 }}>
            {'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, LADDER_LIVES - lives))}
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: C.textFaint, fontFamily: Font.extra, fontSize: 12, letterSpacing: 1 }}>{t('ladder.pot')}</Text>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 26, lineHeight: 30 }}>{bote} 🪙</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={{ gap: 7 }}>
          <View style={{ height: 8, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${Math.max(0, pct * 100)}%`, backgroundColor: timerColor, borderRadius: Radius.pill }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: C.textFaint, fontFamily: Font.bold, fontSize: 12 }}>
              {t('ladder.difficulty', { level: t(`learn.diff.${ladderDifficulty(floor)}`) })}
            </Text>
            <Text style={{ color: timerColor, fontFamily: Font.black, fontSize: 14 }}>{timeLeft}s</Text>
          </View>
        </View>

        {/* Aviso de checkpoint: el bote queda asegurado si aciertas */}
        {isCheckpointNext && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 9,
            backgroundColor: C.correctTint, borderWidth: 1, borderColor: C.correct,
            borderRadius: Radius.icon, paddingVertical: 11, paddingHorizontal: 13,
          }}>
            <Text style={{ fontSize: 15 }}>🛡️</Text>
            <Text style={{ flex: 1, color: C.correctText, fontFamily: Font.bold, fontSize: 13, lineHeight: 19 }}>
              {t('ladder.checkpointHint')}
            </Text>
          </View>
        )}

        <Text style={{ color: C.text, ...Type.question }}>
          {current.q}
        </Text>

        <View style={{ gap: 11 }}>
          {current.opts.map((opt, i) =>
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
                disabled={answered}
                dimmed={answered && getState(i) === null}
                onPress={() => handle(i)}
              />
            ),
          )}
        </View>

        {hintShown && current.ctx && (
          <View style={{
            padding: 16, backgroundColor: C.surface, borderRadius: Radius.card,
            borderWidth: 1.5, borderColor: C.borderWarm,
          }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 15, marginBottom: 6 }}>{t('ladder.hint')}</Text>
            <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 22 }}>{current.ctx}</Text>
          </View>
        )}

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {canUsePowerups && powerUps.some(p => p.count > 0) && (
            <View style={{ gap: 9 }}>
              <Text style={{ color: C.textFaint, ...Type.sectionLabel, fontSize: 12 }}>
                {t('common.yourHelpers')}
              </Text>
              <PowerUpBar items={powerUps} onUse={usePowerUp} disabled={answered} />
            </View>
          )}
        </View>
      </View>
      <AdBannerSlot />
    </SafeAreaView>
  );
}
