import { PropsWithChildren } from "hono/jsx";

interface ChatHeaderProps {
  conversationId: string;
  onRefresh: () => void;
  isLoading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

export function ChatHeader({
  conversationId,
  onRefresh,
  isLoading,
  error,
  onErrorDismiss
}: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-black p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black">
          Conversation: {conversationId.slice(0, 8)}...
        </h2>
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
