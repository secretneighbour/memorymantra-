import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TTSButton } from '../TTSButton';
import { 
  ArrowRight, 
  Wifi, 
  ChevronDown, 
  Sparkles,
  Activity,
  Heart
} from 'lucide-react';

interface HeroScrollSectionProps {
  onScrollToExplore: () => void;
}

export const HeroScrollSection: React.FC<HeroScrollSectionProps> = ({
  onScrollToExplore,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { setRole, setIsRoleModalOpen, setIsAICompanionOpen, activePatient } = useRole();
  const { t, motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax and fade transforms for Nothing-inspired scroll behavior
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0.4]);
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.4, 0]);
  const networkGraphicOpacity = useTransform(scrollYProgress, [0, 0.35, 0.85, 1], [0.15, 0.55, 0.65, 0.2]);
  const networkGraphicScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.15]);
  const bottomBarY = useTransform(scrollYProgress, [0, 0.5], ['0%', '60%']);
  const bottomBarOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleStartCare = () => {
    setRole('patient');
    navigate('/patient');
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen min-h-svh flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-4 sm:px-8 border-b border-ner-border/40 overflow-hidden select-none"
    >
      {/* Dynamic Background Abstract Neural & Memory Network Graphic */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
        style={
          isReduced
            ? { opacity: 0.25 }
            : {
                opacity: networkGraphicOpacity,
                scale: networkGraphicScale,
                willChange: 'transform, opacity',
              }
        }
        aria-hidden="true"
      >
        <svg
          className="w-full max-w-5xl h-auto aspect-square text-ner-black/20"
          viewBox="0 0 800 800"
          fill="none"
        >
          {/* Subtle concentric orbital nodes */}
          <circle cx="400" cy="400" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="400" cy="400" r="240" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="340" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 10" />

          {/* Radial interconnect rays */}
          <line x1="400" y1="400" x2="200" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="400" y1="400" x2="600" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="400" y1="400" x2="650" y2="400" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="400" y1="400" x2="600" y2="620" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="400" y1="400" x2="200" y2="620" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="400" y1="400" x2="150" y2="400" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />

          {/* Micro dots */}
          <circle cx="200" cy="180" r="4" fill="#DE4A30" />
          <circle cx="600" cy="180" r="4" fill="#10B981" />
          <circle cx="650" cy="400" r="4" fill="#DE4A30" />
          <circle cx="600" cy="620" r="4" fill="#3B82F6" />
          <circle cx="200" cy="620" r="4" fill="#E67E22" />
          <circle cx="150" cy="400" r="4" fill="#111111" />
          <circle cx="400" cy="400" r="6" fill="#DE4A30" />
        </svg>
      </motion.div>

      {/* Top Header Row in Viewport: System Telemetry Strip */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 relative">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm">
          <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse" />
          <span>SMRITI CARE // 2026.09</span>
          <span className="text-ner-black/40 hidden sm:inline">|</span>
          <span className="text-ner-black/60 hidden sm:inline">{t.sihBadge}</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-ner-black/70">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-ner-border/80 shadow-xs">
            <Wifi className="w-3.5 h-3.5 text-ner-sage" />
            <span>{t.lowBandwidth}</span>
          </span>
          <span className="hidden md:inline text-ner-black/30">•</span>
          <span className="hidden md:inline font-bold text-ner-black/80">Guwahati {currentTime}</span>
        </div>
      </div>

      {/* Center: Monolithic Editorial Typography & Action Hub */}
      <motion.div
        className="max-w-7xl mx-auto w-full my-auto py-8 sm:py-12 z-10 relative"
        style={
          isReduced
            ? {}
            : {
                y: titleY,
                opacity: titleOpacity,
                willChange: 'transform, opacity',
              }
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 8 Columns: Pure Nothing-inspired Typographic Power */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Super Header Tag */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta border border-ner-terracotta/20 font-mono text-[11px] uppercase tracking-widest font-bold inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ner-terracotta" />
                NEURO-COGNITIVE ASSISTIVE ECOSYSTEM
              </span>
              <span className="font-mono text-xs text-ner-black/50 hidden sm:inline">
                [ v2.4 ]
              </span>
            </div>

            {/* Wordmark & Main Tagline */}
            <div>
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest text-ner-black/60 uppercase mb-2">
                SMRITI CARE
              </h2>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-ner-black leading-[0.92] uppercase">
                Cognitive Care, <br />
                <span className="text-ner-terracotta">Made Human.</span>
              </h1>
            </div>

            {/* Supporting Text with scroll fade */}
            <motion.p
              className="text-base sm:text-xl text-ner-black/75 font-light max-w-xl leading-relaxed pt-1"
              style={isReduced ? {} : { opacity: taglineOpacity }}
            >
              Personalized memory-assisted cognitive care for older adults, families, and caregivers across Northeast India.
            </motion.p>

            {/* Interactive Tactile CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleStartCare}
                className="h-12 sm:h-13 px-6 sm:px-8 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl active:scale-95 group min-h-[44px]"
              >
                <span>{t.btnStartPatientCare}</span>
                <ArrowRight className="w-4 h-4 text-ner-terracotta group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="h-12 sm:h-13 px-5 sm:px-6 rounded-full frost-white-intense text-ner-black hover:border-ner-black/60 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 min-h-[44px]"
              >
                <span>Switch Portal</span>
                <span className="w-2 h-2 rounded-full bg-ner-sage animate-pulse" />
              </button>

              <div className="flex justify-center sm:justify-start">
                <TTSButton
                  text="SMRITI CARE. Cognitive Care, Made Human. Personalized memory-assisted cognitive care for older adults, families and caregivers."
                  label="Listen"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Minimalist Hardware / Telemetry Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 max-w-sm mx-auto w-full">
            
            {/* Widget 1: Digital Care Status Node */}
            <div className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-lg hover:border-ner-black/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-ner-terracotta" />
                  Telemetry Node 01
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-ner-black text-white flex items-center justify-center font-mono text-sm font-bold shadow-sm shrink-0">
                  NER
                </div>
                <div>
                  <h3 className="font-bold text-sm text-ner-black">Offline-First Engine</h3>
                  <p className="text-xs text-ner-black/60">Local audio & ML synthesis</p>
                </div>
              </div>
            </div>

            {/* Widget 2: Patient Session Telemetry */}
            <div className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-lg hover:border-ner-black/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-ner-terracotta" />
                  Active Profile
                </span>
                <span className="text-xs font-bold text-ner-terracotta font-mono">
                  {activePatient.stats.completedToday}/{activePatient.stats.totalToday} Done
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-ner-black">{activePatient.name}</h4>
                  <p className="text-xs text-ner-black/60 mt-0.5">{activePatient.stats.streakDays} Day Continuity Streak</p>
                </div>
                <button
                  onClick={() => navigate('/patient')}
                  className="w-10 h-10 rounded-full bg-ner-black text-white flex items-center justify-center hover:bg-ner-terracotta transition-colors shadow-sm"
                  title="Open Patient Portal"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget 3: AI Companion Quick Launcher */}
            <button
              onClick={() => setIsAICompanionOpen(true)}
              className="p-4 rounded-3xl bg-ner-black text-white flex items-center justify-between gap-3 text-left hover:bg-ner-black/85 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-ner-terracotta">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-ner-terracotta font-bold uppercase tracking-wider block">
                    AI Memory Assistant
                  </span>
                  <span className="text-xs font-bold text-white">Tap to converse in local language</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white/60 group-hover:text-white transition-colors">
                →
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll Cue Indicator */}
      <motion.div
        className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 pt-4"
        style={
          isReduced
            ? {}
            : {
                y: bottomBarY,
                opacity: bottomBarOpacity,
              }
        }
      >
        <button
          onClick={onScrollToExplore}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ner-black/60 hover:text-ner-black transition-colors group cursor-pointer"
        >
          <span className="w-6 h-6 rounded-full border border-ner-black/20 flex items-center justify-center group-hover:border-ner-black transition-colors">
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </span>
          <span>Scroll to explore ecosystem</span>
        </button>

        <span className="text-[11px] font-mono text-ner-black/40 hidden sm:inline">
          [ 01 / 10 • SMRITI ARCHITECTURE ]
        </span>
      </motion.div>
    </section>
  );
};
