import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";

import { TruncatedText } from "./TruncatedText";

const meta: Meta = {
  title: "Components/TruncatedText",
  component: TruncatedText,
  tags: ["autodocs"],
} satisfies Meta<typeof TruncatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: "span",
    children:
      "This is a long text that will be truncated if it exceeds the container width",
    maxWidth: "40",
  },
};

export const WithCustomTooltip: Story = {
  args: {
    as: "span",
    children: "This text has a custom tooltip configuration",
    maxWidth: "40",
    tooltipProps: {
      delayDuration: 2000,
    },
  },
};

export const DifferentWidths: Story = {
  args: {
    as: "span",
  },
  render: (args) => (
    <Stack gap="4" direction="column">
      <TruncatedText {...args} as="span" maxWidth="20">
        This text will be truncated at 20 spacing units
      </TruncatedText>
      <TruncatedText {...args} as="span" maxWidth="40">
        This text will be truncated at 40 spacing units
      </TruncatedText>
      <TruncatedText {...args} as="span" maxWidth="60">
        This text will be truncated at 60 spacing units
      </TruncatedText>
    </Stack>
  ),
};

export const WithCustomStyles: Story = {
  args: {
    as: "span",
    children: "This text has custom styles applied",
    maxWidth: "40",
    style: {
      backgroundColor: "var(--tgph-colors-surface-2)",
      padding: "8px",
      borderRadius: "4px",
    },
  },
};

export const WithDifferentTextContent: Story = {
  args: {
    as: "span",
  },
  render: (args) => (
    <Stack gap="4" direction="column">
      <TruncatedText {...args} as="span" maxWidth="40">
        Short text that won't be truncated
      </TruncatedText>
      <TruncatedText {...args} as="span" maxWidth="40">
        This is a medium length text that might be truncated depending on the
        screen size
      </TruncatedText>
      <TruncatedText {...args} as="span" maxWidth="40">
        This is a very long text that will definitely be truncated because it
        contains many words and exceeds the maximum width of the container by a
        significant margin
      </TruncatedText>
    </Stack>
  ),
};
