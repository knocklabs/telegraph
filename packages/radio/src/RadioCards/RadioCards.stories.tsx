import type { Meta, StoryObj } from "@storybook/react";
import { Bell, DoorClosed } from "lucide-react";
import { useState } from "react";

import { RadioCards as TelegraphRadioCards } from "./RadioCards";
import type { DefaultProps as RadioCardsProps } from "./RadioCards";

const meta: Meta<typeof TelegraphRadioCards> = {
  tags: ["autodocs"],
  title: "Components/RadioCards",
  component: TelegraphRadioCards,
  argTypes: {
    direction: {
      options: ["row", "row-reverse", "column", "column-reverse"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    direction: "row",
  },
};

export default meta;

type StorybookRadioCardsType = StoryObj<typeof TelegraphRadioCards>;

type RadioCardOption = RadioCardsProps["options"][number];

// Annotated as a tuple rather than an array so `DEFAULT_OPTIONS[0]` is not
// `| undefined` under `noUncheckedIndexedAccess`, while staying mutable so it
// can still be passed straight through as `options`.
const DEFAULT_OPTIONS: [RadioCardOption, RadioCardOption] = [
  {
    icon: { icon: Bell, alt: "Bell" },
    title: "Option 1",
    description: "Description 1",
    value: "1",
  },
  {
    icon: { icon: DoorClosed, alt: "Door" },
    title: "Option 2",
    description: "Description 2",
    value: "2",
  },
];

export const RadioCards: StorybookRadioCardsType = {
  render: ({ direction }) => {
    //eslint-disable-next-line
    const [value, setValue] = useState("1");
    return (
      <TelegraphRadioCards
        value={value}
        onValueChange={(value) => setValue(value)}
        direction={direction}
        options={DEFAULT_OPTIONS}
      />
    );
  },
};

export const Vertical: StorybookRadioCardsType = {
  render: () => {
    //eslint-disable-next-line
    const [value, setValue] = useState("1");
    return (
      <TelegraphRadioCards
        value={value}
        onValueChange={(value) => setValue(value)}
        direction="column"
        orientation="vertical"
        options={DEFAULT_OPTIONS}
      />
    );
  },
};

export const DisabledOption: StorybookRadioCardsType = {
  render: () => {
    //eslint-disable-next-line
    const [value, setValue] = useState("1");
    return (
      <TelegraphRadioCards
        value={value}
        onValueChange={(value) => setValue(value)}
        direction="row"
        options={[
          DEFAULT_OPTIONS[0],
          {
            ...DEFAULT_OPTIONS[1],
            disabled: true,
          },
        ]}
      />
    );
  },
};
