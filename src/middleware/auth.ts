import { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

// Simple session store (in production, use Redis or database)
const sessions = new Set<string>();

export function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function createSession(sessionId: string): void {
  sessions.add(sessionId);
}

export function validateSession(sessionId: string): boolean {
  return sessions.has(sessionId);
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

export async function requireAdminAuth(c: Context, next: Next) {
  const sessionId = getCookie(c, "admin_session");

  if (!sessionId || !validateSession(sessionId)) {
    return c.redirect("/admin/login");
  }

  await next();
}

export function setAdminSession(c: Context): string {
  const sessionId = generateSessionId();
  createSession(sessionId);

  // Set HTTP-only cookie for security
  setCookie(c, "admin_session", sessionId, {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 3600,
  });

  return sessionId;
}

export function clearAdminSession(c: Context): void {
  const sessionId = getCookie(c, "admin_session");

  if (sessionId) {
    destroySession(sessionId);
  }

  // Clear the cookie
  deleteCookie(c, "admin_session", {
    path: "/",
    httpOnly: true,
    sameSite: "Strict",
  });
}
