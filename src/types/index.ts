export type UserRole = 'patient' | 'caregiver' | 'doctor';

export type TextSize = 'normal' | 'large' | 'extra-large';
export type MotionPreference = 'full' | 'reduced';
export type ContrastMode = 'standard' | 'high';

export type NERLanguage = 
  | 'en'       // English
  | 'as'       // Assamese (অসমীয়া)
  | 'bn'       // Bengali (বাংলা)
  | 'mni'      // Meitei (মৈতায়লোন্)
  | 'kha'      // Khasi
  | 'lus'      // Mizo
  | 'nag'      // Nagamese
  | 'hi';      // Hindi (हिन्दी)

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  state: string; // e.g. Assam, Meghalaya, Manipur, Mizoram, Nagaland
  stage: 'Mild Cognitive Impairment' | 'Early Dementia' | 'Moderate Support';
  preferredLanguage: NERLanguage;
  avatarUrl: string;
  primaryCaregiver: {
    name: string;
    relation: string;
    phone: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  stats: {
    streakDays: number;
    weeklyScore: number;
    completionRate: number; // percentage
    completedToday: number;
    totalToday: number;
    lastActive: string;
  };
  cognitiveDomains: {
    memory: number;       // 0-100
    attention: number;
    recognition: number;
    sequence: number;
    engagement: number;
  };
  recentActivities: ActivityResult[];
}

export type ReminderCategory = 'medication' | 'exercise' | 'meal' | 'family' | 'walk' | 'hydration' | 'other';
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'help_requested';

export interface ReminderItem {
  id: string;
  time: string;
  title: string;
  category: ReminderCategory;
  doseOrNote?: string;
  completed: boolean;
  status?: ReminderStatus;
  priority: 'high' | 'normal';
}

export interface GameScore {
  gameId: string;
  score: number;
  accuracy: number;
  timeSeconds: number;
  date: string;
}

export interface MemoryNote {
  id: string;
  title: string;
  date: string;
  content: string;
  pinned: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  location: string;
  phone: string;
  avatarUrl: string;
  birthDate?: string;
  notes?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  category: 'family' | 'place' | 'story' | 'song' | 'date';
  personOrPlace: string;
  dateOrYear?: string;
  imageUrl?: string;
  storyText: string;
  songTitle?: string;
  pinned: boolean;
  triviaQuestions?: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface RoutineStep {
  id: string;
  order: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  timeStr: string;
  title: string;
  icon: string;
  category: ReminderCategory;
  note?: string;
}

export interface ActivityResult {
  id: string;
  title: string;
  gameType: 'memory' | 'sequence' | 'words' | 'recognition' | 'pattern' | 'routine' | 'name_face' | 'emotion' | 'market';
  completedAt: string;
  score: number;
  accuracy: number;
  durationMinutes: number;
  responseTimeSeconds: number;
  attempts: number;
  mistakes: number;
  difficultyDelta?: string;
}

export interface CognitiveAdaptationScore {
  overallScore: number;
  accuracyRate: number;
  avgResponseTimeSec: number;
  consistencyRating: 'High' | 'Moderate' | 'Fluctuating';
  memoryDifficultyModifier: number; // e.g. +10, 0, -10
  attentionDifficultyModifier: number;
  recommendedNextActivityId: string;
  recommendedReason: string;
}

export interface CaregiverAlert {
  id: string;
  type: 'missed_activity' | 'missed_medication' | 'activity_pattern' | 'help_request' | 'mood_concern';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  createdAt: string;
  reviewed: boolean;
  actionLabel?: string;
}

export interface WellbeingCheckIn {
  id: string;
  mood: 'good' | 'okay' | 'worried' | 'sad' | 'tired';
  note?: string;
  timestamp: string;
}

