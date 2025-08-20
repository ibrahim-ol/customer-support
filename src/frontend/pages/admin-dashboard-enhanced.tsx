import { BaseLayout } from "../../utils/view.tsx";
import {
  StatsCard,
  ActionCard,
  ContentCard,
  EmptyState,
} from "../components/cards/index.tsx";

export function EnhancedAdminDashboardView() {
  return (
    <BaseLayout>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="text-black px-4 py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">Enhanced Admin Dashboard</h1>
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Dashboard Navigation */}
            <div>
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
                    <a
                      href="/admin/dashboard"
                      className="bg-white text-black px-3 py-1 border border-black hover:bg-gray-50 transition-colors text-xs font-medium"
                    >
                      Standard
                    </a>
                    <span className="bg-black text-white px-3 py-1 text-xs font-medium">
                      Enhanced
                    </span>
                  </div>
                </div>
              </ContentCard>
            </div>

            {/* Key Metrics Row */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Conversations"
                  value="1,247"
                  icon="💬"
                />
                <StatsCard title="Active Users" value="89" icon="👥" />
                <StatsCard title="Response Time" value="2.3s" icon="⚡" />
                <StatsCard title="Satisfaction" value="94%" icon="⭐" />
              </div>
            </div>

            {/* System Health */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">
                System Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Server Status" value="Online" icon="🟢" />
                <StatsCard title="Database" value="Healthy" icon="🗄️" />
                <StatsCard title="AI Service" value="Active" icon="🤖" />
              </div>
            </div>

            {/* Management Actions */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">Management</h2>
              <ContentCard>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ActionCard
                    title="User Management"
                    description="Manage user accounts"
                    icon="👥"
                    href="/admin/users"
                  />
                  <ActionCard
                    title="Conversation Logs"
                    description="View chat history"
                    icon="💬"
                    href="/admin/conversations"
                  />
                  <ActionCard
                    title="System Logs"
                    description="Monitor system activity"
                    icon="📋"
                    href="/admin/logs"
                  />
                  <ActionCard
                    title="Backup & Restore"
                    description="Data management"
                    icon="💾"
                    href="/admin/backup"
                  />
                </div>
              </ContentCard>
            </div>

            {/* Analytics & Reports */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">
                Analytics & Reports
              </h2>
              <ContentCard>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ActionCard
                    title="Usage Analytics"
                    description="User engagement metrics"
                    icon="📊"
                    href="/admin/analytics/usage"
                  />
                  <ActionCard
                    title="Performance Reports"
                    description="System performance data"
                    icon="📈"
                    href="/admin/analytics/performance"
                  />
                  <ActionCard
                    title="Export Data"
                    description="Download reports"
                    icon="📤"
                    onClick={() => console.log("Export data")}
                  />
                </div>
              </ContentCard>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <ContentCard title="Recent Activity">
                <div className="space-y-4">
                  <div className="border-b border-black pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-black">
                          New user registered
                        </p>
                        <p className="text-xs text-black">user@example.com</p>
                      </div>
                      <span className="text-xs text-black">2 min ago</span>
                    </div>
                  </div>

                  <div className="border-b border-black pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-black">
                          System backup completed
                        </p>
                        <p className="text-xs text-black">
                          Database backup successful
                        </p>
                      </div>
                      <span className="text-xs text-black">1 hour ago</span>
                    </div>
                  </div>

                  <div className="border-b border-black pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-black">
                          High conversation volume
                        </p>
                        <p className="text-xs text-black">
                          Peak usage detected
                        </p>
                      </div>
                      <span className="text-xs text-black">3 hours ago</span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href="/admin/activity"
                      className="text-sm text-black hover:text-gray-800 font-medium"
                    >
                      View all activity →
                    </a>
                  </div>
                </div>
              </ContentCard>

              {/* Quick Stats */}
              <ContentCard title="Quick Stats">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">
                      Today's Conversations
                    </span>
                    <span className="text-sm font-bold text-black">127</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">
                      Average Session Length
                    </span>
                    <span className="text-sm font-bold text-black">8:34</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Peak Hour</span>
                    <span className="text-sm font-bold text-black">
                      2:00 PM
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Resolution Rate</span>
                    <span className="text-sm font-bold text-black">87%</span>
                  </div>

                  <div className="border-t border-black pt-4">
                    <ActionCard
                      title="Generate Report"
                      icon="📋"
                      onClick={() => console.log("Generate report")}
                    />
                  </div>
                </div>
              </ContentCard>
            </div>

            {/* System Alerts */}
            <ContentCard title="System Alerts">
              <EmptyState
                icon="✅"
                title="All systems operational"
                description="No alerts or warnings at this time"
                action={{
                  text: "View System Status",
                  href: "/admin/status",
                }}
              />
            </ContentCard>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
