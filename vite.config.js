import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // Disable asset size limit
  },
  resolve: {
    alias: {
      "@src": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});