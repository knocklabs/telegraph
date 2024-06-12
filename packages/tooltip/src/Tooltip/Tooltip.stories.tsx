import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";

import { Tooltip as TelegraphTooltip } from "./Tooltip";

const meta: Meta = {
  title: "Components/Tooltip",
  component: TelegraphTooltip,
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
  },
  args: {
    label: "Tooltip",
    side: "bottom",
    align: "center",
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphTooltip>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <TelegraphTooltip {...args}>
        <Button color="blue">Hover me</Button>
      </TelegraphTooltip>
    );
  },
};
