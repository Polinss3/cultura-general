import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setGuestMode } from '@/lib/guest';
import {
  fetchLeague, divisionMeta, daysUntilReset, LeagueState,
} from '@/lib/leagues';

export default function LeaguesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();

  // undefined = cargando; null = no disponible (RPC sin aplicar/offline); objeto = ok.
  const [state, setState] = useState<LeagueState | null | undefined>(undefined);

  const load = useCallback(() => {
    if (guest || offline || !user) { setState(null); return; }
    setState(undefined);
    fetchLeague().then(setState);
  }, [guest, offline, user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const goToAuth = async () => {
    await setGuestMode(false);
    router.replace('/(auth)/login');
  };

  const Header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, marginBottom: 8 }}>
      <Pressable onPress={() => router.back()} style={{ padding: 4, marginRight: 12 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
      </Pressable>
      <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>{t('leagues.title')}</Text>
    </View>
  );

  // Invitado / sin conexión: CTA de cuenta.
  if (guest || offline) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 14 }}>🏆</Text>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {t('leagues.gatedTitle')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 300 }}>
            {offline ? t('leagues.offline') : t('leagues.gatedSub')}
          </Text>
          {!offline && (
            <Pressable onPress={goToAuth} style={{ width: '100%' }}>
              <LinearGradient colors={['#e8a030', '#e83060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>{t('leagues.createAccount')}</Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (state === undefined) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#e8a030" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (state === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🏆</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_500Medium', fontSize: 15, textAlign: 'center', maxWidth: 280 }}>
            {t('leagues.unavailable')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const div = divisionMeta(state.division);
  const nextDiv = divisionMeta(state.division + 1);
  const days = daysUntilReset(state.weekStart);
  const promoteRemaining = state.promoteThreshold != null ? Math.max(0, state.promoteThreshold - state.myXp) : null;
  const promotePct = state.promoteThreshold != null && state.promoteThreshold > 0
    ? Math.min(1, state.myXp / state.promoteThreshold) : 1;
  const relegationRisk = state.relegateThreshold != null && state.myXp < state.relegateThreshold;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      {Header}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* División actual */}
        <View style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: div.color + '55', marginBottom: 14 }}>
          <LinearGradient colors={[div.color + '2e', '#141416']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, alignItems: 'center' }}>
            <Text style={{ fontSize: 52, marginBottom: 4 }}>{div.emoji}</Text>
            <Text style={{ color: div.color, fontFamily: 'Outfit_800ExtraBold', fontSize: 22 }}>
              {t(`leagues.divisions.${div.id}`)}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 12, marginTop: 2 }}>
              {t('leagues.endsIn', { count: days })}
            </Text>
          </LinearGradient>
        </View>

        {/* Mi posición + progreso de ascenso */}
        <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 11 }}>{t('leagues.yourPosition')}</Text>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 22 }}>
                {state.myRank ? `#${state.myRank}` : '—'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 11 }}>{t('leagues.xpThisWeek')}</Text>
              <Text style={{ color: '#30a8e8', fontFamily: 'Outfit_800ExtraBold', fontSize: 18 }}>{state.myXp} XP</Text>
            </View>
          </View>

          {state.promoteThreshold != null ? (
            <>
              <View style={{ height: 8, backgroundColor: '#2a2a2a', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <View style={{ height: '100%', width: `${promotePct * 100}%`, backgroundColor: nextDiv.color, borderRadius: 99 }} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Outfit_500Medium', fontSize: 13 }}>
                {promoteRemaining && promoteRemaining > 0
                  ? t('leagues.toPromote', { xp: promoteRemaining, division: t(`leagues.divisions.${nextDiv.id}`) })
                  : t('leagues.willPromote', { division: t(`leagues.divisions.${nextDiv.id}`) })}
              </Text>
            </>
          ) : (
            <Text style={{ color: div.color, fontFamily: 'Outfit_700Bold', fontSize: 14 }}>
              {t('leagues.topDivision')}
            </Text>
          )}

          {relegationRisk && (
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_600SemiBold', fontSize: 13, marginTop: 8 }}>
              {t('leagues.relegationWarning', { xp: state.relegateThreshold })}
            </Text>
          )}
        </View>

        {/* Ranking de la división */}
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          {t('leagues.leaderboard')}
        </Text>
        {state.leaderboard.length === 0 ? (
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 14, textAlign: 'center', paddingVertical: 20 }}>
            {t('leagues.empty')}
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {state.leaderboard.map(row => {
              const isMe = row.userId === user?.id;
              return (
                <View key={row.userId} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: isMe ? div.color + '1a' : '#151515',
                  borderRadius: 12, padding: 11,
                  borderWidth: 1, borderColor: isMe ? div.color + '66' : 'transparent',
                }}>
                  <Text style={{ width: 26, textAlign: 'center', color: row.rank <= 3 ? div.color : 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_800ExtraBold', fontSize: 13 }}>
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                  </Text>
                  <Text style={{ flex: 1, color: isMe ? div.color : '#fff', fontFamily: isMe ? 'Outfit_700Bold' : 'Outfit_500Medium', fontSize: 14 }}>
                    {row.username}{isMe ? t('ladder.you') : ''}
                  </Text>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>{row.xp} XP</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
