import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchProfileById, PublicProfile } from '@/lib/db';
import { computeAchievements } from '@/lib/achievements';

export default function FriendProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProfileById(id).then(p => {
      setProfile(p);
      setNotFound(!p);
      setLoading(false);
    });
  }, [id]);

  const achievements = profile ? computeAchievements(profile) : [];
  const unlocked = achievements.filter(a => a.unlocked).length;
  const answered = profile?.total_answered ?? 0;
  const correct = profile?.total_correct ?? 0;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const initial = (profile?.username?.[0] ?? '?').toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }} hitSlop={12}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>Perfil</Text>
        </View>

        {loading ? (
          <View style={{ paddingTop: 80, alignItems: 'center' }}>
            <ActivityIndicator color="#e8a030" />
          </View>
        ) : notFound || !profile ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🤷</Text>
            <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 16, marginBottom: 6 }}>
              Usuario no encontrado
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 13, textAlign: 'center' }}>
              Es posible que haya eliminado su cuenta.
            </Text>
          </View>
        ) : (
          <>
            {/* Avatar + username */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <LinearGradient
                colors={['#e8a030', '#e83060']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
              >
                <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Outfit_700Bold' }}>{initial}</Text>
              </LinearGradient>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>{profile.username}</Text>
            </View>

            {/* Stats */}
            <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
              <SectionTitle>Estadísticas</SectionTitle>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <StatCard label="Respondidas" value={String(answered)} />
                <StatCard label="Correctas" value={String(correct)} />
                <StatCard label="Precisión" value={answered > 0 ? `${accuracy}%` : '—'} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <StatCard label="Racha actual" value={`${profile.streak}🔥`} />
                <StatCard label="Mejor racha" value={`${profile.best_streak}🏆`} />
                <StatCard label="Récord rápido" value={`${profile.speed_record}⚡`} />
              </View>
            </View>

            {/* Achievements */}
            <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
              <SectionTitle>{unlocked}/{achievements.length} Logros</SectionTitle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {achievements.map(a => (
                  <View
                    key={a.id}
                    style={{
                      width: '47%',
                      backgroundColor: a.unlocked ? '#151515' : '#0f0f0f',
                      borderRadius: 14,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: a.unlocked ? a.color + '40' : 'rgba(255,255,255,0.05)',
                      opacity: a.unlocked ? 1 : 0.45,
                    }}
                  >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</Text>
                    <Text style={{ color: a.unlocked ? '#fff' : 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_700Bold', fontSize: 13 }}>
                      {a.title}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 2 }}>
                      {a.desc}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{
      color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Outfit_600SemiBold',
      letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
    }}>
      {children}
    </Text>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#151515', borderRadius: 14, padding: 12, alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Outfit_700Bold' }}>{value}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}
