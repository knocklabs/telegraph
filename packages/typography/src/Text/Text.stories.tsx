import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@telegraph/style-engine";

import { COLOR_MAP } from "../constants";

import { Text as TelegraphText } from "./Text";

const meta: Meta<typeof TelegraphText> = {
  title: "Components/Typography",
  component: TelegraphText,
  parameters: {
    controls: {
      exclude: [
        "internal_optionalAs",
        "fontSize",
        "leading",
        "tracking",
        "family",
      ],
    },
  },
  argTypes: {
    as: {
      options: ["p", "span", "div", "label"],
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(tokens.text).filter(
        (key) => !key.startsWith("code-"),
      ),
      control: {
        type: "select",
      },
    },
    weight: {
      options: Object.keys(tokens.weight),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(COLOR_MAP),
      control: {
        type: "select",
      },
    },
    align: {
      options: ["left", "center", "right"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    as: "span",
    color: "default",
    weight: "regular",
    align: "left",
    size: "3",
    children: "Text",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphText>;

export const Text: Story = {};
