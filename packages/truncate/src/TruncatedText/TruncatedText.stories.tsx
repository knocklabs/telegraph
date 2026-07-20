import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@telegraph/layout";

import {
  type Split,
  TruncatedText,
  type TruncatedTextProps,
} from "./TruncatedText";

const PATH =
  "apps/web/src/components/WorkflowGraphEditor/nodes/steps/BaseStepCard.tsx";

const meta = {
  title: "Components/TruncatedText",
  component: TruncatedText,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: [
        "children",
        "mode",
        "variant",
        "priority",
        "split",
        "marker",
        "color",
        "size",
        "maxWidth",
      ],
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "The text to truncate.",
    },
    mode: {
      options: ["truncate", "fruncate", "middle"],
      control: { type: "inline-radio" },
      description:
        "`truncate` clips the end, `fruncate` the start, `middle` elides the middle (string children only).",
    },
    variant: {
      options: ["default", "fade"],
      control: { type: "inline-radio" },
      description:
        "An ellipsis marker vs. a soft fade into the background (`fade` uses the CSS engine).",
    },
    priority: {
      options: ["end", "start"],
      control: { type: "inline-radio" },
      description:
        "`middle` only — the favored end: kept whole for `leaf-path`/`extension`, or given the odd character for the balanced `center`.",
    },
    split: {
      options: ["center", "extension", "leaf-path"],
      control: { type: "select" },
      description: "`middle` only — where the elision lands.",
    },
    marker: {
      control: { type: "text" },
      description:
        "A custom overflow marker (upgrades to the CSS engine). Empty = the native ellipsis.",
    },
    color: {
      options: [
        "default",
        "gray",
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "accent",
      ],
      control: { type: "select" },
      description: "The marker takes on the text color.",
    },
    size: {
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      control: { type: "select" },
    },
    maxWidth: {
      control: { type: "range", min: 80, max: 600, step: 10 },
      description: "The clip width, in px.",
    },
  },
  args: {
    as: "span",
    children: PATH,
    mode: "middle",
    variant: "default",
    priority: "end",
    split: "center",
    marker: "",
    color: "default",
    size: "2",
  },
} satisfies Meta<typeof TruncatedText>;

export default meta;

type Story = StoryObj<typeof meta>;

// `maxWidth` is exposed as a px number — an intuitive slider that clips in every
// mode — and applied via `style` rather than the component's spacing-token
// `maxWidth` prop. An empty `marker` maps to `undefined` (the native ellipsis).
type ControlArgs = Omit<TruncatedTextProps, "maxWidth"> & {
  maxWidth?: number;
};

// The one controllable story: flip mode, variant, color, size, split, width, and
// the marker live in the Controls panel. Hover a clipped result for the
// full-text tooltip.
export const Playground: StoryObj<ControlArgs> = {
  args: { maxWidth: 280 },
  render: ({ maxWidth, marker, style, as, ...args }) => (
    <TruncatedText
      as={as ?? "span"}
      {...args}
      marker={marker || undefined}
      style={{ maxWidth, ...style }}
    />
  ),
};

// A fixed, side-by-side comparison the single-value controls can't show: the
// three modes, plus `middle` + `leaf-path` (which keeps the file name whole).
export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack gap="4" direction="column" style={{ width: 260 }}>
      <TruncatedText as="span" mode="truncate" style={{ maxWidth: 260 }}>
        {PATH}
      </TruncatedText>
      <TruncatedText as="span" mode="fruncate" style={{ maxWidth: 260 }}>
        {PATH}
      </TruncatedText>
      <TruncatedText as="span" mode="middle" style={{ maxWidth: 260 }}>
        {PATH}
      </TruncatedText>
      <TruncatedText
        as="span"
        mode="middle"
        split="leaf-path"
        style={{ maxWidth: 260 }}
      >
        {PATH}
      </TruncatedText>
    </Stack>
  ),
};

// `split` (middle mode) accepts more than the named strategies in the control —
// an offset tuple or a raw index, too.
export const SplitStrategies: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const splits: { label: string; split: Split }[] = [
      { label: "center", split: "center" },
      { label: "extension", split: "extension" },
      { label: "leaf-path", split: "leaf-path" },
      { label: '["last", 8]', split: ["last", 8] },
      { label: "16", split: 16 },
    ];
    return (
      <Stack gap="4" direction="column" style={{ width: 220 }}>
        {splits.map(({ label, split }) => (
          <TruncatedText
            key={label}
            as="span"
            mode="middle"
            split={split}
            style={{ maxWidth: 220 }}
          >
            {PATH}
          </TruncatedText>
        ))}
      </Stack>
    );
  },
};

// `tooltipProps` forwards straight to the underlying Tooltip — here opening it
// instantly and swapping in a custom label in place of the auto-extracted full
// text. It still only appears when the text is actually truncated.
export const WithCustomTooltip: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <TruncatedText
      as="span"
      style={{ maxWidth: 240 }}
      tooltipProps={{
        delayDuration: 0,
        label: "Custom label shown in place of the full text",
      }}
    >
      This text has a custom tooltip configuration
    </TruncatedText>
  ),
};
