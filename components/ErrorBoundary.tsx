import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
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
    // In production you'd send this to a service like Sentry
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>Algo fue mal</Text>
          <Text style={styles.body}>
            Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.dev} numberOfLines={4}>
              {this.state.error.toString()}
            </Text>
          )}
          <Pressable onPress={this.handleRetry} style={{ width: '100%' }}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Reintentar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  dev: {
    color: '#e83060',
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    backgroundColor: '#1a0a0a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  btn: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});
