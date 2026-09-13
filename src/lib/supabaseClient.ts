import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase credentials securely from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co')
  );
};

// Lazy or safe client initialization
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured()) {
      // Create fallback dummy URL client for development resilience so module loading never crashes
      supabaseInstance = createClient(
        supabaseUrl || 'https://placeholder-project.supabase.co',
        supabaseAnonKey || 'placeholder-anon-key',
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          }
        }
      );
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });
    }
  }

  return supabaseInstance;
};

export const supabase = getSupabaseClient();
