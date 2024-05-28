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
      options: Icons,
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
  leadingIcon: string;
};

type Story = StoryObj<StorybookButtonType>;

export const Default: Story = {};

export const WithIcon: Story = {
  render: ({ leadingIcon, ...args }) => {
    const formattedLeadingIcon = {
      icon: Icons[leadingIcon as keyof typeof Icons],
      alt: "description",
    };
    // @ts-expect-error: overriding the leadingIcon to make it better UX in storybook
    return <TelegraphButton leadingIcon={formattedLeadingIcon} {...args} />;
  },
  args: {
    leadingIcon: "Info",
  },
};

export const IconOnly: Story = {
  render: ({ leadingIcon, ...args }) => {
    const formattedLeadingIcon = {
      icon: Icons[leadingIcon as keyof typeof Icons],
      alt: "description",
    };
    // @ts-expect-error: overriding the leadingIcon to make it better UX in storybook
    return <TelegraphButton icon={formattedLeadingIcon} {...args} />;
  },
  args: {
    leadingIcon: "Info",
    children: null,
  },
};
