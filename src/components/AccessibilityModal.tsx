import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../context/AccessibilityContext';
import { TextSize, NERLanguage } from '../types';
import { nerLanguages } from '../data/translations';
import { Link } from 'react-router-dom';
import { 
  X, 
  Sliders, 
  Type, 
  Eye, 
  Sparkles, 
  Globe, 
  Volume2, 
  Check, 
  RotateCcw,
  ExternalLink,
  Music,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

export const AccessibilityModal: React.FC = () => {
  const {
    isAccessibilityModalOpen,
    setIsAccessibilityModalOpen,
    theme,
    setTheme,
    simpleUIMode,
    setSimpleUIMode,
    textSize,
    setTextSize,
    motion: motionPreference,
    setMotion,
    contrast,
    setContrast,
    language,
    setLanguage,
    t,
    speechRate,
    setSpeechRate,
    speakText,
    playCalmingChime
  } = useAccessibility();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAccessibilityModalOpen) {
        setIsAccessibilityModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccessibilityModalOpen, setIsAccessibilityModalOpen]);

  // Track scroll position to guide elderly users if more settings exist below
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isAccessibilityModalOpen) return;

    const checkScrollState = () => {
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      setCanScrollMore(remaining > 24);
    };

    // Check after DOM update
    const timeout = setTimeout(checkScrollState, 100);
    el.addEventListener('scroll', checkScrollState);
    window.addEventListener('resize', checkScrollState);

    return () => {
      clearTimeout(timeout);
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [isAccessibilityModalOpen, simpleUIMode, textSize]);

  const currentLangMeta = nerLanguages.find((l) => l.code === language) || nerLanguages[0];

  const handleReset = () => {
    setTheme('light');
    setSimpleUIMode(false);
    setTextSize('normal');
    setMotion('full');
    setContrast('standard');
    setLanguage('en');
    setSpeechRate(0.88);
  };

  return (
    <AnimatePresence>
      {isAccessibilityModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionPreference === 'reduced' ? 0.001 : 0.18 }}
          className="modal-overlay z-[9999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-modal-title"
          onClick={() => setIsAccessibilityModalOpen(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: motionPreference === 'reduced' ? 0.001 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="modal-wrapper max-w-2xl max-h-[88vh] h-auto w-[95%] sm:w-full bg-white rounded-3xl border-2 border-ner-black/20 shadow-2xl flex flex-col overflow-hidden selection:bg-ner-terracotta selection:text-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
        {/* Fixed Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:px-8 sm:pt-6 sm:pb-4 border-b border-ner-border bg-white shrink-0 z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta text-xs font-mono font-bold tracking-wider uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.accessibilityEngine || 'ACCESSIBILITY & INCLUSION'}</span>
            </div>
            <h2 id="accessibility-modal-title" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-ner-black">
              {t.settingsHeading || 'Accessibility Preferences'}
            </h2>
            <p className="text-xs sm:text-sm text-ner-black/60 mt-0.5">
              {t.settingsSubheading || 'Customize your reading, visual contrast, language, and hearing experience.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors"
              title={t.btnResetDefaults || 'Reset Defaults'}
              aria-label={t.btnResetDefaults || 'Reset Defaults'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAccessibilityModalOpen(false)}
              className="p-2.5 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors"
              aria-label={t.close || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body with Visible High-Contrast Scrollbar */}
        <div 
          ref={scrollRef}
          className="accessibility-scrollbar flex-1 overflow-y-scroll p-5 sm:p-8 space-y-6 relative"
        >
          {/* Visual Scroll Helper Pill */}
          {canScrollMore && (
            <div className="sticky top-0 z-20 flex justify-center pb-2 pointer-events-none">
              <button
                type="button"
                onClick={() => {
                  scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' });
                }}
                className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-ner-black text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5 hover:bg-ner-terracotta transition-colors border border-white/20 active:scale-95"
              >
                <span>Scroll for more settings</span>
                <ChevronDown className="w-3.5 h-3.5 text-ner-terracotta" />
              </button>
            </div>
          )}

        {/* 0. DISPLAY THEME: LIGHT / DARK */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ner-offwhite border border-ner-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-ner-terracotta" />
              <h3 className="text-base font-bold text-ner-black">Display Theme</h3>
            </div>
            <span className="text-xs font-mono font-bold text-ner-terracotta uppercase">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <p className="text-xs text-ner-black/70 mb-4">
            Select between daylight off-white and battery-friendly premium charcoal dark mode.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all tactile-btn ${
                theme === 'light'
                  ? 'bg-white dark:bg-ner-terracotta border-ner-black dark:border-ner-terracotta text-ner-black dark:text-white shadow-md ring-2 ring-ner-black/5 dark:ring-ner-terracotta/20'
                  : 'bg-ner-offwhite/80 dark:bg-gray-800 border-ner-border dark:border-gray-700 text-ner-black/70 dark:text-white hover:border-ner-black/40 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${theme === 'light' ? 'bg-amber-100 text-amber-700 dark:bg-white/20 dark:text-white' : 'bg-ner-border/40 text-ner-black/50 dark:bg-gray-700 dark:text-gray-300'}`}>
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block text-ner-black dark:text-white">Light Mode</span>
                <span className="text-[10px] text-ner-black/50 dark:text-gray-300 font-mono">Daylight Offwhite</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all tactile-btn ${
                theme === 'dark'
                  ? 'bg-ner-terracotta border-ner-terracotta text-white shadow-md ring-2 ring-ner-terracotta/20'
                  : 'bg-white dark:bg-gray-800 border-ner-border dark:border-gray-700 text-ner-black/70 dark:text-white hover:border-ner-black/40 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-white/20 text-white' : 'bg-ner-border/40 text-ner-black/50 dark:bg-gray-700 dark:text-gray-300'}`}>
                <Moon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold block text-ner-black dark:text-white">Dark Mode</span>
                <span className="text-[10px] text-ner-black/50 dark:text-gray-300 font-mono">Charcoal & Red</span>
              </div>
            </button>
          </div>
        </div>

        {/* 1. SIMPLE UI MODE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ner-offwhite dark:bg-[#141418] border border-ner-border dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-ner-sage" />
              <h3 className="text-base font-bold text-ner-black dark:text-white">{t.simpleUIMode || 'Simple UI Mode'}</h3>
            </div>
            <p className="text-xs text-ner-black/70 dark:text-gray-300 max-w-md">
              {t.simpleUIDesc || 'Enables extra-large touch targets, simplified reading layout, and distraction-free navigation.'}
            </p>
          </div>
          <button
            onClick={() => setSimpleUIMode(!simpleUIMode)}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0 min-h-[44px] ${
              simpleUIMode 
                ? 'bg-ner-terracotta text-white shadow-xs' 
                : 'bg-ner-black text-white hover:bg-ner-black/85 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border dark:border-gray-700'
            }`}
          >
            {simpleUIMode ? `✓ ${t.simpleUIOn || 'Active'}` : (t.simpleUIOff || 'Enable Simple UI')}
          </button>
        </div>

        {/* 2. TEXT SIZE SCALING */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-ner-terracotta" />
            <h3 className="text-sm font-bold text-ner-black dark:text-white uppercase tracking-wider font-mono">
              {t.fontSize || 'Font Size Scaling'}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'small', label: t.textSizeSmall || 'Small' },
              { id: 'normal', label: t.fontSizeNormal || 'Normal' },
              { id: 'large', label: t.fontSizeLarge || 'Large' },
              { id: 'extra-large', label: t.fontSizeExtraLarge || 'Extra Large' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setTextSize(size.id as TextSize)}
                className={`py-3 px-3.5 rounded-xl border-2 text-center font-medium text-xs sm:text-sm transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
                  textSize === size.id
                    ? 'border-ner-black dark:border-ner-terracotta bg-white dark:bg-ner-terracotta shadow-xs font-bold text-ner-black dark:text-white ring-1 ring-ner-black/10'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite/50 dark:bg-gray-800 text-ner-black/70 dark:text-white hover:border-ner-black/40 dark:hover:bg-gray-700'
                }`}
              >
                <span>{size.label}</span>
                {textSize === size.id && <Check className="w-3.5 h-3.5 text-ner-terracotta dark:text-white" />}
              </button>
            ))}
          </div>
          {/* Live Preview */}
          <div className="p-3 rounded-xl bg-ner-offwhite dark:bg-[#141418] border border-ner-border dark:border-gray-800 text-center">
            <p className="text-xs sm:text-sm font-medium text-ner-black dark:text-white">
              "Smriti Care: Keeping every memory connected with calm typography."
            </p>
          </div>
        </div>

        {/* 3. HIGH CONTRAST & MOTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* High Contrast */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-ner-sage" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-ner-black dark:text-white">
                {t.contrast || 'Contrast Mode'}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setContrast('standard')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium min-h-[44px] transition ${
                  contrast === 'standard'
                    ? 'border-ner-black dark:border-ner-terracotta bg-white dark:bg-ner-terracotta font-bold text-ner-black dark:text-white shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 text-ner-black/70 dark:text-white dark:hover:bg-gray-700'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setContrast('high')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium min-h-[44px] transition ${
                  contrast === 'high'
                    ? 'border-ner-black dark:border-ner-terracotta bg-black dark:bg-ner-terracotta text-white font-bold shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 text-ner-black/70 dark:text-white dark:hover:bg-gray-700'
                }`}
              >
                High Contrast
              </button>
            </div>
          </div>

          {/* Motion Preference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ner-calmBlue" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-ner-black dark:text-white">
                Motion & Animations
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMotion('full')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium min-h-[44px] transition ${
                  motionPreference === 'full'
                    ? 'border-ner-black dark:border-ner-terracotta bg-white dark:bg-ner-terracotta font-bold text-ner-black dark:text-white shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 text-ner-black/70 dark:text-white dark:hover:bg-gray-700'
                }`}
              >
                Full Motion
              </button>
              <button
                onClick={() => setMotion('reduced')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium min-h-[44px] transition ${
                  motionPreference === 'reduced'
                    ? 'border-ner-black dark:border-ner-terracotta bg-white dark:bg-ner-terracotta font-bold text-ner-black dark:text-white shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 text-ner-black/70 dark:text-white dark:hover:bg-gray-700'
                }`}
              >
                Reduced Motion
              </button>
            </div>
          </div>
        </div>

        {/* 4. REGIONAL LANGUAGE SELECTION */}
        <div className="space-y-2 pt-2 border-t border-ner-border dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-ner-calmBlue" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-ner-black dark:text-white">
                {t.footerLanguageLabel || 'Regional Language (North East India)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-ner-terracotta font-bold">
              {currentLangMeta.native}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {nerLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between min-h-[44px] ${
                  language === lang.code
                    ? 'border-ner-black dark:border-ner-terracotta bg-ner-black dark:bg-ner-terracotta text-white font-bold shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-ner-black dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold">{lang.native}</span>
                  {language === lang.code && <Check className="w-3 h-3 text-ner-terracotta dark:text-white" />}
                </div>
                <span className={`text-[10px] ${language === lang.code ? 'text-white/70' : 'text-ner-black/50 dark:text-gray-300'}`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. VOICE ASSISTANCE & AUDIO SPEED */}
        <div className="space-y-2 pt-2 border-t border-ner-border dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-ner-terracotta" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-ner-black dark:text-white">
                Voice Assistant Narration Speed
              </h3>
            </div>
            <span className="text-[11px] font-mono text-ner-black/60 dark:text-gray-300 font-bold">
              {speechRate.toFixed(2)}x
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { rate: 0.75, label: 'Gentle (0.75x)' },
              { rate: 0.88, label: 'Standard (0.88x)' },
              { rate: 1.05, label: 'Faster (1.05x)' }
            ].map((s) => (
              <button
                key={s.rate}
                onClick={() => setSpeechRate(s.rate)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold min-h-[44px] transition ${
                  Math.abs(speechRate - s.rate) < 0.05
                    ? 'border-ner-black dark:border-ner-terracotta bg-white dark:bg-ner-terracotta text-ner-black dark:text-white shadow-xs'
                    : 'border-ner-border dark:border-gray-700 bg-ner-offwhite dark:bg-gray-800 text-ner-black/60 dark:text-white hover:bg-white dark:hover:bg-gray-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => speakText(`Hello, welcome to Smriti Care. This is a voice narration sample in ${currentLangMeta.name}.`, language)}
              className="px-4 py-2 rounded-xl bg-ner-terracotta text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-ner-terracotta/90 active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Voice Sample</span>
            </button>
            <button
              onClick={playCalmingChime}
              className="px-3 py-2 rounded-xl bg-ner-offwhite dark:bg-gray-800 border border-ner-border dark:border-gray-700 text-xs font-mono font-bold text-ner-black/80 dark:text-white hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span>Play Calming Chime</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Footer (Always Visible at Bottom) */}
      <div className="p-4 sm:px-8 sm:py-4 border-t border-ner-border bg-ner-offwhite/90 backdrop-blur-sm shrink-0 z-10 flex items-center justify-between gap-4">
          <Link
            to="/accessibility"
            onClick={() => setIsAccessibilityModalOpen(false)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ner-terracotta hover:underline"
          >
            <span>Open Full Accessibility Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsAccessibilityModalOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-ner-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-ner-black/85 shadow-xs min-h-[42px] tactile-btn"
          >
            {t.done || 'Done'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
