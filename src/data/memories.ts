import { FamilyMember, MemoryItem } from '../types';

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Priya Sharma',
    relation: 'Daughter',
    location: 'Guwahati, Assam',
    phone: '+91 98640 55432',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    birthDate: '18 September',
    notes: 'Architect, visits every weekend with fresh flowers.'
  },
  {
    id: 'fam-2',
    name: 'Rohan Sharma',
    relation: 'Son & Primary Caregiver',
    location: 'Guwahati, Assam',
    phone: '+91 98640 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    birthDate: '12 March',
    notes: 'Lives in adjacent apartment, prepares morning herbal tea.'
  },
  {
    id: 'fam-3',
    name: 'Meera Das',
    relation: 'Caregiver & Companion',
    location: 'Guwahati, Assam',
    phone: '+91 94351 77665',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    birthDate: '04 July',
    notes: 'Assists with daily walking exercise and medication schedules.'
  },
  {
    id: 'fam-4',
    name: 'Aarav Sharma',
    relation: 'Grandson (Age 9)',
    location: 'Guwahati, Assam',
    phone: '+91 98640 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&auto=format&fit=crop&q=80',
    birthDate: '25 December',
    notes: 'Loves drawing rhinos and listening to gentle memory stories.'
  }
];

export const mockMemories: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Shillong Cherry Blossom Trip — 2018',
    category: 'place',
    personOrPlace: 'Ward’s Lake & Pine Hills, Shillong',
    dateOrYear: 'Autumn 2018',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    storyText: 'This was our memorable family journey to Meghalaya. We walked around Ward’s Lake under pink cherry blossom canopies, drank steaming ginger tea, and took a boat ride on Umiam Lake with little Aarav.',
    pinned: true,
    triviaQuestions: [
      {
        question: 'Which beautiful hill town did the family visit during the cherry blossom season?',
        options: ['Shillong', 'Delhi', 'Jaipur', 'Mumbai'],
        correctAnswer: 'Shillong'
      },
      {
        question: 'Who took the boat ride with you on Umiam Lake?',
        options: ['Grandson Aarav', 'A stranger', 'College friends', 'Office team'],
        correctAnswer: 'Grandson Aarav'
      }
    ]
  },
  {
    id: 'mem-2',
    title: 'Daughter Priya’s University Graduation',
    category: 'family',
    personOrPlace: 'Guwahati University Campus',
    dateOrYear: 'July 2014',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    storyText: 'Priya received her Masters in Architecture with distinction. You tied a ceremonial red-border Gamosa around her neck and cooked her favorite sweet kheer at home.',
    pinned: true,
    triviaQuestions: [
      {
        question: 'What sweet dish did you prepare at home to celebrate Priya’s graduation?',
        options: ['Sweet Kheer', 'Ice Cream', 'Spicy noodles', 'Pizza'],
        correctAnswer: 'Sweet Kheer'
      },
      {
        question: 'What traditional woven cloth did you gift Priya?',
        options: ['Red-Border Gamosa', 'Woolen blanket', 'Silk scarf', 'Raincoat'],
        correctAnswer: 'Red-Border Gamosa'
      }
    ]
  },
  {
    id: 'mem-3',
    title: 'Bhogali Bihu Hearth & Pitha Making',
    category: 'story',
    personOrPlace: 'Ancestral Courtyard, Nagaon',
    dateOrYear: 'January 2020',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    storyText: 'Gathered around the winter fire pit with neighbors. The house smelled of roasted sesame pithas, coconut laru, and freshly harvested sticky rice.',
    pinned: false,
    triviaQuestions: [
      {
        question: 'Which traditional festival was celebrated around the winter hearth?',
        options: ['Bhogali Bihu', 'Diwali', 'Holi', 'New Year Eve'],
        correctAnswer: 'Bhogali Bihu'
      }
    ]
  },
  {
    id: 'mem-4',
    title: 'Borgeet Song: "Sunre Sunre Re Sure"',
    category: 'song',
    personOrPlace: 'Dr. Bhupen Hazarika Cultural Hall',
    songTitle: 'Classical Borgeet in Raga Bhupali',
    dateOrYear: 'Evergreen Melody',
    storyText: 'A devotional prayer of peace and devotion that you used to sing while tending to your garden roses every morning.',
    pinned: true
  }
];
