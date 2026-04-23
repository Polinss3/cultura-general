import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/lib/notifications';

const STEPS = [
  {
    icon: '🧠',
    title: '¡Bienvenido a\nCultura General!',
    body: 'Responde preguntas de historia, ciencia, arte, geografía y filosofía. Aprende algo nuevo cada día.',
    cta: 'Siguiente',
    skip: false,
  },
  {
    icon: '🏆',
    title: 'Pregunta diaria',
    body: 'Cada día una nueva pregunta para todos. Compara tu resultado en el ranking global y mantén tu racha.',
    cta: 'Siguiente',
    skip: false,
  },
  {
    icon: '🔔',
    title: 'Recuerda jugar cada día',
    body: '¿Quieres que te avisemos cuando llegue la pregunta del día?',
    cta: 'Activar notificaciones',
    skip: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const finish = async () => {
    await AsyncStorage.setItem('onboarded_v1', 'true');
    router.replace('/(tabs)');
  };

  const handleCta = async () => {
    if (isLast) {
      const granted = await requestNotificationPermission();
      if (granted) await scheduleDailyReminder();
      await finish();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = async () => {
    await finish();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>

        {/* Progress dots */}
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 8 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === step ? '#e8a030' : '#2a2a2a',
              }}
            />
          ))}
        </View>

        {/* Content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
          <Text style={{ fontSize: 80, marginBottom: 32 }}>{current.icon}</Text>
          <Text style={{
            color: '#fff',
            fontSize: 28,
            fontFamily: 'Outfit_800ExtraBold',
            textAlign: 'center',
            lineHeight: 36,
            marginBottom: 20,
          }}>
            {current.title}
          </Text>
          <Text style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 16,
            fontFamily: 'Outfit_400Regular',
            textAlign: 'center',
            lineHeight: 26,
            maxWidth: 300,
          }}>
            {current.body}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <Pressable onPress={handleCta}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 18, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>
                {current.cta}
              </Text>
            </LinearGradient>
          </Pressable>

          {current.skip && (
            <Pressable onPress={handleSkip} style={{ alignItems: 'center', padding: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 15 }}>
                Ahora no
              </Text>
            </Pressable>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
