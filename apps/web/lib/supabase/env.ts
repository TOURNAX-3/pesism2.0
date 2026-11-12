function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl() {
  return required('NEXT_PUBLIC_SUPABASE_URL');
}

/** Supabase publishable (anon) key — safe for browser when RLS is on. */
export function getSupabasePublishableKey() {
  return required('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}

/** Server-only secret key — never expose to the browser. */
export function getSupabaseSecretKey() {
  return required('SUPABASE_SECRET_KEY');
}

export function getSupabaseJwksUrl() {
  return process.env.SUPABASE_JWKS_URL;
}
