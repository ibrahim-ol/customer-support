import { BaseLayout } from "../../../utils/view.tsx";
import { useState, useEffect } from "hono/jsx";
import { ContentCard } from "../../components/cards/index.tsx";
import { ConversationSummary } from "../../components/summary/index.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { MoodCategory } from "../../../types/mood.ts";

interface Message {
  id: string;
  message: string;
  role: "user" | "assistant";
  userId: string | null;
  createdAt: string;
}

interface ConversationListItem {
  id: string;
  customerName: string;
  channel: string;
  status: "active" | "killed";
  mood: MoodCategory;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
  summaryPreview: string;
}

interface ConversationDetails extends ConversationListItem {
  messages: Message[];
  summary: string;
}

interface ConversationsResponse {
  success: boolean;
  data: ConversationListItem[];
}

interface ConversationDetailResponse {
  success: boolean;
  data: ConversationDetails;
}

export function AdminConversationsView() {
  const conversationsApi = useApi<ConversationsResponse>();
  const conversationDetailApi = useApi<ConversationDetailResponse>();
  const killApi = useApi<{ success: boolean; message: string }>();
  const reactivateApi = useApi<{ success: boolean; message: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch conversations list on mount
  useEffect(() => {
    conversationsApi.execute("/admin/api/conversations", {
      credentials: "include",
    });
  }, []);

  // Handle pre-selection via query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedParam = urlParams.get("selected");
    if (selectedParam && conversationsApi.data?.data) {
      const conversationExists = conversationsApi.data.data.find(
        (c) => c.id === selectedParam,
      );
      if (conversationExists) {
        handleSelectConversation(selectedParam);
      }
    }
  }, [conversationsApi.data?.data]);

  // Fetch conversation details when selected
  const handleSelectConversation = async (conversationId: string) => {
    setSelectedId(conversationId);
    await conversationDetailApi.execute(
      `/admin/api/conversations/${conversationId}`,
      {
        credentials: "include",
      },
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const conversations = conversationsApi.data?.data || [];
  const selectedConversation = conversationDetailApi.data?.data;

  const getMoodEmoji = (mood: MoodCategory): string => {
    const emojis: Record<MoodCategory, string> = {
      happy: "😊",
      frustrated: "😤",
      confused: "😕",
      angry: "😠",
      satisfied: "😌",
      neutral: "😐",
      excited: "🤩",
      disappointed: "😞",
    };
    return emojis[mood];
  };

  const getMoodColor = (mood: MoodCategory): string => {
    const colors: Record<MoodCategory, string> = {
      happy: "text-green-600 bg-green-50",
      frustrated: "text-orange-600 bg-orange-50",
      confused: "text-yellow-600 bg-yellow-50",
      angry: "text-red-600 bg-red-50",
      satisfied: "text-blue-600 bg-blue-50",
      neutral: "text-gray-600 bg-gray-50",
      excited: "text-purple-600 bg-purple-50",
      disappointed: "text-indigo-600 bg-indigo-50",
    };
    return colors[mood];
  };

  const handleKillConversation = async (conversationId: string) => {
    if (
      !confirm(
        "Are you sure you want to kill this conversation? The user will not be able to send new messages.",
      )
    ) {
      return;
    }

    await killApi.execute(`/admin/api/conversations/${conversationId}/kill`, {
      method: "POST",
      credentials: "include",
    });

    if (killApi.data?.success) {
      // Refresh conversations list and selected conversation
      conversationsApi.execute("/admin/api/conversations", {
        credentials: "include",
      });
      if (selectedId === conversationId) {
        conversationDetailApi.execute(
          `/admin/api/conversations/${conversationId}`,
          {
            credentials: "include",
          },
        );
      }
    }
  };

  const handleReactivateConversation = async (conversationId: string) => {
    await reactivateApi.execute(
      `/admin/api/conversations/${conversationId}/reactivate`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (reactivateApi.data?.success) {
      // Refresh conversations list and selected conversation
      conversationsApi.execute("/admin/api/conversations", {
        credentials: "include",
      });
      if (selectedId === conversationId) {
        conversationDetailApi.execute(
          `/admin/api/conversations/${conversationId}`,
          {
            credentials: "include",
          },
        );
      }
    }
  };

  return (
    <BaseLayout>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="text-black px-4 py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a
                href="/admin/dashboard"
                className="text-black hover:text-gray-600 transition-colors"
              >
                ← Back to Dashboard
              </a>
              <h1 className="text-lg font-bold">Conversations</h1>
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
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Conversations List */}
          <div className="w-1/3 border-r border-black bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-black">
                  All Conversations ({conversations.length})
                </h2>
                <button
                  onClick={() =>
                    conversationsApi.execute("/admin/api/conversations", {
                      credentials: "include",
                    })
                  }
                  disabled={conversationsApi.isLoading}
                  className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {conversationsApi.isLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {conversationsApi.error && (
                <div className="text-center py-8">
                  <div className="text-red-600 p-4 border border-red-200 bg-red-50">
                    Error: {conversationsApi.error}
                  </div>
                </div>
              )}

              {conversationsApi.isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading conversations...</div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">No conversations found</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedId === conversation.id
                          ? "bg-gray-200 border-black"
                          : ""
                      }`}
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-black truncate">
                            {conversation.customerName || "Anonymous"}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getMoodColor(
                              conversation.mood,
                            )}`}
                            title={`Mood: ${conversation.mood}`}
                          >
                            {getMoodEmoji(conversation.mood)}
                          </span>
                          {conversation.status === "killed" && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                              KILLED
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {conversation.channel}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 truncate mb-2">
                        {conversation.lastMessage || "No messages"}
                      </p>

                      {conversation.summaryPreview && (
                        <div className="bg-blue-50 border-l-2 border-blue-200 p-2 mb-2 rounded-r text-xs">
                          <div className="text-blue-600 font-medium mb-1 flex items-center">
                            <span className="mr-1">🤖</span>
                            Summary:
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {conversation.summaryPreview}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{conversation.messageCount} messages</span>
                        <span>
                          {formatDate(
                            conversation.lastMessageAt ||
                              conversation.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area - Conversation Details */}
          <div className="flex-1 flex flex-col">
            {conversationDetailApi.error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="text-red-600">
                  Error loading conversation: {conversationDetailApi.error}
                </div>
              </div>
            )}

            {selectedConversation ? (
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
                              "_blank",
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
                          {killApi.isLoading
                            ? "Killing..."
                            : "Kill Conversation"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleReactivateConversation(
                              selectedConversation.id,
                            )
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

                  {/* Conversation Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <ConversationSummary
                      summary={selectedConversation.summary}
                      isLoading={conversationDetailApi.isLoading}
                      showTitle={true}
                      className="max-w-none"
                    />
                  </div>
                </div>

                {/* Error Messages */}
                {(killApi.error || reactivateApi.error) && (
                  <div className="p-4 bg-red-50 border-b border-red-200">
                    <div className="text-red-600">
                      Error: {killApi.error || reactivateApi.error}
                    </div>
                  </div>
                )}

                {/* Success Messages */}
                {(killApi.data?.success || reactivateApi.data?.success) && (
                  <div className="p-4 bg-green-50 border-b border-green-200">
                    <div className="text-green-600">
                      {killApi.data?.message || reactivateApi.data?.message}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {conversationDetailApi.isLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600">
                        Loading conversation...
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedConversation.status === "killed" && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                          <div className="text-red-800 font-medium text-center">
                            🚫 This conversation has been killed. The user
                            cannot send new messages.
                          </div>
                        </div>
                      )}
                      <div className="space-y-4 max-w-4xl mx-auto">
                        {selectedConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.role === "user"
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-black border border-gray-300"
                              }`}
                            >
                              <div className="mb-1">
                                <div className="text-sm whitespace-pre-wrap">
                                  {message.message}
                                </div>
                              </div>
                              <div
                                className={`text-xs ${
                                  message.role === "user"
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {formatMessageTime(message.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
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
                    Choose a conversation from the sidebar to see the full
                    message history
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
