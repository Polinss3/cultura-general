import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
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
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { getOnboardingCompleted } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';
import { setSentryUser } from '@/lib/sentry';
import { ensureTrackingPermission } from '@/lib/tracking';

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
  const segments = useSegments();
  const router = useRouter();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingCompleted().then(setOnboarded);
  }, []);

  // Keep Sentry user in sync with auth state for better crash attribution.
  useEffect(() => {
    setSentryUser(session?.user?.id ?? null);
  }, [session?.user?.id]);

  // Notification taps → deep link inside the app.
  const lastHandledNotificationId = useRef<string | null>(null);
  useEffect(() => {
    const handleResponse = (response: Notifications.NotificationResponse) => {
      // Guard against the same cold-start payload being delivered twice
      // (getLastNotificationResponseAsync + the live listener can race).
      const reqId = response.notification.request.identifier;
      if (lastHandledNotificationId.current === reqId) return;
      lastHandledNotificationId.current = reqId;

      const data = response.notification.request.content.data as
        | { type?: string; sender_id?: string }
        | undefined;
      if (!data?.type) return;
      // Only route once we have a session — otherwise auth flow will redirect.
      if (!session) return;

      if (data.type === 'friend_request') {
        router.push('/friends-list');
      } else if (data.type === 'friend_accept' && data.sender_id) {
        router.push(`/profile/${data.sender_id}`);
      }
    };

    Notifications.getLastNotificationResponseAsync().then(r => { if (r) handleResponse(r); });
    const sub = Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => sub.remove();
  }, [router, session?.user?.id]);

  // Handle password recovery deep links (culturalgeneral://update-password#access_token=...)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Only honor recovery deep links — never authenticate via arbitrary links.
      if (!url.includes('update-password')) return;

      const fragment = url.split('#')[1];
      if (!fragment) return;
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');
      if (!access_token || !refresh_token) return;
      if (type && type !== 'recovery') return;

      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) return;
      router.push('/(auth)/update-password');
    };

    Linking.getInitialURL().then(url => { if (url) handleDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, [router]);

  useEffect(() => {
    if (!fontsLoaded || loading || onboarded === null) return;
    SplashScreen.hideAsync();
    // Fire-and-forget: pedir ATT en iOS la primera vez tras el splash.
    // Si el usuario rechaza, los anuncios mostrarán contenido no
    // personalizado, pero la app sigue funcionando con normalidad.
    ensureTrackingPermission();

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

      if (!session && !inAuth) {
        router.replace('/(auth)/login');
      } else if (session && inAuth && !isUpdatePassword) {
        if (!hasCompletedOnboarding) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else if (session && !hasCompletedOnboarding && !inOnboarding && !isUpdatePassword) {
        router.replace('/onboarding');
      } else if (session && hasCompletedOnboarding && inOnboarding) {
        router.replace('/(tabs)');
      }
    };

    syncOnboardingAndRoute();

    return () => {
      cancelled = true;
    };
  }, [session, loading, fontsLoaded, onboarded, segments]);

  if (!fontsLoaded || loading || onboarded === null) return null;

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
