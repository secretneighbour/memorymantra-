// Real Supabase Authentication Service for NEURO NER
import { 
  supabase, 
  isSupabaseConfigured, 
  authServiceLayer, 
  dbServiceLayer,
  formatSupabaseAuthError,
  mapSupabaseUser,
  AppUser,
  SignUpParams,
  SignInParams,
  AuthActionResult,
  ProfileRow,
  ProfileInsert,
  ProfileUpdate
} from '../lib/supabase';
import { UserRole } from '../types';
import { Session, User } from '@supabase/supabase-js';

export { 
  formatSupabaseAuthError,
  mapSupabaseUser,
  authServiceLayer,
  dbServiceLayer
};
export type {
  AppUser,
  SignUpParams,
  SignInParams,
  AuthActionResult,
  ProfileRow,
  ProfileInsert,
  ProfileUpdate
};

export class SupabaseAuthService {
  mapSupabaseUser(user: User | null, profileData?: any): AppUser | null {
    return mapSupabaseUser(user, profileData);
  }

  async signUp(params: SignUpParams): Promise<AuthActionResult> {
    return authServiceLayer.signUp(params);
  }

  async signIn(params: SignInParams): Promise<AuthActionResult> {
    return authServiceLayer.signIn(params);
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    return authServiceLayer.resendVerificationEmail(email);
  }

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    return authServiceLayer.sendPasswordResetEmail(email);
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    return authServiceLayer.updatePassword(newPassword);
  }

  async updateProfile(updates: { name?: string; role?: UserRole; location?: string; avatarUrl?: string }): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    return authServiceLayer.updateProfile(updates);
  }

  async signOut(): Promise<void> {
    return authServiceLayer.signOut();
  }

  async getSession(): Promise<Session | null> {
    return authServiceLayer.getSession();
  }

  onAuthStateChange(callback: (event: any, session: Session | null) => void) {
    return authServiceLayer.onAuthStateChange(callback);
  }
}

export const supabaseAuthService = new SupabaseAuthService();

