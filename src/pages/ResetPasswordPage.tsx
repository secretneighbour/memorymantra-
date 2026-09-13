import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { t } = useAccessibility();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await updatePassword(password);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen min-h-svh flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-8 selection:bg-ner-terracotta selection:text-white">
      <div className="w-full max-w-md mx-auto frost-white-intense rounded-3xl p-6 sm:p-9 shadow-2xl border border-ner-border/90 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ner-offwhite text-xs font-mono font-bold text-ner-black border border-ner-border mb-3">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta"></span>
            <span>SECURE PASSWORD RESET</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-ner-black">
            Create New Password
          </h1>
          <p className="text-xs text-ner-black/70 font-light mt-1">
            Choose a strong password to protect your cognitive care account.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-ner-sage flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-ner-black">Password Updated!</h2>
            <p className="text-xs text-ner-black/75">
              Your password has been successfully updated. Redirecting you to sign in...
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ner-black text-white text-xs font-mono font-bold tracking-wider"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-ner-terracotta" />
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

            <div>
              <label htmlFor="new-password" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full h-12 pl-10 pr-11 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ner-black/40 hover:text-ner-black"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block text-xs font-mono font-bold text-ner-black uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ner-black/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white border border-ner-border text-sm text-ner-black focus:outline-none focus:border-ner-black focus:ring-2 focus:ring-ner-black/10"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
