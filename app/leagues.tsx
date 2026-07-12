import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setGuestMode } from '@/lib/guest';
import {
  fetchLeague, divisionMeta, daysUntilReset, TOP_DIVISION, LeagueState,
} from '@/lib/leagues';
import { UserName } from '@/components/UserName';
import { resolveCosmetics } from '@/lib/cosmetics';

export default function LeaguesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();

  // undefined = cargando; null = no disponible (RPC sin aplicar/offline); objeto = ok.
  const [state, setState] = useState<LeagueState | null | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);

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
      <Text style={{ flex: 1, color: '#fff', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>{t('leagues.title')}</Text>
      <Pressable onPress={() => setShowInfo(true)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 }}>?</Text>
      </Pressable>
    </View>
  );

  // ── Invitado / sin conexión
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

  const canPromote = state.division < TOP_DIVISION;
  const canRelegate = state.division > 0;
  // Solo marcamos zona de descenso si el grupo es lo bastante grande para que
  // ascenso y descenso no se solapen (con escasez, solo se ve el ascenso).
  const showRelegation = canRelegate && state.memberCount > state.promoteZone + state.relegateZone;

  const inPromo = canPromote && state.myRank != null && state.myRank <= state.promoteZone;
  const inRelegation = showRelegation && state.myRank != null && state.myRank > state.memberCount - state.relegateZone;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      {Header}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Resultado de la semana pasada */}
        {state.lastResult && (
          <View style={{
            borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
            backgroundColor: state.lastResult === 'promoted' ? 'rgba(46,200,122,0.1)' : state.lastResult === 'relegated' ? 'rgba(232,48,96,0.1)' : 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: state.lastResult === 'promoted' ? 'rgba(46,200,122,0.35)' : state.lastResult === 'relegated' ? 'rgba(232,48,96,0.35)' : 'rgba(255,255,255,0.1)',
          }}>
            <Text style={{ fontSize: 24 }}>{state.lastResult === 'promoted' ? '⬆️' : state.lastResult === 'relegated' ? '⬇️' : '🎁'}</Text>
            <Text style={{ flex: 1, color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 13, lineHeight: 19 }}>
              {t(`leagues.result.${state.lastResult}`, { coins: state.lastReward })}
            </Text>
          </View>
        )}

        {/* División actual */}
        <View style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: div.color + '55', marginBottom: 14 }}>
          <LinearGradient colors={[div.color + '2e', '#141416']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, alignItems: 'center' }}>
            <Text style={{ fontSize: 52, marginBottom: 4 }}>{div.emoji}</Text>
            <Text style={{ color: div.color, fontFamily: 'Outfit_800ExtraBold', fontSize: 22 }}>
              {t(`leagues.divisions.${div.id}`)}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_500Medium', fontSize: 12, marginTop: 2 }}>
              {t('leagues.endsIn', { count: days })} · {t('leagues.members', { count: state.memberCount })}
            </Text>
          </LinearGradient>
        </View>

        {/* Mi posición */}
        <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
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
          {inPromo ? (
            <Text style={{ color: '#2ec87a', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
              ⬆️ {t('leagues.inPromo', { division: t(`leagues.divisions.${nextDiv.id}`) })}
            </Text>
          ) : inRelegation ? (
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
              ⬇️ {t('leagues.inRelegation')}
            </Text>
          ) : canPromote ? (
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_500Medium', fontSize: 13 }}>
              {t('leagues.safeHint', { n: state.promoteZone })}
            </Text>
          ) : (
            <Text style={{ color: div.color, fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
              {t('leagues.topDivisionShort')}
            </Text>
          )}
        </View>

        {/* Clasificación */}
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
              const rowPromo = canPromote && row.rank <= state.promoteZone;
              const rowReleg = showRelegation && row.rank > state.memberCount - state.relegateZone;
              const accent = rowPromo ? '#2ec87a' : rowReleg ? '#e83060' : null;
              const cos = resolveCosmetics(row.cosmetics);
              return (
                <View key={row.userId} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  backgroundColor: isMe ? div.color + '1a' : '#151515',
                  borderRadius: 12, padding: 11,
                  borderWidth: 1, borderColor: isMe ? div.color + '66' : 'transparent',
                  borderLeftWidth: accent ? 3 : 1,
                  borderLeftColor: accent ?? (isMe ? div.color + '66' : 'transparent'),
                }}>
                  <Text style={{ width: 24, textAlign: 'center', color: row.rank <= 3 ? div.color : 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_800ExtraBold', fontSize: 13 }}>
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <UserName
                      name={row.username}
                      cosmetics={cos}
                      suffix={isMe ? t('ladder.you') : ''}
                      color={isMe ? div.color : '#fff'}
                      fontFamily={isMe ? 'Outfit_700Bold' : 'Outfit_500Medium'}
                    />
                  </View>
                  {rowPromo && <Text style={{ fontSize: 11 }}>⬆️</Text>}
                  {rowReleg && <Text style={{ fontSize: 11 }}>⬇️</Text>}
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 14 }}>{row.xp} XP</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Sheet: cómo funcionan las ligas */}
      <Modal visible={showInfo} transparent animationType="slide" onRequestClose={() => setShowInfo(false)}>
        <Pressable onPress={() => setShowInfo(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: '#141416', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 18 }} />
            <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 20, marginBottom: 16 }}>
              {t('leagues.how.title')}
            </Text>

            {/* Divisiones */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
              {[0, 1, 2, 3].map(d => {
                const m = divisionMeta(d);
                return (
                  <View key={d} style={{ alignItems: 'center', gap: 3 }}>
                    <Text style={{ fontSize: 26 }}>{m.emoji}</Text>
                    <Text style={{ color: m.color, fontFamily: 'Outfit_600SemiBold', fontSize: 10 }}>{t(`leagues.divisions.${m.id}`)}</Text>
                  </View>
                );
              })}
            </View>

            {[
              { icon: '🎮', text: t('leagues.how.compete') },
              { icon: '⬆️', text: t('leagues.how.promote', { n: state.promoteZone }) },
              { icon: '⬇️', text: t('leagues.how.relegate', { n: state.relegateZone }) },
              { icon: '🪙', text: t('leagues.how.rewards') },
              { icon: '🏅', text: t('leagues.how.badge') },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit_400Regular', fontSize: 14, lineHeight: 21 }}>
                  {item.text}
                </Text>
              </View>
            ))}

            <Pressable onPress={() => setShowInfo(false)} style={{ marginTop: 12 }}>
              <LinearGradient colors={['#e8a030', '#e83060']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>{t('leagues.how.close')}</Text>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
