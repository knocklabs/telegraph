import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";

import { Checkbox, type DefaultProps } from "./Checkbox";
import {
  CHECKBOX_COLOR_MAP,
  CHECKBOX_SIZE_MAP,
  type CheckboxColor,
} from "./Checkbox.constants";

const COLORS = Object.keys(CHECKBOX_COLOR_MAP) as Array<CheckboxColor>;
const SIZES = Object.keys(CHECKBOX_SIZE_MAP);

const meta: Meta<typeof Checkbox.Default> = {
  title: "Components/Checkbox",
  component: Checkbox.Default,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: SIZES,
      description: "The size of the checkbox",
    },
    color: {
      control: "select",
      options: COLORS,
      description: "The color of the checkbox when checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    indeterminate: {
      control: "boolean",
      description: "Renders the mixed state",
    },
  },
};

export default meta;

// `Checkbox.Default` is polymorphic, so `typeof Checkbox.Default` leaves `T`
// unresolved and the element passthrough drops out — `args` would then reject
// every HTML attribute. Pin the element the stories actually render.
type Story = StoryObj<DefaultProps<"div">>;

export const Default: Story = {
  args: {
    label: "Cancel this run",
    size: "2",
    color: "default",
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Cancel this run",
    defaultValue: true,
    size: "2",
    color: "default",
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
    size: "2",
    color: "default",
  },
};

export const Disabled: Story = {
  args: {
    label: "Cannot be cancelled",
    disabled: true,
    defaultValue: true,
    size: "2",
    color: "default",
  },
};

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Select row",
    size: "2",
    color: "default",
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      {SIZES.map((size) => (
        <Checkbox.Default
          key={size}
          size={size as "1" | "2"}
          defaultValue
          label={`Size ${size}`}
        />
      ))}
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack direction="column" gap="3">
      {COLORS.map((color) => (
        <Checkbox.Default
          key={color}
          color={color}
          defaultValue
          label={color}
        />
      ))}
    </Stack>
  ),
};

/** Checkbox and its states side by side, to check optical alignment. */
export const States: Story = {
  render: () => (
    <Stack direction="column" gap="3">
      <Checkbox.Default label="Unchecked" />
      <Checkbox.Default label="Checked" defaultValue />
      <Checkbox.Default label="Indeterminate" indeterminate />
      <Checkbox.Default label="Disabled" disabled />
      <Checkbox.Default label="Disabled checked" disabled defaultValue />
    </Stack>
  ),
};

/**
 * `readOnly` blocks changes but keeps the value in the form and the control in
 * the tab order, so it stays at full contrast. Only the cursor marks it. Tab
 * through these: the read-only rows take focus, the disabled ones do not.
 */
export const ReadOnly: Story = {
  render: () => (
    <Stack direction="column" gap="3">
      <Checkbox.Default label="Read only" readOnly />
      <Checkbox.Default label="Read only, checked" readOnly defaultValue />
      <Checkbox.Default label="Disabled, checked" disabled defaultValue />
      <Checkbox.Default label="Editable, checked" defaultValue />
    </Stack>
  ),
};
