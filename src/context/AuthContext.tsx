import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, 
  SignUpParams, 
  SignInParams, 
  AuthActionResult,
  authServiceLayer,
  isSupabaseConfigured,
  mapSupabaseUser,
  formatSupabaseAuthError
} from '../lib/supabase';
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
  updateUserProfile: (updates: { name?: string; location?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
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

  // 1. Initial Session Check & Live Auth State Listener
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        if (configured) {
          const session = await authServiceLayer.getSession();
          if (session?.user && isMounted) {
            const currentUser = await authServiceLayer.getCurrentUser();
            const resolvedUser = currentUser || mapSupabaseUser(session.user);
            setUser(resolvedUser);
            if (resolvedUser) setRole(resolvedUser.role);
          }
        } else {
          // In non-configured mode, check local storage for remembered session
          const localStored = localStorage.getItem('neuro_ner_sb_local_user');
          if (localStored && isMounted) {
            try {
              const parsed: AppUser = JSON.parse(localStored);
              setUser(parsed);
              setRole(parsed.role);
            } catch {
              localStorage.removeItem('neuro_ner_sb_local_user');
            }
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeSession();

    // 2. Real-time GoTrue auth state subscription
    const { data: authSubscription } = authServiceLayer.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const currentUser = await authServiceLayer.getCurrentUser();
        const resolvedUser = currentUser || mapSupabaseUser(session.user);
        setUser(resolvedUser);
        if (resolvedUser) setRole(resolvedUser.role);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('neuro_ner_sb_local_user');
      }
    });

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, [configured, setRole]);

  // 3. Sign Up
  const signUp = async (params: SignUpParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    if (configured) {
      const result = await authServiceLayer.signUp(params);
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
    } else {
      // Local development fallback
      await new Promise((r) => setTimeout(r, 600));
      const mockUser: AppUser = {
        id: `usr-${Date.now()}`,
        name: params.name.trim(),
        email: params.email.trim().toLowerCase(),
        role: params.role,
        location: params.location?.trim() || 'North Eastern Region',
        emailConfirmed: true,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('neuro_ner_sb_local_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setRole(mockUser.role);
      setIsLoading(false);

      return {
        success: true,
        user: mockUser,
        requiresEmailVerification: false
      };
    }
  };

  // 4. Sign In
  const signIn = async (params: SignInParams): Promise<AuthActionResult> => {
    setIsLoading(true);
    setError(null);

    if (configured) {
      const result = await authServiceLayer.signIn(params);

      if (!result.success) {
        // Auto-provision demo account in Supabase if matched and missing
        const matchedDemo = DEMO_ACCOUNTS.find(
          (d) => d.email.toLowerCase() === params.email.trim().toLowerCase()
        );

        if (matchedDemo && result.error?.includes('incorrect')) {
          const autoSignup = await authServiceLayer.signUp({
            name: matchedDemo.user.name,
            email: matchedDemo.email,
            password: params.password,
            role: matchedDemo.role,
            location: matchedDemo.user.location
          });

          if (autoSignup.success) {
            const retrySignIn = await authServiceLayer.signIn(params);
            if (retrySignIn.success && retrySignIn.user) {
              setIsLoading(false);
              setUser(retrySignIn.user);
              setRole(retrySignIn.user.role);
              setUnverifiedEmail(null);
              return retrySignIn;
            }
          }
        }

        setIsLoading(false);
        setError(result.error || 'Sign in failed');
        if (result.requiresEmailVerification) {
          setUnverifiedEmail(params.email.trim());
        }
        return result;
      }

      setIsLoading(false);
      if (result.user) {
        setUser(result.user);
        setRole(result.user.role);
        setUnverifiedEmail(null);
      }

      return result;
    } else {
      // Local development fallback
      await new Promise((r) => setTimeout(r, 500));
      const matchedDemo = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === params.email.trim().toLowerCase()
      );

      const namePart = params.email.split('@')[0].replace(/[._]/g, ' ');
      const fallbackName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const mockUser: AppUser = matchedDemo ? {
        id: matchedDemo.user.id,
        name: matchedDemo.user.name,
        email: matchedDemo.email,
        role: matchedDemo.role,
        location: matchedDemo.user.location,
        avatarUrl: matchedDemo.user.avatarUrl,
        emailConfirmed: true,
        lastLogin: new Date().toISOString()
      } : {
        id: `usr-${Date.now()}`,
        name: fallbackName || 'Care Member',
        email: params.email.trim().toLowerCase(),
        role: params.email.includes('doc') ? 'doctor' : params.email.includes('care') ? 'caregiver' : 'patient',
        location: 'North Eastern Region',
        emailConfirmed: true,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('neuro_ner_sb_local_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setRole(mockUser.role);
      setUnverifiedEmail(null);
      setIsLoading(false);

      return {
        success: true,
        user: mockUser
      };
    }
  };

  // 5. Sign Out
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    if (configured) {
      await authServiceLayer.signOut();
    }
    localStorage.removeItem('neuro_ner_sb_local_user');
    setUser(null);
    setIsLoading(false);
  };

  // 6. Resend Verification Email
  const resendVerification = async (email: string) => {
    if (configured) {
      return await authServiceLayer.resendVerificationEmail(email);
    } else {
      return {
        success: true,
        message: 'Verification link dispatched to your email address.'
      };
    }
  };

  // 7. Send Password Reset
  const sendPasswordReset = async (email: string) => {
    if (configured) {
      return await authServiceLayer.sendPasswordResetEmail(email);
    } else {
      return {
        success: true,
        message: `Password reset instructions have been dispatched to ${email}.`
      };
    }
  };

  // 8. Update Password
  const updatePassword = async (password: string) => {
    if (configured) {
      return await authServiceLayer.updatePassword(password);
    } else {
      return {
        success: true,
        message: 'Password updated successfully.'
      };
    }
  };

  // 9. Update User Profile
  const updateUserProfile = async (updates: { name?: string; location?: string; avatarUrl?: string }) => {
    if (!user) return { success: false, error: 'No active user session' };

    if (configured) {
      const res = await authServiceLayer.updateProfile({
        ...updates,
        role: user.role
      });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error };
    } else {
      const updatedUser: AppUser = {
        ...user,
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.location && { location: updates.location.trim() }),
        ...(updates.avatarUrl && { avatarUrl: updates.avatarUrl })
      };
      localStorage.setItem('neuro_ner_sb_local_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
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
