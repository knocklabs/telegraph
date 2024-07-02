import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export const styleEngineViteConfig = {
  plugins: [
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `tgph_${hash}`,
    }),
  ],
};
