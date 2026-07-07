import type { Meta, StoryObj } from "@storybook/react";
import { Bell, DoorClosed } from "lucide-react";
import { useState } from "react";

import { RadioCards as TelegraphRadioCards } from "./RadioCards";

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

const DEFAULT_OPTIONS = [
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
