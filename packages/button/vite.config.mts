import { viteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(viteConfig, {
  build: {
    rollupOptions: {
      output: {
        // Does not seem to be a great way to
        // do this at a file level, but that
        // doesn't matter for this package.
        //
        // See: https://github.com/vitejs/vite/discussions/15721
        banner: `'use client';`,
      },
    },
  },
});
