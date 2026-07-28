import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Tag as TelegraphTag } from "./Tag";
import { COLOR, SIZE } from "./Tag.constants";

// `lucide-react`'s namespace also exports helpers that are not icon components
// (`createLucideIcon`, the generic `Icon`, the provider, …), so the control's
// options are narrowed to the exports that really are `LucideIcon`s. That keeps
// the `Icons[name]` lookup in `render` assignable to `Tag`'s `icon` prop.
type LucideIconName = {
  [K in keyof typeof Icons]: (typeof Icons)[K] extends LucideIcon ? K : never;
}[keyof typeof Icons];

const ICON_NAMES = Object.keys(Icons) as Array<LucideIconName>;

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
      options: ICON_NAMES,
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

// The `icon` control picks a lucide icon by name and the `onCopy`/`onRemove`
// controls are boolean toggles, so those three args are remapped here and
// translated back into real component props by `render`.
type StorybookTagType = Omit<
  React.ComponentProps<typeof TelegraphTag>,
  "icon" | "onCopy" | "onRemove"
> & {
  icon?: LucideIconName;
  onCopy?: boolean;
  onRemove?: boolean;
};

type Story = StoryObj<StorybookTagType>;

export const Tag: Story = {
  render: ({ icon, onCopy, onRemove, textToCopy, ...props }) => {
    const sharedProps = {
      ...props,
      ...(icon ? { icon: { icon: Icons[icon], alt: "description" } } : {}),
      ...(onRemove ? { onRemove: () => {} } : {}),
    };

    // `textToCopy` is only allowed alongside `onCopy`, so the two branches are
    // rendered separately rather than spread in conditionally.
    return onCopy ? (
      <TelegraphTag
        {...sharedProps}
        onCopy={() => {}}
        textToCopy={textToCopy}
      />
    ) : (
      <TelegraphTag {...sharedProps} />
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
