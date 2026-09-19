import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { 
  Sparkles, 
  Mic, 
  MicOff,
  Volume2, 
  VolumeX,
  ArrowRight, 
  Send,
  RotateCcw,
  Activity,
  Heart,
  Globe2,
  CheckCircle2,
  Bot,
  User,
  Loader2,
  Play,
  Pause,
  MessageSquare
} from 'lucide-react';
import { NERLanguage } from '../../types';
import { TTSButton } from '../TTSButton';
import { MemoryCompanionService } from '../../services/ai/memoryCompanion';

interface DemoMessage {
  id: string;
  sender: 'user' | 'ai';
  role: string;
  text: string;
  timestamp: string;
  provider?: string;
}

const SAMPLE_PROMPTS = [
  { label: 'Afternoon Plan', query: 'What is my plan for this afternoon?' },
  { label: 'Bihu Song Memory', query: 'Who sang the sweet Bihu song we heard yesterday?' },
  { label: 'Assam Tea Lore', query: 'Tell me a gentle memory about Assam tea gardens in winter.' },
  { label: 'Next Medicine', query: 'When should I take my evening blood pressure medicine?' },
  { label: 'Doctor Visit', query: 'When is my next visit with Dr. Debabrata Roy?' },
  { label: 'Daughter Call', query: 'When is my daughter Priya calling me today?' },
];

const NER_LANG_OPTIONS: { code: NERLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mni', label: 'Meitei', native: 'মৈতৈলোন্' },
  { code: 'kha', label: 'Khasi', native: 'Khasi' },
  { code: 'bodo' as any, label: 'Bodo', native: 'बर’' },
];

const INITIAL_CONVERSATION: DemoMessage[] = [
  {
    id: 'demo-1',
    sender: 'user',
    role: 'PATIENT // SPOKEN',
    text: 'Can you remind me about my afternoon activity?',
    timestamp: '2:15 PM',
  },
  {
    id: 'demo-2',
    sender: 'ai',
    role: 'SMRITI COMPANION',
    text: 'Of course! At 4:00 PM your daughter Ananya is coming over for warm tea, and you both planned to complete the Brahmaputra Word Puzzle.',
    timestamp: '2:15 PM',
    provider: 'gemini-3.8-flash',
  },
  {
    id: 'demo-3',
    sender: 'user',
    role: 'PATIENT // SPOKEN',
    text: 'Who sang that sweet Bihu song we listened to yesterday?',
    timestamp: '2:16 PM',
  },
  {
    id: 'demo-4',
    sender: 'ai',
    role: 'SMRITI COMPANION',
    text: 'That was the classic recording by Dr. Bhupen Hazarika that your son uploaded to your Heritage Vault. Would you like me to play a gentle melody now?',
    timestamp: '2:16 PM',
    provider: 'gemini-3.8-flash',
  },
];

export const AICompanionScrollSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const { setIsAICompanionOpen, activePatient, reminders } = useRole();
  const { 
    speakText, 
    isSpeaking, 
    stopSpeaking, 
    pauseSpeaking,
    resumeSpeaking,
    playCalmingChime, 
    primeSpeechEngine,
    motion: contextMotion, 
    language: globalLang,
    t 
  } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [selectedLang, setSelectedLang] = useState<NERLanguage>(globalLang || 'en');
  const [messages, setMessages] = useState<DemoMessage[]>(INITIAL_CONVERSATION);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'script'>('live');
  const [scriptStep, setScriptStep] = useState(3);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isPlayingFullDialogue, setIsPlayingFullDialogue] = useState(false);

  const fullDialogueTimerRef = useRef<any>(null);
  const lastSendTimeRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Speech recognition for live voice input
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition({
    language: selectedLang,
    onResult: (text, isFinal) => {
      setInputQuery(text);
      if (isFinal && text.trim().length > 3) {
        handleSendMessage(text);
      }
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeTab === 'live') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  // Progressive reveal for the scripted mode on scroll
  useEffect(() => {
    if (activeTab === 'script') {
      const unsubscribe = scrollYProgress.on('change', (val) => {
        if (val > 0.6) setScriptStep(3);
        else if (val > 0.45) setScriptStep(2);
        else if (val > 0.3) setScriptStep(1);
        else setScriptStep(0);
      });
      return () => unsubscribe();
    }
  }, [scrollYProgress, activeTab]);

  const handleAuditionVoice = () => {
    primeSpeechEngine();
    const greetings: Record<string, string> = {
      en: `Hello ${activePatient.name}. I am Smriti, your caring memory companion.`,
      as: `নমস্কাৰ ${activePatient.name}। মই স্মৃতি, আপোনাৰ মৰমৰ সংগী।`,
      bn: `নমস্কার ${activePatient.name}। আমি স্মৃতি, আপনার স্মৃতি সঙ্গী।`,
      hi: `नमस्ते ${activePatient.name} जी। मैं स्मृति हूँ, आपकी अपनी देखभाल साथी।`,
      mni: `খুরুমজরি! ঐহাক স্মৃতিনি, নহাক্কী নুংশিরবা মেমোরী কম্প্যানিয়ননি।`,
      kha: `Khublei! Nga dei ka Smriti, ka paralok ban kynmaw ia ki jingkynmaw ba thiang jong phi.`,
      bodo: `खुलुमबाय! आं स्मृती, नोंथांनि मोजां मोन्नाय गोसोखांथि लोगो।`,
    };
    const speech = greetings[selectedLang] || greetings.en;
    setSpeakingMsgId('audition');
    speakText(speech, selectedLang, {
      onStart: () => setSpeakingMsgId('audition'),
      onEnd: () => setSpeakingMsgId(null),
    });
  };

  const handleAuditionGreeting = handleAuditionVoice;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // 500ms debounce guard to prevent duplicate calls and rapid clicks
    const now = Date.now();
    if (now - lastSendTimeRef.current < 500) return;
    lastSendTimeRef.current = now;

    primeSpeechEngine();

    if (isListening) {
      stopListening();
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    const userMsg: DemoMessage = {
      id: userMsgId,
      sender: 'user',
      role: 'PATIENT // SPOKEN',
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    resetTranscript();
    setIsLoading(true);
    playCalmingChime();

    try {
      // Build conversation history from current messages
      const historyPayload = messages.slice(-4).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.text,
      }));

      // Unified call to MemoryCompanionService (uses sessionStorage cache + server proxy)
      const companionResult = await MemoryCompanionService.queryAICompanion({
        message: query,
        patient: activePatient,
        reminders: reminders,
        language: selectedLang,
        history: historyPayload,
        mode: 'companion',
      });

      const aiReply = companionResult.text || `I am right here with you, ${activePatient.name}. Everything is safe and serene.`;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: DemoMessage = {
        id: aiMsgId,
        sender: 'ai',
        role: 'SMRITI COMPANION',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: companionResult.provider || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, aiMsg]);
      // Seamless audio readout for the new AI reply
      setSpeakingMsgId(aiMsgId);
      speakText(aiReply, selectedLang, {
        onStart: () => setSpeakingMsgId(aiMsgId),
        onEnd: () => setSpeakingMsgId(null),
      });
    } catch (err) {
      console.warn('AI endpoint fallback:', err);
      // Fallback message
      const fallbackReply = `I hear you warmly, ${activePatient.name}. Remember, your family is right beside you, and you are having a wonderful day in Guwahati.`;
      const fallbackMsg: DemoMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        role: 'SMRITI COMPANION',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'offline-reassurance',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setSpeakingMsgId(fallbackMsg.id);
      speakText(fallbackReply, selectedLang, {
        onStart: () => setSpeakingMsgId(fallbackMsg.id),
        onEnd: () => setSpeakingMsgId(null),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msg: DemoMessage) => {
    if (isSpeaking && speakingMsgId === msg.id) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      primeSpeechEngine();
      setSpeakingMsgId(msg.id);
      speakText(msg.text, selectedLang, {
        onStart: () => setSpeakingMsgId(msg.id),
        onEnd: () => setSpeakingMsgId(null),
      });
    }
  };

  // Play entire active dialogue sequentially aloud
  const handlePlayEntireDialogue = () => {
    if (isPlayingFullDialogue) {
      stopSpeaking();
      if (fullDialogueTimerRef.current) clearTimeout(fullDialogueTimerRef.current);
      setIsPlayingFullDialogue(false);
      setSpeakingMsgId(null);
      return;
    }

    const currentList = activeTab === 'live' ? messages : messages.slice(0, scriptStep + 1);
    if (currentList.length === 0) return;

    setIsPlayingFullDialogue(true);
    playCalmingChime();

    const readStep = (idx: number) => {
      if (idx >= currentList.length) {
        setIsPlayingFullDialogue(false);
        setSpeakingMsgId(null);
        return;
      }

      const msg = currentList[idx];
      setSpeakingMsgId(msg.id);
      
      const intro = msg.sender === 'user' ? 'Question: ' : 'Companion Reply: ';
      speakText(`${intro}${msg.text}`, selectedLang, {
        onEnd: () => {
          fullDialogueTimerRef.current = setTimeout(() => {
            readStep(idx + 1);
          }, 700);
        }
      });
    };

    readStep(0);
  };

  const handleResetChat = () => {
    stopSpeaking();
    stopListening();
    if (fullDialogueTimerRef.current) clearTimeout(fullDialogueTimerRef.current);
    setIsPlayingFullDialogue(false);
    setSpeakingMsgId(null);
    setMessages(INITIAL_CONVERSATION);
    setInputQuery('');
    resetTranscript();
    setScriptStep(3);
  };

  return (
    <section
      ref={containerRef}
      id="ai-companion"
      data-narrate="true"
      className="py-20 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
          {t.aiTag}
        </span>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
            {t.aiTitle}
          </h2>
          <TTSButton 
            text={t.aiDescription} 
            label={t.listenAloud}
            size="sm"
            lang={selectedLang}
          />
        </div>
        <p className="text-sm sm:text-base text-ner-black/70 font-light mt-3 max-w-2xl mx-auto leading-relaxed">
          {t.aiDescription}
        </p>
      </div>

      {/* Main Interactive AI Interface Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start max-w-6xl mx-auto">
        
        {/* Left Side: Speech Controls, Language Picker & Live Waveform */}
        <div className="lg:col-span-4 space-y-5">
          <div className="frost-white-intense rounded-3xl p-5 sm:p-7 border border-ner-border/90 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ner-black/60 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ner-terracotta" />
                GEMINI 3.8 NEURAL ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>

            {/* Dynamic Voice Waveform Animation */}
            <div className="p-4 rounded-2xl bg-ner-black text-white flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 h-12 w-full">
                {[18, 32, 50, 36, 56, 75, 42, 60, 80, 52, 68, 38, 22].map((h, i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 rounded-full transition-colors ${
                      isListening ? 'bg-rose-400' : isSpeaking ? 'bg-amber-400' : 'bg-ner-terracotta'
                    }`}
                    animate={
                      isReduced
                        ? { height: '30%' }
                        : {
                            height: isListening
                              ? [`${h * 0.5}%`, `${h * 1.1}%`, `${h * 0.4}%`]
                              : isSpeaking
                              ? [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`]
                              : isLoading
                              ? [`${h * 0.2}%`, `${h * 0.7}%`, `${h * 0.2}%`]
                              : [`${h * 0.25}%`, `${h * 0.45}%`, `${h * 0.25}%`],
                          }
                    }
                    transition={{
                      duration: isListening ? 0.4 + (i % 3) * 0.1 : 0.8 + (i % 4) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between w-full text-[10px] font-mono text-white/70 pt-1 border-t border-white/10">
                <span>
                  {isListening
                    ? 'Listening to microphone...'
                    : isSpeaking
                    ? 'Speaking aloud...'
                    : isLoading
                    ? 'Thinking warmly...'
                    : 'Acoustic Voice Synthesis'}
                </span>
                <span className="text-ner-terracotta font-bold">
                  {NER_LANG_OPTIONS.find((l) => l.code === selectedLang)?.native || 'English'}
                </span>
              </div>
            </div>

            {/* Dialect / Language Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-ner-black/60 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-ner-sage" />
                  Regional Voice Language
                </span>
                <span className="text-[9px] text-ner-black/40">7 NER Dialects</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {NER_LANG_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      if (isSpeaking) stopSpeaking();
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono transition-all text-left flex items-center justify-between ${
                      selectedLang === lang.code
                        ? 'bg-ner-black text-white font-bold shadow-sm'
                        : 'bg-ner-offwhite border border-ner-border hover:border-ner-black/40 text-ner-black/80'
                    }`}
                  >
                    <span className="truncate">{lang.label}</span>
                    <span className="text-[10px] opacity-70 ml-1">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Key Pillars */}
            <div className="space-y-2 text-xs text-ner-black/80 pt-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-ner-terracotta shrink-0" />
                <span>Zero clinical stress or memory test judgment</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-ner-sage shrink-0" />
                <span>Anchored in Assam & NER cultural lore</span>
              </div>
            </div>

            {/* Audition & Full Screen Drawer Launch */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleAuditionVoice}
                className="w-full h-11 px-4 rounded-2xl frost-white-intense border border-ner-border hover:border-ner-black text-ner-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
              >
                <Volume2 className={`w-4 h-4 text-ner-terracotta ${speakingMsgId === 'audition' ? 'animate-pulse' : ''}`} />
                <span>{t.listenAloud} ({NER_LANG_OPTIONS.find((l) => l.code === selectedLang)?.native})</span>
              </button>

              <button
                onClick={() => setIsAICompanionOpen(true)}
                className="w-full h-11 px-4 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <span>{t.btnLaunchCompanion}</span>
                <ArrowRight className="w-3.5 h-3.5 text-ner-terracotta" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive AI Dialogue Console */}
        <div className="lg:col-span-8">
          <div className="frost-white-intense rounded-3xl p-4 sm:p-7 border border-ner-border/90 shadow-2xl space-y-4">
            
            {/* Dialogue Header with Live / Script Toggle & Full Listen Aloud Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ner-border/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-ner-black text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                  SC
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-ner-black flex items-center gap-2">
                    Smriti AI Dialogue
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-bold">
                      Interactive
                    </span>
                  </h4>
                  <span className="text-[11px] font-mono text-ner-black/50">
                    Patient Profile: {activePatient.name} (Guwahati)
                  </span>
                </div>
              </div>

              {/* Controls: Mode Toggle, Listen Entire Dialogue, Clear */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Listen Whole Dialogue Aloud */}
                <button
                  onClick={handlePlayEntireDialogue}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    isPlayingFullDialogue 
                      ? 'bg-ner-terracotta text-white border-ner-terracotta shadow-md animate-pulse'
                      : 'bg-white hover:bg-ner-black hover:text-white border-ner-border text-ner-black shadow-xs'
                  }`}
                  title="Listen to full conversation aloud"
                >
                  {isPlayingFullDialogue ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Narration</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-ner-terracotta" />
                      <span>Listen Dialogue</span>
                    </>
                  )}
                </button>

                <div className="bg-ner-offwhite p-0.5 rounded-xl border border-ner-border flex items-center text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('live')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'live'
                        ? 'bg-ner-black text-white shadow-xs'
                        : 'text-ner-black/60 hover:text-ner-black'
                    }`}
                  >
                    Live Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === 'script'
                        ? 'bg-ner-black text-white shadow-xs'
                        : 'text-ner-black/60 hover:text-ner-black'
                    }`}
                  >
                    Staged Demo
                  </button>
                </div>

                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-xl border border-ner-border hover:bg-ner-offwhite text-ner-black/60 hover:text-ner-black transition"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Conversation Feed */}
            <div className="space-y-3.5 min-h-[320px] max-h-[420px] overflow-y-auto pr-1 flex flex-col justify-start">
              {(activeTab === 'live' ? messages : messages.slice(0, scriptStep + 1)).map((msg) => {
                const isUser = msg.sender === 'user';
                const isThisSpeaking = isSpeaking && speakingMsgId === msg.id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] font-mono uppercase tracking-wider text-ner-black/40 mb-1 px-1 flex items-center gap-1.5">
                      {isUser ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5 text-ner-terracotta" />}
                      <span>{msg.role} • {msg.timestamp}</span>
                      {msg.provider && (
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                          {msg.provider}
                        </span>
                      )}
                    </span>

                    <div
                      className={`p-4 rounded-2xl max-w-lg text-xs sm:text-sm leading-relaxed transition-all shadow-sm ${
                        isUser
                          ? 'bg-ner-black text-white rounded-tr-xs'
                          : 'bg-white border border-ner-border text-ner-black rounded-tl-xs shadow-md'
                      } ${isThisSpeaking ? 'ring-2 ring-ner-terracotta shadow-lg' : ''}`}
                    >
                      <p>{msg.text}</p>

                      {/* Listen Aloud Button on Every Message */}
                      <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] ${
                        isUser ? 'border-white/10' : 'border-ner-border/40'
                      }`}>
                        <span className={`font-mono text-[10px] ${isUser ? 'text-white/50' : 'text-ner-black/40'}`}>
                          Voice playback ({NER_LANG_OPTIONS.find((l) => l.code === selectedLang)?.native || 'Assamese'})
                        </span>
                        
                        <button
                          onClick={() => handleSpeakMessage(msg)}
                          className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg transition active:scale-95 ${
                            isThisSpeaking
                              ? 'bg-ner-terracotta text-white font-bold shadow-sm'
                              : isUser
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'text-ner-terracotta hover:bg-ner-terracotta/10 bg-ner-offwhite border border-ner-border'
                          }`}
                        >
                          {isThisSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen Aloud</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading indicator when generating AI answer */}
              {isLoading && (
                <div className="flex flex-col items-start animate-fade-in">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-ner-terracotta mb-1 px-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Smriti is thinking gently...</span>
                  </span>
                  <div className="p-4 rounded-2xl bg-white border border-ner-border text-ner-black rounded-tl-xs shadow-md max-w-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-ner-black/60 font-mono">Synthesizing calm memory response...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Pill Chips */}
            <div className="pt-2 border-t border-ner-border/70 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-ner-black/60">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-ner-terracotta" />
                  Try asking the AI Companion:
                </span>
                <span className="text-[10px] text-ner-black/40">Tap any prompt</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.query)}
                    className="text-[11px] font-mono bg-white hover:bg-ner-black hover:text-white border border-ner-border px-2.5 py-1.5 rounded-full transition-all duration-150 text-ner-black/80 font-medium active:scale-95 shadow-2xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Message Input & Mic Bar */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={`Ask Smriti in ${NER_LANG_OPTIONS.find((l) => l.code === selectedLang)?.label || 'English'}...`}
                    className="w-full bg-white border border-ner-border rounded-2xl px-4 py-3 pr-11 text-xs sm:text-sm text-ner-black focus:outline-none focus:border-ner-black shadow-inner transition"
                  />
                  
                  {/* Microphone voice button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        playCalmingChime();
                        startListening(selectedLang);
                      }
                    }}
                    className={`absolute right-2 p-2 rounded-xl transition ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-ner-black/50 hover:text-ner-black hover:bg-ner-offwhite'
                    }`}
                    title={isListening ? 'Stop listening' : 'Speak your query'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-ner-terracotta" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-5 py-3 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 disabled:opacity-40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-md shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5 text-ner-terracotta" />
                </button>
              </form>

              {isListening && (
                <p className="text-[11px] font-mono text-rose-600 mt-1.5 pl-1 flex items-center gap-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Listening to your voice... Speak now.
                </p>
              )}
            </div>

            {/* Script Step Buttons when in Staged Mode */}
            {activeTab === 'script' && (
              <div className="pt-2 border-t border-ner-border/70 flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                <span className="text-ner-black/50 text-[11px]">
                  Step through demo conversation (auto reads aloud):
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => {
                        setScriptStep(step);
                        const msg = messages[step];
                        if (msg) {
                          handleSpeakMessage(msg);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        scriptStep === step
                          ? 'bg-ner-black text-white shadow-sm'
                          : 'bg-ner-offwhite border border-ner-border text-ner-black/60 hover:text-ner-black'
                      }`}
                    >
                      <Volume2 className="w-3 h-3 text-ner-terracotta" />
                      <span>0{step + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
