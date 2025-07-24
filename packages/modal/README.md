# 🪟 Modal

> Accessible modal dialog component with stacking support, animations, and focus management built on Radix UI.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/modal.svg)](https://www.npmjs.com/package/@telegraph/modal)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/modal)](https://bundlephobia.com/result?p=@telegraph/modal)
[![license](https://img.shields.io/npm/l/@telegraph/modal)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/modal
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/modal";
```

Via Javascript:
```tsx
import "@telegraph/modal/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { useState } from "react";

export const BasicModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Settings">
        <Modal.Content>
          <Modal.Header>
            <h2>Settings</h2>
            <Modal.Close />
          </Modal.Header>
          
          <Modal.Body>
            <p>Configure your application settings here.</p>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
```

## API Reference

### `<Modal.Root>`

The root modal container that manages state and provides context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |
| `a11yTitle` | `string` | required | Accessible title for screen readers |
| `a11yDescription` | `string` | `undefined` | Accessible description for screen readers |
| `trapped` | `boolean` | `true` | Whether focus should be trapped |
| `onMountAutoFocus` | `(event: Event) => void` | `undefined` | Called when modal opens and focuses |
| `onUnmountAutoFocus` | `(event: Event) => void` | `undefined` | Called when modal closes and focus returns |
| `layer` | `number` | `undefined` | Layer index for stacked modals |

Inherits all Stack props for additional styling.

### `<Modal.Content>`

The content wrapper that handles the modal's main container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Modal content |

Inherits all Stack props for layout and styling.

### `<Modal.Header>`

Header section typically containing title and close button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Header content |

Inherits all Stack props for layout and styling.

### `<Modal.Body>`

Main content area with automatic scrolling when content overflows.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Body content |

Inherits all Stack props for layout and styling.

### `<Modal.Footer>`

Footer section typically containing action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Footer content |

Inherits all Stack props for layout and styling.

### `<Modal.Close>`

Close button that dismisses the modal.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `ButtonSize` | `"1"` | Button size |
| `variant` | `ButtonVariant` | `"ghost"` | Button variant |

Inherits all Button props for additional styling.

### `<ModalStackingProvider>`

Provider for managing multiple stacked modals.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | App content |

## Usage Patterns

### Basic Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { useState } from "react";

const BasicModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal.Root open={open} onOpenChange={setOpen} a11yTitle="Basic Modal">
        <Modal.Content>
          <Modal.Header>
            <h2>Modal Title</h2>
            <Modal.Close />
          </Modal.Header>
          
          <Modal.Body>
            <p>This is the modal content.</p>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
```

### Confirmation Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => (
  <Modal.Root open={open} onOpenChange={onClose} a11yTitle={title}>
    <Modal.Content maxW="96">
      <Modal.Header>
        <Stack direction="row" align="center" gap="2">
          <Icon icon={AlertTriangle} color="red" />
          <h2>{title}</h2>
        </Stack>
        <Modal.Close />
      </Modal.Header>
      
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Root>
);

// Usage
<ConfirmationModal
  open={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
/>
```

### Form Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

const FormModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Add User">
      <Modal.Content>
        <Modal.Header>
          <h2>Add New User</h2>
          <Modal.Close />
        </Modal.Header>
        
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Stack direction="column" gap="4">
              <Stack direction="column" gap="1">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name"
                />
              </Stack>
              
              <Stack direction="column" gap="1">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </Stack>
            </Stack>
          </form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Full-Screen Modal

```tsx
import { Modal } from "@telegraph/modal";

const FullScreenModal = ({ open, onClose, children }) => (
  <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Full Screen View">
    <Modal.Content w="screen" maxW="screen" h="screen" rounded="0">
      <Modal.Header>
        <h2>Full Screen Modal</h2>
        <Modal.Close />
      </Modal.Header>
      
      <Modal.Body flex="1">
        {children}
      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
);
```

## Advanced Usage

### Stacked Modals

For applications that need multiple modals open simultaneously:

```tsx
import { Modal, ModalStackingProvider } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { useState } from "react";

const StackedModalsExample = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);

  return (
    <ModalStackingProvider>
      <Button onClick={() => setModal1Open(true)}>Open First Modal</Button>
      
      {/* First Modal */}
      <Modal.Root 
        open={modal1Open} 
        onOpenChange={setModal1Open} 
        a11yTitle="First Modal"
      >
        <Modal.Content>
          <Modal.Header>
            <h2>First Modal</h2>
            <Modal.Close />
          </Modal.Header>
          
          <Modal.Body>
            <p>This is the first modal.</p>
            <Button onClick={() => setModal2Open(true)}>
              Open Second Modal
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      
      {/* Second Modal */}
      <Modal.Root 
        open={modal2Open} 
        onOpenChange={setModal2Open} 
        a11yTitle="Second Modal"
      >
        <Modal.Content>
          <Modal.Header>
            <h2>Second Modal</h2>
            <Modal.Close />
          </Modal.Header>
          
          <Modal.Body>
            <p>This modal is stacked on top.</p>
            <Button onClick={() => setModal3Open(true)}>
              Open Third Modal
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      
      {/* Third Modal */}
      <Modal.Root 
        open={modal3Open} 
        onOpenChange={setModal3Open} 
        a11yTitle="Third Modal"
      >
        <Modal.Content>
          <Modal.Header>
            <h2>Third Modal</h2>
            <Modal.Close />
          </Modal.Header>
          
          <Modal.Body>
            <p>This is the top-most modal.</p>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </ModalStackingProvider>
  );
};
```

### Custom Focus Management

```tsx
import { Modal } from "@telegraph/modal";
import { useRef } from "react";

const CustomFocusModal = ({ open, onClose }) => {
  const firstInputRef = useRef(null);

  return (
    <Modal.Root
      open={open}
      onOpenChange={onClose}
      a11yTitle="Custom Focus"
      onMountAutoFocus={(event) => {
        event.preventDefault();
        firstInputRef.current?.focus();
      }}
      onUnmountAutoFocus={(event) => {
        event.preventDefault();
        // Custom focus return logic
      }}
    >
      <Modal.Content>
        <Modal.Header>
          <h2>Custom Focus Management</h2>
          <Modal.Close />
        </Modal.Header>
        
        <Modal.Body>
          <Input ref={firstInputRef} placeholder="This will be focused" />
          <Input placeholder="Second input" />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Modal with Loading State

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { Spinner } from "@telegraph/spinner";
import { useState } from "react";

const LoadingModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Save Changes">
      <Modal.Content>
        <Modal.Header>
          <h2>Save Changes</h2>
          <Modal.Close disabled={loading} />
        </Modal.Header>
        
        <Modal.Body>
          {loading ? (
            <Stack align="center" gap="2">
              <Spinner />
              <p>Saving changes...</p>
            </Stack>
          ) : (
            <p>Are you sure you want to save these changes?</p>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Modal with Custom Animation

```tsx
import { Modal } from "@telegraph/modal";
import { motion } from "motion/react";

const AnimatedModal = ({ open, onClose }) => (
  <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Animated Modal">
    <Modal.Content
      as={motion.div}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Modal.Header>
        <h2>Animated Modal</h2>
        <Modal.Close />
      </Modal.Header>
      
      <Modal.Body>
        <p>This modal has custom animations.</p>
      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
);
```

### Controlled Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";

// For when you need more control over modal behavior
const ControlledModal = () => {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(true);

  const handleOpenChange = (newOpen) => {
    if (!newOpen && !canClose) {
      // Prevent closing if conditions aren't met
      return;
    }
    setOpen(newOpen);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal.Root 
        open={open} 
        onOpenChange={handleOpenChange} 
        a11yTitle="Controlled Modal"
      >
        <Modal.Content>
          <Modal.Header>
            <h2>Controlled Modal</h2>
            {canClose && <Modal.Close />}
          </Modal.Header>
          
          <Modal.Body>
            <p>This modal's closing behavior is controlled.</p>
            <Button onClick={() => setCanClose(!canClose)}>
              {canClose ? 'Disable' : 'Enable'} Closing
            </Button>
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              onClick={() => setOpen(false)} 
              disabled={!canClose}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
```

### Modal with Steps/Wizard

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

const WizardModal = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { title: "Step 1", content: "First step content" },
    { title: "Step 2", content: "Second step content" },
    { title: "Step 3", content: "Final step content" },
  ];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Setup Wizard">
      <Modal.Content>
        <Modal.Header>
          <h2>{steps[currentStep].title}</h2>
          <Modal.Close />
        </Modal.Header>
        
        <Modal.Body>
          <Stack direction="column" gap="4">
            {/* Progress indicator */}
            <Stack direction="row" gap="1">
              {steps.map((_, index) => (
                <Box
                  key={index}
                  w="8"
                  h="1"
                  bg={index <= currentStep ? "accent-9" : "gray-6"}
                  rounded="full"
                />
              ))}
            </Stack>
            
            <p>{steps[currentStep].content}</p>
          </Stack>
        </Modal.Body>
        
        <Modal.Footer>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={isFirstStep}
          >
            Previous
          </Button>
          
          {isLastStep ? (
            <Button onClick={onClose}>
              Finish
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              Next
            </Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

## Design Tokens & Styling

The modal component uses Telegraph design tokens for consistent styling:

### Layout Tokens

- **Max width**: `var(--tgph-spacing-160)` (default)
- **Margin**: `var(--tgph-spacing-16)` from viewport edges
- **Border radius**: `var(--tgph-rounded-4)`
- **Shadow**: `var(--tgph-shadow-3)`

### Color Tokens

- **Background**: `var(--tgph-surface-1)`
- **Overlay**: `var(--tgph-alpha-black-6)`
- **Border**: `var(--tgph-gray-8)`

### Z-Index Tokens

- **Overlay**: `var(--tgph-zIndex-overlay)`
- **Modal**: `var(--tgph-zIndex-modal)`
- **Stacked modals**: `calc(var(--tgph-zIndex-modal) + layer)`

### Animation Tokens

- **Duration**: `0.3s` spring transition
- **Stacking offset**: `var(--tgph-spacing-4)` per layer
- **Scale reduction**: `0.02` per background layer

### Custom Styling

```css
.tgph {
  /* Custom modal styling */
  --modal-overlay-opacity: 0.8;
  --modal-animation-duration: 0.2s;
  
  /* Override default sizes */
  --modal-max-width: 500px;
  --modal-border-radius: var(--tgph-rounded-3);
  
  /* Custom stacking behavior */
  --modal-stack-offset: var(--tgph-spacing-6);
  --modal-stack-scale: 0.03;
}

/* Custom modal content styling */
[data-tgph-modal-content] {
  backdrop-filter: blur(4px);
  border: 2px solid var(--tgph-accent-6);
}

/* Custom animation overrides */
[data-tgph-modal-overlay] {
  animation: fadeIn var(--modal-animation-duration) ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Accessibility

- ✅ **Focus Management**: Automatic focus trapping and restoration
- ✅ **Keyboard Navigation**: Escape key closes modal
- ✅ **Screen Reader Support**: Proper ARIA roles and descriptions
- ✅ **Content Structure**: Semantic heading hierarchy
- ✅ **Backdrop Interaction**: Click outside to close
- ✅ **Focus Restoration**: Returns focus to trigger element

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close modal |
| `Tab` | Navigate to next focusable element |
| `Shift + Tab` | Navigate to previous focusable element |
| `Enter` / `Space` | Activate focused button |

### ARIA Attributes

- `role="dialog"` on modal content
- `aria-labelledby` references the title
- `aria-describedby` references the description
- `aria-modal="true"` indicates modal state
- `aria-hidden` on background content when modal is open

### Accessibility Guidelines

1. **Provide Clear Titles**: Always include `a11yTitle` for screen readers
2. **Use Semantic Headings**: Structure content with proper heading hierarchy
3. **Descriptive Labels**: Add `a11yDescription` for complex modals
4. **Focus Management**: Let the component handle focus automatically
5. **Escape Routes**: Always provide clear ways to close the modal

```tsx
// ✅ Good accessibility practices
<Modal.Root 
  open={open} 
  onOpenChange={setOpen}
  a11yTitle="Delete Confirmation"
  a11yDescription="Confirm that you want to permanently delete this item"
>
  <Modal.Content>
    <Modal.Header>
      <h2>Delete Item</h2>
      <Modal.Close />
    </Modal.Header>
    
    <Modal.Body>
      <p>Are you sure you want to delete "Document.pdf"? This action cannot be undone.</p>
    </Modal.Body>
    
    <Modal.Footer>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button color="red" onClick={handleDelete}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>

// ❌ Poor accessibility
<Modal.Root open={open} onOpenChange={setOpen}> {/* Missing a11yTitle */}
  <Modal.Content>
    <div>Delete Item</div> {/* Not a proper heading */}
    <div>Are you sure?</div> {/* No clear context */}
    <button onClick={handleDelete}>OK</button> {/* Unclear action */}
  </Modal.Content>
</Modal.Root>
```

### Best Practices

1. **Meaningful Titles**: Use descriptive titles that explain the modal's purpose
2. **Logical Structure**: Use Header, Body, Footer to create clear content areas
3. **Action Clarity**: Make button labels clear about their actions
4. **Error Handling**: Provide clear feedback for errors
5. **Consistent Patterns**: Use consistent modal patterns across your application

## Testing

### Testing Library Example

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@telegraph/modal";

test("opens and closes modal", async () => {
  const user = userEvent.setup();
  const handleOpenChange = jest.fn();
  
  render(
    <Modal.Root open={true} onOpenChange={handleOpenChange} a11yTitle="Test Modal">
      <Modal.Content>
        <Modal.Header>
          <h2>Test Modal</h2>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
  
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("Test Modal")).toBeInTheDocument();
  
  // Close via close button
  await user.click(screen.getByRole("button", { name: "Close Modal" }));
  expect(handleOpenChange).toHaveBeenCalledWith(false);
});

test("closes modal on escape key", async () => {
  const user = userEvent.setup();
  const handleOpenChange = jest.fn();
  
  render(
    <Modal.Root open={true} onOpenChange={handleOpenChange} a11yTitle="Test Modal">
      <Modal.Content>
        <Modal.Body>Content</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
  
  await user.keyboard("{Escape}");
  expect(handleOpenChange).toHaveBeenCalledWith(false);
});

test("handles form submission in modal", async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  
  render(
    <Modal.Root open={true} onOpenChange={() => {}} a11yTitle="Form Modal">
      <Modal.Content>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input name="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
  
  const input = screen.getByPlaceholderText("Email");
  const button = screen.getByRole("button", { name: "Submit" });
  
  await user.type(input, "test@example.com");
  await user.click(button);
  
  expect(handleSubmit).toHaveBeenCalled();
});
```

### Testing Modal State

```tsx
test("handles controlled modal state", () => {
  const { rerender } = render(
    <Modal.Root open={false} onOpenChange={() => {}} a11yTitle="Test Modal">
      <Modal.Content>
        <Modal.Body>Content</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
  
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  
  rerender(
    <Modal.Root open={true} onOpenChange={() => {}} a11yTitle="Test Modal">
      <Modal.Content>
        <Modal.Body>Content</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
  
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
```

### Testing Stacked Modals

```tsx
test("handles modal stacking", async () => {
  const user = userEvent.setup();
  
  render(
    <ModalStackingProvider>
      <Modal.Root open={true} onOpenChange={() => {}} a11yTitle="First Modal">
        <Modal.Content>
          <Modal.Body>First Modal</Modal.Body>
        </Modal.Content>
      </Modal.Root>
      
      <Modal.Root open={true} onOpenChange={() => {}} a11yTitle="Second Modal">
        <Modal.Content>
          <Modal.Body>Second Modal</Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </ModalStackingProvider>
  );
  
  const modals = screen.getAllByRole("dialog");
  expect(modals).toHaveLength(2);
  
  // The second modal should be on top
  expect(modals[1]).toHaveTextContent("Second Modal");
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(
    <Modal.Root 
      open={true} 
      onOpenChange={() => {}} 
      a11yTitle="Accessible Modal"
      a11yDescription="This modal has proper accessibility attributes"
    >
      <Modal.Content>
        <Modal.Header>
          <h2>Modal Title</h2>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          <p>Modal content with proper structure</p>
        </Modal.Body>
        <Modal.Footer>
          <button>Action</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Examples

### Settings Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Switch } from "@telegraph/switch";
import { Stack } from "@telegraph/layout";

export const SettingsModal = ({ open, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Application Settings">
      <Modal.Content maxW="120">
        <Modal.Header>
          <h2>Settings</h2>
          <Modal.Close />
        </Modal.Header>
        
        <Modal.Body>
          <Stack direction="column" gap="4">
            <Stack direction="column" gap="2">
              <h3>Profile</h3>
              <Stack direction="column" gap="1">
                <label htmlFor="display-name">Display Name</label>
                <Input
                  id="display-name"
                  value={localSettings.displayName}
                  onChange={(e) => setLocalSettings(prev => ({ 
                    ...prev, 
                    displayName: e.target.value 
                  }))}
                />
              </Stack>
            </Stack>
            
            <Stack direction="column" gap="2">
              <h3>Preferences</h3>
              <Stack direction="row" align="center" justify="between">
                <label htmlFor="notifications">Email Notifications</label>
                <Switch
                  id="notifications"
                  checked={localSettings.emailNotifications}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ 
                    ...prev, 
                    emailNotifications: checked 
                  }))}
                />
              </Stack>
              
              <Stack direction="row" align="center" justify="between">
                <label htmlFor="dark-mode">Dark Mode</label>
                <Switch
                  id="dark-mode"
                  checked={localSettings.darkMode}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ 
                    ...prev, 
                    darkMode: checked 
                  }))}
                />
              </Stack>
            </Stack>
          </Stack>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Image Gallery Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { ChevronLeft, ChevronRight, Download, Share } from "lucide-react";
import { useState } from "react";

export const ImageGalleryModal = ({ open, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const currentImage = images[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Image Gallery">
      <Modal.Content w="screen" maxW="screen" h="screen" rounded="0" p="0">
        <Modal.Header px="6" py="4">
          <Stack direction="row" align="center" justify="between" w="full">
            <h2>{currentImage?.title || `Image ${currentIndex + 1}`}</h2>
            <Stack direction="row" gap="2">
              <Button variant="ghost" icon={{ icon: Download, alt: "Download" }} />
              <Button variant="ghost" icon={{ icon: Share, alt: "Share" }} />
              <Modal.Close />
            </Stack>
          </Stack>
        </Modal.Header>
        
        <Modal.Body p="0" position="relative">
          <img
            src={currentImage?.src}
            alt={currentImage?.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'var(--tgph-black)'
            }}
          />
          
          {/* Navigation buttons */}
          {canGoPrev && (
            <Button
              variant="ghost"
              icon={{ icon: ChevronLeft, alt: "Previous image" }}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              style={{
                position: 'absolute',
                left: 'var(--tgph-spacing-4)',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          )}
          
          {canGoNext && (
            <Button
              variant="ghost"
              icon={{ icon: ChevronRight, alt: "Next image" }}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              style={{
                position: 'absolute',
                right: 'var(--tgph-spacing-4)',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          )}
        </Modal.Body>
        
        <Modal.Footer px="6" py="4">
          <Stack direction="row" align="center" justify="center" gap="2">
            {images.map((_, index) => (
              <Box
                key={index}
                w="2"
                h="2"
                bg={index === currentIndex ? "white" : "alpha-white-6"}
                rounded="full"
                onClick={() => setCurrentIndex(index)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

### Data Export Modal

```tsx
import { Modal } from "@telegraph/modal";
import { Button } from "@telegraph/button";
import { RadioCards } from "@telegraph/radio";
import { Checkbox } from "@telegraph/checkbox";
import { Select } from "@telegraph/select";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

export const ExportModal = ({ open, onClose, onExport }) => {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(false);

  const handleExport = () => {
    onExport({
      format,
      dateRange,
      includeHeaders,
      includeMetadata
    });
    onClose();
  };

  return (
    <Modal.Root open={open} onOpenChange={onClose} a11yTitle="Export Data">
      <Modal.Content>
        <Modal.Header>
          <h2>Export Data</h2>
          <Modal.Close />
        </Modal.Header>
        
        <Modal.Body>
          <Stack direction="column" gap="4">
            <Stack direction="column" gap="2">
              <h3>Export Format</h3>
              <RadioCards value={format} onValueChange={setFormat}>
                <RadioCards.Item value="csv">
                  <Stack direction="column" gap="1">
                    <strong>CSV</strong>
                    <span>Comma-separated values</span>
                  </Stack>
                </RadioCards.Item>
                <RadioCards.Item value="json">
                  <Stack direction="column" gap="1">
                    <strong>JSON</strong>
                    <span>JavaScript Object Notation</span>
                  </Stack>
                </RadioCards.Item>
                <RadioCards.Item value="xlsx">
                  <Stack direction="column" gap="1">
                    <strong>Excel</strong>
                    <span>Microsoft Excel format</span>
                  </Stack>
                </RadioCards.Item>
              </RadioCards>
            </Stack>
            
            <Stack direction="column" gap="2">
              <label htmlFor="date-range">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <Select.Option value="last-7-days">Last 7 days</Select.Option>
                <Select.Option value="last-30-days">Last 30 days</Select.Option>
                <Select.Option value="last-90-days">Last 90 days</Select.Option>
                <Select.Option value="all-time">All time</Select.Option>
              </Select>
            </Stack>
            
            <Stack direction="column" gap="2">
              <h3>Options</h3>
              <Stack direction="column" gap="2">
                <Checkbox
                  checked={includeHeaders}
                  onCheckedChange={setIncludeHeaders}
                >
                  Include column headers
                </Checkbox>
                <Checkbox
                  checked={includeMetadata}
                  onCheckedChange={setIncludeMetadata}
                >
                  Include metadata
                </Checkbox>
              </Stack>
            </Stack>
          </Stack>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export Data
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
```

## References

- [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/modal)
- [Design System Guidelines](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this component:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Open Storybook: `pnpm storybook`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

