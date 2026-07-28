import type { Meta, StoryObj } from "@storybook/react";
import type { ButtonIconProps } from "@telegraph/button";
import * as Lucide from "lucide-react";

import { type MenuItemProps, MenuItem as TelegraphMenuItem } from "./MenuItem";

// `lucide-react` also exports helpers (`createLucideIcon`, `icons`, `Icon`,
// `useLucideContext`) that are not usable as an `icon` value, so the icon
// controls are keyed on just the exports that are icon components.
type LucideIconName = {
  [K in keyof typeof Lucide]: (typeof Lucide)[K] extends Lucide.LucideIcon
    ? K
    : never;
}[keyof typeof Lucide];

// Storybook-only args: the icon controls select a Lucide icon by name and
// `type` toggles the story between the navigation and selectable presentations
// (the component itself infers that from `selected`). Both are mapped onto the
// component's real props in `render`. Built from `MenuItemProps` rather than
// `ComponentProps<typeof MenuItem>`, which collapses to `{}` on a generic
// polymorphic component.
type StorybookMenuItemType = Omit<
  MenuItemProps,
  "leadingIcon" | "trailingIcon" | "type"
> & {
  leadingIcon?: LucideIconName;
  trailingIcon?: LucideIconName;
  type?: "navigation" | "selectable";
};

const meta: Meta = {
  tags: ["autodocs"],
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

type Story = StoryObj<StorybookMenuItemType>;

export const Default: Story = {
  render: ({
    leadingIcon: leadingIconProp,
    trailingIcon: trailingIconProp,
    selected: selectedProp,
    type,
    ...args
  }) => {
    const leadingIcon: ButtonIconProps | undefined = leadingIconProp
      ? { icon: Lucide[leadingIconProp], "aria-hidden": true }
      : undefined;
    const trailingIcon: ButtonIconProps | undefined = trailingIconProp
      ? { icon: Lucide[trailingIconProp], "aria-hidden": true }
      : undefined;

    const selected = type === "selectable" ? selectedProp : undefined;

    return (
      <>
        <TelegraphMenuItem
          selected={selected}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          {...args}
        />
        <TelegraphMenuItem
          selected={selected}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          {...args}
        />
        <TelegraphMenuItem
          selected={selected}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          {...args}
        />
      </>
    );
  },
};
