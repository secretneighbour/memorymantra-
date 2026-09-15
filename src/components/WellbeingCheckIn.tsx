import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from './TTSButton';
import { VoiceDictationButton } from './VoiceDictationButton';
import { WellVoiceAssistant } from './WellVoiceAssistant';
import {
  WellbeingMood,
  WellbeingResponse,
  MOOD_DEFINITIONS,
  saveWellbeingResponse,
  getStoredWellbeingResponses,
  shouldPromptOnLogin,
  markLoginPromptCompletedToday
} from '../utils/wellbeingUtils';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Clock,
  Volume2,
  Sparkles,
  Mic
} from 'lucide-react';

interface WellbeingCheckInProps {
  /**
   * Display mode:
   * 'modal': Appears as an overlay prompt on login
   * 'embedded': Rendered directly inside a page/dashboard
   */
  mode?: 'modal' | 'embedded';
  autoPromptOnLogin?: boolean;
  onCompleted?: (response: WellbeingResponse) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const WellbeingCheckIn: React.FC<WellbeingCheckInProps> = ({
  mode = 'embedded',
  autoPromptOnLogin = false,
  onCompleted,
  onClose,
  isOpen: controlledIsOpen
}) => {
  const { activePatient, recordCheckIn } = useRole();
  const { speakText, t } = useAccessibility();

  const [modalOpen, setModalOpen] = useState(false);
  const [isWellVoiceOpen, setIsWellVoiceOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<WellbeingMood | null>(null);
  const [optionalNote, setOptionalNote] = useState('');
  const [submittedResponse, setSubmittedResponse] = useState<WellbeingResponse | null>(null);
  const [consecutiveFlag, setConsecutiveFlag] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<WellbeingResponse[]>([]);

  const getMoodLabel = (mood: WellbeingMood) => {
    switch (mood) {
      case 'good': return t.moodGood;
      case 'okay': return t.moodOkay;
      case 'worried': return t.moodWorried;
      case 'sad': return t.moodSad;
      case 'tired': return t.moodTired;
      default: return String(mood);
    }
  };

  // Load history from localStorage
  useEffect(() => {
    const list = getStoredWellbeingResponses();
    setHistoryList(list);
  }, [submittedResponse]);

  // Check login prompt condition
  useEffect(() => {
    if (mode === 'modal' || autoPromptOnLogin) {
      if (controlledIsOpen !== undefined) {
        setModalOpen(controlledIsOpen);
      } else if (shouldPromptOnLogin()) {
        const timer = setTimeout(() => {
          setModalOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [mode, autoPromptOnLogin, controlledIsOpen]);

  const handleSelectMood = (mood: WellbeingMood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMood) return;

    // Save to localStorage & evaluate consecutive negative patterns
    const { response, consecutiveEval } = saveWellbeingResponse(
      selectedMood,
      optionalNote,
      activePatient.name,
      2 // threshold of 2 consecutive negative responses
    );

    // Sync to RoleContext state
    recordCheckIn(selectedMood, optionalNote || undefined);

    setSubmittedResponse(response);
    setConsecutiveFlag(consecutiveEval.streakCount);

    if (consecutiveEval.isFlagged) {
      speakText(
        `${t.moodFeedbackPrefix} ${getMoodLabel(selectedMood)}. ${t.consecutiveNegativeAlert}`
      );
    } else {
      speakText(
        `${t.moodFeedbackPrefix} ${getMoodLabel(selectedMood)}.`
      );
    }

    if (onCompleted) {
      onCompleted(response);
    }

    // Auto dismiss modal after confirmation
    if (mode === 'modal') {
      setTimeout(() => {
        setModalOpen(false);
        if (onClose) onClose();
      }, 2500);
    }
  };

  const handleDismissModal = () => {
    markLoginPromptCompletedToday();
    setModalOpen(false);
    if (onClose) onClose();
  };

  const quickNotes = [
    'Slept well',
    'A bit restless',
    'Looking forward to walks',
    'Mild headache',
    'Missing family'
  ];

  // ---------------------------------------------------------------------------
  // 1. MODAL PRESENTATION (Prompts patient on login)
  // ---------------------------------------------------------------------------
  if (mode === 'modal') {
    if (!modalOpen) return null;

    return (
      <div 
        id="wellbeing-login-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 dot-matrix-subtle opacity-30 pointer-events-none" />

          {/* Close / Skip button */}
          <button
            onClick={handleDismissModal}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-ner-black/50 hover:text-ner-black transition-colors"
            aria-label="Close Check-In"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedResponse ? (
            /* Confirmation View */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-ner-sage mx-auto flex items-center justify-center border border-ner-sage/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-ner-black">
                {t.patientName}
              </h3>
              <p className="text-sm text-ner-black/70 max-w-sm mx-auto leading-relaxed">
                {t.moodFeedbackPrefix} {getMoodLabel(submittedResponse.mood)}.
              </p>

              {consecutiveFlag >= 2 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono text-left flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{t.consecutiveNegativeAlert}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleDismissModal}
                className="mt-4 px-8 py-3 rounded-xl bg-ner-black text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85"
              >
                {t.btnEnterApp}
              </button>
            </div>
          ) : (
            /* Active Prompt View */
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
                  {t.wellbeingCheckInTitle}
                </span>
                <span className="text-[11px] text-ner-black/40 font-mono">{t.checkInModalPrompt}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ner-black mb-1">
                {t.wellbeingQuestion}
              </h2>
              <p className="text-ner-black/60 text-xs sm:text-sm mb-5">
                {t.encouragement}
              </p>

              {/* Voice Assistance & Narration */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWellVoiceOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-ner-terracotta text-white hover:bg-ner-terracotta/90 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                  title="Start interactive guided voice check-in"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Well Voice Guided Check-In</span>
                </button>
                <TTSButton
                  text={`${t.wellbeingQuestion} ${t.moodGood}, ${t.moodOkay}, ${t.moodWorried}, ${t.moodSad}, ${t.moodTired}.`}
                  label={t.listenAloud}
                  size="sm"
                />
              </div>

              {/* Mood Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {(Object.keys(MOOD_DEFINITIONS) as WellbeingMood[]).map((moodKey) => {
                  const item = MOOD_DEFINITIONS[moodKey];
                  const isSelected = selectedMood === moodKey;
                  const localizedLabel = getMoodLabel(moodKey);

                  return (
                    <button
                      key={moodKey}
                      type="button"
                      onClick={() => handleSelectMood(moodKey)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 text-left transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-ner-black text-white border-ner-black shadow-md'
                          : 'bg-white border-ner-border text-ner-black hover:border-ner-black/40'
                      }`}
                    >
                      <span className="text-3xl shrink-0">{item.emoji}</span>
                      <div>
                        <span className="font-bold text-sm block leading-tight">
                          {localizedLabel}
                        </span>
                        <span
                          className={`text-[11px] block mt-0.5 leading-snug ${
                            isSelected ? 'text-white/70' : 'text-ner-black/50'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional Quick Notes */}
              {selectedMood && (
                <div className="space-y-3 mb-5 animate-fade-in">
                  <div className="flex flex-wrap gap-1.5">
                    {quickNotes.map((note, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOptionalNote(note)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          optionalNote === note
                            ? 'bg-ner-terracotta text-white border-ner-terracotta font-semibold'
                            : 'bg-white border-ner-border text-ner-black/70 hover:border-ner-black'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={optionalNote}
                      onChange={(e) => setOptionalNote(e.target.value)}
                      placeholder="Add a short note or speak..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-ner-border text-xs focus:outline-none focus:border-ner-black"
                    />
                    <VoiceDictationButton
                      currentValue={optionalNote}
                      onTranscript={(t) => setOptionalNote(t)}
                      size="sm"
                      label="Dictate"
                    />
                  </div>
                </div>
              )}

              {/* Submit & Skip Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDismissModal}
                  className="text-xs font-mono font-semibold text-ner-black/50 hover:text-ner-black px-2 py-1"
                >
                  {t.remindMeLater}
                </button>

                <button
                  type="button"
                  disabled={!selectedMood}
                  onClick={() => handleSubmit()}
                  className="px-6 py-3 rounded-xl bg-ner-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-ner-black/85 disabled:opacity-40 shadow-md transition-all active:scale-95"
                >
                  ✓ {t.activitiesCompleted}
                </button>
              </div>
            </div>
          )}

          {/* Well Voice Assistant Modal */}
          <WellVoiceAssistant
            isOpen={isWellVoiceOpen}
            onClose={() => setIsWellVoiceOpen(false)}
            onCompleted={() => {
              setIsWellVoiceOpen(false);
              const list = getStoredWellbeingResponses();
              setHistoryList(list);
              if (list.length > 0) setSubmittedResponse(list[0]);
              setTimeout(() => {
                setModalOpen(false);
                if (onClose) onClose();
              }, 1500);
            }}
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. EMBEDDED PRESENTATION (Renders smoothly in Dashboard)
  // ---------------------------------------------------------------------------
  const latestResponse = historyList[0];

  return (
    <div 
      id="wellbeing-checkin-embedded"
      className="frost-card rounded-3xl p-6 sm:p-8 mb-8 border border-ner-border shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold">
              [ {t.wellbeingCheckInTitle} ]
            </span>
            {latestResponse && (
              <span className="text-[11px] font-mono text-ner-black/40">
                • {latestResponse.timestamp}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
            {t.wellbeingQuestion}, {t.patientName}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsWellVoiceOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-ner-terracotta text-white hover:bg-ner-terracotta/90 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            title="Start interactive guided voice check-in"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Well Voice</span>
          </button>
          <TTSButton
            text={`${t.wellbeingQuestion}, ${t.patientName}? ${t.moodGood}, ${t.moodOkay}, ${t.moodWorried}, ${t.moodSad}, ${t.moodTired}.`}
            label={t.listenAloud}
          />
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-2 rounded-2xl border border-ner-border hover:border-ner-black text-xs font-mono text-ner-black/70 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide' : t.recentCheckIns}</span>
          </button>
        </div>
      </div>

      {/* Confirmation feedback after check-in */}
      {submittedResponse && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-ner-sage text-ner-sage text-xs sm:text-sm font-mono font-bold flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              {t.moodFeedbackPrefix} {getMoodLabel(submittedResponse.mood)} ({submittedResponse.timestamp}).
            </span>
          </div>
          {consecutiveFlag >= 2 && (
            <span className="text-[11px] text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
              {t.consecutiveNegativeAlert}
            </span>
          )}
        </div>
      )}

      {/* Interactive Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {(Object.keys(MOOD_DEFINITIONS) as WellbeingMood[]).map((moodKey) => {
          const item = MOOD_DEFINITIONS[moodKey];
          const isSelected = selectedMood === moodKey || (!selectedMood && latestResponse?.mood === moodKey);
          const localizedLabel = getMoodLabel(moodKey);

          return (
            <button
              key={moodKey}
              type="button"
              onClick={() => {
                handleSelectMood(moodKey);
                // In embedded mode, selecting immediately saves and submits for seamless 1-tap UX
                const { response, consecutiveEval } = saveWellbeingResponse(
                  moodKey,
                  undefined,
                  activePatient.name,
                  2
                );
                recordCheckIn(moodKey);
                setSubmittedResponse(response);
                setConsecutiveFlag(consecutiveEval.streakCount);

                if (consecutiveEval.isFlagged) {
                  speakText(
                    `${t.moodFeedbackPrefix} ${localizedLabel}. ${t.consecutiveNegativeAlert}`
                  );
                }
              }}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-ner-black text-white border-ner-black shadow-md'
                  : 'bg-white border-ner-border text-ner-black hover:border-ner-black/50'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-xs font-bold text-center leading-tight">{localizedLabel}</span>
              <span
                className={`text-[10px] text-center leading-tight hidden sm:block ${
                  isSelected ? 'text-white/70' : 'text-ner-black/40'
                }`}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="mt-4 pt-4 border-t border-ner-border animate-fade-in">
          <h4 className="text-xs font-mono uppercase font-bold text-ner-black/50 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.recentCheckIns} ({historyList.length})</span>
          </h4>

          {historyList.length === 0 ? (
            <p className="text-xs text-ner-black/50 font-mono">No previous logs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
              {historyList.slice(0, 6).map((resp) => {
                const def = MOOD_DEFINITIONS[resp.mood] || MOOD_DEFINITIONS.okay;
                return (
                  <div
                    key={resp.id}
                    className="p-3 rounded-xl bg-white border border-ner-border flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{def.emoji}</span>
                      <div>
                        <span className="font-bold text-ner-black block">{getMoodLabel(resp.mood)}</span>
                        <span className="text-[10px] text-ner-black/40 block">{resp.timestamp}</span>
                      </div>
                    </div>
                    {resp.sentiment === 'negative' && (
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        flagged
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Well Voice Assistant Modal */}
      <WellVoiceAssistant
        isOpen={isWellVoiceOpen}
        onClose={() => setIsWellVoiceOpen(false)}
        onCompleted={() => {
          setIsWellVoiceOpen(false);
          const list = getStoredWellbeingResponses();
          setHistoryList(list);
          if (list.length > 0) setSubmittedResponse(list[0]);
        }}
      />
    </div>
  );
};
