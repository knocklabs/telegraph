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

// A locked toggle still has to say which way it is locked, so these two must
// not render the same track.
export const DisabledOn: Story = {
  args: {
    label: "Enable notifications",
    indicator: true,
    color: "blue",
    defaultValue: true,
    size: "1",
    disabled: true,
    w: "80",
  },
};

export const DisabledOff: Story = {
  args: {
    label: "Enable notifications",
    indicator: true,
    color: "blue",
    defaultValue: false,
    size: "1",
    disabled: true,
    w: "80",
  },
};

// Two toggles on one page: Tab between them and only the focused switch should
// show the focus ring (KNO-15206).
export const MultipleToggles: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Toggle.Default label="Invite more" />
      <Toggle.Default label="Enable auto-join for domain members" />
    </div>
  ),
};
