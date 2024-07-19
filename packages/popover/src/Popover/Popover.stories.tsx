import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

import { Popover } from "./Popover";

const meta: Meta = {
  title: "Components/Popover",
  component: Popover.Root,
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    side: "bottom",
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof Popover.Root>>;

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
          <Popover.Content {...args} px="4">
            <p>Test popover content</p>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    );
  },
};
