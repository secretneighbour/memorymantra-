import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pictureRecognitionQuestions, RecognitionQuestion } from '../data/gamesData';
import { useRole } from '../context/RoleContext';
import { TTSButton } from '../components/TTSButton';
import { 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { SuccessCheckmark } from '../components/motion/MotionPrimitives';

export const PictureRecognitionGame: React.FC = () => {
  const navigate = useNavigate();
  const { recordGameCompletion } = useRole();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ: RecognitionQuestion = pictureRecognitionQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNext = () => {
    if (currentIndex < pictureRecognitionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      recordGameCompletion('Northeast Heritage Recognition', score + (selectedAnswer === currentQ.correctAnswer ? 25 : 0));
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
      {/* Top bar */}
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
            text={`Object Recognition. ${currentQ.title}. ${currentQ.question}. Tap your answer.`}
            label="Read Aloud"
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

      {/* Main Picture Recognition Card */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-calmBlue/10 text-ner-calmBlue">
            Exercise 04 • Visual Recognition
          </span>
          <span className="text-xs text-ner-black/40 font-mono">
            Item {currentIndex + 1} of {pictureRecognitionQuestions.length}
          </span>
        </div>

        {/* Large Visual Icon Display */}
        <div className="my-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-ner-offwhite border-2 border-ner-border flex items-center justify-center text-6xl sm:text-7xl shadow-inner">
            {currentQ.imageEmoji}
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-ner-terracotta font-semibold mt-3 block">
            {currentQ.title}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-ner-black max-w-xl mx-auto">
          {currentQ.question}
        </h2>
        <p className="text-sm text-ner-black/60 mt-1 max-w-lg mx-auto">
          Scene note: {currentQ.sceneHint}
        </p>
      </div>

      {/* Options grid */}
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
              className={`p-5 sm:p-6 rounded-2xl border-2 font-bold text-lg sm:text-xl text-left transition-all duration-200 flex items-center justify-between shadow-sm active:scale-98 ${btnStyles}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-ner-sage" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
            </button>
          );
        })}
      </div>

      {/* Immediate Friendly Elder Explanation */}
      {isAnswered && (
        <div className="mt-8 max-w-2xl mx-auto p-6 rounded-2xl bg-white border border-ner-border shadow-md animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-ner-black flex items-center gap-1.5">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <>
                    <span className="text-ner-sage">Correct Recognition!</span>
                    <Sparkles className="w-4 h-4 text-ner-sage" />
                  </>
                ) : (
                  <span className="text-ner-terracotta">Familiar reminder:</span>
                )}
              </h4>
              <p className="text-sm text-ner-black/70 mt-1 leading-relaxed">
                {currentQ.elderExplanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0"
            >
              <span>{currentIndex < pictureRecognitionQuestions.length - 1 ? 'Next Picture' : 'Complete Session'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {isGameOver && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-wrapper border-2 border-ner-black max-w-md w-full text-center shadow-2xl">
            <div className="modal-header">
              <SuccessCheckmark size={56} color="#10B981" className="mx-auto mb-3" />

              <h2 className="text-2xl font-bold text-ner-black">
                Session Accomplished!
              </h2>
              <p className="text-ner-black/70 text-xs sm:text-sm mt-1">
                Visual and episodic memory pathways are refreshed and active.
              </p>
            </div>

            <div className="modal-body">
              <div className="my-2 p-4 rounded-2xl bg-white border border-ner-border">
                <span className="text-xs font-mono text-ner-black/40 uppercase tracking-widest block">Recognition Score</span>
                <span className="text-4xl font-extrabold text-ner-terracotta">{score}%</span>
              </div>
            </div>

            <div className="modal-footer flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm hover:bg-black/5"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/patient')}
                className="flex-1 py-3 px-4 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85 inline-flex items-center justify-center gap-1"
              >
                <span>Back to Daily Care</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
