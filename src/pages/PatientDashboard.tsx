import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { dailyJourneyActivities } from '../data/activities';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Clock, 
  Heart, 
  Volume2, 
  Smile, 
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Circle
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, reminders, toggleReminder } = useRole();
  const { t } = useAccessibility();

  const [relaxModalOpen, setRelaxModalOpen] = useState(false);

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: t.greetingMorning, icon: <Sun className="w-8 h-8 text-amber-500" /> };
    if (hour < 17) return { text: t.greetingAfternoon, icon: <CloudSun className="w-8 h-8 text-orange-500" /> };
    return { text: t.greetingEvening, icon: <Moon className="w-8 h-8 text-indigo-400" /> };
  };

  const greeting = getGreeting();
  const nextIncomplete = dailyJourneyActivities.find(a => !a.completed) || dailyJourneyActivities[0];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP GREETING MONOLITH (Tactile, Peaceful, High-Contrast)               */}
      {/* ========================================================================= */}
      <div className="frost-white-intense rounded-3xl p-6 sm:p-12 mb-8 border border-ner-border/90 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {greeting.icon}
              <span className="font-mono text-xs uppercase tracking-widest text-ner-black/50 font-bold">
                [ daily companion • session active ]
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
              text={`${greeting.text}, ${t.patientName}. ${t.encouragement} You have completed 3 out of 5 activities today.`}
              label="Listen Aloud"
              size="lg"
            />
            <span className="text-[11px] font-mono text-ner-black/40">
              One-tap voice assistance
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
                <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">Habit Streak</span>
                <span className="font-bold text-xl sm:text-2xl text-ner-black font-mono">
                  {activePatient.stats.streakDays} Days
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-ner-sage flex items-center justify-center shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-ner-black/50 block">Cognitive Vitality</span>
                <span className="font-bold text-xl sm:text-2xl text-ner-black font-mono">
                  {activePatient.stats.weeklyScore}%
                </span>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-ner-sage px-3.5 py-1.5 rounded-full bg-emerald-50 border border-ner-sage/20">
            Consistency improved this week
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TODAY'S COGNITIVE JOURNEY HERO (Nothing Dark Hardware Monolith)        */}
      {/* ========================================================================= */}
      <div className="bg-ner-black text-white rounded-3xl p-6 sm:p-12 mb-10 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle radial dot matrix inside dark hero card */}
        <div className="absolute inset-0 dot-matrix-dark opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
              [ {t.todayJourney} ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {activePatient.stats.completedToday} of {activePatient.stats.totalToday} {t.activitiesCompleted}
            </h2>
            <p className="text-white/60 text-sm sm:text-base font-light max-w-lg">
              Next recommended exercise: <span className="text-white font-semibold">{nextIncomplete.title}</span> ({nextIncomplete.estimatedMinutes} mins)
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
      {/* 3. TACTILE ACTIVITY CARDS (Memory, Words, Sequence, Recognition, Relax)    */}
      {/* ========================================================================= */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-ner-black/50 font-bold">
            [ direct cognitive modules ]
          </h3>
          <span className="text-xs font-mono text-ner-black/40">5 Direct Options</span>
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
                  Completed (88%)
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                MEMORY MATCH
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Find matching pairs of familiar North Eastern heritage treasures.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>5 Mins • Visual Memory</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Words */}
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
                  Completed (92%)
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                WORDS CONNECT
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Pair natural concepts and fruits to stimulate language recall.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>4 Mins • Verbal Lexical</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Sequence */}
          <Link
            to="/games/sequence"
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                  ⭐
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-black text-white font-bold">
                  Play Now
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                SEQUENCE RECALL
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Remember sequential rhythm patterns at your own comfortable pace.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>6 Mins • Reasoning</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Recognition */}
          <Link
            to="/games/recognition"
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                  🧣
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-black text-white font-bold">
                  Ready to Play
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                PICTURE QUIZ
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Connect nostalgic cultural scenes, textiles, and sacred landmarks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>5 Mins • Episodic Recall</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Daily Routine Companion */}
          <Link
            to="/memory"
            className="frost-white-intense rounded-3xl p-6 sm:p-7 hover:border-ner-black/60 transition-all flex flex-col justify-between group active:scale-98 shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-ner-offwhite border border-ner-border">
                  📅
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-black/5 text-ner-black font-bold">
                  Timeline
                </span>
              </div>
              <h4 className="font-bold text-xl text-ner-black group-hover:text-ner-terracotta transition-colors">
                DAILY ROUTINE
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Medicines, scheduled meals, and pinned family memories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>24-Hour Routine</span>
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
                RELAX & BREATHE
              </h4>
              <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                Calming sensory breathing animation for natural nervous tranquility.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between text-xs font-mono text-ner-black/50">
              <span>3 Mins Guided</span>
              <ArrowRight className="w-4 h-4 text-ner-black group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY'S SCHEDULE TIMELINE (Crystal-Clear Elder Routine)                 */}
      {/* ========================================================================= */}
      <div className="frost-white-intense rounded-3xl p-6 sm:p-10 shadow-xl border border-ner-border/90">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-ner-border">
          <div>
            <h3 className="text-2xl font-bold text-ner-black">{t.remindersTitle}</h3>
            <p className="text-xs text-ner-black/60 mt-0.5">Tap any reminder to confirm it was completed</p>
          </div>
          <Link
            to="/memory"
            className="text-xs font-mono font-bold text-ner-terracotta uppercase tracking-wider hover:underline"
          >
            Full Companion →
          </Link>
        </div>

        <div className="space-y-3">
          {reminders.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => toggleReminder(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                item.completed
                  ? 'bg-white/40 border-ner-border/60 opacity-60'
                  : 'bg-white border-ner-border hover:border-ner-black/50 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReminder(item.id);
                  }}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-ner-sage fill-emerald-100" />
                  ) : (
                    <Circle className="w-7 h-7 text-ner-black/30 hover:text-ner-black" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-ner-offwhite border border-ner-border text-ner-black">
                      {item.time}
                    </span>
                    <h4 className={`text-base font-bold ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                      {item.title}
                    </h4>
                  </div>
                  {item.doseOrNote && (
                    <p className="text-xs text-ner-black/60 mt-1 pl-0.5">{item.doseOrNote}</p>
                  )}
                </div>
              </div>

              {item.completed && (
                <span className="text-xs font-mono font-bold text-ner-sage uppercase">
                  Done
                </span>
              )}
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
              Breathe gently, Ananya.
            </h2>
            <p className="text-sm text-ner-black/60 mt-2">
              Inhale peace for 4 seconds, then exhale gently.
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
              Finish Sensory Rest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
