import React, { useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { HeroScrollSection } from '../components/scroll/HeroScrollSection';
import { MemoryNetwork } from '../components/scroll/MemoryNetwork';
import { StickyFeatureSection } from '../components/scroll/StickyFeatureSection';
import { HorizontalGamesSection } from '../components/scroll/HorizontalGamesSection';
import { AICompanionScrollSection } from '../components/scroll/AICompanionScrollSection';
import { MemoryWallSection } from '../components/scroll/MemoryWallSection';
import { InteractiveReminderSection } from '../components/scroll/InteractiveReminderSection';
import { CaregiverScrollDashboard } from '../components/scroll/CaregiverScrollDashboard';
import { RegionalAccessibilitySection } from '../components/scroll/RegionalAccessibilitySection';
import { USPSection } from '../components/scroll/USPSection';
import { FinalCTASection } from '../components/scroll/FinalCTASection';
import { ScrollReveal } from '../components/scroll/ScrollReveal';

export const LandingPage: React.FC = () => {
  const exploreRef = useRef<HTMLDivElement>(null);
  const { t } = useAccessibility();

  const handleScrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen selection:bg-ner-terracotta selection:text-white bg-ner-offwhite">
      {/* Step 3: Main Content Wrapper with 120px top spacer & 150px bottom clearance */}
      <div className="main-content-wrapper">
        {/* 01 // HERO SECTION */}
        <HeroScrollSection onScrollToExplore={handleScrollToExplore} />

        {/* 02 // SMRITI DIGITAL MEMORY INTERCONNECTED NETWORK */}
        <div ref={exploreRef}>
          <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
            <MemoryNetwork />
          </ScrollReveal>
        </div>

        {/* 02.5 // USP & CORE 8 PILLARS */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <USPSection />
        </ScrollReveal>

        {/* 03 // STICKY PRODUCT FEATURE LAYERS REVEAL */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <StickyFeatureSection />
        </ScrollReveal>

        {/* 04 // HORIZONTAL ADAPTIVE COGNITIVE GAMES SUITE */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <HorizontalGamesSection />
        </ScrollReveal>

        {/* 05 // COMPASSIONATE AI MEMORY COMPANION */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <AICompanionScrollSection />
        </ScrollReveal>

        {/* 06 // PERSONAL MEMORY WALL & REMINISCENCE VAULT */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <MemoryWallSection />
        </ScrollReveal>

        {/* 07 // SMART CHRONO REMINDERS */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <InteractiveReminderSection />
        </ScrollReveal>

        {/* 08 // CAREGIVER & CLINICAL TELEMETRY DASHBOARD */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <CaregiverScrollDashboard />
        </ScrollReveal>

        {/* 09 // REGIONAL ACCESSIBILITY & MULTILINGUAL INCLUSION */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <RegionalAccessibilitySection />
        </ScrollReveal>

        {/* 10 // FINAL MONOLITHIC CTA & PORTAL SWITCHER */}
        <ScrollReveal translateY={36} duration={0.8} threshold={0.1}>
          <FinalCTASection />
        </ScrollReveal>
      </div>

      {/* Step 5: Fixed Floating LISTEN ALOUD Element */}
      <div 
        className="listen-aloud-btn floating-listen-aloud" 
        role="region" 
        aria-label="Floating Listen Aloud Action"
      >
        <TTSButton
          text={t.ttsHeroIntro}
          label={t.btnListen}
          size="md"
        />
      </div>
    </div>
  );
};
