import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useCurrentUser } from '../context/AuthContext';
import { marketItemsList } from '../data/marketItems';
import { RecommendationEngine } from '../services/ai/recommendationEngine';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, CheckCircle2, Trophy, ArrowRight, Eye, ShoppingBag } from 'lucide-react';

export const MarketMemoryGame: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, recordActivityResult } = useRole();
  const { displayName } = useCurrentUser();

  // Pick 4 items from the market catalogue
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'study' | 'guess' | 'result'>('study');
  const [itemsToStudy] = useState(() => marketItemsList.slice(0, 4));
  const [missingItem] = useState(() => itemsToStudy[2]); // e.g. Chili or Coconut
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(90);
  const [isFinished, setIsFinished] = useState(false);

  const handleStudyReady = () => {
    setPhase('guess');
  };

  const handleSelectOption = (name: string) => {
    if (phase === 'result') return;
    setSelectedAnswer(name);
    setPhase('result');
    const isCorrect = name === missingItem.name;
    if (!isCorrect) {
      setScore(70);
    }
  };

  const handleFinish = () => {
    recordActivityResult({
      title: 'Remember the Market',
      gameType: 'market',
      score,
      accuracy: score,
      durationMinutes: 4,
      responseTimeSeconds: 2.3,
      attempts: 1,
      mistakes: score < 85 ? 1 : 0
    });
    setIsFinished(true);
  };

  const recommendation = isFinished
    ? RecommendationEngine.getNextActivity(activePatient, [
        {
          id: 'temp',
          title: 'Remember the Market',
          gameType: 'market',
          completedAt: 'Just now',
          score,
          accuracy: score,
          durationMinutes: 4,
          responseTimeSeconds: 2.3,
          attempts: 1,
          mistakes: score < 85 ? 1 : 0
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
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
          [ NER Cultural Recall Mode ]
        </span>
      </div>

      {!isFinished ? (
        <div className="frost-card rounded-3xl p-6 sm:p-10 border-2 border-ner-border shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold block mb-1">
                Heritage Grocery Recall
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-ner-black">Remember the Market</h2>
            </div>
            <TTSButton
              text={
                phase === 'study'
                  ? 'Study these four items on the market stall carefully. When you are ready, tap the button.'
                  : 'One item was taken from the market basket. Which item is missing?'
              }
              label="Listen"
            />
          </div>

          {phase === 'study' && (
            <div className="animate-fade-in">
              <p className="text-base text-ner-black/70 mb-6">
                Take your time to look at these 4 fresh items on the morning market stall:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-200">
                {itemsToStudy.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col items-center justify-center text-center gap-2"
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="text-base font-bold text-ner-black">{item.name}</span>
                    <span className="text-xs font-mono text-ner-black/50">{item.localNameAs}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleStudyReady}
                  className="h-14 px-10 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-mono font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
                >
                  <Eye className="w-5 h-5" />
                  <span>I Have Memorized Them • Ready!</span>
                </button>
              </div>
            </div>
          )}

          {phase === 'guess' && (
            <div className="animate-fade-in">
              <p className="text-base sm:text-lg font-bold text-ner-black mb-4">
                One item was taken from the market stall! Look at what remains:
              </p>

              {/* Remaining items with one empty slot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-200 mb-8">
                {itemsToStudy.map((item) => {
                  const isMissing = item.id === missingItem.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all ${
                        isMissing
                          ? 'bg-amber-100/50 border-dashed border-amber-400 text-amber-800'
                          : 'bg-white border-amber-200 shadow-sm'
                      }`}
                    >
                      <span className="text-5xl">{isMissing ? '❓' : item.emoji}</span>
                      <span className="text-sm font-bold">{isMissing ? 'Missing' : item.name}</span>
                    </div>
                  );
                })}
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-ner-black/50 block mb-3 font-bold">
                Which item is missing from the stall?
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {itemsToStudy.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectOption(item.name)}
                    className="p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-amber-800 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 text-ner-black"
                  >
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-sm font-bold">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'result' && (
            <div className="animate-fade-in text-center p-6 sm:p-8">
              {selectedAnswer === missingItem.name ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-ner-sage text-ner-sage mb-6">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">Correct! It was the {missingItem.name}!</h3>
                  <p className="text-sm text-ner-black/70 mt-1">
                    {missingItem.emoji} {missingItem.localNameAs} was indeed the missing item.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-400 text-amber-900 mb-6">
                  <h3 className="text-2xl font-bold">Good effort, {displayName}!</h3>
                  <p className="text-sm text-ner-black/70 mt-1">
                    The missing item was the {missingItem.name} {missingItem.emoji} ({missingItem.localNameAs}).
                  </p>
                </div>
              )}

              <button
                onClick={handleFinish}
                className="h-14 px-8 rounded-2xl bg-ner-black text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Complete Exercise
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion screen */
        <div className="frost-card rounded-3xl p-8 sm:p-12 border-2 border-ner-border shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center mb-6 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 font-bold block mb-1">
            [ Market Recall Complete ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-ner-black">Well done, {displayName}!</h2>
          <p className="text-base text-ner-black/70 mt-2 max-w-lg mx-auto">
            Culturally grounded memory exercises stimulate sensory and episodic retention.
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
