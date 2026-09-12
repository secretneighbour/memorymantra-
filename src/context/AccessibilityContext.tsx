import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextSize, MotionPreference, ContrastMode, NERLanguage } from '../types';
import { translations, TranslationDictionary } from '../data/translations';

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
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
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
  };

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

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.88; // Slightly slower, calm cadence for elderly comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
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
        stopSpeaking,
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
