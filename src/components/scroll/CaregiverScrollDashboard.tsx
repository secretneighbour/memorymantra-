import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  LineChart, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  Heart
} from 'lucide-react';

export const CaregiverScrollDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { activePatient } = useRole();
  const { motion: contextMotion } = useAccessibility();
  const systemReducedMotion = useReducedMotion();
  const isReduced = contextMotion === 'reduced' || systemReducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const stats = [
    {
      label: 'Activity Overview',
      val: '18 / 20',
      sub: 'Weekly Target Sessions',
      icon: <Activity className="w-4 h-4 text-ner-terracotta" />,
      color: 'text-ner-black',
    },
    {
      label: 'Reminder Adherence',
      val: '96%',
      sub: 'On-Time Medication & Water',
      icon: <CheckCircle2 className="w-4 h-4 text-ner-sage" />,
      color: 'text-ner-sage',
    },
    {
      label: 'Engagement Index',
      val: '88%',
      sub: 'High Vitality & Calmness',
      icon: <TrendingUp className="w-4 h-4 text-ner-calmBlue" />,
      color: 'text-ner-calmBlue',
    },
    {
      label: 'Continuity Streak',
      val: `${activePatient.stats.streakDays} Days`,
      sub: 'Unbroken Daily Routine',
      icon: <Clock className="w-4 h-4 text-ner-warmAmber" />,
      color: 'text-ner-warmAmber',
    },
  ];

  // Trend graph points (14-Day points representing Cognitive Activity Trend)
  const trendPoints = [
    { day: 'Day 1', score: 68 },
    { day: 'Day 2', score: 72 },
    { day: 'Day 3', score: 70 },
    { day: 'Day 4', score: 75 },
    { day: 'Day 5', score: 78 },
    { day: 'Day 6', score: 82 },
    { day: 'Day 7', score: 80 },
    { day: 'Day 8', score: 85 },
    { day: 'Day 9', score: 83 },
    { day: 'Day 10', score: 87 },
    { day: 'Day 11', score: 86 },
    { day: 'Day 12', score: 90 },
    { day: 'Day 13', score: 88 },
    { day: 'Day 14', score: 92 },
  ];

  // Calculate SVG line path
  const svgWidth = 700;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const pointsString = trendPoints
    .map((pt, i) => {
      const x = paddingX + (i / (trendPoints.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - ((pt.score - 50) / 50) * (svgHeight - paddingY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section
      ref={containerRef}
      id="caregiver-telemetry"
      className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto border-b border-ner-border/40 select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 sm:mb-18 gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ner-terracotta font-bold block mb-2">
            [ 08 // CLINICAL & CAREGIVER PERSPECTIVE ]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ner-black uppercase">
            Caregiver Dashboard
          </h2>
          <p className="text-sm sm:text-base text-ner-black/70 font-light mt-3 max-w-2xl leading-relaxed">
            Transitioning from the patient’s tactile interface to actionable longitudinal telemetry for family circles and clinical specialists.
          </p>
        </div>

        <button
          onClick={() => navigate('/caregiver')}
          className="h-12 px-7 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 shrink-0"
        >
          <span>Open Portal</span>
          <ArrowRight className="w-4 h-4 text-ner-terracotta" />
        </button>
      </div>

      {/* Main Dashboard Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top 4 KPI Metrics Monoliths */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="frost-white-intense rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-ner-border/90 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-ner-black/50 font-bold truncate">
                  {s.label}
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-ner-border flex items-center justify-center shadow-xs shrink-0">
                  {s.icon}
                </div>
              </div>

              <span className={`text-xl xs:text-2xl sm:text-4xl font-extrabold font-mono tracking-tight ${s.color}`}>
                {s.val}
              </span>

              <span className="text-[10px] sm:text-xs text-ner-black/60 font-mono mt-1 sm:mt-2 block truncate">
                {s.sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Center: Cognitive Activity Trend (Smooth SVG Line Drawing) */}
        <motion.div
          initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 frost-white-intense rounded-3xl p-6 sm:p-8 border border-ner-border/90 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-ner-border/70">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ner-terracotta font-bold block">
                  LONGITUDINAL TELEMETRY
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-ner-black tracking-tight">
                  Cognitive Activity Trend
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-ner-sage/15 text-ner-sage font-mono text-xs font-bold border border-ner-sage/30 w-max">
                +14.2% Stability Index
              </span>
            </div>

            <p className="text-xs text-ner-black/65 font-light mb-6">
              Continuous 14-day record measuring active session frequency, memory match accuracy, and reaction composure.
            </p>
          </div>

          {/* Smooth SVG Line Drawing Chart */}
          <div className="w-full overflow-hidden bg-white/70 rounded-2xl p-4 border border-ner-border">
            <svg
              className="w-full h-44 sm:h-52 overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DE4A30" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#DE4A30" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 90, 140].map((y, i) => (
                <line
                  key={i}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E2E2DC"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Shaded Area */}
              <polygon
                points={`${paddingX},${svgHeight - paddingY} ${pointsString} ${svgWidth - paddingX},${svgHeight - paddingY}`}
                fill="url(#trendGradient)"
              />

              {/* Main Line with Framer Motion path animation */}
              <motion.polyline
                fill="none"
                stroke="#DE4A30"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
                initial={isReduced ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Data points */}
              {trendPoints.map((pt, i) => {
                const x = paddingX + (i / (trendPoints.length - 1)) * (svgWidth - paddingX * 2);
                const y = svgHeight - paddingY - ((pt.score - 50) / 50) * (svgHeight - paddingY * 2);
                const isLatest = i === trendPoints.length - 1;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isLatest ? 5 : 3.5}
                      fill={isLatest ? '#DE4A30' : '#111111'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    {isLatest && (
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="none"
                        stroke="#DE4A30"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] font-mono text-ner-black/40 mt-2 px-4">
              <span>Day 01 (Baseline)</span>
              <span>Day 07 (Mid-Week)</span>
              <span>Day 14 (Current Active)</span>
            </div>
          </div>
        </motion.div>

        {/* Right 4 Columns: AI-Assisted Insights & Recent Activities */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI-Assisted Insights Card */}
          <motion.div
            initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="frost-white-intense rounded-3xl p-6 border border-ner-border/90 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-ner-terracotta uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI-Assisted Clinical Insights</span>
            </div>

            <div className="p-4 rounded-2xl bg-ner-offwhite border border-ner-border text-xs text-ner-black/80 space-y-2">
              <p className="font-semibold text-ner-black">
                Optimal Morning Stamina Observed
              </p>
              <p className="leading-relaxed text-ner-black/70">
                Cognitive recall scores are highest between 9:00 AM – 11:30 AM following morning breakfast and tea.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-ner-black/70">
                <span>Recent Activity:</span>
                <span className="font-bold text-ner-black">Heritage Memory Match</span>
              </div>
              <div className="flex items-center justify-between text-ner-black/70">
                <span>Reaction Composure:</span>
                <span className="font-bold text-ner-sage">Stable & Unhurried</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/caregiver')}
              className="w-full h-11 rounded-2xl bg-ner-black text-white hover:bg-ner-black/85 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-ner-terracotta" />
              <span>Export PDF Report</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
