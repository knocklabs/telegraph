import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Icon, Lucide } from "@telegraph/icon";

import { Input as TelegraphInput } from "./Input";
import { COLOR, SIZE } from "./Input.constants";

const Icons = { ...Lucide };

const meta: Meta<typeof TelegraphInput> = {
  tags: ["autodocs"],
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
    errored: {
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
      options: ["", ...Object.keys(Icons)],
      control: {
        type: "select",
      },
    },
    TrailingComponent: {
      options: ["", ...Object.keys(Icons)],
      control: {
        type: "select",
      },
    },
  },
  args: {
    size: "2",
    variant: "outline",
    errored: false,
    disabled: false,
    LeadingComponent: "",
    TrailingComponent: "",
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphInput>;

export const Default: Story = {
  render: ({ LeadingComponent, TrailingComponent, ...props }) => (
    <TelegraphInput
      LeadingComponent={
        LeadingComponent && (
          <Icon
            // @ts-expect-error: For the sake of the example, we are assuming that the icon is a valid key
            icon={Icons[LeadingComponent]}
            alt="alt"
          />
        )
      }
      TrailingComponent={
        TrailingComponent && (
          <Icon
            // @ts-expect-error: For the sake of the example, we are assuming that the icon is a valid key
            icon={Icons[TrailingComponent]}
            alt="alt"
          />
        )
      }
      {...props}
    />
  ),
  args: {
    LeadingComponent: null,
    TrailingComponent: null,
  },
};

export const LeadingIcon: Story = {
  render: ({ LeadingComponent, ...props }) => (
    <TelegraphInput
      LeadingComponent={
        LeadingComponent && (
          <Icon
            // @ts-expect-error: For the sake of the example, we are assuming that the icon is a valid key
            icon={Icons[LeadingComponent]}
            alt="alt"
          />
        )
      }
      {...props}
    />
  ),
  args: {
    LeadingComponent: "Search",
    TrailingComponent: null,
  },
};

export const TrailingAction: Story = {
  render: ({ LeadingComponent, TrailingComponent, ...props }) => (
    <TelegraphInput
      LeadingComponent={
        LeadingComponent && (
          <Icon
            // @ts-expect-error: For the sake of the example, we are assuming that the icon is a valid key
            icon={Icons[LeadingComponent]}
            alt="alt"
          />
        )
      }
      TrailingComponent={
        TrailingComponent && (
          <Button
            variant="ghost"
            icon={{
              // @ts-expect-error: For the sake of the example, we are assuming that the icon is a valid key
              icon: Icons[TrailingComponent],
              alt: "create",
            }}
          />
        )
      }
      {...props}
    />
  ),
  args: {
    LeadingComponent: null,
    TrailingComponent: "Info",
  },
};
