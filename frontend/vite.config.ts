import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, 
    rollupOptions: {
      output: {
        manualChunks: {
          
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "axios",
            "lucide-react",
          ],
        },
      },
    },
  },
});
