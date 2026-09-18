import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { TTSButton } from '../components/TTSButton';
import { useAccessibility } from '../context/AccessibilityContext';

export const GamesHub: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useAccessibility();

  const games = [
    {
      id: 'memory',
      title: t.gameMemoryMatchName || 'MEMORY MATCH',
      subtitle: t.gameMemoryMatchDesc || 'Find matching pairs and exercise visual memory.',
      category: t.gamesHubVisualRecall || 'Visual Recall',
      icon: '🦏',
      difficulty: 'Gentle',
      estimatedTime: '5 mins',
      route: '/games/memory',
      description: t.gameMemoryMatchInst || 'Exercise photographic memory and pair recognition using nostalgic North Eastern elements like tea estates and rhinos.'
    },
    {
      id: 'sequence',
      title: t.gameSequenceRecallName || 'SEQUENCE RECALL',
      subtitle: t.gameSequenceRecallDesc || 'Remember the sequence and repeat it.',
      category: t.gamesHubReasoningOrder || 'Reasoning & Order',
      icon: '⭐',
      difficulty: 'Adaptive',
      estimatedTime: '4 mins',
      route: '/games/sequence',
      description: t.gameSequenceRecallInst || 'Strengthen short-term working memory and rhythmic reasoning through progressive visual symbol patterns.'
    },
    {
      id: 'pattern',
      title: t.gamePatternFinderName || 'PATTERN RECOGNITION',
      subtitle: t.gamePatternFinderDesc || 'Identify the missing or altered element.',
      category: t.gamesHubAttentionLogic || 'Attention & Logic',
      icon: '🔍',
      difficulty: 'Adaptive',
      estimatedTime: '4 mins',
      route: '/games/pattern',
      description: t.gamePatternFinderInst || 'Discover subtle geometric rhythms and textile motifs inspired by Assam handloom and traditional shawls.'
    },
    {
      id: 'object',
      title: t.gamePictureRecognitionName || 'OBJECT RECOGNITION',
      subtitle: t.gamePictureRecognitionDesc || 'Identify familiar everyday objects.',
      category: t.gamesHubEpisodicMemory || 'Episodic Memory',
      icon: '🧣',
      difficulty: 'Gentle',
      estimatedTime: '5 mins',
      route: '/games/object',
      description: t.gamePictureRecognitionInst || 'Trigger warm memories of North Eastern landscapes, traditional handlooms, and cultural artifacts.'
    },
    {
      id: 'routine',
      title: t.gameRoutineRecallName || 'DAILY ROUTINE RECALL',
      subtitle: t.gameRoutineRecallDesc || 'Remember daily routine steps in sequence.',
      category: t.gamesHubRoutineExecutive || 'Routine & Executive',
      icon: '⏰',
      difficulty: 'Gentle',
      estimatedTime: '4 mins',
      route: '/games/routine',
      description: t.gameRoutineRecallInst || 'Reinforce comforting morning habits like waking, brushing, morning tea, medication, and daily walks.'
    },
    {
      id: 'emotion',
      title: t.gameEmotionRecognitionName || 'EMOTION RECOGNITION',
      subtitle: t.gameEmotionRecognitionDesc || 'Recognize emotional cues and feelings.',
      category: t.gamesHubSocialEmpathy || 'Social & Empathy',
      icon: '😊',
      difficulty: 'Gentle',
      estimatedTime: '3 mins',
      route: '/games/emotion',
      description: t.gameEmotionRecognitionInst || 'Recognize emotional expressions, gestures, and warm social moments with family and friends.'
    },
    {
      id: 'words',
      title: t.gameWordConnectName || 'WORD CONNECT',
      subtitle: t.gameWordConnectDesc || 'Connect related words and strengthen vocabulary.',
      category: t.gamesHubLanguageLexical || 'Language & Lexical',
      icon: '🍎',
      difficulty: 'Gentle',
      estimatedTime: '4 mins',
      route: '/games/words',
      description: t.gameWordConnectInst || 'Stimulate everyday associative memory and concept pairing through friendly, stress-free prompts.'
    },
    {
      id: 'market',
      title: t.gameMarketMemoryName || 'REMEMBER THE MARKET',
      subtitle: t.gameMarketMemoryDesc || 'Nostalgic local bazaar memory shopping list.',
      category: t.gamesHubWorkingMemory || 'Working Memory',
      icon: '🛍️',
      difficulty: 'Adaptive',
      estimatedTime: '4 mins',
      route: '/games/market',
      description: t.gameMarketMemoryInst || 'Recall items from the weekly Sunday bazaar: fresh ginger, red rice, local tea leaves, and bananas.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-32 sm:pb-24 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in selection:bg-ner-terracotta selection:text-white">
      {/* Header */}
      <div className="frost-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-ner-border shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ner-terracotta/10 text-ner-terracotta font-bold">
              {t.gamesHubGymBadge}
            </span>
            <span className="text-xs text-ner-black/40 font-mono">{t.gamesHubExercisesBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-ner-black">
            {t.gamesHubHeading}
          </h1>
          <p className="text-ner-black/70 text-base sm:text-lg mt-2 max-w-xl font-normal">
            {t.gamesHubSubheading}
          </p>
        </div>

        <TTSButton
          text={`${t.gamesHubHeading}. ${t.gamesHubSubheading}`}
          label={t.listenAloud}
          size="lg"
        />
      </div>

      {/* Grid of Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g) => (
          <div
            key={g.id}
            className="frost-card rounded-3xl p-7 hover:-translate-y-1 hover:border-ner-black/50 transition-all flex flex-col justify-between shadow-sm relative group cursor-pointer border border-ner-border"
            onClick={() => navigate(g.route)}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-3 rounded-2xl bg-white border border-ner-border shadow-sm">
                  {g.icon}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-ner-black/5 text-ner-black/70 font-bold">
                  {g.category}
                </span>
              </div>

              <h2 className="text-xl font-bold text-ner-black tracking-tight group-hover:text-ner-terracotta transition-colors">
                {g.title}
              </h2>
              <p className="text-xs font-semibold text-ner-terracotta mt-1">
                "{g.subtitle}"
              </p>
              <p className="text-xs text-ner-black/70 mt-2 leading-relaxed">
                {g.description}
              </p>
            </div>

            {/* Bottom stats & Action */}
            <div className="mt-6 pt-5 border-t border-ner-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-ner-black/60 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-ner-terracotta" /> {g.estimatedTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-ner-black">{g.difficulty}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(g.route);
                }}
                className="px-4 py-2.5 rounded-full bg-ner-black text-white hover:bg-ner-terracotta text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{t.gamesHubPlayBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
