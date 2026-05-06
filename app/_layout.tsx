import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    AsyncStorage.getItem('onboarded_v1').then(val => {
      setOnboarded(val === 'true');
    });
  }, []);

  // Handle password recovery deep links (culturalgeneral://update-password#access_token=...)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (!url.includes('update-password')) return;
      const fragment = url.split('#')[1];
      if (!fragment) return;
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        router.push('/(auth)/update-password');
      }
    };

    Linking.getInitialURL().then(url => { if (url) handleDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || loading || onboarded === null) return;
    SplashScreen.hideAsync();

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const isUpdatePassword = segments[1] === 'update-password';

    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth && !isUpdatePassword) {
      if (!onboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (session && !onboarded && !inOnboarding && !isUpdatePassword) {
      router.replace('/onboarding');
    } else if (session && onboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
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
