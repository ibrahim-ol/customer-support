import { BaseLayout } from "../../utils/view.tsx";

export function AdminDashboardView() {
  return (
    <BaseLayout>
      <div className="min-h-screen bg-off-white">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-charcoal">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral">Welcome, Admin</span>
                <a
                  href="/admin/logout"
                  className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">💬</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral truncate">
                          Total Conversations
                        </dt>
                        <dd className="text-lg font-medium text-charcoal">
                          --
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-accent-dark rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral truncate">
                          Active Users
                        </dt>
                        <dd className="text-lg font-medium text-charcoal">
                          --
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-accent-light rounded-full flex items-center justify-center">
                        <span className="text-charcoal text-sm font-medium">⚙️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral truncate">
                          System Status
                        </dt>
                        <dd className="text-lg font-medium text-charcoal">
                          Online
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-charcoal mb-4">
                Quick Actions
              </h2>
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 border border-light-gray rounded-lg hover:bg-off-white transition-colors duration-200">
                      <span className="text-2xl mb-2">👥</span>
                      <span className="text-sm font-medium text-charcoal">
                        Manage Users
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-light-gray rounded-lg hover:bg-off-white transition-colors duration-200">
                      <span className="text-2xl mb-2">💬</span>
                      <span className="text-sm font-medium text-charcoal">
                        View Chats
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-light-gray rounded-lg hover:bg-off-white transition-colors duration-200">
                      <span className="text-2xl mb-2">📈</span>
                      <span className="text-sm font-medium text-charcoal">
                        Analytics
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-light-gray rounded-lg hover:bg-off-white transition-colors duration-200">
                      <span className="text-2xl mb-2">⚙️</span>
                      <span className="text-sm font-medium text-charcoal">
                        Settings
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-charcoal mb-4">
                Recent Activity
              </h2>
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="text-center text-neutral py-8">
                    <span className="text-4xl mb-4 block">📋</span>
                    <p>No recent activity to display</p>
                    <p className="text-sm mt-2">
                      Activity will appear here as users interact with the system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
