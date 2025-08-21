import { PropsWithChildren } from "hono/jsx";

interface ChatHeaderProps {
  conversationId: string;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

export function ChatHeader({
  onRefresh,
  isLoading,
  error,
  onErrorDismiss,
}: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-black px-4 py-2">
      <div className="flex items-center justify-between">
        <a href="/chat/new" className="text-sm hover:underline">
          New Conversation
        </a>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-black hover:text-gray-700 disabled:opacity-50 text-xl"
          title="Refresh messages"
        >
          ↻
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-white border border-black rounded-lg text-black text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={onErrorDismiss}
            className="ml-2 text-black hover:text-gray-700 font-bold text-lg leading-none"
            title="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
