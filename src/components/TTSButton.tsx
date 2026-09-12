import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface TTSButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TTSButton: React.FC<TTSButtonProps> = ({ 
  text, 
  label = "Listen", 
  className = "",
  size = 'md'
}) => {
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text);
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
      title="Listen to this text aloud"
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 border border-ner-black/15 bg-white/80 hover:bg-ner-black hover:text-white text-ner-black shadow-sm active:scale-95 ${sizeClasses[size]} ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 text-ner-terracotta animate-pulse" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-ner-terracotta" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
