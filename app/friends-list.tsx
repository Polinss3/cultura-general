import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, ScrollView, Pressable, TextInput,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { feedback } from '@/lib/feedback';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { GuestGate } from '@/components/GuestGate';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';
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
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();

  if (guest) {
    return (
      <GuestGate
        icon="👥"
        title={t('friendsList.gateTitle')}
        description={t('friendsList.gateDesc')}
      />
    );
  }

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
    feedback.tap();
    const { error } = await sendFriendRequest(user.id, profile.id);
    if (error) {
      Alert.alert(t('common.error'), error);
    } else {
      setSearchResults(prev =>
        prev.map(r => r.id === profile.id ? { ...r, relationStatus: 'pending_sent' } : r),
      );
    }
  };

  const handleAccept = async (p: FriendProfile) => {
    if (!p.friendshipId) return;
    feedback.reward();
    await acceptFriendRequest(p.friendshipId);
    await load();
  };

  const handleRemove = (p: FriendProfile) => {
    Alert.alert(
      t('friendsList.removeTitle'),
      t('friendsList.removeBody', { username: p.username }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: C.text, fontSize: 20, fontFamily: Font.black }}>{t('friendsList.header')}</Text>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: C.surface, borderRadius: 18, paddingHorizontal: 14,
          paddingVertical: 12, borderWidth: 1, borderColor: C.border,
        }}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('friendsList.searchPlaceholder')}
            placeholderTextColor={C.textFaint}
            autoCapitalize="none"
            style={{ flex: 1, color: C.text, fontFamily: Font.regular, fontSize: 15 }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Text style={{ color: C.textFaint, fontSize: 16 }}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Search results */}
        {isSearching && (
          <View style={{ marginBottom: 28 }}>
            <SectionTitle>{t('friendsList.searchResults')}</SectionTitle>
            {searching ? (
              <ActivityIndicator color={C.social} />
            ) : searchResults.length === 0 ? (
              <Text style={{ color: C.textFaint, fontFamily: Font.regular, fontSize: 14 }}>
                {t('friendsList.noResults', { query })}
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {searchResults.map(r => (
                  <UserRow
                    key={r.id}
                    profile={r}
                    right={
                      r.relationStatus === 'accepted' ? (
                        <Tag label={t('friendsList.friendTag')} color={C.correct} />
                      ) : r.relationStatus === 'pending_sent' ? (
                        <Tag label={t('friendsList.pendingTag')} color={C.brand} />
                      ) : r.relationStatus === 'pending_received' ? (
                        <ActionBtn label={t('friendsList.accept')} color={C.correct} onPress={() => handleAccept(r as any)} />
                      ) : (
                        <ActionBtn label={t('friendsList.add')} color={C.social} onPress={() => handleAddFriend(r)} />
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
                <SectionTitle>{t('friendsList.requestsReceived', { count: pending.length })}</SectionTitle>
                <View style={{ gap: 8 }}>
                  {pending.map(p => (
                    <UserRow
                      key={p.id}
                      profile={p}
                      right={
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <ActionBtn label={t('friendsList.accept')} color={C.correct} onPress={() => handleAccept(p)} />
                          <ActionBtn label="✕" color={C.wrong} onPress={() => p.friendshipId && removeFriend(p.friendshipId).then(load)} />
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
                {friends.length > 0 ? t('friendsList.friendsCount', { count: friends.length }) : t('friendsList.friendsTitle')}
              </SectionTitle>
              {loadingFriends ? (
                <ActivityIndicator color={C.social} />
              ) : friends.length === 0 ? (
                <View style={{ backgroundColor: C.surface, borderRadius: Radius.card, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 36, marginBottom: 12 }}>👥</Text>
                  <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 16, marginBottom: 6 }}>
                    {t('friendsList.noFriendsTitle')}
                  </Text>
                  <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
                    {t('friendsList.noFriendsDesc')}
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
                          <Text style={{ color: C.textFaint, fontSize: 20 }}>···</Text>
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
  const { C, isDark } = useTheme();
  return (
    <Text style={{
      color: C.textFaint, fontSize: 13, fontFamily: Font.extra,
      letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 12,
    }}>
      {children}
    </Text>
  );
}

function UserRow({ profile, right }: { profile: FriendProfile; right: React.ReactNode }) {
  const { C, isDark } = useTheme();
  const initial = (profile.username?.[0] ?? '?').toUpperCase();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: C.surface, borderRadius: 18, padding: 12, borderWidth: 1, borderColor: C.border }}>
      <View style={{
        width: 40, height: 40, borderRadius: Radius.row,
        backgroundColor: C.social, alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 16 }}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.text, fontFamily: Font.semi, fontSize: 15 }}>{profile.username}</Text>
        <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 12, marginTop: 2 }}>
          🔥 {profile.streak} · ✓ {profile.totalCorrect}
        </Text>
      </View>
      {right}
    </View>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={{ backgroundColor: color + '22', borderRadius: Radius.pill, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ color, fontFamily: Font.semi, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: color + '22', borderRadius: Radius.pill, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: color + '44' }}
    >
      <Text style={{ color, fontFamily: Font.semi, fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}
