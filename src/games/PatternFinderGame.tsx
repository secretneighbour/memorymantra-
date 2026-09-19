import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useCurrentUser } from '../context/AuthContext';
import { patternExercises } from '../data/marketItems';
import { RecommendationEngine } from '../services/ai/recommendationEngine';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Trophy, ArrowRight } from 'lucide-react';

export const PatternFinderGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, recordActivityResult } = useRole();
  const { displayName } = useCurrentUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise = patternExercises[currentIndex];

  const handleSelect = (label: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(label);
  };

  const handleCheck = () => {
    if (!selectedOption || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentExercise.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 33);
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < patternExercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Completed all exercises
      const finalScore = Math.min(100, Math.max(50, Math.round((score / 99) * 100)));
      const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

      recordActivityResult({
        title: 'Pattern Finder',
        gameType: 'pattern',
        score: finalScore,
        accuracy: finalScore,
        durationMinutes: 4,
        responseTimeSeconds: elapsedSeconds / patternExercises.length,
        attempts: 1,
        mistakes
      });

      setIsFinished(true);
    }
  };

  const recommendation = isFinished
    ? RecommendationEngine.getNextActivity(activePatient, [
        {
          id: 'temp',
          title: 'Pattern Finder',
          gameType: 'pattern',
          completedAt: 'Just now',
          score: 90,
          accuracy: 90,
          durationMinutes: 4,
          responseTimeSeconds: 2.1,
          attempts: 1,
          mistakes
        }
      ])
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ner-black/60 hover:text-ner-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cognitive Gym
        </Link>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
          [ Exercise {currentIndex + 1} of {patternExercises.length} ]
        </span>
      </div>

      {!isFinished ? (
        <div className="frost-card rounded-3xl p-6 sm:p-10 border-2 border-ner-border shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-1">
                Visual Reasoning
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-ner-black">What comes next in the pattern?</h2>
            </div>
            <TTSButton
              text="Look at the repeating pattern on screen. Choose the picture that naturally completes the sequence."
              label="Listen"
            />
          </div>

          {/* The Pattern Display Bar */}
          <div className="my-8 p-6 sm:p-8 rounded-2xl bg-ner-offwhite border-2 border-ner-border/90 flex flex-wrap items-center justify-center gap-3 sm:gap-6 shadow-inner">
            {currentExercise.sequence.map((item, idx) => {
              const isMissing = idx === currentExercise.missingIndex;
              return (
                <div
                  key={idx}
                  className={`w-16 h-20 sm:w-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                    isMissing
                      ? 'bg-amber-50 border-dashed border-ner-terracotta text-ner-terracotta animate-pulse'
                      : 'bg-white border-ner-border shadow-sm text-ner-black'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{isMissing ? '❓' : item.emoji}</span>
                  <span className="text-[11px] font-mono font-bold text-ner-black/60">
                    {isMissing ? 'Missing' : item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Options to choose from */}
          <div className="mt-8">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-black/50 block mb-3 font-bold">
              Choose your answer:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentExercise.options.map((opt) => {
                const isSelected = selectedOption === opt.label;
                let btnStyle = 'bg-white border-ner-border text-ner-black hover:border-ner-black/60';

                if (isSelected) {
                  btnStyle = 'bg-ner-black text-white border-ner-black shadow-lg';
                }

                if (isAnswerChecked) {
                  if (opt.label === currentExercise.correctAnswer) {
                    btnStyle = 'bg-emerald-100 border-ner-sage text-ner-sage font-bold';
                  } else if (isSelected && opt.label !== currentExercise.correctAnswer) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-700 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.label)}
                    disabled={isAnswerChecked}
                    className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${btnStyle}`}
                  >
                    <span className="text-4xl">{opt.emoji}</span>
                    <span className="text-sm font-bold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation after checking */}
          {isAnswerChecked && (
            <div className="mt-6 p-5 rounded-2xl bg-white border border-ner-border flex items-start gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-ner-terracotta shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase font-bold text-ner-terracotta block">
                  Pattern Insight
                </span>
                <p className="text-sm text-ner-black/80 mt-1">{currentExercise.ruleExplanation}</p>
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
            <span className="text-xs font-mono text-ner-black/50">Take your comfortable time</span>
            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className="h-14 px-8 rounded-2xl bg-ner-terracotta hover:bg-ner-terracottaDark disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-14 px-8 rounded-2xl bg-ner-black hover:bg-ner-black/85 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>{currentIndex < patternExercises.length - 1 ? 'Next Pattern →' : 'Finish Exercise'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completion Screen with Adaptive Recommendation */
        <div className="frost-card rounded-3xl p-8 sm:p-12 border-2 border-ner-border shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-ner-sage mx-auto flex items-center justify-center mb-6 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
            [ Cognitive Exercise Complete ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-ner-black">Wonderful job, {displayName}!</h2>
          <p className="text-base text-ner-black/70 mt-2 max-w-lg mx-auto">
            Your visual pattern reasoning was completed with great attention. Your results are safely recorded on your device.
          </p>

          {/* Next Recommended Activity Hero */}
          {recommendation && (
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-ner-black text-white text-left shadow-xl border border-white/10 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-1">
                Recommended Next Activity
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{recommendation.activityTitle}</h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-xl">
                {recommendation.reason}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(recommendation.route)}
                  className="h-12 px-6 rounded-xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <span>START {recommendation.activityTitle}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/patient"
                  className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center"
                >
                  Back to Journey
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
