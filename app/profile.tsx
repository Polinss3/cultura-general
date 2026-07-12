import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import {
  fetchAnswerHistory, updateUsername, fetchCategoryStats,
  pauseAccount, deleteAccount,
  AnswerHistoryItem, CategoryStat,
} from '@/lib/db';
import { normalizeUsername } from '@/lib/authValidation';
import { computeAchievements } from '@/lib/achievements';
import { claimAchievement, fetchClaimedAchievements, bumpMissions } from '@/lib/gamification';
import { useProgress } from '@/context/ProgressContext';
import { LevelBadge } from '@/components/LevelBadge';
import { XpBar } from '@/components/XpBar';
import { CoinPill } from '@/components/CoinPill';
import { rankForLevel } from '@/lib/leveling';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
  getNotificationsEnabled,
} from '@/lib/notifications';
import { setAppLanguage, getLanguagePreference, LangPreference } from '@/lib/i18n';
import { rescheduleDailyReminderIfActive } from '@/lib/notifications';
import { CAT_ICONS } from '@/constants/questions';
import { masteryFor } from '@/lib/mastery';
import {
  computeTitles, findTitle, getEquippedTitle,
  setEquippedTitle as setEquippedTitleStore,
} from '@/lib/titles';
import { StreakCalendar } from '@/components/StreakCalendar';
import { UserName } from '@/components/UserName';
import { useCosmetics } from '@/hooks/useCosmetics';
import { feedback, isHapticsEnabled, setHapticsEnabled } from '@/lib/feedback';
import { Category } from '@/types';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();
  const { celebrate } = useProgress();
  const cosmetics = useCosmetics(!!user, user?.id);

  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [claiming, setClaiming] = useState<string | null>(null);

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState<AnswerHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [catStats, setCatStats] = useState<CategoryStat[]>([]);

  const [notificationsOn, setNotificationsOn] = useState(false);
  const [notifLoading, setNotifLoading] = useState(true);

  const [langPref, setLangPref] = useState<LangPreference>('auto');

  const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());

  const [equippedTitle, setEquippedTitle] = useState<string | null>(null);

  useEffect(() => {
    getNotificationsEnabled().then(enabled => {
      setNotificationsOn(enabled);
      setNotifLoading(false);
    });
    getLanguagePreference().then(setLangPref);
    getEquippedTitle().then(setEquippedTitle);
  }, []);

  // Equipar/desequipar un título (toque en uno equipado lo quita).
  const handleEquipTitle = useCallback((id: string, current: string | null) => {
    const next = current === id ? null : id;
    setEquippedTitle(next);
    setEquippedTitleStore(next);
    feedback.select();
  }, []);

  const handleHapticsToggle = useCallback((value: boolean) => {
    setHapticsOn(value);
    setHapticsEnabled(value);
    if (value) feedback.tap(); // confirmación táctil al activarlo
  }, []);

  const handleLanguageChange = useCallback(async (pref: LangPreference) => {
    setLangPref(pref);
    await setAppLanguage(pref);
    // Reprograma el recordatorio (si está activo) en el nuevo idioma.
    await rescheduleDailyReminderIfActive();
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchAnswerHistory(user.id, 15),
      fetchCategoryStats(user.id),
      fetchClaimedAchievements(user.id),
    ]).then(([h, cs, claimedSet]) => {
      setHistory(h);
      setCatStats(cs);
      setClaimed(claimedSet);
      setLoadingHistory(false);
    });
  }, [user?.id]);

  const handleClaimAchievement = useCallback(async (id: string) => {
    if (claiming) return;
    setClaiming(id);
    const award = await claimAchievement(id);
    setClaiming(null);
    if (award) {
      celebrate(award);
      setClaimed(prev => new Set(prev).add(id));
      if (award.gainedCoins) bumpMissions('coins_earned', award.gainedCoins);
      refresh();
    }
  }, [claiming, celebrate, refresh]);

  const handleNotifToggle = useCallback(async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(t('profile.dialogs.notifPermTitle'), t('profile.dialogs.notifPermBody'));
        return;
      }
      await scheduleDailyReminder();
      setNotificationsOn(true);
    } else {
      await cancelDailyReminder();
      setNotificationsOn(false);
    }
  }, []);

  const handleSaveUsername = useCallback(async () => {
    if (!user || !newUsername.trim()) return;
    setSaving(true);
    const { error } = await updateUsername(user.id, newUsername);
    setSaving(false);
    if (error) {
      Alert.alert(t('common.error'), error);
    } else {
      setEditingUsername(false);
      refresh();
    }
  }, [user, newUsername, refresh, t]);

  const handleSignOut = () => {
    Alert.alert(t('profile.dialogs.signOutTitle'), t('profile.dialogs.signOutBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.dialogs.signOutConfirm'), style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  };

  const handlePause = () => {
    Alert.alert(
      t('profile.dialogs.pauseTitle'),
      t('profile.dialogs.pauseBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.dialogs.pauseConfirm'),
          style: 'destructive',
          onPress: async () => {
            const { error } = await pauseAccount();
            if (error) Alert.alert(t('common.error'), error);
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t('profile.dialogs.deleteTitle'),
      t('profile.dialogs.deleteBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.dialogs.deleteConfirm'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('profile.dialogs.deleteConfirm2Title'),
              t('profile.dialogs.deleteConfirm2Body'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('profile.dialogs.deleteConfirm2'),
                  style: 'destructive',
                  onPress: async () => {
                    const { error } = await deleteAccount();
                    if (error) Alert.alert(t('common.error'), error);
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const achievements = computeAchievements(profile, claimed);
  const unlocked = achievements.filter(a => a.unlocked).length;
  const answered = profile?.total_answered ?? 0;
  const correct = profile?.total_correct ?? 0;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const initial = (profile?.username?.[0] ?? '?').toUpperCase();
  const level = profile?.level ?? 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>{t('profile.header')}</Text>
        </View>

        {/* Avatar + username */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={cosmetics.frameColor
            ? { borderWidth: 3, borderColor: cosmetics.frameColor, borderRadius: 28, padding: 3, marginBottom: 12 }
            : { marginBottom: 12 }}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Outfit_700Bold' }}>{initial}</Text>
            </LinearGradient>
          </View>

          {editingUsername ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TextInput
                value={newUsername}
                onChangeText={value => setNewUsername(normalizeUsername(value))}
                placeholder={profile?.username ?? ''}
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoFocus
                autoCapitalize="words"
                style={{
                  color: '#fff', fontFamily: 'Outfit_400Regular', fontSize: 16,
                  backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 12,
                  paddingVertical: 8, minWidth: 160, borderWidth: 1, borderColor: 'rgba(232,160,48,0.4)',
                }}
              />
              <Pressable onPress={handleSaveUsername} disabled={saving}>
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                  {saving ? '…' : t('common.save')}
                </Text>
              </Pressable>
              <Pressable onPress={() => setEditingUsername(false)}>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 15 }}>✕</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => { setNewUsername(profile?.username ?? ''); setEditingUsername(true); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <UserName
                name={profile?.username ?? '…'}
                cosmetics={cosmetics}
                color="#fff"
                fontFamily="Outfit_700Bold"
                fontSize={20}
              />
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>✏️</Text>
            </Pressable>
          )}

          {/* Vitrina: título equipado */}
          {(() => {
            const eq = findTitle(profile, equippedTitle);
            if (!eq) return null;
            return (
              <View style={{
                marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: eq.color + '1f', borderColor: eq.color + '66', borderWidth: 1,
                borderRadius: 99, paddingVertical: 4, paddingHorizontal: 12,
              }}>
                <Text style={{ fontSize: 13 }}>{eq.icon}</Text>
                <Text style={{ color: eq.color, fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
                  {t(`titles.items.${eq.id}`)}
                </Text>
              </View>
            );
          })()}
        </View>

        {/* Progreso (nivel / XP / monedas) */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ backgroundColor: '#151515', borderRadius: 18, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <LevelBadge level={level} size={48} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 16 }}>{t('components.levelUp.level', { level })}</Text>
                <Text style={{ color: rankForLevel(level).color, fontFamily: 'Outfit_600SemiBold', fontSize: 12 }}>
                  {t(`ranks.${rankForLevel(level).id}`)}
                </Text>
              </View>
              <CoinPill coins={profile?.coins ?? 0} onPress={() => router.push('/shop')} showPlus />
            </View>
            <XpBar xp={profile?.xp ?? 0} />
          </View>
        </View>

        {/* Títulos equipables */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionTitle>{t('titles.title')}</SectionTitle>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginBottom: 12, marginTop: -4 }}>
            {t('titles.hint')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {computeTitles(profile).map(tt => {
              const isEquipped = equippedTitle === tt.id;
              return (
                <Pressable
                  key={tt.id}
                  onPress={() => tt.unlocked && handleEquipTitle(tt.id, equippedTitle)}
                  disabled={!tt.unlocked}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    paddingVertical: 9, paddingHorizontal: 13, borderRadius: 99,
                    backgroundColor: isEquipped ? tt.color + '26' : tt.unlocked ? '#151515' : '#0f0f0f',
                    borderWidth: 1.5,
                    borderColor: isEquipped ? tt.color : tt.unlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                    opacity: tt.unlocked ? 1 : 0.45,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{tt.unlocked ? tt.icon : '🔒'}</Text>
                  <Text style={{
                    color: isEquipped ? tt.color : tt.unlocked ? '#fff' : 'rgba(255,255,255,0.4)',
                    fontFamily: isEquipped ? 'Outfit_700Bold' : 'Outfit_500Medium',
                    fontSize: 13,
                  }}>
                    {t(`titles.items.${tt.id}`)}
                  </Text>
                  {isEquipped && (
                    <Text style={{ color: tt.color, fontFamily: 'Outfit_700Bold', fontSize: 12 }}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>{t('profile.stats.title')}</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatCard label={t('profile.stats.answered')} value={String(answered)} />
            <StatCard label={t('profile.stats.correct')} value={String(correct)} />
            <StatCard label={t('profile.stats.accuracy')} value={answered > 0 ? `${accuracy}%` : '—'} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatCard label={t('profile.stats.currentStreak')} value={`${profile?.streak ?? 0}🔥`} />
            <StatCard label={t('profile.stats.bestStreak')} value={`${profile?.best_streak ?? 0}🏆`} />
            <StatCard label={t('profile.stats.speedRecord')} value={`${profile?.speed_record ?? 0}⚡`} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <StatCard label={t('profile.stats.ladderRecord')} value={t('profile.stats.floor', { n: profile?.ladder_best ?? 0 })} />
          </View>
        </View>

        {/* Racha emocional: calendario mensual + hitos */}
        {user && (
          <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
            <SectionTitle>{t('streak.title')}</SectionTitle>
            <StreakCalendar
              userId={user.id}
              streak={profile?.streak ?? 0}
              bestStreak={profile?.best_streak ?? 0}
            />
          </View>
        )}

        {/* Dominio por categorías */}
        {catStats.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
            <SectionTitle>{t('profile.categoryTitle')}</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {catStats.map(cs => {
                const cat = cs.category as Category;
                const m = masteryFor(cs.correct);
                const acc = cs.total > 0 ? Math.round((cs.correct / cs.total) * 100) : 0;
                return (
                  <View key={cs.category} style={{ width: '47%', backgroundColor: '#151515', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: m.tier.color + '2e' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Text style={{ fontSize: 18 }}>{CAT_ICONS[cat] ?? '❓'}</Text>
                      <Text numberOfLines={1} style={{ flex: 1, color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 13 }}>
                        {t(`categories.${cs.category}`, { defaultValue: cs.category })}
                      </Text>
                    </View>
                    <Text style={{ color: m.tier.color, fontFamily: 'Outfit_600SemiBold', fontSize: 11, marginBottom: 8 }}>
                      {m.tier.emoji} {t(`mastery.tiers.${m.tier.id}`)} · {t('mastery.level', { level: m.level })}
                    </Text>
                    <View style={{ height: 6, backgroundColor: '#2a2a2a', borderRadius: 99, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${m.pct * 100}%`, backgroundColor: m.tier.color, borderRadius: 99 }} />
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 6 }}>
                      {cs.correct}/{cs.total} · {acc}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>{t('profile.achievementsTitle', { unlocked, total: achievements.length })}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {achievements.map(a => {
              const claimable = a.unlocked && !a.claimed;
              return (
                <View
                  key={a.id}
                  style={{
                    width: '47%',
                    backgroundColor: a.unlocked ? '#151515' : '#0f0f0f',
                    borderRadius: 14,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: claimable ? a.color : a.unlocked ? a.color + '40' : 'rgba(255,255,255,0.05)',
                    opacity: a.unlocked ? 1 : 0.45,
                  }}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</Text>
                  <Text style={{ color: a.unlocked ? '#fff' : 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
                    {a.title}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 2 }}>
                    {a.desc}
                  </Text>
                  {claimable ? (
                    <Pressable onPress={() => handleClaimAchievement(a.id)} disabled={claiming === a.id} style={{ marginTop: 8 }}>
                      <View style={{ backgroundColor: a.color, borderRadius: 99, paddingVertical: 5, alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontFamily: 'Outfit_700Bold', fontSize: 11 }}>
                          {claiming === a.id ? '…' : t('profile.claim', { coins: a.reward })}
                        </Text>
                      </View>
                    </Pressable>
                  ) : a.claimed ? (
                    <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_600SemiBold', fontSize: 11, marginTop: 8 }}>
                      {t('profile.claimed')}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Answer history */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>{t('profile.historyTitle')}</SectionTitle>
          {loadingHistory ? (
            <ActivityIndicator color="#e8a030" />
          ) : history.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 14 }}>
              {t('profile.historyEmpty')}
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {history.map(h => {
                const cat = h.category as Category;
                return (
                  <View
                    key={h.id}
                    style={{
                      backgroundColor: '#151515',
                      borderRadius: 12,
                      padding: 12,
                      borderLeftWidth: 3,
                      borderLeftColor: h.isCorrect ? '#2ec87a' : '#e83060',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{h.isCorrect ? '✅' : '❌'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#fff', fontFamily: 'Outfit_500Medium', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                        {h.questionText}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 4 }}>
                        {CAT_ICONS[cat] ?? ''} {t(`categories.${h.category}`, { defaultValue: h.category })} · {t(`profile.modeLabels.${h.mode}`, { defaultValue: h.mode })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>{t('profile.settings.title')}</SectionTitle>
          <View style={{
            backgroundColor: '#151515', borderRadius: 14, padding: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <View>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
                {t('profile.settings.reminderTitle')}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2 }}>
                {t('profile.settings.reminderSub')}
              </Text>
            </View>
            {notifLoading ? (
              <ActivityIndicator color="#e8a030" size="small" />
            ) : (
              <Switch
                value={notificationsOn}
                onValueChange={handleNotifToggle}
                trackColor={{ false: '#2a2a2a', true: '#e8a030' }}
                thumbColor="#fff"
              />
            )}
          </View>

          {/* Vibración / feedback táctil */}
          <View style={{
            backgroundColor: '#151515', borderRadius: 14, padding: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
                {t('profile.settings.hapticsTitle')}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2 }}>
                {t('profile.settings.hapticsSub')}
              </Text>
            </View>
            <Switch
              value={hapticsOn}
              onValueChange={handleHapticsToggle}
              trackColor={{ false: '#2a2a2a', true: '#e8a030' }}
              thumbColor="#fff"
            />
          </View>

          {/* Idioma */}
          <View style={{ backgroundColor: '#151515', borderRadius: 14, padding: 16 }}>
            <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
              {t('profile.settings.language')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2, marginBottom: 12 }}>
              {t('profile.settings.languageSub')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['auto', 'es', 'en'] as LangPreference[]).map(opt => {
                const active = langPref === opt;
                const label =
                  opt === 'auto' ? t('profile.settings.languageAuto')
                  : opt === 'es' ? t('profile.settings.languageEs')
                  : t('profile.settings.languageEn');
                return (
                  <Pressable
                    key={opt}
                    onPress={() => handleLanguageChange(opt)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: active ? '#e8a030' : '#1f1f1f',
                      borderWidth: 1,
                      borderColor: active ? '#e8a030' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Text style={{
                      color: active ? '#000' : 'rgba(255,255,255,0.6)',
                      fontFamily: active ? 'Outfit_700Bold' : 'Outfit_500Medium',
                      fontSize: 14,
                    }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Zona peligrosa */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionTitle>{t('profile.dangerZone.title')}</SectionTitle>
          <Pressable
            onPress={handlePause}
            style={{ backgroundColor: '#151515', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Text style={{ fontSize: 16 }}>⏸</Text>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                {t('profile.dangerZone.pauseTitle')}
              </Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 12, lineHeight: 17 }}>
              {t('profile.dangerZone.pauseSub')}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={{ backgroundColor: '#151515', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(232,48,96,0.25)' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Text style={{ fontSize: 16 }}>🗑</Text>
              <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                {t('profile.dangerZone.deleteTitle')}
              </Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 12, lineHeight: 17 }}>
              {t('profile.dangerZone.deleteSub')}
            </Text>
          </Pressable>
        </View>

        {/* Sign out */}
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable
            onPress={handleSignOut}
            style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,48,96,0.2)', marginBottom: 16 }}
          >
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
              {t('profile.signOut')}
            </Text>
          </Pressable>

          {/* Legal links */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
            <Link href="/privacy" asChild>
              <Pressable>
                <Text style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>
                  {t('profile.privacyLink')}
                </Text>
              </Pressable>
            </Link>
            <Text style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12 }}>·</Text>
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>
              v1.0.0
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{
      color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
      letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
    }}>
      {children}
    </Text>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 12, alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold' }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}
