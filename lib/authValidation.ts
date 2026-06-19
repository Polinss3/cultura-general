export const USERNAME_PATTERN = /^[\p{L}\p{N}_.\- ]+$/u;

export function normalizeUsername(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!normalized) return 'Necesitas un nombre de usuario.';
  if (normalized.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (normalized.length > 20) return 'El nombre no puede tener más de 20 caracteres.';
  if (!USERNAME_PATTERN.test(normalized)) {
    return 'Usa solo letras, números, espacios, puntos, guiones o guiones bajos.';
  }

  return null;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Introduce tu email.';
  if (/\s/.test(email)) return 'El email no puede contener espacios.';

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Introduce una contraseña.';
  if (/\s/.test(password)) return 'La contraseña no puede contener espacios.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';

  return null;
}

export function requiresProfileCompletion(
  username: string | null | undefined,
  userMetadata?: Record<string, unknown> | null,
): boolean {
  if (userMetadata?.needs_profile_completion === true) return true;
  return validateUsername(username ?? '') !== null;
}
