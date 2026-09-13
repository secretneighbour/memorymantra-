export interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  localNameAs: string;
  category: string;
}

export const marketItemsList: MarketItem[] = [
  { id: 'item-1', name: 'Banana', emoji: '🍌', localNameAs: 'কল (Kol)', category: 'Fruit' },
  { id: 'item-2', name: 'Coconut', emoji: '🥥', localNameAs: 'নাৰিকল (Narikol)', category: 'Nourishment' },
  { id: 'item-3', name: 'Red Chili', emoji: '🌶️', localNameAs: 'জলকীয়া (Jolokia)', category: 'Spice' },
  { id: 'item-4', name: 'Rice Bowl', emoji: '🍚', localNameAs: 'ভাত / চাউল (Bhaat)', category: 'Grain' },
  { id: 'item-5', name: 'Assam Tea', emoji: '🫖', localNameAs: 'চাহ (Chah)', category: 'Beverage' },
  { id: 'item-6', name: 'Fresh Ginger', emoji: '🫚', localNameAs: 'আদা (Aada)', category: 'Spice' },
  { id: 'item-7', name: 'Green Betel Leaf', emoji: '🍃', localNameAs: 'পান (Paan)', category: 'Tradition' },
  { id: 'item-8', name: 'Ripe Papaya', emoji: '🍈', localNameAs: 'অমিতা (Omita)', category: 'Fruit' },
];

export interface PatternExercise {
  id: string;
  sequence: { emoji: string; label: string }[];
  missingIndex: number;
  options: { emoji: string; label: string }[];
  correctAnswer: string;
  ruleExplanation: string;
}

export const patternExercises: PatternExercise[] = [
  {
    id: 'pat-1',
    sequence: [
      { emoji: '🍃', label: 'Leaf' },
      { emoji: '🦏', label: 'Rhino' },
      { emoji: '🍃', label: 'Leaf' },
      { emoji: '🦏', label: 'Rhino' },
      { emoji: '🍃', label: 'Leaf' },
      { emoji: '❓', label: 'Missing' }
    ],
    missingIndex: 5,
    options: [
      { emoji: '🦏', label: 'Rhino' },
      { emoji: '🍎', label: 'Apple' },
      { emoji: '💧', label: 'Water' },
      { emoji: '⭐', label: 'Star' }
    ],
    correctAnswer: 'Rhino',
    ruleExplanation: 'The pattern alternates: Leaf, Rhino, Leaf, Rhino, Leaf... so a Rhino comes next!'
  },
  {
    id: 'pat-2',
    sequence: [
      { emoji: '☀️', label: 'Sun' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '💧', label: 'Rain' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '❓', label: 'Missing' }
    ],
    missingIndex: 5,
    options: [
      { emoji: '💧', label: 'Rain' },
      { emoji: '🦏', label: 'Rhino' },
      { emoji: '🧣', label: 'Gamosa' },
      { emoji: '🍚', label: 'Rice' }
    ],
    correctAnswer: 'Rain',
    ruleExplanation: 'The rhythm follows Two Suns, One Rain, Two Suns... so Rain follows next!'
  },
  {
    id: 'pat-3',
    sequence: [
      { emoji: '🫖', label: 'Tea' },
      { emoji: '☕', label: 'Cup' },
      { emoji: '🫖', label: 'Tea' },
      { emoji: '☕', label: 'Cup' },
      { emoji: '❓', label: 'Missing' }
    ],
    missingIndex: 4,
    options: [
      { emoji: '🫖', label: 'Tea' },
      { emoji: '🚗', label: 'Car' },
      { emoji: '🏔️', label: 'Mountain' },
      { emoji: '🪨', label: 'Stone' }
    ],
    correctAnswer: 'Tea',
    ruleExplanation: 'The pattern alternates Tea pot, Cup, Tea pot, Cup... so the Tea pot completes the loop!'
  }
];

export interface EmotionExercise {
  id: string;
  emoji: string;
  scenario: string;
  options: string[];
  correctAnswer: string;
  reassuranceText: string;
}

export const emotionExercises: EmotionExercise[] = [
  {
    id: 'emo-1',
    emoji: '😊',
    scenario: 'A grandmother listening to her grandson tell a fun school story.',
    options: ['Happy & Peaceful', 'Angry', 'Afraid', 'Confused'],
    correctAnswer: 'Happy & Peaceful',
    reassuranceText: 'Warm smiles reflect peaceful love and gentle joy.'
  },
  {
    id: 'emo-2',
    emoji: '😌',
    scenario: 'Sitting quietly on the verandah in the cool morning breeze with warm herbal tea.',
    options: ['Calm & Relaxed', 'Frustrated', 'Rushed', 'Loud'],
    correctAnswer: 'Calm & Relaxed',
    reassuranceText: 'Soft breaths and warm tea bring deep calm to the heart.'
  },
  {
    id: 'emo-3',
    emoji: '🥱',
    scenario: 'After a full afternoon walk around the garden with Meera.',
    options: ['Pleasantly Tired', 'Startled', 'Worried', 'Busy'],
    correctAnswer: 'Pleasantly Tired',
    reassuranceText: 'Feeling sleepy after movement is healthy and natural.'
  }
];
