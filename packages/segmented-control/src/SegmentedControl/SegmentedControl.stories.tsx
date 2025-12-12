import type { Meta, StoryObj } from "@storybook/react";
import { Box, Stack } from "@telegraph/layout";
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

const optionsList = [
  { value: "Workflow", label: "Workflow" },
  { value: "Recipient", label: "Recipient" },
  { value: "Actor", label: "Actor" },
  { value: "Tenant", label: "Tenant" },
  { value: "Environment", label: "Environment" },
  { value: "Run", label: "Run" },
  { value: "Audience", label: "Audience" },
  { value: "Group", label: "Group" },
  { value: "Segment", label: "Segment" },
  { value: "User", label: "User" },
  { value: "Contact", label: "Contact" },
  { value: "Lead", label: "Lead" },
  { value: "Account", label: "Account" },
  { value: "Opportunity", label: "Opportunity" },
  { value: "Campaign", label: "Campaign" },
  { value: "Task", label: "Task" },
  { value: "Event", label: "Event" },
  { value: "Note", label: "Note" },
  { value: "Document", label: "Document" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "Meeting", label: "Meeting" },
  { value: "Call", label: "Call" },
];

export const Scrollable: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value1, setValue1] = React.useState("Workflow");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value2, setValue2] = React.useState("Task");
    return (
      <Stack
        maxW="80"
        h="80"
        border="px"
        rounded="3"
        p="4"
        direction="column"
        gap="4"
      >
        <TelegraphSegmentedControl.Root
          size="1"
          value={value1}
          onValueChange={setValue1}
          {...args}
        >
          {optionsList.map((option) => (
            <TelegraphSegmentedControl.Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </TelegraphSegmentedControl.Option>
          ))}
        </TelegraphSegmentedControl.Root>
        <TelegraphSegmentedControl.Root
          size="1"
          value={value2}
          onValueChange={setValue2}
          {...args}
        >
          {optionsList.map((option) => (
            <TelegraphSegmentedControl.Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </TelegraphSegmentedControl.Option>
          ))}
        </TelegraphSegmentedControl.Root>
      </Stack>
    );
  },
};
