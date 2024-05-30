![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/icon.svg)](https://www.npmjs.com/package/@telegraph/icon)

# @telegraph/icon

> Beautiful icons from the telegraph design system

## Installation Instructions

```
npm install @telegraph/icon
```

### Add stylesheet

```
@import "@telegraph/icon"
```

### Usage

#### `<Icon/>`

```
import { Icon, Lucide } from "@telegraph/icon"

...

<Icon icon={Lucide.Bell} alt="notifications"/>
```

##### Props

| Name    | Type   | Default     | Options                                                                                     |
| ------- | ------ | ----------- | ------------------------------------------------------------------------------------------- |
| icon    | ReactComponent | `undefined` | See package exports                                                                         |
| alt     | string | `undefined` |                                                                                             |
| size    | string | "2"         | "1" "2" "3" "4" "5" "6" "7" "8" "9"                                                         |
| color   | string | "default"   | "default" "gray" "red" "beige" "blue" "green" "yellow" "purple" "accent" "disabled" "white" |
| variant | string | "primary"   | "primary" "secondary"                                                                       |
