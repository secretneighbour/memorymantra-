import React from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { Trophy, Flame, ShieldAlert, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { activePatient } = useRole();
  const { t } = useAccessibility();

  const domainData = [
    { subject: 'Memory', score: activePatient.cognitiveDomains.memory, fullMark: 100 },
    { subject: 'Attention', score: activePatient.cognitiveDomains.attention, fullMark: 100 },
    { subject: 'Recognition', score: activePatient.cognitiveDomains.recognition, fullMark: 100 },
    { subject: 'Sequence', score: activePatient.cognitiveDomains.sequence, fullMark: 100 },
    { subject: 'Engagement', score: activePatient.cognitiveDomains.engagement, fullMark: 100 },
  ];

  const weeklyActivityData = [
    { day: 'Mon', activities: 4, score: 82 },
    { day: 'Tue', activities: 5, score: 88 },
    { day: 'Wed', activities: 3, score: 79 },
    { day: 'Thu', activities: 5, score: 85 },
    { day: 'Fri', activities: 4, score: 90 },
    { day: 'Sat', activities: 5, score: 92 },
    { day: 'Sun', activities: 3, score: 86 },
  ];

  const trendData = [
    { week: 'W1', score: 74 },
    { week: 'W2', score: 78 },
    { week: 'W3', score: 83 },
    { week: 'W4', score: 88 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
              Longitudinal Wellness
            </span>
            <span className="text-xs text-ner-black/40 font-mono">Patient: {activePatient.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Small steps become stronger habits.
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            Tracking your cognitive consistency and daily mental exercise routines.
          </p>
        </div>

        <TTSButton
          text={`${t.progressReport}: ${t.patientName}. ${t.consistencyImproved}. ${t.cognitiveVitality}: ${activePatient.stats.weeklyScore}%.`}
          label={t.listenAloud}
          size="lg"
        />
      </div>

      {/* Friendly Interpretation Banner */}
      <div className="frost-card rounded-3xl p-6 mb-8 border-2 border-ner-border bg-emerald-50/50 flex items-start gap-4 shadow-sm">
        <div className="p-3 rounded-2xl bg-ner-sage text-white shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-ner-black">
            Weekly Wellness Insight
          </h3>
          <p className="text-sm text-ner-black/75 mt-0.5 leading-relaxed">
            "Your activity consistency improved this week. Visual recognition and attention to 
            familiar cultural symbols remained remarkably steady across all morning sessions."
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-ner-black/50">
            <ShieldAlert className="w-3.5 h-3.5 text-ner-terracotta" />
            <span>Wellness engagement indicators only. This is not a clinical diagnosis tool.</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="frost-card rounded-3xl p-6 text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-ner-black/40 block mb-1">
            Weekly Accuracy
          </span>
          <span className="text-4xl font-extrabold text-ner-terracotta font-mono">
            {activePatient.stats.weeklyScore}%
          </span>
          <span className="text-xs text-ner-sage font-semibold block mt-1">
            ↑ +4% vs last week
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6 text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-ner-black/40 block mb-1">
            Habit Streak
          </span>
          <span className="text-4xl font-extrabold text-amber-600 font-mono flex items-center justify-center gap-1.5">
            <Flame className="w-7 h-7 fill-current" />
            {activePatient.stats.streakDays} Days
          </span>
          <span className="text-xs text-ner-black/60 font-semibold block mt-1">
            Consistent morning logins
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6 text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-ner-black/40 block mb-1">
            Completed Sessions
          </span>
          <span className="text-4xl font-extrabold text-ner-black font-mono">
            28
          </span>
          <span className="text-xs text-ner-black/60 font-semibold block mt-1">
            Across 4 cognitive games
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Radar Chart (5 Cognitive Domains) */}
        <div className="lg:col-span-6 frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-ner-black">Cognitive Domains Radar</h3>
            <span className="text-xs font-mono text-ner-terracotta font-bold">5 Pillars</span>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Domain representation across Memory, Attention, Recognition, Sequence, and Engagement.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={domainData}>
                <PolarGrid stroke="#E2E2DC" />
                <PolarAngleAxis dataKey="subject" stroke="#111111" tick={{ fill: '#111111', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#A0A09A" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#DE4A30"
                  fill="#DE4A30"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activities Bar Chart */}
        <div className="lg:col-span-6 frost-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-ner-black">Weekly Activity Consistency</h3>
            <span className="text-xs font-mono text-ner-sage font-bold">7-Day Log</span>
          </div>
          <p className="text-xs text-ner-black/60 mb-6">
            Daily mental exercises completed across this current week.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2DC" />
                <XAxis dataKey="day" stroke="#111111" />
                <YAxis domain={[0, 6]} stroke="#111111" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', color: '#fff', borderRadius: '12px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="activities" fill="#111111" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4-Week Trend Area Chart: Cognitive Activity Trend */}
      <div className="frost-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-lg text-ner-black">Cognitive Activity Trend</h3>
            <p className="text-xs text-ner-black/60 mt-0.5">
              Observed trends in cognitive activity and daily engagement performance.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-ner-sage/10 text-ner-sage font-bold self-start sm:self-auto">
            Engagement &amp; Activity Performance
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2DC" />
              <XAxis dataKey="week" stroke="#111111" />
              <YAxis domain={[50, 100]} stroke="#111111" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111111', color: '#fff', borderRadius: '12px', border: 'none' }}
              />
              <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
