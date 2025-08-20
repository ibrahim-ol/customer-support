import { useState } from "hono/jsx";
import { ChatLayout } from "../../components/chat-layout.tsx";
import { hc } from "hono/client";

export function OngoingChatView() {
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = (message: string) => {
    setMessages((m) => [...m, message]);
  };
  // TODO load chat;
  return (
    <ChatLayout>
      <div className="flex h-full flex-1 justify-center items-center flex-col">
        <h1 className="text-2xl font-bold">Ongoing Chat</h1>
        <p className="text-gray-500">
          You are currently chatting with someone.
        </p>
        <p>There are {messages.length} messages.</p>
        <button onClick={() => addMessage("Hello!")}>Add message</button>
      </div>
    </ChatLayout>
  );
}
