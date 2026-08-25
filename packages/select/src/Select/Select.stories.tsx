import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { type FormEvent, useState } from "react";

import { Select, type RootProps } from "./Select";

// Annotated rather than inferred: the inferred type reaches Combobox's
// unexported `Option`/`DefinedOption`, which declaration emit cannot name
// (TS2883).
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
type StoryProps = Pick<RootProps, "disabled" | "size">;

export default meta;

const SingleSelectExample = ({ size, disabled }: StoryProps) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select.Root
      placeholder="Select an option"
      value={value}
      onValueChange={setValue}
      size={size}
      disabled={disabled}
    >
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
    </Select.Root>
  );
};

export const SingleSelect: Story = {
  render: (args) => (
    <SingleSelectExample size={args.size} disabled={args.disabled} />
  ),
};

const MultiSelectExample = ({ size, disabled }: StoryProps) => {
  const [value, setValue] = useState<Array<string>>([]);
  return (
    <Select.Root
      placeholder="Select an option"
      value={value}
      onValueChange={setValue}
      size={size}
      disabled={disabled}
    >
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
      <Select.Option value="3">Option 3</Select.Option>
      <Select.Option value="4">Option 4</Select.Option>
    </Select.Root>
  );
};

export const MultiSelect: Story = {
  render: (args) => (
    <MultiSelectExample size={args.size} disabled={args.disabled} />
  ),
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

const YearPickerWithScrollToValueExample = ({ size, disabled }: StoryProps) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select.Root
      placeholder="Select a year"
      value={value}
      onValueChange={setValue}
      defaultScrollToValue="2025"
      size={size}
      disabled={disabled}
      optionsProps={{ maxHeight: "64" }}
    >
      {years.map((year) => (
        <Select.Option key={year} value={year}>
          {year}
        </Select.Option>
      ))}
    </Select.Root>
  );
};

export const YearPickerWithScrollToValue: Story = {
  render: (args) => (
    <YearPickerWithScrollToValueExample
      size={args.size}
      disabled={args.disabled}
    />
  ),
};

// `required` enforces native client-side validation: submitting with no
// selection is blocked by the browser (Base UI renders a hidden required input).
const RequiredInFormExample = ({ size, disabled }: StoryProps) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(value ?? "");
  };

  return (
    <Stack
      as="form"
      direction="column"
      gap="3"
      align="flex-start"
      onSubmit={handleSubmit}
    >
      <Select.Root
        placeholder="Select a channel"
        value={value}
        onValueChange={setValue}
        size={size}
        disabled={disabled}
        required
        name="channel"
      >
        <Select.Option value="email">Email</Select.Option>
        <Select.Option value="sms">SMS</Select.Option>
        <Select.Option value="push">Push</Select.Option>
      </Select.Root>
      <Button type="submit">Submit</Button>
      {submitted !== null && (
        <Text as="span" aria-live="polite">
          Submitted: {submitted || "(empty)"}
        </Text>
      )}
    </Stack>
  );
};

export const RequiredInForm: Story = {
  render: (args) => (
    <RequiredInFormExample size={args.size} disabled={args.disabled} />
  ),
};
