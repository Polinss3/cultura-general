import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Pressable, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { usePremium } from '@/hooks/usePremium';
import { useToast } from '@/context/ToastContext';
import { setGuestMode } from '@/lib/guest';
import {
  annualSavingsPercent, fetchPremiumPackages, purchasePremium, restorePremium,
  type PremiumPackage, type PremiumTier,
} from '@/lib/premium';
import {
  PRO_BENEFITS, PRO_BENEFIT_ICONS, PRO_ACCENT,
} from '@/lib/pro';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

const PRIVACY_URL = 'https://cg-trivia.pablobrasero.com/privacy';
// La página de términos está publicada (cg-trivia.pablobrasero.com/terms) e
// incluye la sección de suscripción; Apple exige el enlace desde el paywall (3.1.2).
const TERMS_URL = 'https://cg-trivia.pablobrasero.com/terms';
const MANAGE_URL = 'itms-apps://apps.apple.com/account/subscriptions';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const { isPro, unavailable } = usePremium();
  const { showToast } = useToast();

  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [selected, setSelected] = useState<PremiumTier>('annual');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPremiumPackages().then(list => {
      if (cancelled) return;
      setPackages(list);
      // El anual es el producto que queremos vender: preseleccionado siempre
      // que exista, y si no, lo primero que haya.
      if (!list.some(p => p.tier === 'annual') && list[0]) setSelected(list[0].tier);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Si ya es PRO (o acaba de comprar), esta pantalla no pinta nada.
  useEffect(() => {
    if (isPro) router.back();
  }, [isPro, router]);

  const requireAccount = useCallback(async () => {
    // La compra vive en el Apple ID, no en la cuenta. Exigir cuenta evita el
    // "compré como invitado, reinstalé y lo perdí", que es un 1★ seguro.
    await setGuestMode(false);
    router.replace('/(auth)/login');
  }, [router]);

  const selectedPackage = packages.find(pkg => pkg.tier === selected) ?? null;
  const savings = annualSavingsPercent(packages);

  const handlePurchase = async () => {
    if (busy) return;
    if (!user || guest) { await requireAccount(); return; }

    const pkg = selectedPackage;
    if (!pkg) return;

    setBusy(true);
    const outcome = await purchasePremium(pkg);
    setBusy(false);

    if (outcome === 'purchased') {
      showToast({ type: 'success', message: t('pro.paywall.welcome') });
      router.back();
    } else if (outcome === 'error') {
      showToast({ type: 'info', message: t('pro.paywall.purchaseFailed') });
    }
  };

  const handleRestore = async () => {
    if (busy) return;
    setBusy(true);
    const restored = await restorePremium();
    setBusy(false);
    showToast({
      type: restored ? 'success' : 'info',
      message: restored ? t('pro.paywall.restored') : t('pro.paywall.nothingToRestore'),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
          <Text style={{ color: C.textMuted, fontSize: 22 }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Space.screen, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera */}
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <LinearGradient
            colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.7)]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radius.pill, paddingHorizontal: 18, paddingVertical: 7, marginBottom: 14 }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: Font.black, fontSize: 15, letterSpacing: 1.5 }}>
              CG PRO
            </Text>
          </LinearGradient>
          <Text style={{ color: C.text, ...Type.screenTitle, textAlign: 'center' }}>
            {t('pro.paywall.title')}
          </Text>
          <Text style={{
            color: C.textMuted, ...Type.secondary, textAlign: 'center',
            marginTop: 8, maxWidth: 320,
          }}>
            {t('pro.paywall.subtitle')}
          </Text>
        </View>

        {/* Beneficios */}
        <View style={{
          backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 18,
          borderWidth: 1, borderColor: C.border, gap: 14, marginBottom: 22,
          ...cardShadow(isDark),
        }}>
          {PRO_BENEFITS.map(benefit => (
            <View key={benefit} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20, width: 26, textAlign: 'center' }}>
                {PRO_BENEFIT_ICONS[benefit]}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
                  {t(`pro.benefits.${benefit}.title`)}
                </Text>
                <Text style={{ color: C.textMuted, ...Type.small, marginTop: 2, lineHeight: 19 }}>
                  {t(`pro.benefits.${benefit}.description`)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Planes */}
        {loading ? (
          <ActivityIndicator color={PRO_ACCENT} size="large" style={{ marginVertical: 30 }} />
        ) : packages.length === 0 ? (
          <View style={{
            backgroundColor: C.surfaceSunk, borderRadius: Radius.card, padding: 20,
            alignItems: 'center', marginBottom: 18,
          }}>
            <Text style={{ color: C.textMuted, ...Type.secondary, textAlign: 'center' }}>
              {unavailable ? t('pro.paywall.unavailable') : t('pro.paywall.noPlans')}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10, marginBottom: 18 }}>
            {packages.map(pkg => (
              <PlanRow
                key={pkg.identifier}
                pkg={pkg}
                selected={selected === pkg.tier}
                savings={pkg.tier === 'annual' ? savings : null}
                onSelect={() => setSelected(pkg.tier)}
              />
            ))}
          </View>
        )}

        {packages.length > 0 && (
          <Pressable onPress={handlePurchase} disabled={busy} accessibilityRole="button">
            <LinearGradient
              colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{
                borderRadius: Radius.card, padding: 17, alignItems: 'center',
                opacity: busy ? 0.6 : 1,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 17 }}>
                {busy
                  ? '…'
                  : selectedPackage?.freeTrial
                    ? t('pro.paywall.startTrial')
                    : t('pro.paywall.subscribe')}
              </Text>
            </LinearGradient>
          </Pressable>
        )}

        <Pressable onPress={handleRestore} disabled={busy} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 14 }}>
            {t('pro.paywall.restore')}
          </Text>
        </Pressable>

        {/* Legal: obligatorio para pasar revisión de Apple (3.1.2). */}
        {/* Apple exige anunciar en el punto de compra cuánto dura la prueba,
            que se convierte en pago automáticamente y a qué precio (3.1.2). */}
        {selectedPackage?.freeTrial ? (
          <Text style={{
            color: C.textBody, ...Type.small, lineHeight: 19,
            textAlign: 'center', marginTop: 18,
          }}>
            {t('pro.paywall.trialNotice', {
              count: selectedPackage.freeTrial.count,
              duration: t(
                `pro.plans.trialDuration.${selectedPackage.freeTrial.unit}`,
                { count: selectedPackage.freeTrial.count },
              ),
              price: selectedPackage.priceString,
              period: t(`pro.plans.period.${selectedPackage.tier}`),
            })}
          </Text>
        ) : null}

        <Text style={{
          color: C.textFaint, ...Type.tiny, lineHeight: 18,
          textAlign: 'center', marginTop: 12,
        }}>
          {t('pro.paywall.legal')}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          <LegalLink label={t('pro.paywall.terms')} url={TERMS_URL} />
          <LegalLink label={t('pro.paywall.privacy')} url={PRIVACY_URL} />
          <LegalLink label={t('pro.paywall.manage')} url={MANAGE_URL} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegalLink({ label, url }: { label: string; url: string }) {
  const { C } = useTheme();
  return (
    <Pressable onPress={() => Linking.openURL(url).catch(() => {})} hitSlop={8}>
      <Text style={{ color: C.textMuted, ...Type.tiny, textDecorationLine: 'underline' }}>
        {label}
      </Text>
    </Pressable>
  );
}

function PlanRow({
  pkg, selected, savings, onSelect,
}: { pkg: PremiumPackage; selected: boolean; savings: number | null; onSelect: () => void }) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const best = pkg.tier === 'annual';

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: selected ? alpha(PRO_ACCENT, isDark ? 0.18 : 0.08) : C.surface,
        borderRadius: Radius.card, padding: 16,
        borderWidth: 2,
        borderColor: selected ? PRO_ACCENT : C.border,
      }}
    >
      <View style={{
        width: 22, height: 22, borderRadius: 11, borderWidth: 2,
        borderColor: selected ? PRO_ACCENT : C.borderStrong,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {selected ? (
          <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: PRO_ACCENT }} />
        ) : null}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 16 }}>
            {t(`pro.plans.${pkg.tier}`)}
          </Text>
          {best ? (
            <View style={{
              backgroundColor: PRO_ACCENT, borderRadius: Radius.pill,
              paddingHorizontal: 8, paddingVertical: 2,
            }}>
              <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 11 }}>
                {savings ? t('pro.plans.save', { percent: savings }) : t('pro.plans.bestValue')}
              </Text>
            </View>
          ) : null}
        </View>
        {pkg.freeTrial ? (
          <Text style={{ color: C.correctText, fontFamily: Font.bold, fontSize: 12, marginTop: 3 }}>
            {t(`pro.plans.trial.${pkg.freeTrial.unit}`, { count: pkg.freeTrial.count })}
          </Text>
        ) : null}
        {pkg.pricePerMonth ? (
          <Text style={{ color: C.textMuted, ...Type.tiny, marginTop: 2 }}>
            {t('pro.plans.perMonth', { price: pkg.pricePerMonth })}
          </Text>
        ) : null}
      </View>

      <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 17 }}>
        {pkg.priceString}
      </Text>
    </Pressable>
  );
}
