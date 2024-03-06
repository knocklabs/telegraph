import type { Meta, StoryObj } from "@storybook/react";

import {
  alignMap,
  colorMap,
  sizeMap,
  weightMap,
} from "../helpers/prop-mappings";

import { Text as TelegraphText } from "./Text";

const meta: Meta<typeof TelegraphText> = {
  title: "Components/Typography",
  component: TelegraphText,
  argTypes: {
    as: {
      options: ["p", "span", "div", "label"],
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(sizeMap),
      control: {
        type: "select",
      },
    },
    weight: {
      options: Object.keys(weightMap),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(colorMap),
      control: {
        type: "select",
      },
    },
    align: {
      options: Object.keys(alignMap),
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
