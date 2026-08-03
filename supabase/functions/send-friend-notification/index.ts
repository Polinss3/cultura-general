// Supabase Edge Function: send-friend-notification
//
// Invoked by Supabase Database Webhooks (see push_tokens_and_notifications.sql
// for the setup instructions). Two webhooks are configured against the
// `friendships` table:
//   • INSERT → notifies the recipient that they have a new friend request.
//   • UPDATE → if the status went from 'pending' to 'accepted', notifies the
//     original requester that their request was accepted.
//
// Deploy with:
//   supabase functions deploy send-friend-notification --no-verify-jwt
//
// JWT verification is disabled because Database Webhooks call this function
// with a Supabase-issued bearer; we don't gate on it explicitly here, but the
// function URL itself is private (project ref slug) and the payload shape is
// validated below.

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

interface FriendshipRow {
  id: string;
  user_id: string;     // requester
  friend_id: string;   // recipient
  status: 'pending' | 'accepted';
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: FriendshipRow | null;
  old_record: FriendshipRow | null;
}

type NotificationType = 'friend_request' | 'friend_accept';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function decide(payload: WebhookPayload):
  | { kind: NotificationType; recipientId: string; senderId: string }
  | null {
  if (payload.type === 'INSERT' && payload.record?.status === 'pending') {
    return {
      kind: 'friend_request',
      recipientId: payload.record.friend_id,
      senderId: payload.record.user_id,
    };
  }
  if (
    payload.type === 'UPDATE' &&
    payload.old_record?.status === 'pending' &&
    payload.record?.status === 'accepted'
  ) {
    // The original requester (user_id) gets told their request was accepted.
    return {
      kind: 'friend_accept',
      recipientId: payload.record.user_id,
      senderId: payload.record.friend_id,
    };
  }
  return null;
}

function buildContent(type: NotificationType, senderUsername: string) {
  if (type === 'friend_request') {
    return {
      title: 'Nueva solicitud de amistad',
      body: `${senderUsername} quiere ser tu amigo`,
    };
  }
  return {
    title: 'Solicitud aceptada',
    body: `${senderUsername} ahora es tu amigo`,
  };
}

Deno.serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (payload?.table !== 'friendships' || payload?.schema !== 'public') {
    return new Response(JSON.stringify({ skipped: 'wrong-table' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const decision = decide(payload);
  if (!decision) {
    return new Response(JSON.stringify({ skipped: 'no-event' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Pull tokens + sender username in parallel.
  const [{ data: tokens, error: tokenErr }, { data: sender, error: senderErr }] =
    await Promise.all([
      admin.from('push_tokens').select('token').eq('user_id', decision.recipientId),
      admin.from('profiles').select('username').eq('id', decision.senderId).single(),
    ]);

  if (tokenErr) {
    console.error('[send-friend-notification] tokens lookup failed', tokenErr);
    return new Response('DB error', { status: 500 });
  }
  if (senderErr) {
    // Non-fatal: fall back to a generic name.
    console.warn('[send-friend-notification] sender lookup failed', senderErr);
  }
  if (!tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const senderUsername = sender?.username ?? 'Alguien';
  const content = buildContent(decision.kind, senderUsername);
  const messages = tokens.map(t => ({
    to: t.token,
    sound: 'default',
    title: content.title,
    body: content.body,
    data: { type: decision.kind, sender_id: decision.senderId },
  }));

  const expoRes = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify(messages),
  });

  if (!expoRes.ok) {
    const text = await expoRes.text();
    console.error('[send-friend-notification] Expo push failed', expoRes.status, text);
    return new Response('Expo push failed', { status: 502 });
  }

  return new Response(JSON.stringify({ sent: messages.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
