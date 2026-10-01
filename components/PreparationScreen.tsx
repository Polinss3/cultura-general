import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow } from '@/constants/theme';
import { PRO_ACCENT } from '@/lib/pro';

interface PreparationRule {
  icon: string;
  text: string;
  highlight?: boolean;
}

interface Props {
  variant: 'daily' | 'pro' | 'speed' | 'ladder';
  icon: string;
  title: string;
  description: string;
  rules: PreparationRule[];
  buttonLabel: string;
  onStart: () => void;
  onBack?: () => void;
  disabled?: boolean;
}

const DAILY_DECORATIONS = [
  { icon: '✨', top: '7%', left: '7%', rotate: '-18deg', size: 36 },
  { icon: '📚', top: '10%', right: '7%', rotate: '12deg', size: 38 },
  { icon: '⭐', top: '23%', left: '3%', rotate: '14deg', size: 31 },
  { icon: '💡', top: '27%', right: '4%', rotate: '-13deg', size: 37 },
  { icon: '🧩', top: '42%', left: '4%', rotate: '-11deg', size: 30 },
  { icon: '🏆', top: '45%', right: '3%', rotate: '15deg', size: 35 },
  { icon: '🎯', bottom: '34%', left: '4%', rotate: '-17deg', size: 32 },
  { icon: '🌟', bottom: '31%', right: '4%', rotate: '10deg', size: 34 },
  { icon: '❓', bottom: '18%', left: '8%', rotate: '13deg', size: 31 },
  { icon: '⏱️', bottom: '15%', right: '7%', rotate: '-16deg', size: 32 },
  { icon: '✦', bottom: '5%', left: '25%', rotate: '-12deg', size: 34 },
  { icon: '🎉', bottom: '4%', right: '24%', rotate: '14deg', size: 32 },
] as const;

const EXAM_DECORATIONS = [
  { icon: '✦', top: '8%', left: '8%', rotate: '-15deg', size: 35 },
  { icon: '📚', top: '12%', right: '6%', rotate: '11deg', size: 37 },
  { icon: '🧠', top: '28%', left: '3%', rotate: '-12deg', size: 31 },
  { icon: '⏱️', top: '31%', right: '4%', rotate: '12deg', size: 33 },
  { icon: '⭐', bottom: '32%', left: '5%', rotate: '15deg', size: 29 },
  { icon: '🎓', bottom: '28%', right: '4%', rotate: '-12deg', size: 34 },
  { icon: '📝', bottom: '12%', left: '8%', rotate: '-15deg', size: 31 },
  { icon: '✨', bottom: '9%', right: '9%', rotate: '15deg', size: 35 },
] as const;

const SPEED_DECORATIONS = [
  { icon: '⚡', top: '8%', left: '8%', rotate: '-16deg', size: 38 },
  { icon: '⏱️', top: '12%', right: '7%', rotate: '13deg', size: 37 },
  { icon: '🎯', top: '28%', left: '4%', rotate: '-11deg', size: 32 },
  { icon: '🧠', top: '31%', right: '4%', rotate: '12deg', size: 34 },
  { icon: '⭐', bottom: '32%', left: '6%', rotate: '15deg', size: 31 },
  { icon: '🏆', bottom: '28%', right: '5%', rotate: '-13deg', size: 35 },
  { icon: '🪙', bottom: '12%', left: '9%', rotate: '-14deg', size: 31 },
  { icon: '✨', bottom: '9%', right: '9%', rotate: '15deg', size: 35 },
] as const;

const LADDER_DECORATIONS = [
  { icon: '🪜', top: '8%', left: '8%', rotate: '-14deg', size: 37 },
  { icon: '🏛️', top: '12%', right: '7%', rotate: '12deg', size: 36 },
  { icon: '❤️', top: '28%', left: '4%', rotate: '-12deg', size: 31 },
  { icon: '🪙', top: '31%', right: '4%', rotate: '12deg', size: 35 },
  { icon: '⛰️', bottom: '32%', left: '5%', rotate: '14deg', size: 33 },
  { icon: '🛡️', bottom: '28%', right: '5%', rotate: '-11deg', size: 34 },
  { icon: '⭐', bottom: '12%', left: '9%', rotate: '-14deg', size: 31 },
  { icon: '👑', bottom: '9%', right: '9%', rotate: '15deg', size: 34 },
] as const;

export function PreparationScreen({
  variant, icon, title, description, rules, buttonLabel, onStart, onBack, disabled = false,
}: Props) {
  const { C, isDark } = useTheme();
  const isPro = variant === 'pro';
  const decorations = variant === 'pro' ? EXAM_DECORATIONS
    : variant === 'speed' ? SPEED_DECORATIONS
      : variant === 'ladder' ? LADDER_DECORATIONS : DAILY_DECORATIONS;
  const buttonColors: [string, string] = isPro ? [PRO_ACCENT, '#8E65DA']
    : variant === 'speed' ? [C.speed, '#9A71D5'] : [C.brand, '#E8904B'];
  const [availableHeight, setAvailableHeight] = useState(0);
  const compact = availableHeight > 0 && availableHeight < 700;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={variant === 'daily' ? ['top'] : ['top', 'bottom']}>
      <View
        style={{ flex: 1, overflow: 'hidden' }}
        onLayout={event => setAvailableHeight(event.nativeEvent.layout.height)}
      >
        {decorations.map((decoration, index) => (
          <Text
            key={index}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 'top' in decoration ? decoration.top : undefined,
              bottom: 'bottom' in decoration ? decoration.bottom : undefined,
              left: 'left' in decoration ? decoration.left : undefined,
              right: 'right' in decoration ? decoration.right : undefined,
              fontSize: decoration.size,
              opacity: isDark ? 0.2 : 0.32,
              transform: [{ rotate: decoration.rotate }],
            }}
          >
            {decoration.icon}
          </Text>
        ))}

        <View style={{ flex: 1, paddingHorizontal: Space.screen, paddingTop: compact ? 4 : 8, paddingBottom: compact ? 8 : 20 }}>
          {onBack && (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              hitSlop={8}
              style={{ alignSelf: 'flex-start', minHeight: 44, minWidth: 44, justifyContent: 'center' }}
            >
              <Text style={{ color: C.textMuted, fontSize: 21 }}>←</Text>
            </Pressable>
          )}

          <View style={{ flex: 1, justifyContent: 'center', gap: compact ? 12 : 20, maxWidth: 620, width: '100%', alignSelf: 'center' }}>
            <View style={{ alignItems: 'center', gap: compact ? 5 : 9 }}>
              <Text style={{ fontSize: compact ? 42 : 54 }}>{icon}</Text>
              <Text style={{ color: C.text, ...Type.screenTitle, fontSize: compact ? 23 : Type.screenTitle.fontSize, textAlign: 'center' }}>{title}</Text>
              <Text style={{ color: C.textMuted, ...Type.bodyRegular, fontSize: compact ? 14 : Type.bodyRegular.fontSize, lineHeight: compact ? 20 : Type.bodyRegular.lineHeight, textAlign: 'center', maxWidth: 400 }}>
                {description}
              </Text>
            </View>

            <View style={{
              backgroundColor: C.surface, borderRadius: Radius.cardLg, borderWidth: 1,
              borderColor: isPro ? alpha(PRO_ACCENT, isDark ? 0.4 : 0.22)
                : variant === 'speed' ? alpha(C.speed, isDark ? 0.42 : 0.26) : C.borderWarm,
              padding: compact ? 12 : 18, gap: compact ? 8 : 13, ...cardShadow(isDark),
            }}>
              {rules.map((rule, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: compact ? 9 : 14 }}>
                  <Text style={{ fontSize: compact ? 18 : 22, width: compact ? 24 : 29, textAlign: 'center' }}>{rule.icon}</Text>
                  <Text style={{
                    color: rule.highlight ? (variant === 'speed' ? C.speedText : C.coinText) : C.textBody,
                    fontFamily: rule.highlight ? Font.extra : Font.regular,
                    fontSize: compact ? 13 : 15, lineHeight: compact ? 18 : 22, flex: 1,
                  }}>
                    {rule.text}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={onStart}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
            >
              <LinearGradient
                colors={buttonColors}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: Radius.card, minHeight: compact ? 48 : 56, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: Font.black, fontSize: 17 }}>{buttonLabel}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
