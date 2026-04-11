import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "./Stack";
import { Box } from "../Box";

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

const Swatch = ({
  color = "accent",
  label,
}: {
  color?: string;
  label?: string;
}) => (
  <Box
    p="3"
    bg={`${color}-3` as any}
    rounded="2"
    style={{
      fontSize: "var(--tgph-text-1)",
      fontFamily: "var(--tgph-family-mono)",
      color: `var(--tgph-${color}-11)`,
      textAlign: "center",
      minWidth: "4rem",
    }}
  >
    {label || color}
  </Box>
);

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      options: ["row", "column", "row-reverse", "column-reverse"],
      control: { type: "select" },
    },
    gap: {
      options: spacingOptions,
      control: { type: "select" },
    },
    align: {
      options: ["flex-start", "flex-end", "center", "stretch", "baseline"],
      control: { type: "select" },
    },
    justify: {
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ],
      control: { type: "select" },
    },
    wrap: {
      options: ["wrap", "nowrap", "wrap-reverse"],
      control: { type: "select" },
    },
  },
  args: {
    direction: "row",
    gap: "3",
    align: "center",
    justify: "flex-start",
    wrap: "nowrap",
  },
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Swatch color="accent" label="1" />
      <Swatch color="blue" label="2" />
      <Swatch color="green" label="3" />
      <Swatch color="purple" label="4" />
      <Swatch color="yellow" label="5" />
    </Stack>
  ),
};

export const Direction: Story = {
  render: () => (
    <Stack direction="row" gap="8">
      <Box>
        <Box
          pb="2"
          style={{
            fontSize: "var(--tgph-text-1)",
            fontWeight: "var(--tgph-weight-semi-bold)",
            color: "var(--tgph-gray-11)",
          }}
        >
          Row
        </Box>
        <Stack direction="row" gap="2">
          <Swatch color="accent" label="1" />
          <Swatch color="blue" label="2" />
          <Swatch color="green" label="3" />
        </Stack>
      </Box>
      <Box>
        <Box
          pb="2"
          style={{
            fontSize: "var(--tgph-text-1)",
            fontWeight: "var(--tgph-weight-semi-bold)",
            color: "var(--tgph-gray-11)",
          }}
        >
          Column
        </Box>
        <Stack direction="column" gap="2">
          <Swatch color="accent" label="1" />
          <Swatch color="blue" label="2" />
          <Swatch color="green" label="3" />
        </Stack>
      </Box>
    </Stack>
  ),
};

export const Alignment: Story = {
  render: () => {
    const justifyOptions = [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
    ] as const;
    const alignOptions = ["flex-start", "center", "flex-end", "stretch"] as const;

    return (
      <Stack direction="column" gap="4">
        {justifyOptions.map((justify) => (
          <Stack key={justify} direction="row" gap="4" align="flex-start">
            <Box
              w="32"
              style={{
                fontSize: "var(--tgph-text-0)",
                fontFamily: "var(--tgph-family-mono)",
                color: "var(--tgph-gray-10)",
                paddingTop: "var(--tgph-spacing-3)",
                flexShrink: 0,
              }}
            >
              justify: {justify}
            </Box>
            {alignOptions.map((align) => (
              <Box
                key={align}
                bg="gray-2"
                rounded="2"
                border="px"
                borderColor="gray-4"
                h="16"
                w="32"
                style={{ flexShrink: 0 }}
              >
                <Stack
                  direction="row"
                  gap="1"
                  justify={justify}
                  align={align}
                  h="16"
                >
                  <Box bg="accent-9" rounded="1" w="3" h="4" />
                  <Box bg="accent-9" rounded="1" w="3" h="6" />
                  <Box bg="accent-9" rounded="1" w="3" h="3" />
                </Stack>
              </Box>
            ))}
          </Stack>
        ))}
        <Stack direction="row" gap="4">
          <Box w="32" />
          {(["flex-start", "center", "flex-end", "stretch"] as const).map(
            (align) => (
              <Box
                key={align}
                w="32"
                style={{
                  fontSize: "var(--tgph-text-0)",
                  fontFamily: "var(--tgph-family-mono)",
                  color: "var(--tgph-gray-10)",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {align}
              </Box>
            ),
          )}
        </Stack>
      </Stack>
    );
  },
};

export const Wrapping: Story = {
  render: () => (
    <Box
      bg="gray-2"
      rounded="3"
      p="4"
      border="px"
      borderColor="gray-4"
      style={{ maxWidth: "400px" }}
    >
      <Stack direction="row" gap="2" wrap="wrap">
        {Array.from({ length: 12 }, (_, i) => (
          <Swatch key={i} color="accent" label={`${i + 1}`} />
        ))}
      </Stack>
    </Box>
  ),
};

export const NestedLayout: Story = {
  name: "Nested Layout",
  render: () => (
    <Stack
      direction="row"
      gap="0"
      bg="surface-1"
      rounded="4"
      border="px"
      borderColor="gray-4"
      shadow="2"
      overflow="hidden"
      style={{ height: "280px" }}
    >
      <Stack
        direction="column"
        gap="2"
        p="4"
        bg="gray-2"
        w="40"
        style={{ borderRight: "1px solid var(--tgph-gray-4)" }}
      >
        <Box
          pb="2"
          style={{
            fontSize: "var(--tgph-text-1)",
            fontWeight: "var(--tgph-weight-semi-bold)",
            color: "var(--tgph-gray-12)",
          }}
        >
          Sidebar
        </Box>
        {["Dashboard", "Settings", "Users"].map((item) => (
          <Box
            key={item}
            p="2"
            rounded="2"
            bg="gray-3"
            _hover={{ bg: "gray-4" }}
            as="button"
            style={{
              fontSize: "var(--tgph-text-1)",
              color: "var(--tgph-gray-11)",
              textAlign: "left",
              cursor: "pointer",
              border: "none",
            }}
          >
            {item}
          </Box>
        ))}
      </Stack>
      <Stack direction="column" gap="3" p="6" style={{ flex: 1 }}>
        <Box
          style={{
            fontSize: "var(--tgph-text-5)",
            fontWeight: "var(--tgph-weight-semi-bold)",
            color: "var(--tgph-gray-12)",
          }}
        >
          Content Area
        </Box>
        <Box
          style={{
            fontSize: "var(--tgph-text-2)",
            color: "var(--tgph-gray-11)",
          }}
        >
          Stack and Box compose together to create complex layouts. The sidebar
          uses a vertical Stack, while the content area is a separate column.
        </Box>
      </Stack>
    </Stack>
  ),
};
