import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Combobox } from "@telegraph/combobox";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { TextArea } from "@telegraph/textarea";
import { Code, Text } from "@telegraph/typography";
import { CornerDownRight } from "lucide-react";
import React from "react";

import { DataList } from "./DataList";

const meta: Meta = {
  tags: ["autodocs"],
  title: "Components/DataList",
  component: DataList.Item,
  argTypes: {
    direction: {
      options: ["row", "column"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    direction: "row",
    label: "Label",
  },
};

export default meta;

type Story = StoryObj<typeof DataList.Item>;

export const Default: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [channel, setChannel] = React.useState<string>("email");

    return (
      <DataList.List maxW="160">
        <DataList.Item {...args}>
          <Text size="1" as="span">
            Value slot
          </Text>
        </DataList.Item>
        <DataList.Item {...args} label="Name">
          <Text size="1" as="span">
            Text
          </Text>
        </DataList.Item>
        <DataList.Item {...args} label="Bio">
          <Text size="1" as="span">
            Really really really long text that just keeps going and going and
            going. Why is this text so so so so so long?
          </Text>
        </DataList.Item>
        <DataList.Item {...args} label="Email">
          <Input size="1" stackProps={{ w: "full" }} />
        </DataList.Item>
        <DataList.Item
          {...args}
          label="User ID*"
          labelProps={{
            tooltipProps: {
              align: "start",
              side: "top",
            },
          }}
          description="The unique identifier for the user"
        >
          <Input
            size="1"
            stackProps={{ w: "full" }}
            placeholder="Enter user ID"
          />
        </DataList.Item>
        <DataList.Item
          {...args}
          label="Alias"
          icon={{ icon: CornerDownRight, ["aria-hidden"]: true }}
        >
          <Input size="1" stackProps={{ w: "full" }} />
        </DataList.Item>
        <DataList.Item {...args} label="Notes">
          <TextArea
            size="1"
            w="full"
            textProps={{
              value:
                "This is content within a text area that stretches a few lines.",
            }}
          />
        </DataList.Item>
        <DataList.Item {...args} label="Action">
          <Button size="1" variant="solid" color="accent">
            Save changes
          </Button>
        </DataList.Item>
        <DataList.Item {...args} label="Status">
          <Tag size="1" color="green">
            Active
          </Tag>
        </DataList.Item>
        <DataList.Item {...args} label="Channels">
          <Stack direction="row" gap="1">
            <Tag size="1" color="accent">
              Email
            </Tag>
            <Tag size="1" color="accent">
              SMS
            </Tag>
            <Tag size="1" color="accent">
              Push
            </Tag>
          </Stack>
        </DataList.Item>
        <DataList.Item {...args} label="Token">
          <Code size="1" as="span">
            sk_live_abc123
          </Code>
        </DataList.Item>
        <DataList.Item {...args} label="Channel">
          <Combobox.Root
            value={channel}
            onValueChange={setChannel}
            placeholder="Select a channel"
          >
            <Combobox.Trigger size="1" />
            <Combobox.Content>
              <Combobox.Options>
                <Combobox.Option value="email">Email</Combobox.Option>
                <Combobox.Option value="sms">SMS</Combobox.Option>
                <Combobox.Option value="push">Push</Combobox.Option>
              </Combobox.Options>
              <Combobox.Empty />
            </Combobox.Content>
          </Combobox.Root>
        </DataList.Item>
        <DataList.Item {...args} label="Description" direction="column">
          <Text size="1" as="span">
            This is a column data list item with really really really long text
            that just keeps going and going and going. Why is this text so so so
            so so long?
          </Text>
        </DataList.Item>
      </DataList.List>
    );
  },
};
