![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/11a9e54e-2388-4c5d-9769-16099c5de9dc)

[![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/typography)

# @telegraph/typography
> Heading & Text components that powers typography in telegraph


### Installation Instructions

```
npm install @telegraph/typography
```


#### Add stylesheet
Pick one:

Via CSS (preferred):
```
@import "@telegraph/typography"
```

Via Javascript:
```
import "@telegraph/typography/style.css"
```

#### Usage

##### <Heading/>
```
import { Heading } from "@telegraph/typography"

...

<Heading>Heading</Heading>
```

###### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| as | string | null | "h1" "h2" "h3" "h4" "h5" "h6" |
| size | string | "2" | "1" "2" "3" "4" "5" "6" "7" "8" "9" |
| color | string | "black" | "black" "gray" "red" "beige" "blue" "green" "yellow" "accent" |
| align | string | null | "left" "right" "center" |

##### <Text/>
```
import { Text } from "@telegraph/typography"

...

<Text>Text</Text>
```

###### Props

| Name | Type | Default | Options |
| ---- | -----| ------- | ------- |
| as | string | null | "p" "span" "div" "label" "em" "strong" "b" "i" "pre" "code"
| size | string | "2" | "1" "2" "3" "4" "5" "6" "7" "8" "9" |
| color | string | "black" | "black" "gray" "red" "beige" "blue" "green" "yellow" "accent" |
| align | string | null | "left" "right" "center" |
| weight | string | regular | "regular" "medium" |
