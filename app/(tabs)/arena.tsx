import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';
import { setGuestMode } from '@/lib/guest';
import { LevelBadge } from '@/components/LevelBadge';
import { XpBar } from '@/components/XpBar';
import { CoinPill } from '@/components/CoinPill';
import { DailyChest } from '@/components/DailyChest';
import { formatMultiplier } from '@/lib/economy';
import { rankForLevel } from '@/lib/leveling';
import {
  fetchMissionState, claimMission, claimDailyChest, bumpMissions, MissionState,
} from '@/lib/gamification';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ArenaScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const { showToast } = useToast();

  const [missions, setMissions] = useState<MissionState[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const economyOn = !!user && !guest && !offline;
  const chestAvailable = economyOn && !!profile && profile.last_chest_at !== todayStr();

  const loadMissions = useCallback(() => {
    if (!economyOn || !user) return;
    fetchMissionState(user.id).then(setMissions);
  }, [economyOn, user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (economyOn) refresh();
      loadMissions();
    }, [economyOn, loadMissions, refresh]),
  );

  const handleChest = async (): Promise<number | null> => {
    const { reward, error } = await claimDailyChest();
    if (error) { showToast({ type: 'info', message: error }); return null; }
    if (reward) bumpMissions('coins_earned', reward);
    return reward ?? 0;
  };

  const handleClaimMission = async (m: MissionState) => {
    if (busy) return;
    setBusy(m.id);
    const award = await claimMission(m.id);
    setBusy(null);
    if (!award) { showToast({ type: 'info', message: 'No se pudo reclamar.' }); return; }
    celebrate(award);
    refresh();
    loadMissions();
  };

  const goToAuth = async () => {
    await setGuestMode(false);
    router.replace('/(auth)/login');
  };

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const coins = profile?.coins ?? 0;
  const streak = profile?.streak ?? 0;
  const mult = formatMultiplier(streak);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>

        <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 16 }}>
          Arena
        </Text>

        {/* Progreso */}
        {economyOn ? (
          <View style={{ borderRadius: 20, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: rankForLevel(level).color + '55' }}>
            <LinearGradient
              colors={[rankForLevel(level).color + '30', rankForLevel(level).color2 + '14', '#141416']}
              locations={[0, 0.55, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <LevelBadge level={level} size={52} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 18 }}>Nivel {level}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Outfit_500Medium', fontSize: 12 }}>
                      🔥 {streak} días
                    </Text>
                    {mult && (
                      <View style={{ backgroundColor: 'rgba(232,160,48,0.2)', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 1 }}>
                        <Text style={{ color: '#e8a030', fontFamily: 'Outfit_800ExtraBold', fontSize: 11 }}>{mult} XP</Text>
                      </View>
                    )}
                  </View>
                </View>
                <CoinPill coins={coins} onPress={() => router.push('/shop')} showPlus />
              </View>
              <XpBar xp={xp} />
            </LinearGradient>
          </View>
        ) : (
          <Pressable onPress={goToAuth}>
            <View style={{ backgroundColor: '#151515', borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(232,160,48,0.25)', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 26 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>
                  {offline ? 'Progreso sin conexión' : 'Crea cuenta gratis'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2 }}>
                  {offline
                    ? 'Niveles, monedas y misiones vuelven al recuperar la conexión.'
                    : 'Sube de nivel, gana monedas y completa misiones.'}
                </Text>
              </View>
              {!offline && <Text style={{ color: '#e8a030', fontSize: 18 }}>→</Text>}
            </View>
          </Pressable>
        )}

        {/* Cofre diario */}
        {economyOn && (
          <DailyChest available={chestAvailable} onClaim={handleChest} onClaimed={refresh} />
        )}

        {/* Modos en solitario */}
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 }}>
          Modos en solitario
        </Text>

        <ModeCard
          colors={['#0a001a', '#0a0a0a']}
          border="rgba(160,48,232,0.3)"
          accent="#a030e8"
          icon="⚡"
          tag="CONTRARRELOJ"
          title="30 Segundos"
          desc="Responde a contrarreloj. Cada acierto suma puntos y monedas."
          cta="Jugar →"
          onPress={() => router.push('/speed')}
        />

        <ModeCard
          colors={['#1a1000', '#0a0a0a']}
          border="rgba(232,160,48,0.3)"
          accent="#e8a030"
          icon="🪜"
          tag="ASCENSO"
          title="Modo Ascenso"
          desc="Sube pisos de dificultad creciente. Arriesga el bote o retírate a tiempo."
          cta="Escalar →"
          extra={economyOn ? `Récord: piso ${profile?.ladder_best ?? 0}` : undefined}
          onPress={() => router.push('/ladder')}
        />

        {/* Misiones diarias */}
        {economyOn && missions.length > 0 && (
          <>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 10 }}>
              Misiones de hoy
            </Text>
            <View style={{ gap: 10, marginBottom: 6 }}>
              {missions.map(m => {
                const done = m.progress >= m.goal;
                return (
                  <View key={m.id} style={{ backgroundColor: '#151515', borderRadius: 14, padding: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>{m.title}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 1 }}>
                          {Math.min(m.progress, m.goal)}/{m.goal}
                        </Text>
                      </View>
                      {m.claimed ? (
                        <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>✓ Hecho</Text>
                      ) : done ? (
                        <Pressable onPress={() => handleClaimMission(m)} disabled={busy === m.id}>
                          <View style={{ backgroundColor: '#2ec87a', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 14 }}>
                            <Text style={{ color: '#000', fontFamily: 'Outfit_700Bold', fontSize: 12 }}>Reclamar</Text>
                          </View>
                        </Pressable>
                      ) : (
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>
                          +{15} 🪙
                        </Text>
                      )}
                    </View>
                    <View style={{ height: 4, backgroundColor: '#1f1f1f', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${Math.min(100, (m.progress / m.goal) * 100)}%`, backgroundColor: done ? '#2ec87a' : '#e8a030', borderRadius: 99 }} />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Accesos */}
        {economyOn && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Pressable onPress={() => router.push('/shop')} style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 16, alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 22 }}>🛒</Text>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>Tienda</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => router.push('/profile')} style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 16, alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 22 }}>🏅</Text>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>Logros</Text>
              </View>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function ModeCard({
  colors, border, accent, icon, tag, title, desc, cta, extra, onPress,
}: {
  colors: [string, string];
  border: string;
  accent: string;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  extra?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: border }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: accent + '26', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
          <View>
            <Text style={{ color: accent, fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>{tag}</Text>
            <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>{title}</Text>
          </View>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
          {desc}
        </Text>
        <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ backgroundColor: accent, paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99 }}>
            <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>{cta}</Text>
          </View>
          {extra && (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>{extra}</Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
