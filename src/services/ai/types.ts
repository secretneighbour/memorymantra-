import { ActivityResult, CognitiveAdaptationScore, ReminderItem, WellbeingCheckIn, Patient } from '../../types';

export interface ActivityHistoryStats {
  accuracy: number;
  responseTimeSeconds: number;
  attempts: number;
  mistakes: number;
  completionRate: number;
  consistency: 'High' | 'Moderate' | 'Fluctuating';
  recentScores: number[];
}

export interface RecommendationResult {
  activityId: string;
  activityTitle: string;
  category: string;
  route: string;
  estimatedMinutes: number;
  reason: string;
  difficultyDelta: string;
}

export interface CaregiverDailySummary {
  dateStr: string;
  overallAdherenceText: string;
  completedTasksCount: number;
  totalTasksCount: number;
  memoryInsight: string;
  attentionInsight: string;
  medicationStatusText: string;
  wellbeingStatusText: string;
  suggestedCaregiverActions: string[];
}

export interface CognitiveAIService {
  adaptDifficulty(patient: Patient, lastResult?: ActivityResult): CognitiveAdaptationScore;
  recommendActivity(patient: Patient, history: ActivityResult[]): RecommendationResult;
  generateSummary(patient: Patient, reminders: ReminderItem[], checkIns: WellbeingCheckIn[]): CaregiverDailySummary;
  queryCompanion(query: string, patient: Patient, reminders: ReminderItem[], checkIns: WellbeingCheckIn[]): Promise<string>;
}
