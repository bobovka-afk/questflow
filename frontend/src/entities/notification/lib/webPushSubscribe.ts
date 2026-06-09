import { api } from '@shared/api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

export type WebPushSupportStatus = 'supported' | 'insecure_context' | 'unsupported';

/** Why Web Push may be unavailable in this tab (HTTPS required except localhost). */
export function getWebPushSupportStatus(): WebPushSupportStatus {
  if (typeof window === 'undefined') return 'unsupported';
  if (!window.isSecureContext) return 'insecure_context';
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';
  return 'supported';
}

export function isWebPushSupported(): boolean {
  return getWebPushSupportStatus() === 'supported';
}

export type WebPushSubscribeResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'unsupported' | 'insecure_context' | 'no_vapid' | 'denied' | 'error';
      message?: string;
    };

export async function subscribeWebPush(accessToken: string): Promise<WebPushSubscribeResult> {
  const supportStatus = getWebPushSupportStatus();
  if (supportStatus === 'insecure_context') {
    return { ok: false, reason: 'insecure_context' };
  }
  if (supportStatus === 'unsupported') {
    return { ok: false, reason: 'unsupported' };
  }

  let publicKey: string | null = null;
  try {
    const res = await api<{ publicKey: string | null }>('/notifications/push/vapid-public-key', {
      method: 'GET',
      accessToken,
    });
    publicKey = res.publicKey;
  } catch (e) {
    return { ok: false, reason: 'error', message: String(e) };
  }

  if (!publicKey) {
    return { ok: false, reason: 'no_vapid' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));

    const json = sub.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      return { ok: false, reason: 'error', message: 'Invalid push subscription' };
    }

    await api('/notifications/push/subscribe', {
      method: 'POST',
      accessToken,
      json: {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      },
    });

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('qf_push_endpoint', json.endpoint);
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'error', message: String(e) };
  }
}

export async function unsubscribeWebPush(accessToken: string): Promise<void> {
  const endpoint =
    typeof localStorage !== 'undefined' ? localStorage.getItem('qf_push_endpoint') : null;

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      const ep = sub.endpoint;
      await sub.unsubscribe();
      if (accessToken && ep) {
        await api('/notifications/push/subscribe', {
          method: 'DELETE',
          accessToken,
          json: { endpoint: ep },
        }).catch(() => undefined);
      }
    }
  }

  if (endpoint && accessToken) {
    await api('/notifications/push/subscribe', {
      method: 'DELETE',
      accessToken,
      json: { endpoint },
    }).catch(() => undefined);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('qf_push_endpoint');
  }
}

export async function fetchVapidPublicKey(accessToken: string): Promise<string | null> {
  const res = await api<{ publicKey: string | null }>('/notifications/push/vapid-public-key', {
    method: 'GET',
    accessToken,
  });
  return res.publicKey;
}
