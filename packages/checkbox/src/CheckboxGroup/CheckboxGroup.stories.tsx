import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { type FormEvent, useState } from "react";

import { Checkbox } from "../Checkbox";
import {
  CHECKBOX_COLOR_MAP,
  CHECKBOX_SIZE_MAP,
  type CheckboxColor,
} from "../Checkbox/Checkbox.constants";

import { CheckboxGroup } from "./CheckboxGroup";

const COLORS = Object.keys(CHECKBOX_COLOR_MAP) as Array<CheckboxColor>;
const SIZES = Object.keys(CHECKBOX_SIZE_MAP);

const CHANNELS = [
  { name: "email", label: "Email" },
  { name: "sms", label: "SMS" },
  { name: "push", label: "Push" },
];

const RUNS = ["run-1", "run-2", "run-3", "run-4"];

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: SIZES,
      description: "Applied to children that do not set their own",
    },
    color: {
      control: "select",
      options: COLORS,
      description: "Applied to children that do not set their own",
    },
    direction: {
      control: "select",
      options: ["row", "column"],
      description: "Layout direction",
    },
    disabled: {
      control: "boolean",
      description: "Disables every child",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

/** A read-out of the current selection, so the stories show what the group reports. */
const Selection = ({ value }: { value: string[] }) => (
  <Text as="span" size="1" color="gray">
    Selected: {value.join(", ") || "none"}
  </Text>
);

const Controlled = ({
  size,
  color,
  direction,
  disabled,
}: {
  size?: "1" | "2";
  color?: CheckboxColor;
  direction?: "row" | "column";
  disabled?: boolean;
}) => {
  const [value, setValue] = useState<string[]>(["email"]);
  return (
    <Stack direction="column" gap="3">
      <CheckboxGroup
        value={value}
        onValueChange={setValue}
        size={size}
        color={color}
        direction={direction}
        disabled={disabled}
        gap={direction === "row" ? "4" : "2"}
      >
        {CHANNELS.map((channel) => (
          <Checkbox.Default
            key={channel.name}
            name={channel.name}
            label={channel.label}
          />
        ))}
      </CheckboxGroup>
      <Selection value={value} />
    </Stack>
  );
};

export const Default: Story = {
  args: { size: "2", color: "blue", direction: "column", disabled: false },
  render: (args) => (
    <Controlled
      size={args.size}
      color={args.color}
      direction={args.direction as "row" | "column"}
      disabled={args.disabled}
    />
  ),
};

/** `direction="row"` lays the group out horizontally. */
export const Horizontal: Story = {
  render: () => <Controlled direction="row" color="blue" />,
};

/** Without a `value`, the group manages its own selection from `defaultValue`. */
export const Uncontrolled: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["email", "push"]} color="blue">
      {CHANNELS.map((channel) => (
        <Checkbox.Default
          key={channel.name}
          name={channel.name}
          label={channel.label}
        />
      ))}
    </CheckboxGroup>
  ),
};

/** `size` and `color` set on the group reach every child. */
export const GroupDefaults: Story = {
  render: () => (
    <Stack direction="column" gap="5">
      {SIZES.map((size) => (
        <CheckboxGroup
          key={size}
          defaultValue={["email"]}
          size={size as "1" | "2"}
          color="purple"
        >
          {CHANNELS.map((channel) => (
            <Checkbox.Default
              key={channel.name}
              name={channel.name}
              label={`${channel.label} (size ${size})`}
            />
          ))}
        </CheckboxGroup>
      ))}
    </Stack>
  ),
};

/** `disabled` on the group disables every child at once. */
export const DisabledGroup: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["email"]} disabled color="blue">
      {CHANNELS.map((channel) => (
        <Checkbox.Default
          key={channel.name}
          name={channel.name}
          label={channel.label}
        />
      ))}
    </CheckboxGroup>
  ),
};

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
            <Checkbox.Default key={run} name={run} label={run} />
          ))}
        </Stack>
      </CheckboxGroup>
      <Selection value={value} />
    </Stack>
  );
};

/**
 * A `parent` checkbox plus `allValues` gives select-all with a derived
 * indeterminate state. Toggling a subset puts the parent in the mixed state.
 */
export const SelectAll: Story = {
  render: () => <SelectAllExample />,
};

const SelectAllWithDisabledExample = () => {
  // `run-4` can never be selected, so it stays out of `allValues`. Leaving it
  // in would hold the parent at indeterminate forever, because Base UI
  // compares the selection length against `allValues` and ignores disabled
  // children.
  const selectable = RUNS.filter((run) => run !== "run-4");
  const [value, setValue] = useState<string[]>([]);
  return (
    <Stack direction="column" gap="3">
      <CheckboxGroup
        value={value}
        onValueChange={setValue}
        allValues={selectable}
        color="blue"
      >
        <Checkbox.Default parent label="Select all" />
        <Stack direction="column" gap="2" ml="5">
          {RUNS.map((run) => (
            <Checkbox.Default
              key={run}
              name={run}
              label={run === "run-4" ? `${run} (cannot select)` : run}
              disabled={run === "run-4"}
            />
          ))}
        </Stack>
      </CheckboxGroup>
      <Selection value={value} />
    </Stack>
  );
};

/**
 * Select-all skips disabled children in both directions. Keep rows that nobody
 * can select out of `allValues`, or the parent never reads as fully checked.
 */
export const SelectAllWithDisabledChild: Story = {
  render: () => <SelectAllWithDisabledExample />,
};

const FormExample = () => {
  const [submitted, setSubmitted] = useState<string>();
  return (
    <Stack
      as="form"
      direction="column"
      gap="3"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(
          CHANNELS.map((c) => `${c.name}=${data.get(c.name) ?? "-"}`).join(" "),
        );
      }}
    >
      <CheckboxGroup defaultValue={["email"]} color="blue">
        {CHANNELS.map((channel) => (
          <Checkbox.Default
            key={channel.name}
            name={channel.name}
            label={channel.label}
          />
        ))}
      </CheckboxGroup>
      <button type="submit">Submit</button>
      <Text as="span" size="1" color="gray">
        {submitted ?? "Submit to see the FormData"}
      </Text>
    </Stack>
  );
};

/** Each checkbox submits under its own `name`, so the group works in a form. */
export const InAForm: Story = {
  render: () => <FormExample />,
};
