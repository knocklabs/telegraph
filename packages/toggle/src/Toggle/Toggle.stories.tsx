import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle.Default> = {
  title: "Components/Toggle",
  component: Toggle.Default,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["1", "2"],
      description: "The size of the toggle",
    },
    color: {
      control: "select",
      options: [
        "default",
        "accent",
        "blue",
        "red",
        "green",
        "yellow",
        "purple",
        "gray",
      ],
      description: "The color of the toggle when enabled",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle.Default>;

export const ToggleOnly: Story = {
  args: {
    defaultValue: false,
    size: "1",
    color: "blue",
    disabled: false,
  },
};

export const ToggleWithLabel: Story = {
  args: {
    label: "Enable notifications",
    color: "blue",
    defaultValue: false,
    size: "1",
    disabled: false,
  },
};

export const ToggleWithIndicator: Story = {
  args: {
    indicator: true,
    color: "blue",
    defaultValue: false,
    size: "1",
    disabled: false,
  },
};

export const ToggleWithLabelAndIndicator: Story = {
  args: {
    label: "Enable notifications",
    indicator: true,
    color: "blue",
    defaultValue: false,
    size: "1",
    disabled: false,
    w: "80",
  },
};
