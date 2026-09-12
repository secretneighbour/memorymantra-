import { NERLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  patientName: string;
  todayJourney: string;
  activitiesCompleted: string;
  streak: string;
  memoryScore: string;
  playToday: string;
  memoryCompanion: string;
  progressReport: string;
  caregiverCircle: string;
  doctorView: string;
  settings: string;
  demoModeBadge: string;
  encouragement: string;
  startActivity: string;
  remindersTitle: string;
  thingsToRemember: string;
  fontSize: string;
  contrast: string;
  motion: string;
  readAloud: string;
}

export const translations: Record<NERLanguage, TranslationDictionary> = {
  en: {
    appName: 'SmritiCare',
    tagline: 'Cognitive Care, Made Human.',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    patientName: 'Ananya',
    todayJourney: "Today's Cognitive Journey",
    activitiesCompleted: 'activities completed',
    streak: 'Day Streak',
    memoryScore: 'Memory Score',
    playToday: "PLAY TODAY'S ACTIVITY",
    memoryCompanion: 'Memory Companion',
    progressReport: 'Cognitive Progress',
    caregiverCircle: 'Care Circle',
    doctorView: 'Clinician Overview',
    settings: 'Accessibility Settings',
    demoModeBadge: 'SIH PROTOTYPE DEMO',
    encouragement: "You're doing great today. Take your time and enjoy every moment.",
    startActivity: 'Start Exercise',
    remindersTitle: "Today's Reminders",
    thingsToRemember: 'Things to Remember',
    fontSize: 'Text Size',
    contrast: 'Contrast Mode',
    motion: 'Motion Sensitivity',
    readAloud: 'Read Aloud'
  },
  as: {
    appName: 'স্মৃতিকিয়াৰ (SmritiCare)',
    tagline: 'মস্তিষ্কৰ যত্ন, মানৱীয় সান্নিধ্যত।',
    greetingMorning: 'সুপ্ৰভাত',
    greetingAfternoon: 'শুভ অপৰাহ্ণ',
    greetingEvening: 'শুভ সন্ধিয়া',
    patientName: 'অনন্যা',
    todayJourney: 'আজিৰ মস্তিষ্কৰ যাত্ৰা',
    activitiesCompleted: 'টি কাৰ্য্য সম্পূৰ্ণ হৈছে',
    streak: 'দিনৰ ধাৰাবাহিকতা',
    memoryScore: 'স্মৃতি নম্বৰ',
    playToday: 'আজিৰ খেল আৰম্ভ কৰক',
    memoryCompanion: 'স্মৃতি সহায়ক',
    progressReport: 'মানসিক অগ্ৰগতি',
    caregiverCircle: 'পৰিয়ালৰ যত্ন বৃত্ত',
    doctorView: 'চিকিৎসকৰ তথ্যসূচী',
    settings: 'সুচলতা সুবিধা',
    demoModeBadge: 'এছ.আই.এইচ প্ৰটোটাইপ ডেমো',
    encouragement: 'আপুনি আজি অতি সুন্দৰভাৱে অংশ লৈছে। প্ৰতিটো মুহূৰ্ত উপভোগ কৰক।',
    startActivity: 'অনুশীলন আৰম্ভ কৰক',
    remindersTitle: 'আজিৰ সোঁৱৰণীসমূহ',
    thingsToRemember: 'মনত ৰাখিবলগীয়া কথা',
    fontSize: 'আখৰৰ আকাৰ',
    contrast: 'কনট্ৰাষ্ট ম’ড',
    motion: 'গতিশীলতা সংবেদন',
    readAloud: 'পঢ়ি শুনাওক'
  },
  bn: {
    appName: 'স্মৃতিকিয়ার (SmritiCare)',
    tagline: 'মস্তিষ্কের যত্ন, মানবিক সান্নিধ্যে।',
    greetingMorning: 'সুপ্রভাত',
    greetingAfternoon: 'শুভ অপরাহ্ন',
    greetingEvening: 'শুভ সন্ধ্যা',
    patientName: 'অনন্যা',
    todayJourney: 'আজকের মানসিক যাত্রা',
    activitiesCompleted: 'টি অনুশীলন সম্পন্ন',
    streak: 'দিনের ধারাবাহিকতা',
    memoryScore: 'স্মৃতি স্কোর',
    playToday: 'আজকের খেলা শুরু করুন',
    memoryCompanion: 'স্মৃতি সঙ্গী',
    progressReport: 'মানসিক অগ্রগতি',
    caregiverCircle: 'পরিবার ও যত্নকারী',
    doctorView: 'চিকিৎসক ড্যাশবোর্ড',
    settings: 'সহজতর সেটিংস',
    demoModeBadge: 'এসআইএইচ ডেমো মোড',
    encouragement: 'আপনি খুব ভালো করছেন। শান্ত মনে প্রতিটি কাজ করুন।',
    startActivity: 'অনুশীলন শুরু করুন',
    remindersTitle: 'আজকের রিমাইন্ডার',
    thingsToRemember: 'মনে রাখার বিষয়',
    fontSize: 'লেখার আকার',
    contrast: 'উচ্চ বৈসাদৃশ্য',
    motion: 'গতির মাত্রা',
    readAloud: 'পড়ে শুনুন'
  },
  mni: {
    appName: 'SmritiCare (মৈতৈ)',
    tagline: 'ৱাখলগী চেকশিন-থৌরাং, মীওইবগী ওইনা।',
    greetingMorning: 'অয়ুক্কী য়াইফ-পাউজেল',
    greetingAfternoon: 'নুমিৎথাংবগী য়াইফ-পাউজেল',
    greetingEvening: 'নুমিদাংগী য়াইফ-পাউজেল',
    patientName: 'অনন্যা (Ananya)',
    todayJourney: 'ঙসিসিগী ৱাখলগী খোংচৎ',
    activitiesCompleted: 'থবক লোইশিনখ্রে',
    streak: 'নুমিৎকী খোংচৎ',
    memoryScore: 'নীংশিংবগী স্কোর',
    playToday: 'ঙসিসিগী খেল শান্নসি',
    memoryCompanion: 'নীংশিংবা মতেং পাংবা',
    progressReport: 'ৱাখলগী চাউখৎপা',
    caregiverCircle: 'ইমুংগী য়েন্থোকপা',
    doctorView: 'দোক্তরগী মিৎয়েং',
    settings: 'খুন্নাইগী সেতিংস',
    demoModeBadge: 'SIH DEMO',
    encouragement: 'নহাক ঙসি য়াম্না ফনা হোৎনরি। নুংঙাইনা শান্নবীয়ু।',
    startActivity: 'হৌদোকপীয়ু',
    remindersTitle: 'ঙসিসিগী নীংশিংহন্নবা',
    thingsToRemember: 'নীংশিংগদবা পোৎলম',
    fontSize: 'ময়েক্কী অচৌবা',
    contrast: 'কনত্রাস্ট',
    motion: 'ঈং-চিক্না চৎপা',
    readAloud: 'পাথোকপীয়ু'
  },
  kha: {
    appName: 'SmritiCare (Khasi)',
    tagline: 'Ka jingsumar ia ka bor pyrkhat.',
    greetingMorning: 'Khublei step',
    greetingAfternoon: 'Khublei sngi',
    greetingEvening: 'Khublei janmiet',
    patientName: 'Ananya',
    todayJourney: 'Ka Jingiaid Ka Bor Pyrkhat Mynta Ka Sngi',
    activitiesCompleted: 'ki jingpynmlien la dep',
    streak: 'Sngi ba khlem thut',
    memoryScore: 'Kyntiew Bor Kynmaw',
    playToday: 'IALEH KAI MYNTA KA SNGI',
    memoryCompanion: 'Uba Iarap Kynmaw',
    progressReport: 'Ka Jingroi Ka Bor',
    caregiverCircle: 'Kylleng Ka Jingri',
    doctorView: 'Ka Jingpeit U Doktor',
    settings: 'Ki Jingpynbeit',
    demoModeBadge: 'SIH PROTOTYPE DEMO',
    encouragement: 'Phi leh bha bha mynta ka sngi. Kmen bad shim por.',
    startActivity: 'Sdang Jingpynmlien',
    remindersTitle: 'Ki Jingkynmaw Mynta',
    thingsToRemember: 'Kiei kiei ban kynmaw',
    fontSize: 'Ka jingheh ki dak',
    contrast: 'Ka jingitynnat rong',
    motion: 'Ka jingpynkhih',
    readAloud: 'Pule jam'
  },
  lus: {
    appName: 'SmritiCare (Mizo)',
    tagline: 'Hriatna enkawlna, mihring nunphung mila duan.',
    greetingMorning: 'Chibai zing chibai',
    greetingAfternoon: 'Chibai chhun',
    greetingEvening: 'Chibai tlai',
    patientName: 'Ananya',
    todayJourney: 'Vawiin Hriatna Zin Kawng',
    activitiesCompleted: 'hman zawh tawh',
    streak: 'Ni chhunzawm',
    memoryScore: 'Hriatna Point',
    playToday: 'VAWIIN INTUAITHARNA TI RAWH',
    memoryCompanion: 'Hriatpuitu Thian',
    progressReport: 'Hmasawnna Report',
    caregiverCircle: 'Enkawltu Huang',
    doctorView: 'Daktawr Enna',
    settings: 'Duhthlan Enchhinna',
    demoModeBadge: 'SIH DEMO MODE',
    encouragement: 'Vawiin chu i ti tha hle mai. Hahdam takin le.',
    startActivity: 'Tan rawh le',
    remindersTitle: 'Hriattirna Vawiin',
    thingsToRemember: 'Hriatreng turte',
    fontSize: 'Hawrawp len zawng',
    contrast: 'Rawng fiah zawng',
    motion: 'Chevelh zawng',
    readAloud: 'Chhiar chhuak rawh'
  },
  nag: {
    appName: 'SmritiCare (Nagamese)',
    tagline: 'Dimaag laga care, bhal morom logote.',
    greetingMorning: 'Bhal phula din',
    greetingAfternoon: 'Bhal dupor',
    greetingEvening: 'Bhal sanjh',
    patientName: 'Ananya',
    todayJourney: 'Aji laga Dimaag Journey',
    activitiesCompleted: 'ta activity khotom hoise',
    streak: 'Din laga streak',
    memoryScore: 'Memory Score',
    playToday: 'AJI LAGA GAME KHELILE',
    memoryCompanion: 'Yaad Kora Sathii',
    progressReport: 'Progress Report',
    caregiverCircle: 'Care Circle',
    doctorView: 'Doctor laga View',
    settings: 'Accessibility Settings',
    demoModeBadge: 'SIH PROTOTYPE DEMO',
    encouragement: 'Aji bhal kori ase Ananya. Aaram pora kheli thakibi.',
    startActivity: 'Shuru Koriye',
    remindersTitle: 'Aji laga Reminders',
    thingsToRemember: 'Yaad rakhibo laga kotha',
    fontSize: 'Text laga size',
    contrast: 'High Contrast',
    motion: 'Motion Sensitivity',
    readAloud: 'Porikena hunabi'
  }
};
