export interface MemoryCardData {
  id: string;
  pairId: number;
  label: string;
  subtext: string;
  icon: string;
  culturalNote: string;
}

export const memoryCardPairs: Omit<MemoryCardData, 'id'>[] = [
  { pairId: 1, label: 'One-Horned Rhino', subtext: 'Kaziranga National Park', icon: '🦏', culturalNote: 'Beloved pride of the Assam grasslands' },
  { pairId: 2, label: 'Assam Tea Leaves', subtext: 'Upper Assam Estate', icon: '🍃', culturalNote: 'World famous fragrant golden-tipped harvest' },
  { pairId: 3, label: 'Great Hornbill', subtext: 'Sacred Forest Bird', icon: '🦅', culturalNote: 'Revered in Nagaland and Arunachal folklore' },
  { pairId: 4, label: 'Traditional Dhol', subtext: 'Folk Instrument', icon: '🥁', culturalNote: 'Heartbeat of seasonal Bihu festivals' },
  { pairId: 5, label: 'Golden Bamboo', subtext: 'Living Architecture', icon: '🎋', culturalNote: 'Used for bridges, homes, and utensils in NER' },
  { pairId: 6, label: 'Red-Border Gamosa', subtext: 'Woven Heritage', icon: '🧣', culturalNote: 'Handwoven symbol of respect and welcome' },
];

export interface SequenceItem {
  id: number;
  label: string;
  symbol: string;
  colorClass: string;
}

export const sequenceSymbols: SequenceItem[] = [
  { id: 1, label: 'Sun', symbol: '☀️', colorClass: 'bg-amber-100 border-amber-400 text-amber-700' },
  { id: 2, label: 'Leaf', symbol: '🍃', colorClass: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
  { id: 3, label: 'Water', symbol: '💧', colorClass: 'bg-blue-100 border-blue-400 text-blue-700' },
  { id: 4, label: 'Star', symbol: '⭐', colorClass: 'bg-orange-100 border-orange-400 text-orange-700' },
];

export interface WordQuestion {
  id: number;
  stimulus: string;
  prompt: string;
  categoryHint: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const wordAssociationQuestions: WordQuestion[] = [
  {
    id: 1,
    stimulus: 'APPLE',
    prompt: 'Which word connects naturally with APPLE?',
    categoryHint: 'Everyday nourishment',
    options: ['Fruit', 'Chair', 'River', 'Window'],
    correctAnswer: 'Fruit',
    explanation: 'An apple is a sweet, crisp fruit that grows on trees.'
  },
  {
    id: 2,
    stimulus: 'BRAHMAPUTRA',
    prompt: 'Which word describes the mighty BRAHMAPUTRA?',
    categoryHint: 'Northeast Geography',
    options: ['Mountain', 'River', 'Desert', 'Castle'],
    correctAnswer: 'River',
    explanation: 'The Brahmaputra is the majestic lifeline river flowing through Assam.'
  },
  {
    id: 3,
    stimulus: 'BAMBOO',
    prompt: 'What category does BAMBOO belong to?',
    categoryHint: 'Flora & Greenery',
    options: ['Plant', 'Metal', 'Glass', 'Stone'],
    correctAnswer: 'Plant',
    explanation: 'Bamboo is a giant fast-growing woody grass plant widely cherished in the North East.'
  },
  {
    id: 4,
    stimulus: 'ASSAM TEA',
    prompt: 'What kind of item is ASSAM TEA?',
    categoryHint: 'Morning Warmth',
    options: ['Beverage', 'Blanket', 'Shoe', 'Bicycle'],
    correctAnswer: 'Beverage',
    explanation: 'Assam Tea is a warm, aromatic drink brewed and enjoyed worldwide.'
  },
  {
    id: 5,
    stimulus: 'DHOL',
    prompt: 'What is a traditional DHOL used as?',
    categoryHint: 'Folk Music',
    options: ['Musical Instrument', 'Cookware', 'Coat', 'Clock'],
    correctAnswer: 'Musical Instrument',
    explanation: 'A dhol is a resonant double-sided drum played during Bihu dance and ceremonies.'
  }
];

export interface RecognitionQuestion {
  id: number;
  title: string;
  imageEmoji: string;
  sceneHint: string;
  question: string;
  options: string[];
  correctAnswer: string;
  elderExplanation: string;
}

export const pictureRecognitionQuestions: RecognitionQuestion[] = [
  {
    id: 1,
    title: 'Pride of Kaziranga',
    imageEmoji: '🦏',
    sceneHint: 'Living in the misty tall elephant grass of Assam',
    question: 'Which iconic animal of North East India is shown here?',
    options: ['One-Horned Rhinoceros', 'Royal Bengal Tiger', 'Snow Leopard', 'Indian Elephant'],
    correctAnswer: 'One-Horned Rhinoceros',
    elderExplanation: 'The great Indian One-Horned Rhinoceros is protected in Kaziranga National Park.'
  },
  {
    id: 2,
    title: 'Traditional Welcome Textile',
    imageEmoji: '🧣',
    sceneHint: 'Handwoven in pure white cotton with bright red floral motifs',
    question: 'What is this revered Assamese woven greeting cloth called?',
    options: ['Gamosa', 'Pashmina', 'Sari', 'Shawl'],
    correctAnswer: 'Gamosa',
    elderExplanation: 'The Gamosa is presented to elders, guests, and loved ones as a symbol of deep respect.'
  },
  {
    id: 3,
    title: 'Voice of the North East Forest',
    imageEmoji: '🦅',
    sceneHint: 'A large canopy bird with a curved yellow-black beak',
    question: 'Which majestic bird inspires the Hornbill festival in Nagaland?',
    options: ['Great Hornbill', 'Peacock', 'Spotted Eagle', 'Blue Jay'],
    correctAnswer: 'Great Hornbill',
    elderExplanation: 'The Great Hornbill is celebrated for its devotion, majesty, and cultural folklore.'
  },
  {
    id: 4,
    title: 'The Floating Lake Wonder',
    imageEmoji: '🏞️',
    sceneHint: 'Circular green floating islands on freshwater Loktak Lake',
    question: 'What are the unique floating islands of Manipur called?',
    options: ['Phumdis', 'Coral Reefs', 'Sand Dunes', 'Lagoons'],
    correctAnswer: 'Phumdis',
    elderExplanation: 'Phumdis are floating masses of vegetation and soil unique to Loktak Lake, Manipur.'
  }
];
