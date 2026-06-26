import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), tanstackStart(), nitro(), react(), tailwindcss()],
  server: {
    port: 5173,
  },
  cacheDir: "C:\\Users\\raine\\.cache\\vite\\casar-app",
});
