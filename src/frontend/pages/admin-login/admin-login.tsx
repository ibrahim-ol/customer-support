import { useState } from "hono/jsx";
import { BaseLayout } from "../../../utils/view.tsx";

export function AdminLoginView({ error }: { error?: string }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <BaseLayout>
      <div className="flex flex-col h-screen bg-white">
        <header className="text-black px-4 py-2 border-b border-black">
          <h1 className="text-lg font-bold text-center">Admin Login</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                Welcome Back
              </h2>
              <p className="text-black text-sm">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form
              action="/admin/login"
              method="post"
              className="space-y-6"
              onSubmit={() => setSubmitted(true)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="border border-black bg-white px-4 py-3 text-sm text-black">
                  <strong>Error:</strong>{" "}
                  {error === "invalid_credentials" &&
                    "Invalid username or password"}
                  {error === "missing_fields" && "Please fill in all fields"}
                  {error !== "invalid_credentials" &&
                    error !== "missing_fields" &&
                    error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-black text-white px-4 py-3 hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium border border-black"
              >
                {submitted ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </BaseLayout>
  );
}
