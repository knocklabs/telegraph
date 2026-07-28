import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Select } from "./Select";

// Annotated rather than inferred through `satisfies`: the inferred type reaches
// Combobox's `Option`/`DefinedOption`, which the combobox package does not
// re-export, so declaration emit has no way to name them (TS2883).
const meta: Meta<typeof Select.Root> = {
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
};

type Story = StoryObj<typeof meta>;

export default meta;

// `Select.Root` is not generic over its value: `onValueChange` reports the
// whole union Combobox accepts (a string, an option object, or arrays of
// either). Every story below selects over string options, so each narrows the
// reported value back to the type its own state holds.
const isStringArray = (value: unknown): value is Array<string> =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const SingleSelect: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return (
      <Select.Root
        placeholder="Select an option"
        value={value}
        onValueChange={(newValue) => {
          if (typeof newValue === "string") setValue(newValue);
        }}
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
        onValueChange={(newValue) => {
          if (isStringArray(newValue)) setValue(newValue);
        }}
        size={args.size}
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

// Generate years from 1960 to 2060
const years = Array.from({ length: 101 }, (_, i) => String(1960 + i));

export const YearPicker: Story = {
  render: (args) => {
    return (
      <Select.Root
        placeholder="Select a year"
        defaultValue="2025"
        size={args.size}
        disabled={args.disabled}
        optionsProps={{ maxHeight: "64" }}
      >
        {years.map((year) => (
          <Select.Option key={year} value={year}>
            {year}
          </Select.Option>
        ))}
      </Select.Root>
    );
  },
};

export const YearPickerWithScrollToValue: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState<string | undefined>(undefined);
    return (
      <Select.Root
        placeholder="Select a year"
        value={value}
        onValueChange={(newValue) => {
          if (typeof newValue === "string") setValue(newValue);
        }}
        defaultScrollToValue="2025"
        size={args.size}
        disabled={args.disabled}
        optionsProps={{ maxHeight: "64" }}
      >
        {years.map((year) => (
          <Select.Option key={year} value={year}>
            {year}
          </Select.Option>
        ))}
      </Select.Root>
    );
  },
};
