# 📻 Radio

> A standalone radio and a card-style radio group for the Telegraph design system.

This package ships two ways to pick one option from a set:

- **`Radio`** with **`RadioGroup`** — a plain radio: a circle with a dot, and a
  label. Visually the checkbox from `@telegraph/checkbox`, rounded.
- **`RadioCards`** — the same choice rendered as selectable cards, with a
  title, description, and icon per option.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/radio.svg)](https://www.npmjs.com/package/@telegraph/radio)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/radio)](https://bundlephobia.com/result?p=@telegraph/radio)
[![license](https://img.shields.io/npm/l/@telegraph/radio)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/radio
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/radio";
```

Via Javascript:

```tsx
import "@telegraph/radio/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { RadioCards } from "@telegraph/radio";
import { Archive, Edit, Plus } from "lucide-react";

export const ActionSelector = () => {
  const [selectedAction, setSelectedAction] = useState("add");

  return (
    <RadioCards
      value={selectedAction}
      onValueChange={setSelectedAction}
      options={[
        {
          icon: { icon: Plus, alt: "Add" },
          title: "Create New",
          description: "Add a new item",
          value: "add",
        },
        {
          icon: { icon: Edit, alt: "Edit" },
          title: "Edit Existing",
          description: "Modify current item",
          value: "edit",
        },
        {
          icon: { icon: Archive, alt: "Archive" },
          title: "Archive",
          description: "Move to archive",
          value: "archive",
        },
      ]}
    />
  );
};
```

## API Reference

### A note on `value`

Two props share the name and do different jobs. Worth reading once:

| Prop               | Type     | What it is                                   |
| ------------------ | -------- | -------------------------------------------- |
| `RadioGroup.value` | `string` | Which option is selected                     |
| `Radio.value`      | `string` | This option's identity, and its form payload |

A radio has no selected state of its own. Base UI derives it entirely from the
enclosing group, so `Radio` needs a `RadioGroup` ancestor and there is no
single-radio API. That also means there is no `indeterminate` state: radios do
not have one.

`RadioGroup` owns the `name`, so each radio's `value` is what the form submits
under it. The `formValue` collision that `@telegraph/checkbox` has does not
arise here.

### `<Radio.Default>` (Default Component)

Renders the control and an associated label.

| Prop           | Type                | Default     | Description                             |
| -------------- | ------------------- | ----------- | --------------------------------------- |
| `value`        | `string`            | —           | **Required.** This option's identity    |
| `label`        | `ReactNode`         | —           | Visible label, associated via `htmlFor` |
| `size`         | `"1" \| "2"`        | `"2"`       | Control size                            |
| `color`        | `RadioColor`        | `"default"` | Color when selected                     |
| `disabled`     | `boolean`           | `false`     | Disables this option                    |
| `readOnly`     | `boolean`           | `false`     | Blocks changes, but still submits       |
| `required`     | `boolean`           | `false`     | Must be chosen before the form submits  |
| `labelProps`   | `RadioLabelProps`   | —           | Forwarded to `Radio.Label`. No `id`     |
| `controlProps` | `RadioControlProps` | —           | Forwarded to `Radio.Control`            |

`color` accepts `default`, `accent`, `blue`, `gray`, `green`, `purple`, `red`,
and `yellow` — the same set as `@telegraph/button` and `@telegraph/checkbox`.

```tsx
import { Radio, RadioGroup } from "@telegraph/radio";

<RadioGroup name="plan" value={plan} onValueChange={setPlan}>
  <Radio.Default value="free" label="Free" />
  <Radio.Default value="pro" label="Pro" />
  <Radio.Default value="enterprise" label="Enterprise" disabled />
</RadioGroup>;
```

### Composable parts

```tsx
<RadioGroup name="plan" defaultValue="pro">
  <Radio.Root value="pro">
    <Radio.Control />
    <Radio.Label>Pro</Radio.Label>
  </Radio.Root>
</RadioGroup>
```

- **`<Radio.Root>`** — holds state and layout, and provides context. Takes
  every prop in the table above except `label`, `labelProps` and
  `controlProps`. Also accepts `Stack` layout props and `as` / `tgphRef`.
- **`<Radio.Control>`** — the circle and its dot. Takes `Stack` layout props,
  so `controlProps={{ w: "6" }}` resizes it. Pass `dotProps` to restyle the
  dot.
- **`<Radio.Label>`** — the label, associated with the control automatically.
  It sets its own `id`, because that is what the control points
  `aria-labelledby` at, so `labelProps` does not take one.

### What names the control

The first of these that applies wins:

1. `aria-labelledby` on `Radio.Root`
2. A visible `Radio.Label`
3. `aria-label` on `Radio.Root`
4. A wrapping `<label>` or a `Field.Label`

So `aria-label` is for a radio with no visible label. Passing it alongside a
label does nothing, because Base UI derives `aria-labelledby` from the
associated `<label>` and that outranks `aria-label`. Use `aria-labelledby` when
the accessible name has to differ from the visible text.

### `<RadioGroup>`

| Prop            | Type                    | Default    | Description                                   |
| --------------- | ----------------------- | ---------- | --------------------------------------------- |
| `value`         | `string`                | —          | Controlled selection                          |
| `defaultValue`  | `string`                | —          | Initial selection when uncontrolled           |
| `onValueChange` | `(value, eventDetails)` | —          | Fired when the selection changes              |
| `name`          | `string`                | —          | Form field name for the whole group           |
| `form`          | `string`                | —          | Id of a form the group is rendered outside of |
| `size`          | `"1" \| "2"`            | —          | Applied to children that don't set their own  |
| `color`         | `RadioColor`            | —          | Applied to children that don't set their own  |
| `disabled`      | `boolean`               | `false`    | Disables every child                          |
| `readOnly`      | `boolean`               | `false`    | Blocks changes across the group               |
| `required`      | `boolean`               | `false`    | An option must be chosen before submitting    |
| `direction`     | `"row" \| "column"`     | `"column"` | Layout direction                              |
| `gap`           | Telegraph spacing token | `"2"`      | Space between radios                          |

It renders a `Stack`, so the usual layout props apply. Arrow keys move the
selection and the whole group is a single tab stop — that is Base UI's own
roving focus, not a Telegraph shim.

A group's `disabled` wins over a child's. `<Radio.Default disabled={false}>`
inside a disabled group stays disabled, which is Base UI's rule.

The second argument to `onValueChange` is Base UI's event detail, matching
`@telegraph/checkbox`. It carries the native event and `cancel()`.

### `<RadioCards>`

The main component that renders a radio group with card-style options.
RadioCards is backed by Base UI Radio primitives and keeps the Telegraph public
API, styling hooks, and `tgphRef` behavior stable.

| Prop            | Type                                                     | Default     | Description                          |
| --------------- | -------------------------------------------------------- | ----------- | ------------------------------------ |
| `value`         | `string`                                                 | `undefined` | Currently selected value             |
| `onValueChange` | `(value: string) => void`                                | `undefined` | Callback when selection changes      |
| `options`       | `RadioOption[]`                                          | -           | Array of radio option configurations |
| `direction`     | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `"row"`     | Layout direction for the radio group |

#### RadioOption Type

```tsx
type RadioOption = {
  value: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: { icon: LucideIcon; alt: string };
  // Additional RadioCards.Item props
};
```

### Composition Components

For custom layouts, use the individual components:

- **`<RadioCards.Root>`** - Radio group container
- **`<RadioCards.Item>`** - Individual radio button item rendered as a Telegraph button
- **`<RadioCards.ItemTitle>`** - Title text component
- **`<RadioCards.ItemDescription>`** - Description text component
- **`<RadioCards.ItemIcon>`** - Icon component

For detailed props of each component, see the [Complete Component Reference](#complete-component-reference) section below.

## Usage Patterns

### Basic Selection

```tsx
import { RadioCards } from "@telegraph/radio";
import { Bookmark, Heart, Star } from "lucide-react";

export const PreferenceSelector = () => {
  const [preference, setPreference] = useState("star");

  return (
    <RadioCards
      value={preference}
      onValueChange={setPreference}
      options={[
        { icon: { icon: Star, alt: "Star" }, title: "Favorite", value: "star" },
        { icon: { icon: Heart, alt: "Heart" }, title: "Love", value: "love" },
        {
          icon: { icon: Bookmark, alt: "Bookmark" },
          title: "Save",
          value: "save",
        },
      ]}
    />
  );
};
```

### Vertical Layout

```tsx
<RadioCards
  direction="column"
  value={selectedPlan}
  onValueChange={setSelectedPlan}
  options={[
    {
      title: "Basic Plan",
      description: "$10/month - Essential features",
      value: "basic",
    },
    {
      title: "Pro Plan",
      description: "$25/month - Advanced features",
      value: "pro",
    },
    {
      title: "Enterprise",
      description: "Custom pricing - Full suite",
      value: "enterprise",
    },
  ]}
/>
```

### Text-Only Options

```tsx
<RadioCards
  value={priority}
  onValueChange={setPriority}
  options={[
    { title: "Low", description: "Can wait", value: "low" },
    { title: "Medium", description: "Normal priority", value: "medium" },
    { title: "High", description: "Urgent", value: "high" },
  ]}
/>
```

### Icon-Only Options

```tsx
<RadioCards
  value={view}
  onValueChange={setView}
  options={[
    { icon: { icon: Grid, alt: "Grid view" }, value: "grid" },
    { icon: { icon: List, alt: "List view" }, value: "list" },
    { icon: { icon: Card, alt: "Card view" }, value: "card" },
  ]}
/>
```

## Advanced Usage

### Custom Composition

```tsx
import { Box, Stack } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";

export const CustomRadioCards = ({ options, value, onValueChange }) => (
  <RadioCards.Root
    value={value}
    onValueChange={onValueChange}
    direction="row"
    gap="2"
  >
    {options.map((option) => (
      <RadioCards.Item key={option.value} value={option.value}>
        <Stack direction="column" align="center" p="4" gap="3">
          {option.icon && (
            <RadioCards.ItemIcon {...option.icon} size="6" color="primary" />
          )}

          <Stack direction="column" align="center" gap="1">
            {option.title && (
              <RadioCards.ItemTitle size="3" weight="semi-bold">
                {option.title}
              </RadioCards.ItemTitle>
            )}

            {option.description && (
              <RadioCards.ItemDescription size="1" align="center">
                {option.description}
              </RadioCards.ItemDescription>
            )}
          </Stack>

          {option.badge && (
            <Box px="2" py="1" bg="accent-3" rounded="1" color="accent-11">
              {option.badge}
            </Box>
          )}
        </Stack>
      </RadioCards.Item>
    ))}
  </RadioCards.Root>
);
```

### Form Integration

```tsx
import { RadioCards } from "@telegraph/radio";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  paymentMethod: string;
};

export const PaymentForm = () => {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="paymentMethod"
        control={control}
        rules={{ required: "Please select a payment method" }}
        render={({ field, fieldState }) => (
          <div>
            <RadioCards
              value={field.value}
              onValueChange={field.onChange}
              options={[
                {
                  icon: { icon: CreditCard, alt: "Credit card" },
                  title: "Credit Card",
                  description: "Visa, Mastercard, Amex",
                  value: "card",
                },
                {
                  icon: { icon: Wallet, alt: "PayPal" },
                  title: "PayPal",
                  description: "Pay with your PayPal account",
                  value: "paypal",
                },
              ]}
            />
            {fieldState.error && (
              <p className="error">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </form>
  );
};
```

### Conditional Options

```tsx
import { RadioCards } from "@telegraph/radio";

export const ConditionalRadio = ({ userPlan, options }) => {
  const filteredOptions = options.filter((option) => {
    if (option.requiresPro && userPlan !== "pro") {
      return false;
    }
    return true;
  });

  return (
    <RadioCards
      value={selectedOption}
      onValueChange={setSelectedOption}
      options={filteredOptions.map((option) => ({
        ...option,
        title:
          option.requiresPro && userPlan !== "pro"
            ? `${option.title} (Pro only)`
            : option.title,
        disabled: option.requiresPro && userPlan !== "pro",
      }))}
    />
  );
};
```

### Loading States

```tsx
import { Box, Stack } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";

export const RadioCardsWithLoading = ({ loading, options, ...props }) => {
  if (loading) {
    return (
      <Stack direction="row" gap="1">
        {[1, 2, 3].map((i) => (
          <Box key={i} w="32" h="20" bg="gray-3" rounded="2" />
        ))}
      </Stack>
    );
  }

  return <RadioCards options={options} {...props} />;
};
```

### Multi-Step Selection

```tsx
import { RadioCards } from "@telegraph/radio";

export const MultiStepSelector = () => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({});

  const handleStepSelection = (value: string) => {
    setSelections((prev) => ({ ...prev, [`step${step}`]: value }));
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div>
      <h3>Step {step} of 3</h3>

      {step === 1 && (
        <RadioCards
          value={selections.step1}
          onValueChange={handleStepSelection}
          options={categoryOptions}
        />
      )}

      {step === 2 && (
        <RadioCards
          value={selections.step2}
          onValueChange={handleStepSelection}
          options={subcategoryOptions[selections.step1]}
        />
      )}

      {step === 3 && (
        <RadioCards
          value={selections.step3}
          onValueChange={handleStepSelection}
          options={finalOptions}
        />
      )}
    </div>
  );
};
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support for radio group navigation
- ✅ **Screen Reader Support**: Proper ARIA attributes and roles
- ✅ **Focus Management**: Clear focus indicators and logical tab order
- ✅ **High Contrast**: Supports high contrast mode
- ✅ **Touch Targets**: Adequate touch target sizes for mobile devices

### Keyboard Shortcuts

| Key          | Action                             |
| ------------ | ---------------------------------- |
| `Tab`        | Move focus to/from the radio group |
| `Arrow Keys` | Navigate between radio options     |
| `Space`      | Select the focused radio option    |

### ARIA Attributes

- `role="radiogroup"` - Applied to the root container
- `role="radio"` - Applied to each radio item
- `aria-checked` - Indicates the selected state
- `aria-labelledby` - Associates labels with radio items

### Best Practices

1. **Provide Clear Labels**: Always include meaningful titles for options
2. **Use Descriptions**: Add descriptions to clarify option meanings
3. **Logical Order**: Arrange options in a logical sequence
4. **Default Selection**: Consider providing a sensible default value
5. **Error States**: Clearly indicate validation errors

## Complete Component Reference

### `<RadioCards.Root>`

The radio group container component.

| Prop            | Type                                                     | Default     | Description               |
| --------------- | -------------------------------------------------------- | ----------- | ------------------------- |
| `value`         | `string`                                                 | `undefined` | Currently selected value  |
| `onValueChange` | `(value: string) => void`                                | `undefined` | Selection change callback |
| `direction`     | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `"row"`     | Layout direction          |
| `gap`           | `string`                                                 | `"1"`       | Space between items       |

### `<RadioCards.Item>`

Individual radio button item.

| Prop       | Type        | Default | Description                     |
| ---------- | ----------- | ------- | ------------------------------- |
| `value`    | `string`    | -       | The value for this radio option |
| `disabled` | `boolean`   | `false` | Whether the option is disabled  |
| `children` | `ReactNode` | -       | Content of the radio item       |

### `<RadioCards.ItemTitle>`

Title text component for radio items.

| Prop       | Type                                                                 | Default    | Description        |
| ---------- | -------------------------------------------------------------------- | ---------- | ------------------ |
| `size`     | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"` | `"2"`      | Text size          |
| `weight`   | `"regular" \| "medium" \| "semi-bold" \| "bold"`                     | `"medium"` | Font weight        |
| `children` | `ReactNode`                                                          | -          | Title text content |

### `<RadioCards.ItemDescription>`

Description text component for radio items.

| Prop       | Type                                                                                                                                   | Default  | Description              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------ |
| `size`     | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"`                                                                   | `"0"`    | Text size                |
| `color`    | `"default" \| "gray" \| "red" \| "beige" \| "blue" \| "green" \| "yellow" \| "purple" \| "accent" \| "white" \| "black" \| "disabled"` | `"gray"` | Text color               |
| `children` | `ReactNode`                                                                                                                            | -        | Description text content |

### `<RadioCards.ItemIcon>`

Icon component for radio items.

| Prop    | Type                                                                                                                                   | Default  | Description                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| `icon`  | `LucideIcon`                                                                                                                           | -        | Lucide icon component         |
| `alt`   | `string`                                                                                                                               | -        | Alternative text for the icon |
| `size`  | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"`                                                                   | `"2"`    | Icon size                     |
| `color` | `"default" \| "gray" \| "accent" \| "red" \| "blue" \| "green" \| "yellow" \| "purple" \| "beige" \| "white" \| "black" \| "disabled"` | `"gray"` | Icon color                    |

## Examples

### Basic Example

```tsx
import { RadioCards } from "@telegraph/radio";
import { Mail, MessageSquare, Phone } from "lucide-react";

export const ContactMethodSelector = () => {
  const [method, setMethod] = useState("email");

  return (
    <RadioCards
      value={method}
      onValueChange={setMethod}
      options={[
        {
          icon: { icon: Mail, alt: "Email" },
          title: "Email",
          description: "We'll send updates via email",
          value: "email",
        },
        {
          icon: { icon: Phone, alt: "Phone" },
          title: "Phone",
          description: "We'll call you with updates",
          value: "phone",
        },
        {
          icon: { icon: MessageSquare, alt: "SMS" },
          title: "SMS",
          description: "We'll text you updates",
          value: "sms",
        },
      ]}
    />
  );
};
```

### Advanced Example

```tsx
import { Box, Stack } from "@telegraph/layout";
import { RadioCards } from "@telegraph/radio";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";

export const PricingPlanSelector = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <RadioCards.Root
      value={selectedPlan}
      onValueChange={setSelectedPlan}
      direction="row"
      gap="3"
    >
      {plans.map((plan) => (
        <RadioCards.Item key={plan.value} value={plan.value}>
          <Stack direction="column" p="4" gap="3" align="center">
            <RadioCards.ItemIcon icon={plan.icon} alt={plan.title} size="5" />

            <Stack direction="column" align="center" gap="2">
              <Stack direction="row" align="center" gap="2">
                <RadioCards.ItemTitle size="3" weight="semi-bold">
                  {plan.title}
                </RadioCards.ItemTitle>
                {plan.popular && (
                  <Tag size="0" color="accent">
                    Popular
                  </Tag>
                )}
              </Stack>

              <Text as="span" size="5" weight="bold">
                ${plan.price}/mo
              </Text>

              <RadioCards.ItemDescription align="center">
                {plan.description}
              </RadioCards.ItemDescription>
            </Stack>

            <Stack direction="column" gap="1" w="full">
              {plan.features.map((feature, index) => (
                <Text key={index} as="span" size="1" color="gray">
                  ✓ {feature}
                </Text>
              ))}
            </Stack>
          </Stack>
        </RadioCards.Item>
      ))}
    </RadioCards.Root>
  );
};
```

### Real-world Example

```tsx
import { RadioCards } from "@telegraph/radio";
import { useForm } from "react-hook-form";

export const DeliveryOptionsForm = () => {
  const { register, watch, handleSubmit } = useForm();
  const selectedDelivery = watch("delivery");

  const deliveryOptions = [
    {
      icon: { icon: Truck, alt: "Standard delivery" },
      title: "Standard Delivery",
      description: "5-7 business days",
      value: "standard",
      price: "Free",
    },
    {
      icon: { icon: Zap, alt: "Express delivery" },
      title: "Express Delivery",
      description: "2-3 business days",
      value: "express",
      price: "$9.99",
    },
    {
      icon: { icon: Clock, alt: "Same day delivery" },
      title: "Same Day",
      description: "Order by 2pm",
      value: "same-day",
      price: "$24.99",
    },
  ];

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <RadioCards
        {...register("delivery", { required: true })}
        value={selectedDelivery}
        direction="column"
        options={deliveryOptions.map((option) => ({
          ...option,
          title: (
            <Stack direction="row" justify="space-between" w="full">
              <span>{option.title}</span>
              <span className="price">{option.price}</span>
            </Stack>
          ),
        }))}
      />

      <Button type="submit" mt="4">
        Continue to Payment
      </Button>
    </form>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/radio)
- [Base UI Radio](https://base-ui.com/react/components/radio)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
