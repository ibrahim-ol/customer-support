import { type ConversationStatsData } from "../../../types/responses.ts";
import { StatsCard } from "../../components/cards/stats-card.tsx";
import { useFetch } from "../../hooks/useApi.ts";

export function GeneralStats() {
  const statsApi = useFetch<StatsResponse>("/admin/api/stats", true);
  const stats = statsApi.data?.data;

  if (statsApi.error) {
    return (
      <div className="my-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600">
            {statsApi.error && `Error loading statistics: ${statsApi.error}`}
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Conversations"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.totalConversations?.toString() || "--"
          }
          icon="💬"
        />
        <StatsCard
          title="Total Messages"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.totalMessages?.toString() || "--"
          }
          icon="📨"
        />
        <StatsCard
          title="Avg Messages/Chat"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.averageMessagesPerConversation?.toString() || "--"
          }
          icon="📊"
        />
      </div>

      {/* Mood Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Positive Sentiment"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.moodStats?.positiveCount?.toString() || "--"
          }
          icon="😊"
        />
        <StatsCard
          title="Negative Sentiment"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.moodStats?.negativeCount?.toString() || "--"
          }
          icon="😠"
        />
        <StatsCard
          title="Neutral Sentiment"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.moodStats?.neutralCount?.toString() || "--"
          }
          icon="😐"
        />
        <StatsCard
          title="Total Mood Entries"
          value={
            statsApi.isLoading
              ? "Loading..."
              : stats?.moodStats?.totalMoodEntries?.toString() || "--"
          }
          icon="📈"
        />
      </div>
    </>
  );
}

interface StatsResponse {
  success: boolean;
  data: ConversationStatsData;
}
