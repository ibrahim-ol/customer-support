import { Hono } from "hono";
import { AdminLoginView } from "../../frontend/pages/admin-login/index.tsx";

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

// Admin products
router.get("/products", requireAdminAuth, async (c) => {
  return c.html(<RenderClientView name="admin-products" />);
});

// Conversation mood history page
router.get("/conversations/:id/mood", requireAdminAuth, async (c) => {
  return c.html(<RenderClientView name="conversation-mood-history" />);
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

// Get mood analytics
router.get("/api/mood-analytics", requireAdminAuth, async (c) => {
  try {
    const moodAnalytics = await AdminService.getMoodAnalytics();
    return c.json({
      success: true,
      data: moodAnalytics,
    });
  } catch (error) {
    console.error("Error fetching mood analytics:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch mood analytics",
      },
      500,
    );
  }
});

// Get mood analytics for specific conversation
router.get("/api/conversations/:id/mood", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const moodAnalytics = await AdminService.getConversationMoodAnalytics(id);

    return c.json({
      success: true,
      data: moodAnalytics,
    });
  } catch (error) {
    console.error("Error fetching conversation mood analytics:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch conversation mood analytics",
      },
      500,
    );
  }
});

router.post("/api/conversations/:id/kill", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const success = await AdminService.killConversation(id);

    if (!success) {
      return c.json(
        {
          success: false,
          error: "Failed to kill conversation",
        },
        500,
      );
    }

    return c.json({
      success: true,
      message: "Conversation killed successfully",
    });
  } catch (error) {
    console.error("Error killing conversation:", error);
    return c.json(
      {
        success: false,
        error: "Failed to kill conversation",
      },
      500,
    );
  }
});

router.post(
  "/api/conversations/:id/reactivate",
  requireAdminAuth,
  async (c) => {
    try {
      const id = c.req.param("id");
      const success = await AdminService.reactivateConversation(id);

      if (!success) {
        return c.json(
          {
            success: false,
            error: "Failed to reactivate conversation",
          },
          500,
        );
      }

      return c.json({
        success: true,
        message: "Conversation reactivated successfully",
      });
    } catch (error) {
      console.error("Error reactivating conversation:", error);
      return c.json(
        {
          success: false,
          error: "Failed to reactivate conversation",
        },
        500,
      );
    }
  },
);

// Product API Routes

// Get all products
router.get("/api/products", requireAdminAuth, async (c) => {
  try {
    const products = await AdminService.getProducts();
    return c.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      500,
    );
  }
});

// Get single product
router.get("/api/products/:id", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const product = await AdminService.getProductById(id);

    if (!product) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      500,
    );
  }
});

// Create new product
router.post("/api/products", requireAdminAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { name, price, description } = body;

    // Validate required fields
    if (!name || !price || !description) {
      return c.json(
        {
          success: false,
          error: "Name, price, and description are required",
        },
        400,
      );
    }

    // Validate price is a number
    if (typeof price !== "number" || price < 0) {
      return c.json(
        {
          success: false,
          error: "Price must be a positive number",
        },
        400,
      );
    }

    const newProduct = await AdminService.createProduct({
      name: name.trim(),
      price,
      description: description.trim(),
    });

    return c.json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create product",
      },
      500,
    );
  }
});

// Update product
router.put("/api/products/:id", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, price, description } = body;

    // Validate required fields
    if (!name || !price || !description) {
      return c.json(
        {
          success: false,
          error: "Name, price, and description are required",
        },
        400,
      );
    }

    // Validate price is a number
    if (typeof price !== "number" || price < 0) {
      return c.json(
        {
          success: false,
          error: "Price must be a positive number",
        },
        400,
      );
    }

    // Check if product exists
    const existingProduct = await AdminService.getProductById(id);
    if (!existingProduct) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404,
      );
    }

    const updatedProduct = await AdminService.updateProduct(id, {
      name: name.trim(),
      price,
      description: description.trim(),
    });

    return c.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update product",
      },
      500,
    );
  }
});

// Delete product
router.delete("/api/products/:id", requireAdminAuth, async (c) => {
  try {
    const id = c.req.param("id");

    // Check if product exists
    const existingProduct = await AdminService.getProductById(id);
    if (!existingProduct) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404,
      );
    }

    const success = await AdminService.deleteProduct(id);

    if (!success) {
      return c.json(
        {
          success: false,
          error: "Failed to delete product",
        },
        500,
      );
    }

    return c.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete product",
      },
      500,
    );
  }
});

export default router;
