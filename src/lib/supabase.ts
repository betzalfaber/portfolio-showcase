import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

if (!isSupabaseConfigured) {
  console.info(
    '[Nexus Core] Supabase credentials not detected or using placeholder. Running in High-Fidelity Local / Mock Mode. To connect live Supabase PostgreSQL, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Fallback no-op proxy to prevent null-pointer crashes if unconfigured client is accessed directly
function createSafeFallbackClient(): SupabaseClient {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase unconfigured') }),
          signOut: async () => ({ error: null }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({
            eq: () => ({ single: async () => ({ data: null, error: null }), order: async () => ({ data: [], error: null }) }),
            order: async () => ({ data: [], error: null }),
            limit: () => ({ single: async () => ({ data: null, error: null }) }),
          }),
          insert: async () => ({ data: null, error: null }),
          update: async () => ({ data: null, error: null }),
          delete: () => ({ eq: async () => ({ error: null }) }),
          upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        });
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: async () => ({ data: null, error: new Error('Supabase storage unconfigured') }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
          }),
        };
      }
      return () => ({ data: null, error: null });
    },
  };
  return new Proxy({}, handler) as unknown as SupabaseClient;
}

// Initialized Supabase client instance (or safe fallback proxy if unconfigured)
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createSafeFallbackClient();
