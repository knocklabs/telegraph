import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/default-config.ts", "src/token-config.ts"],
      name: "telegraph",
      fileName: (format: string, entryName: string) =>
        `${entryName}.${format}.js`,
    },
    sourcemap: true,
  },
  plugins: [dts()],
});
