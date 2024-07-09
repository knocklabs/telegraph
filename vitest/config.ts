import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const sharedConfig = defineConfig({
  // @ts-expect-error -- Not sure, this is valid
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
  },
});

export { sharedConfig };
