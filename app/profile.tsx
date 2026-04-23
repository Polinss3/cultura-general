import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { fetchAnswerHistory, updateUsername, AnswerHistoryItem } from '@/lib/db';
import { computeAchievements } from '@/lib/achievements';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
  getNotificationsEnabled,
} from '@/lib/notifications';
import { CAT_NAMES, CAT_ICONS } from '@/constants/questions';
import { Category } from '@/types';

const MODE_LABELS: Record<string, string> = { daily: 'Diario', speed: 'Rápido', learn: 'Aprendizaje' };

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, refresh } = useProfile();

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState<AnswerHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [notificationsOn, setNotificationsOn] = useState(false);
  const [notifLoading, setNotifLoading] = useState(true);

  useEffect(() => {
    getNotificationsEnabled().then(enabled => {
      setNotificationsOn(enabled);
      setNotifLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAnswerHistory(user.id, 15).then(h => {
      setHistory(h);
      setLoadingHistory(false);
    });
  }, [user?.id]);

  const handleNotifToggle = useCallback(async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Sin permisos', 'Activa las notificaciones en Ajustes del sistema.');
        return;
      }
      await scheduleDailyReminder();
      setNotificationsOn(true);
    } else {
      await cancelDailyReminder();
      setNotificationsOn(false);
    }
  }, []);

  const handleSaveUsername = useCallback(async () => {
    if (!user || !newUsername.trim()) return;
    setSaving(true);
    const { error } = await updateUsername(user.id, newUsername);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setEditingUsername(false);
      refresh();
    }
  }, [user, newUsername, refresh]);

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  };

  const achievements = computeAchievements(profile);
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
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
          </Pressable>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>Mi perfil</Text>
        </View>

        {/* Avatar + username */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <LinearGradient
            colors={['#e8a030', '#e83060']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          >
            <Text style={{ color: '#fff', fontSize: 32, fontFamily: 'Outfit_700Bold' }}>{initial}</Text>
          </LinearGradient>

          {editingUsername ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TextInput
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder={profile?.username ?? ''}
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoFocus
                autoCapitalize="none"
                style={{
                  color: '#fff', fontFamily: 'Outfit_400Regular', fontSize: 16,
                  backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 12,
                  paddingVertical: 8, minWidth: 160, borderWidth: 1, borderColor: 'rgba(232,160,48,0.4)',
                }}
              />
              <Pressable onPress={handleSaveUsername} disabled={saving}>
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: 15 }}>
                  {saving ? '...' : 'Guardar'}
                </Text>
              </Pressable>
              <Pressable onPress={() => setEditingUsername(false)}>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 15 }}>✕</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => { setNewUsername(profile?.username ?? ''); setEditingUsername(true); }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>
                {profile?.username ?? '...'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>✏️</Text>
            </Pressable>
          )}
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
            <StatCard label="Racha actual" value={`${profile?.streak ?? 0}🔥`} />
            <StatCard label="Mejor racha" value={`${profile?.best_streak ?? 0}🏆`} />
            <StatCard label="Récord rápido" value={`${profile?.speed_record ?? 0}⚡`} />
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

        {/* Answer history */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>Historial reciente</SectionTitle>
          {loadingHistory ? (
            <ActivityIndicator color="#e8a030" />
          ) : history.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 14 }}>
              Aún no has respondido ninguna pregunta.
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {history.map(h => {
                const cat = h.category as Category;
                return (
                  <View
                    key={h.id}
                    style={{
                      backgroundColor: '#151515',
                      borderRadius: 12,
                      padding: 12,
                      borderLeftWidth: 3,
                      borderLeftColor: h.isCorrect ? '#2ec87a' : '#e83060',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{h.isCorrect ? '✅' : '❌'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#fff', fontFamily: 'Outfit_500Medium', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                        {h.questionText}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 11, marginTop: 4 }}>
                        {CAT_ICONS[cat] ?? ''} {CAT_NAMES[cat] ?? h.category} · {MODE_LABELS[h.mode] ?? h.mode}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <SectionTitle>Ajustes</SectionTitle>
          <View style={{
            backgroundColor: '#151515', borderRadius: 14, padding: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
                Recordatorio diario
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2 }}>
                Notificación a las 9:00
              </Text>
            </View>
            {notifLoading ? (
              <ActivityIndicator color="#e8a030" size="small" />
            ) : (
              <Switch
                value={notificationsOn}
                onValueChange={handleNotifToggle}
                trackColor={{ false: '#2a2a2a', true: '#e8a030' }}
                thumbColor="#fff"
              />
            )}
          </View>
        </View>

        {/* Sign out */}
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable
            onPress={handleSignOut}
            style={{ backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,48,96,0.2)' }}
          >
            <Text style={{ color: '#e83060', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>
              Cerrar sesión
            </Text>
          </Pressable>
        </View>

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
