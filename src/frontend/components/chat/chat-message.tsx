interface ChatMessage {
  id: string;
  message: string;
  role: "user" | "assistant";
  conversationId: string;
  createdAt: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isOptimistic = message.id.startsWith("optimistic-");

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
          message.role === "user"
            ? isOptimistic
              ? "bg-gray-600 text-white opacity-75"
              : "bg-black text-white"
            : "bg-white text-black border border-black"
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.message}
          {isOptimistic && (
            <span className="inline-block ml-2 text-xs">⏳</span>
          )}
        </div>
        <div
          className={`text-xs mt-2 ${
            message.role === "user" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message.role === "user" ? "You" : "Assistant"} •{" "}
          {new Date(message.createdAt).toLocaleTimeString()}
          {isOptimistic && (
            <span className="ml-1 text-xs opacity-75">(sending...)</span>
          )}
        </div>
      </div>
    </div>
  );
}
