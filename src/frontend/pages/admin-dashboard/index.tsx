import { setupView } from "../../../utils/view.tsx";
import { ContentCard } from "../../components/cards/index.tsx";
import { MoodAnalytics } from "../../components/mood/MoodAnalytics.tsx";
import { RecentSummaries } from "../../components/summary/index.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { useEffect } from "hono/jsx";
import { MoodCategory } from "../../../types/mood.ts";
import { QuickActions } from "./quick-actions.tsx";
import { GeneralStats } from "./general-stats.tsx";

function AdminDashboardView() {
  const moodApi = useApi<MoodAnalyticsResponse>();
  const summariesApi = useApi<RecentSummariesResponse>();

  // Fetch mood analytics, and recent summaries on mount
  useEffect(() => {
    moodApi.execute("/admin/api/mood-analytics", {
      credentials: "include",
    });
    summariesApi.execute("/admin/api/recent-summaries?limit=5", {
      credentials: "include",
    });
  }, []);

  const moodData = moodApi.data?.data;
  const recentSummaries = summariesApi.data?.data || [];
  return (
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
          <GeneralStats />

          {/* Quick Actions */}
          <QuickActions />

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
  );
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

setupView(AdminDashboardView);
