import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Ellipsis } from "lucide-react";

import { Popover } from "./Popover";

const placementOptions = [
  {
    label: "Top",
    side: "top",
  },
  {
    label: "Right",
    side: "right",
  },
  {
    label: "Bottom",
    side: "bottom",
  },
  {
    label: "Left",
    side: "left",
  },
] as const;

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
              leadingIcon={{ icon: Ellipsis, "aria-hidden": true }}
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

export const Closed: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center">
        <Popover.Root {...args}>
          <Popover.Trigger asChild={true}>
            <Button
              variant="outline"
              leadingIcon={{ icon: Ellipsis, "aria-hidden": true }}
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

export const Placements: Story = {
  render: ({ ...args }) => {
    return (
      <Stack
        w="full"
        minH="96"
        my="10"
        direction="row"
        gap="10"
        align="center"
        justify="center"
      >
        {placementOptions.map((placement) => (
          <Popover.Root key={placement.side} {...args} defaultOpen={true}>
            <Popover.Trigger asChild={true}>
              <Button variant="outline">{placement.label}</Button>
            </Popover.Trigger>
            <Popover.Content
              px="4"
              align={args.align}
              side={placement.side}
              skipAnimation={args.skipAnimation}
            >
              <p>{placement.label} popover content</p>
            </Popover.Content>
          </Popover.Root>
        ))}
      </Stack>
    );
  },
};
