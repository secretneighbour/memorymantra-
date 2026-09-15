import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { NERLanguage } from '../types';

interface TTSButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  lang?: NERLanguage;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ 
  text, 
  label, 
  className = "",
  size = 'md',
  lang
}) => {
  const { speakText, isSpeaking, speakingText, stopSpeaking, t, language } = useAccessibility();

  // Check if this specific button's text is currently playing
  const isSpeakingThis = Boolean(
    isSpeaking && 
    speakingText && 
    (speakingText.includes(text.slice(0, 25)) || text.includes(speakingText.slice(0, 25)))
  );

  const buttonLabel = label || t.listenAloud || "Listen";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeakingThis) {
      stopSpeaking();
    } else {
      speakText(text, lang || language);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={`Read aloud: ${text.slice(0, 40)}`}
      title={isSpeakingThis ? "Stop speaking" : "Listen to this text aloud"}
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 border shadow-sm active:scale-95 ${
        isSpeakingThis
          ? 'border-ner-terracotta bg-ner-terracotta/10 text-ner-terracotta ring-2 ring-ner-terracotta/30'
          : 'border-ner-black/15 bg-white/85 hover:bg-ner-black hover:text-white text-ner-black'
      } ${sizeClasses[size]} ${className}`}
    >
      {isSpeakingThis ? (
        <>
          <VolumeX className="w-4 h-4 text-ner-terracotta animate-pulse" />
          <span className="font-bold flex items-center gap-1">
            <span>Stop</span>
            <span className="inline-flex items-end gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 h-3 bg-ner-terracotta animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-2 bg-ner-terracotta animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-3.5 bg-ner-terracotta animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-ner-terracotta shrink-0" />
          <span className="whitespace-nowrap">{buttonLabel}</span>
        </>
      )}
    </button>
  );
};
