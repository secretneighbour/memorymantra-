import { NERLanguage } from '../types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { as } from './locales/as';
import { bn } from './locales/bn';
import { mni } from './locales/mni';
import { kha } from './locales/kha';
import { lus } from './locales/lus';
import { nag } from './locales/nag';

export interface LanguageMeta {
  code: NERLanguage;
  name: string;
  native: string;
  displayLabel: string;
}

export const nerLanguages: readonly LanguageMeta[] = [
  { code: 'en',  name: 'English',   native: 'English',  displayLabel: 'English — English' },
  { code: 'hi',  name: 'Hindi',     native: 'हिन्दी',     displayLabel: 'Hindi — हिन्दी' },
  { code: 'as',  name: 'Assamese',  native: 'অসমীয়া',   displayLabel: 'Assamese — অসমীয়া' },
  { code: 'bn',  name: 'Bengali',   native: 'বাংলা',     displayLabel: 'Bengali — বাংলা' },
  { code: 'mni', name: 'Meitei',    native: 'মৈতায়লোন্', displayLabel: 'Meitei — মৈতায়লোন্' },
  { code: 'kha', name: 'Khasi',     native: 'Khasi',     displayLabel: 'Khasi — Khasi' },
  { code: 'lus', name: 'Mizo',      native: 'Mizo',      displayLabel: 'Mizo — Mizo' },
  { code: 'nag', name: 'Nagamese',  native: 'Nagamese',  displayLabel: 'Nagamese — Nagamese' },
] as const;

export interface TranslationDictionary {
  // Brand & General
  appName: string;
  tagline: string;
  sihBadge: string;
  demoModeBadge: string;
  lowBandwidth: string;
  online: string;
  simulationActive: string;
  telemetryNode: string;

  // Navigation
  navHome: string;
  navCare: string;
  navGames: string;
  navMemory: string;
  navProgress: string;
  navCircle: string;
  navDoctor: string;
  navSettings: string;
  navRoleSwitcher: string;
  navSwitch: string;
  navAIDemo: string;
  currentRole: string;
  changeRole: string;
  rolePatient: string;
  roleCaregiver: string;
  roleDoctor: string;

  // Landing Page Hero
  heroSubtitle: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleLine3: string;
  heroDescription: string;
  btnStartPatientCare: string;
  btnRoleSwitcher: string;
  btnListen: string;
  ttsHeroIntro: string;
  widgetTelemetryTitle: string;
  widgetTelemetrySubtitle: string;
  widgetSessionTitle: string;
  widgetSessionScore: string;
  widgetSessionActivities: string;
  heroBottomTag: string;
  heroBottomTitle: string;
  heroBottomBtn: string;

  // Landing Page Problem / Challenge
  challengeTag: string;
  challengeTitle: string;
  challengeDescription: string;
  stat1Value: string;
  stat1Title: string;
  stat1Desc: string;
  stat1Tag: string;
  stat2Value: string;
  stat2Title: string;
  stat2Desc: string;
  stat2Tag: string;
  stat3Value: string;
  stat3Title: string;
  stat3Desc: string;
  stat3Tag: string;
  stat4Value: string;
  stat4Title: string;
  stat4Desc: string;
  stat4Tag: string;

  // Landing Page Methodology
  methodologyTag: string;
  methodologyTitle: string;
  step1Number: string;
  step1Title: string;
  step1Desc: string;
  step2Number: string;
  step2Title: string;
  step2Desc: string;
  step3Number: string;
  step3Title: string;
  step3Desc: string;
  step4Number: string;
  step4Title: string;
  step4Desc: string;

  // Landing Page Activities / Games
  activitiesTag: string;
  activitiesTitle: string;
  allGamesDirectory: string;
  game1Tag: string;
  game1Title: string;
  game1Desc: string;
  game1Meta: string;
  game2Tag: string;
  game2Title: string;
  game2Desc: string;
  game2Meta: string;
  game3Tag: string;
  game3Title: string;
  game3Desc: string;
  game3Meta: string;
  game4Tag: string;
  game4Title: string;
  game4Desc: string;
  game4Meta: string;
  btnPlayNow: string;

  // Landing Page AI Assistance
  aiTag: string;
  aiTitle: string;
  aiDescription: string;
  aiFeature1Title: string;
  aiFeature1Desc: string;
  aiFeature2Title: string;
  aiFeature2Desc: string;
  aiFeature3Title: string;
  aiFeature3Desc: string;
  btnLaunchCompanion: string;

  // Landing Page Regional Inclusion
  nerTag: string;
  nerTitle: string;
  nerDescription: string;
  demoLangHeader: string;
  demoLangTitle: string;
  demoLangDesc: string;
  infra1Title: string;
  infra1Desc: string;
  infra2Title: string;
  infra2Desc: string;
  infra3Title: string;
  infra3Desc: string;

  // Landing Page CTA
  ctaTag: string;
  ctaTitle: string;
  ctaDesc: string;
  btnEnterApp: string;

  // Patient Dashboard
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  patientName: string;
  encouragement: string;
  sessionActiveBadge: string;
  listenAloud: string;
  voiceAssistanceSub: string;
  habitStreak: string;
  days: string;
  cognitiveVitality: string;
  consistencyImproved: string;
  startTodayJourney: string;
  myMemories: string;
  reminders: string;
  familyCircle: string;
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
  startActivity: string;
  remindersTitle: string;
  thingsToRemember: string;

  // Wellbeing Check-In
  wellbeingCheckInTitle: string;
  wellbeingQuestion: string;
  wellbeingTTS: string;
  moodGood: string;
  moodOkay: string;
  moodWorried: string;
  moodSad: string;
  moodTired: string;
  moodFeedbackPrefix: string;
  consecutiveNegativeAlert: string;
  recentCheckIns: string;
  checkInModalPrompt: string;
  remindMeLater: string;

  // Settings Page
  settingsHeading: string;
  settingsSubheading: string;
  inclusivityBadge: string;
  accessibilityEngine: string;
  btnResetDefaults: string;
  fontSize: string;
  fontSizeDesc: string;
  fontSizeNormal: string;
  fontSizeNormalNote: string;
  fontSizeLarge: string;
  fontSizeLargeNote: string;
  fontSizeExtraLarge: string;
  fontSizeExtraLargeNote: string;
  contrast: string;
  contrastDesc: string;
  contrastStandard: string;
  contrastStandardDesc: string;
  contrastHigh: string;
  contrastHighDesc: string;
  motion: string;
  motionDesc: string;
  motionFull: string;
  motionFullDesc: string;
  motionReduced: string;
  motionReducedDesc: string;
  languageSettingTitle: string;
  languageSettingDesc: string;
  readAloud: string;
  speechTestTitle: string;
  speechTestDesc: string;
  speechTestSample: string;
  btnTestAudioVoice: string;

  // Footer
  footerTagline: string;
  footerCognitiveCare: string;
  footerTherapeuticGames: string;
  footerMemoryCompanion: string;
  footerLongitudinalProgress: string;
  footerCareCircle: string;
  footerClinicianRoster: string;
  footerSupportHotline: string;
  footerRegionText: string;
  footerLanguageLabel: string;
  footerAccessibility: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCopyright: string;
  footerSimulationNotice: string;

  // Role Switcher Modal
  roleSwitcherTitle: string;
  roleSwitcherDesc: string;
  roleModalTag: string;
  rolePatientTitle: string;
  rolePatientPersona: string;
  rolePatientTagline: string;
  rolePatientBadge: string;
  rolePatientBenefit1: string;
  rolePatientBenefit2: string;
  rolePatientBenefit3: string;
  roleCaregiverTitle: string;
  roleCaregiverPersona: string;
  roleCaregiverTagline: string;
  roleCaregiverBadge: string;
  roleCaregiverBenefit1: string;
  roleCaregiverBenefit2: string;
  roleCaregiverBenefit3: string;
  doctorRoleTitle: string;
  doctorRolePersona: string;
  doctorRoleTagline: string;
  doctorRoleBadge: string;
  doctorRoleBenefit1: string;
  doctorRoleBenefit2: string;
  doctorRoleBenefit3: string;

  // Help & Emergency Modal
  helpBtnText: string;
  helpModalTag: string;
  helpModalTitle: string;
  helpModalDesc: string;
  callCaregiverBtn: string;
  callCaregiverSub: string;
  callNowText: string;
  sendAlertBtn: string;
  sendAlertSub: string;
  sendAlertNowText: string;
  callEmergencyBtn: string;
  callEmergencySub: string;
  callEmergencyNowText: string;

  // AI Companion
  aiCompanionTitle: string;
  aiCompanionBadge: string;
  aiCompanionGreeting: string;
  aiCompanionPlaceholder: string;
  aiCompanionSend: string;
  aiCompanionQuick1: string;
  aiCompanionQuick2: string;
  aiCompanionQuick3: string;
  aiCompanionQuick4: string;
  aiCompanionQuick5: string;

  // Offline / Network
  offlineActiveMsg: string;
  onlineSyncedMsg: string;
}

export const translations: Record<NERLanguage, TranslationDictionary> = {
  en,
  hi,
  as,
  bn,
  mni,
  kha,
  lus,
  nag,
};
