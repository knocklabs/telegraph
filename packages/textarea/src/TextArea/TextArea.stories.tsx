import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";

import { TextArea } from "./TextArea";
import { sizeMap } from "./TextArea.constants";

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    size: {
      options: Object.keys(sizeMap),
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
      options: ["outline", "ghost"],
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
    value: "",
    placeholder: "Enter text here...",
    disabled: false,
    errored: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea size="1" placeholder="Size 1" />
      <TextArea size="2" placeholder="Size 2" />
      <TextArea size="3" placeholder="Size 3" />
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea variant="outline" placeholder="Outline variant" />
      <TextArea variant="ghost" placeholder="Ghost variant" />
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <TextArea placeholder="Default state" />
      <TextArea placeholder="Disabled state" disabled />
      <TextArea placeholder="Error state" errored />
    </Stack>
  ),
};
