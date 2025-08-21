import { FC } from "hono/jsx";
import { Markdown } from "../markdown.tsx";

interface ConversationSummaryProps {
  summary: string;
  isLoading?: boolean;
  className?: string;
  showTitle?: boolean;
}

export const ConversationSummary: FC<ConversationSummaryProps> = ({
  summary,
  isLoading = false,
  className = "",
  showTitle = true,
}) => {
  if (isLoading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Conversation Summary
          </h3>
        )}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary || summary.trim() === "") {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Conversation Summary
          </h3>
        )}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="text-center py-4">
            <div className="text-gray-400 text-3xl mb-2">📝</div>
            <p className="text-gray-500 text-sm">
              No summary available yet. Summaries are generated after
              conversation interactions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Conversation Summary
        </h3>
      )}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          <Markdown content={summary} />
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center text-xs text-blue-600">
            <span className="mr-1">🤖</span>
            <span>AI-generated summary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
