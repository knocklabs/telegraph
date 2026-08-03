import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useState } from "react";

import { RadioGroup } from "../RadioGroup";

import { type DefaultProps, Radio } from "./Radio";
import { RADIO_COLOR_MAP, RADIO_SIZE_MAP } from "./Radio.constants";

const SIZES = Object.keys(RADIO_SIZE_MAP) as Array<keyof typeof RADIO_SIZE_MAP>;
const COLORS = Object.keys(RADIO_COLOR_MAP) as Array<
  keyof typeof RADIO_COLOR_MAP
>;

const meta: Meta<typeof Radio.Default> = {
  title: "Components/Radio",
  component: Radio.Default,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: SIZES },
    color: { control: "select", options: COLORS },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    value: "pro",
    label: "Pro",
    size: "2",
    color: "default",
    disabled: false,
  },
  // Every radio needs a group: Base UI derives selection from the group, so a
  // radio on its own has no way to be selected.
  decorators: [
    (Story) => (
      <RadioGroup name="plan" defaultValue="pro">
        <Story />
      </RadioGroup>
    ),
  ],
};

export default meta;

type Story = StoryObj<DefaultProps<"div">>;

export const Default: Story = {};

/**
 * Selected, unselected and disabled. A radio is rounded with a dot where the
 * checkbox is squared with a check, and matches it at every other axis.
 */
export const States: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <RadioGroup name="states" defaultValue="selected">
      <Radio.Default value="unselected" label="Unselected" />
      <Radio.Default value="selected" label="Selected" />
      <Radio.Default value="disabled" label="Disabled" disabled />
      <Radio.Default
        value="disabled-selected"
        label="Disabled, selected"
        disabled
      />
    </RadioGroup>
  ),
};

/**
 * Both sizes, next to each other. Size `1` is a 16px control, size `2` is
 * 20px, matching `@telegraph/checkbox`.
 */
export const Sizes: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Stack direction="column" gap="4">
      {SIZES.map((size) => (
        <Stack key={size} direction="column" gap="1">
          <Text as="span" size="0" color="gray">
            size {size}
          </Text>
          <RadioGroup name={`size-${size}`} size={size} defaultValue="on">
            <Radio.Default value="on" label="Selected" />
            <Radio.Default value="off" label="Unselected" />
          </RadioGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * The same palette as `@telegraph/button`, so a selected radio matches a solid
 * button of the same color.
 */
export const Colors: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Stack direction="column" gap="2">
      {COLORS.map((color) => (
        <RadioGroup key={color} name={color} color={color} defaultValue="on">
          <Radio.Default value="on" label={color} />
        </RadioGroup>
      ))}
    </Stack>
  ),
};

/**
 * The composable parts. `Radio.Root` holds state and layout, `Radio.Control`
 * is the circle and its dot, and `Radio.Label` associates itself with the
 * control automatically.
 */
export const Composed: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <RadioGroup name="composed" defaultValue="pro">
      <Radio.Root value="free">
        <Radio.Control />
        <Radio.Label>Free</Radio.Label>
      </Radio.Root>
      <Radio.Root value="pro">
        <Radio.Control />
        <Radio.Label>Pro</Radio.Label>
      </Radio.Root>
    </RadioGroup>
  ),
};

/**
 * A controlled group. Arrow keys move the selection, and the whole group is a
 * single tab stop.
 */
export const Controlled: Story = {
  decorators: [(Story) => <Story />],
  render: function ControlledStory() {
    const [plan, setPlan] = useState("free");
    return (
      <Stack direction="column" gap="3">
        <RadioGroup name="plan" value={plan} onValueChange={setPlan}>
          <Radio.Default value="free" label="Free" />
          <Radio.Default value="pro" label="Pro" />
          <Radio.Default value="enterprise" label="Enterprise" disabled />
        </RadioGroup>
        <Text as="span" size="1" color="gray">
          selected: {plan}
        </Text>
      </Stack>
    );
  },
};
