import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Heart, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  Eye,
  Camera
} from 'lucide-react';

interface MemoryCard {
  id: string;
  category: 'Family' | 'Places' | 'Stories' | 'Important Dates' | 'Familiar Objects';
  title: string;
  subtitle: string;
  narrative: string;
  dateOrPlace: string;
  emoji: string;
  color: string;
  speed: number;
}

export const MemoryWallSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { motion: contextMotion, t } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [selectedMemory, setSelectedMemory] = useState<string | null>('places');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax shifts for multi-layer floating sensation
  const yShiftSlow = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const yShiftFast = useTransform(scrollYProgress, [0, 1], [-55, 55]);
  const convergence = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.95, 1, 0.98]);

  const memoryCards: MemoryCard[] = [
    {
      id: 'family',
      category: 'Family',
      title: 'Family Graduation at Cotton College',
      subtitle: 'Graduation Day in Guwahati',
      narrative: 'A bright sunny morning in June. Dressed in the red Muga silk Mekhela Sador with gold borders, smiling beside the historic college gate.',
      dateOrPlace: 'Guwahati, 2018',
      emoji: '🎓',
      color: '#DE4A30',
      speed: 0.2,
    },
    {
      id: 'places',
      category: 'Places',
      title: 'Majuli Island Sunset by Ferry',
      subtitle: 'Crossing the Brahmaputra River',
      narrative: 'The sound of the gentle waves against the wooden boat. Monks at the Kamalabari Satra playing the Khol drum as dusk settled over the water.',
      dateOrPlace: 'Majuli, Assam',
      emoji: '⛵',
      color: '#10B981',
      speed: -0.3,
    },
    {
      id: 'stories',
      category: 'Stories',
      title: 'The Secret Tea Garden Recipe',
      subtitle: 'Hand-crushed cardamom & wild ginger',
      narrative: 'Brewing morning CTC tea with freshly plucked bay leaves and wild mountain ginger harvested behind the Dibrugarh homestead.',
      dateOrPlace: 'Dibrugarh Estate',
      emoji: '🍃',
      color: '#E67E22',
      speed: 0.35,
    },
    {
      id: 'dates',
      category: 'Important Dates',
      title: 'Wedding Anniversary — Nov 14',
      subtitle: '42 Years of Shared Life & Laughter',
      narrative: 'Traditional Jorhat ceremony under the winter sky with family gathering from Tezpur and Shillong.',
      dateOrPlace: 'Jorhat, 1984',
      emoji: '💍',
      color: '#8B5CF6',
      speed: -0.2,
    },
    {
      id: 'objects',
      category: 'Familiar Objects',
      title: 'Grandmother’s Brass Xorai',
      subtitle: 'Centuries-old family bell-metal heirloom',
      narrative: 'Crafted in Sarthebari, polished for every festive Bihu gathering and placed on the central wooden pedestal with betel nut offerings.',
      dateOrPlace: 'Sarthebari Bell Metal',
      emoji: '✨',
      color: '#3B82F6',
      speed: 0.15,
    },
  ];

  const activeMemoryData = memoryCards.find((m) => m.id === selectedMemory) || memoryCards[0];

  return (
    <section
      ref={containerRef}
      id="memory-wall"
      className="memory-wall-centered-section border-b border-ner-border/40 select-none overflow-hidden"
    >
        {/* Step 4: Centered Memory Wall Section Container */}
        <div className="memory-wall-section">
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            {t.memoryWallBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase mb-3">
            {t.memoryWallTitle}
          </h2>
          <p className="memory-wall-paragraph text-sm sm:text-base text-ner-black/70 font-light leading-relaxed">
            {t.memoryWallSubtitle}
          </p>
        </div>

        {/* Anchored Memory Wall Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto w-full text-left">
        {memoryCards.map((card) => {
          const isSelected = selectedMemory === card.id;

          return (
            <motion.div
              key={card.id}
              onClick={() => setSelectedMemory(card.id)}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-ner-black text-white shadow-2xl border-2 border-white scale-102 z-20'
                  : 'frost-white-intense text-ner-black border border-ner-border/90 shadow-md hover:border-ner-black/50 hover:shadow-xl opacity-90 hover:opacity-100 z-10'
              }`}
              whileHover={{ y: -4 }}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border"
                    style={{
                      color: isSelected ? '#FFFFFF' : card.color,
                      borderColor: isSelected ? 'rgba(255,255,255,0.3)' : `${card.color}33`,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : `${card.color}10`,
                    }}
                  >
                    {card.category}
                  </span>

                  <span className="text-2xl">{card.emoji}</span>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-1 ${isSelected ? 'text-white' : 'text-ner-black'}`}>
                  {card.title}
                </h3>

                <span className={`text-xs font-mono block mb-3 ${isSelected ? 'text-ner-terracotta' : 'text-ner-black/60'}`}>
                  {card.subtitle}
                </span>

                <p className={`text-xs leading-relaxed font-light ${isSelected ? 'text-white/80' : 'text-ner-black/75'}`}>
                  {card.narrative}
                </p>
              </div>

              {/* Card Footer */}
              <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono ${
                isSelected ? 'border-white/20 text-white/60' : 'border-ner-border text-ner-black/50'
              }`}>
                <span>{card.dateOrPlace}</span>
                <span className="font-bold flex items-center gap-1">
                  {isSelected ? 'Active Memory' : 'Tap to focus'}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* 6th Card: Vault Launcher Callout */}
        <div className="rounded-3xl p-6 sm:p-7 bg-ner-offwhite border-2 border-dashed border-ner-border flex flex-col justify-between text-center items-center">
          <div className="my-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-ner-black text-white flex items-center justify-center mx-auto shadow-sm">
              <Camera className="w-6 h-6 text-ner-terracotta" />
            </div>
            <h4 className="font-bold text-base text-ner-black">{t.memoriesAddBtn}</h4>
            <p className="text-xs text-ner-black/60 max-w-xs leading-relaxed">
              {t.memoryWallSubtitle}
            </p>
          </div>

          <button
            onClick={() => navigate('/memory')}
            className="w-full h-11 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95 mt-4"
          >
            <span>{t.memoryWallOpenVault}</span>
            <ArrowRight className="w-3.5 h-3.5 text-ner-terracotta" />
          </button>
        </div>
      </div>
    </section>
  );
};
