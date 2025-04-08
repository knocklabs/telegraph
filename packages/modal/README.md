![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/modal.svg)](https://www.npmjs.com/package/@telegraph/modal)

# @telegraph/modal

> A flexible modal dialog component for building accessible overlays, dialogs, and popups.

## Installation

```bash
npm install @telegraph/modal
```

### Add stylesheet

```css
@import "@telegraph/modal";
```

## Usage

### Basic Usage

```tsx
import { Button } from "@telegraph/button";
import { Modal } from "@telegraph/modal";
import { Text } from "@telegraph/typography";

export const BasicModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Welcome</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body>
            <Text>This is a basic modal dialog.</Text>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>Confirm</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
```

### With Form

```tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import { Text } from "@telegraph/typography";

export const FormModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Create Project</Modal.Title>
          <Modal.Description>
            Enter the details for your new project.
          </Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <Stack as="form" gap="4">
            <Stack gap="1">
              <Text as="label" htmlFor="name">
                Project Name
              </Text>
              <Input id="name" placeholder="My Project" />
            </Stack>

            <Stack gap="1">
              <Text as="label" htmlFor="description">
                Description
              </Text>
              <Input
                as="textarea"
                id="description"
                placeholder="Enter project description..."
              />
            </Stack>
          </Stack>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

## API Reference

### Modal.Root

The container component that manages modal state.

#### Props

| Prop           | Type                      | Default | Description                               |
| -------------- | ------------------------- | ------- | ----------------------------------------- |
| `open`         | `boolean`                 | -       | Controlled open state                     |
| `defaultOpen`  | `boolean`                 | `false` | Initial open state                        |
| `onOpenChange` | `(open: boolean) => void` | -       | Open state change handler                 |
| `modal`        | `boolean`                 | `true`  | Whether modal blocks interactions outside |

### Modal.Content

The modal dialog container.

#### Props

| Prop       | Type                | Default    | Description       |
| ---------- | ------------------- | ---------- | ----------------- |
| `size`     | `"1" \| "2" \| "3"` | `"2"`      | Modal size        |
| `position` | `"center" \| "top"` | `"center"` | Vertical position |

### Modal.Header

Container for modal title and close button.

### Modal.Title

The modal title component. Uses proper heading semantics.

### Modal.Description

Optional description text below the title.

### Modal.Body

Container for modal content.

### Modal.Footer

Container for modal actions, typically buttons.

### Modal.Close

A button to close the modal.

#### Props

| Prop      | Type      | Default | Description                       |
| --------- | --------- | ------- | --------------------------------- |
| `asChild` | `boolean` | `false` | Whether to merge props onto child |

## Examples

### Confirmation Dialog

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import { Text } from "@telegraph/typography";

export const ConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Delete action
    setIsOpen(false);
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Content size="1">
        <Modal.Header>
          <Stack direction="row" gap="3" align="center">
            <Icon
              icon={Lucide.AlertTriangle}
              alt="Warning"
              color="red"
              size="5"
            />
            <Modal.Title>Delete Project</Modal.Title>
          </Stack>
        </Modal.Header>

        <Modal.Body>
          <Text>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Text>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" color="red" onClick={handleDelete}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Multi-Step Modal

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import { useState } from "react";

export const MultiStepModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Setup Wizard</Modal.Title>
          <Text size="1" color="gray">
            Step {step} of 3
          </Text>
        </Modal.Header>

        <Modal.Body>
          {step === 1 && <Text>Step 1 content...</Text>}
          {step === 2 && <Text>Step 2 content...</Text>}
          {step === 3 && <Text>Step 3 content...</Text>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Stack direction="row" gap="2">
            {step > 1 && (
              <Button variant="soft" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={step === 3 ? handleClose : handleNext}>
              {step === 3 ? "Finish" : "Next"}
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

## Accessibility

The Modal component follows WAI-ARIA guidelines:

- Uses `role="dialog"` and `aria-modal="true"`
- Manages focus trap within modal
- Provides proper labeling through `aria-labelledby` and `aria-describedby`
- Supports keyboard navigation:
  - `Tab`: Navigate focusable elements
  - `Shift + Tab`: Navigate backwards
  - `Escape`: Close modal
- Returns focus to trigger element on close
- Announces modal state changes to screen readers
