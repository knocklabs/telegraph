import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["@telegraph/vitest-config/setup"],
    environment: "jsdom",
    coverage: {
      include: ["src/**/!(*index).@(ts|tsx)"],
    },
  },
});
