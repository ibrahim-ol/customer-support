import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src/frontend",
  build: {
    outDir: "../../static/fe",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "ongoing-chat": resolve(
          __dirname,
          "src/frontend/ongoing-chat/index.tsx",
        ),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
