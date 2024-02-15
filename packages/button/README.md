![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/button)

# @telegraph/button
> A button component

## Installation Instructions

```
npm install @telegraph/button
```

### Add stylesheet
```
@import "@telegraph/button"
OR
@import "@telegraph/button/scoped"
```

### Basic Usage
Shorthand button component that adheres to the telegraph design system

#### `<Button/>`

```
import { Button } from "@telegraph/button"

...

<Button>Button</Button>
```

##### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| variant | string | "solid" | "solid", "soft", "outline", "ghost" |
| size | string | "2" | "1", "2", "3" |
| color | string | "gray" | "accent", "gray", "red" |
| leadingIcon | IconProps | `{icon: undefined, alt: undefined}` | [See @telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) exported icons |
| trailingIcon | IconProps | `{icon: undefined, alt: undefined}` | [See @telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) exported icons |
| icon | IconProps | `{icon: undefined, alt: undefined}` | [See @telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) exported icons |


### Advanced Usage
Individual parts of the button component that can be composed in configurations different from the default telegraph design system styles. This can be used to create modifications to one-off button components without the need to modify the button exported from this package.

#### `<Button.Root/>`
Contains all the individual parts of the button component, relays props to children, and handles defining styles for the layout of the button.

```
import { Button } from "@telegraph/button"

...

<Button.Root></Button.Root>
```

##### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| variant | string | "solid" | "solid", "soft", "outline", "ghost" |
| size | string | "2" | "1", "2", "3" |
| color | string | "gray" | "accent", "gray", "red" |

#### `<Button.Text/>`
A component built on top of the Text component from [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) with translated props to adhere to the telegraph design system

```
import { Button } from "@telegraph/button"

...

<Button.Text>Text</Button.Text>
```

##### Props

> Note: `<Button.Root/>` handles setting the styles of the text component. These props can be overriden by passing the props available to [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) directly to `<Button.Text/>`, i.e. `<Button.Text size="9" weight="medium" color="beige" align="right">Text</Button.Text>`

#### `<Button.Icon/>`
A component built on top of the Icon component from [@telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) with translated props to adhere to the telegraph design system

```
import { Button } from "@telegraph/button"
import { checkmark } from "@telegraph/icon"

...

<Button.Icon icon={checkmark} alt="item is selected"/>
```

##### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| icon | string | `undefined` | See [@telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) exported icons |
| alt | string | `undefined` |  |
| color | string | "gray" | "accent", "gray", "red" |

> Note: `<Button.Root/>` handles setting the styles of the icon component. These props can be overriden by passing the props available to [@telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon) directly to `<Button.Icon/>`, i.e. `<Button.Icon size="4" variant="secondary" color="blue"/>`

#### An example of composing an advanced button

```
import { Button } from "@telegraph/button"
import { checkmark } from "@telegraph/icon"

<Button.Root color="accent" variant="soft">
    <Button.Icon icon={checkmark} alt="item is selected">
    <Button.Text>Text</Button.Text>
</Button.Root>
```
