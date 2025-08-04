import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import twVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), twVite()],
  test: {
    css: true,
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    testTimeout: 30_000,
    setupFiles: ["src/app/utils/test-utils/setup.ts"],
    coverage: { include: ["src"] },
  },
});
