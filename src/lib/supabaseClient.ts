import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// Safe environment variable resolution across Vite (import.meta.env) and Next.js / Node (process.env)
export const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
    return String((import.meta as any).env[key]);
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return String(process.env[key] || '');
  }
  return '';
};

const supabaseUrl = (
  getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
  getEnv('VITE_SUPABASE_URL') ||
  ''
).trim();

const supabaseAnonKey = (
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnv('VITE_SUPABASE_ANON_KEY') ||
  getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  ''
).trim();

const sanitizedUrl = supabaseUrl.replace(/\/+$/, '');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    sanitizedUrl &&
    supabaseAnonKey &&
    !sanitizedUrl.includes('placeholder') &&
    (sanitizedUrl.startsWith('https://') || sanitizedUrl.startsWith('http://'))
  );
};

/**
 * Centralized Supabase Client:
 * Initialized once in this dedicated file using environment variables.
 * Do NOT re-initialize inside individual components.
 */
export const supabase: SupabaseClient = createClient(
  sanitizedUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key-development-mode',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'smriti_care_auth_token',
    },
    global: {
      headers: {
        'x-application-name': 'smriti-care-production-auth',
      },
    },
  }
);

export type { Session, User };
