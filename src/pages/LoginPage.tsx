import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { InteractiveCat } from '../components/InteractiveCat';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ShieldCheck,
  Send
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, error, clearError, fillDemoAccount, user } = useAuth();
  const { t } = useAccessibility();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Focus & interaction tracking for the living interactive cat
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isErrorActive, setIsErrorActive] = useState(false);

  // Validation & UI states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Clear previous errors when user edits
  useEffect(() => {
    if (error) clearError();
    if (requiresVerification) setRequiresVerification(false);
  }, [email, password]);

  // Activate concerned reaction if an authentication error occurs
  useEffect(() => {
    if (error && !requiresVerification) {
      setIsErrorActive(true);
      const timer = setTimeout(() => setIsErrorActive(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [error, requiresVerification]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmedEmail)) {
        setEmailError('Please enter a valid email format (e.g. name@domain.com).');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!isValid) {
      setIsErrorActive(true);
      setTimeout(() => setIsErrorActive(false), 2400);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    if (!validateForm()) return;

    const result = await signIn({
      email: email.trim(),
      password
    });

    if (result.success && result.user) {
      setIsSuccess(true);
      setSuccessMessage(`Welcome back, ${result.user.name}!`);

      // Short celebratory feedback under 1 second before navigating
      setTimeout(() => {
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('redirect');
        if (returnUrl) {
          navigate(returnUrl);
          return;
        }

        if (result.user?.role === 'doctor') {
          navigate('/doctor');
        } else if (result.user?.role === 'caregiver') {
          navigate('/caregiver');
        } else {
          navigate('/patient');
        }
      }, 950);
    } else if (result.requiresEmailVerification) {
      setRequiresVerification(true);
    } else {
      setIsErrorActive(true);
      setTimeout(() => setIsErrorActive(false), 2800);
    }
  };

  const handleSelectDemo = (role: 'patient' | 'caregiver' | 'doctor') => {
    clearError();
    setEmailError(null);
    setPasswordError(null);
    setRequiresVerification(false);
    const demoCreds = fillDemoAccount(role);
    setEmail(demoCreds.email);
    setPassword(demoCreds.password);
  };

  return (
    <div className="relative min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white overflow-hidden">
      
      {/* 1. BACKGROUND: SUBTLE AI AMBIENT GLOWS & NEURAL PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-ner-terracotta/5 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-ner-sage/5 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] rounded-full bg-ner-calmBlue/5 blur-3xl" />

        {/* Minimal dot-matrix concentric depth circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] rounded-full border border-ner-black/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full border border-ner-black/[0.04] pointer-events-none" />
      </div>

      {/* 2. MAIN AUTHENTICATION CONTAINER */}
      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in">
        
        {/* Card Header & Brand Identity */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm mb-2.5">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse"></span>
            <span>SMART COGNITIVE ASSISTANCE</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-1.5">
            {/* Authentic 9-dot matrix glyph SVG */}
            <div className="w-9 h-9 rounded-full bg-ner-black text-white flex items-center justify-center p-2 shadow-md">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3" cy="3" r="1.5" fill="currentColor" />
                <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                <circle cx="13" cy="3" r="1.5" fill="currentColor" />
                <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="#DE4A30" />
                <circle cx="13" cy="8" r="1.5" fill="currentColor" />
                <circle cx="3" cy="13" r="1.5" fill="currentColor" />
                <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                <circle cx="13" cy="13" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black">
              NEURO NER
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-ner-black/70 font-light max-w-xs mx-auto leading-relaxed">
            Your intelligent companion for everyday cognitive support.
          </p>
        </div>

        {/* 3. LIVING INTERACTIVE CAT (Physical, draggable, pettable visual creature) */}
        <div className="flex justify-center -mb-3 sm:-mb-4 relative z-20">
          <InteractiveCat 
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            passwordLength={password.length}
            showPassword={showPassword}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isErrorActive}
          />
        </div>

        {/* 4. MAIN LOGIN CARD */}
        <div className="frost-white-intense rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90 relative z-10 pt-7 sm:pt-8">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ner-border/60">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                [ Secure Authentication ]
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-ner-black">
                Sign in to your account
              </h2>
            </div>

            <TTSButton
              text="Welcome to Neuro NER. Please enter your email and password to sign into your cognitive care circle."
              label="Listen"
              size="sm"
            />
          </div>

          {/* Quick Demo Credentials Pill Selector */}
          <div className="mb-5 p-3 rounded-2xl bg-ner-offwhite/80 border border-ner-border/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ner-black/50 font-bold block mb-2 text-center">
              Quick 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectDemo('patient')}
                className="px-2 py-1.5 rounded-xl bg-white hover:bg-ner-black hover:text-white border border-ner-border text-[11px] font-mono font-bold transition-all text-ner-black shadow-xs active:scale-95 text-center truncate"
                title="Fill Elderly Patient Account"
              >
                👵 Patient
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemo('caregiver')}
                className="px-2 py-1.5 rounded-xl bg-white hover:bg-ner-black hover:text-white border border-ner-border text-[11px] font-mono font-bold transition-all text-ner-black shadow-xs active:scale-95 text-center truncate"
                title="Fill Family Caregiver Account"
              >
                👨‍👩‍👧 Caregiver
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemo('doctor')}
                className="px-2 py-1.5 rounded-xl bg-white hover:bg-ner-black hover:text-white border border-ner-border text-[11px] font-mono font-bold transition-all text-ner-black shadow-xs active:scale-95 text-center truncate"
                title="Fill Clinician Account"
              >
                🩺 Doctor
              </button>
            </div>
          </div>

          {/* Unverified Email Warning Banner */}
          {requiresVerification && (
            <div 
              role="alert"
              aria-live="polite"
              className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs animate-fade-in"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="font-bold block">Email Verification Required</strong>
                  <p className="mt-0.5 text-amber-800">
                    Your email address has not been verified yet. Please check your inbox for the confirmation link.
                  </p>
                  <div className="mt-2.5">
                    <Link
                      to={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-mono text-[11px] font-bold hover:bg-amber-700 transition-colors shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Verify Email / Resend Link</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && !requiresVerification && (
            <div 
              role="alert"
              aria-live="polite"
              className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Sign In Notice</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div 
              role="alert"
              aria-live="polite"
              className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Success</strong>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onFocus={() => {
                    setIsEmailFocused(true);
                    setIsPasswordFocused(false);
                  }}
                  onBlur={() => setIsEmailFocused(false)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  autoComplete="email"
                  placeholder="e.g. ananya@neuroner.in"
                  disabled={isLoading || isSuccess}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className={`w-full h-12 pl-10 pr-4 rounded-2xl bg-white border text-sm text-ner-black placeholder:text-ner-black/35 transition-all focus:outline-none ${
                    emailError 
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                      : 'border-ner-border focus:border-ner-black focus:ring-2 focus:ring-ner-black/10'
                  }`}
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-rose-600 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-mono text-ner-terracotta hover:underline focus:outline-none focus:ring-1 focus:ring-ner-terracotta rounded"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    setIsEmailFocused(false);
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  disabled={isLoading || isSuccess}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  className={`w-full h-12 pl-10 pr-11 rounded-2xl bg-white border text-sm text-ner-black placeholder:text-ner-black/35 transition-all focus:outline-none ${
                    passwordError 
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                      : 'border-ner-border focus:border-ner-black focus:ring-2 focus:ring-ner-black/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                  disabled={isLoading || isSuccess}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ner-black/40 hover:text-ner-black transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-ner-terracotta" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-xs text-rose-600 mt-1 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label 
                htmlFor="rememberMe" 
                className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-ner-black/75"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading || isSuccess}
                  className="w-4 h-4 rounded border-ner-border text-ner-black focus:ring-ner-black/20 focus:ring-2 cursor-pointer accent-ner-black"
                />
                <span>Remember this device</span>
              </label>

              <span className="text-[10px] font-mono text-ner-black/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-ner-sage" />
                <span>Secure Neural Auth</span>
              </span>
            </div>

            {/* Primary Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="signin-btn"
                disabled={isLoading || isSuccess}
                className={`w-full h-12 rounded-2xl font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isLoading || isSuccess
                    ? 'bg-ner-black/70 text-white/90 cursor-not-allowed'
                    : 'bg-ner-black text-white hover:bg-ner-black/85 hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-ner-sage" />
                    <span>Authenticated</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-ner-terracotta" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Section inside Card */}
          <div className="mt-5 pt-4 border-t border-ner-border/60 text-center">
            <p className="text-xs text-ner-black/70 font-normal">
              Don't have an active account yet?{' '}
              <Link
                to="/signup"
                className="font-bold text-ner-black hover:text-ner-terracotta underline font-mono ml-1"
              >
                Create Account
              </Link>
            </p>

            <div className="mt-3.5 flex items-center justify-center gap-4 text-[11px] text-ner-black/50 font-mono">
              <Link to="/verify-email" className="hover:underline text-ner-terracotta">
                Verify Email →
              </Link>
              <span>•</span>
              <Link to="/role-selection" className="hover:underline">
                Explore Demo Roles →
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-5 text-center text-xs font-mono text-ner-black/50">
          <span>Protected by 256-bit encryption & regional privacy standards.</span>
        </div>
      </div>
    </div>
  );
};
