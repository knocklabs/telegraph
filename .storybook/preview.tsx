import { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "./global.css";

const preview: Preview = {
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
};

export default preview;
