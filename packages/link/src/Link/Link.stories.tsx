import type { LinkProps } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Text as TelegraphText } from "@telegraph/typography";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Link as TelegraphLink } from "./Link";
import { LINK_SIZE_MAP, LINK_WEIGHT_MAP } from "./Link.constants";

const LINK_COLOR_OPTIONS: Array<NonNullable<LinkProps<"a">["color"]>> = [
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

// `lucide-react`'s namespace also exports helpers that are not icon components
// (`createLucideIcon`, the generic `Icon`, the provider, …), so the control's
// options are narrowed to the exports that really are `LucideIcon`s. That keeps
// the `Icons[name]` lookup in the renderers assignable to `Link`'s `icon` prop.
type LucideIconName = {
  [K in keyof typeof Icons]: (typeof Icons)[K] extends LucideIcon ? K : never;
}[keyof typeof Icons];

const ICON_NAMES = Object.keys(Icons) as Array<LucideIconName>;

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
      options: ["", ...ICON_NAMES],
      control: {
        type: "select",
      },
    },
  },
  // `href` is an anchor attribute, so it lives on the stories rather than here:
  // `Meta<typeof TelegraphLink>` reads the component's props with `T` at its
  // constraint, which erases the element passthrough.
  args: {
    children: "Link",
    size: "2",
    color: "blue",
    weight: "regular",
  },
};

export default meta;

// The `icon` control picks a lucide icon by name (or `""` for none), so that
// one arg is remapped here and translated back into real `Link.Icon` props by
// the renderers below. The rest of the props are pinned to the default `a`
// element — reading them off the generic component instantiates `T` at its
// constraint, which erases the anchor passthrough (`href` included).
type StorybookLinkType = Omit<LinkProps<"a">, "icon"> & {
  icon?: LucideIconName | "";
};

type Story = StoryObj<StorybookLinkType>;

const renderLink = ({ icon, ...args }: StorybookLinkType) => (
  <TelegraphLink
    {...args}
    {...(icon
      ? { icon: { icon: Icons[icon], "aria-hidden": true as const } }
      : {})}
  />
);

export const Default: Story = {
  render: renderLink,
  args: {
    href: "#",
    icon: "",
  },
};

export const WithIcon: Story = {
  render: renderLink,
  args: {
    href: "#",
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
  render: ({ icon, children, ...args }) => (
    <TelegraphText as="p" size="2" color="gray">
      Building a cohesive interface starts with primitives that compose
      predictably in real copy. Read the{" "}
      <TelegraphLink
        {...args}
        {...(icon
          ? { icon: { icon: Icons[icon], "aria-hidden": true as const } }
          : {})}
      >
        {children}
      </TelegraphLink>{" "}
      to understand usage patterns, then browse{" "}
      <TelegraphLink
        href="#"
        color="accent"
        icon={{ icon: Icons.ArrowUpRight, "aria-hidden": true }}
      >
        migration guidance
      </TelegraphLink>{" "}
      for practical integration details across existing product surfaces.
    </TelegraphText>
  ),
};
