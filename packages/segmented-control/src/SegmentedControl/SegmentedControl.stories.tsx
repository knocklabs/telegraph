import type { Meta, StoryObj } from "@storybook/react";
import { Lucide } from "@telegraph/icon";
import { Box } from "@telegraph/layout";
import React from "react";

import { SegmentedControl as TelegraphSegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof TelegraphSegmentedControl> = {
  title: "Components/SegmentedControl",
  component: TelegraphSegmentedControl.Root,
};

type Story = StoryObj<typeof TelegraphSegmentedControl.Root>;

export default meta;

export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState("left");
    return (
      <Box maxW="140">
        <TelegraphSegmentedControl.Root
          value={value}
          onValueChange={setValue}
          {...args}
        >
          <TelegraphSegmentedControl.Option
            value="left"
            icon={{ icon: Lucide.AlignLeft, "aria-hidden": true }}
          >
            Left
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option
            value="center"
            icon={{ icon: Lucide.AlignCenter, "aria-hidden": true }}
          >
            Center
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option
            value="right"
            icon={{ icon: Lucide.AlignRight, "aria-hidden": true }}
          >
            Right
          </TelegraphSegmentedControl.Option>
        </TelegraphSegmentedControl.Root>
      </Box>
    );
  },
};
