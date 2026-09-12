import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wordAssociationQuestions, WordQuestion } from '../data/gamesData';
import { useRole } from '../context/RoleContext';
import { TTSButton } from '../components/TTSButton';
import { 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WordConnectGame: React.FC = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useRole();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ: WordQuestion = wordAssociationQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 20);
    }
  };

  const handleNext = () => {
    if (currentIndex < wordAssociationQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      recordGameCompletion('Brahmaputra Word Connect', score + (selectedAnswer === currentQ.correctAnswer ? 20 : 0));
      try {
        confetti({ particleCount: 75, spread: 65 });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
      {/* Navigation */}
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
            text={`Word Connect. The word is ${currentQ.stimulus}. ${currentQ.prompt}. Choose the best match.`}
            label="Read Question"
            size="sm"
          />
          <button
            onClick={handleRestart}
            className="frost-card px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-ner-black hover:bg-black/5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ner-terracotta" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Question Header Card */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta">
            Exercise 03 • Word Association
          </span>
          <span className="text-xs text-ner-black/40 font-mono">
            Word {currentIndex + 1} of {wordAssociationQuestions.length}
          </span>
        </div>

        {/* Big Stimulus Word */}
        <div className="my-6">
          <span className="text-xs uppercase font-mono tracking-widest text-ner-black/50 block mb-1">
            Focus on this concept
          </span>
          <div className="inline-block px-8 py-4 rounded-2xl bg-ner-black text-white font-mono text-3xl sm:text-4xl font-extrabold tracking-widest shadow-md">
            {currentQ.stimulus}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-ner-black max-w-xl mx-auto">
          {currentQ.prompt}
        </h2>
        <p className="text-xs text-ner-black/50 mt-1">
          Hint: {currentQ.categoryHint}
        </p>
      </div>

      {/* Accessible Big Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQ.correctAnswer;

          let btnStyles = "bg-white border-ner-border hover:border-ner-black text-ner-black";
          if (isAnswered) {
            if (isCorrect) {
              btnStyles = "bg-emerald-50 border-ner-sage text-emerald-900 ring-2 ring-ner-sage";
            } else if (isSelected && !isCorrect) {
              btnStyles = "bg-red-50 border-red-400 text-red-900";
            } else {
              btnStyles = "bg-white/50 border-ner-border/40 text-ner-black/40";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(option)}
              className={`p-6 rounded-2xl border-2 font-bold text-lg sm:text-xl text-left transition-all duration-200 flex items-center justify-between shadow-sm active:scale-98 ${btnStyles}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-ner-sage" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
            </button>
          );
        })}
      </div>

      {/* Immediate Friendly Feedback Strip */}
      {isAnswered && (
        <div className="mt-8 max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-ner-border shadow-md animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-ner-black flex items-center gap-1.5">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <span className="text-ner-sage">Wonderful!</span>
                    <Sparkles className="w-4 h-4 text-ner-sage" />
                  </>
                ) : (
                  <span className="text-ner-terracotta">Good try!</span>
                )}
              </h4>
              <p className="text-sm text-ner-black/70 mt-1 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>{currentIndex < wordAssociationQuestions.length - 1 ? 'Next Word' : 'See Results'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-ner-sage/10 text-ner-sage flex items-center justify-center mx-auto mb-4 border border-ner-sage/30">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-bold text-ner-black">
              Great Language Recall!
            </h2>
            <p className="text-ner-black/70 text-sm mt-2">
              You connected everyday concepts and stimulated verbal memory.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-white border border-ner-border">
              <span className="text-xs font-mono text-ner-black/40 uppercase tracking-widest block">Accuracy Score</span>
              <span className="text-4xl font-extrabold text-ner-terracotta">{score}%</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm hover:bg-black/5"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/games/recognition')}
                className="flex-1 py-3 px-4 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85 inline-flex items-center justify-center gap-1"
              >
                <span>Recognition Game</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
