import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { JourneyPicker } from '@/components/adventure/journey-picker';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useAdventureAccess } from '@/hooks/useAdventureAccess';
import { createAdventureProgressRepository } from '@/lib/adventure-progress';
import { ADVENTURE_MAX_LEVELS, ADVENTURE_LEVELS_PER_REGION, type AdventureProgress } from '@/lib/adventure';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Space, Type } from '@/constants/theme';
import { SheetHeader } from '@/components/SheetHeader';

export default function AdventureChaptersSheet() {
  const { t } = useTranslation();
  const { C } = useTheme();
  const router = useRouter();
  const { current } = useLocalSearchParams<{ current?: string }>();
  const { user, loading: authLoading } = useAuth();
  const { guest, loading: guestLoading } = useGuest();
  const offline = useOffline();
  const scope = guestLoading || authLoading ? null : guest ? 'guest' : user?.id ?? 'local';
  const repository = useMemo(() => scope ? createAdventureProgressRepository(scope, { remoteEnabled: !!user && !guest && !offline }) : null, [scope, guest, offline, user?.id]);
  const [progress, setProgress] = useState<AdventureProgress | null>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const access = useAdventureAccess(progress, scope ?? 'guest', !!user && !guest && !offline);
  const totalRegions = Math.ceil(ADVENTURE_MAX_LEVELS / ADVENTURE_LEVELS_PER_REGION);

  useEffect(() => {
    if (!repository) return;
    let cancelled = false;
    setError(false);
    // El mapa ya sincronizó esta copia: abrir su selector no espera otra petición.
    repository.loadLocal().then(stored => { if (!cancelled) setProgress(stored); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [repository, revision]);

  if (!progress) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', paddingHorizontal: Space.screen, paddingBottom: Space.screen, gap: 12 }}>
      <View style={{ alignSelf: 'stretch' }}><SheetHeader title={t('adventure.journeyTitle')} /></View>
      {error ? <>
        <Text style={{ color: C.textMuted, ...Type.bodyRegular }}>{t('common.error')}</Text>
        <Pressable accessibilityRole="button" onPress={() => setRevision(n => n + 1)} style={{ minHeight: 44, padding: 12 }}>
          <Text style={{ color: C.brandDeep, fontFamily: Font.extra }}>{t('leagues.browse.retry')}</Text>
        </Pressable>
      </> : <ActivityIndicator color={C.brand} />}
    </View>
  );

  return <JourneyPicker currentRegion={Math.max(1, Math.min(totalRegions, Number(current) || 1))}
    totalRegions={totalRegions} progress={progress} access={access}
    onSelect={chapter => {
      feedback.select();
      router.dismissTo({ pathname: '/(tabs)/adventure', params: { chapter: String(chapter), selection: String(Date.now()) } });
    }} />;
}
