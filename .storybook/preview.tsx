import { Preview } from "@storybook/react-vite";
import "./global.css";

const preview: Preview = {
  parameters: {},
  decorators: [
    (Story) => (
      <div className="tgph">
        <Story />
      </div>
    ),
  ],
};

export default preview;
