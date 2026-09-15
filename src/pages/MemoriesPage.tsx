import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { MemoryItem, FamilyMember } from '../types';
import { TTSButton } from '../components/TTSButton';
import { 
  Heart, 
  Image as ImageIcon, 
  BookOpen, 
  Music, 
  Phone, 
  Video, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Pin,
  Calendar,
  MessageCircle,
  X,
  Upload
} from 'lucide-react';

export const MemoriesPage: React.FC = () => {
  const { memories, familyMembers, activePatient, addMemoryItem, sendHelpAlert } = useRole();
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'family' | 'stories' | 'songs' | 'therapy'>('all');
  
  // State for Personal Memory Therapy interactive mode
  const [activeTherapyMemory, setActiveTherapyMemory] = useState<MemoryItem | null>(null);
  const [therapyQuestionIdx, setTherapyQuestionIdx] = useState(0);
  const [selectedTherapyAnswer, setSelectedTherapyAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [showStoryDetail, setShowStoryDetail] = useState(false);

  // Quick call simulation state
  const [callingContact, setCallingContact] = useState<FamilyMember | null>(null);

  // New memory modal
  const [isNewMemoryModalOpen, setIsNewMemoryModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPersonPlace, setNewPersonPlace] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('family');

  const filteredMemories = memories.filter(m => {
    if (activeTab === 'all') return true;
    if (activeTab === 'photos') return m.imageUrl !== undefined;
    if (activeTab === 'stories') return m.category === 'story';
    if (activeTab === 'songs') return m.category === 'song';
    return true;
  });

  const handleStartTherapy = (mem: MemoryItem) => {
    setActiveTherapyMemory(mem);
    setTherapyQuestionIdx(0);
    setSelectedTherapyAnswer(null);
    setIsAnswerRevealed(false);
    setShowStoryDetail(false);
    setActiveTab('therapy');
  };

  const handleSelectImage = async () => {
    // If running in Electron desktop app, use native file picker dialog
    if (window.electronAPI?.selectImageFile) {
      try {
        setIsSelectingImage(true);
        const res = await window.electronAPI.selectImageFile();
        if (!res.canceled && res.dataBase64) {
          // Save to native safe media directory
          const saveRes = await window.electronAPI.saveMemoryMedia({
            fileName: res.fileName || 'memory.jpg',
            dataBase64: res.dataBase64,
          });
          if (saveRes.success && saveRes.filePath) {
            setNewImageUrl(res.dataBase64);
          } else {
            setNewImageUrl(res.dataBase64);
          }
        }
      } catch (err) {
        console.error('Failed to open native dialog', err);
      } finally {
        setIsSelectingImage(false);
      }
    } else {
      // Fallback for standard web browser
      const input = document.getElementById('web-memory-file-input') as HTMLInputElement;
      if (input) input.click();
    }
  };

  const handleWebFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addMemoryItem({
      title: newTitle,
      personOrPlace: newPersonPlace || 'Guwahati Home',
      category: newCategory,
      storyText: newStory || 'A special moment with family.',
      imageUrl: newImageUrl || undefined,
      pinned: false,
      dateOrYear: 'Recently added'
    });

    setNewTitle('');
    setNewPersonPlace('');
    setNewStory('');
    setNewImageUrl('');
    setIsNewMemoryModalOpen(false);
  };

  const handleSimulatedCall = (fam: FamilyMember, mode: 'call' | 'video') => {
    setCallingContact(fam);
    sendHelpAlert(`Patient connected with ${fam.name} via simulated ${mode}.`);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in">
      {/* Top Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-bold block mb-1">
            [ Personal Memory Vault & Family Circle ]
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-ner-black">My Cherished Memories</h1>
          <p className="text-sm sm:text-base text-ner-black/70 mt-1 max-w-xl">
            A secure, soothing archive of your life’s favorite moments, loved family members, and comforting songs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TTSButton
            text="Welcome to your Memory Vault. Here you can see your family members, treasured photos, and remember wonderful moments together."
            label="Listen"
          />
          <button
            onClick={() => setIsNewMemoryModalOpen(true)}
            className="h-12 px-5 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-ner-sage" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {[
          { id: 'all', label: 'All Memories', icon: Heart },
          { id: 'photos', label: 'Photos & Places', icon: ImageIcon },
          { id: 'family', label: 'Family Circle', icon: Heart },
          { id: 'stories', label: 'Life Stories', icon: BookOpen },
          { id: 'songs', label: 'Beloved Songs', icon: Music },
          { id: 'therapy', label: 'Memory Game Mode', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'therapy' && !activeTherapyMemory) {
                  setActiveTherapyMemory(memories[0]);
                }
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all border ${
                isActive
                  ? 'bg-ner-black text-white border-ner-black shadow-md'
                  : 'bg-white text-ner-black/70 border-ner-border hover:border-ner-black/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-ner-sage' : 'text-ner-black/40'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. FAMILY CIRCLE TAB */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-3 bg-white rounded-2xl shadow-sm">👨‍👩‍👧</span>
              <div>
                <h3 className="text-xl font-bold text-ner-black">Your Family Circle</h3>
                <p className="text-xs sm:text-sm text-ner-black/70">
                  Tap any contact to start a friendly video call or talk immediately.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-white text-rose-700 border border-rose-200">
              {familyMembers.length} Family Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="frost-card rounded-3xl p-6 border-2 border-ner-border shadow-md flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:border-ner-black/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-bold block">
                      {member.relation}
                    </span>
                    <h4 className="text-xl font-bold text-ner-black">{member.name}</h4>
                    <p className="text-xs text-ner-black/60 italic mt-0.5">{member.notes}</p>
                    <span className="text-xs font-mono text-ner-black/40 block mt-1">
                      {member.location}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleSimulatedCall(member, 'call')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-ner-black text-white hover:bg-ner-black/80 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-ner-sage" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleSimulatedCall(member, 'video')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-ner-border text-ner-black hover:border-ner-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5 text-ner-terracotta" />
                    <span>Video</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ADAPTIVE PERSONAL MEMORY THERAPY / GAME MODE */}
      {activeTab === 'therapy' && activeTherapyMemory && (
        <div className="frost-card rounded-3xl p-6 sm:p-10 border-2 border-ner-border shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ner-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-1">
                Personal Memory Therapy Mode
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-ner-black">
                {activeTherapyMemory.title}
              </h3>
            </div>
            <TTSButton
              text={`Do you remember this memory? ${activeTherapyMemory.storyText}`}
              label="Read Memory"
            />
          </div>

          {/* Photo & location header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 items-center">
            {activeTherapyMemory.imageUrl && (
              <div className="relative rounded-3xl overflow-hidden border-2 border-ner-border shadow-md">
                <img
                  src={activeTherapyMemory.imageUrl}
                  alt={activeTherapyMemory.title}
                  className="w-full h-64 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-ner-black/75 backdrop-blur-sm text-white font-mono text-xs">
                  📍 {activeTherapyMemory.personOrPlace}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-ner-border shadow-sm">
                <span className="text-xs font-mono uppercase text-ner-black/50 font-bold block mb-1">
                  Memory Clue
                </span>
                <p className="text-base sm:text-lg text-ner-black/80 font-serif leading-relaxed italic">
                  "{activeTherapyMemory.storyText}"
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-mono text-ner-black/60">
                  <Calendar className="w-3.5 h-3.5 text-ner-terracotta" />
                  <span>{activeTherapyMemory.dateOrYear || 'Cherished Season'}</span>
                </div>
              </div>

              {/* Trivia Question if available */}
              {activeTherapyMemory.triviaQuestions && activeTherapyMemory.triviaQuestions.length > 0 && (
                <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-amber-800" />
                    <h4 className="text-base font-bold text-amber-900">
                      {activeTherapyMemory.triviaQuestions[therapyQuestionIdx].question}
                    </h4>
                  </div>

                  <div className="space-y-2.5 mt-3">
                    {activeTherapyMemory.triviaQuestions[therapyQuestionIdx].options.map((opt) => {
                      const currentQ = activeTherapyMemory.triviaQuestions![therapyQuestionIdx];
                      const isCorrect = opt === currentQ.correctAnswer;
                      const isSelected = selectedTherapyAnswer === opt;
                      let btnStyle = 'bg-white border-amber-200 text-ner-black hover:border-amber-400';

                      if (isSelected) {
                        btnStyle = 'bg-amber-900 text-white border-amber-900';
                      }
                      if (isAnswerRevealed) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-ner-sage text-ner-sage font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-300 text-red-600 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isAnswerRevealed}
                          onClick={() => {
                            setSelectedTherapyAnswer(opt);
                            setIsAnswerRevealed(true);
                          }}
                          className={`w-full p-4 rounded-xl border text-left font-bold text-sm flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-ner-sage" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Therapy Controls */}
          <div className="mt-8 pt-6 border-t border-ner-border flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-mono text-ner-black/50">
              Gentle reminiscence anchors identity and episodic recall
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const idx = memories.findIndex(m => m.id === activeTherapyMemory.id);
                  const nextMem = memories[(idx + 1) % memories.length];
                  handleStartTherapy(nextMem);
                }}
                className="h-12 px-6 rounded-xl bg-ner-black text-white hover:bg-ner-black/85 font-mono text-xs uppercase tracking-wider shadow-sm"
              >
                Next Cherished Memory →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. STANDARD MEMORY CARDS (ALL, PHOTOS, STORIES, SONGS) */}
      {activeTab !== 'family' && activeTab !== 'therapy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="frost-card rounded-3xl border-2 border-ner-border overflow-hidden shadow-md hover:border-ner-black/40 transition-all flex flex-col justify-between group"
            >
              {mem.imageUrl && (
                <div className="relative h-48 sm:h-52 overflow-hidden bg-ner-offwhite">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {mem.pinned && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-ner-black/75 backdrop-blur-sm text-white text-[11px] font-mono flex items-center gap-1">
                      <Pin className="w-3 h-3 text-ner-sage" /> Pinned
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-ner-black/75 backdrop-blur-sm text-white text-[11px] font-mono">
                    {mem.personOrPlace}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-ner-terracotta font-bold">
                      {mem.category}
                    </span>
                    {mem.dateOrYear && (
                      <span className="text-[11px] font-mono text-ner-black/40">
                        {mem.dateOrYear}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-ner-black mb-2">{mem.title}</h4>
                  <p className="text-sm text-ner-black/70 line-clamp-3 leading-relaxed">
                    {mem.storyText}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-ner-border/60 flex items-center justify-between">
                  <TTSButton text={mem.storyText} label="Listen" />
                  <button
                    onClick={() => handleStartTherapy(mem)}
                    className="px-3.5 py-2 rounded-xl bg-ner-black text-white hover:bg-ner-black/80 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ner-sage" />
                    <span>Memory Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Call Modal */}
      {callingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative">
            <button
              onClick={() => setCallingContact(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={callingContact.avatarUrl}
              alt={callingContact.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-ner-sage mx-auto mb-4 animate-pulse"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-mono uppercase tracking-widest text-ner-sage font-bold block mb-1">
              [ Connecting Family Call ]
            </span>
            <h3 className="text-2xl font-bold text-ner-black">{callingContact.name}</h3>
            <p className="text-xs text-ner-black/60 font-mono mt-1">{callingContact.phone}</p>
            <p className="text-sm text-ner-black/80 mt-4 leading-relaxed bg-white p-4 rounded-2xl border border-ner-border">
              "Ring, ring... Connecting to {callingContact.name}. A notification has also been sent to their phone to say hello to Ananya!"
            </p>

            <button
              onClick={() => setCallingContact(null)}
              className="mt-6 w-full h-12 rounded-xl bg-ner-black text-white font-mono text-xs uppercase tracking-wider"
            >
              Close Call
            </button>
          </div>
        </div>
      )}

      {/* Add New Memory Modal */}
      {isNewMemoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ner-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-ner-offwhite border-2 border-ner-black rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsNewMemoryModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-ner-border flex items-center justify-center text-ner-black/60"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-bold text-ner-black mb-1">Add a New Memory</h3>
            <p className="text-xs text-ner-black/60 mb-6">
              Preserve a story or photo for Ananya's daily cognitive and emotional well-being.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                  Title / Event
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guwahati Tea Garden Morning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border-2 border-ner-border text-sm font-medium focus:outline-none focus:border-ner-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                  Person or Place
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward's Lake, Shillong with Rohan"
                  value={newPersonPlace}
                  onChange={(e) => setNewPersonPlace(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border-2 border-ner-border text-sm font-medium focus:outline-none focus:border-ner-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-12 px-4 rounded-xl bg-white border-2 border-ner-border text-sm font-medium focus:outline-none focus:border-ner-black"
                >
                  <option value="family">Family Moment</option>
                  <option value="place">Beloved Place</option>
                  <option value="story">Life Story</option>
                  <option value="song">Cherished Song</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                  Memory Photo (Optional)
                </label>
                <input
                  type="file"
                  id="web-memory-file-input"
                  accept="image/*"
                  onChange={handleWebFileChange}
                  className="hidden"
                />
                {newImageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-ner-border bg-ner-offwhite group">
                    <img
                      src={newImageUrl}
                      alt="Memory preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-ner-black/70 text-white hover:bg-ner-black transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSelectImage}
                    disabled={isSelectingImage}
                    className="w-full h-20 rounded-xl border-2 border-dashed border-ner-border hover:border-ner-black/50 bg-ner-offwhite/50 flex flex-col items-center justify-center gap-1.5 text-ner-black/70 hover:text-ner-black transition-all"
                  >
                    <Upload className="w-5 h-5 text-ner-terracotta" />
                    <span className="text-xs font-medium">
                      {isSelectingImage ? 'Opening file chooser...' : 'Click to select photo from device'}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-ner-black/70 mb-1">
                  Story & Warm Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what happened, what you ate, or who laughed..."
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white border-2 border-ner-border text-sm font-medium focus:outline-none focus:border-ner-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewMemoryModalOpen(false)}
                  className="h-12 px-5 rounded-xl bg-white border border-ner-border font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-ner-black text-white font-mono font-bold text-xs uppercase"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
