import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useGuest } from '@/hooks/useGuest';
import { useOffline } from '@/hooks/useOffline';
import { useIsPro } from '@/hooks/usePremium';
import { ProGate } from '@/components/ProGate';
import { fetchCategoryStats, type CategoryStat } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import {
  EMPTY_PRO_STATS, accuracy, accuracyTrend, bestCategory, fillWeeks,
  sortByDifficulty, type ProStats,
} from '@/lib/stats';
import { PRO_ACCENT } from '@/lib/pro';
import { getLocaleTag } from '@/lib/i18n';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';

export default function StatsScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { guest } = useGuest();
  const offline = useOffline();
  const isPro = useIsPro();

  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [stats, setStats] = useState<ProStats>(EMPTY_PRO_STATS);
  const [loading, setLoading] = useState(true);

  const available = !!user && !guest && !offline;

  useEffect(() => {
    let cancelled = false;
    if (!available || !user) { setLoading(false); return; }

    const load = async () => {
      // El cebo (mejor categoría) es una lectura normal de tabla: lo ve todo el
      // mundo. El panel completo va por RPC y exige PRO en el servidor.
      const categoryStats = await fetchCategoryStats(user.id).catch(() => []);
      if (!cancelled) setCategories(categoryStats);

      if (isPro) {
        const { data } = await supabase.rpc('fetch_pro_stats');
        if (!cancelled && data) setStats(data as unknown as ProStats);
      }
      if (!cancelled) setLoading(false);
    };

    void load();
    return () => { cancelled = true; };
  }, [available, isPro, user?.id]);

  const best = useMemo(() => bestCategory(categories), [categories]);
  const weeks = useMemo(() => fillWeeks(stats.weekly), [stats.weekly]);
  const trend = useMemo(() => accuracyTrend(weeks), [weeks]);
  const difficulties = useMemo(() => sortByDifficulty(stats.byDifficulty), [stats.byDifficulty]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
      }}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: C.text, ...Type.navTitle, flex: 1 }}>{t('stats.title')}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={PRO_ACCENT} size="large" />
        </View>
      ) : !available ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
          <Text style={{ color: C.textMuted, ...Type.bodyRegular, textAlign: 'center' }}>
            {t('stats.needsAccount')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: Space.screen, paddingTop: 8, paddingBottom: 40, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Cebo: un dato real y visible para todos. Un panel entero borroso
              no comunica ningún valor; uno con una pista sí. */}
          <View style={{
            backgroundColor: C.surface, borderRadius: Radius.cardLg,
            borderWidth: 1, borderColor: C.border, padding: 16, gap: 4,
            ...cardShadow(isDark),
          }}>
            <Text style={{ color: C.textFaint, ...Type.sectionLabel }}>{t('stats.bestCategory')}</Text>
            {best ? (
              <>
                <Text style={{ color: C.text, ...Type.cardTitleLg }}>
                  {t(`categories.${best.category}`, { defaultValue: best.category })}
                </Text>
                <Text style={{ color: C.textMuted, ...Type.secondary }}>
                  {t('stats.bestCategoryDetail', {
                    accuracy: accuracy(best.correct, best.total) ?? 0,
                    answered: best.total,
                  })}
                </Text>
              </>
            ) : (
              <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('stats.notEnoughData')}</Text>
            )}
          </View>

          <Section title={t('stats.evolutionTitle')}>
            <ProGate
              unlocked={isPro}
              minHeight={200}
              title={t('stats.gateTitle')}
              description={t('stats.gateDescription')}
              source="stats_evolution"
            >
              {isPro ? (
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110 }}>
                    {weeks.map(week => {
                      const rate = accuracy(week.correct, week.answered);
                      return (
                        <View key={week.week} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                          <View style={{
                            width: '100%',
                            height: `${Math.max(3, rate ?? 0)}%`,
                            backgroundColor: rate === null ? C.track : PRO_ACCENT,
                            borderRadius: 3,
                          }} />
                        </View>
                      );
                    })}
                  </View>
                  <Text style={{ color: C.textMuted, ...Type.small }}>
                    {t('stats.evolutionCaption')}
                  </Text>
                  <Text style={{
                    color: trend.trend === 'up' ? C.correctText
                      : trend.trend === 'down' ? C.wrongText : C.textMuted,
                    fontFamily: Font.bold, fontSize: 15,
                  }}>
                    {trend.delta === null
                      ? t('stats.trend.unknown')
                      : t(`stats.trend.${trend.trend}`, { delta: Math.abs(trend.delta) })}
                  </Text>
                </View>
              ) : <ChartSkeleton />}
            </ProGate>
          </Section>

          <Section title={t('stats.difficultyTitle')}>
            <ProGate
              unlocked={isPro}
              minHeight={150}
              title={t('stats.gateTitle')}
              description={t('stats.gateDescription')}
              source="stats_difficulty"
            >
              {isPro ? (
                <View style={{ gap: 12 }}>
                  {difficulties.length === 0
                    ? <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('stats.notEnoughData')}</Text>
                    : difficulties.map(item => {
                        const rate = accuracy(item.correct, item.answered) ?? 0;
                        return (
                          <View key={item.difficulty} style={{ gap: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ color: C.text, ...Type.body }}>
                                {t(`stats.difficulties.${item.difficulty}`)}
                              </Text>
                              <Text style={{ color: C.textMuted, ...Type.smallBold }}>
                                {rate}% · {item.answered}
                              </Text>
                            </View>
                            <View style={{ height: 8, borderRadius: 4, backgroundColor: C.track, overflow: 'hidden' }}>
                              <View style={{ width: `${rate}%`, height: '100%', backgroundColor: PRO_ACCENT }} />
                            </View>
                          </View>
                        );
                      })}
                </View>
              ) : <RowsSkeleton rows={3} />}
            </ProGate>
          </Section>

          <Section title={t('stats.comparisonTitle')}>
            <ProGate
              unlocked={isPro}
              minHeight={120}
              title={t('stats.gateTitle')}
              description={t('stats.gateDescription')}
              source="stats_comparison"
            >
              {isPro && stats.accuracy.mine != null ? (
                <View style={{ gap: 6 }}>
                  <Text style={{ color: C.text, fontSize: 34, fontFamily: Font.black }}>
                    {stats.accuracy.mine}%
                  </Text>
                  <Text style={{ color: C.textMuted, ...Type.secondary }}>
                    {stats.accuracy.global != null
                      ? t('stats.comparisonDetail', { global: stats.accuracy.global })
                      : t('stats.notEnoughData')}
                  </Text>
                </View>
              ) : <RowsSkeleton rows={2} />}
            </ProGate>
          </Section>

          <Section title={t('stats.examsTitle')}>
            <ProGate
              unlocked={isPro}
              minHeight={140}
              title={t('stats.gateTitle')}
              description={t('stats.gateDescription')}
              source="stats_exams"
            >
              {isPro ? (
                stats.exams.length === 0 ? (
                  <Text style={{ color: C.textMuted, ...Type.secondary }}>{t('stats.noExams')}</Text>
                ) : (
                  <View style={{ gap: 8 }}>
                    {stats.exams.map(exam => (
                      <View key={exam.createdAt} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: C.textMuted, ...Type.small }}>
                          {new Date(exam.createdAt).toLocaleDateString(getLocaleTag())}
                        </Text>
                        <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
                          {Number(exam.grade).toFixed(1).replace('.', ',')}
                        </Text>
                      </View>
                    ))}
                  </View>
                )
              ) : <RowsSkeleton rows={4} />}
            </ProGate>
          </Section>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { C, isDark } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: C.textFaint, ...Type.sectionLabel }}>{title}</Text>
      <View style={{
        backgroundColor: C.surface, borderRadius: Radius.cardLg,
        borderWidth: 1, borderColor: C.border, padding: 16,
        ...cardShadow(isDark),
      }}>
        {children}
      </View>
    </View>
  );
}

// Bajo el velo del ProGate va un ESQUELETO —formas grises, sin una sola cifra—
// y no datos de ejemplo. El velo hace ilegible lo que hay debajo, pero enseñar
// números inventados donde el usuario espera los suyos sería mentirle aunque
// no llegue a leerlos.
const SKELETON_BARS = [45, 70, 35, 85, 60, 50, 90, 40, 75, 55, 65, 80];

function ChartSkeleton() {
  const { C } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110 }}>
        {SKELETON_BARS.map((height, i) => (
          <View key={i} style={{
            flex: 1, height: `${height}%`,
            backgroundColor: alpha(C.textFaint, 0.35), borderRadius: 3,
          }} />
        ))}
      </View>
      <View style={{ height: 12, width: '60%', borderRadius: 6, backgroundColor: alpha(C.textFaint, 0.25) }} />
    </View>
  );
}

function RowsSkeleton({ rows }: { rows: number }) {
  const { C } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={{ gap: 6 }}>
          <View style={{ height: 12, width: `${70 - i * 8}%`, borderRadius: 6, backgroundColor: alpha(C.textFaint, 0.25) }} />
          <View style={{ height: 8, borderRadius: 4, backgroundColor: alpha(C.textFaint, 0.16) }} />
        </View>
      ))}
    </View>
  );
}
