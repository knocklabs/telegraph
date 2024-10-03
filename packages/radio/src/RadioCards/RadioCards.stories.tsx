import type { Meta, StoryObj } from "@storybook/react";
import { Lucide } from "@telegraph/icon";
import React from "react";

import { RadioCards as TelegraphRadioCards } from "./RadioCards";

const meta: Meta<typeof TelegraphRadioCards> = {
  title: "Components/RadioCards",
  component: TelegraphRadioCards,
  argTypes: {
    align: {
      options: ["horizontal", "vertical"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    align: "horizontal",
  },
};

export default meta;

type StorybookRadioCardsType = StoryObj<typeof TelegraphRadioCards>;

export const RadioCards: StorybookRadioCardsType = {
  render: ({ align }) => {
    //eslint-disable-next-line
    const [value, setValue] = React.useState("1");
    return (
      <TelegraphRadioCards
        value={value}
        onValueChange={(value) => setValue(value)}
        align={align}
        options={[
          {
            icon: { icon: Lucide.Bell, alt: "Bell" },
            title: "Option 1",
            description: "Description 1",
            value: "1",
          },
          {
            icon: { icon: Lucide.DoorClosed, alt: "Door" },
            title: "Option 2",
            description: "Description 2",
            value: "2",
          },
        ]}
      />
    );
  },
};
