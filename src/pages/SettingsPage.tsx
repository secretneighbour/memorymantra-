import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TextSize, NERLanguage } from '../types';
import { 
  Type, 
  Eye, 
  Sparkles, 
  Globe, 
  Volume2, 
  VolumeX,
  Play,
  Gauge,
  Check, 
  RotateCcw,
  Disc,
  Music,
  Radio
} from 'lucide-react';
import { nerLanguages, translations } from '../data/translations';

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
    isSpeaking,
    speakingText,
    stopSpeaking,
    speechRate,
    setSpeechRate,
    playCalmingChime,
    playNarratorWelcome,
    playNarratorCue,
    playAudioAsset
  } = useAccessibility();

  const [testLang, setTestLang] = useState<NERLanguage>(language);
  const [activeAssetKey, setActiveAssetKey] = useState<string | null>(null);

  // Sync testLang when global language changes
  useEffect(() => {
    setTestLang(language);
  }, [language]);

  const handlePlayVoiceAsset = async (key: string, fn: () => Promise<any>) => {
    setActiveAssetKey(key);
    try {
      await fn();
    } finally {
      setActiveAssetKey(null);
    }
  };

  const handleResetDefaults = () => {
    setTextSize('normal');
    setMotion('full');
    setContrast('standard');
    setLanguage('en');
    setSpeechRate(0.88);
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
        {/* TEXT-TO-SPEECH (TTS) MULTI-LANGUAGE AUDIO DEMO                             */}
        {/* ========================================================================= */}
        <div className="frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-ner-terracotta" />
              <h2 className="text-xl font-bold text-ner-black">{t.speechTestTitle}</h2>
            </div>
            {isSpeaking && (
              <span className="px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-ner-terracotta" />
                Speaking Active
              </span>
            )}
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            {t.speechTestDesc}
          </p>

          {/* Language Audition Tabs */}
          <div className="mb-4">
            <label className="text-xs font-mono uppercase tracking-wider text-ner-black/60 block mb-2 font-bold">
              Audition Voice in Any Language:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {nerLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setTestLang(l.code);
                    if (isSpeaking) stopSpeaking();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    testLang === l.code
                      ? 'bg-ner-black text-white font-bold shadow-sm'
                      : 'bg-white/80 hover:bg-white text-ner-black/80 border border-ner-border'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="ml-1 text-[10px] opacity-60 font-mono">({l.code.toUpperCase()})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Controls */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-ner-offwhite/80 border border-ner-border">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-ner-black/60" />
              <span className="text-xs font-mono font-bold text-ner-black/80">Narration Speed:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: 0.75, label: '0.75x (Gentle)' },
                { val: 0.88, label: '0.88x (Recommended)' },
                { val: 1.0, label: '1.0x (Standard)' },
                { val: 1.15, label: '1.15x (Brisk)' }
              ].map((sp) => (
                <button
                  key={sp.val}
                  onClick={() => setSpeechRate(sp.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    Math.abs(speechRate - sp.val) < 0.05
                      ? 'bg-ner-terracotta text-white font-bold'
                      : 'bg-white hover:bg-ner-black/5 text-ner-black/70 border border-ner-border'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Playback Card */}
          <div className="p-5 rounded-2xl bg-white border border-ner-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ner-black/40 font-bold block">
                Sample Text ({nerLanguages.find(l => l.code === testLang)?.native}):
              </span>
              <p className="text-sm sm:text-base text-ner-black/90 font-medium leading-relaxed">
                "{translations[testLang]?.speechTestSample || t.speechTestSample}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Pre-recorded Voice Asset Button */}
              <button
                onClick={() => handlePlayVoiceAsset(`asset-${testLang}`, () => playNarratorWelcome(testLang))}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition active:scale-95 border ${
                  activeAssetKey === `asset-${testLang}`
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-ner-terracotta text-white hover:bg-ner-terracotta/90 border-transparent'
                }`}
                title="Play bundled voice asset"
              >
                <Disc className={`w-4 h-4 ${activeAssetKey === `asset-${testLang}` ? 'animate-spin' : ''}`} />
                <span>Play Voice Asset</span>
              </button>

              {/* Speech Synthesis Audition Button */}
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
                >
                  <VolumeX className="w-4 h-4 animate-pulse" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={() => speakText(translations[testLang]?.speechTestSample || t.speechTestSample, testLang)}
                  className="px-4 py-2.5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md active:scale-95 transition"
                >
                  <Play className="w-4 h-4 text-ner-terracotta fill-current" />
                  <span>TTS Voice</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BUNDLED NARRATOR VOICE ASSETS EXPLORER                                    */}
          {/* ========================================================================= */}
          <div className="mt-6 pt-6 border-t border-ner-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-ner-terracotta" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ner-black">
                  Bundled Voice Audio Assets (Offline-Ready)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-mono font-bold border border-emerald-500/20">
                23 Audio Files Packaged
              </span>
            </div>
            <p className="text-xs text-ner-black/60 mb-4">
              High-fidelity spoken audio assets packaged directly into the application. These sound assets provide immediate audio feedback and localized welcome greetings even when browser speech synthesis voices are missing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {nerLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handlePlayVoiceAsset(`welcome-${l.code}`, () => playNarratorWelcome(l.code))}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    activeAssetKey === `welcome-${l.code}`
                      ? 'bg-ner-terracotta text-white border-ner-terracotta shadow-md'
                      : 'bg-white hover:bg-ner-offwhite border-ner-border text-ner-black'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{l.native}</span>
                    <span className="text-[10px] font-mono opacity-70">{l.name} Greeting</span>
                  </div>
                  <Play className={`w-3.5 h-3.5 shrink-0 ${activeAssetKey === `welcome-${l.code}` ? 'fill-current animate-pulse' : 'text-ner-terracotta'}`} />
                </button>
              ))}
            </div>

            {/* Spoken Action Cues */}
            <div className="p-3.5 rounded-2xl bg-ner-offwhite/60 border border-ner-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-ner-black/70 mr-1">
                Narrator Action Cues:
              </span>
              {[
                { key: 'paused', label: 'Paused Cue' },
                { key: 'resumed', label: 'Resumed Cue' },
                { key: 'next', label: 'Next Cue' },
                { key: 'prev', label: 'Prev Cue' },
                { key: 'completed', label: 'Completed Cue' },
              ].map((cue) => (
                <button
                  key={cue.key}
                  onClick={() => handlePlayVoiceAsset(`cue-${cue.key}`, () => playNarratorCue(cue.key as any))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                    activeAssetKey === `cue-${cue.key}`
                      ? 'bg-ner-black text-white border-ner-black shadow-sm'
                      : 'bg-white hover:bg-ner-black/5 text-ner-black/80 border-ner-border'
                  }`}
                >
                  {cue.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handlePlayVoiceAsset('chime', async () => {
                    playCalmingChime();
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                  activeAssetKey === 'chime'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white hover:bg-ner-black/5 text-ner-black/80 border-ner-border'
                }`}
              >
                528Hz Harmonic Chime
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
