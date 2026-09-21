import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from './TTSButton';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Target, 
  Brain,
  RotateCcw,
  ArrowRight,
  Award,
  ChevronRight
} from 'lucide-react';

interface DailyCognitiveGoalsRingProps {
  className?: string;
  showActivitiesList?: boolean;
  onSelectGame?: (route: string) => void;
}

export const DailyCognitiveGoalsRing: React.FC<DailyCognitiveGoalsRingProps> = ({
  className = '',
  showActivitiesList = true,
  onSelectGame
}) => {
  const navigate = useNavigate();
  const { activePatient, setActivePatient, recordGameCompletion } = useRole();
  const { playCalmingChime, t } = useAccessibility();

  // Load custom goal preference or default to activePatient.stats.totalToday (default 4 or 5)
  const [targetGoal, setTargetGoal] = useState<number>(() => {
    const saved = localStorage.getItem('memory_mantra_daily_cognitive_goal') || localStorage.getItem('smriti_daily_cognitive_goal');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 2 && parsed <= 8) return parsed;
    }
    return activePatient.stats.totalToday || 4;
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);

  const completedToday = activePatient.stats.completedToday;
  const percent = Math.min(100, Math.round((completedToday / targetGoal) * 100));
  const isGoalReached = completedToday >= targetGoal;
  const remaining = Math.max(0, targetGoal - completedToday);

  // Play a soft celebratory chime when the user hits 100%
  useEffect(() => {
    if (isGoalReached && !hasCelebrated && completedToday > 0) {
      playCalmingChime();
      setHasCelebrated(true);
    } else if (!isGoalReached) {
      setHasCelebrated(false);
    }
  }, [isGoalReached, completedToday, hasCelebrated, playCalmingChime]);

  // Handle changing daily goal
  const handleSetTarget = (newTarget: number) => {
    setTargetGoal(newTarget);
    localStorage.setItem('memory_mantra_daily_cognitive_goal', newTarget.toString());
    localStorage.setItem('smriti_daily_cognitive_goal', newTarget.toString());
    setActivePatient({
      ...activePatient,
      stats: {
        ...activePatient.stats,
        totalToday: newTarget
      }
    });
  };

  // Recommended next games list
  const availableGames = [
    { id: 'memory', title: 'Heritage Memory Match', route: '/games/memory', icon: '🦏', domain: 'Memory' },
    { id: 'pattern', title: 'Visual Pattern Recall', route: '/games/pattern', icon: '🔍', domain: 'Attention' },
    { id: 'words', title: 'Brahmaputra Word Connect', route: '/games/words', icon: '🍎', domain: 'Language' },
    { id: 'recognition', title: 'Heritage Recognition', route: '/games/recognition', icon: '🏛️', domain: 'Recognition' },
    { id: 'sequence', title: 'Rhythm Sequence Recall', route: '/games/sequence', icon: '🥁', domain: 'Executive' },
    { id: 'market', title: 'Remember the Market', route: '/games/market', icon: '🛍️', domain: 'Memory' },
  ];

  // Find next incomplete or suggested game
  const recentTitles = (activePatient.recentActivities || []).map(a => a.title.toLowerCase());
  const nextGame = availableGames.find(g => !recentTitles.some(t => t.includes(g.title.toLowerCase().slice(0, 8)))) || availableGames[0];

  // SVG Progress Ring Geometry
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Determine ring color depending on progress
  let ringGradientStart = '#DE4A30'; // terracotta
  let ringGradientEnd = '#E67E22';   // warm amber
  let badgeColor = 'bg-ner-terracotta/10 text-ner-terracotta border-ner-terracotta/20';

  if (percent >= 100) {
    ringGradientStart = '#10B981'; // sage emerald
    ringGradientEnd = '#059669';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (percent >= 50) {
    ringGradientStart = '#E67E22'; // amber
    ringGradientEnd = '#10B981';   // transitions to sage
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  }

  // Spoken text summary for accessibility
  const ttsMessage = isGoalReached
    ? `Daily Cognitive Goals: Fantastic work! You have completed ${completedToday} of ${targetGoal} games today. Daily brain health goal is fully accomplished.`
    : `Daily Cognitive Goals: You have completed ${completedToday} of ${targetGoal} games today. Only ${remaining} more ${remaining === 1 ? 'game' : 'games'} to reach today's target. Next recommended exercise is ${nextGame.title}.`;

  const handleLaunchGame = (route: string) => {
    if (onSelectGame) {
      onSelectGame(route);
    } else {
      navigate(route);
    }
  };

  const handleSimulateGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockGames = [
      'Heritage Recognition',
      'Rhythm Sequence Recall',
      'Remember the Market',
      'Visual Pattern Recall'
    ];
    const picked = mockGames[completedToday % mockGames.length];
    recordGameCompletion(picked, Math.floor(82 + Math.random() * 16));
  };

  const handleResetForDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePatient({
      ...activePatient,
      stats: {
        ...activePatient.stats,
        completedToday: 0
      }
    });
    setHasCelebrated(false);
  };

  return (
    <div 
      id="daily-cognitive-goals-ring-card"
      className={`frost-white-intense rounded-3xl p-6 sm:p-8 border border-ner-border/90 shadow-xl relative overflow-hidden transition-all ${className}`}
    >
      {/* Background soft ambient decoration */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: isGoalReached ? '#10B981' : '#DE4A30' }}
      />

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-ner-terracotta/10 text-ner-terracotta">
              <Target className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-ner-black/60 font-bold">
              [ Daily Cognitive Goals ]
            </span>
            {isGoalReached && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-mono font-bold border border-emerald-500/20 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Goal Reached!
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ner-black tracking-tight flex items-center gap-2">
            <span>Today's Brain Workout</span>
            <span className="text-xs font-mono font-normal text-ner-black/50 px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border">
              {completedToday} of {targetGoal} Completed
            </span>
          </h3>
        </div>

        {/* Audio Read Aloud & Goal Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <TTSButton
            text={ttsMessage}
            label="Listen Status"
            size="sm"
          />

          {/* Goal Selector Pill Dropdown / Selector */}
          <div className="flex items-center bg-ner-offwhite rounded-full p-1 border border-ner-border text-xs font-mono">
            <span className="px-2 text-ner-black/50 text-[10px] uppercase font-bold hidden sm:inline">
              Target:
            </span>
            {[3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => handleSetTarget(num)}
                title={`Set daily goal to ${num} games`}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  targetGoal === num 
                    ? 'bg-ner-black text-white shadow-sm' 
                    : 'text-ner-black/70 hover:text-ner-black hover:bg-white/60'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Interactive Ring & Overview Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: The Circular Progress Ring */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
          <div 
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Daily Cognitive Goals Progress: ${completedToday} of ${targetGoal} games completed`}
          >
            <svg 
              width={size} 
              height={size} 
              className="rotate-[-90deg] drop-shadow-sm overflow-visible"
            >
              <defs>
                <linearGradient id="cognitiveProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={ringGradientStart} />
                  <stop offset="100%" stopColor={ringGradientEnd} />
                </linearGradient>
                <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={ringGradientStart} floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-ner-border/70"
              />

              {/* Milestone Indicator Ticks at 25%, 50%, 75% */}
              {[0.25, 0.5, 0.75].map((pos, idx) => {
                const angle = pos * 2 * Math.PI - Math.PI / 2;
                const dotX = size / 2 + (radius) * Math.cos(angle);
                const dotY = size / 2 + (radius) * Math.sin(angle);
                return (
                  <circle
                    key={idx}
                    cx={dotX}
                    cy={dotY}
                    r={2.5}
                    className="fill-ner-border text-ner-border"
                    transform={`rotate(90 ${size / 2} ${size / 2})`}
                  />
                );
              })}

              {/* Foreground Animated Progress Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="url(#cognitiveProgressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                filter={isGoalReached ? 'url(#ringGlow)' : undefined}
              />
            </svg>

            {/* Center Content of Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 select-none">
              {isGoalReached ? (
                <div className="animate-fade-in flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 shadow-inner">
                    <Trophy className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-ner-black">
                    {completedToday}/{targetGoal}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    Goal Done
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-ner-black/40 font-bold">
                    Completed
                  </span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-4xl font-extrabold font-mono text-ner-black tracking-tight">
                      {completedToday}
                    </span>
                    <span className="text-lg font-mono text-ner-black/40">
                      /{targetGoal}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ner-terracotta">
                    {percent}% Done
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick interactive test actions for demonstration & live inspection */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-ner-border/40 text-[11px] font-mono">
            <button
              onClick={handleSimulateGame}
              className="px-2.5 py-1 rounded-lg bg-ner-offwhite hover:bg-white text-ner-black/70 hover:text-ner-black border border-ner-border transition active:scale-95 flex items-center gap-1"
              title="Record a simulated completed game to test the progress ring"
            >
              <span>+ Complete Game</span>
            </button>
            {completedToday > 0 && (
              <button
                onClick={handleResetForDemo}
                className="p-1 text-ner-black/40 hover:text-ner-black transition"
                title="Reset completed games count for demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Status Breakdown & Next Exercise CTA */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Status Message Card */}
          <div className={`p-4 rounded-2xl border ${badgeColor} transition-colors`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/80 shrink-0 shadow-sm">
                {isGoalReached ? (
                  <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-500/20" />
                ) : (
                  <Brain className="w-5 h-5 text-ner-terracotta" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-ner-black">
                  {isGoalReached 
                    ? "Target Reached: Great Neuro-plasticity Stimulation!" 
                    : `${remaining} ${remaining === 1 ? 'Exercise' : 'Exercises'} Left for Today`}
                </h4>
                <p className="text-xs text-ner-black/70 mt-1 leading-relaxed">
                  {isGoalReached
                    ? "You have completed your daily regimen of targeted cognitive sessions. Regular daily repetition preserves recall confidence and daily vitality."
                    : `Playing ${targetGoal} short exercises daily promotes cognitive resilience across memory, language, and attention pathways.`}
                </p>
              </div>
            </div>
          </div>

          {/* Next Recommended Game Quick Launcher */}
          <div className="p-4 rounded-2xl bg-ner-black text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                {isGoalReached ? "Keep Going • Bonus Exercise" : "Recommended Next Exercise"}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{nextGame.icon}</span>
                <span className="font-bold text-base text-white">{nextGame.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {nextGame.domain}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleLaunchGame(nextGame.route)}
              className="px-5 py-2.5 rounded-xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isGoalReached ? "Play Bonus" : "Play Now"}</span>
            </button>
          </div>

          {/* Key Cognitive Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-ner-offwhite border border-ner-border text-center">
              <span className="text-[10px] font-mono uppercase text-ner-black/50 block">Streak</span>
              <span className="text-sm font-bold font-mono text-ner-black flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {activePatient.stats.streakDays} Days
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ner-offwhite border border-ner-border text-center">
              <span className="text-[10px] font-mono uppercase text-ner-black/50 block">Vitality</span>
              <span className="text-sm font-bold font-mono text-ner-sage flex items-center justify-center gap-1 mt-0.5">
                <Trophy className="w-3.5 h-3.5 text-ner-sage" />
                {activePatient.stats.weeklyScore}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ner-offwhite border border-ner-border text-center">
              <span className="text-[10px] font-mono uppercase text-ner-black/50 block">Daily Target</span>
              <span className="text-sm font-bold font-mono text-ner-black flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-ner-terracotta" />
                {targetGoal} Games
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Optional Detailed Activity List */}
      {showActivitiesList && (
        <div className="mt-6 pt-5 border-t border-ner-border/70">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-ner-black/70">
              Today's Completed Activity Log
            </h5>
            <span className="text-[11px] font-mono text-ner-black/40">
              {Math.min(completedToday, (activePatient.recentActivities || []).length)} entries recorded
            </span>
          </div>

          {(activePatient.recentActivities && activePatient.recentActivities.length > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activePatient.recentActivities.slice(0, Math.max(2, completedToday)).map((act) => (
                <div 
                  key={act.id}
                  className="p-3 rounded-2xl bg-white border border-ner-border flex items-center justify-between gap-3 shadow-sm hover:border-ner-black/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-ner-black block truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-mono text-ner-black/50">
                        {act.completedAt}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-ner-offwhite border border-ner-border text-[11px] font-mono font-bold text-ner-black shrink-0">
                    {act.score}% Acc
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-ner-offwhite/50 border border-dashed border-ner-border text-center text-xs font-mono text-ner-black/50">
              No games completed yet today. Tap "Play Now" above to begin!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
