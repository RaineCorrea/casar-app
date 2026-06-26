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
    // Otimizações de bundle
    rollupOptions: {
      output: {
        // Code splitting manual simplificado para evitar dependências circulares
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Criar 3 chunks principais para melhor performance
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react';
            }
            if (id.includes('@tanstack') || id.includes('@supabase')) {
              return 'data-fetching';
            }
            if (id.includes('lucide-react') || id.includes('@base-ui') || id.includes('sonner')) {
              return 'ui-components';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
  // Otimizar dependências
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
  },
});
