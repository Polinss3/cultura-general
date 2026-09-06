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
import { PRO_ACCENT } from '@/lib/pro';
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
  const { C } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 13,
      backgroundColor: C.surface, borderRadius: Radius.cardLg,
      borderWidth: 1, borderColor: C.border, padding: 16,
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

  useFocusEffect(useCallback(() => { if (user) refresh(); }, [refresh, user?.id]));

  const openMode = (mode: ModeCard) => {
    feedback.tap();
    router.push((isPro ? mode.route : `/paywall?source=pro_room_${mode.id}`) as any);
  };

  const claimStipend = async () => {
    if (claiming) return;
    setClaiming(true);
    const { data, error } = await supabase.rpc('claim_pro_stipend');
    setClaiming(false);

    if (error) { showToast({ type: 'info', message: t('pro.room.stipendFailed') }); return; }
    if ((data as any)?.claimed) {
      showToast({ type: 'success', message: t('pro.room.stipendClaimed', { coins: (data as any).gainedCoins }) });
      refresh();
    } else {
      showToast({ type: 'info', message: t('pro.room.stipendAlready') });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
      }}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: C.text, ...Type.navTitle, flex: 1 }}>{t('pro.room.title')}</Text>
        {isPro ? <ProBadge variant="chip" /> : null}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Space.screen, paddingTop: 8, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {!isPro && (
          <Pressable onPress={() => router.push('/paywall?source=pro_room_header' as any)}>
            <LinearGradient
              colors={[alpha(PRO_ACCENT, isDark ? 0.32 : 0.16), alpha(PRO_ACCENT, isDark ? 0.14 : 0.06)]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{
                borderRadius: Radius.cardLg, padding: 18, gap: 6,
                borderWidth: 1.5, borderColor: alpha(PRO_ACCENT, 0.4),
              }}
            >
              <Text style={{ color: C.text, ...Type.cardTitleLg }}>{t('pro.room.pitchTitle')}</Text>
              <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('pro.room.pitchBody')}</Text>
              <Text style={{ color: PRO_ACCENT, fontFamily: Font.bold, fontSize: 15, marginTop: 4 }}>
                {t('pro.gate.cta')} →
              </Text>
            </LinearGradient>
          </Pressable>
        )}

        <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginTop: 4 }}>
          {t('pro.room.modesTitle')}
        </Text>

        {MODES.map(mode => (
          <Pressable key={mode.id} onPress={() => openMode(mode)} accessibilityRole="button">
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 14,
              backgroundColor: C.surface, borderRadius: Radius.cardLg,
              borderWidth: 1, borderColor: C.border, padding: 16,
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
            </View>
          </Pressable>
        ))}

        {/* Estadísticas: aquí SÍ entra todo el mundo aunque no tenga PRO. La
            pantalla trae un dato real visible y el resto difuminado, así que es
            mejor escaparate desde dentro que desde una tarjeta bloqueada. */}
        <Pressable onPress={() => { feedback.tap(); router.push('/stats' as any); }} accessibilityRole="button">
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 14,
            backgroundColor: C.surface, borderRadius: Radius.cardLg,
            borderWidth: 1, borderColor: C.border, padding: 16,
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
          </View>
        </Pressable>

        {/* Beneficios. Solo tienen sentido con cuenta y red. */}
        {isPro && (
          <>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel, marginTop: 8 }}>
              {t('pro.room.benefitsTitle')}
            </Text>

            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.cardLg,
              borderWidth: 1, borderColor: C.border, padding: 16, gap: 6,
            }}>
              <Text style={{ color: C.text, ...Type.cardTitle }}>{t('pro.room.stipendTitle')}</Text>
              <Text style={{ color: C.textMuted, ...Type.small, lineHeight: 18 }}>
                {t('pro.room.stipendBody')}
              </Text>
              <Pressable
                onPress={claimStipend}
                disabled={claiming || !user || guest || offline}
                style={{ marginTop: 8, opacity: !user || guest || offline ? 0.5 : 1 }}
              >
                <LinearGradient
                  colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ borderRadius: Radius.pill, paddingVertical: 12, alignItems: 'center' }}
                >
                  {claiming
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 15 }}>
                        {t('pro.room.stipendClaim')}
                      </Text>}
                </LinearGradient>
              </Pressable>
            </View>

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
