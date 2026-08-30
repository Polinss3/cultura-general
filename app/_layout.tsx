import '@/lib/i18n'; // debe ir primero: init i18n antes de que renderice cualquier componente
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import * as Sentry from '@sentry/react-native';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setOffline, probeConnection } from '@/lib/offline';
import { adsConfigured, markAdsSessionStarted } from '@/lib/ads';
import { noteAppOpen } from '@/lib/reviewGate';
import { applyAdvertisingDecision } from '@/lib/advertising';
import { BootScreen } from '@/components/BootScreen';
import { AdsConsentModal } from '@/components/AdsConsentModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { getOnboardingCompleted } from '@/lib/onboarding';
import { applyPersistedLanguage, getCurrentLang } from '@/lib/i18n';
import { loadThemePreference } from '@/lib/appearance';
import { purgeLegacyQuestionCache } from '@/lib/db';
import { rescheduleDailyReminderIfActive } from '@/lib/notifications';
import { initFeedback } from '@/lib/feedback';
import { supabase } from '@/lib/supabase';
import { setSentryUser } from '@/lib/sentry';
import { clearGuestData } from '@/lib/guest';
import { handleIncomingAuthUrl } from '@/lib/auth';
import { requiresProfileCompletion } from '@/lib/authValidation';
import { useIsDark } from '@/constants/colors';
import {
  type AdsConsentDecision,
  hydrateAdsConsent,
  saveAdsConsentDecision,
  subscribeAdsPreferencesReview,
} from '@/stores/adsConsentStore';

Sentry.init({
  dsn: 'https://b47aaa6f083737c40dd659db4a776b87@o4511400341995520.ingest.de.sentry.io/4511400352546896',
  // No reportamos en local para no contaminar el dashboard.
  enabled: !__DEV__,
  environment: __DEV__ ? 'development' : 'production',
  // Privacidad: NO enviar IP/cookies/etc por defecto. Solo adjuntamos
  // el user.id de Supabase explícitamente vía setSentryUser().
  sendDefaultPii: false,
  // Sin tracing/performance — solo crashes (mantiene el plan gratuito).
  tracesSampleRate: 0,
  attachStacktrace: true,
  maxBreadcrumbs: 50,
});

SplashScreen.preventAutoHideAsync();

// Plazos del arranque. Ninguna promesa puede dejar la app clavada en la
// BootScreen: a los 5s ofrecemos el modo sin conexión y a los 10s entramos
// igualmente con lo que haya (rechazo 2.1(a) de Apple: "App launched on a
// splash screen", iPadOS 26.5, al actualizar sobre una versión con sesión
// guardada y la red del backend inaccesible).
const BOOT_OFFLINE_HINT_MS = 5000;
const BOOT_HARD_DEADLINE_MS = 10000;

// La StatusBar necesita el esquema resuelto (preferencia + sistema), así que
// va en su propio componente: los hooks de tema tienen que estar dentro del
// árbol que ya se está renderizando.
function AppStatusBar() {
  const isDark = useIsDark();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const { session, loading } = useAuth();
  const { guest, loading: guestLoading } = useGuest();
  const offline = useOffline();
  const segments = useSegments();
  const router = useRouter();
  const { t } = useTranslation();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [langReady, setLangReady] = useState(false);
  const [authLinkReady, setAuthLinkReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileNeedsCompletion, setProfileNeedsCompletion] = useState(false);
  // Arranque sin conexión.
  const [probeDone, setProbeDone] = useState(false);   // sonda de red resuelta
  const [manualEnter, setManualEnter] = useState(false); // usuario pulsó "Continuar sin conexión"
  const [bootTimedOut, setBootTimedOut] = useState(false); // toca ofrecer el modo sin conexión
  const [bootExpired, setBootExpired] = useState(false);   // plazo máximo agotado: entramos igual
  const [adsConsentHydrated, setAdsConsentHydrated] = useState(false);
  const [adsDecision, setAdsDecision] = useState<AdsConsentDecision | null>(null);
  const [reviewAdsPreferences, setReviewAdsPreferences] = useState(false);

  useEffect(() => {
    // Ante un fallo de storage asumimos "sin onboarding": preferimos repetirlo
    // a quedarnos esperando para siempre.
    getOnboardingCompleted().then(setOnboarded).catch(() => setOnboarded(false));
    // Sella la fecha de instalación (solo la primera vez) para que el portero
    // de la valoración pueda exigir una antigüedad mínima.
    noteAppOpen();
  }, []);

  // Red de seguridad del arranque: pase lo que pase, la app entra.
  useEffect(() => {
    const timer = setTimeout(() => setBootExpired(true), BOOT_HARD_DEADLINE_MS);
    return () => clearTimeout(timer);
  }, []);

  // Idioma: aplicar override guardado bajo el BootScreen (sin flash), y de
  // paso limpiar la caché de preguntas v1 y reprogramar el recordatorio en el
  // idioma activo (cubre a quien cambió el idioma del sistema con la app cerrada).
  useEffect(() => {
    Promise.all([applyPersistedLanguage(), loadThemePreference()]).finally(() => {
      setLangReady(true);
      purgeLegacyQuestionCache();
      rescheduleDailyReminderIfActive();
      initFeedback();
    });
  }, []);

  useEffect(() => subscribeAdsPreferencesReview(() => setReviewAdsPreferences(true)), []);

  // Sonda de conectividad al arrancar + temporizador para ofrecer el modo
  // sin conexión si la carga se alarga.
  useEffect(() => {
    let cancelled = false;
    probeConnection().then(ok => {
      if (cancelled) return;
      if (!ok) setOffline(true);
      setProbeDone(true);
    });
    const timer = setTimeout(() => {
      if (!cancelled) setBootTimedOut(true);
    }, BOOT_OFFLINE_HINT_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Keep Sentry user in sync with auth state for better crash attribution.
  useEffect(() => {
    setSentryUser(session?.user?.id ?? null);
  }, [session?.user?.id]);

  // Handle auth deep links (OAuth callback, email confirmation and password recovery).
  useEffect(() => {
    let cancelled = false;

    const handleDeepLink = async (url: string) => {
      const result = await handleIncomingAuthUrl(url);
      if (!result.handled || cancelled) return;
      if (result.error) {
        Alert.alert(t('common.error'), result.error);
        return;
      }
      if (result.route === 'update-password') {
        router.replace('/(auth)/update-password');
      }
    };

    const bootstrap = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) await handleDeepLink(initialUrl);
      } catch {
        // Un deep link ilegible no puede impedir que la app arranque.
      } finally {
        if (!cancelled) setAuthLinkReady(true);
      }
    };

    bootstrap();
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const loadProfileStatus = async () => {
      if (!session?.user) {
        setProfileNeedsCompletion(false);
        setProfileReady(true);
        return;
      }

      setProfileReady(false);

      // La consulta no debe poder bloquear la splash indefinidamente (p. ej.
      // sin red): si tarda demasiado, desbloqueamos sin forzar complete-profile.
      let settled = false;
      const timer = setTimeout(() => {
        if (settled || cancelled) return;
        settled = true;
        setProfileNeedsCompletion(false);
        setProfileReady(true);
      }, 6000);

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .maybeSingle();

      if (settled || cancelled) return;
      settled = true;
      clearTimeout(timer);

      setProfileNeedsCompletion(
        error ? false : requiresProfileCompletion(data?.username, session.user.user_metadata),
      );
      setProfileReady(true);
    };

    loadProfileStatus();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, session?.user?.updated_at]);

  // ─ Estado de arranque ─
  // Si las fuentes fallan seguimos con las del sistema: es preferible a no arrancar.
  const fontsReady = fontsLoaded || !!fontError;
  const authResolved =
    fontsReady && !loading && !guestLoading && onboarded !== null && authLinkReady && profileReady && langReady;
  const hasIdentity = !!session || guest;
  // Usuario sin sesión + sin red confirmada: requiere pulsar "Continuar sin conexión".
  const needsManualEntry = offline && !hasIdentity;
  // `manualEnter` y `bootExpired` entran por su cuenta: son las salidas de
  // emergencia y no pueden depender de `authResolved`, que es justo lo que
  // puede quedarse a medias.
  const ready =
    (authResolved && (hasIdentity || (probeDone && !offline))) || manualEnter || bootExpired;

  useEffect(() => {
    if (!ready || !onboarded) return;
    // Build sin anuncios posibles: ni se pregunta ni se aplica una decisión
    // guardada. Sin esta guarda, una decisión de una build anterior seguiría
    // disparando CMP, ATT, AppsFlyer y Meta en cada arranque para
    // medir anuncios que esta versión no muestra.
    if (!adsConfigured()) return;
    let cancelled = false;
    markAdsSessionStarted();
    hydrateAdsConsent()
      .then(decision => {
        if (cancelled) return;
        setAdsDecision(decision);
        setAdsConsentHydrated(true);
        if (decision) applyAdvertisingDecision(decision);
      })
      .catch(() => {
        if (!cancelled) setAdsConsentHydrated(true);
      });
    return () => { cancelled = true; };
  }, [ready, onboarded]);

  // Ocultar la splash nativa cuando ya podemos mostrar UI propia (app o BootScreen).
  useEffect(() => {
    if (ready || bootTimedOut || needsManualEntry) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready, bootTimedOut, needsManualEntry]);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    const syncOnboardingAndRoute = async () => {
      const hasCompletedOnboarding = await getOnboardingCompleted().catch(() => onboarded ?? false);
      if (cancelled) return;

      if (hasCompletedOnboarding !== onboarded) {
        setOnboarded(hasCompletedOnboarding);
        return;
      }

      const segs = segments as readonly string[];
      const inAuth = segs[0] === '(auth)';
      const inOnboarding = segs[0] === 'onboarding';
      const isUpdatePassword = segs[1] === 'update-password';
      const isAuthCallback = segs[0] === 'auth' && segs[1] === 'callback';
      const isCompleteProfile = segs[1] === 'complete-profile';

      // Si llega sesión real estando en modo invitado, limpiamos rastros del invitado.
      if (session && guest) {
        await clearGuestData();
      }

      // Modo sin conexión: sin acceso a perfil/complete-profile; entrada directa
      // a los tabs (Rápido y Aprender). Diario/Amigos muestran aviso dentro.
      if (offline) {
        if (isUpdatePassword) return;
        if (!hasCompletedOnboarding) {
          if (!inOnboarding) router.replace('/onboarding');
          return;
        }
        if (segs[0] !== '(tabs)') router.replace('/(tabs)');
        return;
      }

      if (session) {
        if (profileNeedsCompletion && !isCompleteProfile && !isUpdatePassword) {
          router.replace('/complete-profile' as any);
        } else if (isCompleteProfile && !profileNeedsCompletion) {
          if (!hasCompletedOnboarding) {
            router.replace('/onboarding');
          } else {
            router.replace('/(tabs)');
          }
        } else if ((inAuth || isAuthCallback) && !isUpdatePassword && !isCompleteProfile) {
          if (!hasCompletedOnboarding) {
            router.replace('/onboarding');
          } else {
            router.replace('/(tabs)');
          }
        } else if (!hasCompletedOnboarding && !inOnboarding && !isUpdatePassword) {
          router.replace('/onboarding');
        } else if (hasCompletedOnboarding && inOnboarding) {
          router.replace('/(tabs)');
        }
      } else if (guest) {
        // Invitado: tratamos igual que sesión a efectos de routing, pero sin Supabase.
        if ((inAuth || isAuthCallback) && !isUpdatePassword) {
          if (!hasCompletedOnboarding) {
            router.replace('/onboarding');
          } else {
            router.replace('/(tabs)');
          }
        } else if (!hasCompletedOnboarding && !inOnboarding && !isUpdatePassword) {
          router.replace('/onboarding');
        } else if (hasCompletedOnboarding && inOnboarding) {
          router.replace('/(tabs)');
        }
      } else if (!inAuth) {
        router.replace('/(auth)/login');
      }
    };

    syncOnboardingAndRoute();

    return () => {
      cancelled = true;
    };
  }, [
    ready,
    session,
    loading,
    guest,
    guestLoading,
    fontsLoaded,
    onboarded,
    segments,
    authLinkReady,
    profileReady,
    profileNeedsCompletion,
    offline,
    manualEnter,
  ]);

  if (!ready) {
    return (
      <BootScreen
        showOfflineButton={bootTimedOut || needsManualEntry}
        onContinueOffline={() => { setOffline(true); setManualEnter(true); }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ProgressProvider>
          <AppStatusBar />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 250,
            }}
          />
          <AdsConsentModal
            visible={Boolean(
              adsConfigured() && onboarded && adsConsentHydrated &&
              (!adsDecision || reviewAdsPreferences),
            )}
            initialDecision={adsDecision}
            dismissible={Boolean(adsDecision && reviewAdsPreferences)}
            onDismiss={() => setReviewAdsPreferences(false)}
            onSave={async input => {
              const decision = await saveAdsConsentDecision({
                ...input,
                language: getCurrentLang(),
              });
              setAdsDecision(decision);
              setReviewAdsPreferences(false);
              await applyAdvertisingDecision(decision);
            }}
          />
        </ProgressProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
