import { useState, useEffect } from "hono/jsx";
import { ChatLayout } from "../../components/chat-layout.tsx";
import { useChatMessages } from "../../hooks/useApi.ts";
import {
  ChatHeader,
  MessagesList,
  MessageInput,
} from "../../components/chat/index.tsx";

export function OngoingChatView() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { messages, send } = useChatMessages(conversationId);

  // Get conversation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("/").pop();
    if (id && id !== "view") {
      setConversationId(id);
    }
  }, []);

  // Handle message sending
  const handleSendMessage = async (message: string) => {
    if (!conversationId || send.isSending) return;

    try {
      // Optimistic update is now handled in the hook
      const { data } = await send.execute(conversationId, message);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (conversationId) {
      messages.refresh(conversationId);
    }
  };

  // Handle error dismissal
  const handleErrorDismiss = () => {
    messages.setError(null);
    send.setError(null);
  };

  if (!conversationId) {
    return (
      <ChatLayout>
        <div className="flex h-full w-full justify-center items-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-black">
              No conversation selected
            </h2>
            <p className="text-gray-800 mt-2">
              Please select or start a conversation.
            </p>
            <a
              href="/chat/view"
              className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start New Chat
            </a>
          </div>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <div className="flex flex-col h-full w-full">
        <ChatHeader
          conversationId={conversationId}
          onRefresh={handleRefresh}
          isLoading={messages.isLoading}
          error={messages.error}
          onErrorDismiss={handleErrorDismiss}
        />

        <MessagesList
          messages={messages.list}
          isLoading={messages.isLoading}
          isSending={send.isSending}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          isDisabled={send.isSending}
          messageCount={messages.list.length}
        />
      </div>
    </ChatLayout>
  );
}
