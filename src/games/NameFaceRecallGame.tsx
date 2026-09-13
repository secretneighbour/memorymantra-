import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { RecommendationEngine } from '../services/ai/recommendationEngine';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, CheckCircle2, Sparkles, Trophy, ArrowRight, Heart } from 'lucide-react';

export const NameFaceRecallGame: React.FC = () => {
  const navigate = useNavigate();
  const { familyMembers, activePatient, recordActivityResult } = useRole();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const currentPerson = familyMembers[currentIndex % familyMembers.length];
  // Generate options including the correct person and other family members
  const allNames = familyMembers.map(f => f.name);

  const handleSelect = (name: string) => {
    if (isAnswerChecked) return;
    setSelectedName(name);
  };

  const handleCheck = () => {
    if (!selectedName || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedName === currentPerson.name;
    if (isCorrect) {
      setScore(prev => prev + 25);
    } else {
      setMistakes(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < familyMembers.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedName(null);
      setIsAnswerChecked(false);
    } else {
      const finalScore = Math.min(100, Math.max(60, Math.round(((score + 25) / 100) * 100)));
      const elapsedSeconds = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

      recordActivityResult({
        title: 'Name & Face Recall',
        gameType: 'name_face',
        score: finalScore,
        accuracy: finalScore,
        durationMinutes: 4,
        responseTimeSeconds: elapsedSeconds / familyMembers.length,
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
          title: 'Name & Face Recall',
          gameType: 'name_face',
          completedAt: 'Just now',
          score: 95,
          accuracy: 95,
          durationMinutes: 4,
          responseTimeSeconds: 1.8,
          attempts: 1,
          mistakes
        }
      ])
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ner-black/60 hover:text-ner-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cognitive Gym
        </Link>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-bold">
          [ Family Person {currentIndex + 1} of {familyMembers.length} ]
        </span>
      </div>

      {!isFinished ? (
        <div className="frost-card rounded-3xl p-6 sm:p-10 border-2 border-ner-border shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-rose-700 font-bold block mb-1">
                Personal Memory Therapy
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-ner-black">Who is this loving person?</h2>
            </div>
            <TTSButton text="Look at the photograph. Can you remember who this loving family member is?" label="Listen" />
          </div>

          {/* Photo & clue card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-ner-offwhite border-2 border-ner-border my-6">
            <img
              src={currentPerson.avatarUrl}
              alt="Family Member"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-white shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-ner-border text-xs font-mono text-ner-black/70 mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Family Circle
              </span>
              <p className="text-base sm:text-lg text-ner-black/80 italic font-serif">
                "{currentPerson.notes}"
              </p>
              <span className="text-xs font-mono text-ner-black/50 block mt-2">
                Lives in: {currentPerson.location}
              </span>
            </div>
          </div>

          {/* Name Options */}
          <div className="mt-8">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-black/50 block mb-3 font-bold">
              Choose the name:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allNames.map((name) => {
                const isSelected = selectedName === name;
                let btnStyle = 'bg-white border-ner-border text-ner-black hover:border-ner-black/50';

                if (isSelected) {
                  btnStyle = 'bg-ner-black text-white border-ner-black shadow-md';
                }

                if (isAnswerChecked) {
                  if (name === currentPerson.name) {
                    btnStyle = 'bg-emerald-100 border-ner-sage text-ner-sage font-bold';
                  } else if (isSelected && name !== currentPerson.name) {
                    btnStyle = 'bg-red-50 border-red-300 text-red-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    disabled={isAnswerChecked}
                    className={`p-5 rounded-2xl border-2 font-bold text-base sm:text-lg text-left flex items-center justify-between transition-all active:scale-98 ${btnStyle}`}
                  >
                    <span>{name}</span>
                    {isAnswerChecked && name === currentPerson.name && (
                      <CheckCircle2 className="w-6 h-6 text-ner-sage" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirmation note */}
          {isAnswerChecked && (
            <div className="mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase font-bold text-rose-600 block">
                  Family Connection
                </span>
                <p className="text-sm text-ner-black/80 mt-1">
                  That's right! This is your {currentPerson.relation.toLowerCase()}, {currentPerson.name}.
                </p>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
            <span className="text-xs font-mono text-ner-black/50">Personal family recognition</span>
            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedName}
                className="h-14 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                Confirm Name
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="h-14 px-8 rounded-2xl bg-ner-black hover:bg-ner-black/85 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>{currentIndex < familyMembers.length - 1 ? 'Next Person →' : 'Complete Exercise'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completion View */
        <div className="frost-card rounded-3xl p-8 sm:p-12 border-2 border-ner-border shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-6 shadow-inner">
            <Heart className="w-10 h-10 fill-rose-600" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-bold block mb-1">
            [ Family Memory Therapy Complete ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-ner-black">Beautiful, Ananya!</h2>
          <p className="text-base text-ner-black/70 mt-2 max-w-lg mx-auto">
            Remembering your family circle anchors warmth, safety, and cherished relationships.
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
