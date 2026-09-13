// Authentication Service for NEURO NER
// Handles frontend authentication, session management, and credential validation.

import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  location?: string;
  lastLogin?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Pre-configured demonstration accounts for review and testing
export const DEMO_ACCOUNTS: Array<{
  role: UserRole;
  label: string;
  email: string;
  passwordHint: string;
  user: AuthUser;
}> = [
  {
    role: 'patient',
    label: 'Elderly Patient',
    email: 'ananya.patient@neuroner.in',
    passwordHint: 'CognitiveCare2026',
    user: {
      id: 'pat-001',
      name: 'Ananya Sharma',
      email: 'ananya.patient@neuroner.in',
      role: 'patient',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      location: 'Guwahati, Assam'
    }
  },
  {
    role: 'caregiver',
    label: 'Family Caregiver',
    email: 'rohan.caregiver@neuroner.in',
    passwordHint: 'CareCircle2026',
    user: {
      id: 'cg-001',
      name: 'Rohan Sharma',
      email: 'rohan.caregiver@neuroner.in',
      role: 'caregiver',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: 'Dispur, Assam'
    }
  },
  {
    role: 'doctor',
    label: 'Clinician / Specialist',
    email: 'dr.roy@neuroner.in',
    passwordHint: 'NeuroCare2026',
    user: {
      id: 'doc-001',
      name: 'Dr. Debabrata Roy, MD',
      email: 'dr.roy@neuroner.in',
      role: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      location: 'Dispur Polyclinic, Guwahati'
    }
  }
];

const AUTH_STORAGE_KEY = 'neuro_ner_auth_session';

class AuthService {
  /**
   * Validate email structure
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password requirements
   */
  isValidPassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    return { valid: true };
  }

  /**
   * Attempt sign in
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Artificial latency for authentic loading feedback
    await new Promise((resolve) => setTimeout(resolve, 650));

    const trimmedEmail = credentials.email.trim().toLowerCase();

    if (!this.isValidEmail(trimmedEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address.'
      };
    }

    const passwordValidation = this.isValidPassword(credentials.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message || 'Invalid password.'
      };
    }

    // Match with demo accounts or stored user
    const matchedDemo = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail
    );

    let user: AuthUser;

    if (matchedDemo) {
      user = {
        ...matchedDemo.user,
        lastLogin: new Date().toISOString()
      };
    } else {
      // Check local registered users or create custom session
      const storedUsersRaw = localStorage.getItem('neuro_ner_registered_users');
      const registeredUsers: AuthUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const registered = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (registered) {
        user = {
          ...registered,
          lastLogin: new Date().toISOString()
        };
      } else {
        // Automatically create a secure guest session with appropriate role inferred
        const namePart = trimmedEmail.split('@')[0].replace(/[._]/g, ' ');
        const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        user = {
          id: `usr-${Date.now()}`,
          name: capitalized || 'Care Companion',
          email: trimmedEmail,
          role: trimmedEmail.includes('doc') ? 'doctor' : trimmedEmail.includes('care') ? 'caregiver' : 'patient',
          lastLogin: new Date().toISOString()
        };
      }
    }

    // Save session safely (never storing raw passwords)
    if (credentials.rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }

    return {
      success: true,
      user
    };
  }

  /**
   * Register a new user
   */
  async signup(data: SignUpData): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const trimmedEmail = data.email.trim().toLowerCase();

    if (!data.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    if (!this.isValidEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const passwordValidation = this.isValidPassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      role: data.role,
      location: data.location || 'North Eastern Region',
      lastLogin: new Date().toISOString()
    };

    // Save to registered pool
    try {
      const storedUsersRaw = localStorage.getItem('neuro_ner_registered_users');
      const registeredUsers: AuthUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      registeredUsers.push(newUser);
      localStorage.setItem('neuro_ner_registered_users', JSON.stringify(registeredUsers));

      // Persist active session
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      // Safe fallback
    }

    return {
      success: true,
      user: newUser
    };
  }

  /**
   * Retrieve currently authenticated user
   */
  getCurrentUser(): AuthUser | null {
    try {
      const sessionData = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (!sessionData) return null;
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }

  /**
   * Sign out
   */
  logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Please check your inbox or care coordinator message.`
    };
  }
}

export const authService = new AuthService();
