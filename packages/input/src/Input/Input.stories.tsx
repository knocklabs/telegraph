import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import * as icons from "ionicons/icons";

import { Input as TelegraphInput } from "./Input";
import { COLOR, SIZE } from "./Input.constants";

const meta: Meta<typeof TelegraphInput> = {
  title: "Components/Input",
  component: TelegraphInput,
  argTypes: {
    size: {
      options: Object.keys(SIZE.Container),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(COLOR.Container.default),
      control: {
        type: "select",
      },
    },
    error: {
      control: {
        type: "boolean",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    LeadingComponent: {
      options: Object.keys(icons),
      control: {
        type: "select",
      },
    },
    TrailingComponent: {
      options: Object.keys(icons),
      control: {
        type: "select",
      },
    },
  },
  args: {
    size: "2",
    variant: "outline",
    error: false,
    disabled: false,
    LeadingComponent: "",
    TrailingComponent: "",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphInput>;

export const Default: Story = {};

export const LeadingIcon: Story = {
  render: ({ LeadingComponent, ...props }) => (
    <TelegraphInput
      LeadingComponent={
        <Icon
          icon={icons[LeadingComponent as unknown as keyof typeof icons]}
          alt="alt"
        />
      }
      {...props}
    />
  ),
  args: {
    LeadingComponent: "searchSharp",
    TrailingComponent: null,
  },
};

export const TrailingAction: Story = {
  render: ({ LeadingComponent, TrailingComponent, ...props }) => (
    <TelegraphInput
      LeadingComponent={
        <Icon
          icon={icons[LeadingComponent as unknown as keyof typeof icons]}
          alt="alt"
        />
      }
      TrailingComponent={
        <Button
          variant="ghost"
          icon={{
            icon: icons[TrailingComponent as unknown as keyof typeof icons],
            alt: "create",
          }}
        />
      }
      {...props}
    />
  ),
  args: {
    LeadingComponent: null,
    TrailingComponent: "informationCircleSharp",
  },
};
