import { MoodBadge } from "../../components/mood/mood-badge.tsx";
import {
  formatDate,
  getMoodColor,
  getMoodEmoji,
} from "../../components/utils.tsx";
import { UseFetchReturn } from "../../hooks/useApi.ts";
import { ConversationsResponse } from "./types.ts";

export function ConversationSidebar({
  conversationsApi,
  selectedId,
  onSelectConversation,
}: {
  selectedId: string | null;
  onSelectConversation: (conversationId: string) => void;
  conversationsApi: UseFetchReturn<ConversationsResponse>;
}) {
  const conversations = conversationsApi.data?.data || [];

  return (
    <div className="w-1/4 min-w-[340px] border-r border-black bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-black">
            All Conversations ({conversations.length})
          </h2>
          <button
            onClick={conversationsApi.refresh}
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
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-black truncate">
                      {conversation.customerName || "Anonymous"}
                    </h3>
                    <MoodBadge mood={conversation.mood} />
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
                      conversation.lastMessageAt || conversation.createdAt,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
