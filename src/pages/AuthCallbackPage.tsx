import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { formatSupabaseAuthError } from '../services/supabaseAuthService';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        // Check for error parameters in URL (from Supabase redirects)
        const errorDescription = searchParams.get('error_description');
        const errorCode = searchParams.get('error_code');
        const type = searchParams.get('type');

        if (errorDescription || errorCode) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(
              errorDescription 
                ? formatSupabaseAuthError(errorDescription)
                : 'The verification link is invalid or has expired.'
            );
          }
          return;
        }

        // Check for PKCE 'code' query param
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage(formatSupabaseAuthError(error));
            }
            return;
          }
        }

        // Check for token_hash OTP verification
        const tokenHash = searchParams.get('token_hash');
        if (tokenHash) {
          const otpType = (type as any) || 'email';
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType
          });
          if (error) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage(formatSupabaseAuthError(error));
            }
            return;
          }
        }

        // Verify active session exists
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          // If hash fragment was passed (implicit grant), give client a moment to parse
          await new Promise((r) => setTimeout(r, 600));
          const retry = await supabase.auth.getSession();
          if (!retry.data.session) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage('Verification link could not be validated. Please request a fresh link.');
            }
            return;
          }
        }

        if (isMounted) {
          setStatus('success');
          setTimeout(() => {
            navigate('/patient');
          }, 1500);
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(formatSupabaseAuthError(err));
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white">
      <div className="w-full max-w-md mx-auto frost-white-intense rounded-3xl p-8 sm:p-10 shadow-2xl border border-ner-border/90 text-center animate-fade-in">
        
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-full bg-ner-black text-white flex items-center justify-center mx-auto mb-5 shadow-md">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-ner-offwhite border border-ner-border flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 text-ner-terracotta animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-ner-black">Verifying your email...</h1>
            <p className="text-xs text-ner-black/60 font-mono">
              Verifying secure authentication token...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-ner-sage flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-ner-black">Email Successfully Verified!</h1>
            <p className="text-xs text-ner-black/75">
              Your care account is now fully active. Redirecting you to your cognitive care space...
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/patient')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ner-black text-white text-xs font-mono font-bold tracking-wider hover:bg-ner-black/85 transition-all"
              >
                <span>Continue Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-ner-terracotta" />
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-ner-black">Verification Link Issue</h1>
            <p className="text-xs text-ner-black/75 leading-relaxed">
              {errorMessage || 'This verification link has expired or has already been used.'}
            </p>
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/verify-email"
                className="w-full py-2.5 px-4 rounded-2xl bg-ner-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-ner-black/85"
              >
                Request Fresh Verification Email
              </Link>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 rounded-2xl bg-white border border-ner-border text-ner-black text-xs font-mono font-bold hover:bg-ner-offwhite"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
