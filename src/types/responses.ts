import { MoodCategory } from "./mood.ts";

export interface MoodAnalyticsData {
  overallMoodDistribution: Record<MoodCategory, number>;
  totalMoodEntries: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  currentMoodDistribution: Record<MoodCategory, number>;
  moodTrends: {
    improving: number;
    declining: number;
    stable: number;
  };
}

export interface ConversationStatsData {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  moodStats: {
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    totalMoodEntries: number;
  };
}
