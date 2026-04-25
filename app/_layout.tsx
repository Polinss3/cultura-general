import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
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

  useEffect(() => {
    if (!fontsLoaded || loading || onboarded === null) return;
    SplashScreen.hideAsync();

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth) {
      if (!onboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (session && !onboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (session && onboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [session, loading, fontsLoaded, onboarded]);

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
