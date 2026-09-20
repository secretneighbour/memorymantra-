import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRole } from '../context/RoleContext';
import { useCurrentUser } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { WellbeingCheckIn } from '../components/WellbeingCheckIn';
import { DailyMoodHealthCheckin } from '../components/DailyMoodHealthCheckin';
import { WellVoiceAssistant } from '../components/WellVoiceAssistant';
import { DailyCognitiveGoalsRing } from '../components/DailyCognitiveGoalsRing';
import { dailyJourneyActivities } from '../data/activities';
import { 
  StaggerContainer, 
  StaggerItem 
} from '../components/motion/MotionPrimitives';
import { 
  Play, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Bell,
  Users,
  Image,
  AlertCircle,
  Clock3,
  Volume2
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePatient, 
    reminders, 
    setReminderStatus,
    setIsHelpModalOpen,
    setIsAICompanionOpen
  } = useRole();
  const { t, simpleUIMode, setSimpleUIMode } = useAccessibility();
  const { displayName } = useCurrentUser();

  const [relaxModalOpen, setRelaxModalOpen] = useState(false);
  const [wellVoiceOpen, setWellVoiceOpen] = useState(false);
  const [snoozeFeedback, setSnoozeFeedback] = useState<string | null>(null);
  const [helpFeedback, setHelpFeedback] = useState<string | null>(null);

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: t.greetingMorning, icon: <Sun className="w-8 h-8 text-amber-500" /> };
    if (hour < 17) return { text: t.greetingAfternoon, icon: <CloudSun className="w-8 h-8 text-orange-500" /> };
    return { text: t.greetingEvening, icon: <Moon className="w-8 h-8 text-indigo-400" /> };
  };

  const greeting = getGreeting();
  const nextIncomplete = dailyJourneyActivities.find(a => !a.completed) || dailyJourneyActivities[0];

  const handleReminderDone = (id: string) => {
    setReminderStatus(id, 'completed');
  };

  const handleReminderSnooze = (id: string, title: string) => {
    setReminderStatus(id, 'snoozed');
    setSnoozeFeedback(`"${title}" ${t.remindMeLater}`);
    setTimeout(() => setSnoozeFeedback(null), 3000);
  };

  const handleReminderHelp = (id: string, title: string) => {
    setReminderStatus(id, 'help_requested');
    setHelpFeedback(`${t.callCaregiverBtn}: "${title}"`);
    setTimeout(() => setHelpFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-24 sm:pb-20 px-3 sm:px-8 max-w-5xl mx-auto selection:bg-ner-terracotta selection:text-white">
      {/* Login Prompt Modal for Daily Well-Being */}
      <WellbeingCheckIn mode="modal" autoPromptOnLogin={true} />

      <StaggerContainer staggerDelay={0.07} className="space-y-6">
        {/* Simple UI Mode Quick Toggle Ribbon */}
        <StaggerItem>
          <div className="flex items-center justify-between p-3.5 mb-2 rounded-2xl bg-white border border-ner-border shadow-xs tactile-card">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${simpleUIMode ? 'bg-ner-sage animate-pulse' : 'bg-ner-black/40'}`} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ner-black">
                {t.simpleUIMode}
              </span>
              <span className="text-[11px] text-ner-black/60 hidden sm:inline">
                — {t.simpleUIDesc}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSimpleUIMode(!simpleUIMode)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 tactile-btn ${
                simpleUIMode
                  ? 'bg-ner-black dark:bg-ner-terracotta text-white shadow-sm'
                  : 'bg-ner-offwhite dark:bg-gray-800 text-ner-black/70 dark:text-white hover:text-ner-black dark:hover:bg-gray-700 border border-ner-border dark:border-gray-700'
              }`}
              aria-pressed={simpleUIMode}
            >
              <span>{simpleUIMode ? `✓ ${t.simpleUIOn}` : t.simpleUIOff}</span>
            </button>
          </div>
        </StaggerItem>

        {/* ========================================================================= */}
        {/* 1. TOP GREETING MONOLITH (Tactile, Peaceful, High-Contrast)               */}
        {/* ========================================================================= */}
        <StaggerItem>
          <div className="frost-white-intense rounded-3xl p-5 sm:p-10 mb-2 border border-ner-border/90 shadow-xl relative overflow-hidden tactile-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {greeting.icon}
                  <span className="font-mono text-xs uppercase tracking-widest text-ner-black/50 font-bold">
                    [ {t.sessionActiveBadge} ]
                  </span>
                </div>

                <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-ner-black">
                  {greeting.text}, <span className="text-ner-terracotta">{displayName}.</span>
                </h1>

                <p className="text-sm sm:text-xl text-ner-black/75 font-light leading-relaxed max-w-2xl">
                  {t.encouragement}
                </p>
              </div>

              {/* Large Audio Read-Out Pill & Well Voice Assistant */}
              <div className="shrink-0 flex flex-col sm:items-end gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="start-well-voice-hero-btn"
                    onClick={() => setWellVoiceOpen(true)}
                    className="px-4 py-3 rounded-2xl bg-ner-terracotta text-white hover:bg-ner-terracotta/90 text-sm font-mono font-bold flex items-center gap-2 shadow-md tactile-btn min-h-[48px]"
                    title="Open interactive Well Voice assistant"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>{t.wellVoiceCheckinBtn}</span>
                  </button>
                  <TTSButton
                    text={`${greeting.text}, ${displayName}. ${t.encouragement} ${t.activitiesCompleted}: ${activePatient.stats.completedToday} / ${activePatient.stats.totalToday}.`}
                    label={t.listenAloud}
                    size="lg"
                  />
                </div>
                <span className="text-[11px] font-mono text-ner-black/40">
                  {t.voiceAssistanceSub}
                </span>
              </div>
            </div>

            {/* Vitality Badges (Hidden in Simple UI Mode to reduce cognitive clutter) */}
            {!simpleUIMode && (
              <div className="mt-8 pt-6 border-t border-ner-border/80 flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                  {/* Streak */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">{t.habitStreak}</span>
                      <span className="font-bold text-lg sm:text-xl text-ner-black font-mono">
                        {activePatient.stats.streakDays} {t.days}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-ner-sage flex items-center justify-center shadow-inner">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">{t.cognitiveVitality}</span>
                      <span className="font-bold text-lg sm:text-xl text-ner-black font-mono">
                        {activePatient.stats.weeklyScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-ner-sage px-3.5 py-1.5 rounded-full bg-emerald-50 border border-ner-sage/20">
                  {t.consistencyImproved}
                </span>
              </div>
            )}
          </div>
        </StaggerItem>

      {/* ========================================================================= */}
      {/* SIMPLE UI MODE (5 ESSENTIAL TACTILE SECTIONS)                             */}
      {/* ========================================================================= */}
      {simpleUIMode ? (
        <StaggerContainer staggerDelay={0.06} className="space-y-6 my-6">
          {/* Card 1: Today's Activity */}
          <StaggerItem>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-ner-black shadow-lg space-y-4 tactile-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ner-terracotta/15 text-ner-terracotta flex items-center justify-center">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-ner-terracotta uppercase tracking-wider block">
                    1 // {t.simpleUIMyDay}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-ner-black">
                    {nextIncomplete.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-ner-black/75 leading-relaxed">
                {nextIncomplete.description}
              </p>
              <button
                onClick={() => navigate(nextIncomplete.route)}
                className="w-full py-4 rounded-2xl bg-ner-black hover:bg-ner-black/90 text-white font-mono text-sm sm:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-md tactile-btn min-h-[56px]"
              >
                <Play className="w-5 h-5 fill-current text-ner-terracotta" />
                <span>{t.startActivity}</span>
              </button>
            </div>
          </StaggerItem>

          {/* Card 2: Smriti Memory Companion */}
          <StaggerItem>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-ner-border hover:border-ner-black shadow-sm space-y-4 tactile-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ner-calmBlue/15 text-ner-calmBlue flex items-center justify-center">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-ner-calmBlue uppercase tracking-wider block">
                    2 // {t.simpleUIChatSmriti}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
                    {t.memoryCompanion}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-ner-black/75">
                Talk and reminisce peacefully about family, childhood memories, and daily routines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAICompanionOpen(true)}
                  className="py-4 px-4 rounded-2xl bg-ner-calmBlue text-white hover:bg-ner-calmBlue/90 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 tactile-btn min-h-[52px]"
                >
                  <span>Launch Companion Chat</span>
                </button>
                <Link
                  to="/memories"
                  className="py-4 px-4 rounded-2xl bg-ner-offwhite hover:bg-ner-black hover:text-white border border-ner-border text-ner-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 tactile-btn min-h-[52px]"
                >
                  <span>{t.myMemories}</span>
                </Link>
              </div>
            </div>
          </StaggerItem>

          {/* Card 3: Cognitive Game */}
          <StaggerItem>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-ner-border hover:border-ner-black shadow-sm space-y-4 tactile-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ner-sage/15 text-ner-sage flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-ner-sage uppercase tracking-wider block">
                    3 // {t.simpleUIPlayGame}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
                    {t.game1Title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-ner-black/75">
                Gentle visual matching exercise to stimulate active working memory and pattern recall.
              </p>
              <Link
                to="/games/memory"
                className="w-full py-4 rounded-2xl bg-ner-sage text-white hover:bg-ner-sage/90 font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm tactile-btn min-h-[54px]"
              >
                <span>{t.btnPlayNow}</span>
              </Link>
            </div>
          </StaggerItem>

          {/* Card 4: Today's Reminders */}
          <StaggerItem>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-ner-border shadow-sm space-y-4 tactile-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider block">
                      4 // {t.simpleUIReminders}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
                      {t.remindersTitle}
                    </h3>
                  </div>
                </div>
              </div>

              {snoozeFeedback && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
                  <Clock3 className="w-4 h-4" />
                  <span>{snoozeFeedback}</span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                {reminders.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.completed ? 'bg-ner-offwhite/50 border-ner-border/40 opacity-70' : 'bg-white border-ner-border'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-ner-offwhite border border-ner-border text-ner-black inline-block mb-1">
                        {item.time}
                      </span>
                      <h4 className={`text-base font-bold ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                        {item.title}
                      </h4>
                      {item.doseOrNote && (
                        <p className="text-xs text-ner-black/60 mt-0.5">{item.doseOrNote}</p>
                      )}
                    </div>

                    {!item.completed ? (
                      <div className="flex items-center gap-2 pt-2 sm:pt-0">
                        <button
                          onClick={() => handleReminderDone(item.id)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-ner-sage text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm tactile-btn min-h-[44px]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.activitiesCompleted}</span>
                        </button>
                        <button
                          onClick={() => handleReminderSnooze(item.id, item.title)}
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-ner-offwhite dark:bg-gray-800 border border-ner-border dark:border-gray-700 text-ner-black dark:text-white dark:hover:bg-gray-700 font-mono text-xs font-bold uppercase tracking-wider tactile-btn min-h-[44px]"
                        >
                          <span>{t.remindMeLater}</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-mono font-bold text-ner-sage uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {t.activitiesCompleted}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Card 5: Family & Emergency Help */}
          <StaggerItem>
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-ner-black shadow-lg space-y-4 tactile-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider block">
                    5 // {t.simpleUIFamilyHelp}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
                    {t.familyCircle} & Quick Assistance
                  </h3>
                </div>
              </div>
              <p className="text-sm text-ner-black/75">
                Call your primary caregiver or open emergency assistance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${activePatient.primaryCaregiver.phone}`}
                  className="py-4 px-4 rounded-2xl bg-ner-black text-white hover:bg-ner-black/90 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 tactile-btn min-h-[52px]"
                >
                  <span>Call {activePatient.primaryCaregiver.name}</span>
                </a>
                <button
                  onClick={() => setIsHelpModalOpen(true)}
                  className="py-4 px-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md tactile-btn min-h-[52px]"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{t.emergencyNeedHelp} / SOS</span>
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      ) : (
        /* FULL DETAILED DASHBOARD VIEW */
        <>
          {/* ========================================================================= */}
          {/* 2. BIG PRIMARY NAVIGATION PILL BUTTONS                                   */}
          {/* ========================================================================= */}
          <StaggerItem>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-2">
              <button
                onClick={() => navigate(nextIncomplete.route)}
                className="p-4 sm:p-5 rounded-2xl bg-ner-black text-white hover:bg-ner-black/90 font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-lg tactile-btn text-center min-h-[90px]"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-ner-terracotta fill-ner-terracotta" />
                <span className="font-bold truncate max-w-full">{t.startTodayJourney}</span>
              </button>

              <Link
                to="/memories"
                className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm tactile-btn text-center min-h-[90px]"
              >
                <Image className="w-5 h-5 sm:w-6 sm:h-6 text-ner-terracotta" />
                <span className="font-bold truncate max-w-full">{t.myMemories}</span>
              </Link>

              <Link
                to="/reminders"
                className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm tactile-btn text-center min-h-[90px]"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-ner-sage" />
                <span className="font-bold truncate max-w-full">{t.reminders}</span>
              </Link>

              <Link
                to="/caregiver"
                className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm tactile-btn text-center min-h-[90px]"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                <span className="font-bold truncate max-w-full">{t.familyCircle}</span>
              </Link>
            </div>
          </StaggerItem>

          {/* ========================================================================= */}
          {/* 3. DAILY MOOD AND HEALTH CHECK-IN                                         */}
          {/* ========================================================================= */}
          <StaggerItem>
            <DailyMoodHealthCheckin />
          </StaggerItem>

          {/* ========================================================================= */}
          {/* 4. TODAY'S DAILY COGNITIVE GOALS PROGRESS RING                            */}
          {/* ========================================================================= */}
          <StaggerItem>
            <DailyCognitiveGoalsRing className="mb-4" />
          </StaggerItem>

      {/* ========================================================================= */}
      {/* 5. TACTILE ACTIVITY CARDS                                                  */}
      {/* ========================================================================= */}
      <StaggerItem>
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-ner-black/50 font-bold">
              [ {t.allGamesDirectory} ]
            </h3>
            <span className="text-xs font-mono text-ner-black/40">{t.activitiesTag}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Memory */}
            <Link
              to="/games/memory"
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    🦏
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-ner-sage font-bold">
                    {t.game1Tag}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                  {t.game1Title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.game1Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.game1Meta}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Pattern Finder */}
            <Link
              to="/games/pattern"
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    🔍
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-black text-white font-bold">
                    {t.game2Tag}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                  {t.game2Title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.game2Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.game2Meta}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Routine Recall */}
            <Link
              to="/games/routine"
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    ⏰
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
                    {t.game3Tag}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-sage transition-colors">
                  {t.game3Title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.game3Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.game3Meta}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Words Connect */}
            <Link
              to="/games/words"
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    🍎
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-ner-sage font-bold">
                    {t.game4Tag}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                  {t.game4Title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.game4Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.game4Meta}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Remember the Market */}
            <Link
              to="/games/market"
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    🛍️
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    NER
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-amber-800 transition-colors">
                  {t.game1Title}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.game1Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.game1Meta}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Relax & Breathe */}
            <button
              onClick={() => setRelaxModalOpen(true)}
              className="frost-white-intense rounded-3xl p-6 sm:p-7 border border-ner-border hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md text-left tactile-card"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                    🌸
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
                    {t.sensoryCalmTag}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-sage transition-colors">
                  {t.sensoryCalmTitle}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {t.encouragement}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
                <span>{t.sensoryCalmDuration}</span>
                <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </StaggerItem>

      {/* ========================================================================= */}
      {/* 6. TODAY'S SCHEDULE TIMELINE WITH [DONE], [REMIND ME LATER], [I NEED HELP] */}
      {/* ========================================================================= */}
      <StaggerItem>
        <div className="frost-white-intense rounded-3xl p-6 sm:p-10 shadow-xl border border-ner-border/90 tactile-card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-ner-border">
            <div>
              <h3 className="text-2xl font-bold text-ner-black">{t.remindersTitle}</h3>
              <p className="text-xs text-ner-black/60 mt-0.5">
                {t.thingsToRemember}
              </p>
            </div>
            <Link
              to="/reminders"
              className="text-xs font-mono font-bold text-ner-terracotta uppercase tracking-wider hover:underline"
            >
              {t.reminders} →
            </Link>
          </div>

          {snoozeFeedback && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
              <Clock3 className="w-4 h-4" />
              <span>{snoozeFeedback}</span>
            </div>
          )}

          {helpFeedback && (
            <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{helpFeedback}</span>
            </div>
          )}

          <div className="space-y-4">
            {reminders.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-white/40 border-ner-border/60 opacity-70'
                    : 'bg-white border-ner-border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-ner-offwhite border border-ner-border text-ner-black shrink-0">
                    {item.time}
                  </span>

                  <div>
                    <h4 className={`text-base font-bold ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                      {item.title}
                    </h4>
                    {item.doseOrNote && (
                      <p className="text-xs text-ner-black/60 mt-1">{item.doseOrNote}</p>
                    )}
                    {item.status === 'snoozed' && (
                      <span className="text-[11px] font-mono text-amber-700 font-bold block mt-1">
                        ⏰ {t.remindMeLater}
                      </span>
                    )}
                    {item.status === 'help_requested' && (
                      <span className="text-[11px] font-mono text-rose-600 font-bold block mt-1">
                        🚨 {t.callCaregiverBtn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons: [DONE], [REMIND ME LATER], [I NEED HELP] */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-ner-border/50">
                  {!item.completed ? (
                    <>
                      <button
                        onClick={() => handleReminderDone(item.id)}
                        className="px-3.5 py-2 rounded-xl bg-ner-sage hover:bg-ner-sageDark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm tactile-btn"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.activitiesCompleted}</span>
                      </button>

                      <button
                        onClick={() => handleReminderSnooze(item.id, item.title)}
                        className="px-3 py-2 rounded-xl bg-ner-offwhite dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-ner-border dark:border-gray-700 text-ner-black dark:text-white font-mono text-xs font-bold uppercase tracking-wider tactile-btn"
                      >
                        <span>{t.remindMeLater}</span>
                      </button>

                      <button
                        onClick={() => handleReminderHelp(item.id, item.title)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-mono text-xs font-bold uppercase tracking-wider tactile-btn"
                      >
                        <span>{t.helpBtnText}</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-mono font-bold text-ner-sage uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-ner-sage" />
                      {t.activitiesCompleted}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>
    </>
  )}
      </StaggerContainer>

      {/* Guided Breathing Modal */}
      {relaxModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-wrapper border-2 border-ner-black max-w-md w-full text-center shadow-2xl">
            <div className="modal-header">
              <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
                [ {t.sensoryCalmModalBadge} ]
              </span>
              <h2 className="text-2xl font-bold text-ner-black">
                {displayName}
              </h2>
              <p className="text-xs text-ner-black/60 mt-1">
                {t.encouragement}
              </p>
            </div>

            <div className="modal-body my-6 flex items-center justify-center">
              <motion.div 
                className="w-44 h-44 rounded-full bg-ner-sage/20 border-4 border-ner-sage flex items-center justify-center shadow-inner"
                animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              >
                <span className="text-xl font-mono font-bold text-ner-sage">{t.breatheLabel}</span>
              </motion.div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setRelaxModalOpen(false)}
                className="w-full h-12 rounded-xl bg-ner-black text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85 transition-colors tactile-btn"
              >
                ✓ {t.activitiesCompleted}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Well Voice Assistant */}
      <WellVoiceAssistant
        isOpen={wellVoiceOpen}
        onClose={() => setWellVoiceOpen(false)}
      />
    </div>
  );
};
