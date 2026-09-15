import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Play, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Gamepad2, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface GameCard {
  id: string;
  name: string;
  shortDesc: string;
  domain: string;
  domainColor: string;
  icon: string;
  culturalAnchor: string;
  route: string;
  difficulty: string;
  accent: string;
}

export const HorizontalGamesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const games: GameCard[] = [
    {
      id: 'memory',
      name: 'Memory Match',
      shortDesc: 'Pair culturally rich motifs including one-horned rhinos, tea leaves, and traditional instruments.',
      domain: 'Working Memory',
      domainColor: '#DE4A30',
      icon: '🦏',
      culturalAnchor: 'Kaziranga & Assam Wildlife',
      route: '/games/memory',
      difficulty: 'Adaptive 2x2 to 4x4',
      accent: 'border-ner-terracotta/30',
    },
    {
      id: 'sequence',
      name: 'Sequence Recall',
      shortDesc: 'Listen to and recreate rhythmic patterns of the Bihu Dhol and Northeast regional percussion.',
      domain: 'Executive Processing',
      domainColor: '#10B981',
      icon: '🥁',
      culturalAnchor: 'Bihu Percussion & Beats',
      route: '/games/sequence',
      difficulty: 'Progressive Length',
      accent: 'border-ner-sage/30',
    },
    {
      id: 'pattern',
      name: 'Pattern Recognition',
      shortDesc: 'Trace traditional geometric weaves found in Muga silk and Gamosa textile borders.',
      domain: 'Visual-Spatial Attention',
      domainColor: '#E67E22',
      icon: '🧣',
      culturalAnchor: 'Eri & Muga Weaving',
      route: '/games/pattern',
      difficulty: 'Multi-Directional',
      accent: 'border-ner-warmAmber/30',
    },
    {
      id: 'object',
      name: 'Object Recognition',
      shortDesc: 'Identify beloved heritage utensils, brass Xorai, and flora with multi-lingual audio name cues.',
      domain: 'Semantic Memory',
      domainColor: '#3B82F6',
      icon: '🏛️',
      culturalAnchor: 'Assamese Brass & Artefacts',
      route: '/games/recognition',
      difficulty: 'Visual & Audio Prompts',
      accent: 'border-ner-calmBlue/30',
    },
    {
      id: 'routine',
      name: 'Daily Routine Recall',
      shortDesc: 'Sequence daily living milestones: morning tea, medication, afternoon stroll, and rest.',
      domain: 'Temporal Orientation',
      domainColor: '#8B5CF6',
      icon: '☀️',
      culturalAnchor: 'Everyday Daily Living',
      route: '/games/routine',
      difficulty: 'Step Ordering',
      accent: 'border-purple-500/30',
    },
    {
      id: 'emotion',
      name: 'Emotion Recognition',
      shortDesc: 'Connect facial expressions and voice intonations with emotional cues to maintain empathy.',
      domain: 'Social Cognition',
      domainColor: '#EC4899',
      icon: '🎭',
      culturalAnchor: 'Facial & Vocal Affect',
      route: '/games/emotion',
      difficulty: 'Contextual Scenarios',
      accent: 'border-pink-500/30',
    },
  ];

  // Scroll mapping for horizontal translation on desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const xTransform = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '-45%']);

  const handleNext = () => {
    setActiveCardIndex((prev) => Math.min(games.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setActiveCardIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <section
      ref={containerRef}
      id="cognitive-games"
      className="py-24 sm:py-32 px-4 sm:px-8 border-b border-ner-border/40 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            [ 04 // COGNITIVE SUITE ]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
            Culturally-Grounded Exercises
          </h2>
          <p className="text-sm sm:text-base text-ner-black/70 font-light mt-3 max-w-xl">
            Targeted neuro-stimulation games designed with familiar cultural cues, zero countdown stress, and soothing acoustic feedback.
          </p>
        </div>

        {/* Carousel / Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={activeCardIndex === 0}
            className="w-11 h-11 rounded-full frost-white-intense border border-ner-border flex items-center justify-center text-ner-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm active:scale-95"
            aria-label="Previous Game"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeCardIndex === games.length - 1}
            className="w-11 h-11 rounded-full frost-white-intense border border-ner-border flex items-center justify-center text-ner-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm active:scale-95"
            aria-label="Next Game"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/games')}
            className="h-11 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>All Hub</span>
            <ArrowRight className="w-3.5 h-3.5 text-ner-terracotta" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track Container with mobile touch snap support */}
      <div 
        className="relative w-full overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory sm:snap-none"
        tabIndex={0}
        role="region"
        aria-label="Cognitive Games Carousel"
      >
        <motion.div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 w-max px-2"
          style={
            isReduced
              ? {}
              : {
                  x: xTransform,
                  willChange: 'transform',
                }
          }
        >
          {games.map((game, index) => {
            const isActive = activeCardIndex === index;

            return (
              <motion.div
                key={game.id}
                onClick={() => setActiveCardIndex(index)}
                onMouseEnter={() => setActiveCardIndex(index)}
                className={`w-[275px] xs:w-[310px] sm:w-[360px] snap-center rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 relative select-none shrink-0 ${
                  isActive
                    ? 'frost-white-intense border-2 border-ner-black shadow-2xl scale-101 opacity-100'
                    : 'frost-white-low bg-white/80 border border-ner-border/90 shadow-md opacity-90 hover:opacity-100'
                }`}
                whileHover={{ y: -4 }}
              >
                {/* Top Badge and Icon */}
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-ner-border shadow-sm flex items-center justify-center text-2xl sm:text-3xl">
                      {game.icon}
                    </div>

                    <div className="text-right">
                      <span
                        className="text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold uppercase tracking-wider inline-block border"
                        style={{
                          color: game.domainColor,
                          borderColor: `${game.domainColor}33`,
                          backgroundColor: `${game.domainColor}10`,
                        }}
                      >
                        {game.domain}
                      </span>
                      <span className="text-[10px] font-mono text-ner-black/40 mt-1 block">
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Cultural Anchor */}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold block mb-1">
                    {game.culturalAnchor}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-ner-black tracking-tight">
                    {game.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-ner-black/75 mt-2 sm:mt-2.5 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                    {game.shortDesc}
                  </p>
                </div>

                {/* Bottom Launcher */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-ner-border/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-ner-black/60">
                    0{index + 1} / 0{games.length}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(game.route);
                    }}
                    className="min-h-[44px] px-4 sm:px-5 rounded-full bg-ner-black text-white hover:bg-ner-terracotta transition-colors text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-ner-terracotta" />
                    <span>Play</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCardIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              activeCardIndex === i ? 'w-8 bg-ner-black' : 'w-2 bg-ner-border hover:bg-ner-black/40'
            }`}
            aria-label={`Jump to game ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
