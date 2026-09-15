import React, { useState, useRef } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Pill, 
  Droplet, 
  Calendar, 
  Check, 
  Clock, 
  AlertCircle, 
  Bell,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ReminderItem {
  id: string;
  type: 'MEDICINE' | 'HYDRATION' | 'APPOINTMENT';
  time: string;
  title: string;
  subtitle: string;
  priority: 'high' | 'normal';
  icon: React.ReactNode;
  status: 'due' | 'done' | 'snoozed';
}

export const InteractiveReminderSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playCalmingChime, speakText, motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 'r1',
      type: 'MEDICINE',
      time: '10:00 AM',
      title: 'Blood Pressure & Heart Tablet',
      subtitle: 'Take 1 tablet with lukewarm water after breakfast',
      priority: 'high',
      icon: <Pill className="w-5 h-5 text-ner-terracotta" />,
      status: 'due',
    },
    {
      id: 'r2',
      type: 'HYDRATION',
      time: '12:30 PM',
      title: 'Fresh Water & Herbal Infusion',
      subtitle: 'Midday hydration (1 full glass of water or mild lemon tea)',
      priority: 'normal',
      icon: <Droplet className="w-5 h-5 text-ner-sage" />,
      status: 'due',
    },
    {
      id: 'r3',
      type: 'APPOINTMENT',
      time: '03:00 PM',
      title: 'Dr. Baruah Clinic Check-in & Memory Stroll',
      subtitle: 'Routine wellness consultation & garden walk with daughter',
      priority: 'normal',
      icon: <Calendar className="w-5 h-5 text-ner-calmBlue" />,
      status: 'due',
    },
  ]);

  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: 'done' | 'snooze' | 'help') => {
    if (action === 'done') {
      playCalmingChime();
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'done' } : r))
      );
      setActiveMessage('Great job! Reminder marked as completed.');
      speakText('Completed. Fantastic work staying on schedule today.');
    } else if (action === 'snooze') {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'snoozed' } : r))
      );
      setActiveMessage('Reminder snoozed for 15 minutes.');
    } else if (action === 'help') {
      setActiveMessage('Caregiver notified. Support is on the way.');
      speakText('Caregiver notification sent. Your family circle has been alerted.');
    }
  };

  return (
    <section
      ref={containerRef}
      id="smart-reminders"
      className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40 select-none"
    >
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
          [ 07 // CHRONO ORIENTATION ]
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
          Smart Reminders
        </h2>
        <p className="text-sm sm:text-base text-ner-black/70 font-light mt-3 max-w-2xl mx-auto leading-relaxed">
          Tactile, high-contrast reminder cues with large accessible action targets, ensuring crucial daily routines and hydration are maintained without anxiety.
        </p>
      </div>

      {/* Main Interactive Reminders Stack */}
      <div className="max-w-4xl mx-auto space-y-6">
        {reminders.map((rem, index) => {
          const isDue = rem.status === 'due';
          const isDone = rem.status === 'done';
          const isHighPriority = rem.priority === 'high' && isDue;

          return (
            <motion.div
              key={rem.id}
              initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50/70 border-2 border-emerald-300 text-ner-black opacity-80'
                  : isHighPriority
                  ? 'frost-white-intense border-2 border-ner-terracotta shadow-2xl scale-101'
                  : 'frost-white-intense border border-ner-border/90 shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left: Time & Information */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : isHighPriority
                        ? 'bg-ner-terracotta/10 text-ner-terracotta'
                        : 'bg-ner-offwhite text-ner-black'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : rem.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-ner-black/50">
                        {rem.type}
                      </span>
                      <span className="text-ner-black/30">•</span>
                      <span
                        className={`font-mono text-sm font-bold ${
                          isHighPriority ? 'text-ner-terracotta' : 'text-ner-black'
                        }`}
                      >
                        {rem.time}
                      </span>
                      {isHighPriority && (
                        <span className="px-2 py-0.5 rounded-full bg-ner-terracotta text-white font-mono text-[10px] font-bold uppercase animate-pulse">
                          ACTIVE DUE
                        </span>
                      )}
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-ner-black tracking-tight">
                      {rem.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-ner-black/70 mt-1 leading-relaxed">
                      {rem.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right: Large Accessible Action Targets */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  {isDone ? (
                    <div className="h-12 px-6 rounded-2xl bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                      <Check className="w-4 h-4" />
                      <span>Recorded</span>
                    </div>
                  ) : (
                    <>
                      {/* DONE Button */}
                      <button
                        onClick={() => handleAction(rem.id, 'done')}
                        className="h-12 px-6 sm:px-8 rounded-2xl bg-ner-black hover:bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                        title="Mark Reminder as Done"
                      >
                        <Check className="w-4 h-4" />
                        <span>DONE</span>
                      </button>

                      {/* REMIND ME LATER Button */}
                      <button
                        onClick={() => handleAction(rem.id, 'snooze')}
                        className="h-12 px-4 sm:px-5 rounded-2xl frost-white-intense hover:border-ner-black text-ner-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                        title="Snooze Reminder for 15 Minutes"
                      >
                        <Clock className="w-4 h-4 text-ner-black/60" />
                        <span className="hidden sm:inline">REMIND ME LATER</span>
                        <span className="sm:hidden">SNOOZE</span>
                      </button>

                      {/* I NEED HELP Button */}
                      <button
                        onClick={() => handleAction(rem.id, 'help')}
                        className="h-12 px-4 sm:px-5 rounded-2xl bg-ner-terracotta/10 hover:bg-ner-terracotta hover:text-white text-ner-terracotta border border-ner-terracotta/30 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                        title="Alert Family & Caregiver"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">I NEED HELP</span>
                        <span className="sm:hidden">HELP</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Action feedback banner */}
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-ner-black text-white text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <span>{activeMessage}</span>
            <button
              onClick={() => setActiveMessage(null)}
              className="text-white/60 hover:text-white underline text-[10px]"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
