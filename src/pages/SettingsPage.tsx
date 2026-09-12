import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TextSize, MotionPreference, ContrastMode, NERLanguage } from '../types';
import { TTSButton } from '../components/TTSButton';
import { 
  Sliders, 
  Type, 
  Eye, 
  Sparkles, 
  Globe, 
  Volume2, 
  Check, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

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

  const languageOptions: { code: NERLanguage; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mni', name: 'Meitei (Manipuri)', native: 'মৈতৈলোন্' },
    { code: 'kha', name: 'Khasi (Meghalaya)', native: 'Ka Ktien Khasi' },
    { code: 'lus', name: 'Mizo (Mizoram)', native: 'Mizo ṭawng' },
    { code: 'nag', name: 'Nagamese (Nagaland)', native: 'Nagamese' },
  ];

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
              Inclusivity & Comfort
            </span>
            <span className="text-xs text-ner-black/40 font-mono">Accessibility Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Accessibility Settings
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            Adjust visual contrast, font scaling, and regional languages for maximum ease of use.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="frost-card px-4 py-2 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-ner-black hover:bg-black/5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ner-terracotta" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TEXT SIZE (Normal, Large, Extra Large)                                    */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Type className="w-5 h-5 text-ner-terracotta" />
            <h2 className="text-xl font-bold text-ner-black">Text Size</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Enlarge typography across patient cards, exercises, and buttons.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'normal', label: 'Normal', note: 'Default 16px-18px readable scale' },
              { id: 'large', label: 'Large', note: '112% scaled for easier reading' },
              { id: 'extra-large', label: 'Extra Large', note: '125% scaled high-visibility targets' },
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
        {/* CONTRAST MODE (Standard vs High Contrast)                                 */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-ner-sage" />
            <h2 className="text-xl font-bold text-ner-black">Contrast Mode</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Optimize readability for elders with mild visual impairments or cataracts.
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
                <span className="font-bold text-base text-ner-black">Standard Soft Palette</span>
                {contrast === 'standard' && <Check className="w-4 h-4 text-ner-sage" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                Calming minimalist tones inspired by Nothing off-white & charcoal.
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
                <span className="font-bold text-base text-white">High Contrast Black & White</span>
                {contrast === 'high' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-white/70 mt-1">
                Deep black backgrounds with crisp white text and bright borders.
              </p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOTION PREFERENCE (Full vs Reduced)                                       */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-ner-warmAmber" />
            <h2 className="text-xl font-bold text-ner-black">Motion Sensitivity</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Smooth animations can be disabled if they cause dizziness or distraction.
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
                <span className="font-bold text-base text-ner-black">Full Animations</span>
                {motion === 'full' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                Smooth card flips, pulse indicators, and gentle screen reveals.
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
                <span className="font-bold text-base text-ner-black">Reduced Motion</span>
                {motion === 'reduced' && <Check className="w-4 h-4 text-ner-terracotta" />}
              </div>
              <p className="text-xs text-ner-black/60 mt-1">
                Instant transitions with zero motion, ideal for vestibular comfort.
              </p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REGIONAL LANGUAGE SELECTOR                                                */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-ner-calmBlue" />
            <h2 className="text-xl font-bold text-ner-black">Regional Language (NER)</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Select patient's native dialect for greetings and reminders.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languageOptions.map((lang) => (
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
                <span className="text-xs text-ner-black/50 font-normal">{lang.name}</span>
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
            <h2 className="text-xl font-bold text-ner-black">Speech Narration Test</h2>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Test the built-in speech synthesis engine that reads instructions aloud for elderly patients.
          </p>

          <div className="p-5 rounded-2xl bg-white border border-ner-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-ner-black/80 italic">
              "Good evening Ananya. You have completed 3 activities today and your memory score is 86%."
            </p>

            <button
              onClick={() => speakText("Good evening Ananya. You have completed 3 activities today and your memory score is 86%.")}
              className="px-6 py-3 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm shrink-0"
            >
              <Volume2 className="w-4 h-4 text-ner-terracotta" />
              <span>Test Audio Voice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
