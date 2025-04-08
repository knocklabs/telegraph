import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

import { Popover } from "./Popover";

const meta: Meta = {
  tags: ["autodocs"],
  title: "Components/Popover",
  component: Popover.Root,
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "select",
      },
    },
    align: {
      options: ["start", "center", "end"],
      control: {
        type: "select",
      },
    },
    skipAnimation: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    side: "bottom",
    align: "center",
    skipAnimation: false,
  },
};

export default meta;

type Story = StoryObj<
  TgphComponentProps<typeof Popover.Root> &
    TgphComponentProps<typeof Popover.Content>
>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center">
        <Popover.Root {...args} defaultOpen={true}>
          <Popover.Trigger asChild={true}>
            <Button
              variant="outline"
              leadingIcon={{ icon: Lucide.Ellipsis, "aria-hidden": true }}
            />
          </Popover.Trigger>
          <Popover.Content
            px="4"
            align={args.align}
            side={args.side}
            skipAnimation={args.skipAnimation}
          >
            <p>Test popover content</p>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    );
  },
};
