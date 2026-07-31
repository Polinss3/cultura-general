import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
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
import { formatMultiplier, REWARDS } from '@/lib/economy';
import { rankForLevel } from '@/lib/leveling';
import {
  fetchMissionState, claimMission, claimDailyChest, bumpMissions, MissionState,
} from '@/lib/gamification';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, tint } from '@/constants/theme';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ArenaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const { guest } = useGuest();
  const offline = useOffline();
  const { celebrate } = useProgress();
  const { showToast } = useToast();
  const { C, isDark } = useTheme();

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
    if (!award) { showToast({ type: 'info', message: t('arena.claimFailed') }); return; }
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
  const rank = rankForLevel(level);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Space.screen, paddingBottom: 28 }}>

        <Text style={{ color: C.text, fontSize: 28, fontFamily: Font.black, letterSpacing: -0.3, marginBottom: 16 }}>
          {t('arena.title')}
        </Text>

        {/* Progreso */}
        {economyOn ? (
          <View style={{
            backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 16, marginBottom: 14,
            borderWidth: 1, borderColor: C.border, gap: 14, ...cardShadow(isDark),
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <LevelBadge level={level} size={54} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 19 }}>
                  {t('components.levelUp.level', { level })} · {t(`ranks.${rank.id}`)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: C.textMuted, fontFamily: Font.bold, fontSize: 13 }}>
                    🔥 {t('common.days', { count: streak })}
                  </Text>
                  {mult && (
                    <View style={{ backgroundColor: C.brandTint, borderRadius: Radius.pill, paddingHorizontal: 9, paddingVertical: 2 }}>
                      <Text style={{ color: C.brandDeep, fontFamily: Font.black, fontSize: 12 }}>{mult} XP</Text>
                    </View>
                  )}
                </View>
              </View>
              <CoinPill coins={coins} onPress={() => router.push('/shop')} showPlus />
            </View>
            <XpBar xp={xp} />
          </View>
        ) : (
          <Pressable onPress={goToAuth}>
            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 16, marginBottom: 14,
              borderWidth: 1.5, borderColor: C.borderWarm, flexDirection: 'row', alignItems: 'center', gap: 12,
              ...cardShadow(isDark),
            }}>
              <Text style={{ fontSize: 26 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16 }}>
                  {offline ? t('arena.guestOffline') : t('arena.guestCreate')}
                </Text>
                <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2, lineHeight: 19 }}>
                  {offline ? t('arena.guestOfflineSub') : t('arena.guestCreateSub')}
                </Text>
              </View>
              {!offline && <Text style={{ color: C.brandDeep, fontSize: 20 }}>›</Text>}
            </View>
          </Pressable>
        )}

        {/* Cofre diario */}
        {economyOn && (
          <DailyChest available={chestAvailable} onClaim={handleChest} onClaimed={refresh} />
        )}

        {/* Ligas semanales */}
        {economyOn && (
          <Pressable onPress={() => router.push('/leagues' as any)} style={{ marginBottom: 14 }}>
            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 16,
              borderWidth: 1, borderColor: C.border,
              flexDirection: 'row', alignItems: 'center', gap: 14,
            }}>
              <View style={{
                width: 46, height: 46, borderRadius: Radius.row,
                backgroundColor: C.coinTint, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 22 }}>🏆</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, fontSize: 17, fontFamily: Font.black }}>{t('leagues.cardTitle')}</Text>
                <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, lineHeight: 19 }}>
                  {t('leagues.cardDesc')}
                </Text>
              </View>
              <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text>
            </View>
          </Pressable>
        )}

        {/* Modos en solitario */}
        <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginBottom: 12, marginTop: 4 }}>
          {t('arena.soloModes')}
        </Text>

        <ModeCard
          C={C} isDark={isDark}
          accent={C.speed}
          accentText={C.speedText}
          icon="⚡"
          tag={t('arena.speedTag')}
          title={t('arena.speedTitle')}
          desc={t('arena.speedDesc')}
          cta={t('arena.playCta')}
          onPress={() => router.push('/speed')}
        />

        <ModeCard
          C={C} isDark={isDark}
          accent={C.brand}
          accentText={C.brandDeep}
          icon="🪜"
          tag={t('arena.ladderTag')}
          title={t('arena.ladderTitle')}
          desc={t('arena.ladderDesc')}
          cta={t('arena.climbCta')}
          extra={economyOn ? t('arena.ladderRecord', { n: profile?.ladder_best ?? 0 }) : undefined}
          onPress={() => router.push('/ladder')}
        />

        {/* Misiones diarias */}
        {economyOn && missions.length > 0 && (
          <>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginBottom: 12, marginTop: 8 }}>
              {t('arena.todayMissions')}
            </Text>
            <View style={{ gap: 10, marginBottom: 6 }}>
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
                        <Pressable onPress={() => handleClaimMission(m)} disabled={busy === m.id} hitSlop={8}>
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
          </>
        )}

        {/* Accesos */}
        {economyOn && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
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

function ModeCard({
  C, isDark, accent, accentText, icon, tag, title, desc, cta, extra, onPress,
}: {
  C: Palette;
  isDark: boolean;
  accent: string;
  accentText: string;
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
      <View style={{
        backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 16, gap: 11,
        borderWidth: 1, borderColor: C.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 44, height: 44, borderRadius: 15,
            backgroundColor: tint(accent, isDark), alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 21 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: accentText, fontSize: 12, fontFamily: Font.black, letterSpacing: 1 }}>{tag}</Text>
            <Text style={{ color: C.text, fontSize: 18, fontFamily: Font.black }}>{title}</Text>
          </View>
        </View>
        <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, lineHeight: 21 }}>
          {desc}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ backgroundColor: accent, paddingVertical: 10, paddingHorizontal: 20, borderRadius: Radius.pill }}>
            <Text style={{ color: C.onBrand, fontSize: 14, fontFamily: Font.extra }}>{cta}</Text>
          </View>
          {extra && (
            <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.semi, flex: 1 }}>{extra}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
