import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Gamepad2, 
  Sparkles, 
  Bell, 
  Users, 
  HeartHandshake, 
  Stethoscope,
  Info
} from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  icon: React.ReactNode;
  angle: number; // in degrees for circular layout
  route?: string;
  color: string;
  description: string;
}

export const MemoryNetwork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { motion: contextMotion, t } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const [activeNode, setActiveNode] = useState<string | null>('memory');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Progressive scroll-based connection activation
  const lineProgress = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const networkScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.94, 1, 0.96]);
  const networkOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.85, 0.95], [0.4, 1, 1, 0.5]);

  const nodes: NetworkNode[] = [
    {
      id: 'memory',
      label: 'MEMORY',
      sublabel: 'Personal Vault',
      category: '01 // ARCHIVE',
      icon: <Brain className="w-4 h-4" />,
      angle: -90, // Top
      route: '/memory',
      color: '#DE4A30',
      description: 'Preserving personal history, family voices, photographs, and sensory stories.',
    },
    {
      id: 'games',
      label: 'COGNITIVE GAMES',
      sublabel: 'Adaptive Exercises',
      category: '02 // STIMULATION',
      icon: <Gamepad2 className="w-4 h-4" />,
      angle: -40, // Top-Right
      route: '/games',
      color: '#10B981',
      description: 'Culturally-grounded neuroplasticity exercises tailored to individual stamina.',
    },
    {
      id: 'companion',
      label: 'AI COMPANION',
      sublabel: 'Voice Reflection',
      category: '03 // ASSISTANCE',
      icon: <Sparkles className="w-4 h-4" />,
      angle: 15, // Mid-Right
      route: '/memory-companion',
      color: '#E67E22',
      description: 'Supportive multilingual companion guiding gentle reminiscence and daily routine recall.',
    },
    {
      id: 'reminders',
      label: 'REMINDERS',
      sublabel: 'Smart Routine',
      category: '04 // CHRONO',
      icon: <Bell className="w-4 h-4" />,
      angle: 70, // Bottom-Right
      route: '/reminders',
      color: '#3B82F6',
      description: 'High-contrast, audio-backed medication and hydration schedule cues.',
    },
    {
      id: 'family',
      label: 'FAMILY',
      sublabel: 'Care Circle',
      category: '05 // KINSHIP',
      icon: <Users className="w-4 h-4" />,
      angle: 125, // Bottom-Left
      route: '/caregiver',
      color: '#8B5CF6',
      description: 'Transparent updates, shared photo uploads, and warm reassurance for relatives.',
    },
    {
      id: 'caregiver',
      label: 'CAREGIVER',
      sublabel: 'Telemetry Hub',
      category: '06 // OVERSIGHT',
      icon: <HeartHandshake className="w-4 h-4" />,
      angle: 180, // Left
      route: '/caregiver',
      color: '#EC4899',
      description: 'Non-invasive daily cognitive activity tracking, mood logs, and caregiver relief tools.',
    },
    {
      id: 'doctor',
      label: 'HEALTHCARE PROFESSIONAL',
      sublabel: 'Clinical Portal',
      category: '07 // CLINICAL',
      icon: <Stethoscope className="w-4 h-4" />,
      angle: 230, // Top-Left
      route: '/doctor',
      color: '#06B6D4',
      description: 'Objective cognitive activity trends and longitudinal engagement data.',
    },
  ];

  const selectedNodeData = nodes.find((n) => n.id === activeNode) || nodes[0];

  return (
    <section
      ref={sectionRef}
      id="memory-network"
      className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40 relative select-none"
    >
      {/* Header Label */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
          [ 02 // SMRITI DIGITAL MEMORY SYSTEM ]
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
          Interconnected Care Network
        </h2>
        <p className="text-sm sm:text-base text-ner-black/70 font-light mt-4 max-w-2xl mx-auto leading-relaxed">
          A synchronized, digital memory architecture that links the patient’s inner recollections with family members, daily care routines, and clinical oversight.
        </p>
      </div>

      {/* Interactive Central Network Canvas */}
      <motion.div
        className="relative w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/10] max-h-[580px] flex items-center justify-center"
        style={
          isReduced
            ? {}
            : {
                scale: networkScale,
                opacity: networkOpacity,
                willChange: 'transform, opacity',
              }
        }
      >
        {/* SVG Interconnect Lines Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="-300 -240 600 480"
        >
          <defs>
            <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DE4A30" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Concentric subtle radar rings */}
          <circle cx="0" cy="0" r="80" stroke="#E2E2DC" strokeWidth="1" strokeDasharray="3 4" fill="none" />
          <circle cx="0" cy="0" r="150" stroke="#E2E2DC" strokeWidth="1" strokeDasharray="2 6" fill="none" />
          <circle cx="0" cy="0" r="215" stroke="#E2E2DC" strokeWidth="0.75" strokeDasharray="1 8" fill="none" />

          {/* Node Connection Lines */}
          {nodes.map((node, index) => {
            const rad = (node.angle * Math.PI) / 180;
            const distance = 180;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;
            const isSelected = activeNode === node.id;

            return (
              <g key={node.id}>
                {/* Base passive line */}
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={isSelected ? node.color : '#D1D1CB'}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeDasharray={isSelected ? 'none' : '3 3'}
                  className="transition-colors duration-500"
                />

                {/* Animated active signal dot along line */}
                {isSelected && (
                  <circle
                    cx={x * 0.55}
                    cy={y * 0.55}
                    r="2.5"
                    fill={node.color}
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Core: SMRITI CARE Node */}
        <motion.div
          className="z-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-ner-black text-white p-3 flex flex-col items-center justify-center text-center shadow-2xl border-2 border-ner-terracotta cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveNode(null)}
        >
          <span className="w-2 h-2 rounded-full bg-ner-terracotta animate-pulse mb-1" />
          <span className="font-mono text-[10px] tracking-widest text-ner-terracotta uppercase font-bold">
            CORE NODE
          </span>
          <span className="font-bold text-xs sm:text-sm tracking-tight text-white mt-0.5">
            SMRITI CARE
          </span>
          <span className="text-[9px] font-mono text-white/50 mt-0.5">
            ECOSYSTEM
          </span>
        </motion.div>

        {/* Satellite Peripheral Nodes */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          // Responsive radius multiplier for layout
          const distancePercent = 42; 
          const leftPos = 50 + Math.cos(rad) * distancePercent;
          const topPos = 50 + Math.sin(rad) * distancePercent;
          const isSelected = activeNode === node.id;

          return (
            <div
              key={node.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
              }}
            >
              <button
                onClick={() => setActiveNode(node.id)}
                className={`group flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl transition-all shadow-md active:scale-95 ${
                  isSelected
                    ? 'bg-ner-black text-white border-2 border-white scale-105 shadow-xl'
                    : 'frost-white-intense text-ner-black border border-ner-border hover:border-ner-black/60 hover:scale-102'
                }`}
                title={node.label}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-white/10 text-white' : 'bg-ner-offwhite text-ner-black'
                  }`}
                  style={{ color: isSelected ? '#FFFFFF' : node.color }}
                >
                  {node.icon}
                </div>
                <div className="text-left pr-1 hidden sm:block">
                  <span className="text-[9px] font-mono uppercase tracking-wider block opacity-60">
                    {node.category.split('//')[0].trim()}
                  </span>
                  <span className="text-xs font-bold leading-tight block whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Selected Node Real-Time Inspection Strip */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="frost-white-intense rounded-3xl p-5 sm:p-6 border border-ner-border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: selectedNodeData.color }}
            >
              {selectedNodeData.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-ner-black/50">
                  {selectedNodeData.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-ner-sage" />
              </div>
              <h4 className="font-bold text-base text-ner-black">{selectedNodeData.label}</h4>
              <p className="text-xs text-ner-black/70 mt-0.5 max-w-md">
                {selectedNodeData.description}
              </p>
            </div>
          </div>

          {selectedNodeData.route && (
            <button
              onClick={() => navigate(selectedNodeData.route!)}
              className="px-5 py-2.5 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md flex items-center gap-2"
            >
              <span>Explore Node</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
