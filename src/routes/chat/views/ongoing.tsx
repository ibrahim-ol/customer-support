"use client";
import { useEffect, useState } from "hono/jsx";
import { ChatLayout } from "./layout.tsx";
import { chat } from "../../../db/schema.ts";
export function OngoingChatView({
  messages: _message,
}: {
  messages: (typeof chat.$inferSelect)[];
}) {
  const [messages, setMessages] = useState(_message);
  useEffect(() => {
    console.log("Rendering ", { messages });
  }, []);
  return (
    <ChatLayout>
      <div className="flex h-full flex-1 justify-center items-center flex-col">
        <h1 className="text-2xl font-bold">Ongoing Chat</h1>
        <p className="text-gray-500">
          You are currently chatting with someone.
        </p>
        <p>There are {messages.length} messages.</p>
      </div>
    </ChatLayout>
  );
}
