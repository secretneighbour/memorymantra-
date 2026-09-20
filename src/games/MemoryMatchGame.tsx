import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memoryCardPairs, MemoryCardData } from '../data/gamesData';
import { useRole } from '../context/RoleContext';
import { useCurrentUser } from '../context/AuthContext';
import { TTSButton } from '../components/TTSButton';
import { SuccessCheckmark } from '../components/motion/MotionPrimitives';
import { 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface PlayCard extends MemoryCardData {
  uniqueId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useRole();
  const { displayName } = useCurrentUser();

  const [cards, setCards] = useState<PlayCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<PlayCard[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Initialize and shuffle 12 cards (6 pairs)
  const initializeGame = () => {
    const deck: PlayCard[] = [];
    memoryCardPairs.forEach((pair) => {
      deck.push({
        ...pair,
        id: `card-${pair.pairId}-a`,
        uniqueId: `${pair.pairId}-a`,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        ...pair,
        id: `card-${pair.pairId}-b`,
        uniqueId: `${pair.pairId}-b`,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCount(0);
    setAttempts(0);
    setTimeSeconds(0);
    setIsGameActive(true);
    setIsGameCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isGameActive && !isGameCompleted) {
      interval = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isGameCompleted]);

  // Card click handler
  const handleCardClick = (clickedCard: PlayCard) => {
    if (
      !isGameActive ||
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map((c) =>
      c.uniqueId === clickedCard.uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);

      const [first, second] = newFlipped;
      if (first.pairId === second.pairId) {
        // MATCH FOUND!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCards([]);
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);

          // Check if all 6 pairs matched (12 cards)
          if (newMatched === 6) {
            handleVictory();
          }
        }, 500);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  const handleVictory = () => {
    setIsGameActive(false);
    setIsGameCompleted(true);

    // Calculate accuracy score (6 pairs with perfect 6 attempts = 100%)
    const calculatedScore = Math.max(65, Math.min(98, Math.round((6 / Math.max(6, attempts + 1)) * 100 + 15)));
    setFinalScore(calculatedScore);

    recordGameCompletion('Heritage Memory Match', calculatedScore);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/games"
          className="frost-card px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold text-ner-black hover:border-ner-black/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Games</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <TTSButton
            text="Heritage Memory Match. Tap any card to turn it over, then find its matching pair. Take your time."
            label="Instructions"
            size="sm"
          />
          <button
            onClick={initializeGame}
            className="frost-card px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-ner-black hover:bg-black/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ner-terracotta" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Game Title & Metrics Bar */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta">
                Exercise 01 • Visual Recall
              </span>
              <span className="text-xs text-ner-black/40 font-mono">12 Cultural Cards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ner-black">
              Heritage Memory Match
            </h1>
            <p className="text-ner-black/60 text-sm mt-1">
              Find the matching pairs of North Eastern cultural treasures.
            </p>
          </div>

          {/* Live stats */}
          <div className="flex items-center gap-4 bg-ner-offwhite/80 p-3 rounded-2xl border border-ner-border">
            <div className="text-center px-3">
              <span className="text-[11px] uppercase tracking-wider text-ner-black/50 font-mono block">
                Matches
              </span>
              <span className="text-xl font-bold text-ner-black">{matchedCount} / 6</span>
            </div>
            <div className="h-8 w-px bg-ner-border"></div>
            <div className="text-center px-3">
              <span className="text-[11px] uppercase tracking-wider text-ner-black/50 font-mono block">
                Attempts
              </span>
              <span className="text-xl font-bold text-ner-black">{attempts}</span>
            </div>
            <div className="h-8 w-px bg-ner-border"></div>
            <div className="text-center px-3">
              <span className="text-[11px] uppercase tracking-wider text-ner-black/50 font-mono flex items-center justify-center gap-1">
                <Timer className="w-3 h-3 text-ner-terracotta" /> Time
              </span>
              <span className="text-xl font-bold font-mono text-ner-black">{formatTime(timeSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full bg-ner-border/40 h-2 rounded-full overflow-hidden">
          <div
            className="bg-ner-sage h-full transition-all duration-300 rounded-full"
            style={{ width: `${(matchedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* 12 Cards Grid (3x4 on desktop, 3x4 or 2x6 on mobile) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 select-none">
        {cards.map((card) => {
          return (
            <div
              key={card.uniqueId}
              onClick={() => handleCardClick(card)}
              className="perspective-1000 h-36 sm:h-44 cursor-pointer active:scale-95 transition-transform"
            >
              <div
                className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-2xl ${
                  card.isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Back of Card (Hidden side, showing elegant Nothing-inspired motif) */}
                <div className="absolute inset-0 backface-hidden frost-card rounded-2xl border-2 border-ner-border/80 flex flex-col items-center justify-center p-3 text-center hover:border-ner-black/40 transition-colors shadow-sm bg-white">
                  <div className="w-12 h-12 rounded-full bg-ner-offwhite border border-ner-border flex items-center justify-center mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-ner-terracotta animate-pulse" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ner-black/40">
                    TAP CARD
                  </span>
                </div>

                {/* Front of Card (Revealed side with symbol & cultural note) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 p-3.5 flex flex-col items-center justify-between text-center transition-colors shadow-md ${
                    card.isMatched
                      ? 'bg-emerald-50/90 border-ner-sage text-ner-black'
                      : 'bg-white border-ner-black text-ner-black'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{card.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-ner-black leading-tight">
                      {card.label}
                    </h4>
                    <p className="text-[10px] text-ner-black/60 line-clamp-1 mt-0.5">
                      {card.subtext}
                    </p>
                  </div>
                  {card.isMatched && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ner-sage font-mono">
                      <CheckCircle2 className="w-3 h-3" /> MATCH
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal */}
      {isGameCompleted && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-wrapper border-2 border-ner-black max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="modal-header">
              <SuccessCheckmark size={56} color="#10B981" className="mx-auto mb-3" />

              <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold">
                Cognitive Session Complete
              </span>

              <h2 className="text-2xl font-bold text-ner-black mt-1">
                Excellent work, {displayName}!
              </h2>

              <p className="text-ner-black/70 text-xs sm:text-sm mt-1">
                You exercised visual memory pathways with gentle precision.
              </p>
            </div>

            <div className="modal-body">
              {/* Score box */}
              <div className="my-2 p-5 rounded-2xl bg-white border border-ner-border flex items-center justify-around">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-ner-black/40 font-mono block">
                    Accuracy Score
                  </span>
                  <span className="text-3xl font-extrabold text-ner-terracotta">
                    {finalScore}%
                  </span>
                </div>
                <div className="h-10 w-px bg-ner-border"></div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-ner-black/40 font-mono block">
                    Total Time
                  </span>
                  <span className="text-2xl font-bold text-ner-black font-mono">
                    {formatTime(timeSeconds)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-ner-sage/10 rounded-xl text-xs font-semibold text-ner-sage border border-ner-sage/20 mt-3">
                ✨ "Your next activity is ready."
              </div>
            </div>

            <div className="modal-footer flex flex-col sm:flex-row gap-3">
              <button
                onClick={initializeGame}
                className="flex-1 py-3.5 px-4 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm hover:bg-black/5 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/games/sequence')}
                className="flex-1 py-3.5 px-4 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Next Activity</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
