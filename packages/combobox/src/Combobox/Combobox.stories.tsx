import type { Meta, StoryObj } from "@storybook/react";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

import { Combobox as TelegraphCombobox } from "../Combobox";

const meta: Meta = {
  title: "Components/Combobox",
  component: TelegraphCombobox.Root,
  argTypes: {},
  args: {},
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphCombobox>>;

export const Default: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<string>("Push");
    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content
            style={{
              width: "var(--tgph-comobobox-trigger-width)",
            }}
          >
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Option value="Push" key="push" />
            <TelegraphCombobox.Option value="Email" key="email" />
            <TelegraphCombobox.Option value="Email 2" key="email2" />
            <TelegraphCombobox.Option value="Email 3" key="email3" />
            <TelegraphCombobox.Option value="In-app" key="in-app" />
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};
