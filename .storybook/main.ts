import type { ViteFinal } from "@storybook/builder-vite";
import { mergeConfig } from "vite";

const viteFinal: ViteFinal = (config) => {
  return mergeConfig(config, {
    plugins: [require("@vanilla-extract/vite-plugin").vanillaExtractPlugin()],
    css: {
      postcss: {
        // Define postcss config inline so we don't need to create a postcss.config.js file
        // and collide with the package consumer's postcss config
        plugins: [
          require("postcss-import-ext-glob"),
          require("postcss-import"),
        ],
      },
    },
  });
};

export default {
  framework: "@storybook/react-vite",
  stories: ["../packages/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "storybook-addon-render-modes",
  ],
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  viteFinal,
};
