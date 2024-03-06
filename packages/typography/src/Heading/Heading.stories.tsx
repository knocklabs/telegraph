import type { Meta, StoryObj } from "@storybook/react";

import { alignMap, colorMap, sizeMap } from "../helpers/prop-mappings";

import { Heading as TelegraphHeading } from "./Heading";

const meta: Meta<typeof TelegraphHeading> = {
  title: "Components/Typography",
  component: TelegraphHeading,
  argTypes: {
    as: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
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
    as: "h1",
    color: "default",
    align: "left",
    size: "3",
    children: "Text",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphHeading>;

export const Heading: Story = {};
