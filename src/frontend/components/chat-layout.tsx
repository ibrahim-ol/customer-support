import { PropsWithChildren } from "hono/jsx";
import { Constants } from "../../utils/constants.ts";

export function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="text-black p-4 border-b border-black">
        <h1 className="text-2xl font-bold text-center">{Constants.APP_NAME}</h1>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <footer className="bg-black text-white py-1 px-4 text-sm flex justify-between">
        <p>Powered by Hono</p>
        <p>Written by Lere</p>
      </footer>
    </div>
  );
}
