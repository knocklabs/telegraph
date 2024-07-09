import { defineConfig } from "vitest/config";
// import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
// import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const sharedConfig = defineConfig({
  // @ts-ignore
  // plugins: [react(), vanillaExtractPlugin()],
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
  },
});

export { sharedConfig };
