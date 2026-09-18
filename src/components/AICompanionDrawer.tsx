import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { VoiceDictationButton } from './VoiceDictationButton';
import { MemoryCompanionService } from '../services/ai/memoryCompanion';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Loader2, 
  Compass, 
  Heart, 
  Brain, 
  Clock, 
  ArrowRight,
  Globe,
  Radio
} from 'lucide-react';
import { nerLanguages } from '../data/translations';
import { NERLanguage } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
  actionRoute?: string;
  actionLabel?: string;
}

type CompanionMode = 'companion' | 'memory_recall' | 'calm' | 'routine';

export const AICompanionDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isAICompanionOpen, setIsAICompanionOpen, activePatient, reminders } = useRole();
  const { 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    language, 
    setLanguage, 
    playCalmingChime, 
    primeSpeechEngine, 
    t 
  } = useAccessibility();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [activeMode, setActiveMode] = useState<CompanionMode>('companion');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: t.aiCompanionGreeting,
      timestamp: 'Just now',
      provider: 'gemini-3.8-flash',
    },
  ]);

  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMsgId(null);
    }
  }, [isSpeaking]);

  useEffect(() => {
    if (isAICompanionOpen) {
      primeSpeechEngine();
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAICompanionOpen, isLoading, primeSpeechEngine]);

  // Mode definitions
  const modes: { id: CompanionMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'companion', label: 'Gentle Companion', icon: <Heart className="w-3.5 h-3.5" />, desc: 'Warm reassurance' },
    { id: 'memory_recall', label: 'Heritage Recall', icon: <Brain className="w-3.5 h-3.5" />, desc: 'Stories & songs' },
    { id: 'calm', label: 'Calm & Breathe', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Grounding rhythm' },
    { id: 'routine', label: 'Daily Routine', icon: <Clock className="w-3.5 h-3.5" />, desc: 'Meds & meals' },
  ];

  // Dynamic quick questions based on active mode
  const getQuickQuestions = () => {
    if (activeMode === 'memory_recall') {
      return [
        'Tell me about Dr. Bhupen Hazarika’s songs',
        'What are the memories in my Heritage Vault?',
        'Tell me about Bihu celebrations in Majuli',
        'How was our Shillong family trip?',
      ];
    }
    if (activeMode === 'calm') {
      return [
        'Guide me through gentle deep breathing',
        'I feel a little anxious, reassure me',
        'Tell me a soothing story about Assam tea gardens',
        'Help me relax before afternoon rest',
      ];
    }
    if (activeMode === 'routine') {
      return [
        'What is my next reminder today?',
        'Did I take my morning medication?',
        'When is my next doctor appointment?',
        'Who is calling me today?',
      ];
    }
    return [
      t.aiCompanionQuick1,
      t.aiCompanionQuick2,
      t.aiCompanionQuick3,
      t.aiCompanionQuick4,
      t.aiCompanionQuick5,
    ];
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    primeSpeechEngine();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);
    playCalmingChime();

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender,
        text: m.text,
      }));

      const res = await MemoryCompanionService.queryAICompanion({
        message: query,
        patient: activePatient,
        reminders: reminders,
        language: language,
        history,
        mode: activeMode,
      });

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: res.provider,
        actionRoute: res.actionRoute,
        actionLabel: res.actionLabel,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeakEnabled) {
        setSpeakingMsgId(botMsgId);
        speakText(res.text, language, {
          onStart: () => setSpeakingMsgId(botMsgId),
          onEnd: () => setSpeakingMsgId(null),
        });
      }
    } catch (e) {
      console.warn('AI Drawer query error:', e);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `I am right here with you, ${activePatient.name}. Everything is safe, and your care circle loves you.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'offline-reassurance',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeakEnabled) {
        setSpeakingMsgId(fallbackMsg.id);
        speakText(fallbackMsg.text, language, {
          onStart: () => setSpeakingMsgId(fallbackMsg.id),
          onEnd: () => setSpeakingMsgId(null),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeak = (msg: ChatMessage) => {
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

  const handleNavigateAction = (route: string) => {
    stopSpeaking();
    setIsAICompanionOpen(false);
    navigate(route);
  };

  if (!isAICompanionOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        onClick={() => {
          stopSpeaking();
          setIsAICompanionOpen(false);
        }}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-ner-offwhite border-l border-ner-black/20 shadow-2xl flex flex-col animate-slide-left pt-[env(safe-area-inset-top,0px)]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-ner-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-ner-terracotta/10 text-ner-terracotta flex items-center justify-center border border-ner-terracotta/20 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-ner-black text-sm sm:text-base">{t.aiCompanionTitle}</h3>
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-ner-black/60 line-clamp-1">
                {t.encouragement}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                primeSpeechEngine();
                setAutoSpeakEnabled(!autoSpeakEnabled);
                if (isSpeaking) stopSpeaking();
              }}
              className={`p-2 rounded-full border transition-colors flex items-center gap-1 text-xs font-semibold ${
                autoSpeakEnabled
                  ? 'border-ner-terracotta/40 bg-ner-terracotta/10 text-ner-terracotta'
                  : 'border-ner-border bg-ner-offwhite text-ner-black/50'
              }`}
              title={autoSpeakEnabled ? 'Voice response enabled (Click to mute)' : 'Voice response muted (Click to enable)'}
              aria-label="Toggle voice responses"
            >
              {autoSpeakEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                setIsAICompanionOpen(false);
              }}
              className="p-2 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dialect / Language Quick Toggle Strip */}
        <div className="bg-slate-50 border-b border-ner-border px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-ner-black/60 shrink-0">
            <Globe className="w-3 h-3 text-ner-terracotta" />
            <span>Voice Language:</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {([
              { code: 'en', label: 'English' },
              { code: 'as', label: 'অসমীয়া' },
              { code: 'bn', label: 'বাংলা' },
              { code: 'hi', label: 'हिन्दी' },
            ] as { code: NERLanguage; label: string }[]).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition ${
                  language === lang.code
                    ? 'bg-ner-black text-white font-bold'
                    : 'bg-white border border-ner-border text-ner-black/70 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-white/80 border-b border-ner-border p-2 flex gap-1.5 overflow-x-auto">
          {modes.map((m) => {
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMode(m.id);
                  playCalmingChime();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-ner-terracotta text-white shadow-xs'
                    : 'bg-ner-offwhite hover:bg-ner-border/40 text-ner-black/70'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-ner-black text-white rounded-br-none'
                    : 'bg-white border border-ner-border text-ner-black rounded-bl-none shadow-xs'
                }`}
              >
                <p className="text-[14px] sm:text-[15px]">{msg.text}</p>

                {/* Contextual Action Button if suggested by AI */}
                {msg.actionRoute && msg.actionLabel && (
                  <div className="mt-3 pt-2.5 border-t border-ner-border/40">
                    <button
                      onClick={() => handleNavigateAction(msg.actionRoute!)}
                      className="w-full py-2 px-3 rounded-xl bg-ner-terracotta/10 hover:bg-ner-terracotta hover:text-white border border-ner-terracotta/30 text-ner-terracotta font-semibold text-xs flex items-center justify-between transition-all group"
                    >
                      <span>{msg.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}

                {msg.sender === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-ner-border/40 flex items-center justify-between">
                    <span className="text-[10px] text-ner-black/40 font-mono">{msg.timestamp}</span>
                    <button
                      onClick={() => toggleSpeak(msg)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition min-h-[32px] ${
                        isSpeaking && speakingMsgId === msg.id
                          ? 'bg-ner-terracotta text-white'
                          : 'text-ner-terracotta hover:underline'
                      }`}
                      title={t.listenAloud}
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
          ))}

          {isLoading && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="bg-white border border-ner-border rounded-2xl p-3.5 text-xs text-ner-black/70 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-ner-terracotta" />
                <span>Smriti is thinking gently...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 border-t border-ner-border bg-white/80">
          <p className="text-[11px] font-semibold text-ner-black/50 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-ner-terracotta" /> Suggested for you:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {getQuickQuestions().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border px-2.5 py-1.5 rounded-full transition-all duration-150 text-ner-black/80 font-medium active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="p-3 sm:p-4 border-t border-ner-border bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t.aiCompanionPlaceholder}
                className="flex-1 bg-ner-offwhite border border-ner-border rounded-xl px-3.5 sm:px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-ner-black transition-colors"
              />
              <VoiceDictationButton
                currentValue={inputQuery}
                onTranscript={(text) => setInputQuery(text)}
                size="md"
                label="Speak"
              />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-3 rounded-xl bg-ner-black text-white hover:bg-ner-black/80 disabled:opacity-40 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
