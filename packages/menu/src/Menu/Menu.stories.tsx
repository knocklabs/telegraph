import type { Meta, StoryObj } from "@storybook/react";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";

import { Menu as TelegraphMenu } from "./Menu";

const meta: Meta = {
  title: "Components/Menu",
  component: TelegraphMenu.Root,
  argTypes: {},
  args: {},
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphMenu.Root>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <TelegraphMenu.Root {...args}>
        <TelegraphMenu.Anchor />
        <TelegraphMenu.Content m="20">
          <TelegraphMenu.Button
            leadingIcon={{ icon: Lucide.Cog, "aria-hidden": true }}
          >
            Manage workflow
          </TelegraphMenu.Button>
          <TelegraphMenu.Button
            leadingIcon={{ icon: Lucide.Pencil, "aria-hidden": true }}
          >
            Edit workflow steps
          </TelegraphMenu.Button>
          <TelegraphMenu.Divider />
          <TelegraphMenu.Button
            color="red"
            leadingIcon={{ icon: Lucide.Archive, "aria-hidden": true }}
          >
            Archive workflow
          </TelegraphMenu.Button>
          <TelegraphMenu.Button
            leadingIcon={{ icon: Lucide.CornerUpLeft, "aria-hidden": true }}
            disabled={true}
          >
            Reset all uncomitted changes
          </TelegraphMenu.Button>
        </TelegraphMenu.Content>
      </TelegraphMenu.Root>
    );
  },
};
