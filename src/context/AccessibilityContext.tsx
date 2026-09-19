import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TextSize, MotionPreference, ContrastMode, NERLanguage } from '../types';
import { translations, translate, TranslationDictionary, TranslationKey, auditTranslations } from '../i18n';
import { speechEngine } from '../utils/speechEngine';

export type TranslationFunction = ((key: TranslationKey, params?: Record<string, string | number>) => string) & TranslationDictionary;

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  simpleUIMode: boolean;
  setSimpleUIMode: (enabled: boolean) => void;
  motion: MotionPreference;
  setMotion: (pref: MotionPreference) => void;
  contrast: ContrastMode;
  setContrast: (mode: ContrastMode) => void;
  language: NERLanguage;
  setLanguage: (lang: NERLanguage) => void;
  t: TranslationFunction;
  translate: (key: TranslationKey, params?: Record<string, string | number>) => string;
  speakText: (text: string, customLang?: NERLanguage, options?: { onEnd?: () => void; onStart?: () => void }) => void;
  isSpeaking: boolean;
  speakingText: string;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  primeSpeechEngine: () => void;
  playCalmingChime: () => void;
  playAudioAsset: (url: string, options?: { onStart?: () => void; onEnd?: () => void }) => Promise<boolean>;
  playNarratorWelcome: (lang?: NERLanguage) => Promise<boolean>;
  playNarratorCue: (cue: 'paused' | 'resumed' | 'stopped' | 'completed' | 'next' | 'prev' | 'restart' | 'chime') => Promise<boolean>;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('neuro_textSize') as TextSize) || 'normal';
  });
  const [simpleUIMode, setSimpleUIModeState] = useState<boolean>(() => {
    return localStorage.getItem('neuro_simpleUIMode') === 'true';
  });
  const [motion, setMotionState] = useState<MotionPreference>(() => {
    return (localStorage.getItem('neuro_motion') as MotionPreference) || 'full';
  });
  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    return (localStorage.getItem('neuro_contrast') as ContrastMode) || 'standard';
  });
  const [language, setLanguageState] = useState<NERLanguage>(() => {
    return (localStorage.getItem('neuro_language') as NERLanguage) || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string>('');
  const [speechRate, setSpeechRateState] = useState<number>(() => {
    const saved = localStorage.getItem('neuro_speechRate');
    return saved ? parseFloat(saved) : 0.88;
  });

  // Run translation audit in development mode
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const missing = auditTranslations();
      const languagesWithMissing = Object.keys(missing);
      if (languagesWithMissing.length > 0) {
        console.info('[i18n Audit Report] Audited all 8 languages. Missing keys report:', missing);
      } else {
        console.info('[i18n Audit Report] ✅ 100% of keys exist across all 8 supported North East languages!');
      }
    }
  }, []);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('neuro_textSize', size);
  };

  const setSimpleUIMode = (enabled: boolean) => {
    setSimpleUIModeState(enabled);
    localStorage.setItem('neuro_simpleUIMode', String(enabled));
  };

  const setMotion = (pref: MotionPreference) => {
    setMotionState(pref);
    localStorage.setItem('neuro_motion', pref);
  };

  const setContrast = (mode: ContrastMode) => {
    setContrastState(mode);
    localStorage.setItem('neuro_contrast', mode);
  };

  const setLanguage = (lang: NERLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('neuro_language', lang);
    // If speaking when language changes, stop current narration cleanly
    speechEngine.stop();
  };

  const setSpeechRate = (rate: number) => {
    const clamped = Math.max(0.65, Math.min(1.3, rate));
    setSpeechRateState(clamped);
    speechEngine.setRate(clamped);
    localStorage.setItem('neuro_speechRate', clamped.toString());
  };

  // Subscribe to speechEngine events
  useEffect(() => {
    speechEngine.setRate(speechRate);
    const unsubscribe = speechEngine.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      setSpeakingText(text);
    });
    return () => {
      unsubscribe();
      speechEngine.stop();
    };
  }, [speechRate]);

  // Sync DOM classes for font scaling, high contrast, and simple UI mode
  useEffect(() => {
    const root = document.documentElement;

    // Contrast
    if (contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Motion
    if (motion === 'reduced') {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size root attribute
    root.setAttribute('data-text-size', textSize);

    // Simple UI Mode
    if (simpleUIMode) {
      root.classList.add('simple-ui-active');
      root.setAttribute('data-simple-ui', 'true');
    } else {
      root.classList.remove('simple-ui-active');
      root.removeAttribute('data-simple-ui');
    }
  }, [contrast, motion, textSize, simpleUIMode]);

  // Unified Multi-Language Speech Synthesis Helper
  const speakText = (
    text: string, 
    customLang?: NERLanguage, 
    options?: { onEnd?: () => void; onStart?: () => void }
  ) => {
    if (!text || !text.trim()) return;
    try {
      speechEngine.primeAudio();
    } catch {}
    const targetLang = customLang || language;
    speechEngine.speak(text, {
      lang: targetLang,
      rate: speechRate,
      onStart: options?.onStart,
      onEnd: options?.onEnd,
    });
  };

  const stopSpeaking = () => {
    speechEngine.stop();
  };

  const pauseSpeaking = () => {
    speechEngine.pause();
  };

  const resumeSpeaking = () => {
    speechEngine.resume();
  };

  const primeSpeechEngine = () => {
    speechEngine.primeAudio();
  };

  const playCalmingChime = () => {
    speechEngine.playCalmingChime();
  };

  const playAudioAsset = (url: string, options?: { onStart?: () => void; onEnd?: () => void }) => {
    return speechEngine.playAudioAsset(url, options);
  };

  const playNarratorWelcome = (lang?: NERLanguage) => {
    return speechEngine.playNarratorWelcome(lang || language);
  };

  const playNarratorCue = (cue: 'paused' | 'resumed' | 'stopped' | 'completed' | 'next' | 'prev' | 'restart' | 'chime') => {
    return speechEngine.playNarratorCue(cue);
  };

  const translateHelper = (key: TranslationKey, params?: Record<string, string | number>) => {
    return translate(language, key, params);
  };

  // Hybrid translation accessor: callable function t('key') + property accessor t.key
  const t = useMemo(() => {
    const fn = (key: TranslationKey, params?: Record<string, string | number>) => {
      return translate(language, key, params);
    };

    return new Proxy(fn, {
      get(target, prop: string) {
        if (prop in target) {
          return (target as any)[prop];
        }
        return translate(language, prop as TranslationKey);
      }
    }) as TranslationFunction;
  }, [language]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        simpleUIMode,
        setSimpleUIMode,
        motion,
        setMotion,
        contrast,
        setContrast,
        language,
        setLanguage,
        t,
        translate: translateHelper,
        speakText,
        isSpeaking,
        speakingText,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        speechRate,
        setSpeechRate,
        primeSpeechEngine,
        playCalmingChime,
        playAudioAsset,
        playNarratorWelcome,
        playNarratorCue,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
