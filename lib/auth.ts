import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import i18n from './i18n';
import {
  normalizeUsername,
  requiresProfileCompletion,
  validateUsername,
} from './authValidation';

WebBrowser.maybeCompleteAuthSession();

export const AUTH_CALLBACK_PATH = 'auth/callback';
export const UPDATE_PASSWORD_PATH = 'update-password';

const handledAuthUrls = new Set<string>();

function isAuthCallbackUrl(url: string) {
  return url.includes('auth/callback');
}

function isUpdatePasswordUrl(url: string) {
  return url.includes(UPDATE_PASSWORD_PATH);
}

function getUrlParams(url: string) {
  const [withoutHash, hash = ''] = url.split('#');
  const query = withoutHash.includes('?') ? withoutHash.split('?')[1] : '';

  return {
    queryParams: new URLSearchParams(query),
    hashParams: new URLSearchParams(hash),
  };
}

function formatAppleFullName(
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
): string | null {
  if (!fullName) return null;

  const parts = [
    fullName.givenName,
    fullName.middleName,
    fullName.familyName,
  ].filter(Boolean);

  if (parts.length === 0) return null;
  return normalizeUsername(parts.join(' '));
}

async function setNeedsProfileCompletion(
  user: User,
  needsProfileCompletion: boolean,
) {
  const nextMetadata = {
    ...(user.user_metadata ?? {}),
    needs_profile_completion: needsProfileCompletion,
  };

  const { error } = await supabase.auth.updateUser({ data: nextMetadata });
  if (error) throw error;
}

async function tryApplySuggestedAppleName(user: User, suggestedName: string | null) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, created_at')
    .eq('id', user.id)
    .maybeSingle();

  const createdAt = profile?.created_at ? new Date(profile.created_at).getTime() : Date.now();
  const createdRecently = Date.now() - createdAt < 5 * 60 * 1000;
  const localPart = normalizeUsername((user.email ?? '').split('@')[0] ?? '');
  const currentUsername = profile?.username ?? null;
  const looksLikeFallback = !currentUsername || currentUsername === localPart;

  if (!createdRecently || !looksLikeFallback) {
    if (!requiresProfileCompletion(currentUsername, user.user_metadata)) {
      return;
    }
  }

  if (suggestedName && !validateUsername(suggestedName)) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username: suggestedName });

    if (!error) {
      await setNeedsProfileCompletion(user, false);
      return;
    }
  }

  await setNeedsProfileCompletion(user, true);
}

export function getAuthCallbackUrl() {
  return Linking.createURL(AUTH_CALLBACK_PATH);
}

export function getUpdatePasswordUrl() {
  return Linking.createURL(UPDATE_PASSWORD_PATH);
}

export async function handleIncomingAuthUrl(url: string): Promise<{
  handled: boolean;
  route?: 'auth-callback' | 'update-password';
  error?: string;
}> {
  if (!isAuthCallbackUrl(url) && !isUpdatePasswordUrl(url)) {
    return { handled: false };
  }

  if (handledAuthUrls.has(url)) {
    return {
      handled: true,
      route: isUpdatePasswordUrl(url) ? 'update-password' : 'auth-callback',
    };
  }

  handledAuthUrls.add(url);

  const { queryParams, hashParams } = getUrlParams(url);
  const route = isUpdatePasswordUrl(url) ? 'update-password' : 'auth-callback';
  const errorDescription = queryParams.get('error_description') ?? hashParams.get('error_description');

  if (errorDescription) {
    return { handled: true, route, error: errorDescription };
  }

  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  const code = queryParams.get('code');

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) return { handled: true, route, error: error.message };
    return { handled: true, route };
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return { handled: true, route, error: error.message };
    return { handled: true, route };
  }

  return { handled: true, route, error: i18n.t('errors.authFailed') };
}

export async function signInWithGoogle() {
  const redirectTo = getAuthCallbackUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error(i18n.t('errors.googleLoginFailed'));

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return { cancelled: true };

  const completion = await handleIncomingAuthUrl(result.url);
  if (completion.error) throw new Error(completion.error);

  return { cancelled: false };
}

export async function signInWithApple() {
  const nonce = Crypto.randomUUID();
  const state = Crypto.randomUUID();

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce,
    state,
  });

  if (!credential.identityToken || !credential.authorizationCode) {
    throw new Error(i18n.t('errors.appleTokenInvalid'));
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    access_token: credential.authorizationCode,
    nonce,
  });

  if (error) throw error;
  if (!data.user) throw new Error(i18n.t('errors.appleLoginFailed'));

  const suggestedName = formatAppleFullName(credential.fullName);
  await tryApplySuggestedAppleName(data.user, suggestedName);

  return { cancelled: false };
}
