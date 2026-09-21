import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  MessageSquare, 
  Clock, 
  Users, 
  Sliders, 
  Globe, 
  WifiOff, 
  Sparkles, 
  Presentation,
  ShieldAlert
} from 'lucide-react';

export const USPSection: React.FC = () => {
  const { t } = useAccessibility();

  const pillars = [
    {
      number: '01',
      title: 'Personal Memories',
      desc: 'Reminiscence therapy grounded in familiar life photos, family voices, and personal milestones.',
      icon: <Heart className="w-5 h-5 text-ner-terracotta" />,
      accent: 'border-ner-terracotta/30 bg-ner-terracotta/5'
    },
    {
      number: '02',
      title: 'Adaptive Cognitive Suite',
      desc: '9 clinical exercises spanning visual recall, pattern finding, and sequence memory that adapt difficulty in real time.',
      icon: <Brain className="w-5 h-5 text-ner-sage" />,
      accent: 'border-ner-sage/30 bg-ner-sage/5'
    },
    {
      number: '03',
      title: 'AI Memory Companion',
      desc: 'Warm, conversational assistant providing gentle prompts, calming orientation, and interactive reminiscence.',
      icon: <MessageSquare className="w-5 h-5 text-ner-calmBlue" />,
      accent: 'border-ner-calmBlue/30 bg-ner-calmBlue/5'
    },
    {
      number: '04',
      title: 'Smart Routine Reminders',
      desc: 'Medication alerts, hydration checks, and routine anchors with 1-tap "I NEED HELP" fallback triggers.',
      icon: <Clock className="w-5 h-5 text-ner-terracotta" />,
      accent: 'border-ner-terracotta/30 bg-ner-terracotta/5'
    },
    {
      number: '05',
      title: 'Care Circle Telemetry',
      desc: 'Real-time caregiver notifications, longitudinal stability indices, and clinical doctor exports.',
      icon: <Users className="w-5 h-5 text-ner-sage" />,
      accent: 'border-ner-sage/30 bg-ner-sage/5'
    },
    {
      number: '06',
      title: 'Accessibility First & Simple UI',
      desc: '4-step fluid typography scaling, high contrast, reduced motion, and 1-tap Simple UI Mode for zero distraction.',
      icon: <Sliders className="w-5 h-5 text-ner-calmBlue" />,
      accent: 'border-ner-calmBlue/30 bg-ner-calmBlue/5'
    },
    {
      number: '07',
      title: '7 Regional Languages',
      desc: 'Full native inclusion in Assamese, Bengali, Meitei (Manipuri), Khasi, Mizo, Nagamese, and Hindi.',
      icon: <Globe className="w-5 h-5 text-ner-terracotta" />,
      accent: 'border-ner-terracotta/30 bg-ner-terracotta/5'
    },
    {
      number: '08',
      title: '100% Offline-First Core',
      desc: 'All cognitive activities, memory vaults, and local preferences remain fully functional with zero internet connection.',
      icon: <WifiOff className="w-5 h-5 text-ner-sage" />,
      accent: 'border-ner-sage/30 bg-ner-sage/5'
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-ner-border bg-ner-offwhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ner-border text-ner-terracotta font-mono text-xs uppercase font-bold tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.uspBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-ner-black tracking-tight leading-tight">
            {t.uspHeading}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-ner-black/75 leading-relaxed">
            {t.uspSubheading}
          </p>

          {/* Central USP Key Statement */}
          <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-ner-black shadow-lg">
            <p className="text-base sm:text-xl font-medium text-ner-black leading-relaxed italic">
              "{t.uspStatement}"
            </p>
          </div>
        </div>

        {/* 8 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {pillars.map(pillar => (
            <div
              key={pillar.number}
              className={`p-6 rounded-3xl border-2 transition-all hover:-translate-y-1 hover:shadow-md bg-white ${pillar.accent}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-ner-black/40">
                  {pillar.number} // PILLAR
                </span>
                <div className="p-2 rounded-xl bg-white border border-ner-border shadow-xs">
                  {pillar.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-ner-black mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-ner-black/70 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Presentation Pitch Deck Button & Medical Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-ner-black text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Presentation className="w-6 h-6 text-ner-sage" />
            </div>
            <div>
              <h4 className="text-lg font-bold tracking-tight">
                Explore the Memory Mantra Presentation Deck
              </h4>
              <p className="text-xs sm:text-sm text-white/70">
                10-slide comprehensive architectural and clinical overview for investors, caregivers & doctors.
              </p>
            </div>
          </div>

          <Link
            to="/presentation"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-ner-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-ner-offwhite transition-all shadow-md shrink-0 flex items-center justify-center gap-2 active:scale-95"
          >
            <Presentation className="w-4 h-4 text-ner-terracotta" />
            <span>Launch Presentation</span>
          </Link>
        </div>

        {/* Responsible Medical Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-ner-border flex items-start gap-3 text-xs text-ner-black/60">
          <ShieldAlert className="w-5 h-5 text-ner-terracotta shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-ner-black">Clinical & Safety Notice: </strong>
            {t.uspDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};
