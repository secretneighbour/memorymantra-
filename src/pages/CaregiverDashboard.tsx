import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Link } from 'react-router-dom';
import { CaregiverSummaryEngine } from '../services/ai/caregiverSummary';
import { getStoredWellbeingResponses, evaluateConsecutiveNegativeResponses } from '../utils/wellbeingUtils';
import { 
  Users, 
  Heart, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  Smile, 
  Bell, 
  AlertTriangle, 
  Eye, 
  ShieldCheck, 
  Droplets, 
  Activity, 
  Check,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const CaregiverDashboard: React.FC = () => {
  const { 
    activePatient, 
    reminders, 
    alerts, 
    markAlertReviewed, 
    wellbeingCheckIns,
    sendHelpAlert
  } = useRole();
  const { t } = useAccessibility();

  const [selectedAlertDetail, setSelectedAlertDetail] = useState<string | null>(null);
  const [contactPatientFeedback, setContactPatientFeedback] = useState<string | null>(null);

  const [caregiverNotes, setCaregiverNotes] = useState<string[]>([
    "Mother enjoyed the afternoon word association game today.",
    "Dr. Roy confirmed Monday morning review appointment at 11:00 AM.",
    "Evening garden stroll completed comfortably with walking cane."
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Generate real AI summary from telemetry and reminders
  const aiSummary = CaregiverSummaryEngine.generateDailySummary(activePatient, reminders, wellbeingCheckIns);

  // Metrics computation
  const completedReminders = reminders.filter(r => r.completed);
  const medReminders = reminders.filter(r => r.category === 'medication');
  const completedMeds = medReminders.filter(r => r.completed);
  const hydrationReminders = reminders.filter(r => r.category === 'hydration');

  // Consecutive negative response detection
  const storedWellbeing = getStoredWellbeingResponses();
  const consecutiveEvaluation = evaluateConsecutiveNegativeResponses(storedWellbeing, 2, activePatient.name);

  // =========================================================================
  // ANALYTICS DATASETS (SECTION 16 & 17)
  // =========================================================================

  // 1. Cognitive Activity Trend (7 Days Mon-Sun, 0-100)
  const activityTrendData = [
    { day: 'Mon', score: 78, engagement: 80 },
    { day: 'Tue', score: 82, engagement: 85 },
    { day: 'Wed', score: 80, engagement: 82 },
    { day: 'Thu', score: 86, engagement: 88 },
    { day: 'Fri', score: 85, engagement: 87 },
    { day: 'Sat', score: 89, engagement: 92 },
    { day: 'Sun', score: 88, engagement: 90 },
  ];

  // 2. Weekly Activity Completion (Bar Chart)
  const completionData = [
    { day: 'Mon', completed: 4, target: 5 },
    { day: 'Tue', completed: 5, target: 5 },
    { day: 'Wed', completed: 3, target: 5 },
    { day: 'Thu', completed: 5, target: 5 },
    { day: 'Fri', completed: 4, target: 5 },
    { day: 'Sat', completed: 5, target: 5 },
    { day: 'Sun', completed: 4, target: 5 },
  ];

  // 3. Routine Adherence (Donut Chart: Completed 72%, Pending 18%, Missed 10%)
  const routineAdherenceData = [
    { name: 'Completed', value: 72, color: '#10B981' },
    { name: 'Pending', value: 18, color: '#E67E22' },
    { name: 'Missed', value: 10, color: '#DE4A30' },
  ];

  // 4. Engagement by Time (Heatmap / Timeline periods)
  const timeSlots = [
    { slot: 'Morning (8AM - 12PM)', level: 'High', percentage: 92, count: '14/15 sessions' },
    { slot: 'Afternoon (12PM - 4PM)', level: 'Moderate', percentage: 76, count: '10/14 sessions' },
    { slot: 'Evening (4PM - 8PM)', level: 'High', percentage: 88, count: '12/14 sessions' },
    { slot: 'Night (8PM - 10PM)', level: 'Calm Routine', percentage: 95, count: '15/16 sessions' },
  ];

  // 5. Activity Profile (Radar Chart: Memory, Attention, Recognition, Pattern, Recall)
  const activityProfileData = [
    { domain: 'Memory', value: activePatient.cognitiveDomains.memory || 84, fullMark: 100 },
    { domain: 'Attention', value: activePatient.cognitiveDomains.attention || 88, fullMark: 100 },
    { domain: 'Recognition', value: activePatient.cognitiveDomains.recognition || 90, fullMark: 100 },
    { domain: 'Pattern', value: activePatient.cognitiveDomains.sequence || 78, fullMark: 100 },
    { domain: 'Recall', value: activePatient.cognitiveDomains.engagement || 85, fullMark: 100 },
  ];

  const handleAddCareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setCaregiverNotes([newNoteInput, ...caregiverNotes]);
    setNewNoteInput('');
  };

  const handleContactPatient = () => {
    setContactPatientFeedback(`Calling ${activePatient.name} via care link... Dispatched reassurance chime.`);
    sendHelpAlert(`Caregiver initiated check-in call with patient.`);
    setTimeout(() => setContactPatientFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-ner-border shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
              {t.caregiverPortalBadge}
            </span>
            <span className="text-xs text-ner-black/40 font-mono">{t.caregiverPatientLabel}: {activePatient.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.caregiverHeading}
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            {t.caregiverSubheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-ner-sage text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-ner-sage animate-ping"></span>
            {t.caregiverLastActive}
          </span>
          <button
            onClick={handleContactPatient}
            className="px-5 py-2.5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 text-ner-sage" />
            <span>{t.caregiverContactPatient}</span>
          </button>
        </div>
      </div>

      {contactPatientFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-ner-sage text-ner-sage font-mono text-xs font-bold flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{contactPatientFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OVERVIEW CARDS (SECTION 15)                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {/* Activities Completed */}
        <div className="frost-card rounded-2xl p-5 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between text-ner-black/40 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold">{t.caregiverActivitiesCompleted}</span>
            <Activity className="w-4 h-4 text-ner-terracotta" />
          </div>
          <span className="text-2xl font-bold font-mono text-ner-black">
            4 / 5
          </span>
          <span className="text-[11px] font-mono text-ner-sage block mt-1">{t.caregiverTargetMet}</span>
        </div>

        {/* Medication */}
        <div className="frost-card rounded-2xl p-5 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between text-ner-black/40 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold">{t.caregiverMedication}</span>
            <Clock className="w-4 h-4 text-ner-sage" />
          </div>
          <span className="text-2xl font-bold font-mono text-ner-black">
            3 / 3
          </span>
          <span className="text-[11px] font-mono text-ner-sage block mt-1">
            {t.caregiverAllDosesConfirmed}
          </span>
        </div>

        {/* Hydration */}
        <div className="frost-card rounded-2xl p-5 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between text-ner-black/40 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold">{t.caregiverHydration}</span>
            <Droplets className="w-4 h-4 text-ner-calmBlue" />
          </div>
          <span className="text-2xl font-bold font-mono text-ner-black">5 / 6</span>
          <span className="text-[11px] font-mono text-ner-sage block mt-1">{t.caregiverOptimalRange}</span>
        </div>

        {/* Engagement */}
        <div className="frost-card rounded-2xl p-5 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between text-ner-black/40 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold">{t.caregiverEngagement}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-ner-black">{t.caregiverHigh}</span>
          <span className="text-[11px] font-mono text-ner-black/50 block mt-1">{t.caregiverQuickResponses}</span>
        </div>

        {/* Last Active */}
        <div className="frost-card rounded-2xl p-5 border border-ner-border shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-ner-black/40 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold">{t.caregiverLastActive}</span>
            <Smile className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-xl font-bold font-mono text-ner-black">
            12 min ago
          </span>
          <span className="text-[11px] font-mono text-ner-sage block mt-1">{t.caregiverDeviceOnline}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT ACTIVITY CARDS (SECTION 15)                                     */}
      {/* ========================================================================= */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8 border border-ner-border shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ner-border">
          <h2 className="font-bold text-lg text-ner-black flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-ner-sage" />
            Recent Activity
          </h2>
          <span className="text-xs font-mono text-ner-black/50">Today's Timeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-ner-black">Memory Match</h3>
              <span className="text-xs text-ner-black/50 font-mono">10:12 AM</span>
            </div>
            <span className="text-lg font-bold font-mono text-ner-terracotta bg-ner-terracotta/10 px-3 py-1 rounded-xl">
              86%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-ner-black">Pattern Recognition</h3>
              <span className="text-xs text-ner-black/50 font-mono">10:19 AM</span>
            </div>
            <span className="text-lg font-bold font-mono text-ner-terracotta bg-ner-terracotta/10 px-3 py-1 rounded-xl">
              72%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-ner-black">Object Recognition</h3>
              <span className="text-xs text-ner-black/50 font-mono">10:27 AM</span>
            </div>
            <span className="text-lg font-bold font-mono text-ner-terracotta bg-ner-terracotta/10 px-3 py-1 rounded-xl">
              91%
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COGNITIVE ACTIVITY TREND — REAL LINE CHART (SECTION 16)                */}
      {/* ========================================================================= */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 border border-ner-border shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold">
                [ Longitudinal Telemetry ]
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ner-black">
              Cognitive Activity Trend
            </h2>
            <p className="text-xs sm:text-sm text-ner-black/60 mt-1">
              Observed activity and cognitive performance consistency across the last 7 days.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-ner-black/60">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ner-terracotta"></span> Performance Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-ner-sage"></span> Engagement Index
            </span>
          </div>
        </div>

        {/* Responsive Line Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E2DC" vertical={false} />
              <XAxis dataKey="day" stroke="#888888" tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#888888" tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E2E2DC', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                name="Performance Score"
                stroke="#DE4A30" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#DE4A30', strokeWidth: 2, stroke: '#FFFFFF' }} 
                activeDot={{ r: 7 }} 
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                name="Engagement Index"
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={{ r: 4, fill: '#10B981' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI-ASSISTED INSIGHT (SECTION 16 MANDATE) */}
        <div className="mt-6 p-5 rounded-2xl bg-ner-offwhite border border-ner-border flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-ner-black text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-ner-terracotta" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-ner-terracotta block">
              AI-Assisted Insight
            </span>
            <p className="text-xs sm:text-sm text-ner-black/85 mt-0.5 leading-relaxed">
              "Activity consistency improved this week, while memory-game performance showed a gradual upward trend. 
              Visual recognition scores peaked on Saturday at 89% with steady response latencies."
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. OTHER CAREGIVER ANALYTICS: BAR, DONUT, HEATMAP, RADAR (SECTION 17)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 4.1 Weekly Activity Completion (BAR CHART) */}
        <div className="frost-card rounded-3xl p-6 sm:p-7 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-ner-black/40 font-bold block">
                Session Volume
              </span>
              <h3 className="font-bold text-base text-ner-black">Weekly Activity Completion</h3>
            </div>
            <BarChart2 className="w-4 h-4 text-ner-terracotta" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E2DC" vertical={false} />
                <XAxis dataKey="day" stroke="#888888" tickLine={false} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis domain={[0, 6]} stroke="#888888" tickLine={false} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px',
                    borderColor: '#E2E2DC',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Bar dataKey="completed" name="Completed" fill="#111111" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] font-mono text-ner-black/50 text-center mt-3">
            Target: 5 daily cognitive stimulation activities.
          </p>
        </div>

        {/* 4.2 Routine Adherence (DONUT CHART) */}
        <div className="frost-card rounded-3xl p-6 sm:p-7 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-ner-black/40 font-bold block">
                Adherence Ratio
              </span>
              <h3 className="font-bold text-base text-ner-black">Routine Adherence</h3>
            </div>
            <PieIcon className="w-4 h-4 text-ner-sage" />
          </div>

          <div className="flex items-center justify-between h-48">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={routineAdherenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {routineAdherenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px',
                      borderColor: '#E2E2DC',
                      fontSize: '11px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-2 pl-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ner-sage"></span> Completed
                </span>
                <span className="font-bold text-ner-black">72%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending
                </span>
                <span className="font-bold text-ner-black">18%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ner-terracotta"></span> Missed
                </span>
                <span className="font-bold text-ner-black">10%</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] font-mono text-ner-black/50 text-center mt-1">
            Weekly medication, hydration & activity reminders.
          </p>
        </div>

        {/* 4.3 Engagement by Time (Heatmap / Timeline) */}
        <div className="frost-card rounded-3xl p-6 sm:p-7 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-ner-black/40 font-bold block">
                Diurnal Rhythm
              </span>
              <h3 className="font-bold text-base text-ner-black">Engagement by Time</h3>
            </div>
            <Clock className="w-4 h-4 text-ner-calmBlue" />
          </div>

          <div className="space-y-3">
            {timeSlots.map((ts, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-ner-black block">{ts.slot}</span>
                  <span className="text-[10px] font-mono text-ner-black/50">{ts.count}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-ner-offwhite h-2 rounded-full overflow-hidden hidden sm:block">
                    <div className="bg-ner-terracotta h-full rounded-full" style={{ width: `${ts.percentage}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-ner-black">{ts.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4.4 Activity Profile (RADAR CHART) */}
        <div className="frost-card rounded-3xl p-6 sm:p-7 border border-ner-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-ner-black/40 font-bold block">
                Multi-Domain Telemetry
              </span>
              <h3 className="font-bold text-base text-ner-black">Activity Profile</h3>
            </div>
            <Compass className="w-4 h-4 text-ner-terracotta" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={activityProfileData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#E2E2DC" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#111111', fontSize: 11, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888888" tick={{ fontSize: 9 }} />
                <Radar 
                  name="Observed Profile" 
                  dataKey="value" 
                  stroke="#DE4A30" 
                  fill="#DE4A30" 
                  fillOpacity={0.25} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px',
                    borderColor: '#E2E2DC',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-mono text-ner-black/40 text-center">
            Activity performance metrics only. Not a clinical diagnosis.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CAREGIVER ALERT ENGINE (SECTION 18)                                     */}
      {/* ========================================================================= */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8 border border-ner-border shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ner-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-ner-terracotta" />
            <h3 className="font-bold text-lg text-ner-black">Caregiver Alert Engine</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
            {alerts.filter(a => !a.reviewed).length} Pending Review
          </span>
        </div>

        <div className="space-y-3.5">
          {alerts.map((alert) => {
            const isUrgent = alert.severity === 'urgent';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.reviewed
                    ? 'bg-white/40 border-ner-border opacity-65'
                    : isUrgent
                    ? 'bg-rose-50 border-rose-300'
                    : isWarning
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-ner-border'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUrgent ? 'bg-rose-200 text-rose-800' : isWarning ? 'bg-amber-200 text-amber-900' : 'bg-ner-offwhite text-ner-black'
                  }`}>
                    {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-ner-black">{alert.title}</h4>
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white border border-ner-border">
                        {alert.createdAt}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ner-black/70 mt-1">{alert.message}</p>
                  </div>
                </div>

                {/* Actions: View Details, Contact Patient, Mark Reviewed */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-ner-border/40">
                  <button
                    onClick={() => setSelectedAlertDetail(alert.message)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-ner-border hover:border-ner-black text-ner-black text-xs font-mono font-bold uppercase flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={handleContactPatient}
                    className="px-3 py-1.5 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-ner-sage" />
                    <span>Contact</span>
                  </button>

                  {!alert.reviewed ? (
                    <button
                      onClick={() => markAlertReviewed(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-ner-sage text-xs font-mono font-bold uppercase flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-ner-sage flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlertDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-ner-black mb-2">Alert Detail</h3>
            <p className="text-sm text-ner-black/80 bg-white p-4 rounded-xl border border-ner-border mb-6">
              {selectedAlertDetail}
            </p>
            <button
              onClick={() => setSelectedAlertDetail(null)}
              className="w-full h-12 rounded-xl bg-ner-black text-white font-mono text-xs uppercase font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CARE CIRCLE TEAM & FAMILY COORDINATION                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Care Circle Team */}
        <div className="frost-card rounded-3xl p-6 sm:p-8 border border-ner-border shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ner-border">
            <Users className="w-5 h-5 text-ner-terracotta" />
            <h3 className="font-bold text-lg text-ner-black">Care Circle Team</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-ner-terracotta uppercase font-bold block">
                  Primary Caregiver
                </span>
                <span className="text-sm font-bold text-ner-black">Rohan Sharma (Son)</span>
                <span className="text-xs text-ner-black/50 block font-mono">+91 98640 12345</span>
              </div>
              <button
                onClick={handleContactPatient}
                className="p-2.5 rounded-xl bg-ner-offwhite border border-ner-border text-ner-black hover:bg-ner-black hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-ner-sage uppercase font-bold block">
                  Companion & Care Assistant
                </span>
                <span className="text-sm font-bold text-ner-black">Meera Das</span>
                <span className="text-xs text-ner-black/50 block font-mono">+91 94351 77665</span>
              </div>
              <button
                onClick={handleContactPatient}
                className="p-2.5 rounded-xl bg-ner-offwhite border border-ner-border text-ner-black hover:bg-ner-black hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-ner-calmBlue uppercase font-bold block">
                  Consulting Neurologist
                </span>
                <span className="text-sm font-bold text-ner-black">Dr. Debabrata Roy, MD</span>
                <span className="text-xs text-ner-black/50 block font-mono">Dispur Polyclinic</span>
              </div>
              <Link
                to="/doctor"
                className="text-xs font-mono font-bold text-ner-terracotta hover:underline"
              >
                Clinical View →
              </Link>
            </div>
          </div>
        </div>

        {/* Family Notes */}
        <div className="frost-card rounded-3xl p-6 sm:p-8 border border-ner-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-ner-calmBlue" />
            <h3 className="font-bold text-lg text-ner-black">Family Circle Notes</h3>
          </div>
          <p className="text-xs text-ner-black/60 mb-4">
            Daily coordination updates visible to family members.
          </p>

          <form onSubmit={handleAddCareNote} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNoteInput}
              onChange={(e) => setNewNoteInput(e.target.value)}
              placeholder="Post an update for the family..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-ner-border text-xs focus:outline-none focus:border-ner-black"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-ner-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-ner-black/85"
            >
              Post
            </button>
          </form>

          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {caregiverNotes.map((n, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-ner-border text-xs text-ner-black/80 leading-relaxed">
                "{n}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
