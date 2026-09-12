import { ReminderItem, MemoryNote } from '../types';

export const initialReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    time: '08:00 AM',
    title: 'Morning Blood Pressure Medicine',
    category: 'medication',
    doseOrNote: '1 tablet with warm water after light breakfast',
    completed: true,
    priority: 'high',
  },
  {
    id: 'rem-2',
    time: '10:30 AM',
    title: 'Cognitive Memory Exercise',
    category: 'exercise',
    doseOrNote: 'Complete Heritage Memory Match on SmritiCare',
    completed: true,
    priority: 'normal',
  },
  {
    id: 'rem-3',
    time: '01:00 PM',
    title: 'Lunch & Fresh Seasonal Fruits',
    category: 'meal',
    doseOrNote: 'Light dal, steamed rice, and tender papaya greens',
    completed: true,
    priority: 'normal',
  },
  {
    id: 'rem-4',
    time: '05:00 PM',
    title: 'Call Rohan & Grandkids',
    category: 'family',
    doseOrNote: 'Video call on family tablet',
    completed: false,
    priority: 'normal',
  },
  {
    id: 'rem-5',
    time: '08:00 PM',
    title: 'Evening Verandah Walk & Herbal Tea',
    category: 'walk',
    doseOrNote: '15 minutes gentle strolling with walking stick',
    completed: false,
    priority: 'normal',
  },
];

export const initialPinnedMemories = [
  { id: 'pin-1', text: "Daughter's Birthday — 18 September", tag: 'Family Celebration', icon: 'cake' },
  { id: 'pin-2', text: "Doctor Appointment with Dr. Roy — Monday, 11:00 AM", tag: 'Health Check', icon: 'calendar' },
  { id: 'pin-3', text: "Morning Medication — 8:00 AM Daily", tag: 'Routine', icon: 'pill' },
  { id: 'pin-4', text: "Spare House Keys kept in Left Wooden Drawer", tag: 'Household', icon: 'key' },
];

export const initialMemoryNotes: MemoryNote[] = [
  {
    id: 'note-1',
    title: 'Favorite Raga & Classical Songs',
    date: 'Yesterday, 4:20 PM',
    content: 'Bhupali and Borgeet songs sung by Bhupen Hazarika bring peace during early evenings.',
    pinned: true,
  },
  {
    id: 'note-2',
    title: 'Assam Tea Leaf Recipe',
    date: '3 days ago',
    content: 'Add 2 crushed cardamoms, half-spoon ginger, simmer 3 minutes for garden chai.',
    pinned: false,
  },
  {
    id: 'note-3',
    title: 'Neighbor Mrs. Barua Phone Number',
    date: 'Last week',
    content: '+91 94350 44221 (Call if gate is locked in evening).',
    pinned: false,
  }
];
