import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { TTSButton } from '../components/TTSButton';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Pill, 
  Dumbbell, 
  Utensils, 
  Phone, 
  Footprints, 
  Volume2,
  Trash2,
  Filter
} from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useRole();
  const { t } = useAccessibility();
  const [filter, setFilter] = useState<'all' | 'medication' | 'exercise' | 'meal' | 'family'>('all');
  const [chimePlayed, setChimePlayed] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return <Pill className="w-4 h-4 text-red-500" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-emerald-600" />;
      case 'meal': return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'family': return <Phone className="w-4 h-4 text-blue-500" />;
      default: return <Footprints className="w-4 h-4 text-ner-black" />;
    }
  };

  const playSimulatedChime = (title: string) => {
    setChimePlayed(title);
    // Beep / Web Audio chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}

    setTimeout(() => setChimePlayed(null), 3000);
  };

  const filtered = reminders.filter(r => {
    if (filter === 'all') return true;
    return r.category === filter;
  });

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-sage/10 text-ner-sage font-bold">
              {t.remindersPageBadge}
            </span>
            <span className="text-xs text-ner-black/40 font-mono">{t.remindersPageSubBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.remindersPageHeading}
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            {t.remindersPageSubheading}
          </p>
        </div>

        <TTSButton
          text={`${t.remindersPageHeading}. ${t.remindersPageSubheading}`}
          label={t.listenAloud}
          size="lg"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-ner-black/50 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> {t.remindersFilterBy}
        </span>
        {([
          { id: 'all', label: t.all },
          { id: 'medication', label: t.remindersFilterMed },
          { id: 'exercise', label: t.remindersFilterEx },
          { id: 'meal', label: t.remindersFilterMeal },
          { id: 'family', label: t.remindersFilterFam }
        ] as const).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`text-xs px-4 py-2 rounded-full border transition-all font-semibold capitalize ${
              filter === cat.id
                ? 'bg-ner-black text-white border-ner-black shadow-sm'
                : 'bg-white text-ner-black/70 border-ner-border hover:border-ner-black/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleReminder(item.id)}
            className={`frost-card rounded-3xl p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-ner-black/50 ${
              item.completed ? 'opacity-65 bg-white/40' : 'shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReminder(item.id);
                }}
                className="mt-1 shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-7 h-7 text-ner-sage fill-emerald-100" />
                ) : (
                  <Circle className="w-7 h-7 text-ner-black/30 hover:text-ner-black" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border font-bold text-ner-black">
                    {getCategoryIcon(item.category)}
                    {item.time}
                  </span>
                  <span className="text-xs uppercase font-mono tracking-wider text-ner-black/40">
                    {item.category}
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                  {item.title}
                </h3>
                {item.doseOrNote && (
                  <p className="text-xs text-ner-black/60 mt-0.5">{item.doseOrNote}</p>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSimulatedChime(item.title);
                }}
                className="px-3 py-1.5 rounded-full border border-ner-border bg-white hover:bg-black/5 text-xs font-semibold text-ner-black inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                title={t.remindersTestChime}
              >
                <Bell className="w-3.5 h-3.5 text-ner-terracotta" />
                <span>{t.remindersTestChime}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReminder(item.id);
                }}
                className="p-2 rounded-full hover:bg-black/5 text-ner-black/40 hover:text-red-600 transition-colors"
                title={t.remindersDeletePrompt}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Chime Toast */}
      {chimePlayed && (
        <div className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-ner-black text-white shadow-2xl border border-ner-terracotta flex items-center gap-3 animate-fade-in">
          <div className="p-2 rounded-xl bg-ner-terracotta/20 text-ner-terracotta">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-ner-terracotta">
              {t.remindersChimeTriggered}
            </h4>
            <p className="text-sm font-semibold">{chimePlayed}</p>
          </div>
        </div>
      )}
    </div>
  );
};
