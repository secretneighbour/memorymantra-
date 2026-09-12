import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Bot, Send, X, Sparkles, Volume2, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICompanionDrawer: React.FC = () => {
  const { isAICompanionOpen, setIsAICompanionOpen, activePatient, reminders } = useRole();
  const { speakText } = useAccessibility();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${activePatient.name}! I am your Neuro Memory Companion. How can I help you feel peaceful and organized today?`,
      timestamp: 'Just now'
    }
  ]);

  const quickQuestions = [
    "What am I doing today?",
    "When is my next appointment?",
    "Remind me about my daughter's birthday",
    "What activities did I complete today?",
    "How did I do today?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Generate intelligent simulated response based on live state
    setTimeout(() => {
      let responseText = "";
      const lower = query.toLowerCase();

      if (lower.includes('what am i doing') || lower.includes('schedule') || lower.includes('today')) {
        const pendingReminders = reminders.filter(r => !r.completed);
        if (pendingReminders.length > 0) {
          responseText = `Today you have ${reminders.length} items scheduled. Your next activity is "${pendingReminders[0].title}" at ${pendingReminders[0].time}. You have already completed ${reminders.filter(r => r.completed).length} items!`;
        } else {
          responseText = `You have completed all scheduled reminders for today! You can relax and enjoy some herbal tea or music.`;
        }
      } else if (lower.includes('next appointment') || lower.includes('doctor')) {
        responseText = `Your next appointment is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic. Your son Rohan will accompany you.`;
      } else if (lower.includes('daughter') || lower.includes('birthday')) {
        responseText = `Your daughter's birthday is on 18 September. We have pinned a note so you won't forget to call her with warm blessings!`;
      } else if (lower.includes('completed') || lower.includes('how did i do') || lower.includes('activities')) {
        responseText = `You completed ${activePatient.stats.completedToday} out of ${activePatient.stats.totalToday} cognitive activities today with an impressive average accuracy of ${activePatient.stats.weeklyScore}%. You have an active ${activePatient.stats.streakDays}-day streak!`;
      } else if (lower.includes('medicine') || lower.includes('blood pressure')) {
        responseText = `Your morning blood pressure medicine (1 tablet with warm water) is marked as taken at 8:00 AM. Your next reminder is at 1:00 PM for lunch.`;
      } else {
        responseText = `I hear you, ${activePatient.name}. I have recorded that in your Memory notes. Remember, your loved ones are right beside you and you are doing wonderful today.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
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
              <h3 className="font-bold text-ner-black text-lg">Memory Companion</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-ner-black text-white">
                AI DEMO
              </span>
            </div>
            <p className="text-xs text-ner-black/60">
              Gentle conversational memory assistance
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAICompanionOpen(false)}
          className="p-2 rounded-full hover:bg-ner-black/5 text-ner-black/60 hover:text-ner-black transition-colors"
          aria-label="Close Companion"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-ner-terracotta/5 border-b border-ner-terracotta/10 px-4 py-2 flex items-center gap-2 text-xs text-ner-terracotta font-medium">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>Simulated AI Wellness Assistant for SIH 2026</span>
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
                    onClick={() => speakText(msg.text)}
                    className="inline-flex items-center gap-1 text-xs text-ner-terracotta hover:underline font-medium"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-ner-border bg-white/70">
        <p className="text-xs font-semibold text-ner-black/50 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Tap to ask directly:
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
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about your day, memories, or tasks..."
            className="flex-1 bg-ner-offwhite border border-ner-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ner-black transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
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
