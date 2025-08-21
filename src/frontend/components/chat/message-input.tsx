import { useState, useCallback } from "hono/jsx";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
  messageCount: number;
}

export function MessageInput({ onSendMessage, isDisabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  // Auto-expand textarea
  const handleTextareaChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setMessage(target.value);

    // Auto-resize textarea
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 120) + "px";
  };

  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!message.trim() || isDisabled) return;

    onSendMessage(message.trim());
    setMessage("");

    // Reset textarea height
    const textarea = (e.target as HTMLFormElement).querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!message.trim() || isDisabled) return;

      onSendMessage(message.trim());
      setMessage("");

      // Reset textarea height
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
    }
  };

  return (
    <div className="bg-white border-t border-black p-4">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            placeholder="Type your message..."
            className="w-full resize-none border border-black rounded-lg px-4 py-3 focus:outline-none focus:ring focus:ring-black focus:border-black text-black"
            rows={inputFocus ? 4 : 1}
            disabled={isDisabled}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled || !message.trim()}
          className="bg-black text-white self-end px-6 py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 min-w-[80px] justify-center"
        >
          {isDisabled ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <span>Send</span>
          )}
        </button>
      </form>
      <div className="mt-2 text-xs text-black flex justify-between">
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
}
