import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@telegraph/style-engine";

import { COLOR_MAP } from "../constants";

import { Code as TelegraphCode } from "./Code";

const meta: Meta<typeof TelegraphCode> = {
  title: "Components/Typography",
  component: TelegraphCode,
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
      options: ["span", "div", "pre", "code"],
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(tokens.text)
        .filter((key) => key.startsWith("code-"))
        .map((key) => key.replace("code-", "")),
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
    variant: {
      options: ["soft", "ghost"],
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
    as: "span",
    color: "default",
    weight: "regular",
    size: "2",
    variant: "soft",
    children: "code",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphCode>;

export const Code: Story = {};
