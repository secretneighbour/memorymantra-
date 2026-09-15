import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { VoiceDictationButton } from './VoiceDictationButton';
import { MemoryCompanionService } from '../services/ai/memoryCompanion';
import { Bot, Send, X, Sparkles, Volume2, VolumeX, HelpCircle, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
}

export const AICompanionDrawer: React.FC = () => {
  const { isAICompanionOpen, setIsAICompanionOpen, activePatient, reminders } = useRole();
  const { speakText, stopSpeaking, isSpeaking, language, playCalmingChime, t } = useAccessibility();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
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
    if (isAICompanionOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAICompanionOpen, isLoading]);

  const quickQuestions = [
    t.aiCompanionQuick1,
    t.aiCompanionQuick2,
    t.aiCompanionQuick3,
    t.aiCompanionQuick4,
    t.aiCompanionQuick5,
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

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
      });

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: res.provider,
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(res.text, language);
      setSpeakingMsgId(botMsgId);
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeak = (msg: ChatMessage) => {
    if (isSpeaking && speakingMsgId === msg.id) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setSpeakingMsgId(msg.id);
      speakText(msg.text, language);
    }
  };

  if (!isAICompanionOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-ner-offwhite border-l border-ner-black/20 shadow-2xl flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-5 border-b border-ner-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ner-terracotta/10 text-ner-terracotta flex items-center justify-center border border-ner-terracotta/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-ner-black text-lg">{t.aiCompanionTitle}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-ner-black/60">
              {t.encouragement}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            stopSpeaking();
            setIsAICompanionOpen(false);
          }}
          className="p-2 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors"
          aria-label="Close Companion"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-800 font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-ner-terracotta shrink-0" />
          <span>Compassionate AI Intelligence Connected</span>
        </div>
        <span className="text-[10px] font-mono bg-emerald-200/60 px-2 py-0.5 rounded-full font-bold">
          Active
        </span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-ner-black text-white rounded-br-none'
                  : 'bg-white border border-ner-border text-ner-black rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-[15px]">{msg.text}</p>

              {msg.sender === 'assistant' && (
                <div className="mt-2.5 pt-2 border-t border-ner-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-ner-black/40">{msg.timestamp}</span>
                  <button
                    onClick={() => toggleSpeak(msg)}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded transition ${
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
            <div className="bg-white border border-ner-border rounded-2xl p-4 text-xs text-ner-black/70 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-ner-terracotta" />
              <span>Smriti is thinking warmly...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-ner-border bg-white/70">
        <p className="text-xs font-semibold text-ner-black/50 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> {t.roleModalTag}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border px-3 py-1.5 rounded-full transition-all duration-150 text-ner-black/80 font-medium active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-ner-border bg-white">
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
              className="flex-1 bg-ner-offwhite border border-ner-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ner-black transition-colors"
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
            className="p-3 rounded-xl bg-ner-black text-white hover:bg-ner-black/80 disabled:opacity-40 transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
