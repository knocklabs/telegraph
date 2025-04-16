![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/truncate.svg)](https://www.npmjs.com/package/@telegraph/truncate)

# @telegraph/truncate

> Utility components for detecting and responding to content overflow, truncation, and visibility states in the UI.

## Installation Instructions

```
npm install @telegraph/truncate
```

## Components

### `<TruncatedText/>`

A text component that automatically truncates content with an ellipsis and shows a tooltip when truncated.

```tsx
import { TruncatedText } from "@telegraph/truncate";

<TruncatedText maxWidth="40">
  This text will be truncated if it exceeds the container width
</TruncatedText>;
```

#### Props

| Name         | Type                                                   | Default | Description                                                                                                  |
| ------------ | ------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| tooltipProps | Partial<TgphComponentProps<typeof TooltipIfTruncated>> | `{}`    | Props to pass to the underlying TooltipIfTruncated component                                                 |
| ...TextProps | TgphComponentProps<typeof Text>                        | -       | All props from [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) |

### `<TooltipIfTruncated/>`

A component that conditionally shows a tooltip only when its content is truncated.

```tsx
import { TooltipIfTruncated } from "@telegraph/truncate";

<TooltipIfTruncated>
  <span>This text will show a tooltip only when truncated</span>
</TooltipIfTruncated>;
```

#### Props

| Name            | Type                               | Default | Description                                                                                            |
| --------------- | ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| label           | string                             | -       | The text to show in the tooltip. If not provided, will use the content's text                          |
| ...TooltipProps | TgphComponentProps<typeof Tooltip> | -       | All props from [@telegraph/tooltip](https://github.com/knocklabs/telegraph/tree/main/packages/tooltip) |

## Hooks

### `useTruncate`

A hook that detects whether an element's content is truncated.

```tsx
import { useTruncate } from "@telegraph/truncate";

const MyComponent = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { truncated } = useTruncate({ tgphRef: ref });

  return (
    <div ref={ref}>{truncated ? "Content is truncated" : "Content fits"}</div>
  );
};
```

#### Parameters

| Name   | Type                                        | Description                                                           |
| ------ | ------------------------------------------- | --------------------------------------------------------------------- |
| params | `{ tgphRef: React.RefObject<HTMLElement> }` | A ref to the element to check for truncation                          |
| deps   | `React.DependencyList`                      | Optional dependencies to re-run the truncation check when they change |

#### Returns

| Name      | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| truncated | `boolean` | Whether the element's content is truncated |
