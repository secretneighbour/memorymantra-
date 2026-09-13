import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

export const Footer: React.FC = () => {
  const { language, t } = useAccessibility();

  // Custom dot-matrix arrow SVG inspired by Nothing footer
  const DotMatrixArrow = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
      <circle cx="4" cy="4" r="1.2" fill="currentColor" />
      <circle cx="4" cy="8" r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="8" r="1.2" fill="#DE4A30" />
      <circle cx="8" cy="6" r="1.2" fill="currentColor" />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );

  return (
    <footer className="footer relative z-10 flex min-h-[90vh] flex-col items-center justify-between bg-ner-black px-6 sm:px-12 pt-28 pb-12 text-white border-t border-white/10 select-none overflow-hidden">
      {/* Background dot matrix in footer */}
      <div className="absolute inset-0 dot-matrix-dark opacity-15 pointer-events-none" />

      {/* Main Centered Stack */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-14 py-8">
        
        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-white/60">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta"></span>
            <span>{t.appName.toUpperCase()} (R)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white/90">
            {t.tagline}
          </h2>
        </div>

        {/* Center Vertical Oversized Links */}
        <div className="flex flex-col items-center gap-5 sm:gap-6 text-lg sm:text-2xl font-light tracking-tight">
          <Link 
            to="/patient" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerCognitiveCare}
          </Link>
          <Link 
            to="/games" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerTherapeuticGames}
          </Link>
          <Link 
            to="/memory" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerMemoryCompanion}
          </Link>
          <Link 
            to="/progress" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerLongitudinalProgress}
          </Link>
          <Link 
            to="/caregiver" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerCareCircle}
          </Link>
          <Link 
            to="/doctor" 
            className="transition-all duration-200 text-white/80 hover:text-white hover:tracking-wide"
          >
            {t.footerClinicianRoster}
          </Link>
        </div>

        {/* Action Callout Pills */}
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <div 
            className="h-12 px-5 rounded-xl frost-white-low flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span>{t.footerSupportHotline}: 1800-889-2600</span>
            <DotMatrixArrow />
          </div>

          <Link
            to="/settings"
            className="h-12 px-5 rounded-xl frost-white-low hover:bg-white/15 transition-all duration-200 flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span>{t.footerRegionText}</span>
            <DotMatrixArrow />
          </Link>

          <Link
            to="/settings"
            className="h-12 px-5 rounded-xl frost-white-low hover:bg-white/15 transition-all duration-200 flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span>{t.footerLanguageLabel}: {language.toUpperCase()}</span>
            <DotMatrixArrow />
          </Link>

          <Link
            to="/login"
            className="h-12 px-5 rounded-xl frost-white-low hover:bg-white/15 transition-all duration-200 flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span>Account Sign In / Portal</span>
            <DotMatrixArrow />
          </Link>

          <div 
            className="h-12 px-5 rounded-xl frost-white-low flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-ner-terracotta"
          >
            <span>{t.sihBadge}</span>
            <DotMatrixArrow />
          </div>
        </div>
      </div>

      {/* Bottom Legal, Attribution & Navigation Bar */}
      <div className="relative z-10 flex w-full flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/10 text-xs text-white/40 font-mono">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-white/60">{t.footerCopyright}</span>
          <Link to="/settings" className="hover:text-white transition-colors">{t.footerAccessibility}</Link>
          <span className="hover:text-white transition-colors cursor-default">
            {t.footerPrivacy}
          </span>
          <span className="hover:text-white transition-colors cursor-default">
            {t.footerTerms}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-white/50">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-ner-sage"></span>
            {t.footerSimulationNotice}
          </span>
        </div>
      </div>
    </footer>
  );
};
