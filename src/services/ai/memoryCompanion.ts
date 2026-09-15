import { Patient, ReminderItem, WellbeingCheckIn } from '../../types';

export interface CompanionResponse {
  text: string;
  actionRoute?: string;
  actionLabel?: string;
  voicePrompt?: string;
}

export class MemoryCompanionService {
  /**
   * Calls the server-side Gemini AI companion endpoint.
   * If offline or API unavailable, automatically falls back to local NLP.
   */
  public static async queryAICompanion(params: {
    message: string;
    patient: Patient;
    reminders: ReminderItem[];
    language?: string;
    history?: { role: 'user' | 'assistant'; text: string }[];
  }): Promise<{ text: string; provider: string }> {
    try {
      const response = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          message: params.message,
          history: params.history || [],
          language: params.language || 'en',
          patientContext: {
            name: params.patient.name,
            location: params.patient.location || 'Guwahati, Assam',
            reminders: params.reminders,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.reply) {
        return {
          text: data.reply,
          provider: data.provider || 'gemini-3.8-flash',
        };
      }
    } catch (err) {
      console.warn('Direct AI companion API fallback:', err);
    }

    // Fallback to local rule engine
    const local = MemoryCompanionService.processQuery(
      params.message,
      params.patient,
      params.reminders
    );
    return {
      text: local.text,
      provider: 'local-offline-engine',
    };
  }

  /**
   * Deterministic Natural Language Processor for Memory Companion
   * Connects directly to live reminders, patient profile, and routines.
   */
  public static processQuery(
    rawQuery: string,
    patient: Patient,
    reminders: ReminderItem[],
    _checkIns: WellbeingCheckIn[] = []
  ): CompanionResponse {
    const q = rawQuery.trim().toLowerCase();

    // 1. What do I need to do today / Daily Schedule
    if (q.includes('what do i need to do') || q.includes('schedule') || q.includes('plan today') || q.includes('today')) {
      const pending = reminders.filter(r => !r.completed);
      if (pending.length > 0) {
        const next = pending[0];
        const count = reminders.length;
        const text = `You have ${count} things planned today. Next up is "${next.title}" at ${next.time}. You have already completed ${reminders.filter(r => r.completed).length} items!`;
        return {
          text,
          actionRoute: '/memory',
          actionLabel: "View Today's Timeline"
        };
      } else {
        return {
          text: `You have completed all your planned activities and reminders for today! You can relax and enjoy some soothing tea or listen to your favorite Borgeet songs.`
        };
      }
    }

    // 2. When is my appointment / Doctor
    if (q.includes('appointment') || q.includes('doctor') || q.includes('dr. roy') || q.includes('clinic')) {
      return {
        text: `Your upcoming appointment is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic. Your son Rohan will accompany you.`,
        actionRoute: '/reminders',
        actionLabel: 'View Appointment Details'
      };
    }

    // 3. Did I complete today's activity / Progress
    if (q.includes('did i complete') || q.includes('how did i do') || q.includes('score') || q.includes('streak')) {
      const done = patient.stats.completedToday;
      const total = patient.stats.totalToday;
      const streak = patient.stats.streakDays;
      const accuracy = patient.stats.weeklyScore;
      return {
        text: `Yes! You completed ${done} of ${total} cognitive exercises today. Your cognitive vitality score is ${accuracy}%, and you are on an impressive ${streak}-day habit streak!`,
        actionRoute: '/progress',
        actionLabel: 'See Wellness Report'
      };
    }

    // 4. What is my next reminder / Next activity
    if (q.includes('next reminder') || q.includes('what is next') || q.includes('next')) {
      const pending = reminders.filter(r => !r.completed);
      if (pending.length > 0) {
        const next = pending[0];
        return {
          text: `Your next reminder is "${next.title}" scheduled for ${next.time}. (${next.doseOrNote || 'Take your time'})`,
          actionRoute: '/reminders',
          actionLabel: 'Mark Done'
        };
      }
      return { text: `There are no pending reminders right now. Everything is up to date!` };
    }

    // 5. Who am I calling today / Family call
    if (q.includes('calling') || q.includes('who am i calling') || q.includes('family call') || q.includes('rohan') || q.includes('daughter') || q.includes('priya')) {
      const famRem = reminders.find(r => r.category === 'family');
      return {
        text: `You have a warm family call scheduled for ${famRem ? famRem.time : '6:00 PM'} with your daughter Priya and son Rohan.`,
        actionRoute: '/family',
        actionLabel: 'Open Family Circle'
      };
    }

    // 6. Start today's activity / Play
    if (q.includes('start activity') || q.includes('start game') || q.includes('play') || q.includes('exercise')) {
      return {
        text: `Let's keep your mind active and bright! Starting today's recommended cognitive exercise now.`,
        actionRoute: '/games/memory',
        actionLabel: 'Start Memory Match'
      };
    }

    // 7. Water / Hydration
    if (q.includes('water') || q.includes('drink') || q.includes('hydration')) {
      return {
        text: `Staying hydrated keeps your mind energized! Please drink a glass of fresh room-temperature water or warm herbal tea.`,
        actionRoute: '/memory',
        actionLabel: 'Mark Hydration Complete'
      };
    }

    // 8. Memories / Photos / Stories
    if (q.includes('memories') || q.includes('photo') || q.includes('story') || q.includes('remember')) {
      return {
        text: `Your Memory Vault is filled with cherished family photos, favorite songs, and your 2018 Shillong trip memories. Let's look at them together!`,
        actionRoute: '/memories',
        actionLabel: 'Open Memory Vault'
      };
    }

    // 9. Call caregiver / Emergency / Help
    if (q.includes('help') || q.includes('caregiver') || q.includes('emergency') || q.includes('call')) {
      return {
        text: `I am alerting your primary caregiver Rohan Sharma (+91 98640 12345). Please sit down comfortably; help is on the way.`,
        actionRoute: '/caregiver',
        actionLabel: 'Contact Rohan Now'
      };
    }

    // Default gentle elderly-safe fallback
    return {
      text: `I am here with you, ${patient.name}. You are safe, loved, and doing wonderful today. Would you like to check your schedule or play a gentle memory game?`,
      actionRoute: '/patient',
      actionLabel: "Return to Today's Journey"
    };
  }
}
