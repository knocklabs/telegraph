import type { Meta, StoryObj } from "@storybook/react";
import * as icons from "ionicons/icons";

import { Icon as TelegraphIcon } from "./Icon";
import { colorMap, sizeMap } from "./Icon.constants";

const meta: Meta<typeof TelegraphIcon> = {
  title: "Components",
  component: TelegraphIcon,
  argTypes: {
    icon: {
      options: Object.keys(icons),
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
    variant: "primary",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphIcon>;

export const Icon: Story = {
  render: ({ icon, ...props }) => (
    <TelegraphIcon icon={icons[icon as keyof typeof icons]} {...props} />
  ),
  args: { icon: "informationCircleOutline" },
};
