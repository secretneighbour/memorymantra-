import { NERLanguage } from '../types';

export interface TranslationDictionary {
  // Brand & General
  appName: string;
  tagline: string;
  sihBadge: string;
  demoModeBadge: string;
  lowBandwidth: string;
  online: string;
  offline: string;
  simulationActive: string;
  telemetryNode: string;

  // Common Actions & Labels
  save: string;
  cancel: string;
  close: string;
  back: string;
  next: string;
  previous: string;
  submit: string;
  search: string;
  loading: string;
  error: string;
  success: string;
  retry: string;
  delete: string;
  edit: string;
  filter: string;
  filterBy: string;
  all: string;
  done: string;
  start: string;
  continueBtn: string;
  playAgain: string;
  exit: string;
  viewAll: string;
  learnMore: string;
  status: string;
  active: string;
  completed: string;
  pending: string;
  optional: string;
  required: string;

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
  navLogin: string;
  navSignup: string;
  navLogout: string;
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

  // Caregiver Scroll Dashboard Additions
  longitudinalTelemetry: string;
  cognitiveActivityTrend: string;
  cognitiveActivityTrendDesc: string;
  stabilityIndex: string;
  aiAssistedInsights: string;
  optimalMorningStamina: string;
  optimalMorningStaminaDesc: string;
  recentActivityLabel: string;
  recentActivityVal: string;
  reactionComposureLabel: string;
  reactionComposureVal: string;
  exportPdfReport: string;

  // Interactive Reminder Section Additions
  reminderMedicineTitle: string;
  reminderMedicineSub: string;
  reminderHydrationTitle: string;
  reminderHydrationSub: string;
  reminderAppointmentTitle: string;
  reminderAppointmentSub: string;
  reminderActiveDue: string;
  reminderDismiss: string;
  neuroAssistiveEcosystem: string;

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

  // Games Hub & Game Commons
  gamesHubTitle: string;
  gamesHubSubtitle: string;
  gamesHubFilterAll: string;
  gamesHubFilterMemory: string;
  gamesHubFilterAttention: string;
  gamesHubFilterLanguage: string;
  gamesHubFilterExecutive: string;
  gamesScore: string;
  gamesLevel: string;
  gamesTime: string;
  gamesAttempts: string;
  gamesCorrect: string;
  gamesTryAgain: string;
  gamesWellDone: string;
  gamesCompletedTitle: string;
  gamesCompletedDesc: string;
  gamesAccuracy: string;
  gamesHints: string;
  gamesInstructionsTitle: string;
  gamesBackToHub: string;
  gamesNextLevel: string;

  // Individual Games
  gameMemoryMatchName: string;
  gameMemoryMatchDesc: string;
  gameMemoryMatchInst: string;
  gameSequenceRecallName: string;
  gameSequenceRecallDesc: string;
  gameSequenceRecallInst: string;
  gamePatternFinderName: string;
  gamePatternFinderDesc: string;
  gamePatternFinderInst: string;
  gamePictureRecognitionName: string;
  gamePictureRecognitionDesc: string;
  gamePictureRecognitionInst: string;
  gameRoutineRecallName: string;
  gameRoutineRecallDesc: string;
  gameRoutineRecallInst: string;
  gameEmotionRecognitionName: string;
  gameEmotionRecognitionDesc: string;
  gameEmotionRecognitionInst: string;
  gameWordConnectName: string;
  gameWordConnectDesc: string;
  gameWordConnectInst: string;
  gameMarketMemoryName: string;
  gameMarketMemoryDesc: string;
  gameMarketMemoryInst: string;
  gameNameFaceRecallName: string;
  gameNameFaceRecallDesc: string;
  gameNameFaceRecallInst: string;

  // Memories & Heritage Vault
  memoriesTitle: string;
  memoriesSubtitle: string;
  memoriesTabAll: string;
  memoriesTabPhotos: string;
  memoriesTabFamily: string;
  memoriesTabStories: string;
  memoriesTabSongs: string;
  memoriesTabTherapy: string;
  memoriesAddBtn: string;
  memoriesNewModalTitle: string;
  memoriesTitleLabel: string;
  memoriesPersonPlaceLabel: string;
  memoriesStoryLabel: string;
  memoriesCategoryLabel: string;
  memoriesImageLabel: string;
  memoriesStartTherapy: string;
  memoriesTherapyQuizTitle: string;
  memoriesTherapyQuestion: string;
  memoriesTherapyCorrect: string;
  memoriesTherapyTryAgain: string;
  memoriesTherapyNext: string;
  memoriesCallFamily: string;
  memoriesCalling: string;
  memoriesCallConnected: string;
  memoriesCallEnd: string;
  memoriesEmptyState: string;

  // Reminders & Schedule
  remindersSubtitle: string;
  remindersAdherenceCenter: string;
  remindersFilterAll: string;
  remindersFilterMedication: string;
  remindersFilterExercise: string;
  remindersFilterMeal: string;
  remindersFilterFamily: string;
  remindersTestChime: string;
  remindersChimeTriggered: string;
  remindersDelete: string;
  remindersAddBtn: string;
  remindersNewTitle: string;
  remindersTimeLabel: string;
  remindersDoseLabel: string;
  remindersEmptyState: string;
  remindersCompletedCount: string;

  // Progress & Clinical Reports
  progressTitle: string;
  progressSubtitle: string;
  progressFilter7Days: string;
  progressFilter30Days: string;
  progressFilter3Months: string;
  progressFilter1Year: string;
  progressVitalityIndex: string;
  progressTrendTitle: string;
  progressDomainMemory: string;
  progressDomainAttention: string;
  progressDomainRecognition: string;
  progressDomainSequence: string;
  progressMilestonesTitle: string;
  progressExportBtn: string;
  progressReportGenerated: string;

  // Caregiver Dashboard
  caregiverTitle: string;
  caregiverSubtitle: string;
  caregiverPatientStatus: string;
  caregiverAdherenceRate: string;
  caregiverMoodOverview: string;
  caregiverRecentAlerts: string;
  caregiverQuickCall: string;
  caregiverSendAlert: string;
  caregiverActivityLog: string;
  caregiverAddNote: string;
  caregiverNotesTitle: string;
  caregiverVitalityScore: string;

  // Doctor Portal
  doctorTitle: string;
  doctorSubtitle: string;
  doctorPatientRoster: string;
  doctorCognitiveTrajectory: string;
  doctorMmseEstimate: string;
  doctorClinicalNotes: string;
  doctorExportSummary: string;
  doctorPrescriptionReview: string;

  // Role Selection & Switcher Modal
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

  // Authentication
  authLoginTitle: string;
  authLoginSubtitle: string;
  authSignupTitle: string;
  authSignupSubtitle: string;
  authEmailLabel: string;
  authPasswordLabel: string;
  authConfirmPasswordLabel: string;
  authFullNameLabel: string;
  authRoleLabel: string;
  authForgotPassword: string;
  authResetPassword: string;
  authSendResetLink: string;
  authAlreadyAccount: string;
  authDontHaveAccount: string;
  authSignInBtn: string;
  authSignUpBtn: string;
  authVerifyEmailTitle: string;
  authVerifyEmailDesc: string;
  authBackToLogin: string;

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
  wellbeingSleepLabel: string;
  wellbeingWaterLabel: string;
  wellbeingMedsTaken: string;

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
  voiceSpeedTitle: string;
  voiceSpeedDesc: string;
  voiceSpeedSlow: string;
  voiceSpeedNormal: string;
  voiceSpeedFast: string;

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
  aiCompanionVoiceOn: string;
  aiCompanionVoiceOff: string;
  aiCompanionThinking: string;

  // Offline / Network
  offlineActiveMsg: string;
  onlineSyncedMsg: string;

  // Scroll Sections - Memory Network
  networkBadge: string;
  networkTitle: string;
  networkDescription: string;
  networkCoreNode: string;
  networkEcosystem: string;
  networkNodeMemory: string;
  networkNodeMemorySub: string;
  networkNodeMemoryDesc: string;
  networkNodeGames: string;
  networkNodeGamesSub: string;
  networkNodeGamesDesc: string;
  networkNodeCompanion: string;
  networkNodeCompanionSub: string;
  networkNodeCompanionDesc: string;
  networkNodeReminders: string;
  networkNodeRemindersSub: string;
  networkNodeRemindersDesc: string;
  networkNodeFamily: string;
  networkNodeFamilySub: string;
  networkNodeFamilyDesc: string;
  networkNodeCaregiver: string;
  networkNodeCaregiverSub: string;
  networkNodeCaregiverDesc: string;
  networkNodeDoctor: string;
  networkNodeDoctorSub: string;
  networkNodeDoctorDesc: string;

  // Scroll Sections - Sticky Features
  featuresBadge: string;
  featuresTitle: string;
  featuresLayerCount: string;
  feature1Title: string;
  feature1Tagline: string;
  feature1Desc: string;
  feature1Bullet1: string;
  feature1Bullet2: string;
  feature1Bullet3: string;
  feature1Badge: string;
  feature2Title: string;
  feature2Tagline: string;
  feature2Desc: string;
  feature2Bullet1: string;
  feature2Bullet2: string;
  feature2Bullet3: string;
  feature2Badge: string;
  feature3Title: string;
  feature3Tagline: string;
  feature3Desc: string;
  feature3Bullet1: string;
  feature3Bullet2: string;
  feature3Bullet3: string;
  feature3Badge: string;
  feature4Title: string;
  feature4Tagline: string;
  feature4Desc: string;
  feature4Bullet1: string;
  feature4Bullet2: string;
  feature4Bullet3: string;
  feature4Badge: string;
  feature5Title: string;
  feature5Tagline: string;
  feature5Desc: string;
  feature5Bullet1: string;
  feature5Bullet2: string;
  feature5Bullet3: string;
  feature5Badge: string;
  feature6Title: string;
  feature6Tagline: string;
  feature6Desc: string;
  feature6Bullet1: string;
  feature6Bullet2: string;
  feature6Bullet3: string;
  feature6Badge: string;

  // Scroll Sections - Cognitive Games Suite
  gamesSectionBadge: string;
  gamesSectionTitle: string;
  gamesSectionSubtitle: string;
  gamePlayExercise: string;
  gameDomainLabel: string;
  gameDifficultyLabel: string;

  // Scroll Sections - Memory Wall
  memoryWallBadge: string;
  memoryWallTitle: string;
  memoryWallSubtitle: string;
  memoryWallOpenVault: string;

  // Scroll Sections - Smart Reminders
  remindersSectionBadge: string;
  remindersSectionTitle: string;
  remindersSectionSubtitle: string;
  reminderMarkDone: string;
  reminderSnooze: string;
  reminderNeedHelp: string;
  reminderDoneSuccess: string;
  reminderSnoozedSuccess: string;
  reminderHelpSuccess: string;

  // Scroll Sections - Caregiver Telemetry
  caregiverSectionBadge: string;
  caregiverSectionTitle: string;
  caregiverSectionSubtitle: string;
  caregiverOpenPortal: string;
  caregiverActivityOverview: string;
  caregiverTargetSessions: string;
  caregiverAdherence: string;
  caregiverAdherenceSub: string;
  caregiverEngagement: string;
  caregiverEngagementSub: string;
  caregiverStreak: string;
  caregiverStreakSub: string;

  // Scroll Sections - Regional Accessibility
  regionalSectionBadge: string;
  regionalSectionTitle: string;
  regionalSectionSubtitle: string;
  regionalDialectsTitle: string;
  regionalTapToActivate: string;
  regionalPillarsTitle: string;
  pillarVoiceTitle: string;
  pillarVoiceDesc: string;
  pillarOfflineTitle: string;
  pillarOfflineDesc: string;
  pillarTypographyTitle: string;
  pillarTypographyDesc: string;
  pillarContrastTitle: string;
  pillarContrastDesc: string;
  pillarMotionTitle: string;
  pillarMotionDesc: string;

  // Scroll Sections - Final CTA
  finalCtaBadge: string;
  finalCtaTitleLine1: string;
  finalCtaTitleLine2: string;
  finalCtaSubtitle: string;
  finalCtaButton: string;
  finalCtaPatientPortal: string;
  finalCtaPatientSub: string;
  finalCtaCaregiverHub: string;
  finalCtaCaregiverSub: string;
  finalCtaClinicalView: string;
  finalCtaClinicalSub: string;
  finalCtaMemoryVault: string;
  finalCtaMemorySub: string;
  finalCtaCopyright: string;

  // Authentication & Account
  loginTitle: string;
  loginSubtitle: string;
  loginBadge: string;
  loginAssistBadge: string;
  loginDemoSelector: string;
  loginDemoPatient: string;
  loginDemoCaregiver: string;
  loginDemoDoctor: string;
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  loginPasswordLabel: string;
  loginPasswordPlaceholder: string;
  loginForgotPassword: string;
  loginRememberMe: string;
  loginSecureAuth: string;
  loginBtn: string;
  loginBtnSigning: string;
  loginBtnSuccess: string;
  loginNoAccount: string;
  loginCreateAccount: string;
  loginVerifyEmailLink: string;
  loginDemoRolesLink: string;
  loginSecurityNotice: string;
  loginAudioPrompt: string;
  loginErrorEmail: string;
  loginErrorEmailFormat: string;
  loginErrorPassword: string;
  loginErrorPasswordLength: string;
  loginNotice: string;
  loginEmailVerificationRequired: string;
  loginEmailVerificationDesc: string;
  loginVerifyEmailBtn: string;

  signupTitle: string;
  signupSubtitle: string;
  signupBadge: string;
  signupFullNameLabel: string;
  signupFullNamePlaceholder: string;
  signupEmailLabel: string;
  signupRoleLabel: string;
  signupLocationLabel: string;
  signupPasswordLabel: string;
  signupConfirmPasswordLabel: string;
  signupBtn: string;
  signupBtnCreating: string;
  signupHaveAccount: string;
  signupSignInLink: string;
  signupErrorName: string;
  signupErrorEmail: string;
  signupErrorPassword: string;
  signupErrorPasswordLength: string;
  signupErrorPasswordMatch: string;

  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  forgotPasswordBadge: string;
  forgotPasswordBtn: string;
  forgotPasswordBack: string;
  forgotPasswordAudioPrompt: string;

  verifyEmailTitle: string;
  verifyEmailSubtitle: string;
  verifyEmailBadge: string;
  verifyEmailResend: string;

  // Reminders Page Specifics
  remindersPageBadge: string;
  remindersPageSubBadge: string;
  remindersPageHeading: string;
  remindersPageSubheading: string;
  remindersFilterBy: string;
  remindersFilterMed: string;
  remindersFilterEx: string;
  remindersFilterFam: string;
  remindersDeletePrompt: string;

  // Patient Dashboard Interactive
  wellVoiceCheckinBtn: string;
  sensoryCalmTag: string;
  sensoryCalmTitle: string;
  sensoryCalmDuration: string;
  sensoryCalmModalBadge: string;
  breatheLabel: string;

  // Caregiver Dashboard Portal
  caregiverPortalBadge: string;
  caregiverPatientLabel: string;
  caregiverHeading: string;
  caregiverSubheading: string;
  caregiverLastActive: string;
  caregiverContactPatient: string;
  caregiverActivitiesCompleted: string;
  caregiverTargetMet: string;
  caregiverMedication: string;
  caregiverAllDosesConfirmed: string;
  caregiverHydration: string;
  caregiverOptimalRange: string;
  caregiverQuickResponses: string;
  caregiverHigh: string;
  caregiverDeviceOnline: string;
  caregiverCognitiveTrend: string;
  caregiverWeeklyCompletion: string;
  caregiverRoutineAdherence: string;
  caregiverActivityProfile: string;
  caregiverAlertsTitle: string;
  caregiverNotesHeading: string;
  caregiverNotePlaceholder: string;

  // Games Hub
  gamesHubGymBadge: string;
  gamesHubExercisesBadge: string;
  gamesHubHeading: string;
  gamesHubSubheading: string;
  gamesHubPlayBtn: string;
  gamesHubVisualRecall: string;
  gamesHubReasoningOrder: string;
  gamesHubAttentionLogic: string;
  gamesHubEpisodicMemory: string;
  gamesHubRoutineExecutive: string;
  gamesHubSocialEmpathy: string;
  gamesHubLanguageLexical: string;
  gamesHubWorkingMemory: string;

  // Progress Page
  progressLongitudinalBadge: string;
  progressHeading: string;
  progressSubheading: string;
  progressFriendlyTitle: string;
  progressFriendlyDesc: string;

  // Memories Page
  memoriesVaultBadge: string;
  memoriesVaultHeading: string;
  memoriesVaultSubheading: string;
  memoriesFilterPhotos: string;
  memoriesFilterStories: string;
  memoriesFilterSongs: string;
  memoriesFilterFamily: string;
  memoriesAddModalTitle: string;
  memoriesTitlePlaceholder: string;
  memoriesPersonPlacePlaceholder: string;
  memoriesStoryLabelText: string;
  memoriesStoryPlaceholder: string;
}

export type LanguageCode = NERLanguage;

export type TranslationKey = keyof TranslationDictionary;

export interface SupportedLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
  state: string;
  flag: string;
}
