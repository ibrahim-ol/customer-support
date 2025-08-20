import { useState } from "hono/jsx";
import { ChatLayout } from "./layout.tsx";

export function StartChatView({ error }: { error?: string }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <ChatLayout>
      <div className="flex h-full flex-1 justify-center items-center flex-col">
        <form
          action="/chat/new"
          method="post"
          className="relative border rounded-2xl border-slate"
          onSubmit={() => setSubmitted(true)}
        >
          <textarea
            required
            name="message"
            minlength={5}
            maxlength={1000}
            rows={2}
            className="px-4 pt-3 pb-8 w-[500px] focus:outline-none max-h-[300px]"
            placeholder="How can I help you today?"
          />
          <button
            disabled={submitted}
            className="text-xs disabled:opacity-50 hover:scale-110 hover:-translate-y-0.5 transition-transform absolute right-2 bottom-2 bg-black text-white px-4 py-1 rounded-full"
            type="submit"
          >
            Send
          </button>
          {error && (
            <p className="absolute -bottom-5 text-sm text-red-500 text-left w-full">
              {error}
            </p>
          )}
        </form>
      </div>
    </ChatLayout>
  );
}
