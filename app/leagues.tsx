import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setGuestMode } from '@/lib/guest';
import {
  fetchLeague, fetchLeagueGroup, divisionMeta, daysUntilReset, leaguePlacementReward, leagueGroupName, TOP_DIVISION, LeagueState,
} from '@/lib/leagues';
import { UserName } from '@/components/UserName';
import { resolveCosmetics } from '@/lib/cosmetics';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Type, glow, tint } from '@/constants/theme';

/** A qué escalón de premio corresponde un puesto. */
function rankBucket(rank: number): number {
  if (rank <= 3) return rank;
  return rank <= 10 ? 10 : 11;
}

/** Una de las tres cifras de la fila "tu posición". */
function MiniStat({ C, label, value, color }: {
  C: Palette; label: string; value: string; color: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 4, gap: 2 }}>
      <Text numberOfLines={1} style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 11 }}>
        {label}
      </Text>
      <Text numberOfLines={1} style={{ color, fontFamily: Font.black, fontSize: 18 }}>
        {value}
      </Text>
    </View>
  );
}

export default function LeaguesScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();

  // undefined = cargando; null = no disponible (RPC sin aplicar/offline); objeto = ok.
  const [ownLeague, setOwnLeague] = useState<LeagueState | null | undefined>(undefined);
  const [viewed, setViewed] = useState<LeagueState | null>(null);
  const { group } = useLocalSearchParams<{ group?: string }>();
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const loadId = useRef(0);
  const [browseRevision, setBrowseRevision] = useState(0);
  const state = viewed ?? ownLeague;
  const viewingOwn = !viewed;
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    const request = ++loadId.current;
    if (guest || offline || !user) { setOwnLeague(null); setViewed(null); return; }
    fetchLeague().then(next => {
      if (request !== loadId.current) return;
      setOwnLeague(previous => next ?? previous ?? null);
      setLoadError(!next);
    }).catch(() => {
      if (request !== loadId.current) return;
      setOwnLeague(previous => previous ?? null);
      setLoadError(true);
    });
  }, [guest, offline, user?.id]);

  useFocusEffect(useCallback(() => {
    load();
    return () => { loadId.current += 1; };
  }, [load]));

  // Las recargas conservan la clasificación anterior si falla la red.
  const onRefresh = useCallback(async () => {
    if (guest || offline || !user) return;
    setRefreshing(true);
    const request = ++loadId.current;
    try {
      const next = await fetchLeague();
      if (request === loadId.current) {
        if (next) setOwnLeague(next);
        setLoadError(!next);
      }
    } catch {
      if (request === loadId.current) setLoadError(true);
    } finally {
      setRefreshing(false);
    }
  }, [guest, offline, user?.id]);

  useEffect(() => {
    if (!ownLeague || guest || offline || !user) return;
    if (!group || group === ownLeague.groupId) {
      setViewed(null);
      setBrowseLoading(false);
      setBrowseError(false);
      return;
    }
    let cancelled = false;
    setBrowseLoading(true);
    setBrowseError(false);
    fetchLeagueGroup(group).then(next => {
      if (!cancelled) setViewed(next);
    }).catch(() => {
      if (!cancelled) setBrowseError(true);
    }).finally(() => {
      if (!cancelled) setBrowseLoading(false);
    });
    return () => { cancelled = true; };
  }, [group, ownLeague, guest, offline, user?.id, browseRevision]);

  const goToAuth = async () => {
    await setGuestMode(false);
    router.replace('/(auth)/login');
  };

  const Header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, marginBottom: 8 }}>
      <Pressable onPress={() => router.back()} style={{ padding: 4, marginRight: 12 }}>
        <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
      </Pressable>
      <Text style={{ flex: 1, color: C.text, fontSize: 20, fontFamily: Font.black }}>{t('leagues.title')}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t('leagues.how.title')} onPress={() => router.push({ pathname: '/league-info', params: { size: state?.groupSize ?? 30, promote: state?.promoteZone ?? 7, relegate: state?.relegateZone ?? 5 } })} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border }}>
        <Text style={{ color: C.textBody, fontFamily: Font.black, fontSize: 15 }}>?</Text>
      </Pressable>
    </View>
  );

  // ── Invitado / sin conexión
  if (guest || offline) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 14 }}>🏆</Text>
          <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {t('leagues.gatedTitle')}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 300 }}>
            {offline ? t('leagues.offline') : t('leagues.gatedSub')}
          </Text>
          {!offline && (
            <Pressable onPress={goToAuth} style={{ width: '100%' }}>
              <LinearGradient colors={[C.brand, C.brand]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>{t('leagues.createAccount')}</Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (state === undefined) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (state === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🏆</Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 15, textAlign: 'center', maxWidth: 280 }}>
            {t('leagues.unavailable')}
          </Text>
          <Pressable accessibilityRole="button" onPress={load} style={{ minHeight: 44, padding: 12 }}>
            <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.retry')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const div = divisionMeta(state.division);
  const nextDiv = divisionMeta(state.division + 1);
  const days = daysUntilReset(state.weekStart);
  const groupName = leagueGroupName(state);

  const canPromote = state.division < TOP_DIVISION;
  const canRelegate = state.division > 0;
  // Solo marcamos zona de descenso si el grupo es lo bastante grande para que
  // ascenso y descenso no se solapen (con escasez, solo se ve el ascenso).
  const showRelegation = canRelegate && state.memberCount > state.promoteZone + state.relegateZone;

  const inPromo = canPromote && state.myRank != null && state.myRank <= state.promoteZone;
  const inRelegation = showRelegation && state.myRank != null && state.myRank > state.memberCount - state.relegateZone;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {Header}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.textMuted} colors={[C.brand]} />
        }
      >

        {browseLoading && <ActivityIndicator color={C.brand} style={{ marginBottom: 12 }} />}
        {(browseError || loadError) && (
          <View style={{ backgroundColor: C.surface, borderRadius: Radius.row, padding: 12, marginBottom: 12, gap: 8 }}>
            <Text style={{ color: C.textBody, ...Type.secondary }}>{t('leagues.browse.error')}</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable accessibilityRole="button" onPress={() => { load(); setBrowseRevision(n => n + 1); }} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.retry')}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => router.setParams({ group: '' })} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.back')}</Text>
              </Pressable>
            </View>
          </View>
        )}
        {!viewingOwn && (
          <View style={{ marginBottom: 12, gap: 4 }}>
            <Text style={{ color: C.textMuted, ...Type.small }}>{t('leagues.browse.viewing')}</Text>
            <Pressable accessibilityRole="button" onPress={() => router.setParams({ group: '' })} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.back')}</Text>
            </Pressable>
          </View>
        )}

        {/* Resultado de la semana pasada */}
        {state.lastResult && (
          <View style={{
            borderRadius: 18, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
            backgroundColor: state.lastResult === 'promoted' ? tint(C.correct, isDark) : state.lastResult === 'relegated' ? tint(C.wrong, isDark) : C.border,
            borderWidth: 1,
            borderColor: state.lastResult === 'promoted' ? C.correct : state.lastResult === 'relegated' ? C.wrong : C.border,
          }}>
            <Text style={{ fontSize: 24 }}>{state.lastResult === 'promoted' ? '⬆️' : state.lastResult === 'relegated' ? '⬇️' : '🎁'}</Text>
            <Text style={{ flex: 1, color: C.text, fontFamily: Font.semi, fontSize: 13, lineHeight: 19 }}>
              {t(`leagues.result.${state.lastResult}`, { coins: state.lastReward })}
            </Text>
          </View>
        )}

        {/* División actual. La envoltura existe solo para el halo: la sombra y
            el `overflow: 'hidden'` que clipa el degradado no pueden ir en la
            misma vista o iOS no pinta el brillo. */}
        <Pressable accessibilityRole="button" accessibilityLabel={t('leagues.browse.open')}
          onPress={() => router.push({ pathname: '/league-picker', params: { selected: state.groupId ?? '' } })}
          style={{
            borderRadius: Radius.cardLg, backgroundColor: C.surface,
            marginBottom: 12, ...glow(div.color, isDark),
          }}>
          <View style={{ borderRadius: Radius.cardLg, overflow: 'hidden', borderWidth: 1.5, borderColor: div.color + '66' }}>
            <LinearGradient
              colors={[div.color + '3d', div.color + '12', C.surface]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ paddingVertical: 13, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 13 }}
            >
              <Text style={{ fontSize: 36 }}>{div.emoji}</Text>
              <View style={{ flex: 1, gap: 1 }}>
                {groupName ? (
                  <>
                    <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 20 }}>
                      {t('leagues.groupLabel', { name: groupName })}
                    </Text>
                    <Text style={{ color: div.color, fontFamily: Font.bold, fontSize: 13 }}>
                      {t(`leagues.divisions.${div.id}`)}
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: div.color, fontFamily: Font.black, fontSize: 20 }}>
                    {t(`leagues.divisions.${div.id}`)}
                  </Text>
                )}
                <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 12 }}>
                  {t('leagues.endsIn', { count: days })} · {groupName
                    ? t('leagues.membersOf', { count: state.memberCount, size: state.groupSize })
                    : t('leagues.members', { count: state.memberCount })}
                </Text>
              </View>
              <View accessibilityElementsHidden importantForAccessibility="no" style={{
                width: 9, height: 9, marginRight: 4,
                borderRightWidth: 2.25, borderBottomWidth: 2.25, borderColor: C.textMuted,
                transform: [{ rotate: '45deg' }, { translateX: -1.5 }, { translateY: -1.5 }],
              }} />
            </LinearGradient>
          </View>
        </Pressable>

        {/* Mi posición: las tres cifras en una fila, y el estado como una línea
            debajo. Antes eran cuatro bloques apilados y se comían la pantalla
            antes de llegar a la clasificación. */}
        {viewingOwn && (
          <View style={{ backgroundColor: C.surface, borderRadius: Radius.card, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MiniStat C={C} label={t('leagues.yourPosition')} value={state.myRank ? `#${state.myRank}` : '—'} color={C.text} />
              <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: C.border }} />
              <MiniStat C={C} label={t('leagues.xpThisWeek')} value={`${state.myXp} XP`} color={C.social} />
              {state.myRank != null && (
                <>
                  <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: C.border }} />
                  <MiniStat
                    C={C}
                    label={t('leagues.currentPrize')}
                    value={`+${leaguePlacementReward(state.division, state.myRank)} 🪙`}
                    color={C.brandDeep}
                  />
                </>
              )}
            </View>
            <View style={{ marginTop: 10, paddingTop: 9, borderTopWidth: 1, borderTopColor: C.border }}>
              {inPromo ? (
                <Text style={{ color: C.correct, fontFamily: Font.bold, fontSize: 12.5 }}>
                  ⬆️ {t('leagues.inPromo', { division: t(`leagues.divisions.${nextDiv.id}`) })}
                </Text>
              ) : inRelegation ? (
                <Text style={{ color: C.wrong, fontFamily: Font.bold, fontSize: 12.5 }}>
                  ⬇️ {t('leagues.inRelegation')}
                </Text>
              ) : canPromote ? (
                <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 12.5 }}>
                  {t('leagues.safeHint', { n: state.promoteZone })}
                </Text>
              ) : (
                <Text style={{ color: div.color, fontFamily: Font.bold, fontSize: 12.5 }}>
                  {t('leagues.topDivisionShort')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Premios por puesto, en fila de izquierda a derecha. Como listado
            ocupaban cinco filas; el dato útil de cada uno son dos cifras y
            caben de sobra en una columna estrecha. La letra pequeña de cuándo
            se pagan vive en el modal del "?". */}
        <Text style={{ color: C.textFaint, fontSize: 12, fontFamily: Font.extra, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
          {t('leagues.prizesTitle')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
          {[
            { icon: '🥇', label: t('leagues.prizeShort1'), rank: 1 },
            { icon: '🥈', label: t('leagues.prizeShort2'), rank: 2 },
            { icon: '🥉', label: t('leagues.prizeShort3'), rank: 3 },
            { icon: '🏅', label: t('leagues.prizeTop10'), rank: 10 },
            { icon: '🎗️', label: t('leagues.prizeShortRest'), rank: 11 },
          ].map(p => {
            // El puesto que ocupas ahora mismo se resalta: convierte la tabla en
            // "lo que te llevas" en vez de un cuadro de tarifas.
            const mine = state.myRank != null && rankBucket(state.myRank) === p.rank;
            return (
              <View key={p.rank} style={{
                flex: 1, alignItems: 'center', gap: 1,
                backgroundColor: mine ? C.brandTint : C.surface,
                borderRadius: 14, paddingVertical: 9, paddingHorizontal: 2,
                borderWidth: mine ? 1.5 : 1,
                borderColor: mine ? C.borderWarm : C.border,
              }}>
                <Text style={{ fontSize: 15 }}>{p.icon}</Text>
                <Text numberOfLines={1} style={{ color: C.textMuted, fontSize: 10, fontFamily: Font.bold }}>
                  {p.label}
                </Text>
                <Text numberOfLines={1} style={{ color: C.brandDeep, fontSize: 12, fontFamily: Font.black }}>
                  +{leaguePlacementReward(state.division, p.rank)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Clasificación */}
        <Text style={{ color: C.textFaint, fontSize: 12, fontFamily: Font.extra, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
          {t('leagues.leaderboard')}
        </Text>
        {state.leaderboard.length === 0 ? (
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', paddingVertical: 20 }}>
            {t('leagues.empty')}
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {state.leaderboard.map(row => {
              const isMe = row.userId === user?.id;
              const rowPromo = canPromote && row.rank <= state.promoteZone;
              const rowReleg = showRelegation && row.rank > state.memberCount - state.relegateZone;
              const accent = rowPromo ? C.correct : rowReleg ? C.wrong : null;
              const cos = resolveCosmetics(row.cosmetics);
              return (
                <View key={row.userId} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  backgroundColor: isMe ? div.color + '1a' : C.surface,
                  borderRadius: Radius.row, padding: 11,
                  borderWidth: 1, borderColor: isMe ? div.color + '66' : 'transparent',
                  borderLeftWidth: accent ? 3 : 1,
                  borderLeftColor: accent ?? (isMe ? div.color + '66' : 'transparent'),
                }}>
                  <Text style={{ width: 24, textAlign: 'center', color: row.rank <= 3 ? div.color : C.textFaint, fontFamily: Font.black, fontSize: 13 }}>
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <UserName
                      name={row.username}
                      cosmetics={cos}
                      suffix={isMe ? t('ladder.you') : ''}
                      isPro={row.isPro}
                      color={isMe ? div.color : C.text}
                      fontFamily={isMe ? Font.bold : Font.semi}
                    />
                  </View>
                  {rowPromo && <Text style={{ fontSize: 12 }}>⬆️</Text>}
                  {rowReleg && <Text style={{ fontSize: 12 }}>⬇️</Text>}
                  <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 14 }}>{row.xp} XP</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}
