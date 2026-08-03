import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { captureSentryException } from '@/lib/sentry';
import i18n from '@/lib/i18n';
import { useTheme } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * La pantalla de error va aparte porque el límite de error tiene que ser una
 * clase, y las clases no pueden usar hooks (y el tema es un hook).
 */
function ErrorFallback({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  const { C } = useTheme();

  return (
    <View style={{
      flex: 1, backgroundColor: C.bg,
      alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      <Text style={{ fontSize: 64, marginBottom: 20 }}>😵</Text>
      <Text style={{
        color: C.text, fontSize: 24, fontFamily: Font.black,
        marginBottom: 12, textAlign: 'center',
      }}>
        {i18n.t('components.errorBoundary.title')}
      </Text>
      <Text style={{
        color: C.textMuted, fontSize: 15, fontFamily: Font.regular,
        textAlign: 'center', lineHeight: 24, marginBottom: 32,
      }}>
        {i18n.t('components.errorBoundary.body')}
      </Text>
      {__DEV__ && error && (
        <Text
          numberOfLines={4}
          style={{
            color: C.wrongText, fontSize: 12, fontFamily: Font.regular,
            backgroundColor: C.wrongTint, padding: 12, borderRadius: Radius.iconSm,
            marginBottom: 24, width: '100%',
          }}
        >
          {error.toString()}
        </Text>
      )}
      <Pressable onPress={onRetry} style={{ width: '100%' }}>
        <View style={{
          backgroundColor: C.brand, borderRadius: 18, padding: 16, alignItems: 'center',
        }}>
          <Text style={{ color: C.onBrand, fontSize: 16, fontFamily: Font.extra }}>
            {i18n.t('common.retry')}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
    captureSentryException(error, { componentStack: info.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
