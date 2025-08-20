import { PropsWithChildren } from "hono/jsx";
import { Constants } from "../../utils/constants.ts";

export function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="text-black px-4 py-2 border-b border-black">
        <h1 className="text-lg font-bold text-center">{Constants.APP_NAME}</h1>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
