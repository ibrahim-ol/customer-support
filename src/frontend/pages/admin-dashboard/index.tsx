import { BaseLayout } from "../../../utils/view.tsx";
import {
  StatsCard,
  ActionCard,
  ContentCard,
  EmptyState,
} from "../../components/cards/index.tsx";
import { MoodAnalytics } from "../../components/mood/MoodAnalytics.tsx";
import { RecentSummaries } from "../../components/summary/index.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { useEffect } from "hono/jsx";
import { MoodCategory } from "../../../types/mood.ts";

interface StatsResponse {
  success: boolean;
  data: {
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
    moodStats: {
      positiveCount: number;
      negativeCount: number;
      neutralCount: number;
      totalMoodEntries: number;
    };
  };
}

interface MoodAnalyticsResponse {
  success: boolean;
  data: {
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
  };
}

interface RecentSummary {
  id: string;
  customerName: string;
  channel: string;
  mood: MoodCategory;
  status: "active" | "killed";
  createdAt: Date;
  updatedAt: Date;
  summary: string;
  summaryUpdatedAt: Date;
}

interface RecentSummariesResponse {
  success: boolean;
  data: RecentSummary[];
}

export function AdminDashboardView() {
  const statsApi = useApi<StatsResponse>();
  const moodApi = useApi<MoodAnalyticsResponse>();
  const summariesApi = useApi<RecentSummariesResponse>();

  // Fetch stats, mood analytics, and recent summaries on mount
  useEffect(() => {
    statsApi.execute("/admin/api/stats", {
      credentials: "include",
    });
    moodApi.execute("/admin/api/mood-analytics", {
      credentials: "include",
    });
    summariesApi.execute("/admin/api/recent-summaries?limit=5", {
      credentials: "include",
    });
  }, []);

  const stats = statsApi.data?.data;
  const moodData = moodApi.data?.data;
  const recentSummaries = summariesApi.data?.data || [];

  return (
    <BaseLayout>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="text-black px-4 py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-black">Welcome, Admin</span>
              <a
                href="/admin/logout"
                className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black"
              >
                Logout
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
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

            {(statsApi.error || moodApi.error || summariesApi.error) && (
              <div className="mb-8">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-red-600">
                    {statsApi.error &&
                      `Error loading statistics: ${statsApi.error}`}
                    {statsApi.error &&
                      (moodApi.error || summariesApi.error) &&
                      " | "}
                    {moodApi.error &&
                      `Error loading mood analytics: ${moodApi.error}`}
                    {moodApi.error && summariesApi.error && " | "}
                    {summariesApi.error &&
                      `Error loading summaries: ${summariesApi.error}`}
                  </div>
                </div>
              </div>
            )}

            {/* Mood Analytics */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">
                Customer Mood Analytics
              </h2>
              <ContentCard>
                <MoodAnalytics
                  data={moodData!}
                  isLoading={moodApi.isLoading}
                  error={moodApi.error || undefined}
                />
              </ContentCard>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">
                Quick Actions
              </h2>
              <ContentCard>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ActionCard
                    title="Manage Products"
                    icon="📦"
                    href="/admin/products"
                  />
                  <ActionCard
                    title="View Conversations"
                    icon="💬"
                    href="/admin/conversations"
                  />
                  <ActionCard
                    title="Analytics"
                    icon="📈"
                    href="/admin/analytics"
                  />
                  <ActionCard
                    title="Settings"
                    icon="⚙️"
                    href="/admin/settings"
                  />
                </div>
              </ContentCard>
            </div>

            {/* Recent Conversation Summaries */}
            <div>
              <ContentCard>
                <RecentSummaries
                  summaries={recentSummaries}
                  isLoading={summariesApi.isLoading}
                  error={summariesApi.error || undefined}
                />
              </ContentCard>
            </div>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
