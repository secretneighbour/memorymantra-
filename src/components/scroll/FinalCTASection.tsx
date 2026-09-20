import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboardPath } from '../auth/AuthGuard';
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
  const { role, setRole } = useRole();
  const { motion: contextMotion, t } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const scaleTransform = useTransform(scrollYProgress, [0.2, 0.9], [0.95, 1]);
  const opacityTransform = useTransform(scrollYProgress, [0.1, 0.8], [0.6, 1]);

  const { isAuthenticated, user } = useAuth();

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate(getRoleDashboardPath(user?.role || role));
    } else {
      navigate('/login');
    }
  };

  const handlePortalSelect = (targetRole: 'patient' | 'caregiver' | 'doctor', targetPath: string) => {
    setRole(targetRole);
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate(`/login?role=${targetRole}&redirect=${encodeURIComponent(targetPath)}`);
    }
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
          <span>{t.finalCtaBadge}</span>
        </div>

        {/* Large Monolithic Display Typography */}
        <motion.div
          style={isReduced ? {} : { scale: scaleTransform, opacity: opacityTransform }}
          className="space-y-4"
        >
          <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-ner-black/60 uppercase block">
            {t.appName}
          </span>

          <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-ner-black uppercase leading-[0.92]">
            {t.finalCtaTitleLine1} <br />
            <span className="text-ner-terracotta">{t.finalCtaTitleLine2}</span>
          </h2>

          <p className="text-base sm:text-2xl text-ner-black/75 max-w-2xl mx-auto font-light leading-relaxed pt-2">
            {t.finalCtaSubtitle}
          </p>
        </motion.div>

        {/* Main CTA Button */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExplore}
            className="h-14 sm:h-16 px-10 sm:px-12 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl active:scale-95 group"
          >
            <span>{isAuthenticated ? t.finalCtaButton : (t.navLogin ? `${t.navLogin} / ${t.start || 'Get Started'}` : 'Sign In / Get Started')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-ner-terracotta group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Portal Switcher Mini-Grid */}
        <div className="mt-14 pt-10 border-t border-ner-border/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handlePortalSelect('patient', '/patient')}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <Brain className="w-4 h-4 text-ner-terracotta mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">{t.finalCtaPatientPortal}</span>
            <span className="text-[10px] font-mono text-ner-black/50">{t.finalCtaPatientSub}</span>
          </button>

          <button
            onClick={() => handlePortalSelect('caregiver', '/caregiver')}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <HeartHandshake className="w-4 h-4 text-ner-sage mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">{t.finalCtaCaregiverHub}</span>
            <span className="text-[10px] font-mono text-ner-black/50">{t.finalCtaCaregiverSub}</span>
          </button>

          <button
            onClick={() => handlePortalSelect('doctor', '/doctor')}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <Stethoscope className="w-4 h-4 text-ner-calmBlue mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">{t.finalCtaClinicalView}</span>
            <span className="text-[10px] font-mono text-ner-black/50">{t.finalCtaClinicalSub}</span>
          </button>

          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/memory');
              } else {
                navigate('/login?redirect=%2Fmemory');
              }
            }}
            className="p-3.5 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black transition text-left group"
          >
            <FolderLock className="w-4 h-4 text-ner-warmAmber mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold block text-ner-black">{t.finalCtaMemoryVault}</span>
            <span className="text-[10px] font-mono text-ner-black/50">{t.finalCtaMemorySub}</span>
          </button>
        </div>
      </div>

      {/* Minimal Footer Credits */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] font-mono text-ner-black/40 pt-6">
        <span>{t.finalCtaCopyright}</span>
        <span>ACCESSIBILITY FIRST • OFFLINE FIRST</span>
      </div>
    </section>
  );
};
