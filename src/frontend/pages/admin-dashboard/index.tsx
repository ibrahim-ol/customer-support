import { BaseLayout } from "../../../utils/view.tsx";
import {
  StatsCard,
  ActionCard,
  ContentCard,
  EmptyState,
} from "../../components/cards/index.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { useEffect } from "hono/jsx";

interface StatsResponse {
  success: boolean;
  data: {
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
  };
}

export function AdminDashboardView() {
  const statsApi = useApi<StatsResponse>();

  // Fetch stats on mount
  useEffect(() => {
    statsApi.execute("/admin/api/stats", {
      credentials: "include",
    });
  }, []);

  const stats = statsApi.data?.data;

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

            {statsApi.error && (
              <div className="mb-8">
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-red-600">
                    Error loading statistics: {statsApi.error}
                  </div>
                </div>
              </div>
            )}

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

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">
                Recent Activity
              </h2>
              <ContentCard>
                <EmptyState
                  icon="📋"
                  title="No recent activity to display"
                  description="Activity will appear here as users interact with the system"
                />
              </ContentCard>
            </div>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
