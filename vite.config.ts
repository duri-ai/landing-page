import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // The forum feature lives in the top-level ``forum/`` folder but is
      // part of this single app (mounted at /forum in src/App.tsx).
      "@forum": fileURLToPath(new URL("./forum", import.meta.url)),
      "@shared": fileURLToPath(new URL("./supabase", import.meta.url)),
    },
  },
  server: {
    port: 3010,
    proxy: {
      "/api": {
        target: "https://api.duri-ai.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
