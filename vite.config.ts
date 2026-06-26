import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    tsConfigPaths(),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    // Configurar proxy para API durante desenvolvimento
    proxy: {
      "/api/webhooks/mercadopago": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  cacheDir: "C:\\Users\\raine\\.cache\\vite\\casar-app",
  build: {
    target: "esnext",
  },
});
