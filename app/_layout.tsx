import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import * as Sentry from '@sentry/react-native';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { setOffline, probeConnection } from '@/lib/offline';
import { initMetaSdk, syncMetaAdvertiserTracking } from '@/lib/metaSdk';
import { initializeAdMob } from '@/lib/admob';
import { BootScreen } from '@/components/BootScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { getOnboardingCompleted } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';
import { setSentryUser } from '@/lib/sentry';
import { clearGuestData } from '@/lib/guest';
import { handleIncomingAuthUrl } from '@/lib/auth';
import { requiresProfileCompletion } from '@/lib/authValidation';

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

function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const { session, loading } = useAuth();
  const { guest, loading: guestLoading } = useGuest();
  const offline = useOffline();
  const segments = useSegments();
  const router = useRouter();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [authLinkReady, setAuthLinkReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [profileNeedsCompletion, setProfileNeedsCompletion] = useState(false);
  // Arranque sin conexión.
  const [probeDone, setProbeDone] = useState(false);   // sonda de red resuelta
  const [manualEnter, setManualEnter] = useState(false); // usuario pulsó "Continuar sin conexión"
  const [bootTimedOut, setBootTimedOut] = useState(false); // han pasado ~10s cargando

  useEffect(() => {
    getOnboardingCompleted().then(setOnboarded);
  }, []);

  // Meta SDK: inicializar y sincronizar el tracking publicitario con el ATT
  // ya concedido (usuarios que respondieron en sesiones anteriores).
  useEffect(() => {
    initMetaSdk();
    syncMetaAdvertiserTracking();
  }, []);

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
    }, 10000);
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
        Alert.alert('Error', result.error);
        return;
      }
      if (result.route === 'update-password') {
        router.replace('/(auth)/update-password');
      }
    };

    const bootstrap = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) await handleDeepLink(initialUrl);
      if (!cancelled) setAuthLinkReady(true);
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
  const authResolved =
    fontsLoaded && !loading && !guestLoading && onboarded !== null && authLinkReady && profileReady;
  const hasIdentity = !!session || guest;
  // Usuario sin sesión + sin red confirmada: requiere pulsar "Continuar sin conexión".
  const needsManualEntry = offline && !hasIdentity;
  const ready = authResolved && (hasIdentity || manualEnter || (probeDone && !offline));

  useEffect(() => {
    if (!ready || !onboarded) return;
    initializeAdMob();
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
      const hasCompletedOnboarding = await getOnboardingCompleted();
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
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 250,
          }}
        />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
