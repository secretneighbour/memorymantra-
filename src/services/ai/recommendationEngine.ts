import { Patient, ActivityResult } from '../../types';
import { RecommendationResult } from './types';
import { AdaptiveCognitiveEngine } from './adaptiveEngine';

export class RecommendationEngine {
  /**
   * Evaluates patient activity telemetry to generate next activity recommendation
   */
  public static getNextActivity(patient: Patient, history: ActivityResult[] = []): RecommendationResult {
    const adaptation = AdaptiveCognitiveEngine.computeAdaptation(patient, history[0]);
    
    // Check which activity types have been played recently
    const recentTypes = (history.length > 0 ? history : patient.recentActivities || []).map(a => a.gameType);
    
    // Activity definitions catalogue
    const activityCatalog = [
      {
        id: 'act-pattern',
        title: 'Pattern Finder',
        category: 'pattern',
        route: '/games/pattern',
        estimatedMinutes: 4,
        difficultyDelta: adaptation.attentionDifficultyModifier > 0 ? '+10% Focus' : 'Standard',
        baseReason: 'Stimulates frontal lobe sequencing and visual progression.'
      },
      {
        id: 'act-memory',
        title: 'Heritage Memory Match',
        category: 'memory',
        route: '/games/memory',
        estimatedMinutes: 5,
        difficultyDelta: adaptation.memoryDifficultyModifier > 0 ? '+10% Speed' : 'Gentle',
        baseReason: 'Reinforces visual recognition through beloved North Eastern motifs.'
      },
      {
        id: 'act-words',
        title: 'Brahmaputra Word Connect',
        category: 'words',
        route: '/games/words',
        estimatedMinutes: 4,
        difficultyDelta: 'Standard',
        baseReason: 'Strengthens lexical retrieval and everyday verbal associations.'
      },
      {
        id: 'act-sequence',
        title: 'Rhythm Sequence Recall',
        category: 'sequence',
        route: '/games/sequence',
        estimatedMinutes: 5,
        difficultyDelta: adaptation.attentionDifficultyModifier > 0 ? '+1 Beat' : 'Calm Rhythm',
        baseReason: 'Engages working memory and audio-visual rhythm coordination.'
      },
      {
        id: 'act-routine',
        title: 'Daily Routine Recall',
        category: 'routine',
        route: '/games/routine',
        estimatedMinutes: 3,
        difficultyDelta: 'Gentle',
        baseReason: 'Anchors episodic orientation to daily activities and self-care timing.'
      },
      {
        id: 'act-market',
        title: 'Remember the Market',
        category: 'market',
        route: '/games/market',
        estimatedMinutes: 4,
        difficultyDelta: 'Cultural Focus',
        baseReason: 'Culturally familiar grocery recall (tea, spices, fruits).'
      }
    ];

    // Pick activity that wasn't just played, weighted by adaptation need
    let chosen = activityCatalog[0];
    if (recentTypes[0] === 'memory') {
      chosen = activityCatalog.find(a => a.category === 'pattern') || activityCatalog[0];
    } else if (recentTypes[0] === 'pattern') {
      chosen = activityCatalog.find(a => a.category === 'sequence') || activityCatalog[3];
    } else if (recentTypes[0] === 'words') {
      chosen = activityCatalog.find(a => a.category === 'market') || activityCatalog[5];
    } else {
      chosen = activityCatalog.find(a => a.id === adaptation.recommendedNextActivityId) || activityCatalog[1];
    }

    return {
      activityId: chosen.id,
      activityTitle: chosen.title,
      category: chosen.category,
      route: chosen.route,
      estimatedMinutes: chosen.estimatedMinutes,
      difficultyDelta: chosen.difficultyDelta,
      reason: `Recommended because your recent ${recentTypes[0] || 'cognitive'} exercises were completed consistently. ${chosen.baseReason}`
    };
  }
}
