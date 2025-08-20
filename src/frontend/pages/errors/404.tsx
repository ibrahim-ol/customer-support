import { BaseLayout } from "../../../utils/view.tsx";

export function NotFoundPage() {
  return (
    <BaseLayout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full text-center">
          <div className="mb-12">
            <h1 className="text-8xl md:text-9xl font-black text-black mb-6">
              404
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              Page Not Found
            </h2>
            <p className="text-black text-base md:text-lg mb-8 leading-relaxed">
              Sorry, the page you are looking for doesn't exist or has been
              moved.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <a
              href="/chat/new"
              className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-2xl transition-colors duration-200 w-full border border-black"
            >
              Start a New Chat
            </a>
            <a
              href="/"
              className="inline-block border-2 border-black text-black hover:bg-black hover:text-white font-medium py-3 px-6 rounded-2xl transition-colors duration-200 w-full"
            >
              Go Home
            </a>
          </div>

          <div className="text-sm text-black border border-black rounded-2xl p-4">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
