import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";

import { Icon as TelegraphIcon } from "./Icon";
import { COLOR_MAP, SIZE_MAP } from "./Icon.constants";

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
      options: Object.keys(SIZE_MAP),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(COLOR_MAP.primary),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(COLOR_MAP),
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
