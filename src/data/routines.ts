import { RoutineStep } from '../types';

export const defaultRoutineSteps: RoutineStep[] = [
  {
    id: 'rout-1',
    order: 1,
    timeOfDay: 'morning',
    timeStr: '07:00 AM',
    title: 'Gentle Wake Up & Stretch',
    icon: '🌅',
    category: 'other',
    note: 'Open the window to let morning breeze and sunlight in.'
  },
  {
    id: 'rout-2',
    order: 2,
    timeOfDay: 'morning',
    timeStr: '08:00 AM',
    title: 'Light Breakfast & Tea',
    icon: '☕',
    category: 'meal',
    note: 'Steamed rice cakes (idli) or warm oats with Assam tea.'
  },
  {
    id: 'rout-3',
    order: 3,
    timeOfDay: 'morning',
    timeStr: '08:30 AM',
    title: 'Morning Blood Pressure Medicine',
    icon: '💊',
    category: 'medication',
    note: '1 tablet with warm water after breakfast.'
  },
  {
    id: 'rout-4',
    order: 4,
    timeOfDay: 'morning',
    timeStr: '09:30 AM',
    title: 'Cognitive Memory Exercise',
    icon: '🧠',
    category: 'exercise',
    note: '5 minutes of daily memory and pattern exercises on SmritiCare.'
  },
  {
    id: 'rout-5',
    order: 5,
    timeOfDay: 'afternoon',
    timeStr: '01:00 PM',
    title: 'Lunch & Fresh Seasonal Greens',
    icon: '🍲',
    category: 'meal',
    note: 'Warm dal, rice, and papaya stew.'
  },
  {
    id: 'rout-6',
    order: 6,
    timeOfDay: 'afternoon',
    timeStr: '04:00 PM',
    title: 'Hydration & Fruit Snack',
    icon: '💧',
    category: 'hydration',
    note: 'One full glass of water and seasonal tender coconut.'
  },
  {
    id: 'rout-7',
    order: 7,
    timeOfDay: 'evening',
    timeStr: '05:30 PM',
    title: 'Evening Verandah Walk',
    icon: '🚶‍♀️',
    category: 'walk',
    note: '15 minutes gentle strolling with walking stick alongside Meera.'
  },
  {
    id: 'rout-8',
    order: 8,
    timeOfDay: 'evening',
    timeStr: '06:30 PM',
    title: 'Family Call with Priya & Rohan',
    icon: '👨‍👩‍👧',
    category: 'family',
    note: 'Evening video call on family tablet.'
  },
  {
    id: 'rout-9',
    order: 9,
    timeOfDay: 'bedtime',
    timeStr: '09:00 PM',
    title: 'Evening Medicine & Calming Music',
    icon: '🌙',
    category: 'medication',
    note: 'Evening calcium tablet, soft classical Borgeet music, and restful sleep.'
  }
];

export interface RoutineRecallQuestion {
  id: string;
  stimulus: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const routineRecallQuestions: RoutineRecallQuestion[] = [
  {
    id: 'q-rout-1',
    stimulus: 'After Breakfast',
    question: 'What usually comes right after your morning breakfast at 8:00 AM?',
    options: ['Morning Medicine', 'Bedtime Sleep', 'Heavy Dinner', 'Market Grocery'],
    correctAnswer: 'Morning Medicine',
    explanation: 'Your blood pressure medicine is taken with warm water right after breakfast.'
  },
  {
    id: 'q-rout-2',
    stimulus: 'Before Bedtime',
    question: 'What calming activity usually accompanies your evening wind-down at 9:00 PM?',
    options: ['Evening Medicine & Calming Music', 'Heavy Exercise', 'Morning Jog', 'Cooking Lunch'],
    correctAnswer: 'Evening Medicine & Calming Music',
    explanation: 'Soothing Borgeet songs and evening medication prepare you for restful slumber.'
  },
  {
    id: 'q-rout-3',
    stimulus: '5:30 PM Sunset',
    question: 'What do you and Meera enjoy doing around 5:30 PM in the golden evening?',
    options: ['Evening Verandah Walk', 'Deep Sleep', 'Morning Breakfast', 'Office Meeting'],
    correctAnswer: 'Evening Verandah Walk',
    explanation: 'A peaceful stroll along the garden verandah keeps your limbs limber and refreshed.'
  }
];
