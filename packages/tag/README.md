![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tag.svg)](https://www.npmjs.com/package/@telegraph/tag)

# @telegraph/tag
> A tag component with optional interactive button


## Installation Instructions

```
npm install @telegraph/tag
```


### Add stylesheet
Pick one:

Via CSS (preferred):
```
@import "@telegraph/tag"
```

Via Javascript:
```
import "@telegraph/tag/default.css"
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Usage

### Basic Usage
Shorthand tag component that adheres to the telegraph design system

```
import { Tag } from "@telegraph/tag"

...

<Tag>Tag</Tag>
```

#### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| size | string | "1" | "1" "2" |
| color | string | "default" | "default", "gray", "red", "accent", "blue", "green", "yellow" |
| variant | string | "soft" | "soft", "solid"|
| icon | [Icon Props](https://github.com/knocklabs/telegraph/tree/main/packages/icon#props) | `undefined` | |
| onRemove | () => {} | `undefined` | |
| onCopy | () => {} | `undefined` | |


### Advanced Usage
Individual parts of the tag component that can be composed in configurations different from the default telegraph design system styles. This can be used to create modifications to one-off tag components without the need to modify the tag exported from this package.

#### `<Tag.Root/>`
Wraps the Tag children components and relays props to them.

```
import { Tag } from '@telegraph/tag'

...

<Tag.Root></Tag.Root>
```

#### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| size | string | "1" | "1" "2" |
| color | string | "default" | "default", "gray", "red", "accent", "blue", "green", "yellow" |
| variant | string | "soft" | "soft", "solid"|



#### `<Tag.Text/>`
A component built on top of the Text component from [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) with translated props to adhere to the telegraph design system

```
import { Tag } from '@telegraph/tag'

...

<Tag.Text>Text</Tag.Text>
```

##### Props

> See [text props](https://github.com/knocklabs/telegraph/tree/main/packages/typography)

#### `<Tag.Button/>`
A component build on top of the Button component from [@telegraph/button](https://github.com/knocklabs/telegraph/tree/main/packages/button)

```
import { Tag } from '@telegraph/tag'

...

<Tag.Button/>
```

#### Props

>  See [button props](https://github.com/knocklabs/telegraph/tree/main/packages/icon#props)


#### `<Tag.Text/>`
A component built on top of the Text component from [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) with translated props to adhere to the telegraph design system

```
import { Tag } from '@telegraph/tag'

...

<Tag.Text>Text</Tag.Text>
```

##### Props

> See [text props](https://github.com/knocklabs/telegraph/tree/main/packages/typography)

#### `<Tag.Icon/>`
A component build on top of the Icon component from [@telegraph/icon](https://github.com/knocklabs/telegraph/tree/main/packages/icon)

```
import { Tag } from '@telegraph/tag'

...

<Tag.Icon icon={addSharp} alt="create"/>
```

#### Props

>  See [icon props](https://github.com/knocklabs/telegraph/tree/main/packages/icon)

#### An example of composing an advanced Tag
```
import { Tag } from "@telegraph/tag"
import { addSharp, closeSharp } from '@telegraph/icon'

<Tag.Root color="blue" variant="solid" size="2">
    <Tag.Icon icon={addSharp} alt="Create"/>
    <Tag.Text>Text</Tag.Text>
    <Tag.Button icon={{ icon: removeSharp, alt: "remove"}} onClick={() => {}}/>
</Tag.Root>
```


