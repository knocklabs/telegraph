import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useState } from "react";

import { CheckboxGroup } from "../CheckboxGroup";

import { Checkbox } from "./Checkbox";
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
type Story = StoryObj<typeof Checkbox.Default>;

export const Default: Story = {
  args: {
    label: "Cancel this run",
    size: "2",
    color: "blue",
    disabled: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Cancel this run",
    defaultValue: true,
    size: "2",
    color: "blue",
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
    size: "2",
    color: "blue",
  },
};

export const Disabled: Story = {
  args: {
    label: "Cannot be cancelled",
    disabled: true,
    defaultValue: true,
    size: "2",
    color: "blue",
  },
};

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Select row",
    size: "2",
    color: "blue",
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

const GroupExample = () => {
  const [value, setValue] = useState<string[]>(["email"]);
  return (
    <Stack direction="column" gap="3">
      <CheckboxGroup value={value} onValueChange={setValue} color="blue">
        <Checkbox.Default name="email" label="Email" />
        <Checkbox.Default name="sms" label="SMS" />
        <Checkbox.Default name="push" label="Push" />
      </CheckboxGroup>
      <Text as="span" size="1" color="gray">
        Selected: {value.join(", ") || "none"}
      </Text>
    </Stack>
  );
};

export const Group: Story = {
  render: () => <GroupExample />,
};

const RUNS = ["run-1", "run-2", "run-3", "run-4"];

const SelectAllExample = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Stack direction="column" gap="3">
      <CheckboxGroup
        value={value}
        onValueChange={setValue}
        allValues={RUNS}
        color="blue"
      >
        <Checkbox.Default parent label="Select all" />
        <Stack direction="column" gap="2" ml="5">
          {RUNS.map((run) => (
            <Checkbox.Default
              key={run}
              name={run}
              label={run}
              disabled={run === "run-4"}
            />
          ))}
        </Stack>
      </CheckboxGroup>
      <Text as="span" size="1" color="gray">
        Selected: {value.join(", ") || "none"} — run-4 is disabled
      </Text>
    </Stack>
  );
};

/**
 * A `parent` checkbox plus `allValues` gives select-all with a derived
 * indeterminate state. Disabled children are skipped in both directions.
 */
export const GroupWithSelectAll: Story = {
  render: () => <SelectAllExample />,
};
