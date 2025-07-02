import { Filter } from ".";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { TgphComponentProps } from "@telegraph/helpers";
import {
  Apple,
  Fish,
  ListFilter,
  MemoryStick,
  Moon,
  Mountain,
} from "lucide-react";
import React from "react";

const meta = {
  title: "Components/Filter",
  component: Filter.Root,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Filter.Root>;

export default meta;
type Story = StoryObj<TgphComponentProps<typeof Filter.Root>>;

export const Default: Story = {
  render: () => {
    return (
      <Filter.Root>
        <Filter.ChipDisplay />
        <Filter.Trigger>
          <Button
            variant="outline"
            size="1"
            leadingIcon={{
              icon: ListFilter,
              "aria-hidden": true,
            }}
          >
            Filter
          </Button>
        </Filter.Trigger>
        <Filter.Content>
          <Filter.Parameter
            name="Favorite Beverage"
            value="favorite-beverage"
            icon={Apple}
          >
            <Filter.Menu name="Beverages" icon={Apple} isSearchable>
              <Filter.Menu name="Sodas">
                <Filter.Option name="Sprite" value="sprite" />
                <Filter.Option name="Dr. Pepper" value="dr-pepper" />
              </Filter.Menu>
              <Filter.Menu name="Juices">
                <Filter.Parameter
                  value="favorite-juice"
                  name="Favorite Juice"
                  icon={Fish}
                >
                  <Filter.Menu name="Fruit Juices" icon={Fish}>
                    <Filter.Option value="apple-juice" icon={Amphora} />
                    <Filter.Option name="Orange Juice" value="orange-juice" />
                  </Filter.Menu>
                </Filter.Parameter>
                <Filter.Option name="Vegetable Juice" value="vegetable-juice" />
                <Filter.Option name="Prune Juice" value="prune-juice" />
              </Filter.Menu>
              <Filter.Menu name="Flavored Water">
                <Filter.Option
                  name="Berry Sparkling Water"
                  value="sparkling-water"
                />
                <Filter.Option name="Lemon Soda Water" value="soda-water" />
              </Filter.Menu>
            </Filter.Menu>
          </Filter.Parameter>
          <Filter.Divider />
          <Filter.Parameter
            name="Favorite Snacks"
            value="favorite-snacks"
            icon={Mountain}
            isMulti
            pluralNoun="snacks"
          >
            <Filter.Menu name="Snacks" icon={Mountain}>
              <Filter.Option
                name="Chocolate"
                value="chocolate"
                icon={MemoryStick}
              />
              <Filter.Option name="Pretzels" value="pretzels" icon={Moon} />
            </Filter.Menu>
          </Filter.Parameter>
        </Filter.Content>
      </Filter.Root>
    );
  },
};
