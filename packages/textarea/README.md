# 📝 TextArea

> Multi-line text input component built on Telegraph's `Text` primitive.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/textarea.svg)](https://www.npmjs.com/package/@telegraph/textarea)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/textarea)](https://bundlephobia.com/result?p=@telegraph/textarea)
[![license](https://img.shields.io/npm/l/@telegraph/textarea)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/textarea
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/textarea";
```

Via Javascript:

```tsx
import "@telegraph/textarea/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { TextArea } from "@telegraph/textarea";
import { useState } from "react";

export const CommentBox = () => {
  const [comment, setComment] = useState("");

  return (
    <TextArea
      value={comment}
      onChange={(event) => setComment(event.target.value)}
      placeholder="Share your thoughts..."
      maxLength={500}
      rows={4}
    />
  );
};
```

## API Reference

### `<TextArea>`

Renders a `textarea` through Telegraph's `Text` component, so it takes the
typography and layout style props as well.

| Prop        | Type                                             | Default     | Description                             |
| ----------- | ------------------------------------------------ | ----------- | --------------------------------------- |
| `size`      | `"1" \| "2" \| "3"`                              | `"2"`       | Padding, font size and corner radius    |
| `variant`   | `"outline" \| "ghost"`                           | `"outline"` | Visual style                            |
| `resize`    | `"both" \| "vertical" \| "horizontal" \| "none"` | `"both"`    | CSS resize behavior                     |
| `errored`   | `boolean`                                        | `false`     | Applies the error styling               |
| `disabled`  | `boolean`                                        | `false`     | Disables the textarea                   |
| `textProps` | `TextProps<"textarea">`                          | `undefined` | Props merged onto the underlying `Text` |
| `tgphRef`   | `Ref<HTMLTextAreaElement>`                       | `undefined` | Ref to the textarea element             |

It also accepts every `textarea` attribute (`value`, `onChange`, `placeholder`,
`rows`, `maxLength`, `name`, `required`, `readOnly`) and every `Text` style prop
(`w`, `p`, `bg`, `rounded`, and the rest).

`TextArea` does not resize itself, count characters, or render helper and error
text. Compose those around it.

## Usage Patterns

### Sizes

```tsx
import { TextArea } from "@telegraph/textarea";

export const Sizes = () => (
  <>
    <TextArea size="1" placeholder="Size 1" />
    <TextArea size="2" placeholder="Size 2" />
    <TextArea size="3" placeholder="Size 3" />
  </>
);
```

### Variants

```tsx
import { TextArea } from "@telegraph/textarea";

export const Variants = () => (
  <>
    <TextArea variant="outline" placeholder="Outline variant" />
    <TextArea variant="ghost" placeholder="Ghost variant" />
  </>
);
```

### Disabled and errored

```tsx
import { TextArea } from "@telegraph/textarea";

export const States = () => (
  <>
    <TextArea placeholder="Default state" />
    <TextArea placeholder="Disabled state" disabled />
    <TextArea placeholder="Error state" errored />
  </>
);
```

`errored` styles the control. It does not render a message. Render your own
message next to the textarea and link it with `aria-describedby`.

### Resize behavior

```tsx
import { TextArea } from "@telegraph/textarea";

export const Resize = () => (
  <>
    <TextArea resize="vertical" placeholder="Vertical only" />
    <TextArea resize="none" placeholder="Fixed size" rows={6} />
  </>
);
```

### Style props

```tsx
import { TextArea } from "@telegraph/textarea";

export const Styled = () => (
  <TextArea w="full" p="3" rounded="3" placeholder="Full width" />
);
```

### `textProps`

Use `textProps` to reach the underlying `Text` when a prop would otherwise
collide with one of TextArea's own.

```tsx
import { TextArea } from "@telegraph/textarea";

export const WithTextProps = () => (
  <TextArea textProps={{ placeholder: "Set through the bag", color: "gray" }} />
);
```

A `data-*` key inside `textProps` is an object literal, so it fails
excess-property checking. Set it on the component instead.

### Form integration

```tsx
import { TextArea } from "@telegraph/textarea";
import { Controller, useForm } from "react-hook-form";

type FormData = { description: string };

export const FormExample = () => {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <label htmlFor="description">Description</label>
      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field, fieldState }) => (
          <>
            <TextArea
              {...field}
              id="description"
              errored={Boolean(fieldState.error)}
              aria-describedby={
                fieldState.error ? "description-error" : undefined
              }
              placeholder="Describe your project..."
              maxLength={1000}
            />
            {fieldState.error && (
              <span id="description-error">{fieldState.error.message}</span>
            )}
          </>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Data attributes

`TextArea` sets these for styling and for tests.

| Attribute                    | Values                                         |
| ---------------------------- | ---------------------------------------------- |
| `data-tgph-textarea`         | present                                        |
| `data-tgph-textarea-state`   | `default` \| `disabled` \| `error`             |
| `data-tgph-textarea-variant` | `outline` \| `ghost`                           |
| `data-tgph-textarea-size`    | `1` \| `2` \| `3`                              |
| `data-tgph-textarea-resize`  | `both` \| `vertical` \| `horizontal` \| `none` |

## Accessibility

`TextArea` renders a native `textarea`, so keyboard behavior, screen reader
support and focus order come from the browser.

Label it, because the component does not label itself. Use a `label` with
`htmlFor`, or `aria-label`.

`errored` sets `data-tgph-textarea-state="error"` and styles the control. It
does not set `aria-invalid` or announce anything. Set `aria-invalid` yourself,
and link your message with `aria-describedby`.
