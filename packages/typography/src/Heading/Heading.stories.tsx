import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@telegraph/style-engine";

import { COLOR_MAP } from "../constants";

import { Heading as TelegraphHeading } from "./Heading";

const meta: Meta<typeof TelegraphHeading> = {
  title: "Components/Typography",
  component: TelegraphHeading,
  parameters: {
    controls: {
      exclude: [
        "internal_optionalAs",
        "fontSize",
        "leading",
        "tracking",
      ],
    },
  },
  argTypes: {
    as: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
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
    family: {
      options: Object.keys(tokens.family),
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
