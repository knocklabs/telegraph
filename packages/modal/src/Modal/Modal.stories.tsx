import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import { Heading } from "@telegraph/typography";
import React from "react";

import { Modal as TelegraphModal } from "./Modal";

const meta: Meta<typeof TelegraphModal.Root> = {
  title: "Components/Modal",
  component: TelegraphModal.Root,
};

export default meta;

type Story = StoryObj<typeof TelegraphModal.Root>;

export const Modal: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <TelegraphModal.Root open={open} onOpenChange={setOpen}>
          <TelegraphModal.Content>
            <TelegraphModal.Header>
              <Heading as="h2" size="3">
                Modal title
              </Heading>
              <TelegraphModal.Close />
            </TelegraphModal.Header>
            <TelegraphModal.Body>Modal body</TelegraphModal.Body>
            <TelegraphModal.Footer>
              <Button variant="outline">Cancel</Button>
              <Button color="accent">Save</Button>
            </TelegraphModal.Footer>
          </TelegraphModal.Content>
        </TelegraphModal.Root>
      </>
    );
  },
};
