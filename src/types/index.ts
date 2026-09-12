export type UserRole = 'patient' | 'caregiver' | 'doctor';

export type TextSize = 'normal' | 'large' | 'extra-large';
export type MotionPreference = 'full' | 'reduced';
export type ContrastMode = 'standard' | 'high';

export type NERLanguage = 
  | 'en'       // English
  | 'as'       // Assamese (অসমীয়া)
  | 'bn'       // Bengali (বাংলা)
  | 'mni'      // Meitei (মৈতৈলোন্ / ꯃꯩꯇꯩꯂꯣꯟ)
  | 'kha'      // Khasi
  | 'lus'      // Mizo
  | 'nag';     // Nagamese

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
  recentActivities: {
    id: string;
    title: string;
    gameType: 'memory' | 'sequence' | 'words' | 'recognition';
    completedAt: string;
    score: number;
    durationMinutes: number;
  }[];
}

export interface ReminderItem {
  id: string;
  time: string;
  title: string;
  category: 'medication' | 'exercise' | 'meal' | 'family' | 'walk' | 'other';
  doseOrNote?: string;
  completed: boolean;
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
