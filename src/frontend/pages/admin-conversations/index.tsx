import { setupView } from "../../../utils/view.tsx";
import { useState, useEffect } from "hono/jsx";
import { ConversationSummary } from "../../components/summary/index.tsx";
import { useApi, useFetch } from "../../hooks/useApi.ts";
import {
  formatDate,
  getMoodColor,
  getMoodEmoji,
} from "../../components/utils.tsx";
import { AdminHeader } from "../../components/admin-header.tsx";
import { ConversationSidebar } from "./conversations-sidebar.tsx";
import { ConversationDetailResponse, ConversationsResponse } from "./types.ts";
import { ChatMessages } from "./messages.tsx";
import { useRouteQuery } from "../../hooks/common-api-hooks.ts";

function AdminConversationsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const conversationsApi = useFetch<ConversationsResponse>(
    "/admin/api/conversations",
    true,
  );
  const conversationDetailApi = useFetch<ConversationDetailResponse>(
    `/admin/api/conversations/${selectedId}`,
    true,
    !!selectedId,
  );
  const killApi = useApi<{ success: boolean; message: string }>();
  const reactivateApi = useApi<{ success: boolean; message: string }>();
  const selectedQueryId = useRouteQuery("selected");
  // Handle pre-selection via query parameter
  useEffect(() => {
    if (selectedQueryId) {
      setSelectedId(selectedQueryId);
    }
  }, [selectedQueryId]);

  const selectedConversation = conversationDetailApi.data?.data;

  const handleKillConversation = async (conversationId: string) => {
    if (
      !confirm(
        "Are you sure you want to kill this conversation? The user will not be able to send new messages.",
      )
    ) {
      return;
    }

    const response = await killApi.execute(
      `/admin/api/conversations/${conversationId}/kill`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (response?.success) {
      // Refresh conversations list and selected conversation
      conversationsApi.refresh();
      conversationDetailApi.refresh();
    }
  };

  const handleReactivateConversation = async (conversationId: string) => {
    const response = await reactivateApi.execute(
      `/admin/api/conversations/${conversationId}/reactivate`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (response?.success) {
      // Refresh conversations list and selected conversation
      conversationsApi.refresh();
      conversationDetailApi.refresh();
      // TODO toast
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <AdminHeader
        title="Conversations"
        back={{ text: "Back to Dashboard", link: "/admin/dashboard" }}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversations List */}
        <ConversationSidebar
          conversationsApi={conversationsApi}
          selectedId={selectedId}
          onSelectConversation={(id) => setSelectedId(id)}
        />
        {/* Main Content Area - Conversation Details */}
        <div className="flex-1 flex flex-col">
          {conversationDetailApi.error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="text-red-600">
                Error loading conversation: {conversationDetailApi.error}
              </div>
            </div>
          )}

          {selectedConversation?.id ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-300 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-black">
                        {selectedConversation.customerName || "Anonymous"}
                      </h2>
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded border ${getMoodColor(
                          selectedConversation.mood,
                        )}`}
                        title={`Current mood: ${selectedConversation.mood}`}
                      >
                        {getMoodEmoji(selectedConversation.mood)}{" "}
                        {selectedConversation.mood}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          selectedConversation.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedConversation.status === "active"
                          ? "ACTIVE"
                          : "KILLED"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Channel: {selectedConversation.channel}</span>
                      <span>
                        Created: {formatDate(selectedConversation.createdAt)}
                      </span>
                      <span>
                        {selectedConversation.messages.length} messages
                      </span>
                      <button
                        className="text-blue-600 hover:text-blue-800 underline"
                        onClick={() =>
                          window.open(
                            `/admin/conversations/${selectedConversation.id}/mood`,
                          )
                        }
                      >
                        View Mood History
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {selectedConversation.status === "active" ? (
                      <button
                        onClick={() =>
                          handleKillConversation(selectedConversation.id)
                        }
                        disabled={killApi.isLoading}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium border border-red-600"
                      >
                        {killApi.isLoading ? "Killing..." : "Kill Conversation"}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleReactivateConversation(selectedConversation.id)
                        }
                        disabled={reactivateApi.isLoading}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium border border-green-600"
                      >
                        {reactivateApi.isLoading
                          ? "Reactivating..."
                          : "Reactivate"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1  overflow-y-auto ">
                {/* Conversation Summary */}
                <ConversationSummary
                  summary={selectedConversation.summary}
                  isLoading={conversationDetailApi.isLoading}
                  showTitle={true}
                  className="max-w-none pt-4  px-4 bg-gray-50"
                />
                {/* Messages */}
                <ChatMessages
                  isLoading={conversationsApi.isLoading}
                  selectedConversation={selectedConversation}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Select a conversation to view details
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to see the full message
                  history
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

setupView(AdminConversationsView);
