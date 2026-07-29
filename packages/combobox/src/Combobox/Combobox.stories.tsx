import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import type { TgphComponentProps } from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import { Text } from "@telegraph/typography";
import { useState } from "react";

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

// The value-carrying props are dropped from the shared args: every story owns
// that state locally, over its own value type.
type Story = StoryObj<
  Omit<
    TgphComponentProps<typeof TelegraphCombobox.Root>,
    "value" | "defaultValue" | "onValueChange" | "layout"
  >
>;

const LABELS = ["Email", "SMS", "Push", "In-App", "Webhook"];

const VALUES = ["email", "sms", "push", "inapp", "webhook"];
const FIRST_VALUE = VALUES[0] as string;

export const SingleSelect: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState(FIRST_VALUE);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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
    const [value, setValue] = useState(FIRST_VALUE);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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

const CHANNEL_OPTIONS = [
  { value: "general", label: "# general" },
  { value: "random", label: "# random" },
  { value: "engineering", label: "# engineering" },
  { value: "design", label: "# design" },
];

const PEOPLE_OPTIONS = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
];
const APP_OPTIONS = [
  { value: "slack", label: "Slack" },
  { value: "github", label: "GitHub" },
  { value: "linear", label: "Linear" },
];
const EMAIL_OPTIONS = [
  { value: "welcome", label: "Welcome email" },
  { value: "digest", label: "Weekly digest" },
  { value: "receipt", label: "Receipt" },
  { value: "reset", label: "Password reset" },
  { value: "invite", label: "Team invite" },
];
const WEBHOOK_OPTIONS = [
  { value: "deploy", label: "Deploy hook" },
  { value: "alert", label: "Alert hook" },
];
const SMS_OPTIONS = [
  { value: "otp", label: "One-time code" },
  { value: "reminder", label: "Reminder" },
  { value: "alert-sms", label: "Alert" },
];
const PUSH_OPTIONS = [
  { value: "mention", label: "Mention" },
  { value: "comment", label: "New comment" },
  { value: "assign", label: "Assigned to you" },
  { value: "due", label: "Due soon" },
];
const IN_APP_OPTIONS = [
  { value: "banner", label: "Banner" },
  { value: "toast", label: "Toast" },
];

// A `PageSelector` switches between pages of options. Left/Right arrows switch
// pages (while the search is empty) and Up/Down navigate the active page's list.
export const SegmentedPages: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);
    // eslint-disable-next-line
    const [page, setPage] = useState("channels");

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          page={page}
          onPageChange={setPage}
          placeholder={"Select a destination"}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.PageSelector aria-label="Destination type">
              <TelegraphCombobox.PageButton value="channels">
                Channels
              </TelegraphCombobox.PageButton>
              <TelegraphCombobox.PageButton value="people">
                People
              </TelegraphCombobox.PageButton>
            </TelegraphCombobox.PageSelector>
            <TelegraphCombobox.Options>
              <TelegraphCombobox.Page value="channels">
                {CHANNEL_OPTIONS.map((option) => (
                  <TelegraphCombobox.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </TelegraphCombobox.Option>
                ))}
              </TelegraphCombobox.Page>
              <TelegraphCombobox.Page value="people">
                {PEOPLE_OPTIONS.map((option) => (
                  <TelegraphCombobox.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </TelegraphCombobox.Option>
                ))}
              </TelegraphCombobox.Page>
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

// The same arrangement without a `Search`. Uncontrolled `defaultPage` needs no
// page-state wiring, and Left/Right always switch pages.
export const SegmentedPagesWithoutSearch: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          defaultPage="channels"
          placeholder={"Select a destination"}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.PageSelector aria-label="Destination type">
              <TelegraphCombobox.PageButton value="channels">
                Channels
              </TelegraphCombobox.PageButton>
              <TelegraphCombobox.PageButton value="people">
                People
              </TelegraphCombobox.PageButton>
            </TelegraphCombobox.PageSelector>
            <TelegraphCombobox.Options>
              <TelegraphCombobox.Page value="channels">
                {CHANNEL_OPTIONS.map((option) => (
                  <TelegraphCombobox.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </TelegraphCombobox.Option>
                ))}
              </TelegraphCombobox.Page>
              <TelegraphCombobox.Page value="people">
                {PEOPLE_OPTIONS.map((option) => (
                  <TelegraphCombobox.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </TelegraphCombobox.Option>
                ))}
              </TelegraphCombobox.Page>
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

// Five pages: the segmented control fills its track and pages of different
// lengths exercise the slide plus the popup's height animation.
export const SegmentedPagesManyPages: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);
    // eslint-disable-next-line
    const [page, setPage] = useState("channels");

    const pages = [
      { value: "channels", label: "Channels", options: CHANNEL_OPTIONS },
      { value: "people", label: "People", options: PEOPLE_OPTIONS },
      { value: "apps", label: "Apps", options: APP_OPTIONS },
      { value: "emails", label: "Emails", options: EMAIL_OPTIONS },
      { value: "webhooks", label: "Webhooks", options: WEBHOOK_OPTIONS },
      { value: "sms", label: "SMS", options: SMS_OPTIONS },
      { value: "push", label: "Push", options: PUSH_OPTIONS },
      { value: "in-app", label: "In-app", options: IN_APP_OPTIONS },
    ];

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          page={page}
          onPageChange={setPage}
          placeholder={"Select a destination"}
        >
          <TelegraphCombobox.Trigger />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.PageSelector aria-label="Destination type">
              {pages.map((p) => (
                <TelegraphCombobox.PageButton key={p.value} value={p.value}>
                  {p.label}
                </TelegraphCombobox.PageButton>
              ))}
            </TelegraphCombobox.PageSelector>
            <TelegraphCombobox.Options>
              {pages.map((p) => (
                <TelegraphCombobox.Page key={p.value} value={p.value}>
                  {p.options.map((option) => (
                    <TelegraphCombobox.Option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </TelegraphCombobox.Option>
                  ))}
                </TelegraphCombobox.Page>
              ))}
            </TelegraphCombobox.Options>
            <TelegraphCombobox.Empty />
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

export const SingleSelectWithLongLabel: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState(FIRST_VALUE);
    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={
            "Select a channel with a really really really long label"
          }
          clearable
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]} with more content to make the label longer
                  than the trigger width
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
    const [value, setValue] = useState([FIRST_VALUE]);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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
    const [value, setValue] = useState([FIRST_VALUE]);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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

export const SingleSelectWithCreate: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);

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
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
                </TelegraphCombobox.Option>
              ))}
              <TelegraphCombobox.Create<"div", false>
                values={VALUES}
                onCreate={(createdValue) => {
                  VALUES.push(createdValue);
                  setValue(createdValue);
                }}
              />
            </TelegraphCombobox.Options>
          </TelegraphCombobox.Content>
        </TelegraphCombobox.Root>
      </Box>
    );
  },
};

export const MultiSelectWithCreate: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<Array<string>>([FIRST_VALUE]);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
                </TelegraphCombobox.Option>
              ))}
              <TelegraphCombobox.Create
                values={VALUES}
                onCreate={(createdValue) => {
                  VALUES.push(createdValue);
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
    const [value, setValue] = useState([FIRST_VALUE]);

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
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
                </TelegraphCombobox.Option>
              ))}
              <TelegraphCombobox.Create
                values={VALUES}
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
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line
    const [value, setValue] = useState([FIRST_VALUE]);
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
                    {VALUES.map((v, index) => (
                      <TelegraphCombobox.Option key={v} value={v}>
                        {LABELS[index]}
                      </TelegraphCombobox.Option>
                    ))}
                    <TelegraphCombobox.Create
                      values={VALUES}
                      onCreate={(createdValue) => {
                        VALUES.push(createdValue);
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

export const SingleSelectWithCustomTrigger: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState(FIRST_VALUE);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          clearable
        >
          <TelegraphCombobox.Trigger<typeof value>>
            <TelegraphCombobox.Primitives.TriggerValue />
            <TelegraphCombobox.Primitives.TriggerActionsContainer>
              <TelegraphCombobox.Primitives.TriggerClear />
              <TelegraphCombobox.Primitives.TriggerIndicator />
            </TelegraphCombobox.Primitives.TriggerActionsContainer>
          </TelegraphCombobox.Trigger>
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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

export const MultiSelectWithCustomTrigger: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState([FIRST_VALUE]);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a channel"}
          clearable
        >
          <TelegraphCombobox.Trigger<typeof value>>
            <TelegraphCombobox.Primitives.TriggerValue />
            <TelegraphCombobox.Primitives.TriggerActionsContainer>
              <TelegraphCombobox.Primitives.TriggerClear />
              <TelegraphCombobox.Primitives.TriggerIndicator />
            </TelegraphCombobox.Primitives.TriggerActionsContainer>
          </TelegraphCombobox.Trigger>
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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

// Generate years from 1960 to 2060
const YEARS = Array.from({ length: 101 }, (_, i) => String(1960 + i));

export const YearPicker: Story = {
  render: ({ ...args }) => {
    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          defaultValue="2025"
          placeholder={"Select a year"}
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options maxHeight="64">
              {YEARS.map((year) => (
                <TelegraphCombobox.Option key={year} value={year}>
                  {year}
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

export const YearPickerWithScrollToValue: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          defaultScrollToValue="2025"
          placeholder={"Select a year"}
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options maxHeight="64">
              {YEARS.map((year) => (
                <TelegraphCombobox.Option key={year} value={year}>
                  {year}
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

const USERS = [
  { id: "usr_1", name: "Jane Doe", email: "jane@example.com" },
  { id: "usr_2", name: "John Smith", email: "john@example.com" },
  { id: "usr_3", name: "Sam Lee", email: "sam@example.com" },
];

// This option's text is rendered inside a component. It stays searchable
// because each option captures its rendered DOM text for matching.
const UserRow = ({ user }: { user: (typeof USERS)[number] }) => (
  <Stack direction="column" align="flex-start">
    <Text as="span" size="1">
      {user.name}
    </Text>
    <Text as="span" size="0" color="gray">
      {user.email}
    </Text>
  </Stack>
);

export const OptionsWithComponentContent: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Select a user"}
        >
          <TelegraphCombobox.Trigger size="1" />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Search />
            <TelegraphCombobox.Options>
              {USERS.map((user) => (
                <TelegraphCombobox.Option key={user.id} value={user.id} h="9">
                  <UserRow user={user} />
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

// The `@telegraph/input`-styled `Combobox.Input` replaces the button
// `Combobox.Trigger` as the anchor. Base UI gives the input role="combobox" and
// virtual focus and anchors the popup beneath it; typing filters the options in
// place, so there is no separate `Combobox.Search`.
export const InputAsTrigger: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          value={value}
          onValueChange={setValue}
          placeholder={"Search a channel"}
        >
          <TelegraphCombobox.Input />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {VALUES.map((v, index) => (
                <TelegraphCombobox.Option key={v} value={v}>
                  {LABELS[index]}
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

// Free-text arrangement (`selectionMode="none"`): the input text is the state
// and there is no selected value. The options are suggestions — pressing one
// fills the input — but any typed text is equally valid.
const FREE_TEXT_CHANNELS = ["Email", "SMS", "Push", "In-App", "Webhook"];

export const FreeTextAutocomplete: Story = {
  render: ({ ...args }) => {
    // eslint-disable-next-line
    const [inputValue, setInputValue] = useState("");

    return (
      <Box w="80">
        <TelegraphCombobox.Root
          {...args}
          selectionMode="none"
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          placeholder={"Type or pick a channel"}
        >
          <TelegraphCombobox.Input />
          <TelegraphCombobox.Content>
            <TelegraphCombobox.Options>
              {FREE_TEXT_CHANNELS.map((channel) => (
                <TelegraphCombobox.Option key={channel} value={channel}>
                  {channel}
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
