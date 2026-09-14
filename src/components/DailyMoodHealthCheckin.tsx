import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from './TTSButton';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import {
  Smile,
  Meh,
  Frown,
  Sun,
  Moon,
  Battery,
  BatteryMedium,
  BatteryFull,
  BatteryLow,
  ShieldAlert,
  HeartPulse,
  Droplets,
  Utensils,
  Pill,
  Sparkles,
  CheckCircle2,
  Edit3,
  Calendar,
  History,
  Activity,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

export type MoodType = 'great' | 'good' | 'okay' | 'tired' | 'worried' | 'unwell';
export type PainLevel = 'none' | 'mild' | 'moderate' | 'severe';
export type SleepQuality = 'restful' | 'average' | 'poor';
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface DailyHealthCheckinData {
  id: string;
  patientId: string;
  patientName: string;
  dateStr: string; // YYYY-MM-DD
  timestamp: string;
  createdAt: number;
  mood: MoodType;
  moodLabel: string;
  energyLevel: EnergyLevel;
  painLevel: PainLevel;
  sleepQuality: SleepQuality;
  habits: {
    hydrated: boolean;
    hadMeal: boolean;
    tookMeds: boolean;
    walked: boolean;
  };
  symptoms: string[];
  note: string;
  syncedToDb: boolean;
}

const STORAGE_KEY = 'neuro_daily_mood_health_checkin';
const HISTORY_STORAGE_KEY = 'neuro_daily_health_history';

export const MOOD_OPTIONS: {
  type: MoodType;
  label: string;
  sublabel: string;
  emoji: string;
  icon: React.FC<{ className?: string }>;
  colorClass: string;
  borderClass: string;
  bgSelectedClass: string;
}[] = [
  {
    type: 'great',
    label: 'Great',
    sublabel: 'Energized & joyful',
    emoji: '😄',
    icon: Sun,
    colorClass: 'text-amber-600',
    borderClass: 'border-amber-300 hover:border-amber-500',
    bgSelectedClass: 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 text-amber-900'
  },
  {
    type: 'good',
    label: 'Good',
    sublabel: 'Peaceful & calm',
    emoji: '🙂',
    icon: Smile,
    colorClass: 'text-emerald-600',
    borderClass: 'border-emerald-300 hover:border-emerald-500',
    bgSelectedClass: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40 text-emerald-900'
  },
  {
    type: 'okay',
    label: 'Okay',
    sublabel: 'Steady & normal',
    emoji: '😐',
    icon: Meh,
    colorClass: 'text-slate-600',
    borderClass: 'border-slate-300 hover:border-slate-500',
    bgSelectedClass: 'bg-slate-100 border-slate-500 ring-2 ring-slate-400/40 text-slate-900'
  },
  {
    type: 'tired',
    label: 'Tired',
    sublabel: 'Low energy / sleepy',
    emoji: '😴',
    icon: Moon,
    colorClass: 'text-indigo-600',
    borderClass: 'border-indigo-300 hover:border-indigo-500',
    bgSelectedClass: 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/40 text-indigo-900'
  },
  {
    type: 'worried',
    label: 'Worried',
    sublabel: 'Uneasy or tense',
    emoji: '😟',
    icon: Frown,
    colorClass: 'text-amber-700',
    borderClass: 'border-amber-400 hover:border-amber-600',
    bgSelectedClass: 'bg-amber-100/70 border-amber-600 ring-2 ring-amber-500/40 text-amber-950'
  },
  {
    type: 'unwell',
    label: 'Unwell',
    sublabel: 'Aches or discomfort',
    emoji: '🤕',
    icon: HeartPulse,
    colorClass: 'text-rose-600',
    borderClass: 'border-rose-300 hover:border-rose-500',
    bgSelectedClass: 'bg-rose-50 border-rose-500 ring-2 ring-rose-400/40 text-rose-950'
  }
];

export const COMMON_SYMPTOMS = [
  'Headache',
  'Joint Pain',
  'Dizziness',
  'Fatigue',
  'Stomach Aches',
  'Feeling Lightheaded',
  'Peaceful Mind',
  'Refreshed'
];

interface DailyMoodHealthCheckinProps {
  onSaved?: (checkin: DailyHealthCheckinData) => void;
  className?: string;
}

export const DailyMoodHealthCheckin: React.FC<DailyMoodHealthCheckinProps> = ({
  onSaved,
  className = ''
}) => {
  const { activePatient, recordCheckIn } = useRole();
  const { t } = useAccessibility();

  const todayStr = new Date().toISOString().split('T')[0];

  // State
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(4);
  const [painLevel, setPainLevel] = useState<PainLevel>('none');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('restful');
  const [hydrated, setHydrated] = useState(true);
  const [hadMeal, setHadMeal] = useState(true);
  const [tookMeds, setTookMeds] = useState(true);
  const [walked, setWalked] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedCheckin, setSavedCheckin] = useState<DailyHealthCheckinData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [pastHistory, setPastHistory] = useState<DailyHealthCheckinData[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load current day's check-in from localStorage or state
  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      const history: DailyHealthCheckinData[] = rawHistory ? JSON.parse(rawHistory) : [];
      setPastHistory(history);

      const todayEntry = history.find(
        (entry) => entry.dateStr === todayStr && entry.patientId === activePatient.id
      );

      if (todayEntry) {
        setSavedCheckin(todayEntry);
        setSelectedMood(todayEntry.mood);
        setEnergyLevel(todayEntry.energyLevel);
        setPainLevel(todayEntry.painLevel);
        setSleepQuality(todayEntry.sleepQuality);
        setHydrated(todayEntry.habits.hydrated);
        setHadMeal(todayEntry.habits.hadMeal);
        setTookMeds(todayEntry.habits.tookMeds);
        setWalked(todayEntry.habits.walked);
        setSelectedSymptoms(todayEntry.symptoms || []);
        setNote(todayEntry.note || '');
      }
    } catch (e) {
      console.warn('Could not load health check-in history:', e);
    }
  }, [activePatient.id, todayStr]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const moodDef = MOOD_OPTIONS.find((m) => m.type === selectedMood) || MOOD_OPTIONS[1];

    const checkinData: DailyHealthCheckinData = {
      id: `checkin-${Date.now()}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      dateStr: todayStr,
      timestamp: timeStr,
      createdAt: Date.now(),
      mood: selectedMood,
      moodLabel: moodDef.label,
      energyLevel,
      painLevel,
      sleepQuality,
      habits: {
        hydrated,
        hadMeal,
        tookMeds,
        walked
      },
      symptoms: selectedSymptoms,
      note: note.trim(),
      syncedToDb: false
    };

    // 1. Save to Local Storage (both current & historical collection)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkinData));
      
      const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      let history: DailyHealthCheckinData[] = rawHistory ? JSON.parse(rawHistory) : [];
      // Replace existing entry for today if editing, or prepend
      history = [checkinData, ...history.filter((h) => !(h.dateStr === todayStr && h.patientId === activePatient.id))];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      setPastHistory(history);
    } catch (err) {
      console.error('Error writing to localStorage:', err);
    }

    // 2. Synchronize to RoleContext
    const mappedMood = selectedMood === 'great' ? 'good' : selectedMood === 'unwell' ? 'sad' : selectedMood;
    recordCheckIn(mappedMood, `Energy: ${energyLevel}/5 | Pain: ${painLevel} | ${note}`);

    // 3. Database Sync (Supabase if available)
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('daily_health_checkins').upsert({
          patient_id: activePatient.id,
          date_str: todayStr,
          mood: selectedMood,
          energy_level: energyLevel,
          pain_level: painLevel,
          sleep_quality: sleepQuality,
          habits: checkinData.habits,
          symptoms: selectedSymptoms,
          notes: note.trim(),
          updated_at: new Date().toISOString()
        });

        if (!error) {
          checkinData.syncedToDb = true;
        }
      } catch (dbErr) {
        console.info('Supabase table daily_health_checkins not ready yet, cached locally:', dbErr);
      }
    }

    setSavedCheckin(checkinData);
    setIsEditing(false);
    setIsSaving(false);
    setFeedbackMessage('Daily Health & Mood Check-in successfully recorded!');
    setTimeout(() => setFeedbackMessage(null), 4000);

    if (onSaved) {
      onSaved(checkinData);
    }
  };

  const getEnergyIcon = (lvl: EnergyLevel) => {
    switch (lvl) {
      case 1:
      case 2:
        return <BatteryLow className="w-5 h-5 text-amber-500" />;
      case 3:
      case 4:
        return <BatteryMedium className="w-5 h-5 text-emerald-500" />;
      case 5:
        return <BatteryFull className="w-5 h-5 text-emerald-600" />;
    }
  };

  // If already checked in today and not currently editing, show the polished summary view
  if (savedCheckin && !isEditing) {
    const moodDef = MOOD_OPTIONS.find((m) => m.type === savedCheckin.mood) || MOOD_OPTIONS[1];
    const MoodIcon = moodDef.icon;

    return (
      <div
        id="daily-health-checkin-summary"
        className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-ner-sage/40 shadow-lg relative overflow-hidden transition-all ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-ner-sage flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-ner-sage font-bold">
                  [ Today's Check-In Complete ]
                </span>
                <span className="text-xs text-slate-400 font-mono">• {savedCheckin.timestamp}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ner-black">
                Daily Mood & Health Status
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TTSButton
              text={`You checked in today feeling ${moodDef.label}, with an energy level of ${savedCheckin.energyLevel} out of 5, and ${savedCheckin.painLevel === 'none' ? 'no physical pain' : savedCheckin.painLevel + ' discomfort'}.`}
              label="Listen"
              size="sm"
            />
            <button
              id="edit-checkin-btn"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-2 transition active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Update
            </button>
            <button
              id="view-history-btn"
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              title="View History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 my-6">
          {/* Mood tile */}
          <div className={`p-4 rounded-2xl border ${moodDef.borderClass} ${moodDef.bgSelectedClass}`}>
            <span className="text-[11px] font-mono uppercase tracking-wider block opacity-75 mb-1">
              Current Mood
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodDef.emoji}</span>
              <span className="font-bold text-lg">{moodDef.label}</span>
            </div>
          </div>

          {/* Energy tile */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider block text-slate-500 mb-1">
              Energy Level
            </span>
            <div className="flex items-center gap-2">
              {getEnergyIcon(savedCheckin.energyLevel)}
              <span className="font-bold text-lg font-mono">{savedCheckin.energyLevel} / 5</span>
            </div>
          </div>

          {/* Physical Comfort */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider block text-slate-500 mb-1">
              Pain / Comfort
            </span>
            <span className="font-bold text-base capitalize flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-ner-sage" />
              {savedCheckin.painLevel === 'none' ? 'Comfortable' : `${savedCheckin.painLevel} Aches`}
            </span>
          </div>

          {/* Sleep */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider block text-slate-500 mb-1">
              Sleep Quality
            </span>
            <span className="font-bold text-base capitalize flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500" />
              {savedCheckin.sleepQuality}
            </span>
          </div>
        </div>

        {/* Habits Checked */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-mono text-slate-400 mr-2">Daily Habits:</span>
          {savedCheckin.habits.hydrated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs rounded-full border border-sky-200 font-medium">
              <Droplets className="w-3.5 h-3.5" /> Hydrated
            </span>
          )}
          {savedCheckin.habits.hadMeal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200 font-medium">
              <Utensils className="w-3.5 h-3.5" /> Meals Taken
            </span>
          )}
          {savedCheckin.habits.tookMeds && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 font-medium">
              <Pill className="w-3.5 h-3.5" /> Medicine Taken
            </span>
          )}
          {savedCheckin.habits.walked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 text-xs rounded-full border border-violet-200 font-medium">
              🚶 Stretched / Walked
            </span>
          )}
          {savedCheckin.note && (
            <span className="text-xs text-slate-600 italic ml-auto max-w-xs truncate">
              "{savedCheckin.note}"
            </span>
          )}
        </div>
      </div>
    );
  }

  // Interactive Check-In Form
  return (
    <div
      id="daily-mood-health-checkin-form"
      className={`frost-white-intense rounded-3xl p-6 sm:p-10 mb-8 border border-ner-border/90 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ner-terracotta" />
            <span className="font-mono text-xs uppercase tracking-widest text-ner-black/60 font-bold">
              [ Daily Wellness Check-In ]
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ner-black">
            How are you feeling right now?
          </h2>
          <p className="text-sm sm:text-base text-ner-black/70">
            A quick 30-second check helps your caregivers and doctor understand how you feel today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TTSButton
            text="How are you feeling right now? Select your mood, energy level, and physical comfort below to complete your daily check-in."
            label="Read Options"
            size="md"
          />
          {pastHistory.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
              title="View past check-ins"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MOOD SELECTION (High tactile icon buttons)                            */}
      {/* ========================================================================= */}
      <div className="mb-8">
        <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-3">
          1. Select Current Mood
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.type;
            const Icon = mood.icon;
            return (
              <button
                key={mood.type}
                id={`mood-btn-${mood.type}`}
                type="button"
                onClick={() => setSelectedMood(mood.type)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[105px] active:scale-95 ${
                  isSelected
                    ? mood.bgSelectedClass
                    : `bg-white/80 ${mood.borderClass} text-slate-700 shadow-sm`
                }`}
              >
                <span className="text-3xl filter drop-shadow-sm">{mood.emoji}</span>
                <div>
                  <span className="font-bold text-sm block leading-tight">{mood.label}</span>
                  <span className="text-[10px] opacity-70 block font-sans">{mood.sublabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HEALTH STATUS MATRIX                                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-slate-200/80">
        {/* Energy Level (1-5 Battery Pills) */}
        <div className="bg-white/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-2 flex items-center justify-between">
            <span>2. Energy Level</span>
            <span className="text-ner-terracotta font-mono font-bold">{energyLevel} / 5</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">How lively do you feel?</p>
          <div className="flex items-center gap-2">
            {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => {
              const active = energyLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergyLevel(level)}
                  className={`flex-1 py-3 rounded-xl font-mono text-sm font-bold border-2 transition active:scale-95 flex flex-col items-center justify-center gap-1 ${
                    active
                      ? 'bg-ner-terracotta text-white border-ner-terracotta shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span>{level}</span>
                  <span className="text-[9px] font-sans font-normal opacity-80">
                    {level === 1 ? 'Low' : level === 3 ? 'Mid' : level === 5 ? 'High' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical Comfort / Pain Level */}
        <div className="bg-white/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-2">
            3. Physical Comfort
          </label>
          <p className="text-xs text-slate-500 mb-3">Any pain or aches?</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'none' as PainLevel, label: 'No Pain', desc: 'Comfortable', color: 'emerald' },
              { id: 'mild' as PainLevel, label: 'Mild', desc: 'Slight ache', color: 'amber' },
              { id: 'moderate' as PainLevel, label: 'Moderate', desc: 'Hurting', color: 'rose' }
            ].map((p) => {
              const active = painLevel === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPainLevel(p.id)}
                  className={`p-2.5 rounded-xl border-2 text-center transition active:scale-95 flex flex-col items-center justify-center ${
                    active
                      ? 'bg-ner-black text-white border-ner-black shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs">{p.label}</span>
                  <span className="text-[9px] opacity-70 mt-0.5">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-white/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-2">
            4. Last Night's Sleep
          </label>
          <p className="text-xs text-slate-500 mb-3">How did you rest?</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'restful' as SleepQuality, label: 'Restful', emoji: '🌟' },
              { id: 'average' as SleepQuality, label: 'Okay', emoji: '💤' },
              { id: 'poor' as SleepQuality, label: 'Restless', emoji: '⚡' }
            ].map((s) => {
              const active = sleepQuality === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSleepQuality(s.id)}
                  className={`p-2.5 rounded-xl border-2 text-center transition active:scale-95 flex flex-col items-center justify-center ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="text-sm">{s.emoji}</span>
                  <span className="font-bold text-xs mt-0.5">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DAILY ROUTINE TOGGLE CHIPS                                             */}
      {/* ========================================================================= */}
      <div className="mb-6">
        <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-2.5">
          5. Daily Habits Check-Off
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setHydrated(!hydrated)}
            className={`px-4 py-2.5 rounded-2xl border-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 ${
              hydrated
                ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Drank Water</span>
            {hydrated && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => setHadMeal(!hadMeal)}
            className={`px-4 py-2.5 rounded-2xl border-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 ${
              hadMeal
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Had Breakfast / Meal</span>
            {hadMeal && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => setTookMeds(!tookMeds)}
            className={`px-4 py-2.5 rounded-2xl border-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 ${
              tookMeds
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Took Morning Meds</span>
            {tookMeds && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => setWalked(!walked)}
            className={`px-4 py-2.5 rounded-2xl border-2 font-medium text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 ${
              walked
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>🚶</span>
            <span>Gentle Walk / Stretches</span>
            {walked && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SYMPTOM QUICK TAGS & NOTE                                              */}
      {/* ========================================================================= */}
      <div className="mb-8">
        <label className="block text-xs font-mono uppercase tracking-wider text-ner-black/70 font-bold mb-2">
          6. Specific Sensations or Feelings (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95 ${
                  isSelected
                    ? 'bg-ner-terracotta text-white border-ner-terracotta shadow-sm'
                    : 'bg-white/80 text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                {symptom}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a quick note for your caregiver or doctor (e.g. 'Feeling peaceful today, ready for the garden')..."
          className="w-full px-4 py-3 bg-white rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-ner-terracotta/40 text-sm text-slate-800 placeholder-slate-400 shadow-inner"
        />
      </div>

      {/* ========================================================================= */}
      {/* 5. SUBMIT ACTION BUTTON                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ThumbsUp className="w-4 h-4 text-ner-sage" />
          <span>Saves directly to your local health logs &amp; notifies caregivers.</span>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-mono text-xs uppercase font-bold tracking-wider transition"
            >
              Cancel
            </button>
          )}

          <button
            id="save-daily-checkin-btn"
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 rounded-2xl bg-ner-terracotta hover:bg-ner-terracottaDark text-white font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-ner-terracotta/25 transition active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSaving ? 'Saving Check-In...' : 'Save Health Check-In'}</span>
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-ner-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-ner-terracotta" />
                <h3 className="text-xl font-bold text-ner-black">Past Health Check-Ins</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {pastHistory.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-sm">No recorded check-ins yet.</p>
            ) : (
              <div className="space-y-3">
                {pastHistory.map((item) => {
                  const m = MOOD_OPTIONS.find((opt) => opt.type === item.mood) || MOOD_OPTIONS[1];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{m.emoji}</span>
                          <span className="font-bold text-sm text-slate-900">{m.label}</span>
                          <span className="text-xs text-slate-400 font-mono">• {item.dateStr}</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                          Energy {item.energyLevel}/5
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                        <span>Comfort: <b>{item.painLevel}</b></span>
                        <span>•</span>
                        <span>Sleep: <b>{item.sleepQuality}</b></span>
                        {item.symptoms && item.symptoms.length > 0 && (
                          <>
                            <span>•</span>
                            <span>Tags: {item.symptoms.join(', ')}</span>
                          </>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-xs italic text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
