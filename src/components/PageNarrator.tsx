import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  X, 
  Globe, 
  Gauge, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Disc,
  Radio
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { nerLanguages } from '../data/translations';
import { NERLanguage } from '../types';

export const PageNarrator: React.FC = () => {
  const location = useLocation();
  const { 
    language, 
    setLanguage, 
    speakText, 
    isSpeaking, 
    speakingText, 
    stopSpeaking, 
    pauseSpeaking, 
    resumeSpeaking, 
    speechRate, 
    setSpeechRate, 
    playCalmingChime,
    playNarratorWelcome,
    playNarratorCue,
    playAudioAsset,
    t 
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReadingFinished, setIsReadingFinished] = useState(false);
  const [isPlayingVoiceAsset, setIsPlayingVoiceAsset] = useState(false);
  const [voiceAssetLabel, setVoiceAssetLabel] = useState('');
  const [useVoiceIntro, setUseVoiceIntro] = useState(() => {
    return localStorage.getItem('neuro_narrator_voice_assets') !== 'false';
  });
  const [sections, setSections] = useState<string[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Storing mutable refs to avoid stale closure issues in speech callbacks
  const sectionsRef = useRef<string[]>([]);
  const currentSectionIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const isNarratingRef = useRef(false);
  const autoAdvanceTimerRef = useRef<any>(null);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    currentSectionIndexRef.current = currentSectionIndex;
  }, [currentSectionIndex]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const toggleVoiceIntro = () => {
    const nextVal = !useVoiceIntro;
    setUseVoiceIntro(nextVal);
    localStorage.setItem('neuro_narrator_voice_assets', String(nextVal));
  };

  // Extract readable text chunks from the current visible page
  const extractPageContent = (): string[] => {
    const mainEl = document.querySelector('main') || document.querySelector('#root') || document.body;
    if (!mainEl) return [];

    const extracted: string[] = [];
    
    // Select meaningful content elements across all headings, paragraphs, and list items
    const elements = mainEl.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, [data-narrate="true"], p, li, [role="article"]'
    );

    const ignoredRegex = /^(stop|listen|sign in|sign out|logout|save|cancel|next|back|previous|audition voice|test|play|pause|narrate page|view|edit)$/i;

    elements.forEach((el) => {
      // Exclude navigation, header, modals, widget internals, and elements marked to ignore
      if (
        el.closest('header') || 
        el.closest('nav') || 
        el.closest('#page-narrator-widget') ||
        el.closest('[data-narrate-ignore="true"]')
      ) {
        return;
      }

      // Check visibility without relying on offsetParent which fails in flex/grid
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.height === 0 || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return;
      }

      const rawText = el.innerText?.replace(/\s+/g, ' ').trim();
      if (!rawText || rawText.length < 6) return;
      if (ignoredRegex.test(rawText)) return;

      // Avoid adding duplicated content (e.g. nested elements)
      const isAlreadyContained = extracted.some(
        (existing) => existing.includes(rawText) || rawText.includes(existing)
      );

      if (!isAlreadyContained) {
        extracted.push(rawText);
      }
    });

    // Fallback if the page has dynamic or canvas content
    if (extracted.length < 2) {
      const pageTitle = document.title || 'Smriti Care';
      const heading = document.querySelector('h1')?.innerText?.trim() || '';
      const fallbackList: string[] = [];
      if (heading) fallbackList.push(heading);
      fallbackList.push(`${pageTitle}. ${t.heroDescription || 'Culturally-attuned cognitive and neurological wellness companion for Northeast India.'}`);
      return fallbackList;
    }

    return extracted;
  };

  // Speak a specific section by index and auto-advance when finished
  const speakSection = (idx: number, langToUse: NERLanguage = language) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    const currentSections = sectionsRef.current;
    if (!currentSections || idx >= currentSections.length) {
      setIsReadingFinished(true);
      isNarratingRef.current = false;
      if (useVoiceIntro) {
        playNarratorCue('completed');
      }
      return;
    }

    setCurrentSectionIndex(idx);
    currentSectionIndexRef.current = idx;
    setIsReadingFinished(false);
    isNarratingRef.current = true;

    const textToSpeak = currentSections[idx];

    speakText(textToSpeak, langToUse, {
      onStart: () => {
        setIsReadingFinished(false);
      },
      onEnd: () => {
        // Auto-advance to the next section if the user hasn't paused or stopped
        if (!isPausedRef.current && isNarratingRef.current) {
          const nextIdx = idx + 1;
          if (nextIdx < sectionsRef.current.length) {
            // Natural pause between sections
            autoAdvanceTimerRef.current = setTimeout(() => {
              speakSection(nextIdx, langToUse);
            }, 650);
          } else {
            setIsReadingFinished(true);
            isNarratingRef.current = false;
            if (useVoiceIntro) {
              playNarratorCue('completed');
            }
          }
        }
      },
    });
  };

  // When location changes or language changes, reset narrator
  useEffect(() => {
    handleStop();
  }, [location.pathname]);

  const handleStartPageNarration = async () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    playCalmingChime();

    const pageTextSections = extractPageContent();
    setSections(pageTextSections);
    sectionsRef.current = pageTextSections;

    setCurrentSectionIndex(0);
    currentSectionIndexRef.current = 0;

    setIsOpen(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setIsMinimized(false);
    setIsReadingFinished(false);

    // If voice assets intro is enabled, play recorded welcome greeting asset in user language
    if (useVoiceIntro) {
      setIsPlayingVoiceAsset(true);
      setVoiceAssetLabel(`Playing ${currentLangMeta.name} Voice Greeting Asset`);
      try {
        await playNarratorWelcome(language);
      } catch (err) {
        console.warn('Voice asset welcome notice:', err);
      } finally {
        setIsPlayingVoiceAsset(false);
        setVoiceAssetLabel('');
      }
    }

    // Now start reading first page section
    speakSection(0, language);
  };

  const handleAuditionVoiceAsset = async () => {
    if (isPlayingVoiceAsset) {
      stopSpeaking();
      setIsPlayingVoiceAsset(false);
      setVoiceAssetLabel('');
      return;
    }

    setIsPlayingVoiceAsset(true);
    setVoiceAssetLabel(`Testing ${currentLangMeta.name} Voice Asset`);
    try {
      await playNarratorWelcome(language);
    } finally {
      setIsPlayingVoiceAsset(false);
      setVoiceAssetLabel('');
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIdx = currentSectionIndex + 1;
      if (useVoiceIntro) {
        playNarratorCue('next');
      }
      speakSection(nextIdx, language);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      const prevIdx = currentSectionIndex - 1;
      if (useVoiceIntro) {
        playNarratorCue('prev');
      }
      speakSection(prevIdx, language);
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      resumeSpeaking();
      setIsPaused(false);
      isPausedRef.current = false;
    } else {
      pauseSpeaking();
      setIsPaused(true);
      isPausedRef.current = true;
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      if (useVoiceIntro) {
        playNarratorCue('paused');
      }
    }
  };

  const handleRestart = () => {
    if (useVoiceIntro) {
      playNarratorCue('restart');
    }
    if (sections.length > 0) {
      speakSection(0, language);
    } else {
      handleStartPageNarration();
    }
  };

  const handleStop = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    isNarratingRef.current = false;
    stopSpeaking();
    setIsPaused(false);
    isPausedRef.current = false;
    setIsReadingFinished(false);
    setIsPlayingVoiceAsset(false);
    setVoiceAssetLabel('');
    setIsOpen(false);
  };

  const handleLanguageChange = (newLang: NERLanguage) => {
    setLanguage(newLang);
    setShowLangMenu(false);
    if (isOpen && sections.length > 0) {
      // Re-read current section in the newly selected language
      speakSection(currentSectionIndex, newLang);
    }
  };

  const speeds = [0.75, 0.88, 1.0, 1.15];
  const currentLangMeta = nerLanguages.find((l) => l.code === language) || nerLanguages[0];

  return (
    <div id="page-narrator-widget" className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Control Modal / Drawer */}
      {isOpen && !isMinimized && (
        <div className="pointer-events-auto mb-3 w-[92vw] sm:w-[410px] rounded-3xl bg-ner-black text-white p-5 shadow-2xl border border-white/20 animate-fade-in backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-ner-terracotta text-white flex items-center justify-center shadow-inner shrink-0">
                <Volume2 className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-white">
                    Page Voice Narrator
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-0.5">
                    <Disc className="w-2.5 h-2.5" />
                    <span>Assets Active</span>
                  </span>
                </div>
                <span className="text-[10px] text-white/60 font-mono flex items-center gap-1">
                  <span>{currentLangMeta.native}</span>
                  <span>•</span>
                  <span>{currentLangMeta.name}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
                title="Minimize narrator"
                aria-label="Minimize narrator"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
                title="Close narrator"
                aria-label="Close narrator"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section Progress Bar */}
          {sections.length > 0 && (
            <div className="mt-3 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-ner-terracotta h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
              />
            </div>
          )}

          {/* Audio Asset Alert Banner when playing voice files */}
          {isPlayingVoiceAsset && (
            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-ner-terracotta/20 border border-ner-terracotta/40 flex items-center justify-between text-[11px] font-mono text-amber-200">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>{voiceAssetLabel || 'Playing narrator voice asset...'}</span>
              </div>
              <span className="text-[10px] opacity-75">Spoken Audio</span>
            </div>
          )}

          {/* Currently Speaking Transcript */}
          <div className="my-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 min-h-[82px] flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed italic line-clamp-3 select-text font-serif">
              "{speakingText || sections[currentSectionIndex] || 'Extracting page content for audio narration...'}"
            </p>
            {sections.length > 0 && (
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 text-[10px] font-mono text-white/60">
                <span className="font-bold">
                  Section {currentSectionIndex + 1} of {sections.length}
                </span>
                
                {isReadingFinished ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Finished</span>
                  </span>
                ) : (
                  <span className="text-ner-terracotta font-bold flex items-center gap-1.5">
                    {isSpeaking && !isPaused ? (
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-1 bg-ner-terracotta rounded-full animate-bounce [animation-delay:-0.3s] h-2" />
                        <span className="w-1 bg-ner-terracotta rounded-full animate-bounce [animation-delay:-0.15s] h-3" />
                        <span className="w-1 bg-ner-terracotta rounded-full animate-bounce h-2" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                    <span>{isSpeaking ? (isPaused ? 'Paused' : 'Reading Aloud') : 'Ready'}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={currentSectionIndex === 0}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition active:scale-95"
                title="Previous section"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {isSpeaking && !isPaused ? (
                <button
                  onClick={handleTogglePause}
                  className="px-4 py-2 rounded-xl bg-white text-ner-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-white/90 transition shadow active:scale-95"
                  title="Pause speech"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (isPaused) {
                      handleTogglePause();
                    } else if (sections.length > 0) {
                      speakSection(currentSectionIndex, language);
                    } else {
                      handleStartPageNarration();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-ner-terracotta text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-ner-terracotta/90 transition shadow-md active:scale-95"
                  title="Play speech"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPaused ? 'Resume' : 'Play'}</span>
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentSectionIndex >= sections.length - 1}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition active:scale-95"
                title="Next section"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition active:scale-95"
                title="Restart from beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audition Voice Asset Button */}
            <button
              onClick={handleAuditionVoiceAsset}
              className={`p-2 rounded-xl border transition text-xs font-mono flex items-center gap-1.5 active:scale-95 ${
                isPlayingVoiceAsset 
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200' 
                  : 'bg-white/10 border-white/10 hover:bg-white/15 text-white/90'
              }`}
              title="Audition recorded voice asset"
            >
              <Disc className={`w-3.5 h-3.5 ${isPlayingVoiceAsset ? 'animate-spin text-amber-300' : 'text-ner-terracotta'}`} />
              <span className="hidden sm:inline">Voice Asset</span>
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95"
              title="Stop audio"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          </div>

          {/* Quick Language, Voice Asset Toggle & Speed Bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs gap-2">
            {/* Language Selector Popover */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-1.5 text-[11px] font-mono text-white/90"
              >
                <Globe className="w-3.5 h-3.5 text-ner-terracotta" />
                <span>{currentLangMeta.native}</span>
              </button>

              {showLangMenu && (
                <div className="absolute bottom-9 left-0 w-52 max-h-56 overflow-y-auto rounded-2xl bg-ner-black border border-white/20 p-1.5 shadow-2xl z-50 flex flex-col gap-0.5">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-white/50 border-b border-white/10">
                    Switch Voice Language
                  </div>
                  {nerLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageChange(l.code)}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition ${
                        language === l.code ? 'bg-ner-terracotta text-white font-bold' : 'hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <span>{l.native}</span>
                      <span className="text-[10px] opacity-60 font-mono">{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Asset Cues Toggle */}
            <button
              onClick={toggleVoiceIntro}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition flex items-center gap-1 ${
                useVoiceIntro 
                  ? 'bg-ner-terracotta/20 border-ner-terracotta/40 text-amber-200' 
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}
              title="Toggle spoken voice asset greetings and transition cues"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{useVoiceIntro ? 'Voice Cues On' : 'Cues Off'}</span>
            </button>

            {/* Speech Rate Controls */}
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl">
              <Gauge className="w-3 h-3 text-white/40" />
              {speeds.map((r) => (
                <button
                  key={r}
                  onClick={() => setSpeechRate(r)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                    Math.abs(speechRate - r) < 0.05
                      ? 'bg-ner-terracotta text-white font-bold shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Launch / Minimized Pill */}
      <div className="pointer-events-auto flex items-center gap-2">
        {isOpen && isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3.5 py-2.5 rounded-full bg-ner-black text-white border border-white/20 shadow-xl flex items-center gap-2 text-xs font-mono font-bold hover:bg-ner-black/90 transition active:scale-95"
            title="Expand Voice Narrator"
          >
            <Volume2 className="w-4 h-4 text-ner-terracotta animate-pulse" />
            <span>Reading Page ({currentLangMeta.code.toUpperCase()})</span>
            <ChevronUp className="w-4 h-4 text-white/60" />
          </button>
        )}

        {!isOpen && (
          <button
            id="narrate-page-button"
            onClick={handleStartPageNarration}
            className="px-4 py-3 rounded-full bg-ner-black hover:bg-ner-black/90 text-white shadow-2xl border border-white/20 flex items-center gap-2.5 transition-all duration-200 active:scale-95 group"
            title={`Read page aloud in ${currentLangMeta.native} (${currentLangMeta.name})`}
            aria-label="Read page aloud"
          >
            <div className="w-7 h-7 rounded-full bg-ner-terracotta text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <span>{t.listenAloud || 'Narrate Page'}</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[10px] text-white/60 font-mono">
                {currentLangMeta.native} voice
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

