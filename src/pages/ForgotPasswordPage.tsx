import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { sendPasswordReset } = useAuth();
  const { t } = useAccessibility();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t.loginErrorEmail || 'Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await sendPasswordReset(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSubmitted(true);
      setMessage(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="relative min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-1/3 -left-24 w-96 h-96 rounded-full bg-ner-calmBlue/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta"></span>
            <span>{t.forgotPasswordBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black">
            {t.forgotPasswordTitle}
          </h1>
          <p className="text-xs sm:text-sm text-ner-black/70 font-light mt-1">
            {t.forgotPasswordSubtitle}
          </p>
        </div>

        <div className="frost-white-intense rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90">
          
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-ner-border/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold">
              [ {t.forgotPasswordBadge} ]
            </span>
            <TTSButton
              text={`${t.forgotPasswordTitle}. ${t.forgotPasswordAudioPrompt}`}
              label="Listen"
              size="sm"
            />
          </div>

          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-ner-sage flex items-center justify-center mx-auto border border-ner-sage/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-ner-black">{t.loginVerifyEmailBtn}</h2>
              <p className="text-xs text-ner-black/75 leading-relaxed">
                {message}
              </p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.forgotPasswordBack}</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-ner-black/75 leading-relaxed">
                {t.forgotPasswordSubtitle}
              </p>

              <div>
                <label htmlFor="forgot-email" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1.5">
                  {t.loginEmailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.loginEmailPlaceholder}
                    className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? t.loginBtnSigning : t.forgotPasswordBtn}
                </button>
              </div>

              <div className="pt-3 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ner-black hover:text-ner-terracotta"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.forgotPasswordBack}</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-xs font-mono text-ner-black/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-ner-sage" />
          <span>{t.loginSecurityNotice}</span>
        </div>
      </div>
    </div>
  );
};
