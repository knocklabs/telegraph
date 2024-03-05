import type { Meta, StoryObj } from "@storybook/react";
import * as icons from "ionicons/icons";

import { Tag as TelegraphTag } from "./Tag";
import { COLOR, SIZE } from "./Tag.constants";

const meta: Meta<typeof TelegraphTag> = {
  title: "Components",
  component: TelegraphTag,
  argTypes: {
    size: {
      options: Object.keys(SIZE.Root),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(COLOR.Root.solid),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(COLOR.Root),
      control: {
        type: "select",
      },
    },
    onCopy: {
      control: {
        type: "boolean",
      },
    },
    onRemove: {
      control: {
        type: "boolean",
      },
    },
    icon: {
      options: Object.keys(icons),
      control: {
        type: "select",
      },
    },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof TelegraphTag>;

export const Tag: Story = {
  render: ({ icon, ...props }) => (
    <TelegraphTag
      icon={{ icon: icons[icon as unknown as keyof typeof icons], alt: "alt" }}
      {...props}
    />
  ),
  args: {
    children: "Tag",
    variant: "soft",
    size: "2",
    // @ts-expect-error: for illustration purposes, can be boolean
    onCopy: false,
    // @ts-expect-error: for illustration purposes, can be boolean
    onRemove: false,
  },
};
