import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { routineRecallQuestions } from '../data/routines';
import { RecommendationEngine } from '../services/ai/recommendationEngine';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles, Trophy, ArrowRight } from 'lucide-react';

export const RoutineRecallGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, recordActivityResult } = useRole();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = routineRecallQuestions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 34);
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < routineRecallQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      const finalScore = Math.min(100, Math.max(50, Math.round((score / 100) * 100)));
      const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

      recordActivityResult({
        title: 'Daily Routine Recall',
        gameType: 'routine',
        score: finalScore,
        accuracy: finalScore,
        durationMinutes: 3,
        responseTimeSeconds: elapsedSeconds / routineRecallQuestions.length,
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
          title: 'Daily Routine Recall',
          gameType: 'routine',
          completedAt: 'Just now',
          score: 92,
          accuracy: 92,
          durationMinutes: 3,
          responseTimeSeconds: 1.9,
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
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-ner-sage/20 text-ner-sage font-bold">
          [ Routine Question {currentIndex + 1} of {routineRecallQuestions.length} ]
        </span>
      </div>

      {!isFinished ? (
        <div className="frost-card rounded-3xl p-6 sm:p-10 border-2 border-ner-border shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
                Episodic Routine Orientation
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-ner-black">{currentQ.question}</h2>
            </div>
            <TTSButton text={currentQ.question} label="Listen Question" />
          </div>

          {/* Stimulus context card */}
          <div className="my-6 p-6 rounded-2xl bg-white border border-ner-border flex items-center gap-4 shadow-sm">
            <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
              ⏰
            </span>
            <div>
              <span className="text-xs font-mono uppercase text-ner-black/50 font-bold block">
                Routine Milestone
              </span>
              <h3 className="text-xl font-bold text-ner-black">{currentQ.stimulus}</h3>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3.5 my-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option;
              let style = 'bg-white border-ner-border text-ner-black hover:border-ner-black/50';

              if (isSelected) {
                style = 'bg-ner-black text-white border-ner-black shadow-md';
              }

              if (isAnswerChecked) {
                if (option === currentQ.correctAnswer) {
                  style = 'bg-emerald-100 border-ner-sage text-ner-sage font-bold';
                } else if (isSelected && option !== currentQ.correctAnswer) {
                  style = 'bg-red-50 border-red-300 text-red-600 opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswerChecked}
                  className={`w-full p-5 rounded-2xl border-2 text-left font-bold text-base sm:text-lg flex items-center justify-between transition-all active:scale-98 ${style}`}
                >
                  <span>{option}</span>
                  {isAnswerChecked && option === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-ner-sage" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after checking */}
          {isAnswerChecked && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-ner-sage/30 flex items-start gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-ner-sage shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase font-bold text-ner-sage block">
                  Daily Rhythm Anchor
                </span>
                <p className="text-sm text-ner-black/80 mt-1">{currentQ.explanation}</p>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
            <span className="text-xs font-mono text-ner-black/50">Gentle self-care recall</span>
            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className="h-14 px-8 rounded-2xl bg-ner-sage hover:bg-ner-sageDark disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                Confirm Choice
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-14 px-8 rounded-2xl bg-ner-black hover:bg-ner-black/85 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>{currentIndex < routineRecallQuestions.length - 1 ? 'Next Question →' : 'Complete Exercise'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completion View */
        <div className="frost-card rounded-3xl p-8 sm:p-12 border-2 border-ner-border shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-ner-sage mx-auto flex items-center justify-center mb-6 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
            [ Routine Recall Complete ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-ner-black">Wonderful, Ananya!</h2>
          <p className="text-base text-ner-black/70 mt-2 max-w-lg mx-auto">
            Anchoring your daily routine strengthens your independence and peace of mind.
          </p>

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
