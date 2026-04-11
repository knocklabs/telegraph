import type { Meta, StoryObj } from "@storybook/react";

import { Box } from "./Box";
import { Stack } from "../Stack";

const colorOptions = [
  "surface-1",
  "surface-2",
  "surface-3",
  "gray-1",
  "gray-2",
  "gray-3",
  "gray-4",
  "gray-5",
  "gray-6",
  "accent-3",
  "accent-4",
  "accent-5",
  "accent-9",
  "blue-3",
  "blue-9",
  "green-3",
  "green-9",
  "red-3",
  "red-9",
];

const spacingOptions = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "12",
  "16",
];

const roundedOptions = ["0", "1", "2", "3", "4", "5", "6", "full"];
const shadowOptions = ["0", "inner", "1", "2", "3"];

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
  tags: ["autodocs"],
  argTypes: {
    p: {
      options: spacingOptions,
      control: { type: "select" },
    },
    bg: {
      options: colorOptions,
      control: { type: "select" },
    },
    rounded: {
      options: roundedOptions,
      control: { type: "select" },
    },
    shadow: {
      options: shadowOptions,
      control: { type: "select" },
    },
    display: {
      options: ["block", "inline-block", "inline", "flex", "inline-flex"],
      control: { type: "select" },
    },
    position: {
      options: ["relative", "absolute", "fixed", "sticky"],
      control: { type: "select" },
    },
    overflow: {
      options: ["hidden", "visible", "scroll", "auto"],
      control: { type: "select" },
    },
    border: {
      options: ["0", "px", "1"],
      control: { type: "select" },
    },
    borderColor: {
      options: colorOptions,
      control: { type: "select" },
    },
    w: {
      options: spacingOptions,
      control: { type: "select" },
    },
    h: {
      options: spacingOptions,
      control: { type: "select" },
    },
  },
  args: {
    p: "4",
    bg: "surface-2",
    rounded: "3",
    shadow: "1",
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: (args) => (
    <Box {...args}>
      <Box p="3" bg="accent-3" rounded="2">
        Content inside a Box
      </Box>
    </Box>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Stack direction="column" gap="4">
      <Stack direction="row" gap="4" align="flex-start">
        {(["2", "4", "6", "8"] as const).map((size) => (
          <Box key={size} bg="accent-3" rounded="2" p={size}>
            <Box bg="accent-9" rounded="1" p="2" style={{ color: "white" }}>
              p="{size}"
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" gap="4" align="flex-start">
        {(["2", "4", "6", "8"] as const).map((size) => (
          <Box key={size} bg="blue-3" rounded="2" px={size} py="2">
            <Box bg="blue-9" rounded="1" p="2" style={{ color: "white" }}>
              px="{size}"
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  ),
};

export const AsPolymorphic: Story = {
  name: "Polymorphic (as)",
  render: () => (
    <Stack direction="column" gap="3">
      <Box as="section" p="4" bg="surface-2" rounded="3" border="px" borderColor="gray-4">
        Rendered as &lt;section&gt;
      </Box>
      <Box as="button" p="3" bg="accent-3" rounded="2" _hover={{ bg: "accent-4" }}>
        Rendered as &lt;button&gt;
      </Box>
      <Box as="a" p="3" bg="blue-3" rounded="2" _hover={{ bg: "blue-4" }}>
        Rendered as &lt;a&gt;
      </Box>
    </Stack>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <Stack direction="row" gap="4">
      <Box
        as="button"
        p="4"
        bg="surface-2"
        rounded="3"
        border="px"
        borderColor="gray-4"
        shadow="1"
        _hover={{ bg: "gray-3", shadow: "2" }}
        _active={{ bg: "gray-4" }}
      >
        Hover & active
      </Box>
      <Box
        as="button"
        p="4"
        bg="accent-3"
        rounded="3"
        border="px"
        borderColor="accent-6"
        _hover={{ bg: "accent-4", borderColor: "accent-7" }}
        _focus={{ borderColor: "accent-8", shadow: "2" }}
      >
        Hover & focus
      </Box>
    </Stack>
  ),
};

export const Borders: Story = {
  render: () => (
    <Stack direction="row" gap="4" wrap="wrap">
      <Box p="4" bg="surface-2" rounded="2" border="px" borderColor="gray-6">
        All borders
      </Box>
      <Box p="4" bg="surface-2" rounded="2" borderBottom="px" borderColor="accent-6">
        Bottom only
      </Box>
      <Box p="4" bg="surface-2" rounded="2" borderLeft="2" borderColor="blue-6">
        Left accent
      </Box>
      <Box p="4" bg="surface-2" roundedTop="4" roundedBottom="0" border="px" borderColor="gray-6">
        Rounded top
      </Box>
      <Box p="4" bg="surface-2" rounded="full" border="px" borderColor="gray-6">
        Pill
      </Box>
    </Stack>
  ),
};

export const Sizing: Story = {
  render: () => (
    <Stack direction="row" gap="3" align="flex-end">
      {(["8", "12", "16", "20"] as const).map((size) => (
        <Box
          key={size}
          w={size}
          h={size}
          bg="accent-3"
          rounded="2"
          display="flex"
          style={{
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--tgph-text-0)",
            fontFamily: "var(--tgph-family-mono)",
            color: "var(--tgph-gray-11)",
          }}
        >
          {size}
        </Box>
      ))}
    </Stack>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Stack direction="row" gap="6">
      {(["0", "inner", "1", "2", "3"] as const).map((level) => (
        <Box
          key={level}
          p="6"
          bg="surface-1"
          rounded="3"
          shadow={level}
          style={{
            fontSize: "var(--tgph-text-1)",
            fontFamily: "var(--tgph-family-mono)",
            color: "var(--tgph-gray-11)",
            textAlign: "center",
          }}
        >
          {level}
        </Box>
      ))}
    </Stack>
  ),
};
