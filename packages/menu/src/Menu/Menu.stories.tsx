import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Archive, Cog, CornerUpLeft, Ellipsis, Pencil } from "lucide-react";

import { Menu as TelegraphMenu } from "./Menu";

const meta: Meta = {
  tags: ["autodocs"],
  title: "Components/Menu",
  component: TelegraphMenu.Root,
  argTypes: {
    align: {
      options: ["start", "center", "end"],
      control: {
        type: "select",
      },
    },
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    align: "center",
    side: "bottom",
  },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphMenu.Root>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <Stack m="20" align="center" justify="center">
        <TelegraphMenu.Root {...args}>
          <TelegraphMenu.Trigger>
            <Button
              variant="outline"
              leadingIcon={{ icon: Ellipsis, "aria-hidden": true }}
            />
          </TelegraphMenu.Trigger>
          <TelegraphMenu.Content {...args}>
            <TelegraphMenu.Button
              leadingIcon={{ icon: Cog, "aria-hidden": true }}
            >
              Manage workflow
            </TelegraphMenu.Button>
            <TelegraphMenu.Button
              leadingIcon={{ icon: Pencil, "aria-hidden": true }}
            >
              Edit workflow steps
            </TelegraphMenu.Button>
            <TelegraphMenu.Divider />
            <TelegraphMenu.Button
              color="red"
              leadingIcon={{ icon: Archive, "aria-hidden": true }}
            >
              Archive workflow
            </TelegraphMenu.Button>
            <TelegraphMenu.Button
              leadingIcon={{ icon: CornerUpLeft, "aria-hidden": true }}
              disabled={true}
            >
              Reset all uncomitted changes
            </TelegraphMenu.Button>
          </TelegraphMenu.Content>
        </TelegraphMenu.Root>
      </Stack>
    );
  },
};
