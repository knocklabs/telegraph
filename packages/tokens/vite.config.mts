import { viteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

import generateCssVarMap from "./scripts/generate-css-var-map";
import generateCssFile from "./scripts/generate-css-file";

export default mergeConfig(viteConfig, {
  plugins: [
    {
      name: "postbuild",
      enforce: "post",

      closeBundle: async () => {
          const tokensPath = "./dist/cjs/index.js";
        await generateCssVarMap({
          tokensPath
        });
        await generateCssFile({
          tokensPath
        });
      },
    },
  ],
});
