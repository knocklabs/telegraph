![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/radioCards.svg)](https://www.npmjs.com/package/@telegraph/radio)

# @telegraph/radio

> A flexible radio card component for selecting from a list of options with rich content.

## Installation

```bash
npm install @telegraph/radio
```

### Add stylesheet

```css
@import "@telegraph/radio";
```

## Usage

### Basic Usage

```tsx
import { Lucide } from "@telegraph/icon";
import { RadioCards } from "@telegraph/radio";

export const BasicRadioCards = () => {
  const [value, setValue] = useState("");

  const options = [
    {
      icon: { icon: Lucide.Bell, alt: "Notifications" },
      title: "Push Notifications",
      description: "Get notified instantly",
      value: "push",
    },
    {
      icon: { icon: Lucide.Mail, alt: "Email" },
      title: "Email Updates",
      description: "Receive updates via email",
      value: "email",
    },
  ];

  return (
    <RadioCards value={value} onValueChange={setValue} options={options} />
  );
};
```

### Custom Layout

```tsx
import { Icon, Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";
import { Text } from "@telegraph/typography";

export const CustomRadioCards = () => {
  const [value, setValue] = useState("");

  return (
    <RadioCards.Root value={value} onValueChange={setValue}>
      <Stack gap="3">
        <RadioCards.Item value="small">
          <Stack direction="row" gap="3" p="4" align="center">
            <Icon icon={Lucide.Minimize2} />
            <Stack gap="1">
              <Text weight="medium">Small</Text>
              <Text size="1" color="gray-11">
                1GB RAM, 1 CPU
              </Text>
            </Stack>
          </Stack>
        </RadioCards.Item>

        <RadioCards.Item value="medium">
          <Stack direction="row" gap="3" p="4" align="center">
            <Icon icon={Lucide.Square} />
            <Stack gap="1">
              <Text weight="medium">Medium</Text>
              <Text size="1" color="gray-11">
                2GB RAM, 2 CPU
              </Text>
            </Stack>
          </Stack>
        </RadioCards.Item>

        <RadioCards.Item value="large">
          <Stack direction="row" gap="3" p="4" align="center">
            <Icon icon={Lucide.Maximize2} />
            <Stack gap="1">
              <Text weight="medium">Large</Text>
              <Text size="1" color="gray-11">
                4GB RAM, 4 CPU
              </Text>
            </Stack>
          </Stack>
        </RadioCards.Item>
      </Stack>
    </RadioCards.Root>
  );
};
```

## API Reference

### RadioCards

The main component for simple usage.

#### Props

| Prop            | Type                      | Default | Description                   |
| --------------- | ------------------------- | ------- | ----------------------------- |
| `value`         | `string`                  | -       | The selected value            |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes |
| `options`       | `Array<RadioOption>`      | -       | Array of radio options        |

Where `RadioOption` is:

```ts
type RadioOption = {
  icon?: { icon: Icon; alt: string };
  title: string;
  description: string;
  value: string;
};
```

### RadioCards.Root

The container component for custom radio card layouts.

#### Props

| Prop            | Type                      | Default | Description                          |
| --------------- | ------------------------- | ------- | ------------------------------------ |
| `value`         | `string`                  | -       | The selected value                   |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes        |
| `disabled`      | `boolean`                 | `false` | Whether all radio cards are disabled |

### RadioCards.Item

Individual radio card item for custom layouts.

#### Props

| Prop       | Type      | Default | Description                     |
| ---------- | --------- | ------- | ------------------------------- |
| `value`    | `string`  | -       | The value of this option        |
| `disabled` | `boolean` | `false` | Whether this option is disabled |

## Accessibility

The RadioCards component follows WAI-ARIA guidelines for radio groups:

- Uses `role="radiogroup"` for the container
- Uses `role="radio"` for individual options
- Supports keyboard navigation:
  - `↓` / `→`: Next option
  - `↑` / `←`: Previous option
  - `Space`: Select option
- Announces selection changes to screen readers
- Manages focus appropriately

## Examples

### With Form Validation

```tsx
import { Stack } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";
import { Text } from "@telegraph/typography";

export const FormRadioCards = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setError(newValue ? "" : "Please select an option");
  };

  const options = [
    {
      icon: { icon: Lucide.CreditCard, alt: "Credit Card" },
      title: "Credit Card",
      description: "Pay with Visa, Mastercard, etc.",
      value: "card",
    },
    {
      icon: { icon: Lucide.Wallet, alt: "PayPal" },
      title: "PayPal",
      description: "Pay with your PayPal account",
      value: "paypal",
    },
  ];

  return (
    <Stack gap="2">
      <RadioCards
        value={value}
        onValueChange={handleChange}
        options={options}
      />
      {error && (
        <Text color="red-11" size="1">
          {error}
        </Text>
      )}
    </Stack>
  );
};
```

### With Images

```tsx
import { Stack } from "@telegraph/layout";
import { Box } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";
import { Text } from "@telegraph/typography";

export const ImageRadioCards = () => {
  const [value, setValue] = useState("");

  return (
    <RadioCards.Root value={value} onValueChange={setValue}>
      <Stack gap="3">
        <RadioCards.Item value="light">
          <Stack gap="3" p="4">
            <Box
              as="img"
              src="/themes/light.png"
              alt="Light theme preview"
              w="full"
              h="32"
              objectFit="cover"
              rounded="2"
            />
            <Stack gap="1">
              <Text weight="medium">Light Theme</Text>
              <Text size="1" color="gray-11">
                Clean and bright interface
              </Text>
            </Stack>
          </Stack>
        </RadioCards.Item>

        <RadioCards.Item value="dark">
          <Stack gap="3" p="4">
            <Box
              as="img"
              src="/themes/dark.png"
              alt="Dark theme preview"
              w="full"
              h="32"
              objectFit="cover"
              rounded="2"
            />
            <Stack gap="1">
              <Text weight="medium">Dark Theme</Text>
              <Text size="1" color="gray-11">
                Easy on the eyes
              </Text>
            </Stack>
          </Stack>
        </RadioCards.Item>
      </Stack>
    </RadioCards.Root>
  );
};
```
