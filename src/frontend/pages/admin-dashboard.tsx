import { BaseLayout } from "../../utils/view.tsx";

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-black p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                      <span className="text-sm font-bold">💬</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-black">
                      Total Conversations
                    </h3>
                    <p className="text-2xl font-bold text-black">--</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                      <span className="text-sm font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-black">
                      Active Users
                    </h3>
                    <p className="text-2xl font-bold text-black">--</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                      <span className="text-sm font-bold">⚙️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-black">
                      System Status
                    </h3>
                    <p className="text-2xl font-bold text-black">Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4">
                Quick Actions
              </h2>
              <div className="bg-white border border-black">
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mb-2">👥</span>
                      <span className="text-sm font-medium text-black">
                        Manage Users
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mb-2">💬</span>
                      <span className="text-sm font-medium text-black">
                        View Chats
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mb-2">📈</span>
                      <span className="text-sm font-medium text-black">
                        Analytics
                      </span>
                    </button>

                    <button className="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mb-2">⚙️</span>
                      <span className="text-sm font-medium text-black">
                        Settings
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-black mb-4">
                Recent Activity
              </h2>
              <div className="bg-white border border-black">
                <div className="p-6">
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📋</span>
                    <p className="text-black font-medium">
                      No recent activity to display
                    </p>
                    <p className="text-sm text-black mt-2">
                      Activity will appear here as users interact with the
                      system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
