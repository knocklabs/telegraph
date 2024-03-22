import type { Meta, StoryObj } from "@storybook/react";

import { Code as TelegraphCode } from "./Code";
import { CODE_PROPS } from "./Code.constants";

const meta: Meta<typeof TelegraphCode> = {
  title: "Components/Typography",
  component: TelegraphCode,
  argTypes: {
    as: {
      options: ["span", "div", "pre", "code"],
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(CODE_PROPS.size),
      control: {
        type: "select",
      },
    },
    weight: {
      options: Object.keys(CODE_PROPS.weight),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(CODE_PROPS.variant.soft),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(CODE_PROPS.variant),
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
