import React from "react";
import { definePreview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import addonPerformancePanel from "@github-ui/storybook-addon-performance-panel";
import "./global.css";

export default definePreview({
  addons: [addonPerformancePanel()],
  decorators: [
    (Story) => (
      <div className="tgph">
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-tgph-appearance",
    }),
  ],
});
