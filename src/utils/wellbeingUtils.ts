import { CaregiverAlert, WellbeingCheckIn } from '../types';

export type WellbeingMood = 'good' | 'okay' | 'worried' | 'sad' | 'tired';

export interface WellbeingResponse {
  id: string;
  mood: WellbeingMood;
  sentiment: 'positive' | 'neutral' | 'negative';
  label: string;
  note?: string;
  timestamp: string;
  createdAt: number;
}

export const WELLBEING_STORAGE_KEY = 'neuro_wellbeing_responses';
export const WELLBEING_ROLE_CONTEXT_KEY = 'neuro_wellbeing';
export const ALERTS_STORAGE_KEY = 'neuro_alerts';
export const LAST_LOGIN_PROMPT_KEY = 'neuro_wellbeing_last_prompt_date';

export const MOOD_DEFINITIONS: Record<
  WellbeingMood,
  { label: string; emoji: string; sentiment: 'positive' | 'neutral' | 'negative'; description: string }
> = {
  good: {
    label: 'Good & Bright',
    emoji: '🙂',
    sentiment: 'positive',
    description: 'Feeling energetic, peaceful, or content'
  },
  okay: {
    label: 'Okay / Steady',
    emoji: '😐',
    sentiment: 'neutral',
    description: 'Feeling calm, routine, or neutral'
  },
  worried: {
    label: 'Worried / Uneasy',
    emoji: '😟',
    sentiment: 'negative',
    description: 'Feeling nervous, anxious, or apprehensive'
  },
  sad: {
    label: 'A Bit Sad / Down',
    emoji: '😔',
    sentiment: 'negative',
    description: 'Feeling quiet, lonely, or low spirits'
  },
  tired: {
    label: 'Tired / Low Energy',
    emoji: '😴',
    sentiment: 'negative',
    description: 'Feeling fatigued, drowsy, or worn out'
  }
};

/**
 * Checks if a given mood is considered negative/concerning
 */
export const isNegativeMood = (mood: WellbeingMood): boolean => {
  return MOOD_DEFINITIONS[mood]?.sentiment === 'negative';
};

/**
 * Retrieves all stored wellbeing responses from localStorage
 */
export const getStoredWellbeingResponses = (): WellbeingResponse[] => {
  try {
    const raw = localStorage.getItem(WELLBEING_STORAGE_KEY);
    if (!raw) {
      // Fallback check on standard neuro_wellbeing key
      const fallbackRaw = localStorage.getItem(WELLBEING_ROLE_CONTEXT_KEY);
      if (fallbackRaw) {
        const parsed = JSON.parse(fallbackRaw);
        return Array.isArray(parsed)
          ? parsed.map((item: any) => ({
              id: item.id || `wb-${Date.now()}`,
              mood: (item.mood || 'okay') as WellbeingMood,
              sentiment: isNegativeMood(item.mood) ? 'negative' : item.mood === 'good' ? 'positive' : 'neutral',
              label: MOOD_DEFINITIONS[item.mood as WellbeingMood]?.label || 'Okay',
              note: item.note,
              timestamp: item.timestamp || 'Today',
              createdAt: Date.now()
            }))
          : [];
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading wellbeing responses from localStorage:', error);
    return [];
  }
};

export interface ConsecutiveNegativeEvaluation {
  isFlagged: boolean;
  streakCount: number;
  recentNegativeMoods: WellbeingMood[];
  shouldAlertCaregiver: boolean;
  alert: CaregiverAlert | null;
}

/**
 * Utility to flag consecutive negative responses for future caregiver alerts.
 * Evaluates whether the patient has recorded N or more consecutive negative moods.
 */
export const evaluateConsecutiveNegativeResponses = (
  responses: WellbeingResponse[],
  threshold: number = 2,
  patientName: string = 'Ananya'
): ConsecutiveNegativeEvaluation => {
  if (!responses || responses.length === 0) {
    return {
      isFlagged: false,
      streakCount: 0,
      recentNegativeMoods: [],
      shouldAlertCaregiver: false,
      alert: null
    };
  }

  // Sorted by newest first (descending by createdAt or list order)
  const sorted = [...responses].sort((a, b) => b.createdAt - a.createdAt);

  let streak = 0;
  const negativeMoods: WellbeingMood[] = [];

  for (const resp of sorted) {
    if (isNegativeMood(resp.mood)) {
      streak += 1;
      negativeMoods.push(resp.mood);
    } else {
      // Streak broken by neutral or positive mood
      break;
    }
  }

  const isFlagged = streak >= threshold;

  let alert: CaregiverAlert | null = null;
  if (isFlagged) {
    const moodLabels = negativeMoods
      .slice(0, 3)
      .map(m => MOOD_DEFINITIONS[m]?.label || m)
      .join(', ');

    const severity = streak >= 3 ? 'urgent' : 'warning';

    alert = {
      id: `alt-mood-${Date.now()}`,
      type: 'mood_concern',
      title: `⚠️ Consecutive Low Mood Flag (${streak}x)`,
      message: `${patientName} has reported ${streak} consecutive low or anxious moods (${moodLabels}). Caregiver outreach or a warm phone call is recommended.`,
      severity,
      createdAt: 'Just now',
      reviewed: false,
      actionLabel: 'Check on Patient'
    };
  }

  return {
    isFlagged,
    streakCount: streak,
    recentNegativeMoods: negativeMoods,
    shouldAlertCaregiver: isFlagged,
    alert
  };
};

/**
 * Saves a new wellbeing check-in response to localStorage,
 * checks for consecutive negative moods, and automatically creates
 * a caregiver alert if the threshold is met.
 */
export const saveWellbeingResponse = (
  mood: WellbeingMood,
  note?: string,
  patientName: string = 'Ananya',
  threshold: number = 2
): {
  response: WellbeingResponse;
  consecutiveEval: ConsecutiveNegativeEvaluation;
} => {
  const existing = getStoredWellbeingResponses();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const newResponse: WellbeingResponse = {
    id: `wb-${Date.now()}`,
    mood,
    sentiment: MOOD_DEFINITIONS[mood]?.sentiment || 'neutral',
    label: MOOD_DEFINITIONS[mood]?.label || 'Okay',
    note: note?.trim() || undefined,
    timestamp: `Today, ${timeStr}`,
    createdAt: Date.now()
  };

  const updatedResponses = [newResponse, ...existing];

  // Save to localStorage
  try {
    localStorage.setItem(WELLBEING_STORAGE_KEY, JSON.stringify(updatedResponses));
    
    // Also sync to legacy neuro_wellbeing for RoleContext compatibility
    const contextCompatible: WellbeingCheckIn[] = updatedResponses.map(r => ({
      id: r.id,
      mood: r.mood,
      note: r.note,
      timestamp: r.timestamp
    }));
    localStorage.setItem(WELLBEING_ROLE_CONTEXT_KEY, JSON.stringify(contextCompatible));

    // Mark prompt completed for today
    markLoginPromptCompletedToday();
  } catch (error) {
    console.error('Error saving wellbeing response to localStorage:', error);
  }

  // Evaluate consecutive negative responses
  const consecutiveEval = evaluateConsecutiveNegativeResponses(updatedResponses, threshold, patientName);

  // If flagged, store or update caregiver alerts in localStorage
  if (consecutiveEval.shouldAlertCaregiver && consecutiveEval.alert) {
    try {
      const existingAlertsRaw = localStorage.getItem(ALERTS_STORAGE_KEY);
      const existingAlerts: CaregiverAlert[] = existingAlertsRaw ? JSON.parse(existingAlertsRaw) : [];
      
      // Avoid duplicate alert if one was created within the last 15 minutes
      const hasRecentMoodAlert = existingAlerts.some(
        a => a.type === 'mood_concern' && !a.reviewed && a.title.includes('Consecutive Low Mood')
      );

      if (!hasRecentMoodAlert) {
        const updatedAlerts = [consecutiveEval.alert, ...existingAlerts];
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
      }
    } catch (e) {
      console.error('Failed to save caregiver alert to localStorage', e);
    }
  }

  return {
    response: newResponse,
    consecutiveEval
  };
};

/**
 * Checks if the patient should be prompted for a check-in upon login
 */
export const shouldPromptOnLogin = (): boolean => {
  try {
    const todayStr = new Date().toDateString();
    const lastPrompt = localStorage.getItem(LAST_LOGIN_PROMPT_KEY);
    return lastPrompt !== todayStr;
  } catch {
    return true;
  }
};

/**
 * Marks that the login prompt has been presented or completed today
 */
export const markLoginPromptCompletedToday = (): void => {
  try {
    const todayStr = new Date().toDateString();
    localStorage.setItem(LAST_LOGIN_PROMPT_KEY, todayStr);
  } catch (e) {
    console.error('Error setting last login prompt date:', e);
  }
};

/**
 * Resets the login prompt flag (useful for testing or manual re-prompt)
 */
export const resetLoginPromptFlag = (): void => {
  try {
    localStorage.removeItem(LAST_LOGIN_PROMPT_KEY);
  } catch (e) {
    console.error('Error resetting login prompt flag:', e);
  }
};
