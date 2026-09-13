import { Patient, ActivityResult, CognitiveAdaptationScore } from '../../types';

/**
 * Deterministic Adaptive AI Engine
 * Analyzes patient cognitive telemetry (accuracy, response latency, mistake frequency, consistency)
 * and computes the internal Cognitive Adaptation Score (CAS).
 * Can be swapped with an ML classifier / LLM service later via CognitiveAIService.
 */
export class AdaptiveCognitiveEngine {
  /**
   * Calculates the patient's Cognitive Adaptation Score based on longitudinal telemetry
   */
  public static computeAdaptation(
    patient: Patient,
    latestResult?: ActivityResult
  ): CognitiveAdaptationScore {
    const activities = patient.recentActivities || [];
    
    // Baseline metrics
    const sample = latestResult ? [latestResult, ...activities.slice(0, 5)] : activities.slice(0, 6);
    
    if (sample.length === 0) {
      return {
        overallScore: patient.stats.weeklyScore || 85,
        accuracyRate: 85,
        avgResponseTimeSec: 2.1,
        consistencyRating: 'High',
        memoryDifficultyModifier: 0,
        attentionDifficultyModifier: 0,
        recommendedNextActivityId: 'pattern-finder',
        recommendedReason: 'Baseline cognitive assessment calibrated for gentle reinforcement.'
      };
    }

    // 1. Accuracy rate
    const avgAccuracy = Math.round(
      sample.reduce((acc, curr) => acc + (curr.accuracy || curr.score || 80), 0) / sample.length
    );

    // 2. Average Response Time
    const avgTime = parseFloat(
      (
        sample.reduce((acc, curr) => acc + (curr.responseTimeSeconds || 2.4), 0) / sample.length
      ).toFixed(1)
    );

    // 3. Mistake count in recent sessions
    const totalMistakes = sample.reduce((acc, curr) => acc + (curr.mistakes || 0), 0);

    // 4. Consistency metric: variance across scores
    const scores = sample.map(s => s.score || s.accuracy || 80);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const variance = maxScore - minScore;

    let consistencyRating: 'High' | 'Moderate' | 'Fluctuating' = 'High';
    if (variance > 25) {
      consistencyRating = 'Fluctuating';
    } else if (variance > 12) {
      consistencyRating = 'Moderate';
    }

    // 5. Adaptation Modifiers
    let memoryModifier = 0;
    let attentionModifier = 0;
    let nextActivity = 'act-words';
    let reason = '';

    if (avgAccuracy >= 88 && avgTime < 2.5 && totalMistakes <= 2) {
      // High performer -> Stimulate slightly
      memoryModifier = 10;
      attentionModifier = 5;
      nextActivity = 'act-pattern';
      reason = 'Recent recall accuracy was high (88%+) with quick latency. Introducing stimulating pattern variations.';
    } else if (avgAccuracy < 70 || avgTime > 4.5 || totalMistakes >= 6) {
      // Mild fatigue or strain -> Relax difficulty
      memoryModifier = -10;
      attentionModifier = -5;
      nextActivity = 'act-memory';
      reason = 'Response latency indicated cognitive fatigue. Adapting to gentle familiar heritage motifs.';
    } else {
      // Steady zone
      memoryModifier = 0;
      attentionModifier = 0;
      nextActivity = 'act-sequence';
      reason = 'Cognitive rhythms are remarkably steady. Continuing adaptive sequential practice.';
    }

    // Overall CAS metric (0 - 100)
    const overallCAS = Math.min(100, Math.max(40, Math.round(
      avgAccuracy * 0.55 + 
      (Math.max(0, 5 - avgTime) * 6) + 
      (consistencyRating === 'High' ? 15 : consistencyRating === 'Moderate' ? 10 : 5)
    )));

    return {
      overallScore: overallCAS,
      accuracyRate: avgAccuracy,
      avgResponseTimeSec: avgTime,
      consistencyRating,
      memoryDifficultyModifier: memoryModifier,
      attentionDifficultyModifier: attentionModifier,
      recommendedNextActivityId: nextActivity,
      recommendedReason: reason
    };
  }
}
