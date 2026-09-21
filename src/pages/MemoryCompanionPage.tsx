import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { initialPinnedMemories, initialMemoryNotes } from '../data/reminders';
import { TTSButton } from '../components/TTSButton';
import { VoiceDictationButton } from '../components/VoiceDictationButton';
import { 
  MemoryCompanionService, 
  StructuredChatMessage, 
  PinnedMemoryContext 
} from '../services/ai/memoryCompanion';
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Pin, 
  FileText, 
  Sparkles, 
  X, 
  Trash2, 
  Bot, 
  Send, 
  Volume2, 
  VolumeX, 
  Heart, 
  Brain, 
  Globe, 
  RotateCcw, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  HelpCircle, 
  Loader2, 
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { MemoryNote, NERLanguage } from '../types';

type CompanionMode = 'companion' | 'memory_recall' | 'calm' | 'routine';
type ActiveTab = 'chat' | 'timeline' | 'pinned' | 'notes';

export const MemoryCompanionPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePatient, 
    reminders, 
    toggleReminder, 
    addReminder, 
    deleteReminder, 
    wellbeingCheckIns 
  } = useRole();

  const { 
    t, 
    language, 
    setLanguage, 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    playCalmingChime, 
    primeSpeechEngine 
  } = useAccessibility();

  // Active view tab for balanced, uncluttered presentation
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  // Add Reminder Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newCategory, setNewCategory] = useState<'medication' | 'exercise' | 'meal' | 'family' | 'walk' | 'other'>('medication');
  const [newNote, setNewNote] = useState('');

  // Pinned anchors and caregiver memory notes state
  const [pinnedList, setPinnedList] = useState<PinnedMemoryContext[]>(() => {
    const saved = localStorage.getItem('memory_mantra_pinned_memories') || localStorage.getItem('smriti_pinned_memories');
    return saved ? JSON.parse(saved) : initialPinnedMemories;
  });

  const [memoryNotes, setMemoryNotes] = useState<MemoryNote[]>(() => {
    const saved = localStorage.getItem('memory_mantra_memory_notes') || localStorage.getItem('smriti_memory_notes');
    return saved ? JSON.parse(saved) : initialMemoryNotes;
  });

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // AI Companion Chat State
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<CompanionMode>('companion');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize structured conversation history
  const [messages, setMessages] = useState<StructuredChatMessage[]>(() => {
    const existing = MemoryCompanionService.loadSessionHistory();
    if (existing && existing.length > 0) {
      return existing;
    }
    return [
      {
        id: 'msg-init',
        role: 'assistant',
        text: `নমস্কাৰ / Hello ${activePatient?.name || 'Aai'}! I am Memory Mantra, your dedicated memory companion. I am right here to help you remember your day, recall cherished songs of Assam, or simply have a peaceful chat. How can I brighten your day?`,
        timestamp: 'Just now',
        provider: 'gemini-3.8-flash',
        suggestedReplies: [
          'What is my schedule today?',
          'Tell me about Dr. Bhupen Hazarika’s songs',
          'Guide me through gentle breathing',
        ],
      },
    ];
  });

  // Persist conversation history changes
  useEffect(() => {
    MemoryCompanionService.saveSessionHistory(messages);
  }, [messages]);

  // Persist pinned memories & notes (dual write for seamless migration)
  useEffect(() => {
    const val = JSON.stringify(pinnedList);
    localStorage.setItem('memory_mantra_pinned_memories', val);
    localStorage.setItem('smriti_pinned_memories', val);
  }, [pinnedList]);

  useEffect(() => {
    const val = JSON.stringify(memoryNotes);
    localStorage.setItem('memory_mantra_memory_notes', val);
    localStorage.setItem('smriti_memory_notes', val);
  }, [memoryNotes]);

  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMsgId(null);
    }
  }, [isSpeaking]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isLoading]);

  // Companion modes configuration with elder-friendly labels
  const companionModes: { id: CompanionMode; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'companion',
      title: 'Gentle Companion',
      subtitle: 'Warm reassurance & daily love',
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-rose-500/10 text-rose-700 border-rose-200',
    },
    {
      id: 'memory_recall',
      title: 'Heritage Reminiscence',
      subtitle: 'Assam folk songs, Majuli & stories',
      icon: <Brain className="w-4 h-4" />,
      color: 'bg-amber-500/10 text-amber-800 border-amber-200',
    },
    {
      id: 'calm',
      title: 'Calm & Breathe',
      subtitle: '3-step soothing rhythm & peace',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
    },
    {
      id: 'routine',
      title: 'Daily Schedule & Meds',
      subtitle: 'Pills, hydration & appointments',
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-sky-500/10 text-sky-800 border-sky-200',
    },
  ];

  // Dynamic quick prompt pills based on active mode
  const getQuickPrompts = () => {
    switch (activeMode) {
      case 'memory_recall':
        return [
          'Tell me about Dr. Bhupen Hazarika’s Brahmaputra songs',
          'What are the memories saved in my Heritage Vault?',
          'Tell me about Rongali Bihu celebrations in Majuli',
          'What was our family trip to Shillong like?',
        ];
      case 'calm':
        return [
          'Guide me through gentle 3-step deep breathing',
          'I feel a little restless, please comfort me',
          'Tell me a soothing story about morning tea gardens',
          'Help me relax before afternoon rest',
        ];
      case 'routine':
        return [
          'What is my next medicine or reminder today?',
          'Did I take my morning blood pressure pill?',
          'When is my next appointment with Dr. Roy?',
          'Who in my family is calling me today?',
        ];
      case 'companion':
      default:
        return [
          'What do I have planned today?',
          'Tell me about my family members who love me',
          'How is the weather and morning tea today?',
          'Let’s play a gentle cognitive memory game',
        ];
    }
  };

  // Handle sending a message with structured history and context
  const handleSendMessage = async (textOverride?: string) => {
    const messageToSend = (textOverride || inputQuery).trim();
    if (!messageToSend || isLoading) return;

    primeSpeechEngine();
    playCalmingChime();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: StructuredChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: messageToSend,
      timestamp: timeStr,
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInputQuery('');
    setIsLoading(true);

    try {
      // Build structured conversation history payload (last 6 turns)
      const formattedHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Gather latest wellbeing check-in
      const latestWellbeing = wellbeingCheckIns.length > 0 
        ? `${wellbeingCheckIns[0].mood} (${wellbeingCheckIns[0].note || 'No specific note'})`
        : 'Feeling calm and peaceful';

      const response = await MemoryCompanionService.queryAICompanion({
        message: messageToSend,
        patient: activePatient,
        reminders: reminders,
        pinnedMemories: pinnedList,
        memoryNotes: memoryNotes,
        wellbeing: latestWellbeing,
        language: language,
        history: formattedHistory,
        mode: activeMode,
      });

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: StructuredChatMessage = {
        id: botMsgId,
        role: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: response.provider || 'gemini-3.8-flash',
        actionRoute: response.actionRoute,
        actionLabel: response.actionLabel,
        suggestedReplies: response.suggestedReplies,
        mode: activeMode,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto-narrate response if enabled
      if (autoSpeak) {
        setSpeakingMsgId(botMsgId);
        speakText(response.text, language, {
          onStart: () => setSpeakingMsgId(botMsgId),
          onEnd: () => setSpeakingMsgId(null),
        });
      }
    } catch (err) {
      console.warn('Memory Companion conversation turn error:', err);
      const fallbackMsg: StructuredChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `I am right here with you, ${activePatient?.name || 'Aai'}. Everything is peaceful, safe, and your family loves you dearly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'offline-reassurance',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeak) {
        setSpeakingMsgId(fallbackMsg.id);
        speakText(fallbackMsg.text, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeakMessage = (msg: StructuredChatMessage) => {
    if (isSpeaking && speakingMsgId === msg.id) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      primeSpeechEngine();
      setSpeakingMsgId(msg.id);
      speakText(msg.text, language, {
        onStart: () => setSpeakingMsgId(msg.id),
        onEnd: () => setSpeakingMsgId(null),
      });
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    MemoryCompanionService.clearSessionHistory();
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        text: `Hello ${activePatient?.name || 'Aai'}! Memory Mantra is refreshed and ready. What would you like to explore or talk about together?`,
        timestamp: 'Just now',
        provider: 'gemini-3.8-flash',
        suggestedReplies: [
          'What is my schedule today?',
          'Tell me about Dr. Bhupen Hazarika’s songs',
          'Guide me through gentle breathing',
        ],
      },
    ]);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder({
      title: newTitle,
      time: newTime,
      category: newCategory,
      doseOrNote: newNote || undefined,
      priority: 'normal',
    });

    setNewTitle('');
    setNewNote('');
    setIsAddModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const noteItem: MemoryNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      date: 'Just now',
      pinned: false,
    };

    setMemoryNotes([noteItem, ...memoryNotes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    setMemoryNotes(memoryNotes.filter((n) => n.id !== id));
  };

  const fullScheduleSpeechText = `${t.remindersTitle}. ${reminders
    .map(
      (r, i) =>
        `${i + 1}: ${r.time}, ${r.title}. ${r.doseOrNote ? r.doseOrNote + '.' : ''} ${
          r.completed ? t.completed : t.pending
        }`
    )
    .join(' ')}`;

  const pinnedMemoriesSpeechText = `${t.thingsToRemember}. ${pinnedList
    .map((p) => `${p.tag}: ${p.text}.`)
    .join(' ')}`;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in font-sans">
      {/* Top Banner & Header */}
      <div className="frost-card rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 border border-ner-border bg-gradient-to-br from-white/90 via-ner-offwhite to-amber-50/40 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold flex items-center gap-1.5 border border-ner-terracotta/20">
                <Bot className="w-3.5 h-3.5" />
                <span>Memory Mantra AI Memory Companion</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-emerald-600" />
                <span>Gemini 3.8 Flash Powered</span>
              </span>
              <span className="text-xs font-mono text-ner-black/50">
                Patient: <strong className="text-ner-black">{activePatient?.name || 'Minoti Devi'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ner-black">
              {t.memoryCompanion} <span className="text-ner-terracotta text-xl sm:text-2xl font-normal font-serif italic">(স্মৃতি সংগী)</span>
            </h1>
            <p className="text-ner-black/70 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              An empathetic, dementia-aware companion designed for peaceful daily orientation, heartwarming regional reminiscence, and gentle memory anchors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <TTSButton
              text={`${t.memoryCompanion}. ${t.remindersSubtitle}. Memory Mantra is ready to assist with daily schedule and gentle memories.`}
              label={t.btnListen}
              size="md"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4 text-ner-terracotta" />
              <span>{t.remindersAddBtn}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 pt-4 border-t border-ner-border/60 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveTab('chat');
              playCalmingChime();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'chat'
                ? 'bg-ner-black text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-ner-black/70 border border-ner-border'
            }`}
          >
            <Bot className="w-4 h-4 text-ner-terracotta" />
            <span>Interactive Companion Chat</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-ner-terracotta/20 text-ner-terracotta font-mono font-bold">
              AI
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('timeline');
              playCalmingChime();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'timeline'
                ? 'bg-ner-black text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-ner-black/70 border border-ner-border'
            }`}
          >
            <Clock className="w-4 h-4 text-ner-terracotta" />
            <span>{t.remindersTitle}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-ner-black">
              {reminders.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pinned');
              playCalmingChime();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'pinned'
                ? 'bg-ner-black text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-ner-black/70 border border-ner-border'
            }`}
          >
            <Pin className="w-4 h-4 text-ner-terracotta" />
            <span>{t.thingsToRemember}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-ner-black">
              {pinnedList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notes');
              playCalmingChime();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'notes'
                ? 'bg-ner-black text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-ner-black/70 border border-ner-border'
            }`}
          >
            <FileText className="w-4 h-4 text-ner-sage" />
            <span>{t.caregiverNotesTitle}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-ner-black">
              {memoryNotes.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Columns: Conversational Experience */}
          <div className="lg:col-span-8 space-y-4">
            {/* Companion Mode Selector Banner */}
            <div className="frost-card rounded-2xl p-3 sm:p-4 bg-white border border-ner-border">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ner-black/60 flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-ner-terracotta" />
                  <span>Choose Companion Focus:</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-ner-black/50">Voice Language:</span>
                  <div className="flex items-center gap-1">
                    {([
                      { code: 'en', label: 'EN' },
                      { code: 'as', label: 'অসমীয়া' },
                      { code: 'bn', label: 'বাংলা' },
                      { code: 'hi', label: 'हिन्दी' },
                    ] as { code: NERLanguage; label: string }[]).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition ${
                          language === l.code
                            ? 'bg-ner-black text-white'
                            : 'bg-ner-offwhite border border-ner-border text-ner-black/70 hover:bg-slate-100'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {companionModes.map((mode) => {
                  const isSelected = activeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setActiveMode(mode.id);
                        playCalmingChime();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-ner-black text-white border-ner-black shadow-md ring-2 ring-ner-black/10'
                          : `${mode.color} hover:brightness-95`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="p-1 rounded-lg bg-white/20">{mode.icon}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm leading-tight">{mode.title}</div>
                        <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-white/70' : 'text-ner-black/60'}`}>
                          {mode.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation Thread Container */}
            <div className="frost-card rounded-3xl p-4 sm:p-6 bg-white/95 border border-ner-border flex flex-col min-h-[480px] max-h-[620px] shadow-sm">
              {/* Thread Header Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-ner-border/70 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-ner-terracotta/10 text-ner-terracotta flex items-center justify-center border border-ner-terracotta/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ner-black flex items-center gap-1.5">
                      <span>Memory Mantra Conversation</span>
                      <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Live AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-ner-black/50">
                      {messages.length} messages in current session
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      primeSpeechEngine();
                      setAutoSpeak(!autoSpeak);
                      if (isSpeaking) stopSpeaking();
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
                      autoSpeak
                        ? 'bg-ner-terracotta/10 text-ner-terracotta border-ner-terracotta/30'
                        : 'bg-ner-offwhite text-ner-black/50 border-ner-border'
                    }`}
                    title={autoSpeak ? 'Auto Voice On (Click to Mute)' : 'Auto Voice Muted (Click to Enable)'}
                  >
                    {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span className="text-[11px] hidden sm:inline">{autoSpeak ? 'Voice On' : 'Voice Muted'}</span>
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 rounded-xl border border-ner-border hover:bg-red-50 hover:text-red-600 text-ner-black/50 transition text-xs flex items-center gap-1"
                    title="Clear Conversation History"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                          isUser
                            ? 'bg-ner-black text-white rounded-br-none shadow-xs'
                            : 'bg-ner-offwhite/90 border border-ner-border text-ner-black rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p className="font-medium">{msg.text}</p>

                        {/* Contextual Action Button if suggested by model */}
                        {msg.actionRoute && msg.actionLabel && (
                          <div className="mt-3 pt-2.5 border-t border-ner-border/40">
                            <button
                              onClick={() => {
                                stopSpeaking();
                                navigate(msg.actionRoute!);
                              }}
                              className="w-full py-2 px-3.5 rounded-xl bg-ner-terracotta/15 hover:bg-ner-terracotta hover:text-white border border-ner-terracotta/30 text-ner-terracotta font-bold text-xs sm:text-sm flex items-center justify-between transition-all group"
                            >
                              <span>{msg.actionLabel}</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        )}

                        {/* Suggested reply chips */}
                        {msg.suggestedReplies && msg.suggestedReplies.length > 0 && !isUser && (
                          <div className="mt-3 pt-2.5 border-t border-ner-border/40">
                            <span className="text-[10px] font-mono text-ner-black/50 uppercase block mb-1.5">
                              Tap to reply:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedReplies.map((replyText, rIdx) => (
                                <button
                                  key={rIdx}
                                  onClick={() => handleSendMessage(replyText)}
                                  className="text-xs bg-white hover:bg-ner-black hover:text-white text-ner-black/80 font-medium px-2.5 py-1.5 rounded-full border border-ner-border transition-all active:scale-95 shadow-xs"
                                >
                                  {replyText}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom Timestamp & Voice Controls */}
                        {!isUser && (
                          <div className="mt-2.5 pt-2 border-t border-ner-border/30 flex items-center justify-between text-xs text-ner-black/40">
                            <span className="font-mono text-[10px]">
                              {msg.timestamp} • {msg.provider || 'gemini-3.8-flash'}
                            </span>
                            <button
                              onClick={() => handleToggleSpeakMessage(msg)}
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition ${
                                isSpeaking && speakingMsgId === msg.id
                                  ? 'bg-ner-terracotta text-white'
                                  : 'text-ner-terracotta hover:bg-ner-terracotta/10'
                              }`}
                            >
                              {isSpeaking && speakingMsgId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>{t.listenAloud}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start animate-fade-in">
                    <div className="bg-ner-offwhite border border-ner-border rounded-2xl p-3.5 text-xs text-ner-black/70 flex items-center gap-2 shadow-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-ner-terracotta" />
                      <span>Memory Mantra is thinking gently with love...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompts Strip */}
              <div className="pt-3 border-t border-ner-border mt-3">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-ner-black/50 mb-1.5">
                  <HelpCircle className="w-3 h-3 text-ner-terracotta" />
                  <span>Suggested Prompts for {activeMode.replace('_', ' ').toUpperCase()}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {getQuickPrompts().map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="text-xs bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border px-2.5 py-1 rounded-full text-ner-black/80 font-medium transition active:scale-95"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input & Voice Controls */}
              <div className="pt-3 mt-2 border-t border-ner-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-1.5 flex-1 bg-ner-offwhite border border-ner-border rounded-2xl px-3 py-1.5 focus-within:border-ner-black transition">
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder="Ask Memory Mantra about schedule, songs, tea, or memories..."
                      className="flex-1 bg-transparent text-sm sm:text-base text-ner-black focus:outline-none placeholder:text-ner-black/40"
                    />
                    <VoiceDictationButton
                      currentValue={inputQuery}
                      onTranscript={(text) => setInputQuery(text)}
                      size="sm"
                      label="Dictate"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isLoading}
                    className="p-3.5 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 disabled:opacity-40 transition shrink-0 shadow-sm active:scale-95 flex items-center justify-center min-w-[48px] min-h-[48px]"
                    aria-label="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Memory Anchors & Live Context Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Live Context Card */}
            <div className="frost-card rounded-3xl p-5 bg-white border border-ner-border space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-ner-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-ner-black">Active Memory Anchors</h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Synced
                </span>
              </div>

              <div className="space-y-3 text-xs text-ner-black/70">
                <div className="p-3 rounded-xl bg-ner-offwhite border border-ner-border space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ner-terracotta block">
                    Today's Schedule Progress
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ner-black">
                      {reminders.filter((r) => r.completed).length} of {reminders.length} tasks completed
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {reminders.length > 0 ? Math.round((reminders.filter((r) => r.completed).length / reminders.length) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ner-offwhite border border-ner-border space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ner-terracotta block">
                    Primary Caregiver & Family
                  </span>
                  <p className="font-bold text-ner-black">{(activePatient as any).caregiverName || activePatient.primaryCaregiver?.name || 'Caregiver'}</p>
                  <p className="text-[11px] text-ner-black/60">Family & Loved Ones Circle</p>
                </div>

                <div className="p-3 rounded-xl bg-ner-offwhite border border-ner-border space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ner-terracotta block">
                    Cultural Resonance
                  </span>
                  <p className="font-medium text-ner-black">
                    Majuli heritage, Dr. Bhupen Hazarika melodies, Assam ginger-cardamom tea.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-ner-border flex gap-2">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="flex-1 py-2 px-3 rounded-xl bg-ner-offwhite hover:bg-slate-100 text-ner-black text-xs font-bold border border-ner-border transition"
                >
                  Manage Timeline
                </button>
                <button
                  onClick={() => setActiveTab('pinned')}
                  className="flex-1 py-2 px-3 rounded-xl bg-ner-offwhite hover:bg-slate-100 text-ner-black text-xs font-bold border border-ner-border transition"
                >
                  View Pins
                </button>
              </div>
            </div>

            {/* Quick Things to Remember Preview */}
            <div className="frost-card rounded-3xl p-5 bg-amber-50/50 border border-amber-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Pin className="w-4 h-4 text-ner-terracotta" />
                  <span>Key Pinned Memories</span>
                </div>
                <button
                  onClick={() => setActiveTab('pinned')}
                  className="text-xs text-ner-terracotta font-bold hover:underline"
                >
                  All ({pinnedList.length})
                </button>
              </div>

              <div className="space-y-2">
                {pinnedList.slice(0, 3).map((pin) => (
                  <div
                    key={pin.id}
                    className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold text-ner-terracotta block">
                        {pin.tag}
                      </span>
                      <p className="font-bold text-xs text-ner-black line-clamp-1">{pin.text}</p>
                    </div>
                    <TTSButton text={`${pin.tag}: ${pin.text}`} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View Tab */}
      {activeTab === 'timeline' && (
        <div className="frost-card rounded-3xl p-6 sm:p-8 bg-white border border-ner-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ner-border">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-ner-terracotta" />
              <h2 className="text-xl font-bold text-ner-black">{t.remindersTitle}</h2>
              <span className="text-xs font-mono text-ner-black/50 ml-2">
                {reminders.filter((r) => r.completed).length} / {reminders.length} {t.done}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TTSButton text={fullScheduleSpeechText} label={t.btnListen} size="sm" />
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-ner-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-ner-terracotta" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {reminders.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleReminder(item.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-slate-50 border-ner-border/50 opacity-65'
                    : 'bg-white border-ner-border hover:border-ner-black/50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReminder(item.id);
                    }}
                    className="mt-0.5"
                    aria-label="Toggle reminder completion"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-ner-black/30 hover:text-ner-black" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border text-ner-black">
                        {item.time}
                      </span>
                      <h3 className={`font-bold text-base ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                        {item.title}
                      </h3>
                    </div>
                    {item.doseOrNote && (
                      <p className="text-xs text-ner-black/60 mt-1 pl-0.5">{item.doseOrNote}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <TTSButton text={`${item.time}: ${item.title}. ${item.doseOrNote || ''}`} size="sm" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReminder(item.id);
                    }}
                    className="text-ner-black/30 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-black/5"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Memories View Tab */}
      {activeTab === 'pinned' && (
        <div className="frost-card rounded-3xl p-6 sm:p-8 bg-white border border-ner-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ner-border">
            <div className="flex items-center gap-2.5">
              <Pin className="w-5 h-5 text-ner-terracotta" />
              <h2 className="text-xl font-bold text-ner-black">{t.thingsToRemember}</h2>
            </div>
            <TTSButton text={pinnedMemoriesSpeechText} label={t.btnListen} size="sm" />
          </div>
          <p className="text-xs text-ner-black/60 -mt-2">{t.memoriesSubtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pinnedList.map((pin) => (
              <div
                key={pin.id}
                className="p-5 rounded-2xl bg-ner-offwhite border border-ner-border shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ner-terracotta px-2 py-0.5 bg-white rounded-md border border-ner-border">
                      {pin.tag}
                    </span>
                    <TTSButton text={`${pin.tag}: ${pin.text}`} size="sm" />
                  </div>
                  <p className="font-bold text-base text-ner-black leading-snug">{pin.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caregiver Memory Notes View Tab */}
      {activeTab === 'notes' && (
        <div className="frost-card rounded-3xl p-6 sm:p-8 bg-white border border-ner-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ner-border">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-ner-sage" />
              <h2 className="text-xl font-bold text-ner-black">{t.caregiverNotesTitle}</h2>
            </div>
            <TTSButton
              text={`${t.caregiverNotesTitle}. ${memoryNotes.map((n) => `${n.title}: ${n.content}.`).join(' ')}`}
              label={t.btnListen}
              size="sm"
            />
          </div>
          <p className="text-xs text-ner-black/60 -mt-2">{t.memoriesStoryLabel}</p>

          {/* Add Note Form */}
          <form
            onSubmit={handleAddNote}
            className="p-4 sm:p-5 rounded-2xl bg-ner-offwhite border border-ner-border space-y-3"
          >
            <h4 className="font-bold text-xs uppercase tracking-wider text-ner-black/70">
              Add Personal Memory Anchor / Note
            </h4>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title (e.g. Favorite tea recipe, Favorite singer)"
              className="w-full text-sm font-bold p-3 bg-white border border-ner-border rounded-xl focus:outline-none focus:border-ner-black"
            />
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write memory detail (e.g. 2 crushed cardamoms, half-spoon ginger)..."
              rows={2}
              className="w-full text-xs sm:text-sm p-3 bg-white border border-ner-border rounded-xl focus:outline-none focus:border-ner-black"
            />
            <button
              type="submit"
              disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
              className="px-6 py-2.5 rounded-xl bg-ner-black text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 shadow-xs"
            >
              {t.save} Note
            </button>
          </form>

          {/* Notes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memoryNotes.map((note) => (
              <div key={note.id} className="p-5 rounded-2xl bg-white border border-ner-border shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-base text-ner-black">{note.title}</h4>
                    <span className="text-[10px] font-mono text-ner-black/40">{note.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ner-black/70 leading-relaxed mb-3">{note.content}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ner-border/40">
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                  <TTSButton text={`${note.title}. ${note.content}`} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-wrapper bg-ner-offwhite border-2 border-ner-black max-w-md w-full shadow-2xl relative">
            <div className="modal-header flex items-center justify-between">
              <h3 className="text-xl font-bold text-ner-black">{t.remindersAddBtn}</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="flex flex-col flex-grow overflow-hidden">
              <div className="modal-body space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                    {t.remindersNewTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Evening Walk or Eye Drops"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                    {t.remindersTimeLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                    {t.remindersDoseLabel}
                  </label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Take with warm water"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                  />
                </div>
              </div>

              <div className="modal-footer flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm hover:bg-ner-offwhite"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
