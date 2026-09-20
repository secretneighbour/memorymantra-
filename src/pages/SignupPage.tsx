import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Stethoscope,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin
} from 'lucide-react';
import { UserRole } from '../types';

const NER_LOCATIONS = [
  'Guwahati, Assam',
  'Dispur, Assam',
  'Shillong, Meghalaya',
  'Imphal, Manipur',
  'Aizawl, Mizoram',
  'Kohima, Nagaland',
  'Agartala, Tripura',
  'Itanagar, Arunachal Pradesh',
  'Gangtok, Sikkim',
  'Other / Custom'
];

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError, isConfigured } = useAuth();
  const { t } = useAccessibility();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [location, setLocation] = useState('Guwahati, Assam');
  const [customLocation, setCustomLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field validation
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validate = (): boolean => {
    const errs: typeof formErrors = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailPattern.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLoading || isSuccess) return;
    setAuthError(null);
    clearError();

    if (!validate()) return;

    setIsSubmitting(true);
    const resolvedLocation = location === 'Other / Custom' ? customLocation.trim() || 'North Eastern Region' : location;

    try {
      // Direct call to standard Supabase Auth (v2) signUp
      const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role,
            location: resolvedLocation,
          },
          emailRedirectTo,
        },
      });

      if (signUpError) {
        setIsSubmitting(false);
        // Error handling: Catch and display error directly from Supabase response
        setAuthError(signUpError.message);
        return;
      }

      // Check if user already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setIsSubmitting(false);
        setAuthError('An account with this email address already exists. Please sign in instead.');
        return;
      }

      setIsSuccess(true);

      // In Supabase v2, if email confirmation is required, session is null
      const requiresEmailVerification = !data.session;
      if (requiresEmailVerification) {
        setStatusMessage('Account created! Please check your inbox to verify your email address.');
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        }, 1200);
      } else {
        setStatusMessage('Account created and verified! Preparing your care dashboard...');
        setTimeout(() => {
          if (role === 'doctor') navigate('/doctor');
          else if (role === 'caregiver') navigate('/caregiver');
          else navigate('/patient');
        }, 1000);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const errMsg = err?.message || 'An unexpected error occurred during registration.';
      setAuthError(errMsg);
    }
  };

  return (
    <div className="relative min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-ner-sage/5 blur-3xl" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-ner-terracotta/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-ner-sage animate-pulse"></span>
            <span>CREATE CARE ACCOUNT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black">
            Join the NEURO NER Care Circle
          </h1>
          <p className="text-xs sm:text-sm text-ner-black/70 font-light mt-1">
            Personalized cognitive assistance, family tracking, and clinical telemetry.
          </p>

          {/* Connection Pill */}
          <div className="mt-2.5 flex items-center justify-center">
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium shadow-xs">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span>Supabase Live Auth Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-medium shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Demo Mode Active • Add Supabase Keys for Live Auth</span>
              </span>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="frost-white-intense dark:bg-[#17171C] rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90 dark:border-gray-800">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ner-border/60 dark:border-gray-800">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                [ Registration • Secure Account ]
              </span>
              <h2 className="text-base sm:text-lg font-bold text-ner-black dark:text-white mt-0.5">
                New User Registration
              </h2>
            </div>
            <TTSButton
              text="Please fill out your details and choose whether you are an elderly patient, family caregiver, or healthcare clinician."
              label="Listen"
              size="sm"
            />
          </div>

          {(authError || error) && (
            <div role="alert" className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Registration Notice</strong>
                <span className="mt-0.5 block">{authError || error}</span>
              </div>
            </div>
          )}

          {isSuccess && (
            <div role="alert" className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5 animate-fade-in text-left">
              <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Success</strong>
                <span className="mt-0.5 block">{statusMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-2 text-left">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'patient'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm dark:bg-ner-terracotta dark:border-ner-terracotta dark:text-white'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <User className="w-4 h-4 text-ner-terracotta dark:text-white" />
                  <span className="text-xs font-bold font-mono">Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'caregiver'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm dark:bg-ner-terracotta dark:border-ner-terracotta dark:text-white'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4 text-ner-sage dark:text-white" />
                  <span className="text-xs font-bold font-mono">Caregiver</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'doctor'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm dark:bg-ner-terracotta dark:border-ner-terracotta dark:text-white'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-ner-calmBlue dark:text-white" />
                  <span className="text-xs font-bold font-mono">Doctor</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-1 text-left">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40 dark:text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  placeholder="e.g. Full Name"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-sm text-ner-black dark:text-white placeholder:text-ner-black/35 dark:placeholder:text-gray-500 focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-2 focus:ring-ner-black/10"
                />
              </div>
              {formErrors.name && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-1 text-left">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                  }}
                  placeholder="e.g. user@smriticare.in"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-sm text-ner-black dark:text-white placeholder:text-ner-black/35 dark:placeholder:text-gray-500 focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-2 focus:ring-ner-black/10"
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{formErrors.email}</span>
                </p>
              )}
            </div>

            {/* Regional Location in NER */}
            <div>
              <label htmlFor="signup-location" className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-1 text-left">
                Regional Location (NER)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  id="signup-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-sm text-ner-black dark:text-white focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-2 focus:ring-ner-black/10"
                >
                  {NER_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="dark:bg-[#141418] dark:text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              {location === 'Other / Custom' && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter your location (City, State)"
                  className="w-full h-10 mt-2 px-3.5 rounded-xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-xs text-ner-black dark:text-white placeholder:text-ner-black/35 dark:placeholder:text-gray-500 focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-1 focus:ring-ner-black/10"
                />
              )}
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-password" className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-1 text-left">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                    }}
                    placeholder="Min 6 chars"
                    className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-sm text-ner-black dark:text-white placeholder:text-ner-black/35 dark:placeholder:text-gray-500 focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-2 focus:ring-ner-black/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ner-black/40 dark:text-gray-400 hover:text-ner-black dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.password}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-mono font-bold text-ner-black dark:text-gray-200 uppercase tracking-wider mb-1 text-left">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: undefined });
                    }}
                    placeholder="Repeat password"
                    className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#141418] border border-ner-border dark:border-gray-700 text-sm text-ner-black dark:text-white placeholder:text-ner-black/35 dark:placeholder:text-gray-500 focus:outline-none focus:border-ner-black dark:focus:border-ner-terracotta focus:ring-2 focus:ring-ner-black/10"
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoading || isSuccess}
                className="w-full h-12 rounded-2xl bg-ner-black dark:bg-ner-terracotta text-white hover:bg-ner-black/85 dark:hover:bg-[#d43f25] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Verify</span>
                    <ArrowRight className="w-4 h-4 text-ner-sage" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-ner-border/60 text-center">
            <p className="text-xs text-ner-black/70 font-normal">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-ner-black hover:text-ner-terracotta underline font-mono ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-ner-black/50 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-ner-sage" />
          <span>Official Email Verification • 256-Bit Protection</span>
        </div>
      </div>
    </div>
  );
};

