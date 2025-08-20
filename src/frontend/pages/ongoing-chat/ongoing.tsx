import { useState, useEffect } from "hono/jsx";
import { ChatLayout } from "../../components/chat-layout.tsx";
import { useChatMessages } from "../../hooks/useApi.tsx";
import {
  ChatHeader,
  MessagesList,
  MessageInput,
} from "../../components/chat/index.tsx";

export function OngoingChatView() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { messages, isLoading, error, fetchMessages, sendMessage, setError } =
    useChatMessages();

  // Get conversation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("/").pop();
    if (id && id !== "view") {
      setConversationId(id);
    }
  }, []);

  // Load messages when conversation ID is available
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  // Handle message sending
  const handleSendMessage = async (message: string) => {
    if (!conversationId || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      await sendMessage(conversationId, message);

      // Refresh messages to get the latest conversation including AI response
      await fetchMessages(conversationId);
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  };

  // Handle error dismissal
  const handleErrorDismiss = () => {
    setError(null);
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
          isLoading={isLoading}
          error={error}
          onErrorDismiss={handleErrorDismiss}
        />

        <MessagesList
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          isDisabled={isSending}
          messageCount={messages.length}
        />
      </div>
    </ChatLayout>
  );
}
