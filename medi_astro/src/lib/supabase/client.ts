import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase no está configurado. Revisa las variables públicas.');
  }

  supabase = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  return supabase;
}
