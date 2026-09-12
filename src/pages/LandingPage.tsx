import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Users, 
  Stethoscope, 
  Clock, 
  CheckCircle,
  Play,
  Volume2,
  Calendar,
  Wifi
} from 'lucide-react';
import { NERLanguage } from '../types';

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

  const nerLanguages: { code: NERLanguage; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mni', name: 'Meitei', native: 'মৈতৈলোন্' },
    { code: 'kha', name: 'Khasi', native: 'Khasi' },
    { code: 'lus', name: 'Mizo', native: 'Mizo' },
    { code: 'nag', name: 'Nagamese', native: 'Nagamese' },
  ];

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
            <span>SIH 2026 • PS 26003</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-ner-black/60">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-ner-sage" /> Low-Bandwidth Mode
            </span>
            <span>•</span>
            <span>Guwahati {currentTime}</span>
          </div>
        </div>

        {/* Center: Massive Nothing-style Architectural Typography & Widget Placements */}
        <div className="max-w-7xl mx-auto w-full my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 Columns: Huge Typography */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-ner-terracotta font-bold block">
                [ smriticare — 01 ]
              </span>

              <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-ner-black leading-[0.95] uppercase">
                Helping every <br />
                memory stay <br />
                <span className="text-ner-terracotta">connected.</span>
              </h1>

              <p className="text-base sm:text-xl text-ner-black/70 font-light max-w-xl leading-relaxed pt-2">
                An AI-assisted cognitive wellness and memory companion designed specifically 
                for elderly communities across North Eastern India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartCare}
                  className="h-12 px-8 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <span>Start Patient Care</span>
                  <ArrowRight className="w-4 h-4 text-ner-terracotta" />
                </button>

                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="h-12 px-6 rounded-full frost-white-intense text-ner-black hover:border-ner-black/50 transition-all text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <span>Role Switcher</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-ner-sage"></span>
                </button>

                <TTSButton
                  text="Helping every memory stay connected. Welcome to SmritiCare, an AI-assisted cognitive platform for elderly dementia care in North Eastern India."
                  label="Listen"
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
                    Telemetry Node
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-ner-sage font-bold">
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ner-black text-white flex items-center justify-center font-mono text-sm font-bold shadow-sm">
                    NER
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ner-black">8 States Monitored</h3>
                    <p className="text-xs text-ner-black/60">Assam • Manipur • Meghalaya + 5</p>
                  </div>
                </div>
              </div>

              {/* Widget 2: Patient Session Preview */}
              <div className="frost-white-intense rounded-3xl p-5 border border-ner-border/90 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold">
                    Active Session
                  </span>
                  <span className="text-xs font-bold text-ner-terracotta font-mono">
                    86% Score
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ner-black">{activePatient.name}</h4>
                    <p className="text-xs text-ner-black/60 mt-0.5">3/5 Daily Activities Completed</p>
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

        {/* Anchored Signature Nothing Bottom Callout Card */}
        <div className="max-w-xl mx-auto w-full z-20">
          <div className="frost-white-intense rounded-3xl p-4 sm:p-5 shadow-2xl border border-ner-border/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-ner-black text-white flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-ner-terracotta" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                  cognitive care ( ner )
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-ner-black">
                  AI-Assisted Dementia Support
                </h4>
              </div>
            </div>

            <button
              onClick={() => setIsAICompanionOpen(true)}
              className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-transform active:scale-95"
            >
              Ask AI Demo
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE CHALLENGE (Monolith stat columns, Nothing style)           */}
      {/* ========================================================================= */}
      <section id="challenge" className="min-h-svh flex flex-col justify-center py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            [ problem statement ]
          </span>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-ner-black max-w-3xl">
            Cognitive care shouldn't depend on geography.
          </h2>
          <p className="text-base sm:text-xl text-ner-black/70 max-w-2xl mt-4 font-light leading-relaxed">
            In North Eastern India, rural topography creates immense barriers to 
            specialist clinics. Families need continuous cognitive therapy that respects 
            native dialects and cultural familiarities.
          </p>
        </div>

        {/* 4 Large Number Monolith Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-black tracking-tight block">
              24/7
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              Continuous Engagement
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              Gentle routine reminders, nostalgic games, and constant peace of mind at home.
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              Simulation Metric
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-terracotta tracking-tight block">
              04
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              Core Cognitive Activities
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              Memory Match, Sequence Recall, Word Association, and Picture Recognition.
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              Interactive Modules
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-black tracking-tight block">
              03
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              Distinct Care Roles
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              Customized interfaces for Elderly Patients, Family Caregivers, and Doctors.
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              Care Ecosystem
            </span>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all">
            <span className="text-5xl sm:text-7xl font-bold font-mono text-ner-sage tracking-tight block">
              07+
            </span>
            <h3 className="font-bold text-base text-ner-black mt-4">
              Regional Dialects
            </h3>
            <p className="text-xs text-ner-black/60 mt-1 leading-relaxed">
              Assamese, Bengali, Meitei, Khasi, Mizo, Nagamese, and English.
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ner-black/5 text-ner-black/50">
              Linguistic Care
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
            [ methodology ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Four steps to everyday cognitive vitality.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-terracotta">01</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">Personalize</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                Adaptive profiling tailors text size, contrast mode, preferred North Eastern 
                dialect, and familiar cultural motifs.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">⚙️</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-sage">02</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">Play</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                Daily 5-minute cognitive exercises based on visual memory, sequence recall, 
                and word association without clinical pressure.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">🧩</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-calmBlue">03</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">Track</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                Subtle engagement tracking across Memory, Attention, Recognition, and Sequence 
                provides encouragement to patients.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">📊</div>
          </div>

          <div className="frost-white-intense rounded-3xl p-8 flex flex-col justify-between hover:border-ner-black/50 transition-all">
            <div>
              <span className="font-mono text-lg font-bold text-ner-warmAmber">04</span>
              <h3 className="text-xl font-bold text-ner-black mt-3">Support</h3>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                Care Circle connects family members and remote geriatricians with 
                adherence status and wellbeing check-ins.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-ner-border/60 text-2xl">🤝</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: COGNITIVE ACTIVITIES (Product cards, Nothing style)             */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
              [ cognitive activities ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
              Cognitive games that feel familiar.
            </h2>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold font-mono uppercase tracking-widest text-ner-black hover:text-ner-terracotta transition-colors flex items-center gap-1.5"
          >
            <span>All Games Directory</span>
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
                  Visual Recall
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">Memory Match</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                Find matching pairs of beloved North Eastern heritage icons including 
                Kaziranga Rhinos, fresh tea garden leaves, and Bihu Dhols.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">5 Mins • 12 Cards</span>
              <button
                onClick={() => navigate('/games/memory')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">⭐</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-sage text-white font-semibold">
                  Pattern Reasoning
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">Sequence Recall</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                Observe sequential patterns of nature symbols, then reproduce the rhythmic order 
                at your own comfortable cadence.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">6 Mins • 3 Levels</span>
              <button
                onClick={() => navigate('/games/sequence')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">🍎</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-warmAmber text-white font-semibold">
                  Verbal Fluency
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">Word Connect</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                Identify natural conceptual links between everyday objects, fruits, and 
                regional landmarks to strengthen lexical memory.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">4 Mins • 5 Prompts</span>
              <button
                onClick={() => navigate('/games/words')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="frost-white-intense rounded-3xl p-8 hover:-translate-y-1 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">🧣</span>
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-ner-calmBlue text-white font-semibold">
                  Episodic Memory
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ner-black">Picture Recognition</h3>
              <p className="text-sm text-ner-black/70 mt-2 leading-relaxed">
                Connect images of handwoven textiles, state birds, and natural wonders 
                with nostalgic cultural narratives.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <span className="text-xs font-mono text-ner-black/60">5 Mins • 4 Items</span>
              <button
                onClick={() => navigate('/games/recognition')}
                className="h-10 px-5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: AI ASSISTANCE (Adaptive difficulty & simulated memory prompts) */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="frost-white-intense rounded-3xl p-8 sm:p-14 border-2 border-ner-black shadow-xl">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta text-xs font-mono font-bold">
              <Cpu className="w-4 h-4" />
              <span>AI-Assisted (Prototype Simulation)</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-ner-black tracking-tight">
              Simulated intelligence with deep human empathy.
            </h2>

            <p className="text-base sm:text-lg text-ner-black/75 leading-relaxed font-light">
              SmritiCare conceptually utilizes adaptive AI models to monitor cognitive fatigue, 
              modulate game speed dynamically, prompt daily memories, and summarize weekly 
              wellbeing indicators for distant family members.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">Adaptive Pacing</h4>
                <p className="text-xs text-ner-black/60 mt-1">Adjusts card timers if patient needs more time.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">Memory Prompts</h4>
                <p className="text-xs text-ner-black/60 mt-1">Gentle conversational reminders for daily tasks.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black">Caregiver Digest</h4>
                <p className="text-xs text-ner-black/60 mt-1">Plain-language wellness summaries without medical jargon.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsAICompanionOpen(true)}
                className="h-12 px-7 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
              >
                <span>Launch Interactive Companion Demo</span>
                <Sparkles className="w-3.5 h-3.5 text-ner-terracotta" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: DESIGNED FOR NER (Multilingual, Cultural, Low-bandwidth)       */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-ner-border/40">
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            [ regional inclusion ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Built for North Eastern India.
          </h2>
          <p className="text-base sm:text-lg text-ner-black/70 max-w-2xl mt-3 font-light">
            Designed to bridge linguistic, infrastructural, and digital accessibility gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Language selector preview */}
          <div className="lg:col-span-6 frost-white-intense rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-ner-terracotta uppercase font-bold">
              <Globe className="w-4 h-4" />
              <span>Interactive Language Demonstration</span>
            </div>
            <h3 className="text-2xl font-bold text-ner-black">
              Try switching regional dialects:
            </h3>
            <p className="text-xs text-ner-black/60">
              Tap any dialect below to update the entire interface greetings and labels.
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
                    {l.name}
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
                <h4 className="font-bold text-base text-ner-black">Low-Bandwidth Friendly</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  Engineered with lightweight SVGs and local state storage so that rural 
                  health sub-centers with intermittent 2G/3G connectivity can run smoothly.
                </p>
              </div>
            </div>

            <div className="frost-white-intense rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white border border-ner-border text-2xl shadow-sm">
                🎨
              </div>
              <div>
                <h4 className="font-bold text-base text-ner-black">Culturally Familiar Motifs</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  Games reference Gamosa, Hornbill, Rhinos, and Cheraw bamboo dances rather 
                  than alien symbols, creating natural nostalgic comfort.
                </p>
              </div>
            </div>

            <div className="frost-white-intense rounded-3xl p-6 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white border border-ner-border text-2xl shadow-sm">
                👴
              </div>
              <div>
                <h4 className="font-bold text-base text-ner-black">Elder-Centric Accessibility</h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  Target touch elements exceed 60px height. High contrast modes and built-in 
                  Text-To-Speech read instructions aloud with one touch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: FINAL CALLOUT SECTION BEFORE DARK FOOTER                      */}
      {/* ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-3">
          [ cognitive care • sih 2026 ]
        </span>
        <h2 className="text-4xl sm:text-7xl font-bold tracking-tight text-ner-black uppercase">
          Technology should help people remember what matters.
        </h2>
        <p className="text-base sm:text-xl text-ner-black/70 mt-6 max-w-2xl mx-auto font-light leading-relaxed">
          Experience the complete frontend care ecosystem crafted for elderly dementia patients, caregivers, and clinicians.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleStartCare}
            className="h-14 px-10 rounded-full bg-ner-black text-white hover:bg-ner-black/85 transition-all text-sm font-mono font-bold uppercase tracking-wider shadow-xl active:scale-95 flex items-center gap-2"
          >
            <span>Enter SmritiCare</span>
            <ArrowRight className="w-4 h-4 text-ner-terracotta" />
          </button>
        </div>
      </section>
    </div>
  );
};
