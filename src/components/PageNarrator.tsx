import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Radio,
  GripVertical,
  Move,
  Compass,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { nerLanguages } from '../data/translations';
import { NERLanguage } from '../types';

interface Position {
  x: number;
  y: number;
}

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
  const [showDockMenu, setShowDockMenu] = useState(false);

  // Position & Dragging state
  const [position, setPosition] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem('neuro_narrator_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return {
      x: typeof window !== 'undefined' ? (isMobile ? Math.max(12, window.innerWidth - 220) : Math.max(20, window.innerWidth - 260)) : 100,
      y: typeof window !== 'undefined' ? (isMobile ? Math.max(12, window.innerHeight - 135) : Math.max(20, window.innerHeight - 100)) : 100
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);
  const hasMovedSignificantlyRef = useRef(false);
  const widgetRef = useRef<HTMLDivElement>(null);

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

  // Keep widget safely within screen boundaries upon window resize or rotation
  const clampPosition = useCallback((pos: Position, customWidth = 240, customHeight = 60): Position => {
    if (typeof window === 'undefined') return pos;
    const padding = 12;
    const maxX = Math.max(padding, window.innerWidth - customWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - customHeight - padding);
    return {
      x: Math.min(Math.max(padding, pos.x), maxX),
      y: Math.min(Math.max(padding, pos.y), maxY)
    };
  }, []);

  // Window resize handler to maintain within bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  // Save position to localStorage
  const updatePosition = (newPos: Position) => {
    const clamped = clampPosition(newPos);
    setPosition(clamped);
    try {
      localStorage.setItem('neuro_narrator_pos', JSON.stringify(clamped));
    } catch (e) {
      // ignore
    }
  };

  // Corner Snap Presets
  const snapToCorner = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    if (typeof window === 'undefined') return;
    const pad = 16;
    const isMobile = window.innerWidth < 640;
    const width = isOpen && !isMinimized ? (isMobile ? window.innerWidth - 32 : 410) : 210;
    const height = isOpen && !isMinimized ? 380 : 54;

    let target: Position = { x: pad, y: pad };
    if (corner === 'top-left') {
      target = { x: pad, y: pad + 70 };
    } else if (corner === 'top-right') {
      target = { x: window.innerWidth - width - pad, y: pad + 70 };
    } else if (corner === 'bottom-left') {
      target = { x: pad, y: window.innerHeight - height - (isMobile ? 85 : pad) };
    } else if (corner === 'bottom-right') {
      target = { x: window.innerWidth - width - pad, y: window.innerHeight - height - (isMobile ? 85 : pad) };
    }
    updatePosition(target);
    setShowDockMenu(false);
  };

  // Drag Event Handlers with full Touch and Mouse Support
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only initiate drag on primary button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Ignore if target is an interactive button, input, or select inside the container
    const target = e.target as HTMLElement;
    if (target.closest('button:not([data-drag-handle="true"])') || target.closest('input') || target.closest('select') || target.closest('a')) {
      return;
    }

    e.preventDefault();
    dragStartPosRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    hasMovedSignificantlyRef.current = false;
    setIsDragging(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartPosRef.current) return;
      const dx = moveEvent.clientX - dragStartPosRef.current.clientX;
      const dy = moveEvent.clientY - dragStartPosRef.current.clientY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedSignificantlyRef.current = true;
      }

      const newPos = {
        x: dragStartPosRef.current.posX + dx,
        y: dragStartPosRef.current.posY + dy
      };
      
      const isMobile = window.innerWidth < 640;
      const currentWidth = isOpen && !isMinimized ? (isMobile ? window.innerWidth - 32 : 410) : 210;
      const currentHeight = isOpen && !isMinimized ? 340 : 54;
      setPosition(clampPosition(newPos, currentWidth, currentHeight));
    };

    const onPointerUp = () => {
      setIsDragging(false);
      dragStartPosRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      
      // Save last valid position
      setPosition((prev) => {
        try {
          localStorage.setItem('neuro_narrator_pos', JSON.stringify(prev));
        } catch (e) {}
        return prev;
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

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

  const speakSection = (index: number, targetLang: NERLanguage) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    if (index < 0 || index >= sectionsRef.current.length) {
      setIsReadingFinished(true);
      isNarratingRef.current = false;
      if (useVoiceIntro) {
        playNarratorCue('completed');
      }
      return;
    }

    const textToRead = sectionsRef.current[index];
    setCurrentSectionIndex(index);
    setIsReadingFinished(false);
    setIsPaused(false);
    isNarratingRef.current = true;

    speakText(textToRead, targetLang, {
      onStart: () => {
        setIsPaused(false);
      },
      onEnd: () => {
        if (isPausedRef.current || !isNarratingRef.current) return;

        const nextIdx = index + 1;
        if (nextIdx < sectionsRef.current.length) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            speakSection(nextIdx, targetLang);
          }, 600);
        } else {
          setIsReadingFinished(true);
          isNarratingRef.current = false;
          if (useVoiceIntro) {
            playNarratorCue('completed');
          }
        }
      }
    });
  };

  // Reset or stop on route change
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    stopSpeaking();
    isNarratingRef.current = false;
    setIsPaused(false);
    setIsReadingFinished(false);
    setIsPlayingVoiceAsset(false);
    setVoiceAssetLabel('');
  }, [location.pathname]);

  const handleStartPageNarration = async () => {
    if (hasMovedSignificantlyRef.current) return;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    stopSpeaking();
    playCalmingChime();

    const pageChunks = extractPageContent();
    setSections(pageChunks);
    setCurrentSectionIndex(0);
    setIsReadingFinished(false);
    setIsPaused(false);
    setIsOpen(true);
    setIsMinimized(false);
    isNarratingRef.current = true;

    if (useVoiceIntro) {
      setIsPlayingVoiceAsset(true);
      setVoiceAssetLabel('Playing narrator welcome cue...');
      const played = await playNarratorWelcome(language);
      setIsPlayingVoiceAsset(false);
      setVoiceAssetLabel('');
      if (!played) {
        speakSection(0, language);
      } else {
        setTimeout(() => {
          speakSection(0, language);
        }, 300);
      }
    } else {
      speakSection(0, language);
    }
  };

  const handleAuditionVoiceAsset = async () => {
    playCalmingChime();
    setIsPlayingVoiceAsset(true);
    setVoiceAssetLabel(`Auditioning recorded native narrator voice (${language.toUpperCase()})...`);
    await playNarratorWelcome(language);
    setIsPlayingVoiceAsset(false);
    setVoiceAssetLabel('');
  };

  const handleTogglePause = () => {
    if (isSpeaking && !isPaused) {
      pauseSpeaking();
      setIsPaused(true);
      if (useVoiceIntro) {
        playNarratorCue('paused');
      }
    } else {
      resumeSpeaking();
      setIsPaused(false);
      if (useVoiceIntro) {
        playNarratorCue('resumed');
      }
    }
  };

  const handleNext = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (currentSectionIndex < sections.length - 1) {
      stopSpeaking();
      if (useVoiceIntro) playNarratorCue('next');
      speakSection(currentSectionIndex + 1, language);
    }
  };

  const handlePrev = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (currentSectionIndex > 0) {
      stopSpeaking();
      if (useVoiceIntro) playNarratorCue('prev');
      speakSection(currentSectionIndex - 1, language);
    }
  };

  const handleRestart = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    stopSpeaking();
    if (useVoiceIntro) playNarratorCue('restart');
    speakSection(0, language);
  };

  const handleStop = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    stopSpeaking();
    if (useVoiceIntro) playNarratorCue('stopped');
    isNarratingRef.current = false;
    setIsPaused(false);
    setIsReadingFinished(false);
    setIsPlayingVoiceAsset(false);
    setVoiceAssetLabel('');
    setIsOpen(false);
  };

  const handleLanguageChange = (newLang: NERLanguage) => {
    setLanguage(newLang);
    setShowLangMenu(false);
    if (isOpen && sections.length > 0) {
      speakSection(currentSectionIndex, newLang);
    }
  };

  const speeds = [0.75, 0.88, 1.0, 1.15];
  const currentLangMeta = nerLanguages.find((l) => l.code === language) || nerLanguages[0];

  return (
    <div 
      id="page-narrator-widget" 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      <div 
        ref={widgetRef}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        className={`pointer-events-auto absolute top-0 left-0 flex flex-col items-end transition-shadow duration-200 ${
          isDragging ? 'cursor-grabbing opacity-95 scale-[1.02] shadow-2xl' : ''
        }`}
      >
        {/* Expanded Control Modal / Drawer */}
        <AnimatePresence>
          {isOpen && !isMinimized && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-[92vw] sm:w-[410px] max-h-[75vh] overflow-y-auto rounded-3xl bg-ner-black text-white p-4 sm:p-5 shadow-2xl border border-white/20 backdrop-blur-xl touch-auto select-none"
            >
              {/* Header with Drag Handle & Quick Docking */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div 
                    data-drag-handle="true"
                    className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white cursor-grab active:cursor-grabbing transition flex items-center justify-center" 
                    title="Drag to reposition widget anywhere on screen"
                  >
                    <Move className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ner-terracotta text-white flex items-center justify-center shadow-inner shrink-0">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest font-bold text-white">
                        Voice Narrator
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-0.5">
                        <Disc className="w-2.5 h-2.5" />
                        <span>Active</span>
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-white/60 font-mono flex items-center gap-1">
                      <span>{currentLangMeta.native}</span>
                      <span>•</span>
                      <span>{currentLangMeta.name}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Quick Dock Popover */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDockMenu(!showDockMenu)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
                      title="Snap to corner (Top-Right, Bottom-Left, etc.)"
                      aria-label="Snap to corner"
                    >
                      <Compass className="w-4 h-4" />
                    </button>

                    {showDockMenu && (
                      <div className="absolute top-8 right-0 w-44 rounded-2xl bg-ner-black border border-white/20 p-2 shadow-2xl z-50 flex flex-col gap-1 text-[11px] font-mono">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 px-2 py-0.5">
                          Snap to Corner:
                        </span>
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            onClick={() => snapToCorner('top-left')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 flex items-center gap-1 text-white text-left"
                          >
                            <ArrowUpLeft className="w-3 h-3 text-amber-300" />
                            <span>Top L</span>
                          </button>
                          <button
                            onClick={() => snapToCorner('top-right')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 flex items-center gap-1 text-white text-left"
                          >
                            <ArrowUpRight className="w-3 h-3 text-amber-300" />
                            <span>Top R</span>
                          </button>
                          <button
                            onClick={() => snapToCorner('bottom-left')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 flex items-center gap-1 text-white text-left"
                          >
                            <ArrowDownLeft className="w-3 h-3 text-amber-300" />
                            <span>Bot L</span>
                          </button>
                          <button
                            onClick={() => snapToCorner('bottom-right')}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 flex items-center gap-1 text-white text-left"
                          >
                            <ArrowDownRight className="w-3 h-3 text-amber-300" />
                            <span>Bot R</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

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
              <div className="my-3 p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 min-h-[76px] flex flex-col justify-between">
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
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <div className="flex items-center gap-1">
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
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-white text-ner-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-white/90 transition shadow active:scale-95"
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
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-ner-terracotta text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-ner-terracotta/90 transition shadow-md active:scale-95"
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
                  className={`p-2 rounded-xl border transition text-[11px] sm:text-xs font-mono flex items-center gap-1 active:scale-95 ${
                    isPlayingVoiceAsset 
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-200' 
                      : 'bg-white/10 border-white/10 hover:bg-white/15 text-white/90'
                  }`}
                  title="Audition recorded voice asset"
                >
                  <Disc className={`w-3.5 h-3.5 ${isPlayingVoiceAsset ? 'animate-spin text-amber-300' : 'text-ner-terracotta'}`} />
                  <span className="hidden sm:inline">Voice</span>
                </button>

                {/* Stop Button */}
                <button
                  onClick={handleStop}
                  className="px-2.5 sm:px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-xs font-mono font-bold flex items-center gap-1 active:scale-95"
                  title="Stop audio"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              </div>

              {/* Quick Language, Voice Asset Toggle & Speed Bar */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs gap-2 flex-wrap">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Floating Launch / Minimized Pill (Freely Draggable Anywhere) */}
        <div className="flex items-center gap-1.5 group select-none">
          {/* Visual Drag Handle Tab */}
          <div 
            data-drag-handle="true"
            className="h-11 px-2 rounded-full bg-ner-black/90 hover:bg-ner-black text-white/60 hover:text-white border border-white/20 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition active:scale-95 touch-none" 
            title="Drag to reposition widget anywhere on screen"
          >
            <GripVertical className="w-4 h-4 text-amber-400" />
          </div>

          {isOpen && isMinimized && (
            <button
              onClick={() => {
                if (!hasMovedSignificantlyRef.current) setIsMinimized(false);
              }}
              className="px-3.5 py-2.5 rounded-full bg-ner-black text-white border border-white/20 shadow-2xl flex items-center gap-2 text-xs font-mono font-bold hover:bg-ner-black/90 transition active:scale-95 cursor-pointer touch-manipulation"
              title="Expand Voice Narrator (Click to open, drag handle to move)"
            >
              <Volume2 className="w-4 h-4 text-ner-terracotta animate-pulse" />
              <span>Reading ({currentLangMeta.code.toUpperCase()})</span>
              <ChevronUp className="w-4 h-4 text-white/60" />
            </button>
          )}

          {!isOpen && (
            <button
              id="narrate-page-button"
              onClick={() => {
                if (!hasMovedSignificantlyRef.current) handleStartPageNarration();
              }}
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-ner-black hover:bg-ner-black/90 text-white shadow-2xl border border-white/20 flex items-center gap-2 sm:gap-2.5 transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation"
              title={`Read page aloud in ${currentLangMeta.native} (${currentLangMeta.name}) - Drag handle to move anywhere`}
              aria-label="Read page aloud"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-ner-terracotta text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1">
                  <span>{t.listenAloud || 'Narrate Page'}</span>
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/60 font-mono">
                  {currentLangMeta.native} voice
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
