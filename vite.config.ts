import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), tanstackStart(), react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
