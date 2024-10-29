import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";

import { Tooltip as TelegraphTooltip } from "./Tooltip";
import { TooltipGroupProvider } from "./Tooltip.hooks";

const meta: Meta = {
  title: "Components/Tooltip",
  component: TelegraphTooltip,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: {
        type: "text",
      },
    },
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
    appearance: {
      options: ["light", "dark"],
      control: {
        type: "select",
      },
    },
    enabled: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    label: "Tooltip",
    side: "bottom",
    align: "center",
    enabled: true,
    appearance: "dark",
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphTooltip>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center">
        <TelegraphTooltip {...args}>
          <Button color="blue">Hover me</Button>
        </TelegraphTooltip>
      </Stack>
    );
  },
};

export const Group: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center" gap="2">
        <TooltipGroupProvider>
          <TelegraphTooltip {...args}>
            <Button color="blue">Hover me</Button>
          </TelegraphTooltip>
          <TelegraphTooltip {...args}>
            <Button color="blue">Hover me</Button>
          </TelegraphTooltip>
        </TooltipGroupProvider>
      </Stack>
    );
  },
};

export const DisabledButtonTrigger: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center" gap="2">
        <TooltipGroupProvider>
          <TelegraphTooltip {...args}>
            <Button
              color="blue"
              onClick={() => console.log("clicked")}
              disabled
            >
              Hover me
            </Button>
          </TelegraphTooltip>
        </TooltipGroupProvider>
      </Stack>
    );
  },
};
export const DisabledAnchorTrigger: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center" gap="2">
        <TooltipGroupProvider>
          <TelegraphTooltip {...args}>
            <Button
              as="a"
              color="blue"
              onClick={() => console.log("clicked")}
              disabled
            >
              Hover me
            </Button>
          </TelegraphTooltip>
        </TooltipGroupProvider>
      </Stack>
    );
  },
};
