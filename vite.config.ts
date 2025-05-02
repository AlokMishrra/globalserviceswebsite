import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Safely import the Replit plugins only if we're in development and not on Render
const getReplitPlugins = async () => {
  try {
    // Only attempt to import these in development and not in production/Render
    if (process.env.NODE_ENV !== "production") {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then(m => m.default);
      
      // Only try to use cartographer if we're in a Replit environment
      if (process.env.REPL_ID !== undefined) {
        const cartographer = await import("@replit/vite-plugin-cartographer").then(m => m.cartographer);
        return [runtimeErrorOverlay(), cartographer()];
      }
      
      return [runtimeErrorOverlay()];
    }
    return [];
  } catch (e) {
    console.warn("Could not load Replit plugins, continuing without them");
    return [];
  }
};

export default defineConfig(async () => {
  const replitPlugins = await getReplitPlugins();
  
  return {
    plugins: [
      react(),
      ...replitPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
