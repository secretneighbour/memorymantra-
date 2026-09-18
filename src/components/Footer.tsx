import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

export const Footer: React.FC = () => {
  const { language, t } = useAccessibility();

  // Localized regional pill labels for compact, single-line alignment
  const regionPillLabels: Record<string, string> = {
    en: 'REGION: NORTH EAST INDIA (8 STATES)',
    as: 'অঞ্চল: উত্তৰ-পূব ভাৰত (৮ খন ৰাজ্য)',
    bn: 'অঞ্চল: উত্তর-পূর্ব ভারত (৮টি রাজ্য)',
    hi: 'क्षेत्र: पूर्वोत्तर भारत (8 राज्य)',
    kha: 'THAIN: SHATEI LAM-MIHNGI (8 JYLLA)',
    lus: 'RAM BIAL: NORTH EAST INDIA (STATE 8)',
    mni: 'লমদম: অৱাং-নোংপোক ভারত (রাজ্য ৮)',
    nag: 'REGION: NORTH EAST INDIA (8 STATES)'
  };

  // Custom dot-matrix arrow SVG inspired by Nothing footer
  const DotMatrixArrow = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60 shrink-0">
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
    <footer className="footer relative z-10 flex flex-col items-center justify-between bg-ner-black px-6 sm:px-12 pt-20 pb-12 text-white border-t border-white/10 select-none overflow-hidden">
      {/* Background dot matrix in footer */}
      <div className="absolute inset-0 dot-matrix-dark opacity-15 pointer-events-none" />

      {/* Main Centered Stack */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-10 sm:gap-12 py-6">
        
        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-white/60">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta"></span>
            <span>{t.appName.toUpperCase()} (R)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white/90">
            {t.tagline}
          </h2>
        </div>

        {/* Center Responsive Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 max-w-3xl mx-auto text-sm sm:text-base font-light tracking-tight text-center">
          <Link 
            to="/patient" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerCognitiveCare}
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link 
            to="/games" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerTherapeuticGames}
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link 
            to="/memory" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerMemoryCompanion}
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link 
            to="/progress" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerLongitudinalProgress}
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link 
            to="/caregiver" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerCareCircle}
          </Link>
          <span className="text-white/20 hidden sm:inline">•</span>
          <Link 
            to="/doctor" 
            className="transition-all duration-200 text-white/70 hover:text-white hover:tracking-wide"
          >
            {t.footerClinicianRoster}
          </Link>
        </nav>

        {/* Action Callout Pills - Single line, consistent height and pristine alignment */}
        <div className="flex w-full max-w-lg flex-col gap-2 mx-auto">
          <div 
            className="h-12 px-5 rounded-xl frost-white-low flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span className="truncate">{t.footerSupportHotline} • 1800-889-2600</span>
            <DotMatrixArrow />
          </div>

          <Link
            to="/settings"
            className="h-12 px-5 rounded-xl frost-white-low hover:bg-white/15 transition-all duration-200 flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-white/90"
          >
            <span className="truncate">{regionPillLabels[language] || regionPillLabels.en}</span>
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
            <span>{t.navLogin}</span>
            <DotMatrixArrow />
          </Link>

          <div 
            className="h-12 px-5 rounded-xl frost-white-low flex w-full items-center justify-between text-xs font-mono uppercase tracking-wider text-ner-terracotta"
          >
            <span>{t.sihBadge}</span>
            <DotMatrixArrow />
          </div>
        </div>

        {/* Regional Dedication Notice - Centered, comfortable reading width */}
        <p className="text-center text-xs text-white/50 max-w-xl mx-auto font-normal leading-relaxed px-4">
          {t.footerRegionText}
        </p>
      </div>

      {/* Bottom Legal, Attribution & Navigation Bar */}
      <div className="relative z-10 flex w-full flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10 text-xs text-white/40 font-mono">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-center sm:text-left">
          <span className="text-white/60">{t.footerCopyright}</span>
          <Link to="/settings" className="hover:text-white transition-colors">{t.footerAccessibility}</Link>
          <span className="hover:text-white transition-colors cursor-default">
            {t.footerPrivacy}
          </span>
          <span className="hover:text-white transition-colors cursor-default">
            {t.footerTerms}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-white/50 text-center sm:text-right">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ner-sage"></span>
            {t.footerSimulationNotice}
          </span>
        </div>
      </div>
    </footer>
  );
};
