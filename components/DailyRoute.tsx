import { useState, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';
import { checkDailyAnswered } from '@/lib/db';
import {
  fetchMissionState, claimMission, claimDailyChest, bumpMissions, MissionState,
} from '@/lib/gamification';
import {
  computeRouteState, isRouteRewardClaimed, claimRouteReward, getDailyPlayed, todayStr,
} from '@/lib/dailyRoute';
import { REWARDS } from '@/lib/economy';
import { feedback } from '@/lib/feedback';
import type { Profile } from '@/hooks/useProfile';

interface Props {
  userId: string;
  profile: Profile | null;
  refresh: () => void;
}

const ACCENT = '#e8a030';

export function DailyRoute({ userId, profile, refresh }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { celebrate } = useProgress();
  const { showToast } = useToast();

  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [played, setPlayed] = useState(false);
  const [missions, setMissions] = useState<MissionState[]>([]);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimingChest, setClaimingChest] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimingMissions, setClaimingMissions] = useState(false);
  // null = automático (colapsado si no queda nada por hacer); true/false = override manual.
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);

  const load = useCallback(() => {
    Promise.all([
      checkDailyAnswered(userId),
      fetchMissionState(userId),
      isRouteRewardClaimed(),
      getDailyPlayed(),
    ]).then(([daily, ms, claimed, didPlay]) => {
      setDailyAnswered(daily.answered);
      setMissions(ms);
      setRewardClaimed(claimed);
      setPlayed(didPlay);
      setLoading(false);
    });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      load();
    }, [refresh, load]),
  );

  const chestClaimed = !!profile && profile.last_chest_at === todayStr();
  const route = computeRouteState(dailyAnswered, chestClaimed, played);
  const missionsDone = missions.filter(m => m.progress >= m.goal).length;
  const claimableMissions = missions.filter(m => m.progress >= m.goal && !m.claimed);

  // Cuando no queda nada accionable, la tarjeta se colapsa a una barra compacta
  // (el usuario puede desplegarla). Mientras haya algo por hacer, va desplegada.
  const nothingActionable = route.complete && rewardClaimed && claimableMissions.length === 0;
  const expanded = userExpanded ?? !nothingActionable;

  const handleClaimMissions = async () => {
    if (claimingMissions || claimableMissions.length === 0) return;
    setClaimingMissions(true);
    // Reclamar en serie para agregar la celebración final.
    let lastAward = null;
    let totalCoins = 0;
    let totalXp = 0;
    for (const m of claimableMissions) {
      const award = await claimMission(m.id);
      if (award) {
        lastAward = award;
        totalCoins += award.gainedCoins;
        totalXp += award.gainedXp;
      }
    }
    setClaimingMissions(false);
    if (lastAward) {
      feedback.reward();
      // Celebración agregada: mismo estado final de nivel/saldo, ganancia sumada.
      celebrate({ ...lastAward, gainedCoins: totalCoins, gainedXp: totalXp });
    }
    refresh();
    load();
  };

  const handleClaimChest = async () => {
    if (claimingChest) return;
    setClaimingChest(true);
    const { reward, error } = await claimDailyChest();
    setClaimingChest(false);
    if (error) { showToast({ type: 'info', message: error }); return; }
    if (reward) {
      feedback.reward();
      bumpMissions('coins_earned', reward);
      celebrate({
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
        leveledUp: false,
        levelsGained: 0,
        coins: (profile?.coins ?? 0) + reward,
        gainedXp: 0,
        gainedCoins: reward,
      });
    }
    refresh();
    load();
  };

  const handleClaimReward = async () => {
    if (claimingReward) return;
    setClaimingReward(true);
    const award = await claimRouteReward();
    setClaimingReward(false);
    if (!award) { showToast({ type: 'info', message: t('home.route.rewardFailed') }); return; }
    feedback.reward();
    celebrate(award);
    setRewardClaimed(true);
    refresh();
  };

  if (loading && missions.length === 0) {
    return (
      <View style={{ marginTop: 16, backgroundColor: '#141110', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,160,48,0.2)' }}>
        <ActivityIndicator color={ACCENT} />
      </View>
    );
  }

  // Estado colapsado: ruta completada y nada por reclamar → barra compacta.
  if (!expanded) {
    // Aún puede quedar alguna misión diaria por terminar (no reclamable todavía).
    const missionsPending = missions.length > 0 && missionsDone < missions.length;
    const pendingCount = missions.length - missionsDone;
    return (
      <View style={{
        marginTop: 16, borderRadius: 16, overflow: 'hidden',
        backgroundColor: 'rgba(46,200,122,0.1)', borderWidth: 1, borderColor: 'rgba(46,200,122,0.3)',
      }}>
        {/* Ruta completada → desplegar */}
        <Pressable onPress={() => setUserExpanded(true)}>
          <View style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#2ec87a', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#000', fontFamily: 'Outfit_800ExtraBold', fontSize: 14 }}>✓</Text>
            </View>
            <Text style={{ flex: 1, color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>
              {t('home.route.completedCollapsed')}
            </Text>
            <Chevron dir="down" color="rgba(46,200,122,0.9)" />
          </View>
        </Pressable>

        {/* Misiones diarias aún pendientes → a Arena (como la fila abierta) */}
        {missionsPending && (
          <Pressable onPress={() => router.push('/(tabs)/arena')}>
            <View style={{
              borderTopWidth: 1, borderTopColor: 'rgba(46,200,122,0.15)',
              backgroundColor: 'rgba(232,160,48,0.06)',
              paddingVertical: 11, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
              <Text style={{ fontSize: 15 }}>🎯</Text>
              <Text style={{ flex: 1, color: 'rgba(255,255,255,0.75)', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>
                {t('home.route.missionsPending', { count: pendingCount })}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>›</Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={{ marginTop: 16, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)' }}>
      <LinearGradient
        colors={['#1a1204', '#120d06', '#0d0b09']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}
      >
        {/* Header (pulsable para colapsar cuando ya está todo hecho) */}
        <Pressable onPress={nothingActionable ? () => setUserExpanded(false) : undefined} disabled={!nothingActionable}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 20 }}>🗓️</Text>
              <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_800ExtraBold' }}>
                {t('home.route.title')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: route.complete ? 'rgba(46,200,122,0.15)' : 'rgba(232,160,48,0.15)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 }}>
                <Text style={{ color: route.complete ? '#2ec87a' : ACCENT, fontFamily: 'Outfit_700Bold', fontSize: 12 }}>
                  {route.coreDone}/{route.coreTotal}
                </Text>
              </View>
              {nothingActionable && (
                <Chevron dir="up" color="rgba(255,255,255,0.5)" size={18} />
              )}
            </View>
          </View>
        </Pressable>

        {/* Progress bar */}
        <View style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${(route.coreDone / route.coreTotal) * 100}%`, backgroundColor: route.complete ? '#2ec87a' : ACCENT, borderRadius: 99 }} />
        </View>

        {/* Checklist */}
        <View style={{ gap: 8 }}>
          {/* Pregunta del día */}
          <RouteRow
            icon="🏆"
            label={t('home.route.daily')}
            done={route.dailyAnswered}
            onPress={() => router.push('/(tabs)/daily')}
          />

          {/* Cofre diario */}
          <RouteRow
            icon="🎁"
            label={t('home.route.chest')}
            done={route.chestClaimed}
            action={
              !route.chestClaimed
                ? (claimingChest
                    ? <ActivityIndicator color={ACCENT} size="small" />
                    : (
                      <Pressable onPress={handleClaimChest}>
                        <View style={{ backgroundColor: ACCENT, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 14 }}>
                          <Text style={{ color: '#000', fontFamily: 'Outfit_700Bold', fontSize: 12 }}>{t('home.route.claim')}</Text>
                        </View>
                      </Pressable>
                    ))
                : undefined
            }
            onPress={route.chestClaimed ? undefined : handleClaimChest}
          />

          {/* Practica hoy (Contrarreloj o Aprender) */}
          <RouteRow
            icon="⚡"
            label={t('home.route.play')}
            done={route.played}
            onPress={() => { feedback.tap(); router.push('/speed'); }}
          />
        </View>

        {/* Misiones (capa extra) — con reclamo directo si hay recompensas */}
        {missions.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Pressable onPress={() => router.push('/(tabs)/arena')}>
              <View style={{
                backgroundColor: claimableMissions.length > 0 ? 'rgba(46,200,122,0.08)' : 'rgba(255,255,255,0.04)',
                borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
                borderWidth: claimableMissions.length > 0 ? 1 : 0, borderColor: 'rgba(46,200,122,0.3)',
              }}>
                <Text style={{ fontSize: 16 }}>🎯</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>
                      {t('home.route.missions')}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_600SemiBold', fontSize: 12 }}>
                      {missionsDone}/{missions.length}
                    </Text>
                  </View>
                  <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${(missionsDone / missions.length) * 100}%`, backgroundColor: ACCENT, borderRadius: 99 }} />
                  </View>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16 }}>›</Text>
              </View>
            </Pressable>

            {claimableMissions.length > 0 && (
              <Pressable onPress={handleClaimMissions} disabled={claimingMissions} style={{ marginTop: 8 }}>
                <View style={{ backgroundColor: '#2ec87a', borderRadius: 12, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                  {claimingMissions ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={{ color: '#000', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>
                      {t('home.route.claimMissions', { count: claimableMissions.length })}
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
          </View>
        )}

        {/* Footer: recompensa de ruta o "jugar 2 min" */}
        <View style={{ marginTop: 14 }}>
          {route.complete && !rewardClaimed ? (
            <Pressable onPress={handleClaimReward} disabled={claimingReward}>
              <LinearGradient
                colors={['#e8a030', '#e83060']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14, padding: 14, alignItems: 'center' }}
              >
                {claimingReward ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                    {t('home.route.claimReward', { coins: REWARDS.dailyRouteBonus.coins, xp: REWARDS.dailyRouteBonus.xp })}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          ) : rewardClaimed ? (
            <View style={{ borderRadius: 14, padding: 12, alignItems: 'center', backgroundColor: 'rgba(46,200,122,0.1)', borderWidth: 1, borderColor: 'rgba(46,200,122,0.3)' }}>
              <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>
                {t('home.route.rewardDone')}
              </Text>
            </View>
          ) : (
            <Pressable onPress={() => { feedback.tap(); router.push('/speed'); }}>
              <View style={{ borderRadius: 14, padding: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                  {t('home.route.play2min')}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

function Chevron({ dir, color, size = 20 }: { dir: 'up' | 'down'; color: string; size?: number }) {
  const d = dir === 'down' ? 'M5 8l5 5 5-5' : 'M5 13l5-5 5 5';
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d={d} stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RouteRow({
  icon, label, done, action, onPress,
}: {
  icon: string;
  label: string;
  done: boolean;
  action?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12,
        opacity: done ? 0.7 : 1,
      }}>
        <View style={{
          width: 34, height: 34, borderRadius: 10,
          backgroundColor: done ? 'rgba(46,200,122,0.15)' : 'rgba(232,160,48,0.12)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 17 }}>{icon}</Text>
        </View>
        <Text style={{
          flex: 1, color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 14,
          textDecorationLine: done ? 'line-through' : 'none',
        }}>
          {label}
        </Text>
        {done ? (
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#2ec87a', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#000', fontFamily: 'Outfit_800ExtraBold', fontSize: 13 }}>✓</Text>
          </View>
        ) : action ? (
          action
        ) : (
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 18 }}>›</Text>
        )}
      </View>
    </Pressable>
  );
}
