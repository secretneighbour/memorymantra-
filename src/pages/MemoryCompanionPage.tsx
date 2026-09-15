import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { initialPinnedMemories, initialMemoryNotes } from '../data/reminders';
import { TTSButton } from '../components/TTSButton';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Pin, 
  FileText, 
  Sparkles, 
  X,
  Volume2,
  Trash2,
  Bot
} from 'lucide-react';
import { MemoryNote } from '../types';

export const MemoryCompanionPage: React.FC = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder, setIsAICompanionOpen } = useRole();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newCategory, setNewCategory] = useState<'medication' | 'exercise' | 'meal' | 'family' | 'walk' | 'other'>('medication');
  const [newNote, setNewNote] = useState('');

  const [pinnedList, setPinnedList] = useState(initialPinnedMemories);
  const [memoryNotes, setMemoryNotes] = useState<MemoryNote[]>(initialMemoryNotes);

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder({
      title: newTitle,
      time: newTime,
      category: newCategory,
      doseOrNote: newNote || undefined,
      priority: 'normal',
    });

    setNewTitle('');
    setNewNote('');
    setIsAddModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const noteItem: MemoryNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      date: 'Just now',
      pinned: false
    };

    setMemoryNotes([noteItem, ...memoryNotes]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const fullScheduleSpeechText = `Here is your schedule for today. You have ${reminders.length} items. ${reminders
    .map(
      (r, i) =>
        `Item ${i + 1}: ${r.time}, ${r.title}. ${r.doseOrNote ? 'Note: ' + r.doseOrNote + '.' : ''} ${
          r.completed ? 'This activity is completed.' : 'This activity is pending.'
        }`
    )
    .join(' ')}`;

  const pinnedMemoriesSpeechText = `Here are your pinned things to remember. ${pinnedList
    .map((p) => `${p.tag}: ${p.text}.`)
    .join(' ')}`;

  const memoryNotesSpeechText = `Here are your personal memory notes. ${memoryNotes
    .map((n) => `${n.title}: ${n.content}.`)
    .join(' ')}`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
              Personal Memory Aid
            </span>
            <span className="text-xs text-ner-black/40 font-mono">Daily Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Your Memory Companion
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            A peaceful daily timeline, personal notes, and reminders to anchor your day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TTSButton
            text="Welcome to your Memory Companion. Review today's schedule, add a reminder, or listen to your memory notes."
            label="Listen"
            size="lg"
          />
          <button
            onClick={() => setIsAICompanionOpen(true)}
            className="px-5 py-3 rounded-full bg-ner-terracotta/15 text-ner-terracotta hover:bg-ner-terracotta/25 border border-ner-terracotta/30 font-semibold text-sm flex items-center gap-2 shadow-xs active:scale-95 shrink-0 transition"
          >
            <Bot className="w-4 h-4" />
            <span>AI Voice Chat</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-full bg-ner-black text-white hover:bg-ner-black/85 font-semibold text-sm flex items-center gap-2 shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-ner-terracotta" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Today's Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-ner-border">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-ner-terracotta" />
                <h2 className="text-xl font-bold text-ner-black">Today's Schedule</h2>
                <span className="text-xs font-mono text-ner-black/50 ml-2">
                  {reminders.filter(r => r.completed).length} of {reminders.length} Done
                </span>
              </div>
              <TTSButton
                text={fullScheduleSpeechText}
                label="Read Schedule"
                size="sm"
              />
            </div>

            {/* List */}
            <div className="space-y-3.5">
              {reminders.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleReminder(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    item.completed
                      ? 'bg-white/40 border-ner-border/50 opacity-65'
                      : 'bg-white border-ner-border hover:border-ner-black/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReminder(item.id);
                      }}
                      className="mt-0.5"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-ner-sage fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-ner-black/30 hover:text-ner-black" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-ner-offwhite border border-ner-border text-ner-black">
                          {item.time}
                        </span>
                        <h3 className={`font-bold text-base ${item.completed ? 'line-through text-ner-black/50' : 'text-ner-black'}`}>
                          {item.title}
                        </h3>
                      </div>
                      {item.doseOrNote && (
                        <p className="text-xs text-ner-black/60 mt-1 pl-0.5">
                          {item.doseOrNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <TTSButton
                      text={`Reminder at ${item.time}: ${item.title}. ${item.doseOrNote || ''} Status: ${item.completed ? 'completed' : 'not yet completed'}.`}
                      size="sm"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReminder(item.id);
                      }}
                      className="text-ner-black/30 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-black/5"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Things to Remember Pinboard */}
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Pin className="w-5 h-5 text-ner-terracotta" />
                <h2 className="text-xl font-bold text-ner-black">Things to Remember</h2>
              </div>
              <TTSButton
                text={pinnedMemoriesSpeechText}
                label="Read All Facts"
                size="sm"
              />
            </div>
            <p className="text-xs text-ner-black/60 mb-6">
              Essential personal facts pinned for effortless daily recall.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pinnedList.map((pin) => (
                <div
                  key={pin.id}
                  className="p-4 rounded-2xl bg-white border border-ner-border shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ner-terracotta">
                        {pin.tag}
                      </span>
                      <TTSButton
                        text={`${pin.tag}: ${pin.text}`}
                        size="sm"
                      />
                    </div>
                    <p className="font-bold text-sm text-ner-black leading-snug">
                      {pin.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Memory Notes & Voice Journal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="frost-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-ner-sage" />
                <h2 className="text-xl font-bold text-ner-black">Memory Notes</h2>
              </div>
              <TTSButton
                text={memoryNotesSpeechText}
                label="Read Notes"
                size="sm"
              />
            </div>
            <p className="text-xs text-ner-black/60 mb-6">
              Comforting thoughts, family recipes, and cherished details.
            </p>

            {/* Quick add note */}
            <form onSubmit={handleAddNote} className="mb-6 p-4 rounded-2xl bg-white border border-ner-border space-y-3">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title (e.g. Grandma's chai recipe)"
                className="w-full text-xs font-bold p-2.5 bg-ner-offwhite border border-ner-border rounded-xl focus:outline-none focus:border-ner-black"
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write memory detail..."
                rows={2}
                className="w-full text-xs p-2.5 bg-ner-offwhite border border-ner-border rounded-xl focus:outline-none focus:border-ner-black"
              />
              <button
                type="submit"
                disabled={!newNoteTitle.trim()}
                className="w-full py-2 rounded-xl bg-ner-black text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                Save Memory Note
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {memoryNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-white border border-ner-border shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-ner-black">{note.title}</h4>
                    <span className="text-[10px] font-mono text-ner-black/40">{note.date}</span>
                  </div>
                  <p className="text-xs text-ner-black/70 leading-relaxed mt-1 mb-2">
                    {note.content}
                  </p>
                  <div className="flex justify-end pt-1 border-t border-ner-border/40">
                    <TTSButton
                      text={`Memory note: ${note.title}. ${note.content}`}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-ner-black">Add Reminder</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5 text-ner-black/60" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Evening Walk or Eye Drops"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 06:00 PM"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-ner-black/70 uppercase block mb-1">
                  Note / Instruction (Optional)
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Take with warm water"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-ner-border text-sm focus:outline-none focus:border-ner-black"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-ner-border bg-white text-ner-black font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-ner-black text-white font-semibold text-sm hover:bg-ner-black/85"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
