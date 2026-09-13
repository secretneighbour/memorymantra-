import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError, isConfigured } = useAuth();
  const { t } = useAccessibility();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [location, setLocation] = useState('Guwahati, Assam');
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
    if (isLoading || isSuccess) return;
    clearError();

    if (!validate()) return;

    const result = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      location
    });

    if (result.success) {
      setIsSuccess(true);

      if (result.requiresEmailVerification) {
        setStatusMessage('Account created! A real verification link has been sent to your email.');
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        }, 1100);
      } else {
        setStatusMessage('Account created and verified! Preparing your care space...');
        setTimeout(() => {
          if (role === 'doctor') navigate('/doctor');
          else if (role === 'caregiver') navigate('/caregiver');
          else navigate('/patient');
        }, 1000);
      }
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
        </div>

        {/* Card */}
        <div className="frost-white-intense rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ner-border/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold">
              [ Registration • Secure Account ]
            </span>
            <TTSButton
              text="Please fill out your details and choose whether you are an elderly patient, family caregiver, or healthcare clinician."
              label="Listen"
              size="sm"
            />
          </div>

          {error && (
            <div role="alert" className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div role="alert" className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'patient'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40'
                  }`}
                >
                  <User className="w-4 h-4 text-ner-terracotta" />
                  <span className="text-xs font-bold font-mono">Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'caregiver'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40'
                  }`}
                >
                  <Users className="w-4 h-4 text-ner-sage" />
                  <span className="text-xs font-bold font-mono">Caregiver</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'doctor'
                      ? 'bg-ner-black text-white border-ner-black shadow-sm'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-ner-calmBlue" />
                  <span className="text-xs font-bold font-mono">Doctor</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                />
              </div>
              {formErrors.name && (
                <p className="text-xs text-rose-600 mt-1 font-mono">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya@neuroner.in"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-600 mt-1 font-mono">{formErrors.email}</p>
              )}
            </div>

            {/* Location (optional context for NER) */}
            <div>
              <label htmlFor="signup-location" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                Regional Location (NER)
              </label>
              <input
                id="signup-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Guwahati, Assam"
                className="w-full h-11 px-3.5 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-password" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full h-11 px-3.5 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ner-black/40 hover:text-ner-black"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-rose-600 mt-1 font-mono">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full h-11 px-3.5 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1 font-mono">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Sending Real Verification Email...</span>
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
