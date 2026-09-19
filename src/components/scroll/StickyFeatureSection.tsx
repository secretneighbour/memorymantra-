import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  FolderLock, 
  Gamepad2, 
  Sparkles, 
  Clock, 
  Users, 
  LineChart, 
  ArrowRight, 
  CheckCircle2,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

interface FeatureItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  route: string;
  badge: string;
  accentColor: string;
  preview: {
    type: 'vault' | 'games' | 'companion' | 'reminders' | 'circle' | 'dashboard';
    title: string;
    metrics: { label: string; val: string }[];
  };
}

export const StickyFeatureSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { motion: contextMotion, t } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [activeIndex, setActiveIndex] = useState(0);

  const features: FeatureItem[] = [
    {
      id: 'vault',
      number: '01',
      title: t.feature1Title,
      tagline: t.feature1Tagline,
      description: t.feature1Desc,
      bullets: [
        t.feature1Bullet1,
        t.feature1Bullet2,
        t.feature1Bullet3
      ],
      route: '/memory',
      badge: t.feature1Badge,
      accentColor: '#DE4A30',
      preview: {
        type: 'vault',
        title: 'Brahmaputra Memories & Family Albums',
        metrics: [
          { label: 'Archived Memories', val: '24' },
          { label: 'Voice Recordings', val: '12' },
          { label: 'Security Tier', val: 'AES-256' },
        ],
      },
    },
    {
      id: 'games',
      number: '02',
      title: t.feature2Title,
      tagline: t.feature2Tagline,
      description: t.feature2Desc,
      bullets: [
        t.feature2Bullet1,
        t.feature2Bullet2,
        t.feature2Bullet3
      ],
      route: '/games',
      badge: t.feature2Badge,
      accentColor: '#10B981',
      preview: {
        type: 'games',
        title: 'Heritage Recall & Rhythm Match',
        metrics: [
          { label: 'Active Exercises', val: '9 Games' },
          { label: 'Adaptive Levels', val: 'Auto-Scaling' },
          { label: 'Today Completion', val: '88% Score' },
        ],
      },
    },
    {
      id: 'companion',
      number: '03',
      title: t.feature3Title,
      tagline: t.feature3Tagline,
      description: t.feature3Desc,
      bullets: [
        t.feature3Bullet1,
        t.feature3Bullet2,
        t.feature3Bullet3
      ],
      route: '/memory-companion',
      badge: t.feature3Badge,
      accentColor: '#E67E22',
      preview: {
        type: 'companion',
        title: 'Smriti Multilingual Companion',
        metrics: [
          { label: 'Dialects Supported', val: '8 Regional' },
          { label: 'Mode', val: 'Audio + Visual' },
          { label: 'Latency', val: '< 200ms' },
        ],
      },
    },
    {
      id: 'reminders',
      number: '04',
      title: t.feature4Title,
      tagline: t.feature4Tagline,
      description: t.feature4Desc,
      bullets: [
        t.feature4Bullet1,
        t.feature4Bullet2,
        t.feature4Bullet3
      ],
      route: '/reminders',
      badge: t.feature4Badge,
      accentColor: '#3B82F6',
      preview: {
        type: 'reminders',
        title: 'Morning Routine & Hydration Schedule',
        metrics: [
          { label: 'Scheduled Today', val: '4 Reminders' },
          { label: 'Adherence Rate', val: '96%' },
          { label: 'Next Due', val: '12:30 PM' },
        ],
      },
    },
    {
      id: 'circle',
      number: '05',
      title: t.feature5Title,
      tagline: t.feature5Tagline,
      description: t.feature5Desc,
      bullets: [
        t.feature5Bullet1,
        t.feature5Bullet2,
        t.feature5Bullet3
      ],
      route: '/caregiver',
      badge: t.feature5Badge,
      accentColor: '#8B5CF6',
      preview: {
        type: 'circle',
        title: 'Caregiver & Family Circle Network',
        metrics: [
          { label: 'Circle Members', val: '5 Family' },
          { label: 'New Photos', val: '+3 Today' },
          { label: 'Wellbeing Sync', val: 'Connected' },
        ],
      },
    },
    {
      id: 'dashboard',
      number: '06',
      title: t.feature6Title,
      tagline: t.feature6Tagline,
      description: t.feature6Desc,
      bullets: [
        t.feature6Bullet1,
        t.feature6Bullet2,
        t.feature6Bullet3
      ],
      route: '/caregiver',
      badge: t.feature6Badge,
      accentColor: '#DE4A30',
      preview: {
        type: 'dashboard',
        title: 'Cognitive Activity Telemetry',
        metrics: [
          { label: 'Weekly Vitality', val: '86%' },
          { label: 'Streak Days', val: '14 Days' },
          { label: 'Clinical Export', val: 'Ready' },
        ],
      },
    },
  ];

  const currentFeature = features[activeIndex];

  return (
    <section
      ref={containerRef}
      id="features-reveal"
      className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40 select-none"
    >
      {/* Section Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            {t.featuresBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
            {t.featuresTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ner-black/60 uppercase">
            {t.featuresLayerCount} {currentFeature.number} / {features.length}
          </span>
        </div>
      </div>

      {/* Sticky Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Feature Selector & Editorial Story */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Step Indicators */}
          <div className="grid grid-cols-6 gap-1.5 p-1.5 rounded-2xl frost-white-intense border border-ner-border">
            {features.map((f, index) => (
              <button
                key={f.id}
                onClick={() => setActiveIndex(index)}
                className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  activeIndex === index
                    ? 'bg-ner-black text-white shadow-sm'
                    : 'text-ner-black/60 hover:text-ner-black hover:bg-white/60'
                }`}
                title={f.title}
              >
                {f.number}
              </button>
            ))}
          </div>

          {/* Active Story Card */}
          <div className="frost-white-intense rounded-3xl p-6 sm:p-8 border border-ner-border/90 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span 
                className="text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider border"
                style={{
                  color: currentFeature.accentColor,
                  borderColor: `${currentFeature.accentColor}33`,
                  backgroundColor: `${currentFeature.accentColor}10`,
                }}
              >
                {currentFeature.badge}
              </span>
              <span className="text-2xl font-mono font-extrabold text-ner-black/20">
                {currentFeature.number}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-ner-black tracking-tight mb-2">
              {currentFeature.title}
            </h3>

            <p className="text-xs sm:text-sm font-mono text-ner-terracotta font-medium mb-4">
              {currentFeature.tagline}
            </p>

            <p className="text-xs sm:text-sm text-ner-black/75 leading-relaxed font-light mb-6">
              {currentFeature.description}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-ner-border/70">
              {currentFeature.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-ner-black/80">
                  <CheckCircle2 className="w-4 h-4 text-ner-sage shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-ner-border/70 flex items-center justify-between">
              <button
                onClick={() => navigate(currentFeature.route)}
                className="h-11 px-6 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Launch {currentFeature.title.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4 text-ner-terracotta" />
              </button>

              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % features.length)}
                className="text-xs font-mono font-bold text-ner-black/60 hover:text-ner-black flex items-center gap-1"
              >
                <span>Next Layer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Visual / Card Presentation */}
        <div className="lg:col-span-7">
          <div className="relative min-h-[480px] w-full rounded-3xl bg-ner-black text-white p-6 sm:p-10 border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Ambient background glow mapped to active feature */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: currentFeature.accentColor }}
            />
            <div className="absolute inset-0 dot-matrix-dark opacity-15 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.id}
                className="relative z-10 space-y-6"
                initial={
                  isReduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: 20,
                        scale: 0.96,
                        filter: 'blur(6px)',
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={
                  isReduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: -20,
                        scale: 0.96,
                        filter: 'blur(6px)',
                      }
                }
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: currentFeature.accentColor }}
                    >
                      {currentFeature.number === '01' && <FolderLock className="w-5 h-5" />}
                      {currentFeature.number === '02' && <Gamepad2 className="w-5 h-5" />}
                      {currentFeature.number === '03' && <Sparkles className="w-5 h-5" />}
                      {currentFeature.number === '04' && <Clock className="w-5 h-5" />}
                      {currentFeature.number === '05' && <Users className="w-5 h-5" />}
                      {currentFeature.number === '06' && <LineChart className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                        LAYER VISUALIZATION // {currentFeature.number}
                      </span>
                      <h4 className="font-bold text-base sm:text-lg text-white">
                        {currentFeature.preview.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-white/40">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Main Interactive Canvas / Feature Display */}
                <div className="py-4">
                  {currentFeature.id === 'vault' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
                        <span className="text-3xl block mb-2">📸</span>
                        <h5 className="font-bold text-xs text-white">Family Photos & Names</h5>
                        <p className="text-[11px] text-white/60 mt-1">Family gathering in Shillong</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
                        <span className="text-3xl block mb-2">🎙️</span>
                        <h5 className="font-bold text-xs text-white">Audio Reminiscence</h5>
                        <p className="text-[11px] text-white/60 mt-1">Mother’s Bihu song recording (Assamese)</p>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === 'games' && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-2xl block mb-1">🦏</span>
                        <span className="text-xs font-bold block text-white">Heritage Match</span>
                        <span className="text-[10px] font-mono text-ner-sage">Memory</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-2xl block mb-1">🥁</span>
                        <span className="text-xs font-bold block text-white">Rhythm Recall</span>
                        <span className="text-[10px] font-mono text-ner-warmAmber">Executive</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-2xl block mb-1">🍎</span>
                        <span className="text-xs font-bold block text-white">Word Connect</span>
                        <span className="text-[10px] font-mono text-ner-calmBlue">Language</span>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === 'companion' && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="p-3 rounded-xl bg-white/10 text-xs text-white/90">
                        <span className="font-mono text-[10px] text-ner-terracotta font-bold block mb-1">USER (SPOKEN)</span>
                        “Can you remind me what we planned for this afternoon?”
                      </div>
                      <div className="p-3 rounded-xl bg-ner-terracotta/20 border border-ner-terracotta/30 text-xs text-white">
                        <span className="font-mono text-[10px] text-ner-terracotta font-bold block mb-1">AI COMPANION</span>
                        “Of course. At 4:00 PM your family caregiver is coming over for warm tea and your daily word puzzle.”
                      </div>
                    </div>
                  )}

                  {currentFeature.id === 'reminders' && (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-ner-terracotta animate-pulse" />
                          <div>
                            <span className="text-xs font-bold block text-white">Blood Pressure Medicine</span>
                            <span className="text-[10px] font-mono text-white/60">10:00 AM • Due Now</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-ner-terracotta text-white font-mono text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-ner-sage" />
                          <div>
                            <span className="text-xs font-bold block text-white">Hydration & Water</span>
                            <span className="text-[10px] font-mono text-white/60">12:30 PM</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono text-[10px]">
                          UPCOMING
                        </span>
                      </div>
                    </div>
                  )}

                  {currentFeature.id === 'circle' && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ner-sage/20 text-ner-sage flex items-center justify-center font-bold font-mono">
                          VC
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Visitor (Caregiver)</span>
                          <span className="text-[10px] font-mono text-white/60">Primary Family Care Contact • Active</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-ner-sage">SYNCED</span>
                    </div>
                  )}

                  {currentFeature.id === 'dashboard' && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Cognitive Activity Trend (14-Day)</span>
                        <span className="text-xs font-mono text-ner-sage font-bold">+12% Stability</span>
                      </div>
                      <div className="h-16 w-full flex items-end gap-1.5 pt-2">
                        {[40, 55, 62, 58, 70, 78, 85, 80, 88, 84, 90, 86, 92, 94].map((h, i) => (
                          <div 
                            key={i} 
                            className="flex-1 rounded-t-sm transition-all"
                            style={{ 
                              height: `${h}%`,
                              backgroundColor: i === 13 ? '#DE4A30' : 'rgba(255, 255, 255, 0.3)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metrics Footer Strip */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  {currentFeature.preview.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <span className="text-[10px] font-mono uppercase text-white/50 block">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                        {m.val}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
