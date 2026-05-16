// Helpers around Sentry. The SDK is initialized at the top of app/_layout.tsx.
import * as Sentry from '@sentry/react-native';

export function setSentryUser(userId: string | null) {
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }
}

export function captureSentryException(error: unknown, extra?: Record<string, unknown>) {
  Sentry.captureException(error, extra ? { extra } : undefined);
}

export { Sentry };
