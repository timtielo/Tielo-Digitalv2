import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase environment variables. Check your .env file.');
}

// Create Supabase client with retries and error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'tielo-digital'
    }
  },
  db: {
    schema: 'public'
  }
});

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    console.log('Supabase connection successful');
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
}

// Run connection test
testConnection();