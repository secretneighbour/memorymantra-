import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Home, 
  Sparkles, 
  Brain, 
  Heart, 
  MessageSquare, 
  Sliders, 
  MapPin, 
  Globe, 
  Award,
  Layers
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  speakerNotes: string;
}

export const PresentationPage: React.FC = () => {
  const { t } = useAccessibility();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const slides: Slide[] = [
    {
      id: 1,
      badge: '01 // EXECUTIVE VISION',
      title: 'SMRITI CARE',
      subtitle: 'Cognitive Care, Made Human.',
      icon: <Sparkles className="w-10 h-10 text-ner-terracotta" />,
      content: (
        <div className="space-y-6 text-center max-w-2xl mx-auto py-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-ner-terracotta/10 border border-ner-terracotta/20 text-ner-terracotta font-mono text-xs uppercase font-bold tracking-widest">
            Elderly Memory & Cognitive Care Ecosystem
          </div>
          <p className="text-xl sm:text-2xl font-light text-ner-black leading-relaxed">
            Bridging personal memories, clinical cognitive exercises, AI companion warmth, and trusted family circles.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ner-border">
            <div className="p-4 rounded-2xl bg-ner-offwhite border border-ner-border">
              <span className="text-2xl font-bold font-mono text-ner-black">7+</span>
              <span className="block text-xs font-mono text-ner-black/60 uppercase">NE Languages</span>
            </div>
            <div className="p-4 rounded-2xl bg-ner-offwhite border border-ner-border">
              <span className="text-2xl font-bold font-mono text-ner-black">9</span>
              <span className="block text-xs font-mono text-ner-black/60 uppercase">Clinical Games</span>
            </div>
            <div className="p-4 rounded-2xl bg-ner-offwhite border border-ner-border">
              <span className="text-2xl font-bold font-mono text-ner-black">100%</span>
              <span className="block text-xs font-mono text-ner-black/60 uppercase">Offline First</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'Introduce the core mission of Smriti Care: addressing the cognitive decline of elderly individuals through personalized, respectful technology.'
    },
    {
      id: 2,
      badge: '02 // THE PROBLEM',
      title: 'The Burden of Cognitive Decline & Regional Gaps',
      subtitle: 'Over 8.8 million elderly Indians suffer from dementia; North-Eastern regions face acute digital exclusion.',
      icon: <Layers className="w-10 h-10 text-ner-black" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="p-6 rounded-3xl bg-white border border-ner-border shadow-sm space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-red-600 block">
              Cognitive Isolation
            </span>
            <h4 className="text-lg font-bold text-ner-black">Fragmented Tools Fail the Elderly</h4>
            <p className="text-sm text-ner-black/70 leading-relaxed">
              Standard cognitive apps feel clinical, complex, and sterile. Elders get confused by busy interfaces, tiny text, and repetitive puzzles devoid of personal meaning.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-ner-border shadow-sm space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-ner-terracotta block">
              Linguistic & Connectivity Disconnect
            </span>
            <h4 className="text-lg font-bold text-ner-black">Absence of Regional Language Support</h4>
            <p className="text-sm text-ner-black/70 leading-relaxed">
              Existing digital health solutions ignore regional indigenous languages (Assamese, Manipuri, Khasi, Mizo) and crumble when internet connections drop in hilly terrains.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Highlight the unique combination of challenges: rapid population aging, emotional isolation, lack of localized tools, and poor internet penetration in remote regions.'
    },
    {
      id: 3,
      badge: '03 // THE SMRITI SOLUTION',
      title: 'Personalized Memory-Assisted Cognitive Care',
      subtitle: 'A single, unified platform connecting patient, family, caregiver, and doctor.',
      icon: <Heart className="w-10 h-10 text-ner-terracotta" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
            <div className="w-10 h-10 rounded-xl bg-ner-terracotta/15 text-ner-terracotta flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-ner-black">Memories</h4>
            <p className="text-xs text-ner-black/60 mt-1">Familiar family photos & voice narratives</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
            <div className="w-10 h-10 rounded-xl bg-ner-sage/15 text-ner-sage flex items-center justify-center mx-auto mb-2">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-ner-black">Cognitive Suite</h4>
            <p className="text-xs text-ner-black/60 mt-1">9 adaptive clinical memory games</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
            <div className="w-10 h-10 rounded-xl bg-ner-calmBlue/15 text-ner-calmBlue flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-ner-black">AI Companion</h4>
            <p className="text-xs text-ner-black/60 mt-1">Conversational reminiscence & calming chat</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-ner-black">Care Safety</h4>
            <p className="text-xs text-ner-black/60 mt-1">Emergency SMS & familiar landmarks</p>
          </div>
        </div>
      ),
      speakerNotes: 'Explain how Smriti Care is not just a game or a reminder app, but the complete synthesis centered around the human.'
    },
    {
      id: 4,
      badge: '04 // MEMORY VAULT',
      title: 'Reminiscence Therapy: Memory Vault',
      subtitle: 'Anchoring identity through familiar voices, photographs, and family bonds.',
      icon: <Heart className="w-10 h-10 text-ner-sage" />,
      content: (
        <div className="space-y-4 py-4 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ner-black text-base">Audio-Narrated Memories</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-ner-sage/20 text-ner-sage font-bold">Clinical Method</span>
            </div>
            <p className="text-xs sm:text-sm text-ner-black/75 leading-relaxed">
              Family members record oral histories and attach old photos. The built-in audio synthesis engine plays back comforting voice memories in the patient's native dialect.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ner-black text-base">Emotional Grounding</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-ner-terracotta/20 text-ner-terracotta font-bold">Dementia Anchor</span>
            </div>
            <p className="text-xs sm:text-sm text-ner-black/75 leading-relaxed">
              Reduces evening agitation (sundowning) by prompting familiar life achievements and recognizable family milestones.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Reminiscence therapy is clinically proven to improve mood, social interaction, and self-esteem in dementia patients.'
    },
    {
      id: 5,
      badge: '05 // ADAPTIVE COGNITIVE SUITE',
      title: '9 Clinical Exercises That Adapt Real-Time',
      subtitle: 'Targeting attention, memory span, sequence recall, pattern recognition, and executive function.',
      icon: <Brain className="w-10 h-10 text-ner-calmBlue" />,
      content: (
        <div className="grid grid-cols-3 gap-3 py-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Memory Match</span>
            <span className="text-ner-black/50 text-[10px]">Visual Recall</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Sequence Recall</span>
            <span className="text-ner-black/50 text-[10px]">Short-term Span</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Pattern Finder</span>
            <span className="text-ner-black/50 text-[10px]">Executive Logic</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Picture Recognition</span>
            <span className="text-ner-black/50 text-[10px]">Object Naming</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Routine Recall</span>
            <span className="text-ner-black/50 text-[10px]">Daily Sequences</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Emotion Recognition</span>
            <span className="text-ner-black/50 text-[10px]">Social Cognition</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Word Connect</span>
            <span className="text-ner-black/50 text-[10px]">Language Retention</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Market Memory</span>
            <span className="text-ner-black/50 text-[10px]">Working Memory</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-ner-border text-center">
            <span className="font-bold text-ner-black block">Name & Face</span>
            <span className="text-ner-black/50 text-[10px]">Facial Association</span>
          </div>
        </div>
      ),
      speakerNotes: 'Each game uses our Adaptive Cognitive Engine, dynamically adjusting challenge levels based on response time and mistakes without frustrating the patient.'
    },
    {
      id: 6,
      badge: '06 // CONVERSATIONAL AI',
      title: 'AI Companion & Living Articulated Mascot',
      subtitle: 'Gentle companionship powered by local heuristics, voice synthesis, and living avatar reactions.',
      icon: <MessageSquare className="w-10 h-10 text-ner-terracotta" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <h4 className="font-bold text-ner-black">Living Articulated Mascot</h4>
            <p className="text-xs text-ner-black/70 leading-relaxed">
              Interactive cat companion responds to petting, password eye toggles, and game completions with soft tactile micro-animations and purring sounds.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <h4 className="font-bold text-ner-black">Empathetic Memory Assistant</h4>
            <p className="text-xs text-ner-black/70 leading-relaxed">
              Engages in calm, repetitive reminiscing without judgment. Answers questions like "Where is Rohan?" or "What medicine do I take next?"
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Showcase how the companion mitigates loneliness and offers a reassuring presence between family visits.'
    },
    {
      id: 7,
      badge: '07 // ACCESSIBILITY ENGINEERING',
      title: 'Simple UI Mode & Fluid Font Scaling',
      subtitle: 'Engineered specifically for elderly motor and visual impairment.',
      icon: <Sliders className="w-10 h-10 text-ner-black" />,
      content: (
        <div className="space-y-4 py-4 max-w-2xl mx-auto">
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <span className="text-xs font-mono font-bold text-ner-terracotta uppercase">1-Tap Simple UI Mode</span>
            <p className="text-xs sm:text-sm text-ner-black/70 leading-relaxed">
              Strips away all graphs, secondary badges, and numbers. Replaces the dashboard with 5 large, high-contrast, distraction-free touch cards.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <span className="text-xs font-mono font-bold text-ner-sage uppercase">4-Step Typography & High Contrast</span>
            <p className="text-xs sm:text-sm text-ner-black/70 leading-relaxed">
              Small, Normal, Large, and Extra-Large settings scale all text, cards, and buttons fluidly across the application without breaking layouts.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Explain how accessibility is not an afterthought but the primary design driver of the entire application.'
    },
    {
      id: 8,
      badge: '08 // SAFETY & ORIENTATION',
      title: 'Important Places Map & Emergency SMS',
      subtitle: 'Privacy-first regional orientation and immediate family assistance triggers.',
      icon: <MapPin className="w-10 h-10 text-ner-terracotta" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <h4 className="font-bold text-ner-black">Privacy-First Landmark Map</h4>
            <p className="text-xs text-ner-black/70 leading-relaxed">
              Zero continuous background GPS tracking. Displays familiar landmarks (home, doctor clinic, pharmacy, daughter's house) stored strictly on device.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border space-y-2">
            <h4 className="font-bold text-ner-black">Emergency SMS Dispatch</h4>
            <p className="text-xs text-ner-black/70 leading-relaxed">
              Explicit 1-tap SMS triggers with native device messenger fallback (`sms:`) and transparent simulated demo alerts for safety testing.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Detail our privacy stance: we do not track elders relentlessly. Instead, we give them landmark memory anchors and a direct lifeline to their primary caregiver.'
    },
    {
      id: 9,
      badge: '09 // LINGUISTIC INCLUSION',
      title: 'Multilingual Regional Inclusion & Offline Core',
      subtitle: 'Native support for 7 languages with 100% offline functionality.',
      icon: <Globe className="w-10 h-10 text-ner-sage" />,
      content: (
        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {['English', 'অসমীয়া (Assamese)', 'বাংলা (Bengali)', 'ꯃꯤꯇꯩꯂꯣꯟ (Meitei)', 'Khasi', 'Mizo', 'Nagamese', 'हिन्दी (Hindi)'].map(lang => (
              <span key={lang} className="px-3.5 py-1.5 rounded-xl bg-white border border-ner-border font-mono text-xs font-bold text-ner-black">
                {lang}
              </span>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border text-center max-w-xl mx-auto mt-4">
            <span className="text-xs font-mono font-bold text-ner-black/60 uppercase block mb-1">
              Zero-Cloud Dependency Architecture
            </span>
            <p className="text-xs sm:text-sm text-ner-black/75 leading-relaxed">
              All core memory vaults, clinical exercises, reminders, and accessibility features execute locally on device. Works continuously without internet access.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Demonstrate that no regional elder is left behind due to language barriers or patchy hill-station internet.'
    },
    {
      id: 10,
      badge: '10 // CLINICAL ROADMAP',
      title: 'Clinical Telemetry & Next Milestones',
      subtitle: 'Empowering families and clinicians with longitudinal cognitive stability indicators.',
      icon: <Award className="w-10 h-10 text-ner-terracotta" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-center">
          <div className="p-5 rounded-2xl bg-white border border-ner-border">
            <span className="text-xl font-bold font-mono text-ner-black">Phase 1</span>
            <h5 className="font-bold text-sm text-ner-black mt-1">Core Experience</h5>
            <p className="text-xs text-ner-black/60 mt-1">9 Games, Memory Vault, Simple UI, 7 Languages (Completed)</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border">
            <span className="text-xl font-bold font-mono text-ner-sage">Phase 2</span>
            <h5 className="font-bold text-sm text-ner-black mt-1">Clinical Trials</h5>
            <p className="text-xs text-ner-black/60 mt-1">Pilot evaluations in Guwahati GMCH Neurological wards</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-ner-border">
            <span className="text-xl font-bold font-mono text-ner-calmBlue">Phase 3</span>
            <h5 className="font-bold text-sm text-ner-black mt-1">Wearables & Audio</h5>
            <p className="text-xs text-ner-black/60 mt-1">Heart rate stability correlation & on-device voice model training</p>
          </div>
        </div>
      ),
      speakerNotes: 'Conclude with our long-term vision: making dignified, human-centered cognitive care accessible to every household.'
    }
  ];

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const active = slides[currentSlide];

  return (
    <div className="min-h-screen bg-ner-offwhite flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Deck Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-ner-border/70 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 rounded-xl bg-white border border-ner-border flex items-center justify-center text-ner-black hover:bg-ner-black hover:text-white transition-all shadow-xs"
            title="Return to Home"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ner-terracotta tracking-widest block">
              Smriti Care Pitch Deck
            </span>
            <span className="text-sm font-bold text-ner-black">
              {active.badge}
            </span>
          </div>
        </div>

        {/* Deck Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold uppercase transition-all ${
              showNotes 
                ? 'bg-ner-black text-white border-ner-black' 
                : 'bg-white border-ner-border text-ner-black/70 hover:text-ner-black'
            }`}
          >
            Speaker Notes
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-white border border-ner-border flex items-center justify-center text-ner-black/70 hover:text-ner-black transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8">
        <div className="bg-white border-2 border-ner-black rounded-3xl p-8 sm:p-12 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-ner-offwhite border border-ner-border shadow-xs">
                {active.icon}
              </div>
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-ner-black tracking-tight">
                  {active.title}
                </h2>
                <p className="text-sm sm:text-base text-ner-black/60 mt-1">
                  {active.subtitle}
                </p>
              </div>
            </div>

            {/* Slide Body */}
            <div className="mt-8">
              {active.content}
            </div>
          </div>

          {/* Speaker Notes Overlay */}
          {showNotes && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm animate-fade-in font-sans">
              <strong className="font-bold block font-mono text-[11px] uppercase mb-1">Speaker Cue:</strong>
              {active.speakerNotes}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Slide Controller & Thumbnails */}
      <div className="max-w-6xl mx-auto w-full pt-4 border-t border-ner-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Slide Counter */}
        <div className="text-xs font-mono font-bold text-ner-black/60">
          Slide <span className="text-ner-black font-bold">{currentSlide + 1}</span> of {slides.length}
        </div>

        {/* Thumbnail Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-200 ${
                idx === currentSlide
                  ? 'w-7 bg-ner-black'
                  : 'w-2.5 bg-ner-border hover:bg-ner-black/40'
              }`}
              title={`Go to slide ${s.id}: ${s.title}`}
              aria-label={`Go to slide ${s.id}`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl bg-white border border-ner-border text-ner-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-ner-offwhite disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 rounded-xl bg-ner-black text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-ner-black/90 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
