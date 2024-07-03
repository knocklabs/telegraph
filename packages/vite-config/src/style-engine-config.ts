import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: { name: string }) => {
          // Rename the generated "style.css" file to "default.css"
          // to match our convention as vanilla extract generatees
          // a "style.css" file.
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
};
