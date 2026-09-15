import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { NERLanguage } from '../../types';
import { 
  Globe, 
  Volume2, 
  WifiOff, 
  Type, 
  SunMedium, 
  Eye, 
  Sparkles,
  Check
} from 'lucide-react';

export const RegionalAccessibilitySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, motion: contextMotion, speakText } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const languagesList: { code: NERLanguage; name: string; native: string; region: string }[] = [
    { code: 'en', name: 'English', native: 'English', region: 'Global & Clinical' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', region: 'Brahmaputra Valley' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'Barak Valley & Tripura' },
    { code: 'mni', name: 'Meitei', native: 'মৈতায়লোন্', region: 'Manipur & Imphal' },
    { code: 'kha', name: 'Khasi', native: 'Khasi', region: 'Meghalaya & Shillong' },
    { code: 'lus', name: 'Mizo', native: 'Mizo ṭawng', region: 'Mizoram & Aizawl' },
    { code: 'nag', name: 'Nagamese', native: 'Nagamese', region: 'Nagaland & Dimapur' },
  ];

  const accessibilityPillars = [
    {
      title: 'VOICE ASSISTANCE',
      desc: 'Hands-free navigation and audio narration across all screens for older adults with limited eyesight.',
      icon: <Volume2 className="w-5 h-5 text-ner-terracotta" />,
    },
    {
      title: 'OFFLINE-FIRST',
      desc: 'Zero mandatory cloud dependency. All games, audio synthesis, and records run locally on the device.',
      icon: <WifiOff className="w-5 h-5 text-ner-sage" />,
    },
    {
      title: 'LARGE TYPOGRAPHY',
      desc: 'High-legibility typography with scalable sizing (up to 130%) and generous touch targets.',
      icon: <Type className="w-5 h-5 text-ner-calmBlue" />,
    },
    {
      title: 'HIGH CONTRAST',
      desc: 'High-contrast black, white, and strategic red palette designed for maximum visual clarity.',
      icon: <SunMedium className="w-5 h-5 text-ner-warmAmber" />,
    },
    {
      title: 'REDUCED MOTION',
      desc: 'Respects vestibular sensitivities with gentle fades instead of jarring rotations or rapid motion.',
      icon: <Eye className="w-5 h-5 text-purple-500" />,
    },
  ];

  const handleSelectLanguage = (code: NERLanguage, nativeName: string) => {
    setLanguage(code);
    speakText(`Language changed to ${nativeName}.`, code);
  };

  return (
    <section
      ref={containerRef}
      id="regional-accessibility"
      className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40 select-none"
    >
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
          [ 09 // INCLUSIVE BY DESIGN ]
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
          Regional Accessibility
        </h2>
        <p className="text-sm sm:text-base text-ner-black/70 font-light mt-3 max-w-2xl mx-auto leading-relaxed">
          Crafted specifically for the diverse cultural and linguistic landscape of Northeast India, removing technological and language barriers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Flowing Language Cards Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-ner-black/60 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-ner-terracotta" />
              Supported Regional Dialects
            </span>
            <span className="text-xs font-mono text-ner-black/40">
              Tap to activate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languagesList.map((lang, idx) => {
              const isCurrent = language === lang.code;

              return (
                <motion.button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code, lang.native)}
                  initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                    isCurrent
                      ? 'bg-ner-black text-white border-ner-black shadow-lg scale-102 font-bold'
                      : 'frost-white-intense text-ner-black border-ner-border hover:border-ner-black/60 shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-base font-bold block">{lang.native}</span>
                    <span className={`text-[11px] font-mono block mt-0.5 ${isCurrent ? 'text-white/60' : 'text-ner-black/50'}`}>
                      {lang.name} • {lang.region}
                    </span>
                  </div>

                  {isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-ner-terracotta text-white flex items-center justify-center text-xs shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-ner-black/30">→</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5 Core Accessibility Pillars */}
        <div className="lg:col-span-6 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-ner-black/60 block mb-2">
            Universal Usability Pillars
          </span>

          {accessibilityPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={isReduced ? { opacity: 1 } : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-md flex items-start gap-4 hover:border-ner-black/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-ner-border flex items-center justify-center shrink-0 shadow-xs">
                {pillar.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-ner-black uppercase font-mono tracking-tight">
                  {pillar.title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
