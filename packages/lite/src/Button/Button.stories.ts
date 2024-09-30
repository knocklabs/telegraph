import type { Meta, StoryObj } from "@storybook/react";

import { Button as LiteButton } from "./Button";

const meta: Meta = {
  title: "Components/Lite/Button",
  component: LiteButton,
  argTypes: {
    variant: {
      options: ["solid", "outline", "ghost"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    variant: "solid",
    children: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    children: "Button",
  },
};
