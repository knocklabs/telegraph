import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Select } from "./Select";

const meta: Meta<typeof Select.Root> = {
  title: "Components/Select",
  component: Select.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Select.Root>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  argTypes: {
    size: {
      options: ["0", "1", "2", "3"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    size: "2",
  },
  render: ({ ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return (
      <Select.Root
        placeholder="Select an option"
        value={value}
        onValueChange={setValue}
        {...props}
      >
        <Select.Option value="1">Option 1</Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
      </Select.Root>
    );
  },
};
