import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@telegraph/layout";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import React from "react";

import { SegmentedControl as TelegraphSegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof TelegraphSegmentedControl.Root> = {
  title: "Components/SegmentedControl",
  component: TelegraphSegmentedControl.Root,
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["0", "1", "2", "3"],
      defaultValue: "1",
      control: {
        type: "select",
      },
    },
  },
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
            icon={{ icon: AlignLeft, "aria-hidden": true }}
          >
            Left
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option
            value="center"
            icon={{ icon: AlignCenter, "aria-hidden": true }}
          >
            Center
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option
            value="right"
            icon={{ icon: AlignRight, "aria-hidden": true }}
          >
            Right
          </TelegraphSegmentedControl.Option>
        </TelegraphSegmentedControl.Root>
      </Box>
    );
  },
};

export const Scrollable: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState("Workflow");
    return (
      <Box maxW="80" h="80" border="px" rounded="3" p="4">
        <TelegraphSegmentedControl.Root
          size="1"
          value={value}
          onValueChange={setValue}
          {...args}
        >
          <TelegraphSegmentedControl.Option value="Workflow">
            Workflow
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Recipient">
            Recipient
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Actor">
            Actor
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Tenant">
            Tenant
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Environment">
            Environment
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Run">
            Run
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Workflow">
            Workflow
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Recipient">
            Recipient
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Actor">
            Actor
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Tenant">
            Tenant
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Environment">
            Environment
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Run">
            Run
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Workflow">
            Workflow
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Recipient">
            Recipient
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Actor">
            Actor
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Tenant">
            Tenant
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Environment">
            Environment
          </TelegraphSegmentedControl.Option>
          <TelegraphSegmentedControl.Option value="Run">
            Run
          </TelegraphSegmentedControl.Option>
        </TelegraphSegmentedControl.Root>
      </Box>
    );
  },
};
