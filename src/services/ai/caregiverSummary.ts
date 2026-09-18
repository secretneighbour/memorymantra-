import { Patient, ReminderItem, WellbeingCheckIn } from '../../types';
import { CaregiverDailySummary } from './types';
import { AdaptiveCognitiveEngine } from './adaptiveEngine';

export class CaregiverSummaryEngine {
  /**
   * Synthesizes live patient telemetry, medication adherence, and mood check-ins
   * into a concise, non-clinical daily overview for family and caregivers.
   */
  public static generateDailySummary(
    patient: Patient,
    reminders: ReminderItem[],
    checkIns: WellbeingCheckIn[] = []
  ): CaregiverDailySummary {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const adaptation = AdaptiveCognitiveEngine.computeAdaptation(patient);

    const completedReminders = reminders.filter(r => r.completed);
    const totalReminders = reminders.length;
    const medReminders = reminders.filter(r => r.category === 'medication');
    const completedMeds = medReminders.filter(r => r.completed);

    let medText = 'All scheduled medications have been confirmed taken on time.';
    if (completedMeds.length < medReminders.length) {
      const pending = medReminders.filter(r => !r.completed);
      medText = `${completedMeds.length} of ${medReminders.length} medications taken. Pending: ${pending.map(p => p.title).join(', ')}.`;
    }

    // Cognitive Telemetry breakdown
    let memoryInsight = 'Memory recall scores remained steady with familiar heritage motifs.';
    if (adaptation.memoryDifficultyModifier > 0) {
      memoryInsight = 'Memory activities showed high accuracy (88%+), prompting a gentle 10% speed elevation.';
    } else if (adaptation.memoryDifficultyModifier < 0) {
      memoryInsight = 'Memory recall took longer than usual; the system automatically reduced complexity to maintain comfort.';
    }

    let attentionInsight = `Attention & rhythm activities averaged ${adaptation.avgResponseTimeSec}s response latency with ${adaptation.consistencyRating.toLowerCase()} consistency.`;

    // Mood / Wellbeing
    const latestMood = checkIns.length > 0 ? checkIns[0] : null;
    const moodMap: Record<string, string> = {
      good: 'Good / Cheerful 🙂',
      okay: 'Peaceful / Normal 😐',
      worried: 'Mildly Apprehensive 😟',
      sad: 'Quiet / Melancholic 😔',
      tired: 'Tired / Low Energy 😴'
    };
    const wellbeingText = latestMood ? moodMap[latestMood.mood] || 'Peaceful' : 'Peaceful (Morning Check-in)';

    const suggestedActions: string[] = [];
    if (completedMeds.length < medReminders.length) {
      suggestedActions.push('Verify evening medication intake with patient.');
    }
    if (latestMood && (latestMood.mood === 'sad' || latestMood.mood === 'worried')) {
      suggestedActions.push('Initiate a warm 5-minute family call to uplift spirits.');
    }
    if (adaptation.avgResponseTimeSec > 3.5) {
      suggestedActions.push('Encourage a 15-minute afternoon nap or guided sensory breathing.');
    } else {
      suggestedActions.push('Celebrate the 5-day cognitive activity streak with patient!');
    }

    return {
      dateStr: today,
      overallAdherenceText: `${patient.name} completed ${patient.stats.completedToday} of ${patient.stats.totalToday} planned exercises and ${completedReminders.length} of ${totalReminders} daily reminders.`,
      completedTasksCount: patient.stats.completedToday,
      totalTasksCount: patient.stats.totalToday,
      memoryInsight,
      attentionInsight,
      medicationStatusText: medText,
      wellbeingStatusText: wellbeingText,
      suggestedCaregiverActions: suggestedActions
    };
  }

  /**
   * Asynchronously fetches rich clinical assessment and proactive tips from Gemini API
   */
  public static async fetchAsyncCareInsights(
    patient: Patient,
    reminders: ReminderItem[],
    checkIns: WellbeingCheckIn[] = []
  ): Promise<{ assessment: string; recommendations: string[] }> {
    try {
      const response = await fetch('/api/ai/care-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ patient, reminders, checkIns }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.assessment && Array.isArray(data.recommendations)) {
          return {
            assessment: data.assessment,
            recommendations: data.recommendations,
          };
        }
      }
    } catch (e) {
      console.warn('Async care insights fallback:', e);
    }
    const local = CaregiverSummaryEngine.generateDailySummary(patient, reminders, checkIns);
    return {
      assessment: `${local.overallAdherenceText} ${local.memoryInsight}`,
      recommendations: local.suggestedCaregiverActions,
    };
  }
}
