import { createClient } from '@supabase/supabase-js';
import { getSupabaseSecretKey, getSupabaseUrl } from './env';

/** Service-role client for server routes / actions only. */
export function createSupabaseServerClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
