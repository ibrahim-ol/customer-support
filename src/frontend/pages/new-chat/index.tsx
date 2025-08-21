import { useState } from "hono/jsx";
import { ChatLayout } from "../../components/chat-layout.tsx";
import { setupView } from "../../../utils/view.tsx";
import { useRouteQuery } from "../../hooks/common-api-hooks.ts";

function StartChatView() {
  const [submitted, setSubmitted] = useState(false);
  const error = useRouteQuery("error");
  return (
    <ChatLayout>
      <div className="flex h-full flex-1 justify-center items-center flex-col">
        <form
          action="/chat/new"
          method="post"
          className="relative border rounded-2xl border-black"
          onSubmit={() => setSubmitted(true)}
        >
          <textarea
            required
            name="message"
            minlength={5}
            maxlength={1000}
            rows={2}
            className="px-4 pt-3 pb-8 w-[500px] focus:outline-none max-h-[300px] text-black"
            placeholder="How can I help you today?"
          />
          <button
            disabled={submitted}
            className="text-xs disabled:opacity-50 hover:right-4 hover:scale-120 hover:-translate-y-0.5 transition-all absolute right-2 bottom-2 bg-black text-white px-4 py-1 rounded-full"
            type="submit"
          >
            {submitted ? "Sending..." : "Send"}
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

setupView(StartChatView);
