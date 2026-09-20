import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface AuthLoadingSplashProps {
  message?: string;
}

export const AuthLoadingSplash: React.FC<AuthLoadingSplashProps> = ({ message }) => {
  const { t } = useAccessibility();

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ner-offwhite selection:bg-ner-terracotta selection:text-white"
      role="status"
      aria-live="polite"
      aria-label={message || t.loading || 'Loading...'}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-ner-terracotta/5 blur-3xl animate-pulse" />
      </div>

      {/* Branded 9-dot motif */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-ner-black text-white flex items-center justify-center p-3 shadow-xl relative group">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
          >
            <circle cx="3" cy="3" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="8" cy="3" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="13" cy="3" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="3" cy="8" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="8" cy="8" r="1.5" fill="#DE4A30" />
            <circle cx="13" cy="8" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="3" cy="13" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="8" cy="13" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="13" cy="13" r="1.5" fill="currentColor" opacity="0.85" />
          </svg>
        </div>

        {/* Wordmark and Tagline */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-ner-black uppercase">
              {t.appName ? t.appName.toUpperCase() : 'SMRITI CARE'}
            </span>
            <span className="font-mono text-xs text-ner-black/40 font-medium">
              (R)
            </span>
          </div>
          <p className="text-xs font-mono tracking-wider text-ner-black/50 uppercase">
            {message || 'INITIALIZING SECURE SESSION'}
          </p>
        </div>

        {/* Subtle breathing dots loading bar */}
        <div className="flex items-center gap-1.5 pt-2" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-ner-terracotta animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-ner-black/40 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-ner-black/20 animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};
