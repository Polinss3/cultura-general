import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { DIVISIONS, fetchLeagueGroups, leagueGroupName, type LeagueGroup } from '@/lib/leagues';
import { feedback } from '@/lib/feedback';
import { alpha, readableOn, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type } from '@/constants/theme';
import { SheetHeader } from '@/components/SheetHeader';

type PickerRow = { kind: 'division'; division: number } | { kind: 'group'; group: LeagueGroup } | { kind: 'empty'; division: number };

export default function LeaguePickerSheet() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const router = useRouter();
  const { selected } = useLocalSearchParams<{ selected?: string }>();
  const [groups, setGroups] = useState<LeagueGroup[] | null>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const available = !!user && !guest && !offline;

  useEffect(() => {
    if (!available) return;
    let cancelled = false;
    setError(false);
    fetchLeagueGroups().then(data => { if (!cancelled) setGroups(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [available, user?.id, revision]);

  const rows: PickerRow[] = DIVISIONS.flatMap((_, division) => {
    const divisionGroups = groups?.filter(g => g.division === division) ?? [];
    return [
      { kind: 'division', division },
      ...divisionGroups.map(group => ({ kind: 'group' as const, group })),
      ...(divisionGroups.length ? [] : [{ kind: 'empty' as const, division }]),
    ] as PickerRow[];
  });

  if (!available || (!groups && error)) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: Space.screen, paddingBottom: Space.screen, gap: 16, alignItems: 'center' }}>
        <View style={{ alignSelf: 'stretch' }}><SheetHeader title={t('leagues.browse.title')} /></View>
        <Text style={{ color: C.textBody, ...Type.bodyRegular, textAlign: 'center' }}>
          {t(offline ? 'leagues.offline' : !available ? 'leagues.gatedSub' : 'leagues.browse.error')}
        </Text>
        {available && <Pressable accessibilityRole="button" onPress={() => setRevision(x => x + 1)} style={{ minHeight: 44, padding: 12 }}>
          <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.retry')}</Text>
        </Pressable>}
      </View>
    );
  }
  if (!groups) return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: Space.screen, gap: 24 }}>
      <SheetHeader title={t('leagues.browse.title')} />
      <ActivityIndicator color={C.brand} />
    </View>
  );

  return (
    <FlatList style={{ flex: 1, backgroundColor: C.bg }} data={rows}
      keyExtractor={row => row.kind === 'group' ? row.group.groupId : `${row.kind}-${row.division}`}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: Space.screen, paddingBottom: 36 }}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={<SheetHeader title={t('leagues.browse.title')} subtitle={t('leagues.browse.subtitle')} />}
      renderItem={({ item }) => {
        if (item.kind === 'empty') return <Text style={{ color: C.textMuted, ...Type.secondary, marginBottom: 10 }}>{t('leagues.browse.empty')}</Text>;
        if (item.kind === 'division') {
          const d = DIVISIONS[item.division];
          return <Text style={{ color: readableOn(d.color, isDark), ...Type.cardTitle, marginTop: 14, marginBottom: 10 }}>{d.emoji} {t(`leagues.divisions.${d.id}`)}</Text>;
        }
        const g = item.group;
        const d = DIVISIONS[g.division];
        const active = selected ? selected === g.groupId : g.isMine;
        const name = t('leagues.groupLabel', { name: leagueGroupName(g) });
        return (
          <Pressable accessibilityRole="button" accessibilityState={{ selected: active }}
            accessibilityLabel={`${name}. ${t('leagues.browse.members', { count: g.memberCount })}${g.isMine ? `. ${t('leagues.browse.mine')}` : ''}`}
            onPress={() => {
              feedback.select();
              router.dismissTo({ pathname: '/leagues', params: { group: g.isMine ? '' : g.groupId } });
            }}
            style={({ pressed }) => ({
              flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8,
              borderRadius: Radius.card, borderWidth: active ? 2 : 1,
              borderColor: alpha(d.color, active ? 0.85 : 0.3), backgroundColor: alpha(d.color, isDark ? 0.14 : 0.08),
              opacity: pressed ? 0.7 : 1,
            })}>
            <Text style={{ fontSize: 28 }}>{d.emoji}</Text>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ color: C.text, fontFamily: Font.extra, fontSize: 16 }}>{name}</Text>
              <Text style={{ color: C.textMuted, ...Type.small }}>{t('leagues.browse.members', { count: g.memberCount })}</Text>
              {g.isMine && <Text style={{ color: readableOn(d.color, isDark), ...Type.smallBold }}>{t('leagues.browse.mine')}</Text>}
            </View>
            <Text style={{ color: C.textMuted, fontFamily: Font.black, fontSize: 20 }}>{active ? '✓' : '›'}</Text>
          </Pressable>
        );
      }}
    />
  );
}
