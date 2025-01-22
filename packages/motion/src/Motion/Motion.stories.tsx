import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { AnimatePresence } from "../AnimatePresence";

import { Motion } from "./Motion";

const meta: Meta<typeof Motion> = {
  title: "Components/Motion",
  component: Motion,
};

export default meta;

type Story = StoryObj<typeof Motion>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>

        <AnimatePresence>
          {isOpen && (
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 300,
              }}
              key="motion-div"
            >
              Motion
            </Motion>
          )}
        </AnimatePresence>
      </>
    );
  },
};
