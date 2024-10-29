import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Heading } from "@telegraph/typography";
import React from "react";

import { Modal as TelegraphModal } from "./Modal";

const meta: Meta<typeof TelegraphModal.Root> = {
  title: "Components/Modal",
  component: TelegraphModal.Root,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: {
        type: "boolean",
      },
    },
    onOpenChange: {
      control: {
        type: "function",
      },
    },
  },
  args: {
    open: true,
  },
};

export default meta;

type Story = StoryObj<typeof TelegraphModal.Root>;

export const Modal: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(true);
    const Modal = TelegraphModal;
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Modal title">
          <Modal.Content>
            <Modal.Header>
              <Heading as="h2" size="3">
                Modal title
              </Heading>
              <Modal.Close />
            </Modal.Header>
            <Modal.Body>Modal body</Modal.Body>
            <Modal.Footer>
              <Button variant="outline" size="1">
                Cancel
              </Button>
              <Button color="accent" size="1">
                Save
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      </>
    );
  },
};
