import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useToast } from '@/context/ToastContext';
import { useProgress } from '@/context/ProgressContext';
import { unlockedCount, totalAchievements } from '@/lib/achievements';
import { grantWelcomeRewardIfPending } from '@/lib/onboarding';
import { fetchDailyPlayerCount, dailyPlayersFallback } from '@/lib/db';
import { setGuestMode, getGuestSpeedRecord } from '@/lib/guest';
import { LevelBadge } from '@/components/LevelBadge';
import { XpBar } from '@/components/XpBar';
import { CoinPill } from '@/components/CoinPill';
import { DailyRouteBanner } from '@/components/DailyRouteBanner';
import { DailyChest } from '@/components/DailyChest';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { LeagueBadge } from '@/components/LeagueBadge';
import { useCosmetics } from '@/hooks/useCosmetics';
import { rankForLevel, progressToNext } from '@/lib/leveling';
import { formatMultiplier, REWARDS } from '@/lib/economy';
import {
  fetchMissionState, claimMission, claimDailyChest, bumpMissions, MissionState,
} from '@/lib/gamification';
import { getLocaleTag } from '@/lib/i18n';
import { ALL_CATEGORIES } from '@/constants/questions';
import { COUNTRIES } from '@/constants/flags';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import {
  Font, Radius, Space, Type, cardShadow, inkButton, tint, warmGradient,
} from '@/constants/theme';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// Modos locales que ofrece la pestaña de Amigos (pasa el móvil, marcador,
// duelo, superviviente y trivia por equipos).
const LOCAL_MODES = 5;

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, refresh } = useProfile();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { showToast } = useToast();
  const { celebrate } = useProgress();
  const { C, isDark } = useTheme();
  const cosmetics = useCosmetics(!guest && !!user, user?.id);
  const [guestSpeedRecord, setGuestSpeedRecordState] = useState(0);
  // "Jugadores hoy": arranca con un valor de respaldo creíble (10–25, estable
  // por día) y se sustituye por el número real si supera las 20 personas.
  const [playersToday, setPlayersToday] = useState(dailyPlayersFallback);
  const [missions, setMissions] = useState<MissionState[]>([]);
  const [claimingMission, setClaimingMission] = useState<string | null>(null);

  // La economía (cofre, misiones, liga) necesita sesión y red.
  const economyOn = !!user && !guest && !offline;
  const chestAvailable =
    economyOn && !!profile && profile.last_chest_at !== new Date().toISOString().slice(0, 10);

  const loadMissions = useCallback(() => {
    if (!economyOn || !user) return;
    fetchMissionState(user.id).then(setMissions);
  }, [economyOn, user?.id]);

  useFocusEffect(useCallback(() => { loadMissions(); }, [loadMissions]));

  const handleChest = async (): Promise<number | null> => {
    const { reward, error } = await claimDailyChest();
    if (error) { showToast({ type: 'info', message: error }); return null; }
    if (reward) bumpMissions('coins_earned', reward);
    return reward ?? 0;
  };

  const handleClaimMission = async (m: MissionState) => {
    if (claimingMission) return;
    setClaimingMission(m.id);
    const award = await claimMission(m.id);
    setClaimingMission(null);
    if (!award) { showToast({ type: 'info', message: t('arena.claimFailed') }); return; }
    celebrate(award);
    refresh();
    loadMissions();
  };

  // Recompensa de bienvenida: se concede la primera vez que se entra a la home
  // ya con sesión (el onboarding la deja "pendiente"). Para invitados no aplica
  // hasta que crean cuenta. Celebramos y refrescamos el saldo al concederla.
  useEffect(() => {
    if (!user || guest || offline) return;
    grantWelcomeRewardIfPending().then(award => {
      if (award) {
        celebrate(award);
        refresh();
      }
    });
  }, [user?.id, guest, offline]);

  // En modo sin conexión, Diario/Amigos/Perfil no están disponibles.
  const lockedTap = () =>
    showToast({ type: 'info', message: t('home.lockedToast') });

  useEffect(() => {
    if (guest) getGuestSpeedRecord().then(setGuestSpeedRecordState);
  }, [guest]);

  // Número real de jugadores del día: solo lo mostramos si supera las 20
  // personas; si no, mantenemos el respaldo. Requiere conexión.
  useEffect(() => {
    if (offline) return;
    fetchDailyPlayerCount().then(count => {
      if (count > 20) setPlayersToday(count);
    });
  }, [offline]);

  const today = new Date().toLocaleDateString(getLocaleTag(), {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const goToAuth = async () => {
    await setGuestMode(false);
    router.replace('/(auth)/login');
  };

  const initial = guest ? '?' : (profile?.username?.[0] ?? '?').toUpperCase();
  const displayName = guest ? t('common.guest') : (profile?.username ?? '…');
  const achievementCount = unlockedCount(profile);
  const speedRecord = guest ? guestSpeedRecord : (profile?.speed_record ?? 0);
  const ladderRecord = profile?.ladder_best ?? 0;
  const rank = rankForLevel(profile?.level ?? 1);
  const mult = formatMultiplier(profile?.streak ?? 0);
  const xpProgress = progressToNext(profile?.xp ?? 0);
  const ink = inkButton(isDark);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: Space.screen, paddingTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.bold, textTransform: 'capitalize' }}>
                {today}
              </Text>
              <Text style={{ color: cosmetics.nameColor ?? C.text, ...Type.screenTitle, marginTop: 3 }}>
                {t('home.greeting', { name: displayName })}
              </Text>
              {!guest && profile && (
                <Pressable
                  onPress={() => offline ? lockedTap() : router.push('/leagues' as any)}
                  style={{ marginTop: 6, alignSelf: 'flex-start' }}
                  hitSlop={8}
                >
                  <LeagueBadge division={profile.league_division ?? 0} variant="chip" />
                </Pressable>
              )}
            </View>
            <Pressable onPress={() => guest ? goToAuth() : offline ? lockedTap() : router.push('/profile')}>
              {guest ? (
                <View style={{
                  width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: C.surfaceSunk, borderWidth: 1, borderColor: C.borderStrong,
                }}>
                  <Text style={{ color: C.textMuted, fontSize: 21, fontFamily: Font.black }}>?</Text>
                </View>
              ) : (
                <View style={cosmetics.frameColor ? { borderWidth: 2, borderColor: cosmetics.frameColor, borderRadius: 20, padding: 2 } : undefined}>
                  <LinearGradient
                    colors={[C.streak, C.brand]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: C.onBrand, fontSize: 21, fontFamily: Font.black }}>{initial}</Text>
                  </LinearGradient>
                </View>
              )}
            </Pressable>
          </View>

          {/* Streak / Guest CTA */}
          {guest ? (
            <Pressable onPress={goToAuth}>
              <View style={{
                marginTop: 14, backgroundColor: C.surface, borderRadius: Radius.cardLg,
                padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
                borderWidth: 1.5, borderColor: C.borderWarm, ...cardShadow(isDark),
              }}>
                <Text style={{ fontSize: 26 }}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.extra }}>
                    {t('home.guestCtaTitle')}
                  </Text>
                  <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 2, lineHeight: 19 }}>
                    {t('home.guestCtaSub')}
                  </Text>
                </View>
                <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>
              </View>
            </Pressable>
          ) : user ? (
            <StreakHeatmap userId={user.id} streak={profile?.streak ?? 0} />
          ) : (
            <View style={{
              marginTop: 14, backgroundColor: C.surface, borderRadius: Radius.cardLg,
              padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
              borderWidth: 1, borderColor: C.border, ...cardShadow(isDark),
            }}>
              <View style={{
                width: 44, height: 44, borderRadius: Radius.icon,
                backgroundColor: C.brandTint, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 22 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.extra }}>
                  {t('home.streakDays', { count: profile?.streak ?? 0 })}
                </Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 2 }}>
                  {(profile?.streak ?? 0) > 0 ? t('home.streakKeep') : t('home.streakStart')}
                </Text>
              </View>
              <Text style={{ color: C.streakText, fontSize: 30, fontFamily: Font.black, lineHeight: 34 }}>
                {profile?.streak ?? 0}
              </Text>
            </View>
          )}

          {/* Progreso (nivel + XP + monedas) → Arena */}
          {!guest && (
            <Pressable onPress={() => offline ? lockedTap() : router.push('/profile')} style={{ marginTop: 10 }}>
              <View style={{
                backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 12,
                borderWidth: 1, borderColor: C.border, gap: 10, ...cardShadow(isDark),
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                  <LevelBadge level={profile?.level ?? 1} size={40} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16 }}>
                      {t('components.levelUp.level', { level: profile?.level ?? 1 })}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 1 }}>
                      <Text style={{ color: readableOn(rank.color, isDark), fontFamily: Font.bold, fontSize: 13 }}>
                        {t(`ranks.${rank.id}`)}
                      </Text>
                      {mult && (
                        <View style={{ backgroundColor: C.brandTint, borderRadius: Radius.pill, paddingHorizontal: 9, paddingVertical: 2 }}>
                          <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>{mult} XP</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <CoinPill coins={profile?.coins ?? 0} small />
                </View>
                {/* Barra y "faltan X XP" en la misma fila: la etiqueta debajo
                    costaba una línea entera de alto. */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <XpBar xp={profile?.xp ?? 0} showLabel={false} height={8} />
                  </View>
                  <Text numberOfLines={1} style={{ color: C.textFaint, fontFamily: Font.bold, fontSize: 12 }}>
                    {t('components.xpBar.toNext', { xp: xpProgress.toNext, level: xpProgress.level + 1 })}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        </View>

        {/* Resumen de la ruta de hoy; la ruta entera está en Diario. */}
        {!guest && !offline && user && (
          <View style={{ paddingHorizontal: Space.screen }}>
            <DailyRouteBanner userId={user.id} profile={profile} />
          </View>
        )}

        {/* Cofre diario y liga semanal (venían de Arena) */}
        {economyOn && (
          <View style={{ paddingHorizontal: Space.screen, marginTop: 10 }}>
            <DailyChest available={chestAvailable} onClaim={handleChest} onClaimed={refresh} />

            <Pressable onPress={() => router.push('/leagues' as any)}>
              <View style={{
                backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 12,
                borderWidth: 1, borderColor: C.border,
                flexDirection: 'row', alignItems: 'center', gap: 12,
              }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 13,
                  backgroundColor: C.coinTint, alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 19 }}>🏆</Text>
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.black }}>{t('leagues.cardTitle')}</Text>
                  <Text numberOfLines={1} style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
                    {t('leagues.cardDesc')}
                  </Text>
                </View>
                <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* A qué jugamos */}
        <View style={{ paddingHorizontal: Space.screen, marginTop: 16 }}>
          <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginBottom: 10 }}>
            {t('home.gameModes')}
          </Text>

          {/* Protagonista: pregunta del día */}
          <Pressable
            onPress={() => offline ? lockedTap() : router.push('/(tabs)/daily')}
            style={{ opacity: offline ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={warmGradient(isDark)}
              start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }}
              style={{
                borderRadius: 24, padding: 18, gap: 12,
                borderWidth: 1.5, borderColor: C.borderWarm,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 46, height: 46, borderRadius: Radius.row,
                  backgroundColor: isDark ? C.surfaceSunk : C.surface,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 23 }}>🏆</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.black, letterSpacing: 1.2 }}>
                    {t('home.dailyTag')}
                  </Text>
                  <Text style={{ color: C.text, fontSize: 20, fontFamily: Font.black }}>
                    {t('home.dailyTitle')}
                  </Text>
                </View>
              </View>
              <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, lineHeight: 22 }}>
                {t('home.dailyDesc')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ backgroundColor: ink.backgroundColor, paddingVertical: 11, paddingHorizontal: 22, borderRadius: Radius.pill }}>
                  <Text style={{ color: ink.color, fontSize: 15, fontFamily: Font.extra }}>{t('home.dailyCta')}</Text>
                </View>
                <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.semi, flex: 1 }}>
                  {offline ? t('home.offline') : t('home.playersToday', { count: playersToday })}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Rejilla 2×2 con el resto de modos */}
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'space-between', rowGap: 10, marginTop: 10,
          }}>
            <ModeTile
              C={C} isDark={isDark}
              icon="⚡" accent={C.speed}
              title={t('home.modes.speed')}
              meta={speedRecord > 0 ? t('home.modes.speedRecord', { count: speedRecord }) : t('home.modes.noRecord')}
              onPress={() => router.push('/speed')}
            />
            <ModeTile
              C={C} isDark={isDark}
              icon="🪜" accent={C.streak}
              title={t('home.modes.ladder')}
              meta={ladderRecord > 0 ? t('home.modes.ladderRecord', { n: ladderRecord }) : t('home.modes.noRecord')}
              onPress={() => router.push('/ladder')}
            />
            <ModeTile
              C={C} isDark={isDark}
              icon="📚" accent={C.correct}
              title={t('home.modes.learn')}
              meta={t('home.modes.learnTopics', { count: ALL_CATEGORIES.length })}
              onPress={() => router.push('/(tabs)/learn')}
            />
            <ModeTile
              C={C} isDark={isDark}
              icon="🌍" accent={C.social}
              title={t('home.modes.world')}
              meta={t('home.modes.worldFlags', { count: COUNTRIES.length })}
              onPress={() => router.push('/(tabs)/world')}
            />
            <ModeTile
              C={C} isDark={isDark}
              icon="👥" accent={C.level}
              title={t('home.modes.friends')}
              meta={t('home.modes.friendsModes', { count: LOCAL_MODES })}
              disabled={offline}
              onPress={() => offline ? lockedTap() : router.push('/(tabs)/friends')}
            />
          </View>
        </View>

        {/* Misiones de hoy (venían de Arena) */}
        {economyOn && missions.length > 0 && (
          <View style={{ paddingHorizontal: Space.screen, marginTop: 20 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginBottom: 12 }}>
              {t('arena.todayMissions')}
            </Text>
            <View style={{ gap: 10 }}>
              {missions.map(m => {
                const done = m.progress >= m.goal;
                return (
                  <View key={m.id} style={{
                    backgroundColor: C.surface, borderRadius: 18, padding: 14, gap: 10,
                    borderWidth: 1, borderColor: C.border,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                      <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: m.claimed ? C.textFaint : C.text, fontFamily: Font.extra, fontSize: 14 }}>
                          {t(`missions.${m.id}`)}
                        </Text>
                        <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12, marginTop: 1 }}>
                          {Math.min(m.progress, m.goal)}/{m.goal}
                        </Text>
                      </View>
                      {m.claimed ? (
                        <Text style={{ color: C.correctText, fontFamily: Font.extra, fontSize: 13 }}>{t('arena.done')}</Text>
                      ) : done ? (
                        <Pressable onPress={() => handleClaimMission(m)} disabled={claimingMission === m.id} hitSlop={8}>
                          <View style={{ backgroundColor: C.correct, borderRadius: Radius.pill, paddingVertical: 8, paddingHorizontal: 16 }}>
                            <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 13 }}>{t('arena.claim')}</Text>
                          </View>
                        </Pressable>
                      ) : (
                        <Text style={{ color: C.textFaint, fontFamily: Font.bold, fontSize: 13 }}>
                          +{REWARDS.missionCoins} 🪙
                        </Text>
                      )}
                    </View>
                    <View style={{ height: 6, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
                      <View style={{
                        height: '100%',
                        width: `${Math.min(100, (m.progress / m.goal) * 100)}%`,
                        backgroundColor: done ? C.correct : C.streak,
                        borderRadius: Radius.pill,
                      }} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Cómo lo llevas — solo para usuarios logueados */}
        {!guest && (
          <View style={{ paddingHorizontal: Space.screen, marginTop: 20 }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginBottom: 10 }}>
              {t('home.statsTitle')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {[
                { label: t('home.statAnswered'), value: String(profile?.total_answered ?? 0), color: C.text },
                {
                  label: t('home.statAccuracy'),
                  value: profile?.total_answered ? `${Math.round((profile.total_correct / profile.total_answered) * 100)}%` : '—',
                  color: C.correctText,
                },
                { label: t('home.statStreak'), value: `${profile?.streak ?? 0}🔥`, color: C.streakText },
              ].map(s => (
                <View key={s.label} style={{
                  flex: 1, backgroundColor: C.surface, borderRadius: 18,
                  paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center',
                  borderWidth: 1, borderColor: C.border,
                }}>
                  <Text style={{ color: s.color, fontSize: 21, fontFamily: Font.black }}>{s.value}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
            <Pressable onPress={() => offline ? lockedTap() : router.push('/profile')}>
              <View style={{
                backgroundColor: C.surface, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ fontSize: 20 }}>🏅</Text>
                <Text style={{ flex: 1, color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
                  {t('home.achievementsUnlocked')}
                </Text>
                <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 16 }}>
                  {achievementCount}/{totalAchievements()} ›
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {economyOn && (
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: Space.screen, marginTop: 14 }}>
            <Pressable onPress={() => router.push('/shop')} style={{ flex: 1 }}>
              <View style={{
                backgroundColor: C.surface, borderRadius: 18, padding: 16, alignItems: 'center', gap: 5,
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ fontSize: 24 }}>🛒</Text>
                <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 14 }}>{t('arena.shop')}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push('/profile')} style={{ flex: 1 }}>
              <View style={{
                backgroundColor: C.surface, borderRadius: 18, padding: 16, alignItems: 'center', gap: 5,
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ fontSize: 24 }}>🏅</Text>
                <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 14 }}>{t('arena.achievements')}</Text>
              </View>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/** Celda de la rejilla 2×2: icono, título y el dato de récord. */
function ModeTile({
  C, isDark, icon, accent, title, meta, onPress, disabled,
}: {
  C: Palette;
  isDark: boolean;
  icon: string;
  accent: string;
  title: string;
  meta: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48.5%',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{
        backgroundColor: C.surface, borderRadius: Radius.card, padding: 14, gap: 8,
        borderWidth: 1, borderColor: C.border, minHeight: 116,
      }}>
        <View style={{
          width: 38, height: 38, borderRadius: Radius.iconSm,
          backgroundColor: tint(accent, isDark),
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        <Text style={{ color: C.text, fontSize: 15, fontFamily: Font.extra }}>{title}</Text>
        <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular }}>{meta}</Text>
      </View>
    </Pressable>
  );
}
