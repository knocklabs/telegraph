import type { Meta, StoryObj } from "@storybook/react";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";

import { MenuItem as TelegraphMenuItem } from "./MenuItem";

const meta: Meta = {
  title: "Components/Menu/MenuItem",
  component: TelegraphMenuItem,
  argTypes: {
    color: {
      options: ["gray", "accent", "red"],
      control: {
        type: "select",
      },
    },
    leadingIcon: {
      options: ["", ...Object.keys(Lucide)],
      control: {
        type: "select",
      },
    },
    trailingIcon: {
      options: ["", ...Object.keys(Lucide)],
      control: {
        type: "select",
      },
    },
    children: {
      control: {
        type: "text",
      },
    },
    type: {
      options: ["navigation", "selectable"],
      control: {
        type: "select",
      },
    },
    selected: {
      control: {
        type: "boolean",
      },
      if: {
        arg: "type",
        eq: "selectable",
      },
    },
  },
  args: {
    type: "navigation",
    color: "gray",
    leadingIcon: "Cog",
    children: "Menu item",
    selected: true,
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphMenuItem>>;

export const Default: Story = {
  render: ({
    leadingIcon: leadingIconProp,
    trailingIcon: trailingIconProp,
    selected: selectedProp,
    type,
    ...args
  }) => {
    const leadingIcon = leadingIconProp
      ? { icon: Lucide[leadingIconProp], "aria-hidden": true }
      : undefined;
    const trailingIcon = trailingIconProp
      ? { icon: Lucide[trailingIconProp], "aria-hidden": true }
      : undefined;

    const selected = type === "selectable" ? selectedProp : undefined;
    console.log(selected, type, args);
    return (
      <TelegraphMenuItem
        selected={selected}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        {...args}
      />
    );
  },
};
