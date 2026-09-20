import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { UserRole, NERLanguage } from '../types';

/**
 * ----------------------------------------------------------------------------
 * 1. DATABASE SCHEMA & APPLICATION ENTITY TYPES
 * ----------------------------------------------------------------------------
 */

export interface ProfileRow {
  id: string;
  name: string;
  role: UserRole;
  location?: string | null;
  preferred_language?: NERLanguage | null;
  text_size?: string | null;
  contrast_mode?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ProfileInsert = {
  id: string;
  name: string;
  role: UserRole;
  location?: string | null;
  preferred_language?: NERLanguage | null;
  text_size?: string | null;
  contrast_mode?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export interface ReminderRow {
  id: string;
  user_id: string;
  title: string;
  time: string;
  category: string;
  dose_or_note?: string | null;
  completed: boolean;
  priority: 'high' | 'normal';
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ReminderInsert = {
  id?: string;
  user_id: string;
  title: string;
  time: string;
  category: string;
  dose_or_note?: string | null;
  completed?: boolean;
  priority?: 'high' | 'normal';
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ReminderUpdate = Partial<ReminderInsert>;

export interface WellbeingCheckinRow {
  id: string;
  user_id: string;
  mood: string;
  energy?: number | null;
  pain_level?: string | null;
  note?: string | null;
  created_at?: string;
}

export type WellbeingCheckinInsert = {
  id?: string;
  user_id: string;
  mood: string;
  energy?: number | null;
  pain_level?: string | null;
  note?: string | null;
  created_at?: string;
};

export interface DailyHealthCheckinRow {
  id?: string;
  patient_id: string;
  date_str: string;
  mood: string;
  energy_level: number;
  pain_level: string;
  sleep_quality: string;
  habits?: any;
  symptoms?: string[] | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DailyHealthCheckinInsert = DailyHealthCheckinRow;

export interface DailyGoalRow {
  id: string;
  user_id: string;
  date: string;
  title: string;
  current_progress: number;
  target_progress: number;
  completed: boolean;
  category: string;
  created_at?: string;
}

export type DailyGoalInsert = {
  id?: string;
  user_id: string;
  date: string;
  title: string;
  current_progress: number;
  target_progress: number;
  completed: boolean;
  category: string;
  created_at?: string;
};

export type DailyGoalUpdate = Partial<DailyGoalInsert>;

export interface MemoryVaultRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  person_or_place?: string | null;
  date_or_year?: string | null;
  image_url?: string | null;
  story_text?: string | null;
  song_title?: string | null;
  pinned: boolean;
  created_at?: string;
}

export type MemoryVaultInsert = {
  id?: string;
  user_id: string;
  title: string;
  category: string;
  person_or_place?: string | null;
  date_or_year?: string | null;
  image_url?: string | null;
  story_text?: string | null;
  song_title?: string | null;
  pinned?: boolean;
  created_at?: string;
};

export type MemoryVaultUpdate = Partial<MemoryVaultInsert>;

export interface ActivityLogRow {
  id: string;
  user_id: string;
  game_type: string;
  title: string;
  score: number;
  accuracy: number;
  duration_minutes: number;
  response_time_seconds: number;
  created_at?: string;
}

export type ActivityLogInsert = {
  id?: string;
  user_id: string;
  game_type: string;
  title: string;
  score: number;
  accuracy: number;
  duration_minutes: number;
  response_time_seconds: number;
  created_at?: string;
};

/**
 * ----------------------------------------------------------------------------
 * 2. CLIENT CONFIGURATION & INITIALIZATION
 * ----------------------------------------------------------------------------
 */

import { supabase, isSupabaseConfigured, getEnv } from './supabaseClient';
export { supabase, isSupabaseConfigured };

export const getSupabaseClient = (): SupabaseClient => supabase;

/**
 * ----------------------------------------------------------------------------
 * 3. APPLICATION USER MODEL & AUTH ERROR TRANSLATION
 * ----------------------------------------------------------------------------
 */

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
  rememberMe?: boolean;
}

export interface AuthActionResult {
  success: boolean;
  user?: AppUser;
  error?: string;
  requiresEmailVerification?: boolean;
}

export function formatSupabaseAuthError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';
  if (typeof error === 'string') return error;
  return error.message || error.error_description || 'An unexpected authentication error occurred.';
}

export function mapSupabaseUser(user: User | null, profileData?: Partial<ProfileRow> | null): AppUser | null {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const roleCandidate = (profileData?.role || metadata.role) as UserRole;
  
  const validRoles: UserRole[] = ['patient', 'caregiver', 'doctor'];
  const assignedRole: UserRole = validRoles.includes(roleCandidate) ? roleCandidate : 'patient';

  return {
    id: user.id,
    name: profileData?.name || metadata.name || user.email?.split('@')[0] || 'Care Member',
    email: user.email || '',
    role: assignedRole,
    location: profileData?.location || metadata.location || 'North Eastern Region',
    emailConfirmed: Boolean(user.email_confirmed_at || user.confirmed_at),
    avatarUrl: (profileData?.avatar_url || metadata.avatar_url) ?? undefined,
    lastLogin: user.last_sign_in_at || new Date().toISOString(),
  };
}

/**
 * ----------------------------------------------------------------------------
 * 4. SECURE AUTHENTICATION SERVICE LAYER
 * ----------------------------------------------------------------------------
 */

export const authServiceLayer = {
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return null;
      return data.session;
    } catch {
      return null;
    }
  },

  async getCurrentUser(): Promise<AppUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      let profile: ProfileRow | null = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        profile = data as ProfileRow | null;
      } catch {
        // Fallback
      }

      return mapSupabaseUser(user, profile);
    } catch {
      return null;
    }
  },

  async signIn(params: SignInParams): Promise<AuthActionResult> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim().toLowerCase(),
        password: params.password,
      });

      if (error) {
        const formatted = formatSupabaseAuthError(error);
        const isEmailNotConfirmed = 
          error.message?.includes('Email not confirmed') || 
          error.message?.includes('email_not_confirmed');

        return {
          success: false,
          error: formatted,
          requiresEmailVerification: isEmailNotConfirmed,
        };
      }

      let profileData: ProfileRow | null = null;
      if (data.user) {
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          profileData = prof as ProfileRow | null;
        } catch {
          // Fallback
        }
      }

      const appUser = mapSupabaseUser(data.user, profileData);

      return {
        success: true,
        user: appUser || undefined,
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatSupabaseAuthError(err),
      };
    }
  },

  async signUp(params: SignUpParams): Promise<AuthActionResult> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in project settings.',
      };
    }

    try {
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        return {
          success: false,
          error: formatSupabaseAuthError(error),
        };
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in.',
        };
      }

      const isConfirmed = Boolean(data.user?.email_confirmed_at || data.session);
      const requiresEmailVerification = !isConfirmed;
      const appUser = mapSupabaseUser(data.user);

      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: params.name.trim(),
            role: params.role,
            location: params.location?.trim() || 'North Eastern Region',
            email: params.email.trim().toLowerCase(),
          });
        } catch {
          // Fail softly
        }
      }

      return {
        success: true,
        user: appUser || undefined,
        requiresEmailVerification,
      };
    } catch (err: any) {
      return {
        success: false,
        error: formatSupabaseAuthError(err),
      };
    }
  },

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  },

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    try {
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo },
      });

      if (error) {
        return { success: false, message: formatSupabaseAuthError(error) };
      }

      return {
        success: true,
        message: 'A fresh verification link has been dispatched to your email address.',
      };
    } catch (err: any) {
      return { success: false, message: formatSupabaseAuthError(err) };
    }
  },

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase credentials missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    }

    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });

      if (error) {
        return { success: false, message: formatSupabaseAuthError(error) };
      }

      return {
        success: true,
        message: 'Password reset link has been dispatched to your email address.',
      };
    } catch (err: any) {
      return { success: false, message: formatSupabaseAuthError(err) };
    }
  },

  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        return { success: false, message: formatSupabaseAuthError(error) };
      }

      return {
        success: true,
        message: 'Your password has been successfully updated.',
      };
    } catch (err: any) {
      return { success: false, message: formatSupabaseAuthError(err) };
    }
  },

  async updateProfile(updates: { name?: string; role?: UserRole; location?: string; avatarUrl?: string }): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    try {
      const { data: authData, error: authErr } = await supabase.auth.updateUser({
        data: {
          ...(updates.name && { name: updates.name.trim() }),
          ...(updates.role && { role: updates.role }),
          ...(updates.location && { location: updates.location.trim() }),
          ...(updates.avatarUrl && { avatar_url: updates.avatarUrl }),
        },
      });

      if (authErr) {
        return { success: false, error: formatSupabaseAuthError(authErr) };
      }

      if (authData.user) {
        try {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            name: updates.name ? updates.name.trim() : authData.user.user_metadata?.name || 'Care Member',
            role: (updates.role || authData.user.user_metadata?.role || 'patient') as UserRole,
            location: updates.location ? updates.location.trim() : authData.user.user_metadata?.location || 'North Eastern Region',
            avatar_url: updates.avatarUrl || authData.user.user_metadata?.avatar_url || null,
          });
        } catch {
          // Fallback
        }
      }

      const mapped = mapSupabaseUser(authData.user);
      return { success: true, user: mapped || undefined };
    } catch (err: any) {
      return { success: false, error: formatSupabaseAuthError(err) };
    }
  },
};

/**
 * ----------------------------------------------------------------------------
 * 5. TYPED DATABASE QUERY SERVICE LAYER
 * ----------------------------------------------------------------------------
 */

export const dbServiceLayer = {
  async fetchProfile(userId: string): Promise<ProfileRow | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch warning:', error.message);
        return null;
      }
      return data as ProfileRow | null;
    } catch (err) {
      console.warn('Profile fetch exception:', err);
      return null;
    }
  },

  async upsertProfile(profile: ProfileInsert): Promise<ProfileRow | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile as any)
        .select()
        .single();

      if (error) {
        console.warn('Profile upsert warning:', error.message);
        return null;
      }
      return data as ProfileRow;
    } catch (err) {
      console.warn('Profile upsert exception:', err);
      return null;
    }
  },

  async fetchReminders(userId: string): Promise<ReminderRow[]> {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('time', { ascending: true });

      if (error) {
        console.warn('Reminders fetch warning:', error.message);
        return [];
      }
      return (data || []) as ReminderRow[];
    } catch (err) {
      console.warn('Reminders fetch exception:', err);
      return [];
    }
  },

  async createReminder(reminder: ReminderInsert): Promise<ReminderRow | null> {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert(reminder as any)
        .select()
        .single();

      if (error) {
        console.warn('Reminder insert warning:', error.message);
        return null;
      }
      return data as ReminderRow;
    } catch (err) {
      console.warn('Reminder insert exception:', err);
      return null;
    }
  },

  async updateReminder(id: string, updates: ReminderUpdate): Promise<ReminderRow | null> {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Reminder update warning:', error.message);
        return null;
      }
      return data as ReminderRow;
    } catch (err) {
      console.warn('Reminder update exception:', err);
      return null;
    }
  },

  async deleteReminder(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  async toggleReminderStatus(id: string, completed: boolean): Promise<ReminderRow | null> {
    return this.updateReminder(id, { completed, status: completed ? 'completed' : 'pending' });
  },

  async fetchWellbeingCheckins(userId: string, limit = 20): Promise<WellbeingCheckinRow[]> {
    try {
      const { data, error } = await supabase
        .from('wellbeing_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Wellbeing fetch warning:', error.message);
        return [];
      }
      return (data || []) as WellbeingCheckinRow[];
    } catch (err) {
      console.warn('Wellbeing fetch exception:', err);
      return [];
    }
  },

  async recordWellbeingCheckIn(checkin: WellbeingCheckinInsert): Promise<WellbeingCheckinRow | null> {
    try {
      const { data, error } = await supabase
        .from('wellbeing_checkins')
        .insert(checkin as any)
        .select()
        .single();

      if (error) {
        console.warn('Wellbeing checkin insert warning:', error.message);
        return null;
      }
      return data as WellbeingCheckinRow;
    } catch (err) {
      console.warn('Wellbeing checkin insert exception:', err);
      return null;
    }
  },

  async fetchDailyGoals(userId: string, dateStr?: string): Promise<DailyGoalRow[]> {
    try {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('date', targetDate);

      if (error) {
        console.warn('Daily goals fetch warning:', error.message);
        return [];
      }
      return (data || []) as DailyGoalRow[];
    } catch (err) {
      console.warn('Daily goals fetch exception:', err);
      return [];
    }
  },

  async updateDailyGoalProgress(id: string, progress: number, completed: boolean): Promise<DailyGoalRow | null> {
    try {
      const { data, error } = await supabase
        .from('daily_goals')
        .update({
          current_progress: progress,
          completed,
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Daily goal update warning:', error.message);
        return null;
      }
      return data as DailyGoalRow;
    } catch (err) {
      console.warn('Daily goal update exception:', err);
      return null;
    }
  },

  async fetchMemoryVaultItems(userId: string): Promise<MemoryVaultRow[]> {
    try {
      const { data, error } = await supabase
        .from('memory_vault')
        .select('*')
        .eq('user_id', userId)
        .order('pinned', { ascending: false });

      if (error) {
        console.warn('Memory vault fetch warning:', error.message);
        return [];
      }
      return (data || []) as MemoryVaultRow[];
    } catch (err) {
      console.warn('Memory vault fetch exception:', err);
      return [];
    }
  },

  async saveMemoryVaultItem(item: MemoryVaultInsert): Promise<MemoryVaultRow | null> {
    try {
      const { data, error } = await supabase
        .from('memory_vault')
        .insert(item as any)
        .select()
        .single();

      if (error) {
        console.warn('Memory vault insert warning:', error.message);
        return null;
      }
      return data as MemoryVaultRow;
    } catch (err) {
      console.warn('Memory vault insert exception:', err);
      return null;
    }
  },

  async deleteMemoryVaultItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('memory_vault')
        .delete()
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  async fetchRecentActivities(userId: string, limit = 10): Promise<ActivityLogRow[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Activity logs fetch warning:', error.message);
        return [];
      }
      return (data || []) as ActivityLogRow[];
    } catch (err) {
      console.warn('Activity logs fetch exception:', err);
      return [];
    }
  },

  async recordActivity(activity: ActivityLogInsert): Promise<ActivityLogRow | null> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert(activity as any)
        .select()
        .single();

      if (error) {
        console.warn('Activity log record warning:', error.message);
        return null;
      }
      return data as ActivityLogRow;
    } catch (err) {
      console.warn('Activity log record exception:', err);
      return null;
    }
  },
};
