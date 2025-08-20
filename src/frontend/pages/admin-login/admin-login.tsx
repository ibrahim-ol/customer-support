import { useState } from "hono/jsx";
import { BaseLayout } from "../../../utils/view.tsx";

export function AdminLoginView({ error }: { error?: string }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <BaseLayout>
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-charcoal">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-neutral">
              Sign in to access the admin dashboard
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            action="/admin/login"
            method="post"
            onSubmit={() => setSubmitted(true)}
          >
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-light-gray placeholder-neutral text-charcoal focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-light-gray placeholder-neutral text-charcoal focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error === "invalid_credentials" &&
                  "Invalid username or password"}
                {error === "missing_fields" && "Please fill in all fields"}
                {error !== "invalid_credentials" &&
                  error !== "missing_fields" &&
                  error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitted}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitted ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseLayout>
  );
}
