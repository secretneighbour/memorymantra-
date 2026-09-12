import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const Watermark: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* 1. Subtle Ambient Repeating Diagonal Watermark Grid across the entire viewport */}
      <div 
        className="fixed inset-0 pointer-events-none select-none z-[1] overflow-hidden" 
        aria-hidden="true"
      >
        <svg className="w-full h-full opacity-[0.032] dark:opacity-[0.045]">
          <defs>
            <pattern 
              id="smriticare-watermark-pattern" 
              width="240" 
              height="140" 
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-24)"
            >
              <text 
                x="20" 
                y="50" 
                fill="currentColor" 
                className="font-mono text-sm tracking-[0.25em] uppercase font-bold"
              >
                smriticare
              </text>
              <text 
                x="140" 
                y="120" 
                fill="currentColor" 
                className="font-mono text-[11px] tracking-[0.2em] uppercase font-medium opacity-60"
              >
                smriticare
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smriticare-watermark-pattern)" />
        </svg>
      </div>

      {/* 2. Floating Nothing-style Frosted Watermark Badge (Bottom-Left) */}
      <aside 
        aria-label="Application Watermark"
        className="fixed bottom-3.5 left-3.5 z-40 pointer-events-auto transition-all duration-300 select-none print:bottom-1 print:left-1"
      >
        <div 
          onClick={() => setShowDetails(!showDetails)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowDetails(!showDetails); }}
          className="group cursor-pointer frost-white-intense hover:bg-white/95 rounded-full px-3 py-1.5 border border-ner-border/90 shadow-md hover:shadow-lg flex items-center gap-2 font-mono text-[11px] text-ner-black transition-all duration-200"
          title="Click to view watermark details"
        >
          {/* Terracotta indicator dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ner-terracotta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ner-terracotta"></span>
          </span>

          <span className="font-bold tracking-widest uppercase text-ner-black group-hover:text-ner-terracotta transition-colors">
            smriticare
          </span>

          <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-ner-black/5 text-ner-black/60 font-semibold">
            SIH 2026
          </span>

          <ShieldCheck className="w-3 h-3 text-ner-sage ml-0.5 opacity-80 group-hover:opacity-100" />
        </div>

        {/* Expandable info card on click/toggle */}
        {showDetails && (
          <div className="absolute bottom-10 left-0 w-64 p-3.5 rounded-2xl frost-white-intense border border-ner-border shadow-2xl animate-fade-in text-xs font-sans text-ner-black/80 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-ner-border/60">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ner-terracotta">
                Verified Watermark
              </span>
              <span className="font-mono text-[9px] text-ner-black/40">ID: SC-2026-NER</span>
            </div>
            <p className="text-[11px] leading-relaxed text-ner-black/75">
              <strong>smriticare</strong> (Smart India Hackathon 2026). AI-Assisted Cognitive Wellness & Dementia Care Architecture.
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-ner-black/50">
              <span>Status: Authenticated</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
                className="text-ner-terracotta hover:underline font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
