import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Select } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select.Root,
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["0", "1", "2", "3"],
      control: {
        type: "select",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    size: "2",
    disabled: false,
  },
} satisfies Meta<typeof Select.Root>;

type Story = StoryObj<typeof meta>;

export default meta;

export const SingleSelect: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return (
      <Select.Root
        placeholder="Select an option"
        value={value}
        onValueChange={setValue}
        size={args.size}
        disabled={args.disabled}
      >
        <Select.Option value="1">Option 1</Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
      </Select.Root>
    );
  },
};

export const MultiSelect: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<Array<string>>([]);
    return (
      <Select.Root
        placeholder="Select an option"
        value={value}
        onValueChange={setValue}
        size={args.size}
        multiple
        disabled={args.disabled}
      >
        <Select.Option value="1">Option 1</Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
        <Select.Option value="3">Option 3</Select.Option>
        <Select.Option value="4">Option 4</Select.Option>
      </Select.Root>
    );
  },
};
