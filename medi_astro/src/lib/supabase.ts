import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!url || !key) {
  console.warn('[Supabase] Variables de entorno no configuradas.');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});
