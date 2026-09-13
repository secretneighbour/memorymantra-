import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TextSize } from '../types';
import { 
  Type, 
  Eye, 
  Sparkles, 
  Globe, 
  Volume2, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { nerLanguages } from '../data/translations';

export const SettingsPage: React.FC = () => {
  const {
    textSize,
    setTextSize,
    motion,
    setMotion,
    contrast,
    setContrast,
    language,
    setLanguage,
    t,
    speakText,
    isSpeaking
  } = useAccessibility();

  const handleResetDefaults = () => {
    setTextSize('normal');
    setMotion('full');
    setContrast('standard');
    setLanguage('en');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
              {t.inclusivityBadge}
            </span>
            <span className="text-xs text-ner-black/40 font-mono">{t.accessibilityEngine}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.settingsHeading}
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            {t.settingsSubheading}
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="frost-card px-4 py-2 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-ner-black hover:bg-black/5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ner-terracotta" />
          <span>{t.btnResetDefaults}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TEXT SIZE                                                                 */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Type className="w-5 h-5 text-ner-terracotta" />
            <h2 className="text-xl font-bold text-ner-black">{t.fontSize}</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.fontSizeDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'normal', label: t.fontSizeNormal, note: t.fontSizeNormalNote },
              { id: 'large', label: t.fontSizeLarge, note: t.fontSizeLargeNote },
              { id: 'extra-large', label: t.fontSizeExtraLarge, note: t.fontSizeExtraLargeNote },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTextSize(opt.id as TextSize)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  textSize === opt.id
                    ? 'border-ner-black bg-white shadow-md ring-2 ring-ner-black/10'
                    : 'border-ner-border bg-white/60 hover:border-ner-black/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-ner-black">{opt.label}</span>
                  {textSize === opt.id && <Check className="w-4 h-4 text-ner-terracotta" />}
                </div>
                <p className="text-xs text-ner-black/60 mt-1">{opt.note}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTRAST MODE                                                             */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-ner-sage" />
            <h2 className="text-xl font-bold text-ner-black">{t.contrast}</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.contrastDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setContrast('standard')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                contrast === 'standard'
                  ? 'border-ner-black bg-white shadow-md'
                  : 'border-ner-border bg-white/60 hover:border-ner-black/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-ner-black">{t.contrastStandard}</span>
                {contrast === 'standard' && <Check className="w-4 h-4 text-ner-sage" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                {t.contrastStandardDesc}
              </p>
            </button>

            <button
              onClick={() => setContrast('high')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                contrast === 'high'
                  ? 'border-ner-terracotta bg-black text-white shadow-md'
                  : 'border-ner-border bg-black/90 text-white hover:border-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-white">{t.contrastHigh}</span>
                {contrast === 'high' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-white/70 mt-1">
                {t.contrastHighDesc}
              </p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOTION PREFERENCE                                                         */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-ner-warmAmber" />
            <h2 className="text-xl font-bold text-ner-black">{t.motion}</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.motionDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMotion('full')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                motion === 'full'
                  ? 'border-ner-black bg-white shadow-md'
                  : 'border-ner-border bg-white/60 hover:border-ner-black/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-ner-black">{t.motionFull}</span>
                {motion === 'full' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                {t.motionFullDesc}
              </p>
            </button>

            <button
              onClick={() => setMotion('reduced')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                motion === 'reduced'
                  ? 'border-ner-black bg-white shadow-md'
                  : 'border-ner-border bg-white/60 hover:border-ner-black/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-ner-black">{t.motionReduced}</span>
                {motion === 'reduced' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                {t.motionReducedDesc}
              </p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REGIONAL LANGUAGE SELECTOR (All 8 Languages)                              */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-ner-calmBlue" />
            <h2 className="text-xl font-bold text-ner-black">{t.languageSettingTitle}</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.languageSettingDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nerLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  language === lang.code
                    ? 'border-ner-black bg-white font-bold shadow-md'
                    : 'border-ner-border bg-white/60 hover:border-ner-black/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-ner-black">{lang.native}</span>
                  {language === lang.code && <Check className="w-4 h-4 text-ner-terracotta" />}
                </div>
                <span className="text-xs text-ner-black/50 font-normal">{lang.displayLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TEXT-TO-SPEECH (TTS) AUDIO DEMO                                           */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Volume2 className="w-5 h-5 text-ner-terracotta" />
            <h2 className="text-xl font-bold text-ner-black">{t.speechTestTitle}</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.speechTestDesc}
          </p>

          <div className="p-5 rounded-2xl bg-white border border-ner-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-ner-black/80 italic">
              {t.speechTestSample}
            </p>

            <button
              onClick={() => speakText(t.speechTestSample)}
              className="px-6 py-3 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm shrink-0"
            >
              <Volume2 className={`w-4 h-4 text-ner-terracotta ${isSpeaking ? 'animate-pulse' : ''}`} />
              <span>{t.btnTestAudioVoice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
