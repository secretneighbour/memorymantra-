import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  Calendar,
  Smile,
  Send,
  Bell
} from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { activePatient, reminders, toggleReminder } = useRole();

  const [moodStatus, setMoodStatus] = useState<'Peaceful' | 'Cheerful' | 'Tired' | 'Restless'>('Peaceful');
  const [caregiverNotes, setCaregiverNotes] = useState<string[]>([
    "Mother enjoyed the afternoon word association game today.",
    "Dr. Roy confirmed Monday morning review appointment.",
    "Neighborhood walk went smoothly with walking stick."
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  const handleAddCareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setCaregiverNotes([newNoteInput, ...caregiverNotes]);
    setNewNoteInput('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
              Family & Guardian Portal
            </span>
            <span className="text-xs text-ner-black/40 font-mono">Care Circle</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Care Circle
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            Real-time activity telemetry, medication adherence, and wellbeing indicators for Ananya Sharma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-ner-sage text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-ner-sage animate-ping"></span>
            Active 12m ago
          </span>
          <Link
            to="/patient-profile"
            className="px-5 py-2.5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-semibold"
          >
            Patient Profile
          </Link>
        </div>
      </div>

      {/* Patient Highlight Banner */}
      <div className="frost-card rounded-3xl p-6 sm:p-8 mb-8 border-2 border-ner-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ner-terracotta/20 text-ner-terracotta font-extrabold text-2xl flex items-center justify-center border border-ner-terracotta/30">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-ner-black">{activePatient.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border text-ner-black/70">
                  Age {activePatient.age}
                </span>
              </div>
              <p className="text-xs text-ner-black/60 mt-0.5">
                {activePatient.location}, {activePatient.state} • Stage: {activePatient.stage}
              </p>
              <p className="text-xs text-ner-terracotta font-medium mt-1">
                Primary Guardian: {activePatient.primaryCaregiver.name} ({activePatient.primaryCaregiver.relation})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-ner-border">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-mono text-ner-black/40 block">Today's Progress</span>
              <span className="text-xl font-bold text-ner-black">
                {activePatient.stats.completedToday} / {activePatient.stats.totalToday} Tasks
              </span>
            </div>
            <div className="h-8 w-px bg-ner-border"></div>
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-mono text-ner-black/40 block">Weekly Score</span>
              <span className="text-xl font-bold text-ner-terracotta font-mono">
                {activePatient.stats.weeklyScore}%
              </span>
            </div>
            <div className="h-8 w-px bg-ner-border"></div>
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-mono text-ner-black/40 block">Engagement</span>
              <span className="text-xl font-bold text-ner-sage font-mono">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Today's Activity & Reminder Status */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Cognitive Exercises */}
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ner-border">
              <h3 className="font-bold text-lg text-ner-black flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-ner-sage" />
                Today's Activity Telemetry
              </h3>
              <span className="text-xs font-mono text-ner-black/50">Live Sync</span>
            </div>

            <div className="space-y-3">
              {activePatient.recentActivities.map((act) => (
                <div key={act.id} className="p-4 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ner-black">{act.title}</h4>
                    <span className="text-xs text-ner-black/50 font-mono">
                      Completed: {act.completedAt} • {act.durationMinutes} minutes
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-ner-terracotta bg-ner-terracotta/10 px-2.5 py-1 rounded-full">
                    Score: {act.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Status */}
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ner-border">
              <h3 className="font-bold text-lg text-ner-black flex items-center gap-2">
                <Clock className="w-5 h-5 text-ner-terracotta" />
                Reminder & Medication Adherence
              </h3>
              <Link to="/reminders" className="text-xs font-mono text-ner-terracotta font-bold hover:underline">
                Manage All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div key={rem.id} className="p-3.5 rounded-2xl bg-white border border-ner-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border">
                      {rem.time}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-ner-black block">{rem.title}</span>
                      {rem.doseOrNote && (
                        <span className="text-[11px] text-ner-black/50">{rem.doseOrNote}</span>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    rem.completed 
                      ? 'bg-emerald-100 text-ner-sage' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rem.completed ? 'Confirmed Taken' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Mood / Wellbeing & Family Messages */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mood / Wellbeing Check-in */}
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="w-5 h-5 text-ner-warmAmber" />
              <h3 className="font-bold text-lg text-ner-black">Mood & Wellbeing Check-In</h3>
            </div>
            <p className="text-xs text-ner-black/60 mb-4">
              Current reported emotional state during daily check-in.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['Peaceful', 'Cheerful', 'Tired', 'Restless'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMoodStatus(m)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    moodStatus === m
                      ? 'bg-ner-black text-white border-ner-black shadow-sm'
                      : 'bg-white text-ner-black border-ner-border hover:border-ner-black/40'
                  }`}
                >
                  {m === 'Peaceful' && '🌿 '}
                  {m === 'Cheerful' && '☀️ '}
                  {m === 'Tired' && '🌙 '}
                  {m === 'Restless' && '⚡ '}
                  {m}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white rounded-xl border border-ner-border text-xs text-ner-black/70">
              Status updated by Rohan Sharma: <span className="font-bold text-ner-black">{moodStatus}</span>
            </div>
          </div>

          {/* Family Circle Message Notes */}
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-ner-calmBlue" />
              <h3 className="font-bold text-lg text-ner-black">Family Circle Notes</h3>
            </div>
            <p className="text-xs text-ner-black/60 mb-4">
              Broadcast encouraging messages or coordination updates.
            </p>

            <form onSubmit={handleAddCareNote} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Add update for the family..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-ner-border text-xs focus:outline-none focus:border-ner-black"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-ner-black text-white text-xs font-bold uppercase tracking-wider"
              >
                Post
              </button>
            </form>

            <div className="space-y-2.5">
              {caregiverNotes.map((n, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-ner-border text-xs text-ner-black/80 leading-relaxed">
                  "{n}"
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
