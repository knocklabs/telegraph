# 🔗 Link

> Polymorphic link component with Telegraph typography, color, and icon options.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/link.svg)](https://www.npmjs.com/package/@telegraph/link)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/link)](https://bundlephobia.com/result?p=@telegraph/link)
[![license](https://img.shields.io/npm/l/@telegraph/link)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/link
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/link";
```

Via Javascript:

```tsx
import "@telegraph/link/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping Telegraph components.

## Quick Start

```tsx
import { Link } from "@telegraph/link";

export const Example = () => (
  <Link href="/docs" size="2" color="blue" weight="regular">
    Docs
  </Link>
);
```

## Props

### `<Link>` (Default Component)

| Prop        | Type                       | Default     | Description                 |
| ----------- | -------------------------- | ----------- | --------------------------- |
| `size`      | `"0" \| "1" \| "2" \| "3"` | `"2"`       | Size of link text + icon    |
| `color`     | `TextColor`                | `"blue"`    | Link color (same as `Text`) |
| `weight`    | `"regular" \| "medium"`    | `"regular"` | Link text weight            |
| `icon`      | `IconProps`                | `undefined` | Trailing icon props         |
| `textProps` | `LinkTextProps`            | `undefined` | Props passed to `Link.Text` |
| `as`        | `TgphElement`              | `"a"`       | Render polymorphically      |

`TextColor` supports all `@telegraph/typography` text colors: `default`, `gray`, `red`, `beige`, `blue`, `green`, `yellow`, `purple`, `accent`, `white`, `black`, and `disabled`.

## Composition

```tsx
import { Link } from "@telegraph/link";
import { ArrowUpRight } from "lucide-react";

export const ComposedLink = () => (
  <Link.Root href="/docs" color="accent" size="3">
    <Link.Text>Read more</Link.Text>
    <Link.Icon icon={ArrowUpRight} aria-hidden />
  </Link.Root>
);
```

## Interaction behavior

`Link` underlines on hover/focus states by default, rather than exposing an `underlined` prop.

## Using with Next.js

```tsx
import { Link } from "@telegraph/link";
import { ArrowUpRight } from "lucide-react";
import NextLink from "next/link";

export const NextExample = () => (
  <Link
    as={NextLink}
    href="/dashboard"
    icon={{ icon: ArrowUpRight, "aria-hidden": true }}
  >
    Dashboard
  </Link>
);
```
