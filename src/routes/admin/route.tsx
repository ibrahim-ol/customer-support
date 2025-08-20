import { Hono } from "hono";
import { AdminLoginView } from "../../frontend/pages/admin-login/admin-login.tsx";
import { AdminDashboardView } from "../../frontend/pages/admin-dashboard.tsx";

import {
  requireAdminAuth,
  setAdminSession,
  clearAdminSession,
} from "../../middleware/auth.ts";

const router = new Hono();

// Admin login page
router.get("/login", async (c) => {
  return c.html(<AdminLoginView error={c.req.query("error")} />);
});

// Admin login form handler
router.post("/login", async (c) => {
  const formData = await c.req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // Validate form data
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return c.redirect("/admin/login?error=missing_fields");
  }

  // TODO: Replace with proper authentication logic
  // For now, using simple hardcoded credentials
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return c.redirect("/admin/login?error=invalid_credentials");
  }

  // Set admin session
  setAdminSession(c);
  return c.redirect("/admin/dashboard");
});

// Admin dashboard
router.get("/dashboard", requireAdminAuth, async (c) => {
  return c.html(<AdminDashboardView />);
});

// Admin logout
router.get("/logout", async (c) => {
  clearAdminSession(c);
  return c.redirect("/admin/login");
});

export default router;
