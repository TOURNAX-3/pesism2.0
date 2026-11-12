/** Edge-safe (middleware) + Node (server actions). */

const COOKIE_NAME = 'tournax_admin';
const SESSION_PAYLOAD = 'tournax-admin-session';

export function adminCookieName() {
  return COOKIE_NAME;
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'tournax-dev';
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function expectedAdminToken(): Promise<string> {
  return hmacSha256Hex(sessionSecret(), SESSION_PAYLOAD);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function isValidAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await expectedAdminToken();
  return timingSafeEqual(cookieValue, expected);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'tournax-dev';
  if (password.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < password.length; i++) {
    out |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return out === 0;
}
