import { createClient } from '@supabase/supabase-js';
import { getSupabasePublishableKey, getSupabaseUrl } from './env';

export function createSupabaseBrowserClient() {
  return createClient(getSupabaseUrl(), getSupabasePublishableKey());
}
