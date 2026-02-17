import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";

import { Button as TelegraphButton } from "./Button";
import { BUTTON_SIZE_MAP } from "./Button.constants";

const buttonColorMap = [
  "default",
  "gray",
  "red",
  "accent",
  "green",
  "blue",
  "yellow",
  "purple",
];
const buttonVariantMap = ["solid", "soft", "outline", "ghost"];

const meta: Meta<typeof TelegraphButton> = {
  title: "Components/Button",
  component: TelegraphButton,
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: buttonColorMap,
      control: {
        type: "select",
      },
    },
    variant: {
      options: buttonVariantMap,
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(BUTTON_SIZE_MAP.default),
      control: {
        type: "select",
      },
    },
    leadingIcon: {
      options: ["", ...Object.keys(Icons)],
      control: {
        type: "select",
      },
    },
    trailingIcon: {
      options: ["", ...Object.keys(Icons)],
      control: {
        type: "select",
      },
    },
    icon: {
      options: ["", ...Object.keys(Icons)],
      control: {
        type: "select",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    active: {
      control: {
        type: "boolean",
      },
    },
    state: {
      options: ["default", "loading"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    size: "2",
    color: "accent",
    variant: "solid",
    children: "Button",
    disabled: false,
    active: false,
  },
};

export default meta;

type StorybookButtonType = Omit<
  React.ComponentProps<typeof TelegraphButton>,
  "leadingIcon"
> & {
  leadingIcon?: string;
  trailingIcon?: string;
  icon?: string;
};

type Story = StoryObj<StorybookButtonType>;

export const Default: Story = {
  render: ({ leadingIcon, trailingIcon, icon, ...args }) => {
    const mergedProps = {
      leadingIcon: leadingIcon
        ? { icon: Icons[leadingIcon as keyof typeof Icons], alt: "description" }
        : null,
      trailingIcon: trailingIcon
        ? {
            icon: Icons[trailingIcon as keyof typeof Icons],
            alt: "description",
          }
        : null,
      icon: icon
        ? {
            icon: Icons[icon as keyof typeof Icons],
            alt: "description",
          }
        : null,
      ...args,
    };
    // @ts-expect-error: just for an example
    return <TelegraphButton {...mergedProps} />;
  },
  args: {
    leadingIcon: "",
    trailingIcon: "",
    icon: "",
  },
};

export const WithIcon: Story = {
  render: ({ leadingIcon, ...args }) => {
    const formattedLeadingIcon = leadingIcon
      ? {
          icon: Icons[leadingIcon as keyof typeof Icons],
          alt: "description",
        }
      : null;
    // @ts-expect-error: overriding the leadingIcon to make it better UX in storybook
    return <TelegraphButton leadingIcon={formattedLeadingIcon} {...args} />;
  },
  args: {
    leadingIcon: "Info",
  },
};

export const IconOnly: Story = {
  render: ({ leadingIcon, ...args }) => {
    const formattedLeadingIcon = leadingIcon
      ? {
          icon: Icons[leadingIcon as keyof typeof Icons],
          alt: "description",
        }
      : null;
    // @ts-expect-error: overriding the leadingIcon to make it better UX in storybook
    return <TelegraphButton icon={formattedLeadingIcon} {...args} />;
  },
  args: {
    leadingIcon: "Info",
    children: null,
  },
};
