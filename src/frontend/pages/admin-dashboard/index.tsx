import { setupView } from "../../../utils/view.tsx";
import { ContentCard } from "../../components/cards/index.tsx";
import { RecentSummaries } from "../../components/summary/index.tsx";
import { useFetch } from "../../hooks/useApi.ts";
import { MoodCategory } from "../../../types/mood.ts";
import { QuickActions } from "./quick-actions.tsx";
import { GeneralStats } from "./general-stats.tsx";
import { ActionableInsights } from "../../components/mood/actionable-insights.tsx";
import { useMoodAnaltyics } from "../../components/mood/api.ts";
import { AdminHeader } from "../../components/admin-header.tsx";

function AdminDashboardView() {
  const summariesApi = useFetch<RecentSummariesResponse>(
    "/admin/api/recent-summaries?limit=5",
    true,
  );
  const moodData = useMoodAnaltyics().data;

  const recentSummaries = summariesApi.data?.data || [];
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <AdminHeader title="Admin Dashboard" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <GeneralStats />

          {/* Quick Actions */}
          <QuickActions />

          {/* Urgent Actionable Insights */}
          {moodData && (
            <ActionableInsights borderType="heavy" data={moodData} />
          )}

          {/* Recent Conversation Summaries */}
          <div className="mt-4">
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
