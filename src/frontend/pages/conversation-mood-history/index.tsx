import { BaseLayout, setupView } from "../../../utils/view.tsx";
import { useState, useEffect } from "hono/jsx";
import { MoodHistory } from "../../components/mood/mood-history.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { MoodCategory } from "../../../types/mood.ts";

interface MoodHistoryEntry {
  id: string;
  mood: MoodCategory;
  messageId: string | null;
  createdAt: string;
}

interface MoodHistoryData {
  conversationId: string;
  currentMood: MoodCategory | null;
  moodHistory: MoodHistoryEntry[];
  totalEntries: number;
  moodChanged: boolean;
}

interface MoodHistoryResponse {
  success: boolean;
  data: MoodHistoryData;
}

interface ConversationResponse {
  success: boolean;
  data: {
    id: string;
    customerName: string;
    channel: string;
    status: "active" | "killed";
    mood: MoodCategory;
    createdAt: string;
  };
}

function ConversationMoodHistoryView() {
  const moodApi = useApi<MoodHistoryResponse>();
  const conversationApi = useApi<ConversationResponse>();
  const [conversationId, setConversationId] = useState<string>("");

  // Extract conversation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/admin\/conversations\/([^\/]+)\/mood/);
    if (matches && matches[1]) {
      setConversationId(matches[1]);
    }
  }, []);

  // Fetch mood history and conversation details when ID is available
  useEffect(() => {
    if (conversationId) {
      moodApi.execute(`/admin/api/conversations/${conversationId}/mood`, {
        credentials: "include",
      });
      conversationApi.execute(`/admin/api/conversations/${conversationId}`, {
        credentials: "include",
      });
    }
  }, [conversationId]);

  const moodData = moodApi.data?.data;
  const conversationData = conversationApi.data?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="text-black px-4 py-2 border-b border-black">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a
              href="/admin/conversations"
              className="text-black hover:text-gray-600 transition-colors"
            >
              ← Back to Conversations
            </a>
            <h1 className="text-lg font-bold">Mood History</h1>
          </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Conversation Info */}
          {conversationData && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {conversationData.customerName || "Anonymous Customer"}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>Channel: {conversationData.channel}</span>
                    <span>
                      Created: {formatDate(conversationData.createdAt)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        conversationData.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {conversationData.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    Conversation ID
                  </div>
                  <div className="text-xs font-mono bg-white px-2 py-1 rounded border">
                    {conversationId}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Handling */}
          {(moodApi.error || conversationApi.error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-600">
                {moodApi.error && `Error loading mood data: ${moodApi.error}`}
                {moodApi.error && conversationApi.error && " | "}
                {conversationApi.error &&
                  `Error loading conversation: ${conversationApi.error}`}
              </div>
            </div>
          )}

          {/* Loading State */}
          {(moodApi.isLoading || conversationApi.isLoading) && (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading mood history...</div>
            </div>
          )}

          {/* Mood History Component */}
          {!moodApi.isLoading && !conversationApi.isLoading && moodData && (
            <MoodHistory
              data={moodData!}
              isLoading={moodApi.isLoading}
              error={moodApi.error || undefined}
            />
          )}

          {/* No Data State */}
          {!moodApi.isLoading &&
            !moodData &&
            !moodApi.error &&
            conversationId && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😐</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No mood data found
                </h3>
                <p className="text-gray-600">
                  This conversation doesn't have any mood tracking data yet.
                </p>
              </div>
            )}

          {/* Invalid ID State */}
          {!conversationId && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invalid conversation ID
              </h3>
              <p className="text-gray-600">
                Please check the URL and try again.
              </p>
              <a
                href="/admin/conversations"
                className="inline-block mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Back to Conversations
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

setupView(ConversationMoodHistoryView);
