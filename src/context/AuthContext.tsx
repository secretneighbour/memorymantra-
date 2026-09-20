import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, 
  SignUpParams, 
  SignInParams, 
  AuthActionResult,
  supabase,
  isSupabaseConfigured,
  mapSupabaseUser
} from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useRole } from './RoleContext';
import { DEMO_ACCOUNTS, AuthCredentials } from '../services/authService';

export interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  unverifiedEmail: string | null;
  isConfigured: boolean;
  signUp: (params: SignUpParams) => Promise<AuthActionResult>;
  signIn: (params: SignInParams) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (updates: { name?: string; location?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  fillDemoAccount: (role: 'patient' | 'caregiver' | 'doctor') => AuthCredentials;
  clearError: () => void;
  setUnverifiedEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRole } = useRole();
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  // 1. Initial Session Check & Global onAuthStateChange Listener
  useEffect(() => {
    let isMounted = true;

    // Direct getSession from Supabase Auth v2
    supabase.auth.getSession().then(({ data: { session: initSession }, error: sessionError }) => {
      if (sessionError) {
        console.warn('Initial Supabase session fetch warning:', sessionError.message);
      }
      if (isMounted) {
        setSession(initSession);
        if (initSession?.user) {
          const resolvedUser = mapSupabaseUser(initSession.user);
          setUser(resolvedUser);
          if (resolvedUser) setRole(resolvedUser.role);
        }
        setIsLoading(false);
      }
    }).catch((err) => {
      console.warn('Session retrieval exception:', err);
      if (isMounted) setIsLoading(false);
    });

    // Global real-time auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      if (currentSession?.user) {
        const resolvedUser = mapSupabaseUser(currentSession.user);
        setUser(resolvedUser);
        if (resolvedUser) setRole(resolvedUser.role);
      } else if (event === 'SIGNED_OUT' || !currentSession) {
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setRole]);

  // 2. Sign Up: Direct supabase.auth.signUp call
  const signUp = async (params: SignUpParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            name: params.name.trim(),
            role: params.role,
            location: params.location?.trim() || 'North Eastern Region',
          },
          emailRedirectTo,
        },
      });

      if (signUpError) {
        setIsLoading(false);
        setError(signUpError.message);
        return {
          success: false,
          error: signUpError.message,
        };
      }

      // Check if email confirmation is required (in v2: data.session is null when email confirmation is enabled)
      const requiresEmailVerification = !data.session;
      if (requiresEmailVerification) {
        setUnverifiedEmail(params.email.trim());
      }

      const appUser = data.user ? mapSupabaseUser(data.user) : null;
      if (appUser && data.session) {
        setUser(appUser);
        setRole(appUser.role);
      }

      setIsLoading(false);
      return {
        success: true,
        user: appUser || undefined,
        requiresEmailVerification,
      };
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || 'An unexpected error occurred during sign up.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // 3. Sign In: Direct supabase.auth.signInWithPassword call
  const signIn = async (params: SignInParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: params.email.trim().toLowerCase(),
        password: params.password,
      });

      if (signInError) {
        setIsLoading(false);
        setError(signInError.message);
        const isEmailNotConfirmed = signInError.message.toLowerCase().includes('email not confirmed');
        if (isEmailNotConfirmed) {
          setUnverifiedEmail(params.email.trim());
        }
        return {
          success: false,
          error: signInError.message,
          requiresEmailVerification: isEmailNotConfirmed,
        };
      }

      const appUser = data.user ? mapSupabaseUser(data.user) : null;
      if (appUser) {
        setUser(appUser);
        setRole(appUser.role);
        setUnverifiedEmail(null);
      }

      setIsLoading(false);
      return {
        success: true,
        user: appUser || undefined,
      };
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || 'An unexpected error occurred during sign in.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // 4. Sign Out: Direct supabase.auth.signOut call
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsLoading(false);
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  };

  // 5. Resend Verification Email: Direct supabase.auth.resend call
  const resendVerification = async (email: string) => {
    try {
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo },
      });

      if (resendError) {
        return { success: false, message: resendError.message };
      }

      return {
        success: true,
        message: 'Verification link dispatched to your email address.',
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to resend verification email.' };
    }
  };

  // 6. Send Password Reset: Direct supabase.auth.resetPasswordForEmail call
  const sendPasswordReset = async (email: string) => {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });

      if (resetError) {
        return { success: false, message: resetError.message };
      }

      return {
        success: true,
        message: `Password reset instructions have been dispatched to ${email}.`,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to send password reset email.' };
    }
  };

  // 7. Update Password: Direct supabase.auth.updateUser call
  const updatePassword = async (password: string) => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        return { success: false, message: updateError.message };
      }

      return {
        success: true,
        message: 'Password updated successfully.',
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to update password.' };
    }
  };

  // 8. Update User Profile: Direct supabase.auth.updateUser call
  const updateUserProfile = async (updates: { name?: string; location?: string; avatarUrl?: string }) => {
    if (!user) return { success: false, error: 'No active user session' };

    try {
      const { data: authData, error: updateError } = await supabase.auth.updateUser({
        data: {
          ...(updates.name && { name: updates.name.trim() }),
          ...(updates.location && { location: updates.location.trim() }),
          ...(updates.avatarUrl && { avatar_url: updates.avatarUrl }),
        },
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      if (authData.user) {
        const updated = mapSupabaseUser(authData.user);
        if (updated) setUser(updated);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile.' };
    }
  };

  // 10. Preset Quick-fill helper for review
  const fillDemoAccount = (targetRole: 'patient' | 'caregiver' | 'doctor'): AuthCredentials => {
    const matched = DEMO_ACCOUNTS.find((a) => a.role === targetRole) || DEMO_ACCOUNTS[0];
    return {
      email: matched.email,
      password: matched.passwordHint,
      rememberMe: true
    };
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: isLoading,
        isLoading,
        isAuthenticated: !!user || !!session,
        error,
        unverifiedEmail,
        isConfigured: configured,
        signUp,
        signIn,
        signOut,
        resendVerification,
        sendPasswordReset,
        updatePassword,
        updateUserProfile,
        fillDemoAccount,
        clearError,
        setUnverifiedEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface CurrentUser {
  name: string;
  role: string;
  email?: string;
  isAuthenticated: boolean;
}

/**
 * Central state hook for user identity:
 * - Returns user.name if signed in.
 * - Automatically falls back to "Visitor" placeholder when not signed in.
 * - Allows plugging in real auth later with zero UI refactoring.
 */
export const useCurrentUser = (): {
  currentUser: CurrentUser;
  displayName: string;
  isAuthenticated: boolean;
} => {
  const { user, isAuthenticated } = useAuth();
  const displayName = isAuthenticated && user?.name?.trim() ? user.name : 'Visitor';
  const currentUser: CurrentUser = {
    name: displayName,
    role: isAuthenticated && user?.role ? user.role : 'Guest',
    email: user?.email || '',
    isAuthenticated,
  };
  return { currentUser, displayName, isAuthenticated };
};

