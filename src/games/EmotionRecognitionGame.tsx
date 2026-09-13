import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { AdaptiveCognitiveEngine } from '../services/ai/adaptiveEngine';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Trophy, 
  Clock, 
  ArrowRight,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface EmotionPrompt {
  id: number;
  expression: string;
  emoji: string;
  situation: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

const EMOTION_PROMPTS: EmotionPrompt[] = [
  {
    id: 1,
    expression: "A warm, bright smile with crinkled eyes",
    emoji: "😊",
    situation: "Your granddaughter just arrived from Shillong with homemade sweet pitha.",
    correctAnswer: "Happy & Joyful",
    options: ["Happy & Joyful", "Worried", "Angry", "Tired"],
    explanation: "Smiles and relaxed eyes signify genuine joy and comfort."
  },
  {
    id: 2,
    expression: "Deep, calm, slow breathing with gentle, steady eyes",
    emoji: "😌",
    situation: "Sitting in the courtyard at sunset listening to birds chirping across the Brahmaputra.",
    correctAnswer: "Peaceful & Calm",
    options: ["Surprised", "Peaceful & Calm", "Sad", "Restless"],
    explanation: "Soft posture and a relaxed face indicate serenity and peace."
  },
  {
    id: 3,
    expression: "Wide open eyes and raised eyebrows in sudden wonder",
    emoji: "😲",
    situation: "Opening an old family trunk and finding a photograph of your wedding from 50 years ago.",
    correctAnswer: "Surprised & Delighted",
    options: ["Bored", "Angry", "Surprised & Delighted", "Sleepy"],
    explanation: "Raised eyebrows and wide eyes show unexpected surprise."
  },
  {
    id: 4,
    expression: "Gently drooping eyes and looking down quietly",
    emoji: "😔",
    situation: "Remembering an old friend who has moved far away to Delhi.",
    correctAnswer: "Thoughtful & Sad",
    options: ["Thoughtful & Sad", "Excited", "Cheerful", "Fearful"],
    explanation: "Quiet downcast glances are a natural sign of missing someone or gentle sorrow."
  },
  {
    id: 5,
    expression: "Yawning with heavy eyelids and a resting head",
    emoji: "😴",
    situation: "Finishing a hearty lunch of hot rice and tender dal in the warm afternoon breeze.",
    correctAnswer: "Sleepy & Tired",
    options: ["Frustrated", "Sleepy & Tired", "Alert", "Curious"],
    explanation: "Slow blinks and heavy eyelids show the body is ready for afternoon rest."
  }
];

export const EmotionRecognitionGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, recordActivityResult, recordGameCompletion } = useRole();
  const { speakText, t } = useAccessibility();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [gameElapsedSec, setGameElapsedSec] = useState(0);

  const currentPrompt = EMOTION_PROMPTS[currentIdx];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIdx]);

  const handleSelectOption = (option: string) => {
    if (isAnswerRevealed || isComplete) return;

    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const isCorrect = option === currentPrompt.correctAnswer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      speakText(`Wonderful! That is correct. ${currentPrompt.explanation}`);
    } else {
      speakText(`Not quite. The feeling is ${currentPrompt.correctAnswer}. ${currentPrompt.explanation}`);
    }
  };

  const handleNextPrompt = () => {
    if (currentIdx + 1 < EMOTION_PROMPTS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      // Game completed
      const totalTimeSec = Math.max(12, Math.round((Date.now() - startTime) / 1000) + currentIdx * 4);
      setGameElapsedSec(totalTimeSec);
      setIsComplete(true);

      const finalScore = Math.round(((correctCount + (selectedOption === currentPrompt.correctAnswer ? 1 : 0)) / EMOTION_PROMPTS.length) * 100);

      // Trigger celebration
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      // Record result to global role & telemetry state
      recordActivityResult({
        title: 'Emotion Recognition',
        gameType: 'emotion',
        score: finalScore,
        accuracy: finalScore,
        durationMinutes: Math.max(1, Math.round(totalTimeSec / 60)),
        responseTimeSeconds: parseFloat((totalTimeSec / EMOTION_PROMPTS.length).toFixed(1)),
        attempts: EMOTION_PROMPTS.length,
        mistakes: EMOTION_PROMPTS.length - (correctCount + (selectedOption === currentPrompt.correctAnswer ? 1 : 0))
      });
      recordGameCompletion('Emotion Recognition', finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setCorrectCount(0);
    setIsComplete(false);
    setStartTime(Date.now());
  };

  // Adaptive recommendation on completion
  const adaptation = AdaptiveCognitiveEngine.computeAdaptation(activePatient);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => navigate('/games')}
          className="px-4 py-2 rounded-full border border-ner-border hover:border-ner-black text-xs font-mono text-ner-black flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Games</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-ner-offwhite border border-ner-border text-ner-black">
            Round {currentIdx + 1} of {EMOTION_PROMPTS.length}
          </span>
          <TTSButton
            text={`How is this person feeling? ${currentPrompt.situation}.`}
            label="Listen"
          />
        </div>
      </div>

      {!isComplete ? (
        /* Active Game Card */
        <div className="frost-white-intense rounded-3xl p-6 sm:p-10 shadow-xl border border-ner-border/90">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
              [ Cognitive Gym • Emotion Recognition ]
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-ner-black">
              How does this feel?
            </h1>
            <p className="text-xs sm:text-sm text-ner-black/60 mt-1 font-mono">
              Recognizing human emotions stimulates social cognition and empathy pathways.
            </p>
          </div>

          {/* Emotional Scene Widget */}
          <div className="bg-ner-offwhite/80 rounded-3xl p-6 sm:p-8 border border-ner-border text-center max-w-xl mx-auto mb-8 shadow-inner">
            <span className="text-6xl sm:text-7xl block mb-4 animate-bounce">
              {currentPrompt.emoji}
            </span>
            <p className="text-base sm:text-xl font-bold text-ner-black leading-snug mb-3">
              "{currentPrompt.situation}"
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-white border border-ner-border text-xs font-mono text-ner-black/60">
              Clue: {currentPrompt.expression}
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto mb-8">
            {currentPrompt.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentPrompt.correctAnswer;

              let buttonStyle = "bg-white border-ner-border text-ner-black hover:border-ner-black";
              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  buttonStyle = "bg-emerald-100 border-ner-sage text-emerald-950 font-bold";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = "bg-rose-100 border-rose-400 text-rose-950 line-through";
                } else {
                  buttonStyle = "bg-white/50 border-ner-border text-ner-black/40";
                }
              }

              return (
                <button
                  key={opt}
                  disabled={isAnswerRevealed}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-5 rounded-2xl border-2 text-base sm:text-lg font-bold transition-all shadow-sm active:scale-95 text-left flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerRevealed && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-ner-sage shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation & Next Button */}
          {isAnswerRevealed && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white border border-ner-border animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="text-xs sm:text-sm text-ner-black/80">
                <strong>Insight:</strong> {currentPrompt.explanation}
              </div>
              <button
                onClick={handleNextPrompt}
                className="h-12 px-6 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase font-bold tracking-wider shrink-0 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{currentIdx + 1 < EMOTION_PROMPTS.length ? 'Next' : 'Finish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen with Adaptive AI Telemetry */
        <div className="frost-white-intense rounded-3xl p-8 sm:p-12 shadow-2xl border border-ner-border/90 text-center max-w-2xl mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-ner-sage flex items-center justify-center mx-auto mb-4 border border-ner-sage/20">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
            [ Session Completed ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ner-black mb-2">
            Beautiful Empathy, {activePatient.name}!
          </h2>
          <p className="text-sm sm:text-base text-ner-black/70 mb-8 max-w-md mx-auto">
            You accurately recognized how others feel and connected emotional cues smoothly.
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white border border-ner-border">
              <span className="text-xs font-mono uppercase text-ner-black/40 block">Score</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-ner-black">
                {Math.round((correctCount / EMOTION_PROMPTS.length) * 100)}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-ner-border">
              <span className="text-xs font-mono uppercase text-ner-black/40 block">Correct</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-ner-sage">
                {correctCount} / {EMOTION_PROMPTS.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-ner-border col-span-2 sm:col-span-1">
              <span className="text-xs font-mono uppercase text-ner-black/40 block">Time</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-ner-black">
                {gameElapsedSec}s
              </span>
            </div>
          </div>

          {/* AI Adaptive Difficulty Insight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-ner-offwhite to-white border border-ner-border text-left mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-ner-terracotta" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-ner-black">
                Adaptive AI Calibration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ner-black/75 leading-relaxed">
              {correctCount >= 4 
                ? "High empathy and emotional recognition accuracy observed. Calibrating memory sequence difficulty upward for tomorrow's morning journey."
                : "Gentle emotional reinforcement suggested. Continuing familiar family memory exercises."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-ner-border hover:border-ner-black text-xs font-mono uppercase font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => navigate('/patient')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
