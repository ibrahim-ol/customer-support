import { Hono } from "hono";
import { AdminLoginView } from "../../frontend/pages/admin-login/index.tsx";
import { AdminDashboardView } from "../../frontend/pages/admin-dashboard/index.tsx";
import { AdminConversationsView } from "../../frontend/pages/admin-conversations/index.tsx";

import {
  requireAdminAuth,
  setAdminSession,
  clearAdminSession,
} from "../../middleware/auth.ts";
import { AdminService } from "../../services/admin.service.ts";
import { RenderClientView } from "../../utils/view.tsx";

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
  return c.html(<RenderClientView name="admin-dashboard" />);
});

// Admin conversations
router.get("/conversations", requireAdminAuth, async (c) => {
  return c.html(<RenderClientView name="admin-conversations" />);
});

// Admin logout
router.get("/logout", async (c) => {
  clearAdminSession(c);
  return c.redirect("/admin/login");
});

// API Routes for conversation management
router.get("/api/conversations", requireAdminAuth, async (c) => {
  try {
    const conversations = await AdminService.getConversations();
    return c.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch conversations",
      },
      500,
    );
  }
});

router.get("/api/conversations/:id", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const conversation = await AdminService.getConversationDetails(id);

    if (!conversation) {
      return c.json(
        {
          success: false,
          error: "Conversation not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch conversation details",
      },
      500,
    );
  }
});

router.get("/api/stats", requireAdminAuth, async (c) => {
  try {
    const stats = await AdminService.getConversationStats();
    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch statistics",
      },
      500,
    );
  }
});

export default router;
