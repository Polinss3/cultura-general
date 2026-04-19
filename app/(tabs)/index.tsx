import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Outfit_500Medium', textTransform: 'capitalize' }}>
                {today}
              </Text>
              <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_700Bold', marginTop: 2 }}>
                Hola, Alex 👋
              </Text>
            </View>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>A</Text>
            </LinearGradient>
          </View>

          {/* Streak */}
          <View style={{
            marginTop: 16, backgroundColor: '#151515', borderRadius: 16,
            padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
          }}>
            <Text style={{ fontSize: 26 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>7 días seguidos</Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 1 }}>
                ¡Sigue así! Mañana llegas a 8
              </Text>
            </View>
            <Text style={{ color: '#e8a030', fontSize: 20, fontFamily: 'Outfit_800ExtraBold' }}>7</Text>
          </View>
        </View>

        {/* Game modes */}
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <Text style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Modos de juego
          </Text>

          {/* Daily */}
          <Pressable onPress={() => router.push('/(tabs)/daily')} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#1a1000', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(232,160,48,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(232,160,48,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>🏆</Text>
                </View>
                <View>
                  <Text style={{ color: '#e8a030', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>DIARIO</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>Pregunta del Día</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                La misma pregunta para todos. Compara tu resultado con tus amigos.
              </Text>
              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: '#e8a030', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99 }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>Jugar hoy →</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Outfit_400Regular' }}>
                  127 jugadores hoy
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Speed */}
          <Pressable onPress={() => router.push('/(tabs)/speed')} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#0a001a', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(160,48,232,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(160,48,232,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>⚡</Text>
                </View>
                <View>
                  <Text style={{ color: '#a030e8', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>CONTRARRELOJ</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>30 Segundos</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                ¿Cuántas preguntas puedes responder en 30 segundos?
              </Text>
              <View style={{ marginTop: 14 }}>
                <View style={{ backgroundColor: '#a030e8', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>Tu récord: 8 →</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Learn */}
          <Pressable onPress={() => router.push('/(tabs)/learn')}>
            <LinearGradient
              colors={['#001a0a', '#0a0a0a']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(46,200,122,0.3)' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(46,200,122,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>📚</Text>
                </View>
                <View>
                  <Text style={{ color: '#2ec87a', fontSize: 12, fontFamily: 'Outfit_600SemiBold' }}>APRENDIZAJE</Text>
                  <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>Elige tu tema</Text>
                </View>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_400Regular', lineHeight: 20 }}>
                Geografía, historia, ciencia, arte o filosofía. Si fallas, te explicamos el contexto.
              </Text>
              <View style={{ marginTop: 14 }}>
                <View style={{ backgroundColor: '#2ec87a', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#000', fontSize: 13, fontFamily: 'Outfit_700Bold' }}>Explorar →</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <Text style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Tus estadísticas
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Preguntas', value: '342' },
              { label: 'Aciertos', value: '74%' },
              { label: 'Ranking', value: '#2' },
            ].map(s => (
              <View key={s.label} style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 12, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>{s.value}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
