import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@telegraph/input";
import { TextArea } from "@telegraph/textarea";
import { Text } from "@telegraph/typography";
import { CornerDownRight } from "lucide-react";

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
    return (
      <DataList.List maxW="160">
        <DataList.Item {...args}>
          <Text as="span">Text</Text>
        </DataList.Item>
        <DataList.Item {...args}>
          <Text as="span">
            Really really really long text that just keeps going and going and
            going. Why is this text so so so so so long?
          </Text>
        </DataList.Item>
        <DataList.Item {...args}>
          <Input />
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
          <Input placeholder="Enter user ID" />
        </DataList.Item>
        <DataList.Item
          {...args}
          icon={{ icon: CornerDownRight, ["aria-hidden"]: true }}
        >
          <Input />
        </DataList.Item>
        <DataList.Item {...args}>
          <TextArea
            as="textarea"
            value="This is content within a text area that stretches a few lines."
          />
        </DataList.Item>
        <DataList.Item {...args} direction="column">
          <Text as="span">
            This is a column data list item with really really really long text
            that just keeps going and going and going. Why is this text so so so
            so so long?
          </Text>
        </DataList.Item>
      </DataList.List>
    );
  },
};
