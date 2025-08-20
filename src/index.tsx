import { Hono } from "hono";
import { serve } from "@hono/node-server";
import chatRouter from "./routes/chat/route.tsx";
import adminRouter from "./routes/admin/route.tsx";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { NotFoundPage } from "./frontend/pages/errors/404.tsx";
import { apiRateLimit } from "./middleware/rateLimit.ts";

const app = new Hono();

// Global rate limiting for all requests
app.use("*", apiRateLimit);

app.use(logger());

app.get("/", (c) => {
  return c.redirect("/chat/new");
});
app.use("/static/fe/*", serveStatic({ root: "./" }));

app.route("/chat", chatRouter);
app.route("/admin", adminRouter);

// 404 catch-all route - must be last
app.notFound((c) => {
  const path = c.req.path;

  // Return JSON for API routes (paths starting with /api or containing certain patterns)
  if (
    path.startsWith("/api") ||
    (path.includes("/chat/") &&
      c.req.header("accept")?.includes("application/json")) ||
    c.req.header("content-type")?.includes("application/json")
  ) {
    return c.json(
      { error: "Not Found", message: "The requested resource was not found" },
      404,
    );
  }

  // Return HTML 404 page for regular page requests
  return c.html(<NotFoundPage />, 404);
});

const PORT = 3000;
const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Server is running on`, info);
});

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
