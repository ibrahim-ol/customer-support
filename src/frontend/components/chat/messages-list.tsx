import { useRef, useEffect } from "hono/jsx";
import { ChatMessage } from "./chat-message.tsx";
import { LoadingIndicator } from "./loading-indicator.tsx";
import { EmptyState } from "./empty-state.tsx";
import { TypingIndicator } from "./typing-indicator.tsx";
import { ConversationKilledNotice } from "./conversation-killed-notice.tsx";

interface Message {
  id: string;
  message: string;
  role: "user" | "assistant";
  conversationId: string;
  createdAt: Date;
}

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  isConversationKilled?: boolean;
}

export function MessagesList({
  messages,
  isLoading,
  isSending,
  isConversationKilled,
}: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {isLoading && messages.length === 0 ? (
        <LoadingIndicator message="Loading messages..." />
      ) : messages.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <TypingIndicator isVisible={isSending} />
          {isConversationKilled && (
            <ConversationKilledNotice className="mt-4" />
          )}
        </>
      )}

      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
