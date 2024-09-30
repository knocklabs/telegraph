import {
  defaultViteConfig,
  styleEngineViteConfig,
} from "@telegraph/vite-config";
import { mergeConfig } from "vite";

import generateCssVars from "./scripts/generate-css-vars";
import tokensMap from "./tokens/tokens-map";

export default mergeConfig(defaultViteConfig, {
  ...styleEngineViteConfig,
  plugins: [
    {
      name: "postbuild",
      enforce: "post",
      closeBundle: async () => {
        await generateCssVars({
          tokensMap,
        });
      },
    },
  ],
});
