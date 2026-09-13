import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { WellbeingCheckIn } from '../components/WellbeingCheckIn';
import { dailyJourneyActivities } from '../data/activities';
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
  Clock3
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activePatient, 
    reminders, 
    setReminderStatus 
  } = useRole();
  const { t } = useAccessibility();

  const [relaxModalOpen, setRelaxModalOpen] = useState(false);
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
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      {/* Login Prompt Modal for Daily Well-Being */}
      <WellbeingCheckIn mode="modal" autoPromptOnLogin={true} />
      
      {/* ========================================================================= */}
      {/* 1. TOP GREETING MONOLITH (Tactile, Peaceful, High-Contrast)               */}
      {/* ========================================================================= */}
      <div className="frost-white-intense rounded-3xl p-6 sm:p-12 mb-6 border border-ner-border/90 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {greeting.icon}
              <span className="font-mono text-xs uppercase tracking-widest text-ner-black/50 font-bold">
                [ {t.sessionActiveBadge} ]
              </span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-bold tracking-tight text-ner-black">
              {greeting.text}, <span className="text-ner-terracotta">{t.patientName}.</span>
            </h1>

            <p className="text-base sm:text-2xl text-ner-black/75 font-light leading-relaxed max-w-2xl">
              {t.encouragement}
            </p>
          </div>

          {/* Large Audio Read-Out Pill */}
          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <TTSButton
              text={`${greeting.text}, ${t.patientName}. ${t.encouragement} ${t.activitiesCompleted}: ${activePatient.stats.completedToday} / ${activePatient.stats.totalToday}.`}
              label={t.listenAloud}
              size="lg"
            />
            <span className="text-[11px] font-mono text-ner-black/40">
              {t.voiceAssistanceSub}
            </span>
          </div>
        </div>

        {/* Vitality Monolith Badges */}
        <div className="mt-10 pt-6 border-t border-ner-border/80 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {/* Streak */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">{t.habitStreak}</span>
                <span className="font-bold text-xl sm:text-2xl text-ner-black font-mono">
                  {activePatient.stats.streakDays} {t.days}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-ner-sage flex items-center justify-center shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">{t.cognitiveVitality}</span>
                <span className="font-bold text-xl sm:text-2xl text-ner-black font-mono">
                  {activePatient.stats.weeklyScore}%
                </span>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-ner-sage px-3.5 py-1.5 rounded-full bg-emerald-50 border border-ner-sage/20">
            {t.consistencyImproved}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BIG PRIMARY NAVIGATION PILL BUTTONS                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
        <button
          onClick={() => navigate(nextIncomplete.route)}
          className="p-5 rounded-2xl bg-ner-black text-white hover:bg-ner-black/90 font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-center"
        >
          <Play className="w-6 h-6 text-ner-terracotta fill-ner-terracotta" />
          <span className="font-bold">{t.startTodayJourney}</span>
        </button>

        <Link
          to="/memories"
          className="p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-center"
        >
          <Image className="w-6 h-6 text-ner-terracotta" />
          <span className="font-bold">{t.myMemories}</span>
        </Link>

        <Link
          to="/reminders"
          className="p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-center"
        >
          <Bell className="w-6 h-6 text-ner-sage" />
          <span className="font-bold">{t.reminders}</span>
        </Link>

        <Link
          to="/caregiver"
          className="p-5 rounded-2xl bg-white border-2 border-ner-border hover:border-ner-black text-ner-black font-mono text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-center"
        >
          <Users className="w-6 h-6 text-rose-500" />
          <span className="font-bold">{t.familyCircle}</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. "HOW ARE YOU FEELING TODAY?" WELL-BEING CHECK-IN                       */}
      {/* ========================================================================= */}
      <WellbeingCheckIn mode="embedded" />

      {/* ========================================================================= */}
      {/* 4. TODAY'S COGNITIVE JOURNEY HERO (Tactile Monolith)                      */}
      {/* ========================================================================= */}
      <div className="bg-ner-black text-white rounded-3xl p-6 sm:p-12 mb-10 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix-dark opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
              [ {t.todayJourney} ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {activePatient.stats.completedToday} / {activePatient.stats.totalToday} {t.activitiesCompleted}
            </h2>
            <p className="text-white/60 text-sm sm:text-base font-light max-w-lg">
              {t.encouragement}
            </p>
          </div>

          {/* Large Tactile Play CTA */}
          <button
            onClick={() => navigate(nextIncomplete.route)}
            className="h-16 px-8 sm:px-10 rounded-2xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white font-mono font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-transform active:scale-95 shrink-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t.playToday}</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 w-full bg-white/10 h-3.5 rounded-full overflow-hidden">
          <div
            className="bg-ner-sage h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(activePatient.stats.completedToday / activePatient.stats.totalToday) * 100}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TACTILE ACTIVITY CARDS                                                  */}
      {/* ========================================================================= */}
      <div className="mb-12">
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
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
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                  🌸
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
                  Mindfulness
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-sage transition-colors">
                Sensory Calm
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                {t.encouragement}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>3 Mins</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. TODAY'S SCHEDULE TIMELINE WITH [DONE], [REMIND ME LATER], [I NEED HELP] */}
      {/* ========================================================================= */}
      <div className="frost-white-intense rounded-3xl p-6 sm:p-10 shadow-xl border border-ner-border/90">
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
                      className="px-3.5 py-2 rounded-xl bg-ner-sage hover:bg-ner-sageDark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.activitiesCompleted}</span>
                    </button>

                    <button
                      onClick={() => handleReminderSnooze(item.id, item.title)}
                      className="px-3 py-2 rounded-xl bg-ner-offwhite hover:bg-white border border-ner-border text-ner-black font-mono text-xs font-bold uppercase tracking-wider active:scale-95"
                    >
                      <span>{t.remindMeLater}</span>
                    </button>

                    <button
                      onClick={() => handleReminderHelp(item.id, item.title)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-mono text-xs font-bold uppercase tracking-wider active:scale-95"
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

      {/* Guided Breathing Modal */}
      {relaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-2">
              [ sensory calm ]
            </span>
            <h2 className="text-3xl font-bold text-ner-black">
              {t.patientName}
            </h2>
            <p className="text-sm text-ner-black/60 mt-2">
              {t.encouragement}
            </p>

            <div className="my-12 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-ner-sage/20 border-4 border-ner-sage flex items-center justify-center animate-ping">
                <span className="text-xl font-mono font-bold text-ner-sage">Breathe</span>
              </div>
            </div>

            <button
              onClick={() => setRelaxModalOpen(false)}
              className="w-full h-14 rounded-2xl bg-ner-black text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85 transition-colors"
            >
              ✓ {t.activitiesCompleted}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
