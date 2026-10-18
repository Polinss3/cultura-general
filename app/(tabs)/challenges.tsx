import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/colors';
import { Space } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModeSwitch, type ModeCard } from '@/components/ModeSwitch';
import { FlagsGame } from '@/components/games/FlagsGame';
import { CitiesGame } from '@/components/games/CitiesGame';
import { YearsGame } from '@/components/games/YearsGame';
import { COUNTRIES } from '@/constants/flags';
import { YEAR_EVENTS } from '@/constants/years';
import { getFlagRecords } from '@/lib/flags';
import { getYearRecords } from '@/lib/years';
import { readCachedCities } from '@/lib/cities';

type Mode = 'flags' | 'years' | 'cities';

const MODE_KEY = 'challenges_mode_v1';

/**
 * Pestaña de Retos: aloja Banderas, Años y Ciudades. Los modos comparten barra, para
 * no meter un sexto icono abajo, pero no comparten estado: cada juego lleva su
 * propio selector, su ronda y sus récords. El conmutador solo se ve en el
 * selector — durante una ronda la pantalla es del juego entera.
 */
export default function ChallengesScreen() {
  const { t } = useTranslation();
  const { C } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>('flags');
  const [flagBest, setFlagBest] = useState<number | null>(null);
  const [yearBest, setYearBest] = useState<number | null>(null);
  const paramAppliedRef = useRef(false);

  const selectMode = useCallback((id: string) => {
    if (id !== 'flags' && id !== 'years' && id !== 'cities') return;
    const next = id;
    setPickerVisible(true);
    setMode(next);
    void AsyncStorage.setItem(MODE_KEY, next).catch(() => {});
  }, []);

  // Se recuerda el último modo usado: quien entra a por banderas no debería
  // tener que reelegirlas cada vez.
  useEffect(() => {
    AsyncStorage.getItem(MODE_KEY).then(saved => {
      // Si se ha entrado desde un tile de Inicio, ese modo manda: la lectura de
      // disco se resuelve más tarde que el efecto de foco y, sin esta guarda,
      // restauraría el modo anterior justo después de aplicar el parámetro.
      if (paramAppliedRef.current) return;
      if (saved === 'flags' || saved === 'years' || saved === 'cities') setMode(saved);
    }).catch(() => {});
  }, []);

  // Los tiles de Inicio abren la pestaña ya en su modo. El parámetro se limpia
  // nada más aplicarlo: en una pestaña sobrevive a la navegación, y si se
  // quedara puesto, volver desde Inicio a "Años" tras haber cambiado a mano a
  // Banderas no haría nada (mismo valor, ningún cambio que detectar).
  useFocusEffect(
    useCallback(() => {
      const wanted = params.mode;
      if (wanted !== 'flags' && wanted !== 'years' && wanted !== 'cities') return;
      paramAppliedRef.current = true;
      selectMode(wanted);
      router.setParams({ mode: undefined });
    }, [params.mode, selectMode, router]),
  );

  // El catálogo de Ciudades se lee de disco al abrir Retos, no al pulsar su
  // tarjeta: así el modo se pinta al instante con lo guardado.
  useEffect(() => { void readCachedCities(); }, []);

  const loadRecords = useCallback(() => {
    getFlagRecords().then(r => setFlagBest(r.all ?? null));
    getYearRecords().then(r => setYearBest(r.all ?? null));
  }, []);
  useEffect(loadRecords, [loadRecords]);

  const cards: ModeCard[] = [
    {
      id: 'flags',
      icon: '🌍',
      title: t('challenges.flags'),
      meta: flagBest != null
        ? t('round.best', { n: flagBest })
        : t('world.countFlags', { count: COUNTRIES.length }),
    },
    {
      id: 'years',
      icon: '📅',
      title: t('challenges.years'),
      meta: yearBest != null
        ? t('round.best', { n: yearBest })
        : t('years.countEvents', { count: YEAR_EVENTS.length }),
    },
  ];

  cards.push({ id: 'cities', icon: '🏙️', title: t('challenges.cities'), meta: t('cities.cardSub') });

  return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
    {pickerVisible && <View style={{ paddingHorizontal: Space.screen, paddingTop: Space.screen }}>
      <ModeSwitch cards={cards} activeId={mode} onSelect={selectMode} />
    </View>}
    <View style={{ flex: 1 }}>
      {mode === 'cities' ? <CitiesGame onPickerChange={setPickerVisible} onRoundFinished={loadRecords} /> :
        mode === 'flags' ? <FlagsGame onPickerChange={setPickerVisible} onRoundFinished={loadRecords} /> :
          <YearsGame onPickerChange={setPickerVisible} onRoundFinished={loadRecords} />}
    </View>
  </SafeAreaView>;
}
