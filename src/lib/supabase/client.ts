import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Auth features will be disabled.');
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    const client = getSupabaseClient();
    if (!client) {
      return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
    }
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});