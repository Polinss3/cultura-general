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
import { unlockedCount } from '@/lib/achievements';
import { grantWelcomeRewardIfPending } from '@/lib/onboarding';
import { fetchDailyPlayerCount, dailyPlayersFallback } from '@/lib/db';
import { setGuestMode, getGuestSpeedRecord } from '@/lib/guest';
import { LevelBadge } from '@/components/LevelBadge';
import { XpBar } from '@/components/XpBar';
import { CoinPill } from '@/components/CoinPill';
import { DailyRoute } from '@/components/DailyRoute';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { LeagueBadge } from '@/components/LeagueBadge';
import { rankForLevel } from '@/lib/leveling';
import { getLocaleTag } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, refresh } = useProfile();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { showToast } = useToast();
  const { celebrate } = useProgress();
  const [guestSpeedRecord, setGuestSpeedRecordState] = useState(0);
  // "Jugadores hoy": arranca con un valor de respaldo creíble (10–25, estable
  // por día) y se sustituye por el número real si supera las 20 personas.
  const [playersToday, setPlayersToday] = useState(dailyPlayersFallback);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Outfit_500Medium', textTransform: 'capitalize' }}>
                {today}
              </Text>
              <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_700Bold', marginTop: 2 }}>
                {t('home.greeting', { name: displayName })}
              </Text>
              {!guest && profile && (
                <Pressable onPress={() => offline ? lockedTap() : router.push('/leagues' as any)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                  <LeagueBadge division={profile.league_division ?? 0} variant="chip" />
                </Pressable>
              )}
            </View>
            <Pressable onPress={() => guest ? goToAuth() : offline ? lockedTap() : router.push('/profile')}>
              {guest ? (
                <View style={{
                  width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>?</Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['#e8a030', '#e83060']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{initial}</Text>
                </LinearGradient>
              )}
            </Pressable>
          </View>

          {/* Streak / Guest CTA */}
          {guest ? (
            <Pressable onPress={goToAuth}>
              <View style={{
                marginTop: 16, backgroundColor: '#151515', borderRadius: 16,
                padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
                borderWidth: 1, borderColor: 'rgba(232,160,48,0.25)',
              }}>
                <Text style={{ fontSize: 26 }}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Outfit_700Bold' }}>
                    {t('home.guestCtaTitle')}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>
                    {t('home.guestCtaSub')}
                  </Text>
                </View>
                <Text style={{ color: '#e8a030', fontSize: 18 }}>→</Text>
              </View>
            </Pressable>
          ) : user ? (
            <StreakHeatmap userId={user.id} streak={profile?.streak ?? 0} />
          ) : (
            <View style={{
              marginTop: 16, backgroundColor: '#151515', borderRadius: 16,
              padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
            }}>
              <Text style={{ fontSize: 26 }}>🔥</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>
                  {t('home.streakDays', { count: profile?.streak ?? 0 })}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 1 }}>
                  {(profile?.streak ?? 0) > 0 ? t('home.streakKeep') : t('home.streakStart')}
                </Text>
              </View>
              <Text style={{ color: '#e8a030', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>
                {profile?.streak ?? 0}
              </Text>
            </View>
          )}

          {/* Progreso (nivel + XP + monedas) → Arena */}
          {!guest && (
            <Pressable onPress={() => offline ? lockedTap() : router.push('/(tabs)/arena')} style={{ marginTop: 10 }}>
              <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: rankForLevel(profile?.level ?? 1).color + '4d' }}>
                <LinearGradient
                  colors={[rankForLevel(profile?.level ?? 1).color + '2e', rankForLevel(profile?.level ?? 1).color2 + '12', '#141416']}
                  locations={[0, 0.55, 1]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <LevelBadge level={profile?.level ?? 1} size={44} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 }}>
                        {t('components.levelUp.level', { level: profile?.level ?? 1 })}
                      </Text>
                      <CoinPill coins={profile?.coins ?? 0} small />
                    </View>
                    <XpBar xp={profile?.xp ?? 0} showLabel={false} height={7} />
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          )}
        </View>

        {/* Hub "Hoy": ruta diaria (solo logueado y online) */}
        {!guest && !offline && user && (
          <View style={{ paddingHorizontal: 20 }}>
            <DailyRoute userId={user.id} profile={profile} refresh={refresh} />
          </View>
        )}

        {/* Game modes */}
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <Text style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
          }}>
            {t('home.gameModes')}
          </Text>

          {/* Daily */}
          <Pressable onPress={() => offline ? lockedTap() : router.push('/(tabs)/daily')} style={{ marginBottom: 12, opacity: offline ? 0.45 : 1 }}>
            <LinearGradient
              colors={['#1a1000', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>🏆</Text>
                </View>
                <View>
                  <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('home.dailyTag')}</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('home.dailyTitle')}</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                {t('home.dailyDesc')}
              </Text>
              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: '#e8a030', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99 }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{t('home.dailyCta')}</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
                  {offline ? t('home.offline') : t('home.playersToday', { count: playersToday })}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Speed */}
          <Pressable onPress={() => router.push('/speed')} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#0a001a', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(160,48,232,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(160,48,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>⚡</Text>
                </View>
                <View>
                  <Text style={{ color: '#a030e8', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('home.speedTag')}</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('home.speedTitle')}</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                {t('home.speedDesc')}
              </Text>
              <View style={{ marginTop: 14 }}>
                <View style={{ backgroundColor: '#a030e8', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>
                    {t('home.speedRecord', { record: speedRecord })}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Ascenso */}
          <Pressable onPress={() => router.push('/ladder')} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#1a1000', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>🪜</Text>
                </View>
                <View>
                  <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('home.ladderTag')}</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('home.ladderTitle')}</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                {t('home.ladderDesc')}
              </Text>
              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ backgroundColor: '#e8a030', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99 }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{t('home.ladderCta')}</Text>
                </View>
                {!guest && (
                  <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
                    {t('home.ladderRecord', { n: profile?.ladder_best ?? 0 })}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </Pressable>

          {/* Learn */}
          <Pressable onPress={() => router.push('/(tabs)/learn')} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#001a0a', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(46,200,122,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(46,200,122,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>📚</Text>
                </View>
                <View>
                  <Text style={{ color: '#2ec87a', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('home.learnTag')}</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('home.learnTitle')}</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                {t('home.learnDesc')}
              </Text>
              <View style={{ marginTop: 14 }}>
                <View style={{ backgroundColor: '#2ec87a', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{t('home.learnCta')}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Friends */}
          <Pressable onPress={() => offline ? lockedTap() : router.push('/(tabs)/friends')} style={{ opacity: offline ? 0.45 : 1 }}>
            <LinearGradient
              colors={['#001220', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(48,168,232,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(48,168,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>👥</Text>
                </View>
                <View>
                  <Text style={{ color: '#30a8e8', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{t('home.friendsTag')}</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{t('home.friendsTitle')}</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                {t('home.friendsDesc')}
              </Text>
              <View style={{ marginTop: 14 }}>
                <View style={{ backgroundColor: '#30a8e8', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{t('home.friendsCta')}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Stats — solo para usuarios logueados */}
        {!guest && (
          <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
            <Text style={{
              color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
              letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
            }}>
              {t('home.statsTitle')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {[
                { label: t('home.statAnswered'), value: String(profile?.total_answered ?? 0) },
                { label: t('home.statAccuracy'), value: profile?.total_answered ? `${Math.round((profile.total_correct / profile.total_answered) * 100)}%` : '—' },
                { label: t('home.statStreak'), value: `${profile?.streak ?? 0}🔥` },
              ].map(s => (
                <View key={s.label} style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold' }}>{s.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
            <Pressable onPress={() => offline ? lockedTap() : router.push('/profile')}>
              <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>🏅</Text>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 14 }}>
                    {t('home.achievementsUnlocked')}
                  </Text>
                </View>
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 16 }}>
                  {achievementCount}/12 →
                </Text>
              </View>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
