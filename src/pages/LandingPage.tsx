import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Cpu, 
  Play, 
  Wifi
} from 'lucide-react';
import { nerLanguages } from '../data/translations';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, setIsRoleModalOpen, setIsAICompanionOpen, activePatient } = useRole();
  const { language, setLanguage, t } = useAccessibility();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCare = () => {
    setRole('patient');
    navigate('/patient');
  };

  return (
    <div className="relative min-h-screen selection:bg-ner-terracotta selection:text-white">
      
      {/* ========================================================================= */}
      {/* SECTION 1: FIRST VIEWPORT (Full Screen 100svh, Nothing signature layout)   */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen min-h-svh flex flex-col justify-between pt-24 sm:pt-28 pb-4 sm:pb-6 px-4 sm:px-8 border-b border-ner-border/40 overflow-hidden">
        
        {/* Top Header Row in Viewport */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full frost-white-intense text-xs font-mono font-bold text-ner-black shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse"></span>
            <span>{t.sihBadge}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-ner-black/60">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-ner-sage" /> {t.lowBandwidth}
            </span>
            <span>•</span>
            <span>Guwahati {currentTime}</span>
          </div>
        </div>

        {/* Center: Architectural Typography & Widget Placements */}
        <div className="max-w-7xl mx-auto w-full my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 Columns: Huge Typography */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-ner-terracotta font-bold block">
                {t.heroSubtitle}
              </span>

              <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-ner-black leading-[0.95] uppercase">
                {t.heroTitleLine1} <br />
                {t.heroTitleLine2} <br />
                <span className="text-ner-terracotta">{t.heroTitleLine3}</span>
              </h1>

              <p className="text-base sm:text-xl text-ner-black/70 font-light max-w-xl leading-relaxed pt-2">
                {t.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartCare}
                  className="h-12 px-8 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <span>{t.btnStartPatientCare}</span>
                  <ArrowRight className="w-4 h-4 text-ner-terracotta" />
                </button>

                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="h-12 px-6 rounded-full frost-white-intense text-ner-black hover:border-ner-black/50 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <span>{t.btnRoleSwitcher}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-ner-sage"></span>
                </button>

                <TTSButton
                  text={t.ttsHeroIntro}
                  label={t.btnListen}
                  size="md"
                />
              </div>
            </div>

            {/* Right 4 Columns: Interactive Hardware Widget Nodes */}
            <div className="lg:col-span-4 flex flex-col gap-3 max-w-sm mx-auto w-full">
              {/* Widget 1: Regional Constellation Node */}
              <div className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold">
                    {t.telemetryNode}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-ner-sage font-bold">
                    {t.online}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ner-black text-white flex items-center justify-center font-mono text-sm font-bold shadow-sm">
                    NER
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ner-black">{t.widgetTelemetryTitle}</h3>
                    <p className="text-xs text-ner-black/60">{t.widgetTelemetrySubtitle}</p>
                  </div>
                </div>
              </div>

              {/* Widget 2: Patient Session Preview */}
              <div className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold">
                    {t.widgetSessionTitle}
                  </span>
                  <span className="text-xs font-bold text-ner-terracotta font-mono">
                    {t.widgetSessionScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ner-black">{activePatient.name}</h4>
                    <p className="text-xs text-ner-black/60 mt-0.5">{t.widgetSessionActivities}</p>
                  </div>
                  <Link
                    to="/patient"
                    className="w-9 h-9 rounded-full bg-ner-black text-white flex items-center justify-center hover:bg-ner-terracotta transition-colors"
                    title="Go to Patient Dashboard"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anchored Bottom Callout Card */}
        <div className="max-w-xl mx-auto w-full z-20">
          <div className="frost-white-intense rounded-3xl p-4 sm:p-5 shadow-2xl border border-ner-border/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-ner-black text-white flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-ner-terracotta" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                  {t.heroBottomTag}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-ner-black">
                  {t.heroBottomTitle}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setIsAICompanionOpen(true)}
              className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-transform active:scale-95"
            >
              {t.heroBottomBtn}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE CHALLENGE (Monolith stat columns)                          */}
      {/* ========================================================================= */}
      <section id="challenge" className="min-h-svh flex flex-col justify-center py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            {t.challengeTag}
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-ner-black max-w-3xl">
            {t.challengeTitle}
          </h2>
          <p className="text-base sm:text-xl text-ner-black/70 max-w-2xl mt-4 font-light leading-relaxed">
            {t.challengeDescription}
          </p>
        </div>

        {/* 4 Large Number Monolith Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-black tracking-tight block">
              {t.stat1Value}
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              {t.stat1Title}
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              {t.stat1Desc}
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              {t.stat1Tag}
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-terracotta tracking-tight block">
              {t.stat2Value}
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              {t.stat2Title}
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              {t.stat2Desc}
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              {t.stat2Tag}
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-black tracking-tight block">
              {t.stat3Value}
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              {t.stat3Title}
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              {t.stat3Desc}
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              {t.stat3Tag}
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-sage tracking-tight block">
              {t.stat4Value}
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              {t.stat4Title}
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              {t.stat4Desc}
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              {t.stat4Tag}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: HOW IT WORKS (01 Personalize, 02 Play, 03 Track, 04 Support)  */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            {t.methodologyTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.methodologyTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-terracotta">{t.step1Number}</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">{t.step1Title}</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">⚙️</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-sage">{t.step2Number}</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">{t.step2Title}</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">🧩</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-calmBlue">{t.step3Number}</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">{t.step3Title}</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">📊</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-warmAmber">{t.step4Number}</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">{t.step4Title}</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">🤝</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: COGNITIVE ACTIVITIES                                           */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
              {t.activitiesTag}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
              {t.activitiesTitle}
            </h2>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold font-mono uppercase tracking-widest text-ner-black hover:text-ner-terracotta transition-colors flex items-center gap-1.5"
          >
            <span>{t.allGamesDirectory}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Premium Product Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">🦏</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-black text-white font-semibold">
                  {t.game1Tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">{t.game1Title}</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                {t.game1Desc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">{t.game1Meta}</span>
              <button
                onClick={() => navigate('/games/memory')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.btnPlayNow}</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">⭐</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-sage text-white font-semibold">
                  {t.game2Tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">{t.game2Title}</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                {t.game2Desc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">{t.game2Meta}</span>
              <button
                onClick={() => navigate('/games/sequence')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.btnPlayNow}</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">🍎</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-warmAmber text-white font-semibold">
                  {t.game3Tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">{t.game3Title}</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                {t.game3Desc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">{t.game3Meta}</span>
              <button
                onClick={() => navigate('/games/words')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.btnPlayNow}</span>
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">🧣</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-calmBlue text-white font-semibold">
                  {t.game4Tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">{t.game4Title}</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                {t.game4Desc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">{t.game4Meta}</span>
              <button
                onClick={() => navigate('/games/recognition')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.btnPlayNow}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: AI ASSISTANCE                                                 */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="frost-white-intense rounded-3xl p-8 sm:p-14 border-2 border-ner-black shadow-xl">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta text-xs font-mono font-bold">
              <Cpu className="w-4 h-4" />
              <span>{t.aiTag}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-ner-black tracking-tight">
              {t.aiTitle}
            </h2>

            <p className="text-base sm:text-lg text-ner-black/75 leading-relaxed font-light">
              {t.aiDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">{t.aiFeature1Title}</h4>
                <p className="text-xs text-ner-black/60 mt-1">{t.aiFeature1Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">{t.aiFeature2Title}</h4>
                <p className="text-xs text-ner-black/60 mt-1">{t.aiFeature2Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">{t.aiFeature3Title}</h4>
                <p className="text-xs text-ner-black/60 mt-1">{t.aiFeature3Desc}</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsAICompanionOpen(true)}
                className="h-12 px-7 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
              >
                <span>{t.btnLaunchCompanion}</span>
                <Sparkles className="w-3.5 h-3.5 text-ner-terracotta" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: REGIONAL INCLUSION & INTERACTIVE LANGUAGE SELECTOR             */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            {t.nerTag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.nerTitle}
          </h2>
          <p className="text-base sm:text-lg text-ner-black/70 max-w-2xl mt-3 font-light">
            {t.nerDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Language selector preview */}
          <div className="lg:col-span-6 frost-white-intense rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-ner-terracotta uppercase font-bold">
              <Globe className="w-4 h-4" />
              <span>{t.demoLangHeader}</span>
            </div>
            <h3 className="text-2xl font-bold text-ner-black">
              {t.demoLangTitle}
            </h3>
            <p className="text-xs text-ner-black/60">
              {t.demoLangDesc}
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {nerLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    language === l.code
                      ? 'bg-ner-black text-white border-ner-black shadow-sm font-semibold'
                      : 'bg-white hover:border-ner-black/50 text-ner-black border-ner-border'
                  }`}
                >
                  <span className="text-xs font-bold block">{l.native}</span>
                  <span className={`text-[10px] ${language === l.code ? 'text-white/60' : 'text-ner-black/50'}`}>
                    {l.displayLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Infrastructure features */}
          <div className="lg:col-span-6 space-y-4">
            <div className="frost-white-intense rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white border border-ner-border text-2xl shadow-sm">
                📶
              </div>
              <div>
                <h4 className="font-bold text-base text-ner-black">{t.infra1Title}</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.infra1Desc}
                </p>
              </div>
            </div>

            <div className="frost-white-intense rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white border border-ner-border text-2xl shadow-sm">
                🎨
              </div>
              <div>
                <h4 className="font-bold text-base text-ner-black">{t.infra2Title}</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.infra2Desc}
                </p>
              </div>
            </div>

            <div className="frost-white-intense rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white border border-ner-border text-2xl shadow-sm">
                👴
              </div>
              <div>
                <h4 className="font-bold text-base text-ner-black">{t.infra3Title}</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.infra3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: FINAL CALLOUT SECTION                                          */}
      {/* ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-3">
          {t.ctaTag}
        </span>
        <h2 className="text-4xl sm:text-7xl font-bold tracking-tight text-ner-black uppercase">
          {t.ctaTitle}
        </h2>
        <p className="text-base sm:text-xl text-ner-black/70 mt-6 max-w-2xl mx-auto font-light leading-relaxed">
          {t.ctaDesc}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleStartCare}
            className="h-14 px-10 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-sm font-mono font-bold uppercase tracking-wider shadow-xl active:scale-95 flex items-center gap-2"
          >
            <span>{t.btnEnterApp}</span>
            <ArrowRight className="w-4 h-4 text-ner-terracotta" />
          </button>
        </div>
      </section>
    </div>
  );
};
