import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockPatients } from '../data/patients';
import { Patient } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  StaggerContainer, 
  StaggerItem 
} from '../components/motion/MotionPrimitives';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  X, 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Download,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Brain,
  Zap,
  BookOpen,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DoctorDashboard: React.FC = () => {
  const { t, theme } = useAccessibility();
  const isDark = theme === 'dark';

  const chartGridColor = isDark ? '#272732' : '#E2E2DC';
  const chartTextColor = isDark ? '#A1A1AA' : '#111111';
  const chartTooltipBg = isDark ? '#17171C' : '#FFFFFF';
  const chartTooltipBorder = isDark ? '1px solid #DE4A30' : '1px solid #E2E2DC';
  const [patientsList, setPatientsList] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const [doctorNotes, setDoctorNotes] = useState<Record<string, string[]>>({
    'pat-001': [
      "Stable performance across visual recall paradigms.",
      "Adherence to memantine and morning walk remains regular. Family support is attentive.",
      "Recommended sustaining cultural picture quiz and routine recall exercises."
    ]
  });
  const [newNoteInput, setNewNoteInput] = useState('');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const filtered = patientsList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Longitudinal trend data
  const trendData = [
    { period: timeRange === '7d' ? 'Day 1' : timeRange === '30d' ? 'Wk 1' : 'Mth 1', score: 78, speed: 2.8 },
    { period: timeRange === '7d' ? 'Day 2' : timeRange === '30d' ? 'Wk 2' : 'Mth 2', score: 81, speed: 2.6 },
    { period: timeRange === '7d' ? 'Day 3' : timeRange === '30d' ? 'Wk 3' : 'Mth 3', score: 80, speed: 2.5 },
    { period: timeRange === '7d' ? 'Day 4' : timeRange === '30d' ? 'Wk 4' : 'Mth 4', score: 84, speed: 2.3 },
    { period: timeRange === '7d' ? 'Day 5' : timeRange === '30d' ? 'Wk 5' : 'Mth 5', score: 85, speed: 2.2 },
    { period: timeRange === '7d' ? 'Day 6' : timeRange === '30d' ? 'Wk 6' : 'Mth 6', score: 83, speed: 2.1 },
    { period: timeRange === '7d' ? 'Day 7' : timeRange === '30d' ? 'Wk 7' : 'Mth 7', score: 86, speed: 2.1 },
  ];

  const handleAddNote = (patientId: string) => {
    if (!newNoteInput.trim()) return;
    const existing = doctorNotes[patientId] || [];
    setDoctorNotes({
      ...doctorNotes,
      [patientId]: [newNoteInput.trim(), ...existing]
    });
    setNewNoteInput('');
  };

  const handleExportReport = (patient: Patient) => {
    const reportText = `
=====================================================
NEURO NER — CLINICAL COGNITIVE TELEMETRY REPORT
Dispur Polyclinic & Regional Geriatric Tele-Care
Consultant: Dr. Debabrata Roy, MD (Neurology)
Date of Generation: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
=====================================================

PATIENT IDENTIFICATION:
Name: ${patient.name}
Age: ${patient.age} | Gender: Female
Location: ${patient.location}, ${patient.state}
Classification: ${patient.stage}
Primary Caregiver: ${patient.primaryCaregiver.name} (${patient.primaryCaregiver.relation}) - ${patient.primaryCaregiver.phone}

LONGITUDINAL ENGAGEMENT & DOMAIN PROFILE (${timeRange.toUpperCase()} Trajectory):
- Composite Weekly Adherence: ${patient.stats.weeklyScore}%
- Daily Habit Streak: ${patient.stats.streakDays} consecutive days
- Working Memory Domain: ${patient.cognitiveDomains.memory}%
- Executive Function & Sequence: ${patient.cognitiveDomains.sequence}%
- Language & Lexical Association: 92%
- Visual Recognition: ${patient.cognitiveDomains.recognition}%
- Attention & Processing Speed: ${patient.cognitiveDomains.attention}%
- Average Response Latency: 2.1 seconds

OBSERVATION FLAGS:
- Response Time: Stable across tactile modules (2.1s - 2.5s)
- Diurnal Variation: Mild 4% evening performance dip, well within baseline
- Semantic Familiarity: Sustained high recall (88%) on localized heritage items

CLINICAL IMPRESSION & RECOMMENDATIONS:
- Patient displays consistent engagement with low cognitive friction.
- Recommend continuing structured daily journey and calming routines.

NOTE: This report is generated from supportive cognitive exercise telemetry and adherence records. It does not constitute an automated medical diagnostic evaluation.
=====================================================
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patient.name.replace(/\s+/g, '_')}_Cognitive_Summary_${timeRange}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportFeedback(`Exported report for ${patient.name} successfully.`);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <StaggerContainer staggerDelay={0.05} className="space-y-8">
        {/* Header */}
        <StaggerItem>
          <div className="frost-card rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 tactile-card">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-calmBlue/10 text-ner-calmBlue font-bold">
                  {t.doctorPatientRoster}
                </span>
                <span className="text-xs text-ner-black/40 font-mono">{t.doctorTitle}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
                {t.doctorTitle}
              </h1>
              <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-2xl font-normal">
                {t.doctorSubtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-ner-border text-xs font-mono text-ner-black/60 max-w-xs">
              <div className="flex items-center gap-1.5 text-ner-terracotta font-bold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>{t.encouragement}</span>
              </div>
              {t.doctorCognitiveTrajectory}
            </div>
          </div>
        </StaggerItem>

        {exportFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-ner-sage text-ner-sage font-mono text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{exportFeedback}</span>
          </div>
        )}

        {/* Analytics KPI Tiles */}
        <StaggerItem>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Enrolled Patients
          </span>
          <span className="text-3xl font-extrabold text-ner-black font-mono">
            {mockPatients.length}
          </span>
          <span className="text-[11px] text-ner-black/50 block mt-1">
            Across Assam, Manipur, Meghalaya, Mizoram
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Active Today
          </span>
          <span className="text-3xl font-extrabold text-ner-sage font-mono">
            4 / 4
          </span>
          <span className="text-[11px] text-ner-sage font-semibold block mt-1">
            100% adherence rate
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Cohort Weekly Accuracy
          </span>
          <span className="text-3xl font-extrabold text-ner-terracotta font-mono">
            82.2%
          </span>
          <span className="text-[11px] text-ner-black/50 block mt-1">
            Weighted across 8 modules
          </span>
        </div>

        <div className="frost-card rounded-3xl p-6 tactile-card">
          <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40 block mb-1">
            Clinical Tele-Alerts
          </span>
          <span className="text-3xl font-extrabold text-ner-black font-mono">
            0 Flagged
          </span>
          <span className="text-[11px] text-ner-sage font-semibold block mt-1">
            All regimens within baseline
          </span>
        </div>
      </div>
    </StaggerItem>

    {/* Patient Table with Search */}
    <StaggerItem>
      <div className="frost-card rounded-3xl p-6 sm:p-8 shadow-sm mb-8 tactile-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-ner-black">
              North Eastern Region Patient Cohort
            </h2>
            <p className="text-xs text-ner-black/60 mt-0.5">
              Select any patient to review multi-domain trajectories, observation flags, and clinical notes.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ner-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, state..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-ner-border text-xs focus:outline-none focus:border-ner-black input-smooth"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase font-mono tracking-wider text-ner-black/50 border-b border-ner-border">
              <tr>
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">State / City</th>
                <th className="pb-3 font-semibold">Adherence</th>
                <th className="pb-3 font-semibold">Weekly Score</th>
                <th className="pb-3 font-semibold">Telemetry Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ner-border/60">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPatientModal(p)}
                  className="hover:bg-ner-offwhite/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 flex items-center gap-3">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-9 h-9 rounded-full object-cover border border-ner-border"
                    />
                    <div>
                      <span className="font-bold text-ner-black block group-hover:text-ner-terracotta transition-colors">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-ner-black/50">
                        {p.age} yrs • {p.stage}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-ner-black/70">
                    {p.location}, {p.state}
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-xs font-bold text-ner-black">
                      {p.stats.completedToday} / {p.stats.totalToday} today
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-ner-sage">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {p.stats.weeklyScore}%
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-ner-sage font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-ner-sage"></span>
                      Stable Baseline
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatientModal(p);
                      }}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-ner-black text-white hover:bg-ner-black/85 tactile-btn"
                    >
                      Clinical View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaggerItem>
  </StaggerContainer>

  {/* Patient Detail Modal */}
  <AnimatePresence>
    {selectedPatientModal && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="modal-overlay"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="modal-wrapper border-2 border-ner-black max-w-4xl w-full relative"
        >
            {/* Modal Header */}
            <div className="modal-header flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatientModal.avatarUrl}
                  alt={selectedPatientModal.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-ner-black"
                />
                <div>
                  <h3 className="text-2xl font-bold text-ner-black">
                    {selectedPatientModal.name}
                  </h3>
                  <p className="text-xs text-ner-black/60">
                    Age {selectedPatientModal.age} • {selectedPatientModal.location}, {selectedPatientModal.state} • Stage: {selectedPatientModal.stage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportReport(selectedPatientModal)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-ner-border hover:border-ner-black text-xs font-mono font-bold uppercase flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-ner-terracotta" />
                  <span>Export Report</span>
                </button>
                <button
                  onClick={() => setSelectedPatientModal(null)}
                  className="w-8 h-8 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60 hover:text-ner-black shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body space-y-6">
            {/* Timeframe Selector */}
            <div className="flex items-center justify-between gap-4 mb-6 bg-white p-3 rounded-2xl border border-ner-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ner-black/40" />
                <span className="text-xs font-mono uppercase font-bold text-ner-black/60">Trajectory Timeline:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['7d', '30d', '90d'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                      timeRange === t
                        ? 'bg-ner-black dark:bg-ner-terracotta text-white font-bold'
                        : 'bg-ner-offwhite dark:bg-gray-800 text-ner-black dark:text-white border border-transparent dark:border-gray-700 hover:bg-black/5 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Cognitive Domains Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
              <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
                <Brain className="w-5 h-5 text-ner-terracotta mx-auto mb-1" />
                <span className="text-[10px] font-mono uppercase text-ner-black/40 block">Working Memory</span>
                <span className="text-xl font-bold font-mono text-ner-black">{selectedPatientModal.cognitiveDomains.memory}%</span>
                <span className="text-[10px] font-mono text-ner-sage block mt-0.5">High Stability</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] font-mono uppercase text-ner-black/40 block">Executive Function</span>
                <span className="text-xl font-bold font-mono text-ner-black">{selectedPatientModal.cognitiveDomains.sequence}%</span>
                <span className="text-[10px] font-mono text-ner-sage block mt-0.5">Normal Rhythm</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
                <BookOpen className="w-5 h-5 text-ner-calmBlue mx-auto mb-1" />
                <span className="text-[10px] font-mono uppercase text-ner-black/40 block">Language Recall</span>
                <span className="text-xl font-bold font-mono text-ner-black">92%</span>
                <span className="text-[10px] font-mono text-ner-sage block mt-0.5">Strong Lexical</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-ner-border text-center">
                <Clock className="w-5 h-5 text-ner-sage mx-auto mb-1" />
                <span className="text-[10px] font-mono uppercase text-ner-black/40 block">Processing Speed</span>
                <span className="text-xl font-bold font-mono text-ner-black">2.1s</span>
                <span className="text-[10px] font-mono text-ner-sage block mt-0.5">Consistent</span>
              </div>
            </div>

            {/* Radar & Trend Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Radar */}
              <div className="bg-white p-5 rounded-2xl border border-ner-border">
                <h4 className="font-bold text-sm text-ner-black mb-1">
                  Cognitive Domain Radar
                </h4>
                <p className="text-xs text-ner-black/50 mb-4">
                  Multi-axial balance across 5 monitored dimensions
                </p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={[
                        { subject: 'Memory', score: selectedPatientModal.cognitiveDomains.memory },
                        { subject: 'Attention', score: selectedPatientModal.cognitiveDomains.attention },
                        { subject: 'Recognition', score: selectedPatientModal.cognitiveDomains.recognition },
                        { subject: 'Sequence', score: selectedPatientModal.cognitiveDomains.sequence },
                        { subject: 'Engagement', score: selectedPatientModal.cognitiveDomains.engagement },
                      ]}
                    >
                      <PolarGrid stroke={chartGridColor} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: chartTextColor, fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} stroke={chartTextColor} />
                      <Radar dataKey="score" stroke="#DE4A30" fill="#DE4A30" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Longitudinal Chart */}
              <div className="bg-white p-5 rounded-2xl border border-ner-border flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-ner-black mb-1">
                    Longitudinal Trajectory ({timeRange.toUpperCase()})
                  </h4>
                  <p className="text-xs text-ner-black/50 mb-3">
                    Weekly adherence score over time
                  </p>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                        <XAxis dataKey="period" stroke={chartTextColor} tick={{ fontSize: 10, fill: chartTextColor }} />
                        <YAxis domain={[50, 100]} stroke={chartTextColor} tick={{ fontSize: 10, fill: chartTextColor }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: chartTooltipBg, 
                            border: chartTooltipBorder, 
                            borderRadius: '12px',
                            color: isDark ? '#FFFFFF' : '#111111' 
                          }} 
                        />
                        <Area type="monotone" dataKey="score" stroke="#DE4A30" fill="#DE4A30" fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Observation Flags */}
                <div className="mt-3 pt-3 border-t border-ner-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ner-black/60">Response Time Latency:</span>
                    <span className="font-mono font-bold text-ner-sage">Stable (2.1s avg)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ner-black/60">Diurnal Variance:</span>
                    <span className="font-mono font-bold text-amber-700">Mild 4% evening shift</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ner-black/60">Heritage Imagery Recall:</span>
                    <span className="font-mono font-bold text-ner-sage">88.4% high accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Clinical Notes Space */}
            <div className="bg-white p-5 rounded-2xl border border-ner-border mb-6">
              <h4 className="font-bold text-sm text-ner-black mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-ner-terracotta" />
                <span>Clinician Observations & Care Notes</span>
              </h4>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Record clinical observation or medication advisory..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-ner-offwhite border border-ner-border text-xs focus:outline-none focus:border-ner-black"
                />
                <button
                  onClick={() => handleAddNote(selectedPatientModal.id)}
                  className="px-4 py-2 rounded-xl bg-ner-black text-white text-xs font-mono font-bold uppercase"
                >
                  Save Note
                </button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {(doctorNotes[selectedPatientModal.id] || []).map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-ner-offwhite/70 border border-ner-border text-xs text-ner-black/80 flex items-start gap-2">
                    <span className="text-ner-terracotta font-bold">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            </div>

            {/* Modal Footer: Contacts & Close */}
            <div className="modal-footer flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-ner-black/60 font-mono">
                Primary Contact: {selectedPatientModal.primaryCaregiver.name} ({selectedPatientModal.primaryCaregiver.phone})
              </div>

              <button
                onClick={() => setSelectedPatientModal(null)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-ner-black text-white font-bold text-xs uppercase tracking-wider hover:bg-ner-black/85 tactile-btn"
              >
                Close Record
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};

