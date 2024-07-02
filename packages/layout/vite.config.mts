// import { styleEngineViteConfig } from "@telegraph/style-engine";
import { defaultViteConfig } from "@telegraph/vite-config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Rename the generated "style.css" file to "default.css"
          // to match our convention
          if (assetInfo.name === "style.css") {
            return "css/default.css";
          }
          return "css/[name].css";
        },
      },
    },
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `tgph-${hash}`,
    }),
  ],
});
