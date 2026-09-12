import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sequenceSymbols, SequenceItem } from '../data/gamesData';
import { useRole } from '../context/RoleContext';
import { TTSButton } from '../components/TTSButton';
import { 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SequenceRecallGame: React.FC = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useRole();

  const [level, setLevel] = useState<number>(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'round-success' | 'failed' | 'finished'>('idle');
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>('Watch the sequence carefully.');

  // Generate sequence for current level (Level 1 has 3 items, Level 2 has 4, Level 3 has 5)
  const startRound = (roundLevel: number) => {
    const length = roundLevel + 2; // e.g. Level 1 = 3 items
    const newSeq: number[] = [];
    for (let i = 0; i < length; i++) {
      const randomSymbolId = Math.floor(Math.random() * sequenceSymbols.length) + 1;
      newSeq.push(randomSymbolId);
    }

    setSequence(newSeq);
    setUserSequence([]);
    setGameState('showing');
    setMessage(`Level ${roundLevel}: Memorize the ${length} symbols...`);

    // Play sequence animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        setActiveHighlightIndex(newSeq[step]);
        setTimeout(() => setActiveHighlightIndex(null), 700);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveHighlightIndex(null);
          setGameState('playing');
          setMessage('Now repeat the sequence in the same order.');
        }, 500);
      }
    }, 1100);
  };

  const handleStart = () => {
    setLevel(1);
    setScore(0);
    setAttempts(0);
    startRound(1);
  };

  const handleSymbolClick = (symbolId: number) => {
    if (gameState !== 'playing') return;

    const nextExpected = sequence[userSequence.length];
    const newUserSeq = [...userSequence, symbolId];
    setUserSequence(newUserSeq);
    setAttempts((prev) => prev + 1);

    if (symbolId === nextExpected) {
      // Correct step
      if (newUserSeq.length === sequence.length) {
        // Round completed successfully!
        const pointsEarned = level * 30 + 10;
        setScore((prev) => prev + pointsEarned);

        if (level >= 3) {
          // Finished all 3 levels
          setGameState('finished');
          recordGameCompletion('Rhythm Sequence Recall', 90);
          try {
            confetti({ particleCount: 70, spread: 60 });
          } catch (e) {}
        } else {
          setGameState('round-success');
          setMessage(`Splendid! Level ${level} completed.`);
          setTimeout(() => {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            startRound(nextLevel);
          }, 1500);
        }
      }
    } else {
      // Mistake made
      setGameState('failed');
      setMessage('That was close! Let’s practice this sequence again together.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/games"
          className="frost-card px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold text-ner-black hover:border-ner-black/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Games</span>
        </Link>

        <div className="flex items-center gap-2">
          <TTSButton
            text="Sequence Recall Game. Memorize the pattern of symbols shown, then tap the symbols in the same order."
            label="Instructions"
            size="sm"
          />
          <button
            onClick={handleStart}
            className="frost-card px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-ner-black hover:bg-black/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ner-terracotta" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Game Card */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage">
                Exercise 02 • Reasoning & Sequence
              </span>
              <span className="text-xs text-ner-black/40 font-mono">Level {level} of 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ner-black">
              Rhythm Sequence Recall
            </h1>
            <p className="text-ner-black/60 text-sm mt-1">
              Watch the symbols light up, then repeat the same melody of symbols.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-ner-offwhite/80 p-3 rounded-2xl border border-ner-border">
            <div className="text-center px-3">
              <span className="text-[11px] uppercase tracking-wider text-ner-black/50 font-mono block">Level</span>
              <span className="text-xl font-bold text-ner-black">{level} / 3</span>
            </div>
            <div className="h-8 w-px bg-ner-border"></div>
            <div className="text-center px-3">
              <span className="text-[11px] uppercase tracking-wider text-ner-black/50 font-mono block">Score</span>
              <span className="text-xl font-bold text-ner-terracotta font-mono">{score}</span>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-ner-offwhite border border-ner-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-ner-terracotta" />
            <span className="text-sm font-semibold text-ner-black">{message}</span>
          </div>

          {gameState === 'idle' && (
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-xl bg-ner-black text-white hover:bg-ner-black/80 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Round</span>
            </button>
          )}
        </div>
      </div>

      {/* Big Interactive Symbol Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto my-10">
        {sequenceSymbols.map((item) => {
          const isGlowing = activeHighlightIndex === item.id;
          return (
            <button
              key={item.id}
              disabled={gameState !== 'playing'}
              onClick={() => handleSymbolClick(item.id)}
              className={`h-36 sm:h-44 rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-200 select-none shadow-sm ${
                isGlowing
                  ? 'scale-105 ring-4 ring-ner-terracotta border-ner-terracotta bg-ner-terracotta/20 shadow-xl'
                  : 'bg-white hover:border-ner-black/40 border-ner-border'
              } ${gameState === 'playing' ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-85'}`}
            >
              <span className="text-4xl sm:text-5xl mb-2">{item.symbol}</span>
              <span className="font-bold text-sm text-ner-black">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Failed Retry State */}
      {gameState === 'failed' && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-center animate-fade-in">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="font-bold text-ner-black text-lg">Let's Try That Again!</h3>
          <p className="text-xs text-ner-black/70 mt-1 mb-4">
            Practice makes memory stronger. Take a breath and let's watch the sequence once more.
          </p>
          <button
            onClick={() => startRound(level)}
            className="px-6 py-3 rounded-xl bg-ner-black text-white font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85"
          >
            Watch Sequence Again
          </button>
        </div>
      )}

      {/* Finished Modal */}
      {gameState === 'finished' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-ner-sage/10 text-ner-sage flex items-center justify-center mx-auto mb-4 border border-ner-sage/30">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-bold text-ner-black">
              Brilliant Memory!
            </h2>
            <p className="text-ner-black/70 text-sm mt-2">
              You successfully mastered all 3 levels of rhythmic sequence recall.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-white border border-ner-border">
              <span className="text-xs font-mono text-ner-black/40 uppercase tracking-widest block">Final Score</span>
              <span className="text-4xl font-extrabold text-ner-terracotta">{score} pts</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 py-3 px-4 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm hover:bg-black/5"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/games/words')}
                className="flex-1 py-3 px-4 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85 inline-flex items-center justify-center gap-1"
              >
                <span>Word Connect</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
