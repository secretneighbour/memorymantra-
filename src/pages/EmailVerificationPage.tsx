import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  Mail, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resendVerification, unverifiedEmail, user, isAuthenticated } = useAuth();
  const { t } = useAccessibility();

  const queryEmail = searchParams.get('email');
  const [email, setEmail] = useState<string>(queryEmail || unverifiedEmail || '');
  const [cooldown, setCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  // If already authenticated and verified, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.emailConfirmed) {
      if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'caregiver') navigate('/caregiver');
      else navigate('/patient');
    }
  }, [isAuthenticated, user, navigate]);

  // Cooldown timer tick
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    if (!email.trim()) {
      setResendStatus({
        type: 'error',
        message: 'Please provide a valid email address to receive the verification link.'
      });
      return;
    }

    setIsResending(true);
    setResendStatus(null);

    const result = await resendVerification(email.trim());
    setIsResending(false);

    if (result.success) {
      setResendStatus({
        type: 'success',
        message: 'A fresh verification email has been sent. Please check your inbox and spam folder.'
      });
      setCooldown(60); // 60s cooldown to prevent rate limiting
    } else {
      setResendStatus({
        type: 'error',
        message: result.message || 'Unable to send verification email. Please retry shortly.'
      });
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setCheckMessage(null);

    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email_confirmed_at) {
        setCheckMessage('Email confirmed! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/patient');
        }, 1200);
      } else {
        setCheckMessage('Email is not confirmed yet. Please click the link inside your email, then click refresh here.');
      }
    } catch {
      setCheckMessage('Please check your email and click the confirmation link.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-ner-sage/5 blur-3xl" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-ner-terracotta/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse"></span>
            <span>EMAIL CONFIRMATION</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black">
            Verify your email
          </h1>
          <p className="text-xs sm:text-sm text-ner-black/70 font-light mt-1 max-w-xs mx-auto">
            We've sent a verification link to your email address.
          </p>
        </div>

        {/* Card */}
        <div className="frost-white-intense rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ner-border/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold">
              [ Verification Pending ]
            </span>
            <TTSButton
              text="Verify your email. We have sent a verification link to your email address. Please open your email to activate your account."
              label="Listen"
              size="sm"
            />
          </div>

          {/* Animated Mail Icon Box */}
          <div className="text-center my-6">
            <div className="w-16 h-16 rounded-3xl bg-ner-black text-white flex items-center justify-center mx-auto shadow-md border border-white/20 relative group">
              <Mail className="w-8 h-8 text-ner-terracotta" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ner-sage border-2 border-white animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ner-sage border-2 border-white" />
            </div>

            {/* Email Address Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ner-border text-xs font-mono text-ner-black max-w-full truncate shadow-xs">
              <span className="text-ner-black/50">Sent to:</span>
              <strong className="font-bold truncate">{email || 'your registered email'}</strong>
            </div>
          </div>

          {/* Resend Status Feedback Banner */}
          {resendStatus && (
            <div 
              role="alert"
              className={`mb-5 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-fade-in ${
                resendStatus.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {resendStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{resendStatus.message}</span>
            </div>
          )}

          {/* Check verification status message */}
          {checkMessage && (
            <div 
              role="status"
              className="mb-5 p-3.5 rounded-2xl bg-ner-offwhite border border-ner-border text-xs text-ner-black flex items-start gap-2.5 animate-fade-in"
            >
              <RefreshCw className={`w-4 h-4 text-ner-calmBlue shrink-0 mt-0.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{checkMessage}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3 text-xs text-ner-black/75 leading-relaxed bg-ner-offwhite/80 p-4 rounded-2xl border border-ner-border/70 mb-5">
            <p className="font-semibold text-ner-black">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-ner-black/80">
              <li>Open your email application (check Spam/Junk if not in inbox).</li>
              <li>Click the verification link from <strong>SmritiCare / NEURO NER</strong>.</li>
              <li>Return here and click <strong>"I've verified my email"</strong> below.</li>
            </ol>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="space-y-2.5">
            {/* Action 1: Refresh / I've verified */}
            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking status...' : "I've verified my email"}</span>
            </button>

            {/* Action 2: Resend Verification Email with Cooldown */}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className={`w-full h-11 rounded-2xl border text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                cooldown > 0 || isResending
                  ? 'bg-ner-offwhite text-ner-black/40 border-ner-border cursor-not-allowed'
                  : 'bg-white text-ner-black border-ner-border hover:border-ner-black/60 shadow-xs'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-ner-terracotta" />
              <span>
                {isResending
                  ? 'Sending Link...'
                  : cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : 'Resend verification email'}
              </span>
            </button>
          </div>

          {/* Return to Login Option */}
          <div className="mt-6 pt-4 border-t border-ner-border/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-ner-black/70 hover:text-ner-terracotta transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Security Reassurance */}
        <div className="mt-6 text-center text-xs font-mono text-ner-black/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-ner-sage" />
          <span>Encrypted Email Security • Links expire automatically</span>
        </div>
      </div>
    </div>
  );
};
