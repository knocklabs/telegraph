import type { Meta, StoryObj } from "@storybook/react";

import { Lucide } from "../index";

import { Icon as TelegraphIcon } from "./Icon";
import { colorMap, sizeMap } from "./Icon.constants";

const Icons = { ...Lucide };

type StorybookTelegraphIconType = React.ComponentProps<typeof TelegraphIcon>;

const StorybookTelegraphIcon = ({
  icon,
  ...props
}: StorybookTelegraphIconType) => {
  return (
    <TelegraphIcon
      // @ts-expect-error: for illustrative purposes only
      icon={Icons[icon as keyof typeof Icons]}
      {...props}
      alt="test"
    />
  );
};

const meta: Meta<typeof TelegraphIcon> = {
  tags: ["autodocs"],
  title: "Components/Icon",
  component: StorybookTelegraphIcon,
};

export default meta;

export const Default: Story = {
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(sizeMap.box),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(colorMap.primary),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(colorMap),
      control: {
        type: "select",
      },
    },
  },
  args: {
    color: "default",
    size: "3",
    icon: "Bell",
    alt: "Bell",
    variant: "primary",
  },
};

type StorybookIconType = Omit<
  React.ComponentProps<typeof TelegraphIcon>,
  "icon"
> & {
  icon: string;
};

type Story = StoryObj<StorybookIconType>;
