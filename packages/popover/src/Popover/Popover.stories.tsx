import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

import { Popover } from "./Popover";

const meta: Meta = {
  title: "Components/Popover",
  component: Popover.Root,
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof Popover.Root>>;

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <Stack w="full" my="10" align="center" justify="center">
        <Popover.Root {...args} defaultOpen={true}>
          <Popover.Trigger asChild={true}>
            <Button
              variant="outline"
              leadingIcon={{ icon: Lucide.Ellipsis, "aria-hidden": true }}
            />
          </Popover.Trigger>
          <Popover.Content>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p className="Text" style={{ marginBottom: 10 }}>
                Dimensions
              </p>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="width">
                  Width
                </label>
                <input className="Input" id="width" defaultValue="100%" />
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="maxWidth">
                  Max. width
                </label>
                <input className="Input" id="maxWidth" defaultValue="300px" />
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="height">
                  Height
                </label>
                <input className="Input" id="height" defaultValue="25px" />
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="maxHeight">
                  Max. height
                </label>
                <input className="Input" id="maxHeight" defaultValue="none" />
              </fieldset>
            </div>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    );
  },
};
