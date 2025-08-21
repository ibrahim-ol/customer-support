export function ConversationKilledNotice({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-500 text-xl">🚫</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Conversation Closed
          </h3>
          <div className="mt-1 text-sm text-red-700">
            <p>
              This conversation has been closed by support staff. No new
              messages can be sent.
            </p>
          </div>
          <div className="mt-3">
            <a
              href="/chat/new"
              className="inline-flex items-center text-sm font-medium text-red-800 hover:text-red-600"
            >
              Start a new conversation
              <span className="ml-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
