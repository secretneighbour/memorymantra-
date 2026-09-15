import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextSize, MotionPreference, ContrastMode, NERLanguage } from '../types';
import { translations, TranslationDictionary } from '../data/translations';
import { speechEngine } from '../utils/speechEngine';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  motion: MotionPreference;
  setMotion: (pref: MotionPreference) => void;
  contrast: ContrastMode;
  setContrast: (mode: ContrastMode) => void;
  language: NERLanguage;
  setLanguage: (lang: NERLanguage) => void;
  t: TranslationDictionary;
  speakText: (text: string, customLang?: NERLanguage, options?: { onEnd?: () => void; onStart?: () => void }) => void;
  isSpeaking: boolean;
  speakingText: string;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
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

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('neuro_textSize', size);
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

  // Sync DOM classes for font scaling and high contrast
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
  }, [contrast, motion, textSize]);

  // Unified Multi-Language Speech Synthesis Helper
  const speakText = (
    text: string, 
    customLang?: NERLanguage, 
    options?: { onEnd?: () => void; onStart?: () => void }
  ) => {
    if (!text || !text.trim()) return;
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

  const t = translations[language] || translations.en;

  return (
    <AccessibilityContext.Provider
      value={{
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
        pauseSpeaking,
        resumeSpeaking,
        speechRate,
        setSpeechRate,
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
