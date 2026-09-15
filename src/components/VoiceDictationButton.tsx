import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAccessibility } from '../context/AccessibilityContext';
import { NERLanguage } from '../types';

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  currentValue?: string;
  lang?: NERLanguage;
  mode?: 'append' | 'replace';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  currentValue = '',
  lang,
  mode = 'append',
  className = '',
  size = 'md',
  label = 'Voice Note'
}) => {
  const { language, playCalmingChime } = useAccessibility();
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const effectiveLang = lang || language;

  const {
    isListening,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening
  } = useSpeechRecognition({
    language: effectiveLang,
    onResult: (newTranscript, isFinal) => {
      if (isFinal && newTranscript.trim()) {
        if (mode === 'append') {
          const separator = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
          onTranscript(`${currentValue}${separator}${newTranscript.trim()}`);
        } else {
          onTranscript(newTranscript.trim());
        }
      }
    },
    onError: () => {
      setShowErrorBanner(true);
      setTimeout(() => setShowErrorBanner(false), 4000);
    }
  });

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isListening) {
      stopListening();
    } else {
      setShowErrorBanner(false);
      playCalmingChime();
      await startListening(effectiveLang);
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-2',
    lg: 'px-4 py-2 text-sm gap-2.5'
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        title={isListening ? 'Stop recording voice' : `Dictate note with your voice (${effectiveLang.toUpperCase()})`}
        aria-label="Voice dictation"
        className={`rounded-full font-mono font-bold transition-all duration-200 border shadow-sm active:scale-95 inline-flex items-center ${
          isListening
            ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-500/20 animate-pulse'
            : 'bg-white hover:bg-ner-black hover:text-white text-ner-black border-ner-border'
        } ${sizeClasses[size]} ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 shrink-0" />
            <span className="flex items-center gap-1.5">
              <span>Listening...</span>
              <span className="inline-flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2.5 bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-1.5 bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-3 bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-ner-terracotta shrink-0" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Interim Speech Preview Popover */}
      {isListening && interimTranscript && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-2 rounded-xl bg-ner-black text-white text-[11px] shadow-xl z-30 animate-fade-in border border-white/20 pointer-events-none">
          <span className="text-[9px] font-mono text-white/50 block uppercase">Transcribing:</span>
          <p className="italic text-white/90 truncate">"{interimTranscript}"</p>
        </div>
      )}

      {/* Error notification banner */}
      {showErrorBanner && error && (
        <div className="absolute left-0 bottom-full mb-2 w-56 p-2 rounded-xl bg-rose-900 text-rose-100 text-[11px] shadow-xl z-30 animate-fade-in border border-rose-700 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-300 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
