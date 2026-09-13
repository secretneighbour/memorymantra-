import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, 
  SignUpParams, 
  SignInParams, 
  supabaseAuthService,
  AuthActionResult 
} from '../services/supabaseAuthService';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { useRole } from './RoleContext';
import { DEMO_ACCOUNTS, AuthCredentials } from '../services/authService';

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  unverifiedEmail: string | null;
  isConfigured: boolean;
  signUp: (params: SignUpParams) => Promise<AuthActionResult>;
  signIn: (params: SignInParams) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
  fillDemoAccount: (role: 'patient' | 'caregiver' | 'doctor') => AuthCredentials;
  clearError: () => void;
  setUnverifiedEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRole } = useRole();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  // 1. Initial Session Check & Auth State Subscription
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        // If Supabase is configured, fetch active Supabase session
        if (configured) {
          const session = await supabaseAuthService.getSession();
          if (session && session.user && isMounted) {
            const mappedUser = supabaseAuthService.mapSupabaseUser(session.user);
            setUser(mappedUser);
            if (mappedUser) setRole(mappedUser.role);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeAuth();

    // Subscribe to real-time auth changes (sign in, sign out, token refreshed)
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (configured) {
      const { data } = supabaseAuthService.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (session && session.user) {
          const mappedUser = supabaseAuthService.mapSupabaseUser(session.user);
          setUser(mappedUser);
          if (mappedUser) setRole(mappedUser.role);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [configured, setRole]);

  // 2. Real Sign Up
  const signUp = async (params: SignUpParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    const result = await supabaseAuthService.signUp(params);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed');
      return result;
    }

    if (result.requiresEmailVerification) {
      setUnverifiedEmail(params.email.trim());
    } else if (result.user) {
      setUser(result.user);
      setRole(result.user.role);
    }

    return result;
  };

  // 3. Real Sign In
  const signIn = async (params: SignInParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    const result = await supabaseAuthService.signIn(params);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Sign in failed');
      if (result.requiresEmailVerification) {
        setUnverifiedEmail(params.email.trim());
      }
      return result;
    }

    if (result.user) {
      setUser(result.user);
      setRole(result.user.role);
      setUnverifiedEmail(null);
    }

    return result;
  };

  // 4. Sign Out
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    await supabaseAuthService.signOut();
    setUser(null);
    setIsLoading(false);
  };

  // 5. Resend Verification Email
  const resendVerification = async (email: string) => {
    return await supabaseAuthService.resendVerificationEmail(email);
  };

  // 6. Password Reset Email
  const sendPasswordReset = async (email: string) => {
    return await supabaseAuthService.sendPasswordResetEmail(email);
  };

  // 7. Update Password
  const updatePassword = async (password: string) => {
    return await supabaseAuthService.updatePassword(password);
  };

  // 8. Demo Accounts for evaluation convenience
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
        isAuthenticated: !!user,
        isLoading,
        error,
        unverifiedEmail,
        isConfigured: configured,
        signUp,
        signIn,
        signOut,
        resendVerification,
        sendPasswordReset,
        updatePassword,
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
