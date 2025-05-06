import type { Meta, StoryObj } from "@storybook/react";

import { Layer } from "./Layer";

const meta: Meta<typeof Layer> = {
  title: "Components/Layer",
  component: Layer,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof Layer>;

export const Template: Story = {
  render: (args) => (
    <Layer>
      <Layer>
        <Layer>yo </Layer>
      </Layer>
    </Layer>
  ),
};

export default meta;
