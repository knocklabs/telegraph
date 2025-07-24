# ✍️ Typography

> Comprehensive typography system providing semantic heading and text components with consistent sizing, spacing, and styling across Telegraph applications.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/typography)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/typography)](https://bundlephobia.com/result?p=@telegraph/typography)
[![license](https://img.shields.io/npm/l/@telegraph/typography)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/typography
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/typography";
```

Via Javascript:

```tsx
import "@telegraph/typography/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Code, Heading, Text } from "@telegraph/typography";

export const TypographyExample = () => (
  <div>
    {/* Semantic headings */}
    <Heading as="h1" size="6">
      Main Page Title
    </Heading>

    <Heading as="h2" size="4" color="gray">
      Section Heading
    </Heading>

    {/* Body text */}
    <Text size="2">This is the standard body text size for most content.</Text>

    <Text size="1" color="gray">
      This is smaller, secondary text for captions and metadata.
    </Text>

    {/* Code snippets */}
    <Code>const greeting = "Hello World";</Code>
  </div>
);
```

## API Reference

### `<Heading>`

Semantic heading component for page and section titles with proper hierarchy.

| Prop     | Type                                                          | Default      | Description          |
| -------- | ------------------------------------------------------------- | ------------ | -------------------- |
| `as`     | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"`                | `"h2"`       | HTML heading element |
| `size`   | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"` | `"4"`        | Visual size scale    |
| `color`  | `TypographyColor`                                             | `"default"`  | Text color           |
| `align`  | `"left" \| "center" \| "right"`                               | `"left"`     | Text alignment       |
| `weight` | `"regular" \| "medium" \| "semibold" \| "bold"`               | `"semibold"` | Font weight          |

### `<Text>`

Flexible text component for body content, labels, and inline text.

| Prop     | Type                                                                 | Default     | Description            |
| -------- | -------------------------------------------------------------------- | ----------- | ---------------------- |
| `as`     | `TextElement`                                                        | `"p"`       | HTML element to render |
| `size`   | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"` | `"2"`       | Visual size scale      |
| `color`  | `TypographyColor`                                                    | `"default"` | Text color             |
| `align`  | `"left" \| "center" \| "right"`                                      | `"left"`    | Text alignment         |
| `weight` | `"regular" \| "medium" \| "semibold" \| "bold"`                      | `"regular"` | Font weight            |

#### TextElement Type

```tsx
type TextElement =
  | "p"
  | "span"
  | "div"
  | "label"
  | "em"
  | "strong"
  | "b"
  | "i"
  | "pre"
  | "code";
```

### `<Code>`

Inline code component for displaying code snippets and technical content.

| Prop      | Type                                        | Default     | Description       |
| --------- | ------------------------------------------- | ----------- | ----------------- |
| `size`    | `"0" \| "1" \| "2" \| "3" \| "4"`           | `"1"`       | Visual size scale |
| `color`   | `TypographyColor`                           | `"default"` | Text color        |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"soft"`    | Visual style      |

#### TypographyColor Type

```tsx
type TypographyColor =
  | "default"
  | "gray"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "accent"
  | "disabled"
  | "white";
```

## Typography Scale

Telegraph uses a harmonious type scale with consistent line heights and spacing:

| Size | Font Size | Line Height | Usage                |
| ---- | --------- | ----------- | -------------------- |
| `0`  | `12px`    | `16px`      | Captions, fine print |
| `1`  | `14px`    | `20px`      | Labels, small text   |
| `2`  | `16px`    | `24px`      | Body text (default)  |
| `3`  | `18px`    | `26px`      | Emphasized body text |
| `4`  | `20px`    | `28px`      | Small headings       |
| `5`  | `24px`    | `32px`      | Section headings     |
| `6`  | `30px`    | `38px`      | Page headings        |
| `7`  | `36px`    | `44px`      | Large headings       |
| `8`  | `48px`    | `56px`      | Display text         |
| `9`  | `60px`    | `68px`      | Hero text            |

## Usage Patterns

### Semantic Headings

```tsx
import { Heading } from "@telegraph/typography";

export const DocumentStructure = () => (
  <article>
    <Heading as="h1" size="7">
      Article Title
    </Heading>

    <Heading as="h2" size="5">
      Main Section
    </Heading>

    <Heading as="h3" size="4">
      Subsection
    </Heading>

    <Heading as="h4" size="3">
      Minor Heading
    </Heading>
  </article>
);
```

### Body Text Variations

```tsx
import { Text } from "@telegraph/typography";

export const TextExamples = () => (
  <div>
    <Text size="3" weight="medium">
      Lead paragraph with emphasis
    </Text>

    <Text size="2">Standard body text for most content</Text>

    <Text size="1" color="gray">
      Secondary information and captions
    </Text>

    <Text size="0" color="gray">
      Fine print and metadata
    </Text>
  </div>
);
```

### Different Colors

```tsx
import { Text } from "@telegraph/typography";

export const ColoredText = () => (
  <div>
    <Text color="default">Default text color</Text>
    <Text color="gray">Muted gray text</Text>
    <Text color="red">Error or danger text</Text>
    <Text color="green">Success text</Text>
    <Text color="blue">Link or primary text</Text>
    <Text color="accent">Accent color text</Text>
  </div>
);
```

### Code Snippets

```tsx
import { Code, Text } from "@telegraph/typography";

export const CodeExamples = () => (
  <div>
    <Text>
      Use the <Code>useState</Code> hook for local component state.
    </Text>

    <Text>
      Install with{" "}
      <Code variant="outline">npm install @telegraph/typography</Code>
    </Text>

    <Code size="2" variant="solid">
      const message = "Hello World";
    </Code>
  </div>
);
```

### Text Alignment

```tsx
import { Heading, Text } from "@telegraph/typography";

export const AlignmentExamples = () => (
  <div>
    <Heading align="left">Left Aligned Heading</Heading>
    <Heading align="center">Centered Heading</Heading>
    <Heading align="right">Right Aligned Heading</Heading>

    <Text align="center">Centered paragraph text</Text>
  </div>
);
```

## Advanced Usage

### Responsive Typography

```tsx
import { useMediaQuery } from "@telegraph/helpers";
import { Heading, Text } from "@telegraph/typography";

export const ResponsiveTypography = ({ title, content }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <Heading as="h1" size={isMobile ? "5" : "7"}>
        {title}
      </Heading>

      <Text size={isMobile ? "1" : "2"}>{content}</Text>
    </div>
  );
};
```

### Custom Typography Components

```tsx
import { Heading, Text } from "@telegraph/typography";

export const BlogPost = ({ post }) => (
  <article className="blog-post">
    <header>
      <Heading as="h1" size="7" align="center">
        {post.title}
      </Heading>

      <Text size="1" color="gray" align="center">
        By {post.author} • {post.date}
      </Text>
    </header>

    <div className="content">
      <Text size="3" weight="medium" color="gray">
        {post.excerpt}
      </Text>

      {post.content.map((paragraph, index) => (
        <Text key={index} size="2">
          {paragraph}
        </Text>
      ))}
    </div>
  </article>
);
```

### Form Typography

```tsx
import { Input } from "@telegraph/input";
import { Heading, Text } from "@telegraph/typography";

export const FormWithTypography = () => (
  <form>
    <Heading as="h2" size="5">
      Contact Information
    </Heading>

    <div className="form-field">
      <Text as="label" htmlFor="name" weight="medium">
        Full Name
      </Text>
      <Input id="name" />
      <Text size="0" color="gray">
        Enter your first and last name
      </Text>
    </div>

    <div className="form-field">
      <Text as="label" htmlFor="email" weight="medium">
        Email Address
      </Text>
      <Input id="email" type="email" />
      <Text size="0" color="red">
        Please enter a valid email address
      </Text>
    </div>
  </form>
);
```

### Documentation Typography

```tsx
import { Code, Heading, Text } from "@telegraph/typography";

export const APIDocumentation = ({ method }) => (
  <section className="api-method">
    <Heading as="h3" size="4">
      {method.name}
    </Heading>

    <Text size="2">{method.description}</Text>

    <Heading as="h4" size="3">
      Parameters
    </Heading>

    {method.parameters.map((param) => (
      <div key={param.name} className="parameter">
        <Text weight="medium">
          <Code>{param.name}</Code>
          <Text as="span" size="1" color="gray">
            ({param.type})
          </Text>
        </Text>
        <Text size="1" color="gray">
          {param.description}
        </Text>
      </div>
    ))}

    <Heading as="h4" size="3">
      Example
    </Heading>

    <Code size="2" variant="outline">
      {method.example}
    </Code>
  </section>
);
```

### Card Content Typography

```tsx
import { Heading, Text } from "@telegraph/typography";

export const ProductCard = ({ product }) => (
  <div className="product-card">
    <Heading as="h3" size="3" weight="semibold">
      {product.name}
    </Heading>

    <Text size="1" color="gray">
      {product.category}
    </Text>

    <Text size="2">{product.description}</Text>

    <div className="price-container">
      <Text size="4" weight="bold" color="accent">
        ${product.price}
      </Text>

      {product.originalPrice && (
        <Text
          as="span"
          size="2"
          color="gray"
          style={{ textDecoration: "line-through" }}
        >
          ${product.originalPrice}
        </Text>
      )}
    </div>
  </div>
);
```

### Data Display Typography

```tsx
import { Heading, Text } from "@telegraph/typography";

export const StatsCard = ({ title, value, change, period }) => (
  <div className="stats-card">
    <Text size="1" color="gray" weight="medium">
      {title.toUpperCase()}
    </Text>

    <Heading as="div" size="6" weight="bold">
      {value}
    </Heading>

    <div className="change-indicator">
      <Text size="1" color={change >= 0 ? "green" : "red"} weight="medium">
        {change >= 0 ? "+" : ""}
        {change}%
      </Text>

      <Text size="1" color="gray">
        {period}
      </Text>
    </div>
  </div>
);
```

### Navigation Typography

```tsx
import { Text } from "@telegraph/typography";
import { Link } from "next/link";

export const Navigation = ({ items }) => (
  <nav className="main-navigation">
    {items.map((item) => (
      <Text
        key={item.href}
        as={Link}
        href={item.href}
        size="2"
        weight="medium"
        color={item.active ? "accent" : "default"}
      >
        {item.label}
      </Text>
    ))}
  </nav>
);
```

### Error and Success Messages

```tsx
import { Text } from "@telegraph/typography";
import { AlertCircle, CheckCircle } from "lucide-react";

export const StatusMessage = ({ type, message }) => (
  <div className={`status-message status-${type}`}>
    {type === "success" && <CheckCircle size={16} />}
    {type === "error" && <AlertCircle size={16} />}

    <Text size="1" color={type === "success" ? "green" : "red"} weight="medium">
      {message}
    </Text>
  </div>
);
```

## Accessibility

- ✅ **Semantic HTML**: Proper heading hierarchy and semantic elements
- ✅ **Screen Reader Support**: Clear content structure and meaning
- ✅ **Color Contrast**: All color combinations meet WCAG AA standards
- ✅ **Scalable Text**: Respects user font size preferences
- ✅ **Focus Management**: Proper focus indicators where applicable

### Best Practices

1. **Maintain Hierarchy**: Use heading levels in logical order (h1 → h2 → h3)
2. **Semantic Elements**: Choose appropriate HTML elements for content meaning
3. **Color Contrast**: Ensure sufficient contrast for all text colors
4. **Responsive Sizing**: Adjust text sizes appropriately for different screens
5. **Content Structure**: Use typography to create clear content hierarchy

### ARIA Considerations

- Headings provide document structure for screen readers
- Proper semantic elements reduce need for additional ARIA labels
- Color is never the only indicator of meaning or state

## Examples

### Basic Example

```tsx
import { Heading, Text } from "@telegraph/typography";

export const SimplePage = () => (
  <div>
    <Heading as="h1" size="6">
      Welcome to Our Platform
    </Heading>

    <Text size="2">
      Get started by exploring our features and building amazing experiences.
    </Text>
  </div>
);
```

### Advanced Example

```tsx
import { Code, Heading, Text } from "@telegraph/typography";

export const FeatureShowcase = ({ features }) => (
  <section className="feature-showcase">
    <header>
      <Heading as="h2" size="6" align="center">
        Powerful Features
      </Heading>

      <Text size="3" color="gray" align="center">
        Everything you need to build modern applications
      </Text>
    </header>

    <div className="features-grid">
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <Heading as="h3" size="4" weight="semibold">
            {feature.title}
          </Heading>

          <Text size="2" color="gray">
            {feature.description}
          </Text>

          {feature.codeExample && (
            <div className="code-example">
              <Text size="1" weight="medium" color="accent">
                Example:
              </Text>
              <Code size="1" variant="outline">
                {feature.codeExample}
              </Code>
            </div>
          )}

          <div className="feature-benefits">
            {feature.benefits.map((benefit, idx) => (
              <Text key={idx} size="1" color="green">
                ✓ {benefit}
              </Text>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
```

### Real-world Example

```tsx
import { Code, Heading, Text } from "@telegraph/typography";
import { useState } from "react";

export const DocumentationPage = ({ doc }) => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="documentation-layout">
      <aside className="table-of-contents">
        <Heading as="h3" size="3" weight="semibold">
          Table of Contents
        </Heading>

        {doc.sections.map((section) => (
          <Text
            key={section.id}
            as="button"
            size="1"
            color={activeSection === section.id ? "accent" : "default"}
            weight={activeSection === section.id ? "medium" : "regular"}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </Text>
        ))}
      </aside>

      <main className="documentation-content">
        <header className="doc-header">
          <Heading as="h1" size="7">
            {doc.title}
          </Heading>

          <div className="doc-meta">
            <Text size="1" color="gray">
              Last updated: {doc.lastUpdated}
            </Text>
            <Text size="1" color="gray">
              Version: <Code size="0">{doc.version}</Code>
            </Text>
          </div>

          <Text size="3" weight="medium" color="gray">
            {doc.description}
          </Text>
        </header>

        {doc.sections.map((section) => (
          <section key={section.id} className="doc-section">
            <Heading as="h2" size="5" id={section.id}>
              {section.title}
            </Heading>

            {section.content.map((block, index) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <Text key={index} size="2">
                      {block.content}
                    </Text>
                  );

                case "code":
                  return (
                    <Code key={index} size="2" variant="outline">
                      {block.content}
                    </Code>
                  );

                case "heading":
                  return (
                    <Heading key={index} as="h3" size="4" weight="semibold">
                      {block.content}
                    </Heading>
                  );

                case "list":
                  return (
                    <ul key={index}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Text size="2">{item}</Text>
                        </li>
                      ))}
                    </ul>
                  );

                case "note":
                  return (
                    <div key={index} className="doc-note">
                      <Text size="1" color="blue" weight="medium">
                        💡 Note: {block.content}
                      </Text>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </section>
        ))}

        <footer className="doc-footer">
          <Text size="1" color="gray" align="center">
            Have questions? Check our{" "}
            <Text as="a" href="/faq" color="accent">
              FAQ
            </Text>{" "}
            or
            <Text as="a" href="/support" color="accent">
              {" "}
              contact support
            </Text>.
          </Text>
        </footer>
      </main>
    </div>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/typography)
- [Design Tokens](../tokens/README.md) - Typography token system
- [Truncate Component](../truncate/README.md) - Text overflow handling

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
