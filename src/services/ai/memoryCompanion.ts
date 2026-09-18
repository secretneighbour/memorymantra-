import { Patient, ReminderItem, MemoryNote } from '../../types';

export interface PinnedMemoryContext {
  id: string;
  text: string;
  tag: string;
  icon?: string;
}

export interface StructuredChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
  actionRoute?: string;
  actionLabel?: string;
  suggestedReplies?: string[];
  mode?: 'companion' | 'memory_recall' | 'calm' | 'routine';
}

export interface CompanionResponse {
  text: string;
  provider?: string;
  actionRoute?: string;
  actionLabel?: string;
  suggestedReplies?: string[];
  voicePrompt?: string;
}

const STORAGE_KEY = 'smriti_companion_chat_history_v2';

export class MemoryCompanionService {
  /**
   * Loads persisted conversation history for continuous memory across sessions
   */
  public static loadSessionHistory(): StructuredChatMessage[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load session history:', e);
    }
    return [];
  }

  /**
   * Persists conversation history
   */
  public static saveSessionHistory(messages: StructuredChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn('Failed to save session history:', e);
    }
  }

  /**
   * Clears conversation history
   */
  public static clearSessionHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session history:', e);
    }
  }

  /**
   * Calls the server-side Gemini AI companion endpoint with context-aware prompt engineering.
   * If offline or API unavailable, automatically falls back to deterministic empathetic NLP.
   */
  public static async queryAICompanion(params: {
    message: string;
    patient: Patient;
    reminders: ReminderItem[];
    pinnedMemories?: PinnedMemoryContext[];
    memoryNotes?: MemoryNote[];
    wellbeing?: string;
    language?: string;
    history?: { role: 'user' | 'assistant'; text: string }[];
    mode?: 'companion' | 'memory_recall' | 'calm' | 'routine';
  }): Promise<CompanionResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: params.message,
          history: params.history || [],
          language: params.language || 'en',
          mode: params.mode || 'companion',
          patientContext: {
            name: params.patient.name,
            stage: params.patient.stage || 'Mild Cognitive Support',
            location: params.patient.location || 'Guwahati, Assam',
            reminders: params.reminders,
            pinnedMemories: params.pinnedMemories || [],
            memoryNotes: params.memoryNotes || [],
            wellbeing: params.wellbeing || 'Peaceful and calm',
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.reply) {
        return {
          text: data.reply,
          provider: data.provider || 'gemini-3.8-flash',
          actionRoute: data.actionRoute,
          actionLabel: data.actionLabel,
          suggestedReplies: Array.isArray(data.suggestedReplies) ? data.suggestedReplies : undefined,
        };
      }
    } catch (err) {
      console.warn('Direct AI companion API fallback engaged:', err);
    }

    // Fallback to local rule engine
    const local = MemoryCompanionService.processQuery(
      params.message,
      params.patient,
      params.reminders,
      params.language || 'en',
      params.mode || 'companion'
    );
    return local;
  }

  /**
   * Deterministic Natural Language Processor for Memory Companion
   * Connects directly to live reminders, patient profile, and regional cultural anchors.
   */
  public static processQuery(
    rawQuery: string,
    patient: Patient,
    reminders: ReminderItem[],
    language: string = 'en',
    _mode: 'companion' | 'memory_recall' | 'calm' | 'routine' = 'companion'
  ): CompanionResponse {
    const q = rawQuery.trim().toLowerCase();
    const isAssamese = language === 'as';
    const isBengali = language === 'bn';
    const isHindi = language === 'hi';

    // 1. Daily Schedule & Timeline
    if (q.includes('schedule') || q.includes('plan') || q.includes('what do i need to do') || q.includes('today') || q.includes('আজি') || q.includes('আজকে') || q.includes('आज')) {
      const pending = reminders.filter(r => !r.completed);
      if (pending.length > 0) {
        const next = pending[0];
        let text = `You have ${reminders.length} things planned today. Next up is "${next.title}" at ${next.time}. You have completed ${reminders.filter(r => r.completed).length} items so far!`;
        if (isAssamese) {
          text = `আজি আপোনাৰ দিনটোৰ পৰিকল্পনাত "${next.title}" আছে সময় ${next.time} বজাত। আপুনি বৰ্তমানলৈকে সুন্দৰভাৱে আগবাঢ়িছে।`;
        } else if (isBengali) {
          text = `আজকে আপনার তালিকায় পরবর্তী কাজ হলো "${next.title}" সময় ${next.time}। আপনি ইতিমধ্যে সুন্দরভাবে দিন কাটাচ্ছেন।`;
        } else if (isHindi) {
          text = `आज की दिनचर्या में आपका अगला काम "${next.title}" समय ${next.time} पर है। सब कुछ बहुत व्यवस्थित चल रहा है।`;
        }
        return {
          text,
          provider: 'local-reassurance-engine',
          actionRoute: '/memory',
          actionLabel: "View Today's Timeline",
          suggestedReplies: [
            "What is my morning medication?",
            "When is afternoon tea?",
            "Who is calling me today?"
          ]
        };
      } else {
        let text = `You have completed all your planned activities for today, ${patient.name}! You can relax with a warm cup of Assam tea or listen to Dr. Bhupen Hazarika's melodies.`;
        if (isAssamese) {
          text = `আপোনাৰ আজিৰ সকলো নিৰ্ধাৰিত কাম সম্পন্ন হ'ল, ${patient.name}। এতিয়া একাপ গৰম অসমীয়া চাহ খাই জিৰণি লওক।`;
        }
        return {
          text,
          provider: 'local-reassurance-engine',
          actionRoute: '/memories',
          actionLabel: 'Open Heritage Vault',
          suggestedReplies: [
            "Play Dr. Bhupen's songs",
            "Tell me about Shillong trip",
            "Guide me through deep breathing"
          ]
        };
      }
    }

    // 2. Doctor Appointment & Health
    if (q.includes('doctor') || q.includes('appointment') || q.includes('dr.') || q.includes('roy') || q.includes('চিকিৎসক') || q.includes('डाक्टर')) {
      let text = `Your upcoming health check-up is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic. Your son Rohan will accompany you.`;
      if (isAssamese) {
        text = `আপোনাৰ ডাঃ দেৱব্ৰত ৰয়ৰ সৈতে সাক্ষাৎ সোমবাৰে পুৱা ১১ বজাত দিছপুৰ পলিক্লিনিকত আছে, আৰু ৰোহন আপোনাৰ লগত থাকিব।`;
      }
      return {
        text,
        provider: 'local-reassurance-engine',
        actionRoute: '/reminders',
        actionLabel: 'View Health Check Details',
        suggestedReplies: [
          "What medicine should I take?",
          "Call Rohan to confirm",
          "What is my next reminder?"
        ]
      };
    }

    // 3. Medication & Pills
    if (q.includes('medicine') || q.includes('medication') || q.includes('pill') || q.includes('bp') || q.includes('ঔষধ') || q.includes('दवा')) {
      const med = reminders.find(r => r.category === 'medication');
      let text = med 
        ? `Your medication routine: "${med.title}" at ${med.time} (${med.doseOrNote || 'Take with water'}). Status: ${med.completed ? 'Already completed' : 'Upcoming'}.`
        : `Your medications are safely tracked by Rohan and Dr. Roy. Everything is right on schedule.`;
      return {
        text,
        provider: 'local-reassurance-engine',
        actionRoute: '/reminders',
        actionLabel: 'Open Medication List',
        suggestedReplies: [
          "Did I take morning medicine?",
          "When is my next meal?",
          "Check today's schedule"
        ]
      };
    }

    // 4. Heritage Recall, Songs & Stories (Assam / NER)
    if (q.includes('song') || q.includes('music') || q.includes('bhupen') || q.includes('bihu') || q.includes('majuli') || q.includes('shillong') || q.includes('গান') || q.includes('বিহু') || q.includes('স্মৃতি')) {
      let text = `Dr. Bhupen Hazarika's Brahmaputra songs and the vibrant beats of Rongali Bihu always bring deep joy. Your Heritage Vault holds these cherished family memories and photographs.`;
      if (isAssamese) {
        text = `ড০ ভূপেন হাজৰিকাৰ কালজয়ী গীত আৰু ৰঙালী বিহুৰ স্মৃতিৰে আপোনাৰ মনটো শান্ত কৰক। আপোনাৰ স্মৃতি ভঁৰালত এই সকলো সংৰক্ষিত আছে।`;
      }
      return {
        text,
        provider: 'local-reassurance-engine',
        actionRoute: '/memories',
        actionLabel: 'Open Heritage Vault',
        suggestedReplies: [
          "Tell me about Majuli Island",
          "How was our family trip?",
          "Show me my photo album"
        ]
      };
    }

    // 5. Calming, Anxiety & Breathing
    if (q.includes('anxious') || q.includes('breathe') || q.includes('calm') || q.includes('relax') || q.includes('worried') || q.includes('শান্ত') || q.includes('শ্বাস')) {
      let text = `Let's take a peaceful moment together, ${patient.name}. Inhale the gentle morning air deeply... hold softly... and slowly exhale. You are completely safe and surrounded by love.`;
      if (isAssamese) {
        text = `আহক আমি একেলগে এটি দীঘল শান্ত উশাহ লওঁ, ${patient.name}। আপুনি সম্পূৰ্ণ সুৰক্ষিত আৰু আপোনাৰ পৰিয়ালৰ সকলোৱে আপোনাক বহুত মৰম কৰে।`;
      }
      return {
        text,
        provider: 'local-reassurance-engine',
        actionRoute: '/memory',
        actionLabel: 'Grounding Relaxation',
        suggestedReplies: [
          "Guide me through one more breath",
          "Tell me a peaceful tea story",
          "What is my next reminder?"
        ]
      };
    }

    // 6. Family & Caregiver
    if (q.includes('family') || q.includes('daughter') || q.includes('son') || q.includes('rohan') || q.includes('priya') || q.includes('ananya') || q.includes('পৰিয়াল')) {
      let text = `Your son Rohan is your dedicated primary caregiver, and your daughter Priya and granddaughter Ananya look forward to speaking with you. They love you dearly.`;
      return {
        text,
        provider: 'local-reassurance-engine',
        actionRoute: '/family',
        actionLabel: 'Open Family Circle',
        suggestedReplies: [
          "When is family calling today?",
          "What did we do yesterday?",
          "View my family pictures"
        ]
      };
    }

    // Default Empathetic Response
    let defaultText = `I am right here with you, ${patient.name}. You are doing wonderful today, and everything is safe and calm. How would you like me to help you right now?`;
    if (isAssamese) {
      defaultText = `মই আপোনাৰ ওচৰতেই আছোঁ, ${patient.name}। আজিৰ দিনটো অতি শান্তিময় আৰু আনন্দদায়ক। আপোনাক মই কিদৰে সহায় কৰিব পাৰোঁ?`;
    }
    return {
      text: defaultText,
      provider: 'local-reassurance-engine',
      actionRoute: '/memory',
      actionLabel: "View Today's Timeline",
      suggestedReplies: [
        "What is my schedule today?",
        "Tell me about Assam tea gardens",
        "Guide me through deep breathing"
      ]
    };
  }
}
