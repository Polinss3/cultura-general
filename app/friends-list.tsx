import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import {
  searchUsers,
  fetchFriends,
  fetchPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriendshipStatus,
  FriendProfile,
} from '@/lib/db';

type SearchResult = FriendProfile & {
  relationStatus: 'none' | 'pending_sent' | 'pending_received' | 'accepted';
  friendshipId?: string;
};

export default function FriendsListScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [pending, setPending] = useState<FriendProfile[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoadingFriends(true);
    const [f, p] = await Promise.all([
      fetchFriends(user.id),
      fetchPendingRequests(user.id),
    ]);
    setFriends(f);
    setPending(p);
    setLoadingFriends(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  // Search with debounce
  useEffect(() => {
    if (!user || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchUsers(query, user.id);
      // Enrich with friendship status
      const enriched = await Promise.all(
        results.map(async r => {
          const rel = await getFriendshipStatus(user.id, r.id);
          return { ...r, relationStatus: rel.status, friendshipId: rel.friendshipId } as SearchResult;
        }),
      );
      setSearchResults(enriched);
      setSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, user?.id]);

  const handleAddFriend = async (profile: SearchResult) => {
    if (!user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await sendFriendRequest(user.id, profile.id);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setSearchResults(prev =>
        prev.map(r => r.id === profile.id ? { ...r, relationStatus: 'pending_sent' } : r),
      );
    }
  };

  const handleAccept = async (p: FriendProfile) => {
    if (!p.friendshipId) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await acceptFriendRequest(p.friendshipId);
    await load();
  };

  const handleRemove = (p: FriendProfile) => {
    Alert.alert(
      'Eliminar amigo',
      `¿Eliminar a ${p.username} de tu lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!p.friendshipId) return;
            await removeFriend(p.friendshipId);
            await load();
          },
        },
      ],
    );
  };

  const isSearching = query.trim().length >= 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>Amigos</Text>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: '#151515', borderRadius: 14, paddingHorizontal: 14,
          paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        }}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre de usuario…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="none"
            style={{ flex: 1, color: '#fff', fontFamily: 'Outfit_400Regular', fontSize: 15 }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Search results */}
        {isSearching && (
          <View style={{ marginBottom: 28 }}>
            <SectionTitle>Resultados de búsqueda</SectionTitle>
            {searching ? (
              <ActivityIndicator color="#30a8e8" />
            ) : searchResults.length === 0 ? (
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 14 }}>
                Sin resultados para «{query}»
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {searchResults.map(r => (
                  <UserRow
                    key={r.id}
                    profile={r}
                    right={
                      r.relationStatus === 'accepted' ? (
                        <Tag label="Amigo ✓" color="#2ec87a" />
                      ) : r.relationStatus === 'pending_sent' ? (
                        <Tag label="Pendiente" color="#e8a030" />
                      ) : r.relationStatus === 'pending_received' ? (
                        <ActionBtn label="Aceptar" color="#2ec87a" onPress={() => handleAccept(r as any)} />
                      ) : (
                        <ActionBtn label="Añadir" color="#30a8e8" onPress={() => handleAddFriend(r)} />
                      )
                    }
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {!isSearching && (
          <>
            {/* Pending requests */}
            {pending.length > 0 && (
              <View style={{ marginBottom: 28 }}>
                <SectionTitle>Solicitudes recibidas ({pending.length})</SectionTitle>
                <View style={{ gap: 8 }}>
                  {pending.map(p => (
                    <UserRow
                      key={p.id}
                      profile={p}
                      right={
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <ActionBtn label="Aceptar" color="#2ec87a" onPress={() => handleAccept(p)} />
                          <ActionBtn label="✕" color="#e83060" onPress={() => p.friendshipId && removeFriend(p.friendshipId).then(load)} />
                        </View>
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Friends list */}
            <View>
              <SectionTitle>
                {friends.length > 0 ? `${friends.length} amigos` : 'Amigos'}
              </SectionTitle>
              {loadingFriends ? (
                <ActivityIndicator color="#30a8e8" />
              ) : friends.length === 0 ? (
                <View style={{ backgroundColor: '#151515', borderRadius: 16, padding: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 36, marginBottom: 12 }}>👥</Text>
                  <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 16, marginBottom: 6 }}>
                    Aún no tienes amigos
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                    Busca a alguien por su nombre de usuario y añádelo.
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  {friends.map(f => (
                    <UserRow
                      key={f.id}
                      profile={f}
                      right={
                        <Pressable onPress={() => handleRemove(f)}>
                          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>···</Text>
                        </Pressable>
                      }
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────

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

function UserRow({ profile, right }: { profile: FriendProfile; right: React.ReactNode }) {
  const initial = (profile.username?.[0] ?? '?').toUpperCase();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: '#151515', borderRadius: 14, padding: 12,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#30a8e8', alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 16 }}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>{profile.username}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 2 }}>
          🔥 {profile.streak} · ✓ {profile.totalCorrect}
        </Text>
      </View>
      {right}
    </View>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={{ backgroundColor: color + '22', borderRadius: 99, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ color, fontFamily: 'Outfit_600SemiBold', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: color + '22', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: color + '44' }}
    >
      <Text style={{ color, fontFamily: 'Outfit_600SemiBold', fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}
