import { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  fetchLeague, divisionMeta, daysUntilReset, leagueGroupName, xpToPromotionZone,
  TOP_DIVISION, type LeagueState,
} from '@/lib/leagues';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';

interface Props {
  /** Sin sesión, invitado u offline: se pinta la tarjeta genérica. */
  live: boolean;
}

// Tarjeta de liga en Inicio. Con datos, cuenta la situación real de la semana
// (grupo, puesto, cuánto falta para ascender y cuándo cierra) para que la liga
// esté presente sin entrar en su pantalla; sin datos, invita a entrar.
export function LeagueCard({ live }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { C, isDark } = useTheme();
  const [state, setState] = useState<LeagueState | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!live) { setState(null); return; }
      let cancelled = false;
      fetchLeague().then(s => { if (!cancelled) setState(s); }).catch(() => {});
      return () => { cancelled = true; };
    }, [live]),
  );

  const open = () => { feedback.tap(); router.push('/leagues' as any); };

  const base = {
    backgroundColor: C.surface, borderRadius: Radius.cardLg, padding: 12,
    borderWidth: 1, borderColor: C.border,
    flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12,
    ...cardShadow(isDark),
  };

  if (!state) {
    return (
      <Pressable onPress={open} accessibilityRole="button">
        <View style={base}>
          <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: C.coinTint, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 19 }}>🏆</Text>
          </View>
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.black }}>{t('leagues.cardTitle')}</Text>
            <Text numberOfLines={1} style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular }}>
              {t('leagues.cardDesc')}
            </Text>
          </View>
          <Text style={{ color: C.textFaint, fontSize: 20 }}>›</Text>
        </View>
      </Pressable>
    );
  }

  const div = divisionMeta(state.division);
  const group = leagueGroupName(state);
  const days = daysUntilReset(state.weekStart);
  const inPromo = state.division < TOP_DIVISION && state.myRank != null && state.myRank <= state.promoteZone;
  const gap = xpToPromotionZone(state);
  const showRelegation = state.division > 0 && state.relegateZone > 0
    && state.memberCount > state.promoteZone + state.relegateZone;
  const inRelegation = showRelegation && state.myRank != null
    && state.myRank > state.memberCount - state.relegateZone;

  let hint: string;
  let hintColor = C.textMuted;
  if (state.division >= TOP_DIVISION) {
    hint = t('leagues.topDivisionShort');
    hintColor = div.color;
  } else if (inPromo && gap > 0) {
    hint = t('leagues.card.promoNeedsXp', { xp: gap });
    hintColor = C.correct;
  } else if (inPromo) {
    hint = t('leagues.card.inPromo');
    hintColor = C.correct;
  } else if (inRelegation) {
    hint = t('leagues.card.inRelegation');
    hintColor = C.wrong;
  } else if (gap > 0) {
    hint = t('leagues.card.gapToPromo', { xp: gap });
  } else {
    hint = t('leagues.safeHint', { n: state.promoteZone });
  }

  return (
    <Pressable onPress={open} accessibilityRole="button">
      <View style={{ ...base, borderColor: div.color + '66' }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: div.color + '26', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 21 }}>{div.emoji}</Text>
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text numberOfLines={1} style={{ flexShrink: 1, color: C.text, fontSize: 16, fontFamily: Font.black }}>
              {group ? t('leagues.groupLabel', { name: group }) : t(`leagues.divisions.${div.id}`)}
            </Text>
            {group ? (
              <Text style={{ color: div.color, fontSize: 12, fontFamily: Font.bold }}>
                {t(`leagues.divisions.${div.id}`)}
              </Text>
            ) : null}
          </View>
          <Text numberOfLines={1} style={{ color: hintColor, fontSize: 13, fontFamily: Font.semi }}>
            {hint}
          </Text>
          <Text numberOfLines={1} style={{ color: C.textFaint, fontSize: 12, fontFamily: Font.regular }}>
            {state.myXp} XP · {days <= 1 ? t('leagues.card.closesToday') : t('leagues.card.closesIn', { count: days })}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: inPromo ? C.correct : inRelegation ? C.wrong : C.text, fontSize: 22, fontFamily: Font.black, lineHeight: 26 }}>
            {state.myRank ? `#${state.myRank}` : '—'}
          </Text>
          <Text style={{ color: C.textFaint, fontSize: 11, fontFamily: Font.semi }}>
            {t('leagues.card.ofMembers', { count: state.memberCount })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
