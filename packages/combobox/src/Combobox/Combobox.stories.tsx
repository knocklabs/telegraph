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

type Option = { value: string; label?: string };

const values: Array<Option> = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "inapp", label: "In-App" },
  { value: "webhook", label: "Webhook" },
];

const firstValue = values[0];

export const SingleSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<Option>(firstValue);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {values.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};
export const SingleSelectWithSearch: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<Option>(firstValue);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

export const MultiSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<Array<Option>>([firstValue]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          closeOnSelect={false}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content
            style={{
              width: "var(--tgph-comobobox-trigger-width)",
            }}
          >
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

export const MultiSelectWithWrapLayout: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<Array<Option>>([firstValue]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          layout="wrap"
          closeOnSelect={false}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

export const MultiSelectWithCreate: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState<Array<Option>>([firstValue]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          layout="wrap"
          closeOnSelect={false}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
              <TelegraphCombobox.Create
                values={values}
                onCreate={(createdValue) => {
                  values.push(createdValue);
                  setValue((prevValue) => [createdValue, ...prevValue]);
                }}
              />
            </TelegraphCombobox.Options>
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};
