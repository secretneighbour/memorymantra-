// Real Supabase Authentication Service for NEURO NER
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserRole } from '../types';
import { Session, User } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  emailConfirmed: boolean;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthActionResult {
  success: boolean;
  user?: AppUser;
  error?: string;
  requiresEmailVerification?: boolean;
}

/**
 * Centralized Authentication Error Translator
 * Maps technical Supabase error codes & messages into clear, reassuring user feedback.
 * Never leaks access tokens, passwords, or internal DB schema errors.
 */
export function formatSupabaseAuthError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';

  const message = typeof error === 'string' ? error : error.message || '';
  const status = error.status;

  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'The email or password is incorrect. Please check your credentials.';
  }

  if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
    return 'Your email address has not been verified yet. Please check your inbox or request a new verification link.';
  }

  if (message.includes('User already registered') || message.includes('user_already_exists')) {
    return 'An account with this email address already exists. Try signing in instead.';
  }

  if (message.includes('Password should be at least 6 characters')) {
    return 'Password must be at least 6 characters long.';
  }

  if (
    message.includes('Token has expired') || 
    message.includes('otp_expired') ||
    message.includes('invalid_token') ||
    message.includes('Token is invalid')
  ) {
    return 'This verification link has expired or has already been used. Please request a fresh link.';
  }

  if (
    message.includes('over_email_send_rate_limit') ||
    message.includes('rate limit') ||
    status === 429
  ) {
    return 'Too many requests sent. Please wait a minute before requesting another email.';
  }

  if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('Network request failed')) {
    return 'Unable to reach the authentication service. Please verify your internet connection.';
  }

  // Return clean generic message if error looks internal or sensitive
  if (message.includes('JWT') || message.includes('Postgres') || message.includes('relation') || message.includes('column')) {
    return 'A service configuration error occurred. Please try again or contact support.';
  }

  return message;
}

export class SupabaseAuthService {
  /**
   * Convert Supabase User + Session into normalized AppUser
   */
  mapSupabaseUser(user: User | null): AppUser | null {
    if (!user) return null;

    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      name: metadata.name || user.email?.split('@')[0] || 'Care Member',
      email: user.email || '',
      role: (metadata.role as UserRole) || 'patient',
      location: metadata.location || 'North Eastern Region',
      emailConfirmed: Boolean(user.email_confirmed_at),
      avatarUrl: metadata.avatar_url,
      lastLogin: user.last_sign_in_at || new Date().toISOString()
    };
  }

  /**
   * Real Supabase Sign Up with Email Verification
   */
  async signUp(params: SignUpParams): Promise<AuthActionResult> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment settings.'
      };
    }

    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            name: params.name.trim(),
            role: params.role,
            location: params.location || 'North Eastern Region'
          },
          emailRedirectTo
        }
      });

      if (error) {
        return {
          success: false,
          error: formatSupabaseAuthError(error)
        };
      }

      // Check if user already exists (Supabase obfuscates this by returning empty identities if already registered)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in.'
        };
      }

      // If user requires email verification (email_confirmed_at is null and no active session)
      const isUnconfirmed = data.user && !data.user.email_confirmed_at && !data.session;
      const appUser = this.mapSupabaseUser(data.user);

      // Attempt to sync to public.profiles table if it exists
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: params.name.trim(),
            role: params.role,
            location: params.location || 'North Eastern Region',
            updated_at: new Date().toISOString()
          });
        } catch {
          // Graceful fallback if table not yet created
        }
      }

      return {
        success: true,
        user: appUser || undefined,
        requiresEmailVerification: Boolean(isUnconfirmed)
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatSupabaseAuthError(err)
      };
    }
  }

  /**
   * Real Supabase Sign In
   */
  async signIn(params: SignInParams): Promise<AuthActionResult> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in project settings.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim(),
        password: params.password
      });

      if (error) {
        const formatted = formatSupabaseAuthError(error);
        const isEmailNotConfirmed = error.message.includes('Email not confirmed');
        return {
          success: false,
          error: formatted,
          requiresEmailVerification: isEmailNotConfirmed
        };
      }

      const appUser = this.mapSupabaseUser(data.user);

      return {
        success: true,
        user: appUser || undefined
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatSupabaseAuthError(err)
      };
    }
  }

  /**
   * Resend Real Verification Email
   */
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase is not configured yet.'
      };
    }

    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo
        }
      });

      if (error) {
        return {
          success: false,
          message: formatSupabaseAuthError(error)
        };
      }

      return {
        success: true,
        message: 'A fresh verification link has been sent to your email.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: formatSupabaseAuthError(err)
      };
    }
  }

  /**
   * Password Reset Email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      };
    }

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo
      });

      if (error) {
        return {
          success: false,
          message: formatSupabaseAuthError(error)
        };
      }

      return {
        success: true,
        message: 'Password reset link has been dispatched to your email address.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: formatSupabaseAuthError(err)
      };
    }
  }

  /**
   * Update Password (used after clicking password reset email link)
   */
  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          message: formatSupabaseAuthError(error)
        };
      }

      return {
        success: true,
        message: 'Your password has been successfully updated.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: formatSupabaseAuthError(err)
      };
    }
  }

  /**
   * Real Supabase Sign Out
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore if network is down
    }
  }

  /**
   * Get Active Session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Listen to Auth State Changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const supabaseAuthService = new SupabaseAuthService();
