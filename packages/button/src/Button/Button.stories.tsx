import type { Meta, StoryObj } from "@storybook/react";
import { Lucide } from "@telegraph/icon";

import { Button as TelegraphButton } from "./Button";
import { buttonColorMap, buttonSizeMap } from "./Button.constants";

const Icons = { ...Lucide };

const meta: Meta<typeof TelegraphButton> = {
  title: "Components/Button",
  component: TelegraphButton,
  argTypes: {
    color: {
      options: Object.keys(buttonColorMap.solid),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(buttonColorMap),
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(buttonSizeMap.default),
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
  },
  args: {
    size: "2",
    color: "accent",
    variant: "solid",
    children: "Button",
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
    console.log(mergedProps);
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
