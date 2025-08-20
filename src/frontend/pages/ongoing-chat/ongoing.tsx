import { useState, useEffect, useRef } from "hono/jsx";
import { ChatLayout } from "../../components/chat-layout.tsx";

interface ChatMessage {
  id: string;
  message: string;
  role: "user" | "assistant";
  conversationId: string;
  createdAt: Date;
}

interface ApiResponse {
  data: ChatMessage[];
}

export function OngoingChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("/").pop();
    if (id && id !== "view") {
      setConversationId(id);
    }
  }, []);

  // Fetch chat messages
  const fetchMessages = async (convId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/chat/${convId}`);

      if (response.ok) {
        const result: ApiResponse = await response.json();
        setMessages(result.data);
        // Auto-scroll to bottom after loading messages
        setTimeout(() => scrollToBottom(), 100);
      } else {
        const errorData = await response.text();
        setError(`Failed to fetch messages: ${response.status}`);
        console.error("Fetch error:", errorData);
      }
    } catch (err) {
      setError("Network error - could not fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || sending) return;

    const messageToSend = newMessage.trim();

    try {
      setSending(true);
      setError(null);

      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: messageToSend,
        }),
      });

      if (response.ok) {
        // Clear the input immediately on successful send
        setNewMessage("");
        // Refresh messages to get the latest conversation
        await fetchMessages(conversationId);
      } else {
        const errorData = await response.text();
        setError(`Failed to send message: ${response.status}`);
        console.error("Send error:", errorData);
      }
    } catch (err) {
      setError("Network error - could not send message");
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Load messages when conversation ID is available
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-expand textarea
  const handleTextareaChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setNewMessage(target.value);

    // Auto-resize textarea
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 120) + "px";
  };

  if (!conversationId) {
    return (
      <ChatLayout>
        <div className="flex h-full flex-1 justify-center items-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600">
              No conversation selected
            </h2>
            <p className="text-gray-500 mt-2">
              Please select or start a conversation.
            </p>
            <a
              href="/chat/new"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Conversation: {conversationId.slice(0, 8)}...
            </h2>
            <button
              onClick={() => fetchMessages(conversationId)}
              disabled={loading}
              className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-600 hover:text-red-800 font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span>Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-lg">No messages yet.</p>
                <p className="text-sm mt-1">Start the conversation below!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.message}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.role === "user" ? "You" : "Assistant"} •{" "}
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Sending indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">Assistant is typing...</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style="animation-delay: 0.1s"
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style="animation-delay: 0.2s"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                disabled={sending}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 min-w-[80px] justify-center"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <span>Send</span>
              )}
            </button>
          </form>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
