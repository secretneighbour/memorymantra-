export interface DailyActivity {
  id: string;
  title: string;
  category: 'memory' | 'words' | 'sequence' | 'recognition' | 'relax';
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  score?: number;
  route: string;
  difficulty: 'Gentle' | 'Adaptive' | 'Stimulating';
}

export const dailyJourneyActivities: DailyActivity[] = [
  {
    id: 'act-memory',
    title: 'Heritage Memory Match',
    category: 'memory',
    description: 'Find pairs of familiar North Eastern cultural motifs and tea gardens.',
    estimatedMinutes: 5,
    completed: true,
    score: 88,
    route: '/games/memory',
    difficulty: 'Gentle',
  },
  {
    id: 'act-words',
    title: 'Brahmaputra Word Connect',
    category: 'words',
    description: 'Pair natural elements and everyday concepts to stimulate verbal pathways.',
    estimatedMinutes: 4,
    completed: true,
    score: 92,
    route: '/games/words',
    difficulty: 'Gentle',
  },
  {
    id: 'act-sequence',
    title: 'Rhythm Sequence Recall',
    category: 'sequence',
    description: 'Listen and observe rhythmic symbol sequences, then reproduce them.',
    estimatedMinutes: 6,
    completed: true,
    score: 80,
    route: '/games/sequence',
    difficulty: 'Adaptive',
  },
  {
    id: 'act-recognition',
    title: 'Northeast Heritage Recognition',
    category: 'recognition',
    description: 'Identify familiar handlooms, landscapes, and state wildlife symbols.',
    estimatedMinutes: 5,
    completed: false,
    route: '/games/recognition',
    difficulty: 'Gentle',
  },
  {
    id: 'act-relax',
    title: 'Deep Breath & Mindfulness',
    category: 'relax',
    description: 'Calm the nervous system with 3 minutes of guided sensory breathing.',
    estimatedMinutes: 3,
    completed: false,
    route: '/patient',
    difficulty: 'Gentle',
  }
];

export const encouragingMessages = [
  "You're doing wonderful today, Ananya.",
  "Every small memory exercise keeps your mind vibrant and clear.",
  "Consistency is your superpower. Great to have you back.",
  "Your smile and curiosity brighten our entire community."
];
