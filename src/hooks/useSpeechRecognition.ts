import { useState, useEffect, useRef, useCallback } from 'react';
import { NERLanguage } from '../types';

interface UseSpeechRecognitionOptions {
  language?: NERLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

// Map NER languages to SpeechRecognition BCP-47 codes
const RECOGNITION_LANG_MAP: Record<NERLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  as: 'as-IN', // falls back to bn-IN if browser doesn't support as-IN
  mni: 'bn-IN',
  kha: 'en-IN',
  lus: 'en-IN',
  nag: 'as-IN'
};

export interface SpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
  startListening: (customLang?: NERLanguage) => Promise<boolean>;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): SpeechRecognitionResult => {
  const {
    language = 'en',
    continuous = false,
    interimResults = true,
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition;

    setIsSupported(Boolean(SpeechRecognitionAPI));

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(
    async (customLang?: NERLanguage): Promise<boolean> => {
      setError(null);
      setInterimTranscript('');

      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        const msg = 'Speech recognition is not supported in this browser. Please type your response.';
        setError(msg);
        if (onError) onError(msg);
        return false;
      }

      // Check microphone permission if available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          console.warn('Microphone permission request note:', e);
        }
      }

      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // ignore
          }
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;

        const langToUse = customLang || language;
        const bcp47 = RECOGNITION_LANG_MAP[langToUse] || 'en-IN';
        recognition.lang = bcp47;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            const text = item[0].transcript;
            if (item.isFinal) {
              currentFinal += text + ' ';
            } else {
              currentInterim += text;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => {
              const updated = (prev ? prev + ' ' : '') + currentFinal.trim();
              if (onResult) onResult(updated, true);
              return updated;
            });
            setInterimTranscript('');
          } else {
            setInterimTranscript(currentInterim);
            if (onResult && currentInterim) {
              onResult(currentInterim, false);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event:', event.error);
          let userMsg = 'Microphone could not capture audio.';
          if (event.error === 'not-allowed') {
            userMsg = 'Microphone access was denied. Please allow microphone permissions in your browser.';
          } else if (event.error === 'no-speech') {
            userMsg = 'No speech detected. Please speak clearly into your microphone.';
          }
          setError(userMsg);
          setIsListening(false);
          if (onError) onError(userMsg);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.start();

        // Safety timeout to prevent hanging listening mode
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          stopListening();
        }, 15000);

        return true;
      } catch (err: any) {
        console.error('Failed to initialize speech recognition:', err);
        const errStr = 'Could not start microphone voice input.';
        setError(errStr);
        setIsListening(false);
        if (onError) onError(errStr);
        return false;
      }
    },
    [continuous, interimResults, language, onError, onResult, stopListening]
  );

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};
