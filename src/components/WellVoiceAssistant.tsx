import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Check, 
  Sparkles, 
  X, 
  ArrowRight, 
  RotateCcw,
  Heart,
  Zap,
  ShieldAlert,
  Smile
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { WellbeingMood, EnergyLevel, PainLevel } from '../types';
import { saveWellbeingResponse } from '../utils/wellbeingUtils';
import { nerLanguages } from '../data/translations';

interface WellVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

type Step = 'mood' | 'energy' | 'comfort' | 'note' | 'completed';

export const WellVoiceAssistant: React.FC<WellVoiceAssistantProps> = ({
  isOpen,
  onClose,
  onCompleted
}) => {
  const { activePatient, recordCheckIn } = useRole();
  const { language, speakText, stopSpeaking, isSpeaking, playCalmingChime, playAudioAsset, t } = useAccessibility();

  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<WellbeingMood | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(3);
  const [painLevel, setPainLevel] = useState<PainLevel>('none');
  const [spokenNote, setSpokenNote] = useState<string>('');
  const [hasPromptedStep, setHasPromptedStep] = useState(false);

  const langMeta = nerLanguages.find((l) => l.code === language) || nerLanguages[0];

  // Speech recognition for listening to patient's voice response
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language,
    onResult: (text, isFinal) => {
      if (!isFinal) return;
      handleVoiceInput(text);
    }
  });

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setStep('mood');
      setSelectedMood(null);
      setEnergyLevel(3);
      setPainLevel('none');
      setSpokenNote('');
      setHasPromptedStep(false);
      resetTranscript();
      playCalmingChime();

      // Initial friendly greeting after short pause
      const timer = setTimeout(() => {
        promptStep('mood');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  // Voice Prompts for each step in patient's language
  const promptStep = (currentStep: Step) => {
    setHasPromptedStep(true);
    let message = '';

    if (currentStep === 'mood') {
      message = `Hello ${activePatient.name}. Let's do your wellness check-in together. How are you feeling right now? You can say: Good, Okay, Worried, Sad, or Tired.`;
      if (language === 'hi') {
        message = `नमस्ते ${activePatient.name} जी। आप अभी कैसा महसूस कर रहे हैं? कहिए: अच्छा, ठीक, चिंतित, उदास, या थका हुआ।`;
      } else if (language === 'bn' || language === 'as') {
        message = `নমস্কার ${activePatient.name}। আপনি এখন কেমন অনুভব করছেন? বলুন: ভালো, ঠিকঠাক, চিন্তিত, বিষণ্ণ, বা ক্লান্ত।`;
      }
    } else if (currentStep === 'energy') {
      message = `How is your physical energy today? You can say low, medium, or high, or give a number from 1 to 5.`;
      if (language === 'hi') {
        message = `आज आपकी शारीरिक ऊर्जा कैसी है? कम, मध्यम, या भरपूर ऊर्जा? 1 से 5 तक बताइए।`;
      }
    } else if (currentStep === 'comfort') {
      message = `Are you experiencing any physical discomfort or body pain today? Say: No pain, Mild ache, or Moderate pain.`;
      if (language === 'hi') {
        message = `क्या आज शरीर में कोई दर्द या परेशानी है? कहिए: कोई दर्द नहीं, हल्का दर्द, या मध्यम दर्द।`;
      }
    } else if (currentStep === 'note') {
      message = `Would you like to speak a personal note for your family or care team? Speak after the tone, or say Finish.`;
      if (language === 'hi') {
        message = `क्या आप अपने परिवार या डॉक्टर के लिए कोई संदेश बोलना चाहते हैं? बोलिए, या पूरा करें।`;
      }
    } else if (currentStep === 'completed') {
      message = `Thank you ${activePatient.name}. Your wellness check-in has been recorded and shared with your care circle. Rest well and enjoy your day.`;
      if (language === 'hi') {
        message = `धन्यवाद ${activePatient.name} जी। आपका स्वास्थ्य विवरण सुरक्षित हो गया है। आपका दिन शुभ और सुखद हो।`;
      }
    }

    const assistantAudioMap: Partial<Record<Step, string>> = {
      mood: './audio/assistant/prompt_mood.mp3',
      energy: './audio/assistant/prompt_energy.mp3',
      comfort: './audio/assistant/prompt_comfort.mp3',
      completed: './audio/assistant/checkin_complete.mp3',
    };

    if (language === 'en' && assistantAudioMap[currentStep]) {
      playAudioAsset(assistantAudioMap[currentStep]!, {
        onEnd: () => {
          if (currentStep !== 'completed') {
            startListening(language);
          }
        },
      }).catch(() => {
        speakText(message, language);
      });
      return;
    }

    speakText(message, language);

    // Auto start listening after prompt finishes
    if (currentStep !== 'completed') {
      const waitTime = Math.min(8000, Math.max(3000, message.length * 70));
      setTimeout(() => {
        startListening(language);
      }, waitTime);
    }
  };

  // Analyze voice input
  const handleVoiceInput = (rawText: string) => {
    const text = rawText.toLowerCase();

    if (step === 'mood') {
      if (text.includes('good') || text.includes('great') || text.includes('happy') || text.includes('achha') || text.includes('accha') || text.includes('bhalo') || text.includes('bhal') || text.includes('fine')) {
        selectMood('good');
      } else if (text.includes('okay') || text.includes('ok') || text.includes('thik') || text.includes('theek') || text.includes('alright') || text.includes('normal')) {
        selectMood('okay');
      } else if (text.includes('worried') || text.includes('anxious') || text.includes('tension') || text.includes('chinta') || text.includes('chintit')) {
        selectMood('worried');
      } else if (text.includes('sad') || text.includes('low') || text.includes('udas') || text.includes('mon kharap')) {
        selectMood('sad');
      } else if (text.includes('tired') || text.includes('exhausted') || text.includes('sleepy') || text.includes('thaka') || text.includes('klanto')) {
        selectMood('tired');
      }
    } else if (step === 'energy') {
      if (text.includes('1') || text.includes('one') || text.includes('low') || text.includes('kam') || text.includes('khub kom')) {
        setEnergyLevel(1);
        playCalmingChime();
        proceedToComfort();
      } else if (text.includes('2') || text.includes('two')) {
        setEnergyLevel(2);
        playCalmingChime();
        proceedToComfort();
      } else if (text.includes('3') || text.includes('three') || text.includes('mid') || text.includes('medium') || text.includes('theek')) {
        setEnergyLevel(3);
        playCalmingChime();
        proceedToComfort();
      } else if (text.includes('4') || text.includes('four')) {
        setEnergyLevel(4);
        playCalmingChime();
        proceedToComfort();
      } else if (text.includes('5') || text.includes('five') || text.includes('high') || text.includes('full') || text.includes('bohut')) {
        setEnergyLevel(5);
        playCalmingChime();
        proceedToComfort();
      }
    } else if (step === 'comfort') {
      if (text.includes('no pain') || text.includes('none') || text.includes('no') || text.includes('nahi') || text.includes('comfortable') || text.includes('bhalo')) {
        setPainLevel('none');
        playCalmingChime();
        proceedToNote();
      } else if (text.includes('mild') || text.includes('thoda') || text.includes('slight') || text.includes('ekta')) {
        setPainLevel('mild');
        playCalmingChime();
        proceedToNote();
      } else if (text.includes('moderate') || text.includes('pain') || text.includes('dard') || text.includes('severe') || text.includes('hurt')) {
        setPainLevel('moderate');
        playCalmingChime();
        proceedToNote();
      }
    } else if (step === 'note') {
      if (text.includes('finish') || text.includes('done') || text.includes('submit') || text.includes('khatam') || text.includes('ho gya')) {
        handleSubmitFinal();
      } else {
        setSpokenNote((prev) => (prev ? prev + ' ' : '') + rawText);
      }
    }
  };

  const selectMood = (mood: WellbeingMood) => {
    setSelectedMood(mood);
    playCalmingChime();
    stopListening();
    setTimeout(() => {
      setStep('energy');
      promptStep('energy');
    }, 1000);
  };

  const proceedToComfort = () => {
    stopListening();
    setTimeout(() => {
      setStep('comfort');
      promptStep('comfort');
    }, 800);
  };

  const proceedToNote = () => {
    stopListening();
    setTimeout(() => {
      setStep('note');
      promptStep('note');
    }, 800);
  };

  const handleSubmitFinal = () => {
    stopListening();
    const finalMood = selectedMood || 'good';

    // Save to persistence
    const noteSummary = `Energy: ${energyLevel}/5 | Comfort: ${painLevel === 'none' ? 'No Pain' : painLevel + ' discomfort'}${
      spokenNote ? ' | ' + spokenNote : ''
    }`;

    saveWellbeingResponse(finalMood, noteSummary, activePatient.name, 2);
    recordCheckIn(finalMood, noteSummary);

    setStep('completed');
    playCalmingChime();
    promptStep('completed');

    if (onCompleted) {
      onCompleted();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-wrapper border border-ner-border">
        {/* Modal Header */}
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-ner-terracotta text-white flex items-center justify-center shadow-sm">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs uppercase font-bold tracking-widest text-ner-terracotta">
                  Well Voice
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-ner-offwhite border border-ner-border font-mono text-ner-black/60">
                  {langMeta.native}
                </span>
              </div>
              <h3 className="text-lg font-bold text-ner-black">
                Guided Voice Wellness Check-In
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ner-offwhite text-ner-black/50 hover:text-ner-black transition"
            title="Close voice check-in"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 mb-4">
          {(['mood', 'energy', 'comfort', 'note', 'completed'] as Step[]).map((s, idx) => {
            const isCurrent = step === s;
            const isDone =
              (s === 'mood' && selectedMood !== null) ||
              (s === 'energy' && step !== 'mood') ||
              (s === 'comfort' && (step === 'note' || step === 'completed')) ||
              (s === 'note' && step === 'completed') ||
              step === 'completed';

            return (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-ner-terracotta'
                    : isDone
                    ? 'bg-ner-black'
                    : 'bg-ner-border'
                }`}
              />
            );
          })}
        </div>

        {/* Live Audio & Voice Interaction Stage */}
        <div className="my-6 text-center space-y-4">
          {/* Animated Pulsing Soundwave Sphere */}
          <div className="relative inline-flex items-center justify-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-ner-terracotta/15 ring-8 ring-ner-terracotta/20 animate-pulse'
                  : isListening
                  ? 'bg-rose-500/15 ring-8 ring-rose-500/20'
                  : 'bg-ner-offwhite ring-4 ring-ner-border'
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-10 h-10 text-ner-terracotta animate-bounce" />
              ) : isListening ? (
                <div className="flex items-end gap-1 h-8">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                </div>
              ) : (
                <Heart className="w-10 h-10 text-ner-terracotta/60" />
              )}
            </div>

            {/* Speaking / Listening badge */}
            <span
              className={`absolute -bottom-2 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${
                isSpeaking
                  ? 'bg-ner-terracotta text-white'
                  : isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-ner-black text-white'
              }`}
            >
              {isSpeaking ? 'Speaking to you...' : isListening ? 'Listening to your voice...' : 'Ready'}
            </span>
          </div>

          {/* Voice transcript feedback */}
          {(transcript || interimTranscript) && (
            <div className="p-3 rounded-2xl bg-ner-offwhite border border-ner-border text-xs text-ner-black/80 italic animate-fade-in">
              "{interimTranscript || transcript}"
            </div>
          )}

          {/* Step 1: Mood Choice */}
          {step === 'mood' && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xl font-bold text-ner-black">
                How are you feeling right now?
              </h4>
              <p className="text-xs text-ner-black/60 font-mono">
                Speak clearly or tap your feeling below:
              </p>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[
                  { id: 'good' as WellbeingMood, emoji: '😊', label: t.moodGood || 'Good' },
                  { id: 'okay' as WellbeingMood, emoji: '😐', label: t.moodOkay || 'Okay' },
                  { id: 'worried' as WellbeingMood, emoji: '😟', label: t.moodWorried || 'Worried' },
                  { id: 'sad' as WellbeingMood, emoji: '😢', label: t.moodSad || 'Sad' },
                  { id: 'tired' as WellbeingMood, emoji: '😴', label: t.moodTired || 'Tired' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectMood(item.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${
                      selectedMood === item.id
                        ? 'bg-ner-black text-white border-ner-black shadow-md'
                        : 'bg-white border-ner-border hover:border-ner-black/40 text-ner-black'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-[11px] font-bold truncate max-w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Energy Level */}
          {step === 'energy' && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xl font-bold text-ner-black">
                What is your physical energy level?
              </h4>
              <p className="text-xs text-ner-black/60 font-mono">
                Say a number from 1 (Low) to 5 (High), or tap:
              </p>
              <div className="flex gap-2 justify-center pt-2">
                {([1, 2, 3, 4, 5] as EnergyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setEnergyLevel(lvl);
                      playCalmingChime();
                      proceedToComfort();
                    }}
                    className={`w-12 h-14 rounded-2xl font-mono text-base font-bold border-2 flex flex-col items-center justify-center transition active:scale-95 ${
                      energyLevel === lvl
                        ? 'bg-ner-terracotta text-white border-ner-terracotta shadow-md'
                        : 'bg-white border-ner-border text-ner-black hover:border-slate-400'
                    }`}
                  >
                    <span>{lvl}</span>
                    <span className="text-[9px] font-sans opacity-70">
                      {lvl === 1 ? 'Low' : lvl === 5 ? 'High' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Physical Comfort */}
          {step === 'comfort' && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xl font-bold text-ner-black">
                Any aches or physical discomfort?
              </h4>
              <p className="text-xs text-ner-black/60 font-mono">
                Say "No pain", "Mild", or "Moderate", or tap:
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[
                  { id: 'none' as PainLevel, label: 'No Pain', emoji: '🌿' },
                  { id: 'mild' as PainLevel, label: 'Mild Ache', emoji: '🩹' },
                  { id: 'moderate' as PainLevel, label: 'Moderate', emoji: '⚠️' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPainLevel(p.id);
                      playCalmingChime();
                      proceedToNote();
                    }}
                    className={`p-3 rounded-2xl border-2 text-center transition active:scale-95 flex flex-col items-center justify-center ${
                      painLevel === p.id
                        ? 'bg-ner-black text-white border-ner-black shadow-md'
                        : 'bg-white border-ner-border text-ner-black hover:border-slate-400'
                    }`}
                  >
                    <span className="text-2xl mb-1">{p.emoji}</span>
                    <span className="text-xs font-bold">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Spoken Note */}
          {step === 'note' && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xl font-bold text-ner-black">
                Speak a personal message or note
              </h4>
              <p className="text-xs text-ner-black/60 font-mono">
                Your words are transcribed for your family & doctor:
              </p>

              <div className="p-3.5 rounded-2xl bg-white border border-ner-border shadow-inner min-h-[72px] text-left">
                {spokenNote ? (
                  <p className="text-sm text-ner-black leading-relaxed font-medium">
                    "{spokenNote}"
                  </p>
                ) : (
                  <p className="text-xs text-ner-black/40 italic">
                    Tap the microphone below and speak your thoughts, or say "Finish"...
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    if (isListening) stopListening();
                    else startListening(language);
                  }}
                  className={`px-4 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition shadow-sm ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-ner-offwhite border border-ner-border hover:bg-ner-black hover:text-white text-ner-black'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-ner-terracotta" />}
                  <span>{isListening ? 'Stop Speaking' : 'Dictate More'}</span>
                </button>

                <button
                  onClick={handleSubmitFinal}
                  className="px-6 py-2.5 rounded-full bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-ner-black/85 shadow-md flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Check className="w-4 h-4 text-ner-terracotta" />
                  <span>Finish & Submit</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Completed */}
          {step === 'completed' && (
            <div className="space-y-3 pt-2 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-ner-black">
                Wellness Check-In Complete!
              </h4>
              <p className="text-sm text-ner-black/70 max-w-sm mx-auto leading-relaxed">
                Thank you, {activePatient.name}. Your mood and comfort levels have been recorded for your Care Circle.
              </p>

              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-full bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-ner-black/85 shadow-md active:scale-95 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer flex items-center justify-between text-[11px] font-mono text-ner-black/50">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>NEURO NER Adaptive Voice System</span>
          </div>

          <button
            onClick={() => promptStep(step)}
            className="hover:text-ner-black underline flex items-center gap-1"
            title="Replay spoken question"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Repeat Question</span>
          </button>
        </div>
      </div>
    </div>
  );
};
