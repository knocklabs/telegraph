import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import {
  Archive,
  Cog,
  CornerUpLeft,
  Ellipsis,
  FileText,
  Pencil,
  Share2,
} from "lucide-react";

import { Menu as TelegraphMenu } from "./Menu";
import { TypeableTriggerExample } from "./Menu.fixtures";

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
              aria-label="Workflow actions"
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

export const WithSubmenu: Story = {
  render: ({ ...args }) => {
    return (
      <Stack m="20" align="center" justify="center">
        <TelegraphMenu.Root {...args}>
          <TelegraphMenu.Trigger>
            <Button
              variant="outline"
              aria-label="Workflow actions"
              leadingIcon={{ icon: Ellipsis, "aria-hidden": true }}
            />
          </TelegraphMenu.Trigger>
          <TelegraphMenu.Content {...args}>
            <TelegraphMenu.Button
              leadingIcon={{ icon: Pencil, "aria-hidden": true }}
            >
              Edit workflow steps
            </TelegraphMenu.Button>

            {/* Hover this item to open the submenu to the side */}
            <TelegraphMenu.Sub>
              <TelegraphMenu.SubTrigger
                leadingIcon={{ icon: Share2, "aria-hidden": true }}
              >
                Share
              </TelegraphMenu.SubTrigger>
              <TelegraphMenu.SubContent>
                <TelegraphMenu.Button>Copy link</TelegraphMenu.Button>
                <TelegraphMenu.Button>Invite teammate</TelegraphMenu.Button>

                {/* Submenus can nest arbitrarily */}
                <TelegraphMenu.Sub>
                  <TelegraphMenu.SubTrigger
                    leadingIcon={{ icon: FileText, "aria-hidden": true }}
                  >
                    Export as
                  </TelegraphMenu.SubTrigger>
                  <TelegraphMenu.SubContent>
                    <TelegraphMenu.Button>PDF</TelegraphMenu.Button>
                    <TelegraphMenu.Button>CSV</TelegraphMenu.Button>
                    <TelegraphMenu.Button>JSON</TelegraphMenu.Button>
                  </TelegraphMenu.SubContent>
                </TelegraphMenu.Sub>
              </TelegraphMenu.SubContent>
            </TelegraphMenu.Sub>

            <TelegraphMenu.Divider />
            <TelegraphMenu.Button
              color="red"
              leadingIcon={{ icon: Archive, "aria-hidden": true }}
            >
              Archive workflow
            </TelegraphMenu.Button>
          </TelegraphMenu.Content>
        </TelegraphMenu.Root>
      </Stack>
    );
  },
};

// A typeable input composed inside the trigger (PropertySelectorField, block
// editor suggestion menus). Click or type to open; keystrokes keep landing in
// the input — not the menu's typeahead — and ArrowDown moves into the list.
export const TypeableTrigger: Story = {
  render: (args) => <TypeableTriggerExample {...args} />,
};
