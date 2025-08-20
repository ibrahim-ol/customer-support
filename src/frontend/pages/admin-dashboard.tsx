import { BaseLayout } from "../../utils/view.tsx";
import {
  StatsCard,
  ActionCard,
  ContentCard,
  EmptyState,
} from "../components/cards/index.tsx";

export function AdminDashboardView() {
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
            {/* Dashboard Navigation */}
            <div className="mb-6">
              <ContentCard>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-black">
                      Dashboard View
                    </h3>
                    <p className="text-xs text-black">
                      Switch between dashboard layouts
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-black text-white px-3 py-1 text-xs font-medium">
                      Standard
                    </span>
                    <a
                      href="/admin/dashboard/enhanced"
                      className="bg-white text-black px-3 py-1 border border-black hover:bg-gray-50 transition-colors text-xs font-medium"
                    >
                      Enhanced
                    </a>
                  </div>
                </div>
              </ContentCard>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard title="Total Conversations" value="--" icon="💬" />
              <StatsCard title="Active Users" value="--" icon="👥" />
              <StatsCard title="System Status" value="Online" icon="⚙️" />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">
                Quick Actions
              </h2>
              <ContentCard>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ActionCard
                    title="Manage Users"
                    icon="👥"
                    onClick={() => console.log("Navigate to users")}
                  />
                  <ActionCard
                    title="View Chats"
                    icon="💬"
                    href="/admin/chats"
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
