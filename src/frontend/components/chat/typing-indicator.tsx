interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-white text-black border border-black px-4 py-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse">Assistant is typing...</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-black rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-black rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
