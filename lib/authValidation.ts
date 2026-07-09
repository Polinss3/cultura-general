import i18n from './i18n';

export const USERNAME_PATTERN = /^[\p{L}\p{N}_.\- ]+$/u;

export function normalizeUsername(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!normalized) return i18n.t('validation.usernameRequired');
  if (normalized.length < 3) return i18n.t('validation.usernameMin');
  if (normalized.length > 20) return i18n.t('validation.usernameMax');
  if (!USERNAME_PATTERN.test(normalized)) {
    return i18n.t('validation.usernamePattern');
  }

  return null;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return i18n.t('validation.emailRequired');
  if (/\s/.test(email)) return i18n.t('validation.emailNoSpaces');

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return i18n.t('validation.passwordRequired');
  if (/\s/.test(password)) return i18n.t('validation.passwordNoSpaces');
  if (password.length < 6) return i18n.t('validation.passwordMin');

  return null;
}

export function requiresProfileCompletion(
  username: string | null | undefined,
  userMetadata?: Record<string, unknown> | null,
): boolean {
  if (userMetadata?.needs_profile_completion === true) return true;
  return validateUsername(username ?? '') !== null;
}
