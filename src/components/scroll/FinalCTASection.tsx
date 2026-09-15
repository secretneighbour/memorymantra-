import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  HeartHandshake, 
  Stethoscope, 
  FolderLock
} from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { setRole } = useRole();
  const { motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const scaleTransform = useTransform(scrollYProgress, [0.2, 0.9], [0.95, 1]);
  const opacityTransform = useTransform(scrollYProgress, [0.1, 0.8], [0.6, 1]);

  const handleExplore = () => {
    setRole('patient');
    navigate('/patient');
  };

  return (
    <section
      ref={containerRef}
      id="final-cta"
      className="relative min-h-[90vh] min-h-svh flex flex-col justify-between py-24 sm:py-32 px-4 sm:px-8 overflow-hidden select-none"
    >
      {/* Dynamic Background Matrix Atmosphere */}
      <div className="absolute inset-0 dot-matrix-canvas opacity-40 pointer-events-none" />
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(222, 74, 48, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full text-center my-auto relative z-10">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full frost-white-intense border border-ner-border text-xs font-mono font-bold text-ner-black shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse" />
          <span>SMRITI CARE // 100% OFFLINE READY</span>
        </div>

        {/* Large Monolithic Display Typography */}
        <motion.div
          style={isReduced ? {} : { scale: scaleTransform, opacity: opacityTransform }}
          className="space-y-4"
        >
          <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-ner-black/60 uppercase block">
            SMRITI CARE
          </span>

          <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-ner-black uppercase leading-[0.92]">
            Cognitive Care, <br />
            <span className="text-ner-terracotta">Made Human.</span>
          </h2>

          <p className="text-base sm:text-2xl text-ner-black/75 max-w-2xl mx-auto font-light leading-relaxed pt-2">
            Designed around people, memories, and everyday care.
          </p>
        </motion.div>

        {/* Main CTA Button */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExplore}
            className="h-14 sm:h-16 px-10 sm:px-12 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl active:scale-95 group"
          >
            <span>EXPLORE SMRITI CARE</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-ner-terracotta group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Portal Switcher Mini-Grid */}
        <div className="mt-14 pt-10 border-t border-ner-border/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setRole('patient');
              navigate('/patient');
            }}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <Brain className="w-4 h-4 text-ner-terracotta mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">Patient Portal</span>
            <span className="text-[10px] font-mono text-ner-black/50">Daily games & routines</span>
          </button>

          <button
            onClick={() => {
              setRole('caregiver');
              navigate('/caregiver');
            }}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <HeartHandshake className="w-4 h-4 text-ner-sage mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">Caregiver Hub</span>
            <span className="text-[10px] font-mono text-ner-black/50">Trends & circle logs</span>
          </button>

          <button
            onClick={() => {
              setRole('doctor');
              navigate('/doctor');
            }}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <Stethoscope className="w-4 h-4 text-ner-calmBlue mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">Clinical View</span>
            <span className="text-[10px] font-mono text-ner-black/50">Longitudinal analytics</span>
          </button>

          <button
            onClick={() => navigate('/memory')}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <FolderLock className="w-4 h-4 text-ner-warmAmber mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">Memory Vault</span>
            <span className="text-[10px] font-mono text-ner-black/50">Archived recollections</span>
          </button>
        </div>
      </div>

      {/* Minimal Footer Credits */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] font-mono text-ner-black/40 pt-6">
        <span>© 2026 SMRITI CARE // NORTHEAST INDIA INITIATIVE</span>
        <span>ACCESSIBILITY FIRST • OFFLINE FIRST</span>
      </div>
    </section>
  );
};
