import type { Meta, StoryObj } from "@storybook/react";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

import { Autocomplete as TelegraphAutocomplete } from "../Autocomplete";

const meta: Meta = {
  tags: ["autodocs"],
  title: "Components/Autocomplete",
  component: TelegraphAutocomplete.Root,
  argTypes: {},
  args: {},
  parameters: { docs: { source: { type: "code" } } },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphAutocomplete.Root>>;

const channels = ["Email", "SMS", "Push", "In-App", "Webhook"];

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root value={value} onValueChange={setValue}>
          <TelegraphAutocomplete.Input
            size="1"
            placeholder="Type to search channels..."
          />
          <TelegraphAutocomplete.Content>
            {channels.map((channel) => (
              <TelegraphAutocomplete.Option
                key={channel}
                value={channel}
                size="1"
              >
                {channel}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("Email");

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root value={value} onValueChange={setValue}>
          <TelegraphAutocomplete.Input placeholder="Type to search channels..." />
          <TelegraphAutocomplete.Content>
            {channels.map((channel) => (
              <TelegraphAutocomplete.Option key={channel} value={channel}>
                {channel}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const NoOptions: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root value={value} onValueChange={setValue}>
          <TelegraphAutocomplete.Input placeholder="Plain text input (no suggestions)" />
          <TelegraphAutocomplete.Content />
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const WithLabels: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    const options = [
      { value: "email", label: "Email Channel" },
      { value: "sms", label: "SMS Channel" },
      { value: "push", label: "Push Notification" },
      { value: "inapp", label: "In-App Message" },
      { value: "webhook", label: "Webhook" },
    ];

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root value={value} onValueChange={setValue}>
          <TelegraphAutocomplete.Input placeholder="Type to search..." />
          <TelegraphAutocomplete.Content>
            {options.map((option) => (
              <TelegraphAutocomplete.Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root
          value={value}
          onValueChange={setValue}
          disabled
        >
          <TelegraphAutocomplete.Input placeholder="Disabled input" />
          <TelegraphAutocomplete.Content>
            {channels.map((channel) => (
              <TelegraphAutocomplete.Option key={channel} value={channel}>
                {channel}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const Errored: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root
          value={value}
          onValueChange={setValue}
          errored
        >
          <TelegraphAutocomplete.Input placeholder="Errored input" />
          <TelegraphAutocomplete.Content>
            {channels.map((channel) => (
              <TelegraphAutocomplete.Option key={channel} value={channel}>
                {channel}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};

export const DynamicOptions: Story = {
  render: () => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("");

    const allOptions = [
      "Apple",
      "Banana",
      "Cherry",
      "Date",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
      "Kiwi",
      "Lemon",
      "Mango",
      "Nectarine",
      "Orange",
      "Papaya",
      "Quince",
      "Raspberry",
      "Strawberry",
      "Tangerine",
    ];

    return (
      <Box w="80">
        <TelegraphAutocomplete.Root value={value} onValueChange={setValue}>
          <TelegraphAutocomplete.Input placeholder="Search fruits..." />
          <TelegraphAutocomplete.Content>
            {allOptions.map((fruit) => (
              <TelegraphAutocomplete.Option key={fruit} value={fruit}>
                {fruit}
              </TelegraphAutocomplete.Option>
            ))}
          </TelegraphAutocomplete.Content>
        </TelegraphAutocomplete.Root>
      </Box>
    );
  },
};
