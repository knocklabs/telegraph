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

type NestedModalProps = {
  depth: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const NestedModal = ({ depth, open, onOpenChange }: NestedModalProps) => {
  const [childOpen, setChildOpen] = React.useState(false);
  return (
    <TelegraphModal.Root
      a11yTitle={`Nested Modal ${depth}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TelegraphModal.Content>
        <TelegraphModal.Header>
          <Heading as="h2" size="3">
            Nested Modal {depth}
          </Heading>
          <TelegraphModal.Close />
        </TelegraphModal.Header>
        <TelegraphModal.Body>
          <Button variant="outline" size="1" onClick={() => setChildOpen(true)}>
            Open Nested Modal {depth + 1}
          </Button>
          <NestedModal
            depth={depth + 1}
            open={childOpen}
            onOpenChange={setChildOpen}
          />
        </TelegraphModal.Body>
      </TelegraphModal.Content>
    </TelegraphModal.Root>
  );
};

export const NestedModals: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <NestedModal depth={0} open={open} onOpenChange={setOpen} />
        {/* <TelegraphModal.Root
          a11yTitle="Parent Modal"
          open={open.parent}
          onOpenChange={(value) => {
            setOpen((current) => ({
              ...current,
              parent: value,
            }));
          }}
        >
          <TelegraphModal.Content>
            <TelegraphModal.Header>
              <Heading as="h2" size="3">
                Modal title
              </Heading>
              <TelegraphModal.Close />
            </TelegraphModal.Header>
            <TelegraphModal.Body>
              <Button
                onClick={() =>
                  setOpen((current) => ({
                    ...current,
                    child: true,
                  }))
                }
              >
                Open Child Modal
              </Button>
              <TelegraphModal.Root
                a11yTitle="Child Modal"
                open={open.child}
                onOpenChange={(value) => {
                  setOpen((current) => ({
                    ...current,
                    child: value,
                  }));
                }}
              >
                <TelegraphModal.Content>
                  <TelegraphModal.Header>
                    <Heading as="h2" size="3">
                      Child Modal
                    </Heading>
                    <TelegraphModal.Close />
                  </TelegraphModal.Header>
                  <TelegraphModal.Body>Child Modal body</TelegraphModal.Body>
                </TelegraphModal.Content>
              </TelegraphModal.Root>
            </TelegraphModal.Body>
            <TelegraphModal.Footer>
              <Button variant="outline" size="1">
                Cancel
              </Button>
              <Button color="accent" size="1">
                Save
              </Button>
            </TelegraphModal.Footer>
          </TelegraphModal.Content>
        </TelegraphModal.Root> */}
      </>
    );
  },
};
