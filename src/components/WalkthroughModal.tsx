import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Sparkles, 
  BookOpen, 
  Brain, 
  Compass, 
  Clock, 
  HeartHandshake, 
  PhoneCall, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2 
} from 'lucide-react';

export const WalkthroughModal: React.FC = () => {
  const { isWalkthroughOpen, setIsWalkthroughOpen } = useRole();
  const { t } = useAccessibility();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWalkthroughOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWalkthroughOpen]);

  if (!isWalkthroughOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: t.walkthroughStep1Title,
      desc: t.walkthroughStep1Desc,
      icon: <Sparkles className="w-8 h-8 text-ner-terracotta" />,
      accentColor: 'bg-ner-terracotta/15 text-ner-terracotta border-ner-terracotta/30',
      badge: '01 // SMRITI CARE'
    },
    {
      stepNumber: 2,
      title: t.walkthroughStep2Title,
      desc: t.walkthroughStep2Desc,
      icon: <BookOpen className="w-8 h-8 text-ner-sage" />,
      accentColor: 'bg-ner-sage/15 text-ner-sage border-ner-sage/30',
      badge: '02 // MEMORIES'
    },
    {
      stepNumber: 3,
      title: t.walkthroughStep3Title,
      desc: t.walkthroughStep3Desc,
      icon: <Brain className="w-8 h-8 text-ner-calmBlue" />,
      accentColor: 'bg-ner-calmBlue/15 text-ner-calmBlue border-ner-calmBlue/30',
      badge: '03 // COGNITION'
    },
    {
      stepNumber: 4,
      title: t.walkthroughStep4Title,
      desc: t.walkthroughStep4Desc,
      icon: <Compass className="w-8 h-8 text-ner-terracotta" />,
      accentColor: 'bg-ner-terracotta/15 text-ner-terracotta border-ner-terracotta/30',
      badge: '04 // JOURNEY'
    },
    {
      stepNumber: 5,
      title: t.walkthroughStep5Title,
      desc: t.walkthroughStep5Desc,
      icon: <Clock className="w-8 h-8 text-ner-sage" />,
      accentColor: 'bg-ner-sage/15 text-ner-sage border-ner-sage/30',
      badge: '05 // REMINDERS'
    },
    {
      stepNumber: 6,
      title: t.walkthroughStep6Title,
      desc: t.walkthroughStep6Desc,
      icon: <HeartHandshake className="w-8 h-8 text-ner-calmBlue" />,
      accentColor: 'bg-ner-calmBlue/15 text-ner-calmBlue border-ner-calmBlue/30',
      badge: '06 // CARE CIRCLE'
    },
    {
      stepNumber: 7,
      title: t.walkthroughStep7Title,
      desc: t.walkthroughStep7Desc,
      icon: <PhoneCall className="w-8 h-8 text-ner-terracotta" />,
      accentColor: 'bg-red-500/15 text-red-600 border-red-500/30',
      badge: '07 // ASSISTANCE'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('smriti_walkthrough_completed', 'true');
    setIsWalkthroughOpen(false);
    setCurrentStep(0);
  };

  const current = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div 
      className="modal-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-modal-title"
    >
      <div className="modal-wrapper border-2 border-ner-black min-h-[460px]">
        {/* Modal Header */}
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ner-black/60 font-bold">
              {current.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="text-xs font-mono uppercase font-bold text-ner-black/60 hover:text-ner-black px-2.5 py-1 rounded-lg hover:bg-ner-black/5 transition-colors"
            >
              {t.walkthroughSkip}
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black transition-colors"
              aria-label="Close walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body my-auto py-6 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className={`w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-2xl flex items-center justify-center border-2 ${current.accentColor} shadow-inner`}>
            {current.icon}
          </div>

          <div className="space-y-3">
            <h2 id="walkthrough-modal-title" className="text-2xl sm:text-3xl font-bold text-ner-black tracking-tight">
              {current.title}
            </h2>
            <p className="text-sm sm:text-base text-ner-black/75 leading-relaxed font-normal">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress step dots */}
          <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep + 1} of ${steps.length}`}>
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  index === currentStep 
                    ? 'w-7 bg-ner-black' 
                    : index < currentStep
                      ? 'w-2.5 bg-ner-terracotta/70'
                      : 'w-2.5 bg-ner-border'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-3 rounded-xl border border-ner-border bg-white text-ner-black hover:bg-ner-offwhite font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-white ${
                isLastStep 
                  ? 'bg-ner-sage hover:bg-ner-sage/90 w-full sm:w-auto' 
                  : 'bg-ner-black hover:bg-ner-black/90'
              }`}
            >
              <span>{isLastStep ? t.walkthroughGetStarted : 'Next'}</span>
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
