import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

// Function to find all folders with index.tsx files
function findEntryPoints(baseDir: string): Record<string, string> {
  const entries: Record<string, string> = {};

  try {
    const items = readdirSync(baseDir);

    for (const item of items) {
      const itemPath = join(baseDir, item);

      // Check if it's a directory
      if (statSync(itemPath).isDirectory()) {
        const indexTsxPath = join(itemPath, "index.tsx");

        // Check if index.tsx exists in this folder
        if (existsSync(indexTsxPath)) {
          entries[item] = resolve(indexTsxPath);
        }
      }
    }
  } catch (error) {
    console.warn("Error scanning for entry points:", error);
  }

  return entries;
}

export default defineConfig({
  root: "src/frontend",
  build: {
    outDir: "../../static/fe",
    emptyOutDir: false,
    rollupOptions: {
      input: findEntryPoints(resolve(__dirname, "src/frontend/pages")),
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
