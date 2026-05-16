import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

let initialized = false;

export function initSentry() {
  if (initialized) return;
  // If no DSN is configured (e.g. local dev or Expo Go), skip silently
  // instead of crashing the app.
  if (!DSN) return;

  const isDev = __DEV__;
  const release =
    Constants.expoConfig?.version ??
    Constants.manifest2?.extra?.expoClient?.version ??
    'unknown';

  Sentry.init({
    dsn: DSN,
    debug: false,
    enabled: !isDev,
    environment: isDev ? 'development' : 'production',
    release,
    // Don't send PII by default; Supabase user ids are set via setUser().
    sendDefaultPii: false,
    // Keep traces low-volume; we only need crash reports for now.
    tracesSampleRate: 0,
    // React Native specific tuning.
    enableNative: true,
    attachStacktrace: true,
    maxBreadcrumbs: 50,
  });

  initialized = true;
}

export function setSentryUser(userId: string | null) {
  if (!initialized) return;
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}

export function captureSentryException(error: unknown, extra?: Record<string, unknown>) {
  if (!initialized) return;
  Sentry.captureException(error, extra ? { extra } : undefined);
}

export { Sentry };
