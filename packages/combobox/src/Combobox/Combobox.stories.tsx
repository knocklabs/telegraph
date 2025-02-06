import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import React from "react";

import { Combobox as TelegraphCombobox } from "../Combobox";

const meta: Meta = {
  tags: ["autodocs"],
  title: "Components/Combobox",
  component: TelegraphCombobox.Root,
  argTypes: {},
  args: {},
  parameters: { docs: { source: { type: "code" } } },
};

export default meta;

type Story = StoryObj<TgphComponentProps<typeof TelegraphCombobox>>;

const labels = ["Email", "SMS", "Push", "In-App", "Webhook"];

const values = ["email", "sms", "push", "inapp", "webhook"];
const firstValue = values[0] as string;

export const SingleSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState(firstValue);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          clearable
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
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
    const [value, setValue] = React.useState(firstValue);

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
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
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
    const [value, setValue] = React.useState([firstValue]);

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
              width: "var(--tgph-combobox-trigger-width)",
            }}
          >
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
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
    const [value, setValue] = React.useState([firstValue]);

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
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
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
    const [value, setValue] = React.useState<Array<string>>([firstValue]);

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
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
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

export const MultiSelectWithClear: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState([firstValue]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          layout="wrap"
          closeOnSelect={false}
          clearable
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {values.map((v, index) => (
                <TelegraphCombobox.Option value={v}>
                  {labels[index]}
                </TelegraphCombobox.Option>
              ))}
              <TelegraphCombobox.Create
                values={values}
                onCreate={(createdValue) => {
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

export const ComboboxInModal: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [open, setOpen] = React.useState(false);
    // eslint-disable-next-line
    const [value, setValue] = React.useState([firstValue]);
    return (
      <>
        <Button size="1" variant="outline" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal.Root
          a11yTitle="Combobox in modal"
          open={open}
          onOpenChange={setOpen}
        >
          <Modal.Content>
            <Modal.Header>
              <div />
              <Modal.Close />
            </Modal.Header>
            <Modal.Body>
              <TelegraphCombobox.Root
                {...args}
                value={value}
                onValueChange={setValue}
                placeholder={"Select a channel"}
                layout="wrap"
                closeOnSelect={false}
                clearable
              >
                <TelegraphCombobox.Trigger />
                <TelegraphCombobox.Content>
                  <TelegraphCombobox.Search />
                  <TelegraphCombobox.Options>
                    {values.map((v, index) => (
                      <TelegraphCombobox.Option value={v}>
                        {labels[index]}
                      </TelegraphCombobox.Option>
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
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      </>
    );
  },
};

type Option = { value: string; label?: string };
const legacyValues = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "inapp", label: "In-App" },
  { value: "webhook", label: "Webhook" },
] as Array<Option>;

const firstLegacyValue = legacyValues[0] as Option;

export const LegacyComboboxSingleSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState(firstLegacyValue);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          clearable
          legacyBehavior={true}
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {legacyValues.map((v) => (
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

export const LegacyComboboxSingleSelectWithLabelOverride: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState(firstLegacyValue);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={{
            value: value.value,
            label: <h2>{value.value}</h2>,
          }}
          // @ts-expect-error - for sb purposes
          onValueChange={(value) => setValue(value)}
          placeholder={"Select a channel"}
          clearable
          legacyBehavior={true}
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {legacyValues.map((v) => (
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

export const LegacyComboboxMultiSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = React.useState([firstLegacyValue]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          layout="wrap"
          closeOnSelect={false}
          clearable
          legacyBehavior={true}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {legacyValues.map((v) => (
                <TelegraphCombobox.Option value={v.value} label={v.label} />
              ))}
              <TelegraphCombobox.Create
                legacyBehavior={true}
                values={legacyValues}
                onCreate={(createdValue) => {
                  legacyValues.push(createdValue);
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
