import type { Meta, StoryObj } from "@storybook/react";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";

import { Kbd as TelegraphKbd } from "./Kbd";
import { sizeMap } from "./Kbd.constants";

const meta: Meta = {
  title: "Components/Kbd",
  component: TelegraphKbd,
  argTypes: {
    size: {
      options: Object.keys(sizeMap),
      control: {
        type: "select",
      },
    },
    contrast: {
      control: {
        type: "boolean",
      },
    },
    label: {
      control: {
        type: "text",
      },
    },
    eventKey: {
      control: {
        type: "text",
      },
    }
  },
  args: {
    size: "1",
    contrast: false,
    label: "K",
    eventKey: "k",
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphKbd>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <Box bg={args.contrast ? "accent-9" : "surface-2"} p="20">
        <TelegraphKbd {...args} />
      </Box>
    );
  },
};
