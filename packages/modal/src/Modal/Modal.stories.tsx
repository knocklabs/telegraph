import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@telegraph/button";
import React from "react";

import { Modal as TelegraphModal } from "./Modal";
import { ModalStackingProvider } from "./ModalStacking";

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
    const [open, setOpen] = React.useState(false);
    const Modal = TelegraphModal;
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Modal title">
          <Modal.Content>
            <Modal.Header>
              <Modal.Heading>Modal title</Modal.Heading>
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

export const ScrollingModal: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(false);
    const Modal = TelegraphModal;
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Modal title">
          <Modal.Content>
            <Modal.Header>
              <Modal.Heading>Modal title</Modal.Heading>
              <Modal.Close />
            </Modal.Header>
            <Modal.Body>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
              <h1>Modal body</h1>
            </Modal.Body>
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
  open: boolean;
  onOpenChange: (value: boolean) => void;
  depth: number;
  onClick: () => void;
};

const NestedModal = ({
  open,
  depth,
  onOpenChange,
  onClick,
}: NestedModalProps) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <TelegraphModal.Root
        a11yTitle={`Nested Modal ${depth}`}
        open={open}
        onOpenChange={onOpenChange}
        onMountAutoFocus={(event) => {
          // Demonstrate focusing on a specific element
          // when the modal is opened
          event.preventDefault();
          buttonRef.current?.focus();
        }}
      >
        <TelegraphModal.Content>
          <TelegraphModal.Header>
            <TelegraphModal.Heading>
              Nested Modal {depth}
            </TelegraphModal.Heading>
            <TelegraphModal.Close />
          </TelegraphModal.Header>
          <TelegraphModal.Body>
            <Button
              variant="outline"
              size="1"
              onClick={onClick}
              tgphRef={buttonRef}
            >
              Open Nested Modal {depth + 1}
            </Button>
          </TelegraphModal.Body>
        </TelegraphModal.Content>
      </TelegraphModal.Root>
    </>
  );
};

export const NestedModals: Story = {
  render: () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [modal1Open, setModal1Open] = React.useState(false);
    const [modal2Open, setModal2Open] = React.useState(false);
    const [modal3Open, setModal3Open] = React.useState(false);
    const [modal4Open, setModal4Open] = React.useState(false);
    /* eslint-enable react-hooks/rules-of-hooks */
    return (
      <>
        <ModalStackingProvider>
          <Button onClick={() => setModal1Open(true)}>Open Modal</Button>
          <NestedModal
            open={modal1Open}
            onOpenChange={setModal1Open}
            onClick={() => setModal2Open(true)}
            depth={0}
          />
          <NestedModal
            open={modal2Open}
            onOpenChange={setModal2Open}
            onClick={() => setModal3Open(true)}
            depth={1}
          />
          <NestedModal
            open={modal3Open}
            onOpenChange={setModal3Open}
            onClick={() => setModal4Open(true)}
            depth={2}
          />
          <NestedModal
            open={modal4Open}
            onOpenChange={setModal4Open}
            onClick={() => {}}
            depth={3}
          />
        </ModalStackingProvider>
      </>
    );
  },
};
