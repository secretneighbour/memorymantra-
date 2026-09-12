import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Sparkles, Clock, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TTSButton } from '../components/TTSButton';

export const GamesHub: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'memory',
      title: 'MEMORY MATCH',
      subtitle: 'Find matching pairs and exercise visual memory.',
      category: 'Visual Recall',
      icon: '🦏',
      color: 'border-ner-terracotta',
      difficulty: 'Gentle',
      estimatedTime: '5 mins',
      progress: '100% Completed Today',
      route: '/games/memory',
      description: 'Exercise photographic memory and pair recognition using nostalgic North Eastern elements like tea estates and rhinos.'
    },
    {
      id: 'sequence',
      title: 'SEQUENCE RECALL',
      subtitle: 'Remember the sequence and repeat it.',
      category: 'Reasoning & Sequence',
      icon: '⭐',
      color: 'border-ner-sage',
      difficulty: 'Adaptive',
      estimatedTime: '6 mins',
      progress: 'Ready to play',
      route: '/games/sequence',
      description: 'Strengthen short-term working memory and rhythmic reasoning through progressive visual symbol patterns.'
    },
    {
      id: 'words',
      title: 'WORD CONNECT',
      subtitle: 'Connect related words and strengthen recall.',
      category: 'Language & Lexical',
      icon: '🍎',
      color: 'border-ner-warmAmber',
      difficulty: 'Gentle',
      estimatedTime: '4 mins',
      progress: '100% Completed Today',
      route: '/games/words',
      description: 'Stimulate everyday associative memory and concept pairing through friendly, stress-free multiple choice prompts.'
    },
    {
      id: 'recognition',
      title: 'PICTURE RECOGNITION',
      subtitle: 'Identify familiar objects and scenes.',
      category: 'Episodic Memory',
      icon: '🧣',
      color: 'border-ner-calmBlue',
      difficulty: 'Gentle',
      estimatedTime: '5 mins',
      progress: 'Ready to play',
      route: '/games/recognition',
      description: 'Trigger warm memories of North Eastern landscapes, traditional handlooms, and flora and fauna.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
              Cognitive Wellness
            </span>
            <span className="text-xs text-ner-black/40 font-mono">4 Therapeutic Exercises</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            Cognitive Games Hub
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            Engaging, clinically inspired mental exercises tailored for elderly users in North Eastern India.
          </p>
        </div>

        <TTSButton
          text="Welcome to the Cognitive Games Hub. Choose from Memory Match, Sequence Recall, Word Connect, or Picture Recognition."
          label="Listen"
          size="lg"
        />
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((g) => (
          <div
            key={g.id}
            className="frost-card rounded-3xl p-8 hover:-translate-y-1 hover:border-ner-black/40 transition-all flex flex-col justify-between shadow-sm relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">
                  {g.icon}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-ner-black/5 text-ner-black/70 font-semibold">
                  {g.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-ner-black tracking-tight group-hover:text-ner-terracotta transition-colors">
                {g.title}
              </h2>
              <p className="text-sm font-semibold text-ner-terracotta mt-1">
                "{g.subtitle}"
              </p>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {g.description}
              </p>
            </div>

            {/* Bottom stats & Action */}
            <div className="mt-8 pt-6 border-t border-ner-border flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-ner-black/60 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-ner-terracotta" /> {g.estimatedTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-ner-black">{g.difficulty}</span>
              </div>

              <button
                onClick={() => navigate(g.route)}
                className="px-6 py-3 rounded-full bg-ner-black text-white hover:bg-ner-black/85 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
