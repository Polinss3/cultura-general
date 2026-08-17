import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setGuestMode } from '@/lib/guest';
import { fetchAllTimeRanking, fetchMyGlobalRank, type GlobalRow, type GlobalSort, type MyGlobalRank } from '@/lib/db';
import { resolveCosmetics } from '@/lib/cosmetics';
import { UserName } from '@/components/UserName';
import { LeagueBadge } from '@/components/LeagueBadge';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';

const MEDALS = ['🥇', '🥈', '🥉'];

const SORTS: { key: GlobalSort; labelKey: string }[] = [
  { key: 'answered', labelKey: 'ranking.sortAnswered' },
  { key: 'correct',  labelKey: 'ranking.sortCorrect' },
  { key: 'streak',   labelKey: 'ranking.sortStreak' },
];

/** Cifra que se muestra a la derecha, según el criterio de orden activo. */
function valueFor(row: GlobalRow, sort: GlobalSort): string {
  if (sort === 'correct') return String(row.totalCorrect);
  if (sort === 'streak') return String(row.streak);
  return String(row.totalAnswered);
}

function accuracy(row: GlobalRow): number | null {
  if (row.totalAnswered <= 0) return null;
  return Math.round((row.totalCorrect / row.totalAnswered) * 100);
}

export default function RankingScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();

  const [sort, setSort] = useState<GlobalSort>('answered');
  // undefined = cargando; array = cargado (puede venir vacío).
  const [rows, setRows] = useState<GlobalRow[] | undefined>(undefined);
  const [me, setMe] = useState<MyGlobalRank | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (nextSort: GlobalSort) => {
    const [list, mine] = await Promise.all([
      fetchAllTimeRanking(nextSort),
      user ? fetchMyGlobalRank(user.id, nextSort) : Promise.resolve(null),
    ]);
    setRows(list);
    setMe(mine);
  }, [user?.id]);

  const load = useCallback((nextSort: GlobalSort) => {
    if (guest || offline || !user) { setRows([]); return; }
    setRows(undefined);
    fetchAll(nextSort);
  }, [guest, offline, user?.id, fetchAll]);

  useFocusEffect(useCallback(() => { load(sort); }, [load, sort]));

  // Igual que en Ligas: la recarga por gesto no vacía la lista, para no
  // sustituir el indicador del tirón por el spinner de pantalla completa.
  const onRefresh = useCallback(async () => {
    if (guest || offline || !user) return;
    setRefreshing(true);
    await fetchAll(sort);
    setRefreshing(false);
  }, [guest, offline, user?.id, fetchAll, sort]);

  const goToAuth = async () => {
    await setGuestMode(false);
    router.replace('/(auth)/login');
  };

  const Header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, marginBottom: 8 }}>
      <Pressable onPress={() => router.back()} style={{ padding: 4, marginRight: 12 }} hitSlop={8}>
        <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
      </Pressable>
      <Text style={{ flex: 1, color: C.text, fontSize: 20, fontFamily: Font.black }}>{t('ranking.title')}</Text>
    </View>
  );

  // ── Invitado / sin conexión
  if (guest || offline) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        {Header}
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56, marginBottom: 14 }}>🌍</Text>
          <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {t('ranking.gatedTitle')}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 300 }}>
            {offline ? t('ranking.offline') : t('ranking.gatedSub')}
          </Text>
          {!offline && (
            <Pressable onPress={goToAuth} style={{ width: '100%' }}>
              <View style={{ backgroundColor: C.brand, borderRadius: 18, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 15 }}>{t('ranking.createAccount')}</Text>
              </View>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const meInList = !!me && rows?.some(r => r.userId === me.row.userId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {Header}

      {/* Criterio de orden */}
      <View style={{ flexDirection: 'row', gap: 7, paddingHorizontal: 20, marginBottom: 12 }}>
        {SORTS.map(s => {
          const active = sort === s.key;
          return (
            <Pressable
              key={s.key}
              onPress={() => setSort(s.key)}
              style={{
                paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radius.pill,
                backgroundColor: active ? C.brand : C.surface,
                borderWidth: 1, borderColor: active ? C.brand : C.border,
              }}
            >
              <Text style={{
                color: active ? C.onBrand : C.textMuted,
                fontFamily: active ? Font.extra : Font.bold,
                fontSize: 13,
              }}>
                {t(s.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {rows === undefined ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.textMuted} colors={[C.brand]} />
          }
        >
          {rows.length === 0 ? (
            <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 15, textAlign: 'center', marginTop: 40, lineHeight: 23 }}>
              {t('ranking.empty')}
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {rows.map((row, i) => (
                <RankingRow
                  key={row.userId}
                  C={C}
                  row={row}
                  rank={i + 1}
                  sort={sort}
                  isMe={row.userId === user?.id}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Tu puesto, anclado abajo cuando no sales en la lista visible. Sin esto,
          quien está fuera del top no tiene forma de saber por dónde va. */}
      {me && !meInList && rows !== undefined && rows.length > 0 && (
        <View style={{
          paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14,
          borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.surface2,
          ...cardShadow(isDark),
        }}>
          <Text style={{ color: C.textFaint, fontSize: 11, fontFamily: Font.extra, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 7 }}>
            {t('ranking.yourPosition')}
          </Text>
          <RankingRow C={C} row={me.row} rank={me.rank} sort={sort} isMe />
        </View>
      )}
    </SafeAreaView>
  );
}

function RankingRow({ C, row, rank, sort, isMe }: {
  C: Palette;
  row: GlobalRow;
  rank: number;
  sort: GlobalSort;
  isMe: boolean;
}) {
  const { t } = useTranslation();
  const cos = resolveCosmetics(row.cosmetics);
  const acc = accuracy(row);

  // Línea de apoyo: nivel, racha y acierto. Es lo que convierte la fila en un
  // perfil de un vistazo en vez de un número suelto.
  const meta = [
    t('ranking.level', { n: row.level }),
    `🔥 ${row.streak}`,
    acc != null ? `${acc}%` : null,
  ].filter(Boolean).join(' · ');

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 11,
      backgroundColor: isMe ? C.brandTint : C.surface,
      borderWidth: isMe ? 1.5 : 1,
      borderColor: isMe ? C.borderWarm : C.border,
      borderRadius: 18, paddingVertical: 11, paddingHorizontal: 12,
    }}>
      <Text style={{
        width: 28, textAlign: 'center',
        fontSize: rank <= 3 ? 17 : 14, fontFamily: Font.black,
        color: C.textFaint,
      }}>
        {rank <= 3 ? MEDALS[rank - 1] : rank}
      </Text>

      <View style={cos.frameColor ? { borderWidth: 2, borderColor: cos.frameColor, borderRadius: 14, padding: 1.5 } : undefined}>
        {isMe ? (
          <LinearGradient
            colors={[C.streak, C.brand]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: C.onBrand, fontSize: 15, fontFamily: Font.black }}>
              {row.username[0]?.toUpperCase() ?? '?'}
            </Text>
          </LinearGradient>
        ) : (
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: C.track,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.black }}>
              {row.username[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1, gap: 1 }}>
        <UserName
          name={row.username}
          cosmetics={cos}
          suffix={isMe ? t('daily.you') : ''}
          color={isMe ? C.brandDeep : C.text}
          fontFamily={isMe ? Font.black : Font.bold}
          fontSize={15}
        />
        <Text numberOfLines={1} style={{ color: C.textMuted, fontSize: 12, fontFamily: Font.regular }}>
          {meta}
        </Text>
      </View>

      <LeagueBadge division={row.division} variant="mini" />

      <View style={{ alignItems: 'flex-end', minWidth: 52 }}>
        <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.black }}>
          {valueFor(row, sort)}
        </Text>
        <Text style={{ color: C.textFaint, fontSize: 10, fontFamily: Font.bold }}>
          {t(`ranking.unit.${sort}`)}
        </Text>
      </View>
    </View>
  );
}
