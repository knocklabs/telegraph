import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";

import { TextArea } from "./TextArea";
import { COLOR, SIZE } from "./TextArea.constants";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: Object.keys(SIZE),
      control: {
        type: "select",
      },
    },
    resize: {
      options: ["both", "vertical", "horizontal", "none"],
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(COLOR.default),
      control: {
        type: "select",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    errored: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    size: "2",
    variant: "outline",
    textProps: {
      value: "",
      placeholder: "Enter text here...",
    },
    disabled: false,
    errored: false,
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea size="1" textProps={{ placeholder: "Size 1" }} />
      <TextArea size="2" textProps={{ placeholder: "Size 2" }} />
      <TextArea size="3" textProps={{ placeholder: "Size 3" }} />
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea variant="outline" textProps={{ placeholder: "Outline variant" }} />
      <TextArea variant="ghost" textProps={{ placeholder: "Ghost variant" }} />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea textProps={{ placeholder: "Default state" }} />
      <TextArea textProps={{ placeholder: "Disabled state" }} disabled />
      <TextArea textProps={{ placeholder: "Error state" }} errored />
    </Stack>
  ),
};
