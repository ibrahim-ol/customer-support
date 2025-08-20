import { Hono } from "hono";
import { serve } from "@hono/node-server";
import chatRouter from "./routes/chat/route.tsx";
import adminRouter from "./routes/admin/route.tsx";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono();

app.use(logger());

// Cookie parsing is automatically available in Hono via getCookie/setCookie

app.get("/", (c) => {
  return c.redirect("/chat/new");
});
app.use("/static/fe/*", serveStatic({ root: "./" }));

app.route("/chat", chatRouter);
app.route("/admin", adminRouter);

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
