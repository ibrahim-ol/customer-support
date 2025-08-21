import { ConversationDetails } from "./types.ts";

export function ChatMessages({
  isLoading,
  selectedConversation,
}: {
  isLoading: boolean;
  selectedConversation?: ConversationDetails;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading conversation...</div>
        </div>
      ) : (
        <>
          {selectedConversation?.status === "killed" && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800 font-medium text-center">
                🚫 This conversation has been killed. The user cannot send new
                messages.
              </div>
            </div>
          )}
          <div className="space-y-4 mx-auto">
            {selectedConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black border border-gray-300"
                  }`}
                >
                  <div className="mb-1">
                    <div className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`text-xs ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </span>

                    {message.role === "user"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const formatMessageTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
