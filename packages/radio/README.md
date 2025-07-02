![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/radioCards.svg)](https://www.npmjs.com/package/@telegraph/radio)

# @telegraph/radio

> RadioCards component

## Installation Instructions

```
npm install @telegraph/radio
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```
@import "@telegraph/radio"
```

Via Javascript:

```
import "@telegraph/radio/default.css"
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Usage

### Basic Usage

Radio cards component that adheres to the telegraph design system

```jsx
import { RadioCard } from "@telegraph/radio"

...

<RadioCards
    value={value}
    onValueChange={(value) => setValue(value)}
    options={[
        { icon: { icon: Plus, alt: "Add"}, title: "Option", description: "Add option", value: "add" },
        ...
    ]}
/>
```

#### Props

| Name          | Type                                                                    | Default     | Options |
| ------------- | ----------------------------------------------------------------------- | ----------- | ------- |
| value         | string                                                                  | `undefined` |         |
| onValueChange | ((value: string) => void)                                               | `undefined` |         |
| options       | Array<{ icon: Icon, title: string, description: string, value: string}> |             |         |

### Advanced Usage

Individual parts of the radio cards component that can be composed in configurations different from the default telegraph design system styles. This can be used to create modifications to one-off radio components without the need to modify the radio exported from this package.

```jsx
import { RadioCards } from "@telegraph/radio";

<RadioCards.Root {...props}>
  {options.map((option) => (
    <RadioCards.Item value={option.value}>
      <Stack direction="column" align="flex-start" p="3">
        {option.icon && (
          <Box mb="2">
            <RadioCards.ItemIcon {...option.icon} />
          </Box>
        )}
        <Stack direction="column" align="flex-start">
          {option.title && (
            <RadioCards.ItemTitle>{option.title}</RadioCards.ItemTitle>
          )}
          {option.description && (
            <RadioCards.ItemDescription>
              {option.description}
            </RadioCards.ItemDescription>
          )}
        </Stack>
      </Stack>
    </RadioCards.Item>
  ))}
</RadioCards.Root>;
```
