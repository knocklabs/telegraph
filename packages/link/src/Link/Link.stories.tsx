import type { Meta, StoryObj } from "@storybook/react";
import { Text as TelegraphText } from "@telegraph/typography";
import * as Icons from "lucide-react";

import { Link as TelegraphLink } from "./Link";
import { LINK_SIZE_MAP, LINK_WEIGHT_MAP } from "./Link.constants";

const LINK_COLOR_OPTIONS: Array<
  NonNullable<React.ComponentProps<typeof TelegraphLink>["color"]>
> = [
  "default",
  "gray",
  "red",
  "beige",
  "blue",
  "green",
  "yellow",
  "purple",
  "accent",
  "white",
  "black",
  "disabled",
];

const meta: Meta<typeof TelegraphLink> = {
  title: "Components/Link",
  component: TelegraphLink,
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: Object.keys(LINK_SIZE_MAP),
      control: {
        type: "select",
      },
    },
    color: {
      options: LINK_COLOR_OPTIONS,
      control: {
        type: "select",
      },
    },
    weight: {
      options: Object.keys(LINK_WEIGHT_MAP),
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
    children: "Link",
    href: "#",
    size: "2",
    color: "blue",
    weight: "regular",
    icon: "",
  },
  render: ({ icon, ...args }: StorybookLinkType) => {
    const mergedProps = icon
      ? {
          icon: {
            icon: Icons[icon as keyof typeof Icons],
            "aria-hidden": true,
          },
          ...args,
        }
      : args;
    // @ts-expect-error: story control maps string icon names to icon object props
    return <TelegraphLink {...mergedProps} />;
  },
};

export default meta;

type StorybookLinkType = Omit<
  React.ComponentProps<typeof TelegraphLink>,
  "icon"
> & {
  icon?: string;
};

type Story = StoryObj<StorybookLinkType>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: "ArrowUpRight",
  },
};

export const InParagraph: Story = {
  args: {
    href: "#",
    color: "blue",
    children: "Telegraph docs",
    icon: "",
  },
  render: ({ icon, children, ...args }) => {
    const mergedProps = icon
      ? {
          icon: {
            icon: Icons[icon as keyof typeof Icons],
            "aria-hidden": true,
          },
          children,
          ...args,
        }
      : { children, ...args };

    // @ts-expect-error: story control maps string icon names to icon object props
    return (
      <TelegraphText as="p" size="2" color="gray">
        Building a cohesive interface starts with primitives that compose
        predictably in real copy. Read the <TelegraphLink {...mergedProps} /> to
        understand usage patterns, then browse{" "}
        <TelegraphLink
          href="#"
          color="accent"
          icon={{ icon: Icons.ArrowUpRight, "aria-hidden": true }}
        >
          migration guidance
        </TelegraphLink>{" "}
        for practical integration details across existing product surfaces.
      </TelegraphText>
    );
  },
};
