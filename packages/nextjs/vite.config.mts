import { viteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(viteConfig, {
  build: {
    lib: {
      fileName: (format: string) =>
        `index.${format.toLowerCase() === "umd" ? "js" : "mjs"}`,
    },
    rollupOptions: {
      external: ["path"],
      output: {
          globals: {
              path: "path"
          }
        }
    },
  },
});
