import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";

import { Tag as TelegraphTag } from "./Tag";
import { COLOR, SIZE } from "./Tag.constants";

const meta: Meta<typeof TelegraphTag> = {
  tags: ["autodocs"],
  title: "Components/Tag",
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
      options: Object.keys(Icons),
      control: {
        type: "select",
      },
    },
    textToCopy: {
      control: {
        type: "text",
        defaultValue: "Text to copy",
      },
      if: {
        arg: "onCopy",
        eq: true,
      },
    },
  },
  args: {},
};

export default meta;

type StorybookTagType = Omit<
  React.ComponentProps<typeof TelegraphTag>,
  "icon"
> & {
  icon?: string;
};

type Story = StoryObj<StorybookTagType>;

export const Tag: Story = {
  render: ({ icon, onCopy, ...props }) => {
    const mergedProps = icon
      ? {
          icon: { icon: Icons[icon as keyof typeof Icons], alt: "description" },
          ...props,
        }
      : props;
    return (
      <TelegraphTag {...mergedProps} onCopy={onCopy ? () => {} : undefined} />
    );
  },
  args: {
    children: "Tag",
    variant: "soft",
    size: "2",
    onCopy: false,
    onRemove: false,
  },
};
