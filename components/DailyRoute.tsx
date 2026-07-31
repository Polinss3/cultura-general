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
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Type, cardShadow, highlightGradient } from '@/constants/theme';

interface Props {
  userId: string;
  profile: Profile | null;
  refresh: () => void;
}

export function DailyRoute({ userId, profile, refresh }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { celebrate } = useProgress();
  const { showToast } = useToast();
  const { C, isDark } = useTheme();

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
      <View style={{
        marginTop: 14, backgroundColor: C.surface, borderRadius: Radius.cardLg,
        padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.borderWarm,
      }}>
        <ActivityIndicator color={C.brand} />
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
        marginTop: 14, borderRadius: Radius.row, overflow: 'hidden',
        backgroundColor: C.correctTint, borderWidth: 1, borderColor: C.correct,
      }}>
        {/* Ruta completada → desplegar */}
        <Pressable onPress={() => setUserExpanded(true)}>
          <View style={{ paddingVertical: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.correct, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: C.onBrand, fontFamily: Font.black, fontSize: 14 }}>✓</Text>
            </View>
            <Text style={{ flex: 1, color: C.correctText, fontFamily: Font.extra, fontSize: 15 }}>
              {t('home.route.completedCollapsed')}
            </Text>
            <Chevron dir="down" color={C.correctText} />
          </View>
        </Pressable>

        {/* Misiones diarias aún pendientes: informativo, viven más abajo en Inicio */}
        {missionsPending && (
          <View>
            <View style={{
              borderTopWidth: 1, borderTopColor: C.border,
              backgroundColor: C.surface,
              paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
              <Text style={{ flex: 1, color: C.textBody, fontFamily: Font.semi, fontSize: 14 }}>
                {t('home.route.missionsPending', { count: pendingCount })}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{
      marginTop: 14, borderRadius: 24, overflow: 'hidden',
      borderWidth: 1.5, borderColor: C.borderWarm,
      ...cardShadow(isDark),
    }}>
      <LinearGradient
        colors={highlightGradient(isDark)}
        locations={[0, 0.55]}
        start={{ x: 0, y: 0 }} end={{ x: 0.4, y: 1 }}
        style={{ paddingVertical: 18, paddingHorizontal: 16 }}
      >
        {/* Header (pulsable para colapsar cuando ya está todo hecho) */}
        <Pressable onPress={nothingActionable ? () => setUserExpanded(false) : undefined} disabled={!nothingActionable}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Text style={{ fontSize: 20 }}>🗓️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, ...Type.cardTitleLg }}>
                {t('home.route.title')}
              </Text>
              <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, marginTop: 1 }}>
                {t('home.route.subtitle')}
              </Text>
            </View>
            <View style={{
              backgroundColor: route.complete ? C.correctTint : C.brandTint,
              borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 5,
            }}>
              <Text style={{ color: route.complete ? C.correctText : C.brandDeep, fontFamily: Font.black, fontSize: 13 }}>
                {route.coreDone}/{route.coreTotal}
              </Text>
            </View>
            {nothingActionable && <Chevron dir="up" color={C.textFaint} size={18} />}
          </View>
        </Pressable>

        {/* Progress bar */}
        <View style={{ height: 8, backgroundColor: C.track, borderRadius: Radius.pill, marginBottom: 14, overflow: 'hidden' }}>
          <View style={{
            height: '100%',
            width: `${(route.coreDone / route.coreTotal) * 100}%`,
            backgroundColor: route.complete ? C.correct : C.brand,
            borderRadius: Radius.pill,
          }} />
        </View>

        {/* Checklist */}
        <View style={{ gap: 9 }}>
          {/* Pregunta del día */}
          <RouteRow
            C={C}
            icon="🏆"
            label={t('home.route.daily')}
            done={route.dailyAnswered}
            onPress={() => router.push('/(tabs)/daily')}
          />

          {/* Cofre diario */}
          <RouteRow
            C={C}
            icon="🎁"
            label={t('home.route.chest')}
            done={route.chestClaimed}
            action={
              !route.chestClaimed
                ? (claimingChest
                    ? <ActivityIndicator color={C.brand} size="small" />
                    : (
                      <Pressable onPress={handleClaimChest} hitSlop={8}>
                        <View style={{ backgroundColor: C.brand, borderRadius: Radius.pill, paddingVertical: 8, paddingHorizontal: 16 }}>
                          <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 13 }}>{t('home.route.claim')}</Text>
                        </View>
                      </Pressable>
                    ))
                : undefined
            }
            onPress={route.chestClaimed ? undefined : handleClaimChest}
          />

          {/* Practica hoy (Contrarreloj o Aprender) */}
          <RouteRow
            C={C}
            icon="⚡"
            label={t('home.route.play')}
            done={route.played}
            onPress={() => { feedback.tap(); router.push('/speed'); }}
          />
        </View>

        {/* Misiones (capa extra) — con reclamo directo si hay recompensas */}
        {missions.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <View>
              <View style={{
                backgroundColor: C.surface,
                borderRadius: Radius.row, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11,
                borderWidth: 1, borderColor: claimableMissions.length > 0 ? C.correct : C.border,
              }}>
                <Text style={{ fontSize: 17 }}>🎯</Text>
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: C.textBody, fontFamily: Font.bold, fontSize: 14 }}>
                      {t('home.route.missions')}
                    </Text>
                    <Text style={{ color: C.textFaint, fontFamily: Font.extra, fontSize: 13 }}>
                      {missionsDone}/{missions.length}
                    </Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: C.track, borderRadius: Radius.pill, overflow: 'hidden' }}>
                    <View style={{
                      height: '100%',
                      width: `${(missionsDone / missions.length) * 100}%`,
                      backgroundColor: C.streak,
                      borderRadius: Radius.pill,
                    }} />
                  </View>
                </View>
              </View>
            </View>

            {claimableMissions.length > 0 && (
              <Pressable onPress={handleClaimMissions} disabled={claimingMissions} style={{ marginTop: 9 }}>
                <View style={{
                  backgroundColor: C.correct, borderRadius: Radius.row, padding: 14,
                  alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
                }}>
                  {claimingMissions ? (
                    <ActivityIndicator color={C.onBrand} size="small" />
                  ) : (
                    <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>
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
              <View style={{ backgroundColor: C.brand, borderRadius: 18, padding: 15, alignItems: 'center' }}>
                {claimingReward ? (
                  <ActivityIndicator color={C.onBrand} />
                ) : (
                  <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 16 }}>
                    {t('home.route.claimReward', { coins: REWARDS.dailyRouteBonus.coins, xp: REWARDS.dailyRouteBonus.xp })}
                  </Text>
                )}
              </View>
            </Pressable>
          ) : rewardClaimed ? (
            <View style={{
              borderRadius: 18, padding: 14, alignItems: 'center',
              backgroundColor: C.correctTint, borderWidth: 1, borderColor: C.correct,
            }}>
              <Text style={{ color: C.correctText, fontFamily: Font.extra, fontSize: 15 }}>
                {t('home.route.rewardDone')}
              </Text>
            </View>
          ) : (
            <Pressable onPress={() => { feedback.tap(); router.push('/speed'); }}>
              <View style={{
                borderRadius: 18, padding: 15, alignItems: 'center',
                backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderStrong,
              }}>
                <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16 }}>
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
  C, icon, label, done, action, onPress,
}: {
  C: Palette;
  icon: string;
  label: string;
  done: boolean;
  action?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 62,
        backgroundColor: C.surface, borderRadius: Radius.row, padding: 12,
        borderWidth: 1, borderColor: C.border,
      }}>
        <View style={{
          width: 38, height: 38, borderRadius: Radius.iconSm,
          backgroundColor: done ? C.correctTint : C.brandTint,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 17 }}>{icon}</Text>
        </View>
        <Text style={{
          flex: 1, color: done ? C.textFaint : C.text, fontFamily: Font.bold, fontSize: 15,
          textDecorationLine: done ? 'line-through' : 'none',
        }}>
          {label}
        </Text>
        {done ? (
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.correct, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: C.onBrand, fontFamily: Font.black, fontSize: 14 }}>✓</Text>
          </View>
        ) : action ? (
          action
        ) : (
          <Text style={{ color: C.textFaint, fontSize: 18 }}>›</Text>
        )}
      </View>
    </Pressable>
  );
}
