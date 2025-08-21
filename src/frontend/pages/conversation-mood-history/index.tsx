import { BaseLayout, setupView } from "../../../utils/view.tsx";
import { useState, useEffect } from "hono/jsx";
import { MoodHistory } from "../../components/mood/mood-history.tsx";
import { useApi, useFetch } from "../../hooks/useApi.ts";
import { MoodCategory } from "../../../types/mood.ts";
import { AdminHeader } from "../../components/admin-header.tsx";
import { formatDate } from "../../components/utils.tsx";

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
  const [conversationId, setConversationId] = useState<string>("");
  const moodApi = useFetch<MoodHistoryResponse>(
    `/admin/api/conversations/${conversationId}/mood`,
    true,
    !!conversationId,
  );
  const conversationApi = useFetch<ConversationResponse>(
    `/admin/api/conversations/${conversationId}`,
    true,
    !!conversationId,
  );

  // Extract conversation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/admin\/conversations\/([^\/]+)\/mood/);
    if (matches && matches[1]) {
      setConversationId(matches[1]);
    }
  }, []);

  const moodData = moodApi.data?.data;
  const conversationData = conversationApi.data?.data;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <AdminHeader
        title="Mood History"
        back={{ text: "Back to Conversations", link: "/admin/conversations" }}
      />

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
