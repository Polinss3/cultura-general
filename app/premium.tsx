import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { usePremium } from '@/hooks/usePremium';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/context/ToastContext';
import { ProBadge } from '@/components/ProBadge';
import { supabase } from '@/lib/supabase';
import { feedback } from '@/lib/feedback';
import { PRO_ACCENT, PRO_ROOM_BACKGROUND } from '@/lib/pro';
import { daysUntilNextProStipend } from '@/lib/proStipend';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

interface ModeCard {
  id: 'review' | 'exam';
  route: string;
  icon: string;
}

const MODES: ModeCard[] = [
  { id: 'review', route: '/review', icon: '🔁' },
  { id: 'exam', route: '/exam', icon: '📝' },
];

const PRO_GOLD = '#F4C66E';
const PRO_DEEP = '#3E227A';

/**
 * La Sala PRO: la puerta única a lo que trae la suscripción.
 *
 * Los usuarios gratuitos ENTRAN igual. La pantalla es a la vez el escaparate y
 * el paywall: cada tarjeta se ve entera, con su descripción, y al tocarla lleva
 * a la compra en vez de a la función. Esconder la sala detrás de un candado
 * dejaría a la mitad de la gente sin saber siquiera qué se está vendiendo.
 */
function Perk({ icon, title, body, chevron }: {
  icon: string; title: string; body: string; chevron?: boolean;
}) {
  const { C, isDark } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 13,
      backgroundColor: C.surface, borderRadius: Radius.cardLg,
      borderWidth: 1, borderColor: alpha(PRO_ACCENT, isDark ? 0.38 : 0.18), padding: 16,
    }}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>{title}</Text>
        <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>{body}</Text>
      </View>
      {chevron ? <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text> : null}
    </View>
  );
}

export default function PremiumScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const { isPro, tier, expiresAt } = usePremium();
  const { profile, refresh } = useProfile();
  const { showToast } = useToast();

  const [claiming, setClaiming] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());
  const [recentClaim, setRecentClaim] = useState<{ userId: string; at: string } | null>(null);
  const profileClaimAt = profile && user && profile.id === user.id ? profile.pro_stipend_at : null;
  const localClaimAt = recentClaim && recentClaim.userId === user?.id ? recentClaim.at : null;
  const latestClaimAt = localClaimAt && (!profileClaimAt || Date.parse(localClaimAt) > Date.parse(profileClaimAt))
    ? localClaimAt
    : profileClaimAt;
  const stipendDays = daysUntilNextProStipend(latestClaimAt, nowMs);
  const stipendClaimed = stipendDays !== null && stipendDays > 0;
  const stipendDisabled = claiming || !user || profile?.id !== user.id || guest || offline || stipendClaimed;
  const roomBg = isDark ? PRO_ROOM_BACKGROUND.dark : PRO_ROOM_BACKGROUND.light;
  const roomCardGradient: [string, string] = isDark ? ['#2B2239', '#211D2B'] : ['#FFFFFF', '#FBF8FF'];

  useFocusEffect(useCallback(() => {
    setNowMs(Date.now());
    if (user) void refresh();
    const timer = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [refresh, user?.id]));

  const openMode = (mode: ModeCard) => {
    feedback.tap();
    router.push((isPro ? mode.route : `/paywall?source=pro_room_${mode.id}`) as any);
  };

  const claimStipend = async () => {
    if (stipendDisabled) return;
    setClaiming(true);
    const { data, error } = await supabase.rpc('claim_pro_stipend');
    if (error) {
      setClaiming(false);
      showToast({ type: 'info', message: t('pro.room.stipendFailed') });
      return;
    }
    if ((data as any)?.claimed && user) {
      setRecentClaim({ userId: user.id, at: new Date().toISOString() });
    }
    await refresh();
    setNowMs(Date.now());
    setClaiming(false);
    if ((data as any)?.claimed) {
      showToast({ type: 'success', message: t('pro.room.stipendClaimed', { coins: (data as any).gainedCoins }) });
    } else {
      showToast({ type: 'info', message: t('pro.room.stipendAlready') });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: roomBg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
        borderBottomWidth: 1, borderBottomColor: alpha(PRO_ACCENT, isDark ? 0.28 : 0.12),
      }}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: isDark ? '#F5ECFF' : PRO_DEEP, ...Type.navTitle, flex: 1 }}>{t('pro.room.title')}</Text>
        {isPro ? <ProBadge variant="chip" /> : null}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Space.screen, paddingTop: 8, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.push('/paywall?source=pro_room_header' as any)}
          disabled={isPro}
          accessibilityRole={isPro ? undefined : 'button'}
        >
          <LinearGradient
            colors={isDark ? ['#3D2477', '#5A369F', '#34215F'] : ['#452782', '#7045BD', '#8557C6']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{
              borderRadius: Radius.cardLg, padding: 20, gap: 9,
              borderWidth: 1, borderColor: alpha(PRO_GOLD, 0.7),
              ...cardShadow(isDark),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: PRO_GOLD, fontFamily: Font.black, fontSize: 13, letterSpacing: 2 }}>✦ CG PRO</Text>
              <Text style={{ fontSize: 34 }}>💎</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontFamily: Font.black, fontSize: 24 }}>
              {t(isPro ? 'pro.room.heroTitle' : 'pro.room.pitchTitle')}
            </Text>
            <Text style={{ color: '#F2E9FF', ...Type.secondary }}>
              {t(isPro ? 'pro.room.homeSubtitlePro' : 'pro.room.pitchBody')}
            </Text>
            {!isPro && (
              <Text style={{ color: PRO_GOLD, fontFamily: Font.extra, fontSize: 15, marginTop: 3 }}>
                {t('pro.gate.cta')} →
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        <Text style={{ color: isDark ? '#C7A8F5' : PRO_DEEP, ...Type.sectionLabel, marginTop: 8 }}>
          {t('pro.room.modesTitle')}
        </Text>

        {MODES.map(mode => (
          <Pressable key={mode.id} onPress={() => openMode(mode)} accessibilityRole="button">
            <LinearGradient colors={roomCardGradient} style={{
              flexDirection: 'row', alignItems: 'center', gap: 14,
              borderRadius: Radius.cardLg,
              borderWidth: 1, borderColor: alpha(PRO_ACCENT, isDark ? 0.4 : 0.22), padding: 16,
              ...cardShadow(isDark),
            }}>
              <View style={{
                width: 48, height: 48, borderRadius: Radius.icon,
                backgroundColor: alpha(PRO_ACCENT, isDark ? 0.26 : 0.12),
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 24 }}>{mode.icon}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: C.text, ...Type.cardTitle }}>{t(`pro.room.modes.${mode.id}.title`)}</Text>
                <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>
                  {t(`pro.room.modes.${mode.id}.description`)}
                </Text>
              </View>
              {isPro
                ? <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text>
                : <ProBadge />}
            </LinearGradient>
          </Pressable>
        ))}

        {/* Estadísticas: aquí SÍ entra todo el mundo aunque no tenga PRO. La
            pantalla trae un dato real visible y el resto difuminado, así que es
            mejor escaparate desde dentro que desde una tarjeta bloqueada. */}
        <Pressable onPress={() => { feedback.tap(); router.push('/stats' as any); }} accessibilityRole="button">
          <LinearGradient colors={roomCardGradient} style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            borderRadius: Radius.cardLg,
            borderWidth: 1, borderColor: alpha(PRO_ACCENT, isDark ? 0.4 : 0.22), padding: 16,
            ...cardShadow(isDark),
          }}>
            <View style={{
              width: 48, height: 48, borderRadius: Radius.icon,
              backgroundColor: alpha(PRO_ACCENT, isDark ? 0.26 : 0.12),
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 24 }}>📊</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: C.text, ...Type.cardTitle }}>{t('stats.title')}</Text>
              <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>
                {t('pro.room.statsDescription')}
              </Text>
            </View>
            <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text>
          </LinearGradient>
        </Pressable>

        {/* Beneficios. Solo tienen sentido con cuenta y red. */}
        {isPro && (
          <>
            <Text style={{ color: isDark ? '#C7A8F5' : PRO_DEEP, ...Type.sectionLabel, marginTop: 8 }}>
              {t('pro.room.benefitsTitle')}
            </Text>

            <LinearGradient colors={roomCardGradient} style={{
              borderRadius: Radius.cardLg,
              borderWidth: 1, borderColor: alpha(PRO_GOLD, isDark ? 0.55 : 0.75), padding: 16, gap: 6,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 22 }}>🪙</Text>
                <Text style={{ color: C.text, ...Type.cardTitle }}>{t('pro.room.stipendTitle')}</Text>
              </View>
              <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>
                {t('pro.room.stipendBody')}
              </Text>
              <Pressable
                onPress={claimStipend}
                disabled={stipendDisabled}
                accessibilityRole="button"
                accessibilityState={{ disabled: stipendDisabled }}
                style={{ marginTop: 10 }}
              >
                <LinearGradient
                  colors={stipendDisabled
                    ? [isDark ? '#3D3650' : '#EEE7F7', isDark ? '#342D45' : '#E5DCF1']
                    : [PRO_ACCENT, '#8E65DA']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: Radius.pill, minHeight: 52, alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: stipendDisabled
                      ? alpha(PRO_ACCENT, isDark ? 0.2 : 0.12)
                      : alpha(PRO_GOLD, 0.55),
                  }}
                >
                  {claiming ? <ActivityIndicator color={PRO_ACCENT} /> : (
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={{
                      color: stipendDisabled ? (isDark ? '#C7B8DB' : '#79698E') : '#FFFFFF',
                      fontFamily: Font.extra, fontSize: 15, paddingHorizontal: 12,
                    }}>
                      {stipendClaimed
                        ? t('pro.room.stipendCountdown', { count: stipendDays })
                        : t('pro.room.stipendClaim')}
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>
            </LinearGradient>

            <Perk
              icon="🚫"
              title={t('pro.room.noAdsTitle')}
              body={t('pro.room.noAdsBody')}
            />
            <Perk
              icon="🛡️"
              title={t('pro.room.freezeTitle')}
              body={t('pro.room.freezeBody')}
            />
            <Pressable onPress={() => { feedback.tap(); router.push('/shop'); }}>
              <Perk
                icon="🎨"
                title={t('pro.room.cosmeticsTitle')}
                body={t('pro.room.cosmeticsBody')}
                chevron
              />
            </Pressable>

            <View style={{
              backgroundColor: C.surfaceSunk, borderRadius: Radius.card,
              padding: 14, gap: 4,
            }}>
              <Text style={{ color: C.textMuted, ...Type.small }}>
                {t(`pro.room.subscription.${tier}`)}
              </Text>
              {expiresAt ? (
                <Text style={{ color: C.textFaint, ...Type.tiny }}>
                  {t('pro.room.renews', {
                    date: new Date(expiresAt).toLocaleDateString(),
                  })}
                </Text>
              ) : null}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
