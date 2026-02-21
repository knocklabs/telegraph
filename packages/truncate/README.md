# ✂️ Truncate

> Smart text truncation utilities with overflow detection, conditional tooltips, and responsive text handling for optimal user experience.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/truncate.svg)](https://www.npmjs.com/package/@telegraph/truncate)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/truncate)](https://bundlephobia.com/result?p=@telegraph/truncate)
[![license](https://img.shields.io/npm/l/@telegraph/truncate)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/truncate
```

> **Note**: This package has no stylesheets required.

## Quick Start

```tsx
import {
  TooltipIfTruncated,
  TruncatedText,
  useTruncate,
} from "@telegraph/truncate";

export const TruncateExamples = () => (
  <div>
    {/* Simple truncated text with tooltip */}
    <TruncatedText maxWidth="40">
      This text will be truncated if it exceeds the container width
    </TruncatedText>

    {/* Custom content with conditional tooltip */}
    <TooltipIfTruncated label="Full content shown in tooltip">
      <span style={{ maxWidth: "200px", overflow: "hidden" }}>
        This content might be truncated
      </span>
    </TooltipIfTruncated>

    {/* Using the hook for custom behavior */}
    <CustomTruncatedComponent />
  </div>
);

const CustomTruncatedComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { truncated } = useTruncate({ tgphRef: ref });

  return (
    <div ref={ref} style={{ maxWidth: "150px", overflow: "hidden" }}>
      Content status: {truncated ? "Truncated" : "Fits"}
    </div>
  );
};
```

## API Reference

### `<TruncatedText>`

A text component that automatically truncates content with an ellipsis and shows a tooltip when truncated.

| Prop           | Type                               | Default     | Description                                                     |
| -------------- | ---------------------------------- | ----------- | --------------------------------------------------------------- |
| `maxWidth`     | `string`                           | `undefined` | Maximum width of the text container                             |
| `tooltipProps` | `Partial<TooltipIfTruncatedProps>` | `{}`        | Props to pass to the underlying TooltipIfTruncated component    |
| `...TextProps` | `TgphComponentProps<typeof Text>`  | -           | All props from [@telegraph/typography](../typography/README.md) |

### `<TooltipIfTruncated>`

A component that conditionally shows a tooltip only when its content is truncated.

| Prop              | Type                                 | Default     | Description                                                                   |
| ----------------- | ------------------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `label`           | `string`                             | `undefined` | The text to show in the tooltip. If not provided, will use the content's text |
| `children`        | `ReactNode`                          | -           | **Required.** Content to monitor for truncation                               |
| `...TooltipProps` | `TgphComponentProps<typeof Tooltip>` | -           | All props from [@telegraph/tooltip](../tooltip/README.md)                     |

### `useTruncate`

A hook that detects whether an element's content is truncated.

#### Parameters

| Name     | Type                                        | Description                                                           |
| -------- | ------------------------------------------- | --------------------------------------------------------------------- |
| `params` | `{ tgphRef: React.RefObject<HTMLElement> }` | A ref to the element to check for truncation                          |
| `deps`   | `React.DependencyList`                      | Optional dependencies to re-run the truncation check when they change |

#### Returns

| Name        | Type      | Description                                |
| ----------- | --------- | ------------------------------------------ |
| `truncated` | `boolean` | Whether the element's content is truncated |

## Usage Patterns

### Basic Text Truncation

```tsx
import { TruncatedText } from "@telegraph/truncate";

export const UserName = ({ name }: { name: string }) => (
  <TruncatedText maxWidth="40">{name}</TruncatedText>
);
```

### Custom Container Width

```tsx
import { TruncatedText } from "@telegraph/truncate";

export const ResponsiveTruncation = () => (
  <div>
    <TruncatedText maxWidth="20">Short container</TruncatedText>
    <TruncatedText maxWidth="60">Longer container</TruncatedText>
    <TruncatedText maxWidth="100%">Full width container</TruncatedText>
  </div>
);
```

### Conditional Tooltip

```tsx
import { TooltipIfTruncated } from "@telegraph/truncate";

export const FileNameDisplay = ({ fileName }: { fileName: string }) => (
  <TooltipIfTruncated label={fileName}>
    <div
      className="file-name"
      style={{ maxWidth: "200px", overflow: "hidden" }}
    >
      {fileName}
    </div>
  </TooltipIfTruncated>
);
```

### Custom Truncation Detection

```tsx
import { useTruncate } from "@telegraph/truncate";
import { useRef, useState } from "react";

export const DynamicContent = ({ content }: { content: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { truncated } = useTruncate({ tgphRef: ref }, [content, expanded]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          maxWidth: "300px",
          overflow: "hidden",
          whiteSpace: expanded ? "normal" : "nowrap",
        }}
      >
        {content}
      </div>

      {truncated && !expanded && (
        <button onClick={() => setExpanded(true)}>Show more</button>
      )}

      {expanded && (
        <button onClick={() => setExpanded(false)}>Show less</button>
      )}
    </div>
  );
};
```

### Multi-line Truncation

```tsx
import { TooltipIfTruncated } from "@telegraph/truncate";

export const ArticlePreview = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="article-preview">
    <TooltipIfTruncated label={title}>
      <h3
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </h3>
    </TooltipIfTruncated>

    <TooltipIfTruncated label={description}>
      <p
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>
    </TooltipIfTruncated>
  </div>
);
```

## Advanced Usage

### Responsive Truncation

```tsx
import { TruncatedText } from "@telegraph/truncate";
import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export const ResponsiveTruncatedText = ({ children }: { children: string }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const maxWidth = isMobile ? "30" : isTablet ? "50" : "80";

  return <TruncatedText maxWidth={maxWidth}>{children}</TruncatedText>;
};
```

### Dynamic Content Monitoring

```tsx
import { useTruncate } from "@telegraph/truncate";
import { useEffect, useRef, useState } from "react";

export const DynamicTruncationMonitor = ({ items }: { items: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(items);
  const { truncated } = useTruncate({ tgphRef: ref }, [visibleItems]);

  useEffect(() => {
    if (truncated && visibleItems.length > 1) {
      // Remove items until content fits
      setVisibleItems((prev) => prev.slice(0, -1));
    }
  }, [truncated, visibleItems.length]);

  const hiddenCount = items.length - visibleItems.length;

  return (
    <div
      ref={ref}
      style={{
        maxWidth: "300px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {visibleItems.join(", ")}
      {hiddenCount > 0 && ` +${hiddenCount} more`}
    </div>
  );
};
```

### Table Cell Truncation

```tsx
import { TooltipIfTruncated } from "@telegraph/truncate";

export const DataTable = ({
  rows,
}: {
  rows: Array<{ id: string; name: string; email: string }>;
}) => (
  <table className="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <td style={{ maxWidth: "150px" }}>
            <TooltipIfTruncated label={row.name}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.name}
              </div>
            </TooltipIfTruncated>
          </td>
          <td style={{ maxWidth: "200px" }}>
            <TooltipIfTruncated label={row.email}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.email}
              </div>
            </TooltipIfTruncated>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

### Breadcrumb Truncation

```tsx
import { TooltipIfTruncated, useTruncate } from "@telegraph/truncate";
import { useRef, useState } from "react";

export const SmartBreadcrumbs = ({
  items,
}: {
  items: Array<{ label: string; href: string }>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const { truncated } = useTruncate({ tgphRef: ref }, [items, showAll]);

  const displayItems = showAll
    ? items
    : truncated && items.length > 3
      ? [items[0], { label: "...", href: "#" }, ...items.slice(-2)]
      : items;

  return (
    <nav className="breadcrumbs">
      <div
        ref={ref}
        style={{
          display: "flex",
          overflow: "hidden",
          maxWidth: "100%",
        }}
      >
        {displayItems.map((item, index) => (
          <span key={index} className="breadcrumb-item">
            {item.label === "..." ? (
              <button
                onClick={() => setShowAll(true)}
                className="breadcrumb-expand"
              >
                ...
              </button>
            ) : (
              <TooltipIfTruncated label={item.label}>
                <a
                  href={item.href}
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </a>
              </TooltipIfTruncated>
            )}
            {index < displayItems.length - 1 && (
              <span className="separator"> / </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
};
```

### Tag List with Overflow

```tsx
import { TooltipIfTruncated, useTruncate } from "@telegraph/truncate";
import { useRef, useState } from "react";

export const TagList = ({ tags }: { tags: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const { truncated } = useTruncate({ tgphRef: ref }, [tags, showAll]);

  const displayTags = showAll ? tags : tags.slice(0, 3);
  const hiddenCount = tags.length - displayTags.length;

  return (
    <div className="tag-list">
      <div
        ref={ref}
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: showAll ? "wrap" : "nowrap",
          overflow: "hidden",
        }}
      >
        {displayTags.map((tag, index) => (
          <TooltipIfTruncated key={index} label={tag}>
            <span
              className="tag"
              style={{
                maxWidth: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </span>
          </TooltipIfTruncated>
        ))}

        {!showAll && hiddenCount > 0 && (
          <button onClick={() => setShowAll(true)} className="tag-more">
            +{hiddenCount}
          </button>
        )}
      </div>
    </div>
  );
};
```

### Form Field Labels

```tsx
import { Input } from "@telegraph/input";
import { TruncatedText } from "@telegraph/truncate";

export const FormField = ({
  label,
  id,
  ...inputProps
}: {
  label: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="form-field">
    <label htmlFor={id}>
      <TruncatedText maxWidth="100%">{label}</TruncatedText>
    </label>
    <Input id={id} {...inputProps} />
  </div>
);
```

### Card Title Truncation

```tsx
import { TooltipIfTruncated, TruncatedText } from "@telegraph/truncate";

export const ProductCard = ({
  product,
}: {
  product: {
    name: string;
    description: string;
    price: string;
  };
}) => (
  <div className="product-card">
    <TruncatedText
      maxWidth="100%"
      size="3"
      weight="semibold"
      tooltipProps={{ side: "top" }}
    >
      {product.name}
    </TruncatedText>

    <TooltipIfTruncated label={product.description}>
      <p
        className="product-description"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: "1.4em",
          maxHeight: "2.8em",
        }}
      >
        {product.description}
      </p>
    </TooltipIfTruncated>

    <div className="product-price">{product.price}</div>
  </div>
);
```

## Accessibility

- ✅ **Screen Reader Support**: Full content available via tooltips when truncated
- ✅ **Keyboard Navigation**: Tooltips work with keyboard navigation
- ✅ **Focus Management**: Proper focus indicators for interactive elements
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Content Preservation**: No content is permanently hidden

### Best Practices

1. **Provide Full Content**: Always make complete content accessible via tooltips
2. **Logical Truncation**: Truncate at word boundaries when possible
3. **Clear Indicators**: Make it obvious when content is truncated
4. **Responsive Design**: Adjust truncation based on available space
5. **Keyboard Access**: Ensure truncated content is accessible via keyboard

### ARIA Considerations

- Tooltips include proper ARIA attributes when content is truncated
- Screen readers can access full content through tooltip mechanisms
- Focus management works correctly with truncated interactive elements

## Examples

### Basic Example

```tsx
import { TruncatedText } from "@telegraph/truncate";

export const UserProfile = ({
  user,
}: {
  user: { name: string; bio: string };
}) => (
  <div className="user-profile">
    <TruncatedText maxWidth="40" size="4" weight="semibold">
      {user.name}
    </TruncatedText>
    <TruncatedText maxWidth="60" color="gray">
      {user.bio}
    </TruncatedText>
  </div>
);
```

### Advanced Example

```tsx
import { TooltipIfTruncated, useTruncate } from "@telegraph/truncate";
import { useRef, useState } from "react";

export const SmartProductList = ({
  products,
}: {
  products: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
  }>;
}) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductListItem = ({ product }: { product: any }) => {
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { truncated } = useTruncate({ tgphRef: descriptionRef }, [expanded]);

  return (
    <div className="product-item">
      <TooltipIfTruncated label={product.name}>
        <h3
          className="product-name"
          style={{
            maxWidth: "250px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h3>
      </TooltipIfTruncated>

      <div className="product-description-container">
        <p
          ref={descriptionRef}
          className="product-description"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "none" : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.4em",
          }}
        >
          {product.description}
        </p>

        {truncated && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="expand-button"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className="product-tags">
        <SmartTagList tags={product.tags} maxVisible={3} />
      </div>
    </div>
  );
};

const SmartTagList = ({
  tags,
  maxVisible = 3,
}: {
  tags: string[];
  maxVisible?: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleTags = showAll ? tags : tags.slice(0, maxVisible);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <div className="tag-list">
      {visibleTags.map((tag, index) => (
        <TooltipIfTruncated key={index} label={tag}>
          <span
            className="tag"
            style={{
              maxWidth: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </span>
        </TooltipIfTruncated>
      ))}

      {!showAll && hiddenCount > 0 && (
        <button onClick={() => setShowAll(true)} className="show-more-tags">
          +{hiddenCount} more
        </button>
      )}
    </div>
  );
};
```

### Real-world Example

```tsx
import {
  TooltipIfTruncated,
  TruncatedText,
  useTruncate,
} from "@telegraph/truncate";
import { useRef, useState } from "react";

export const EmailInbox = ({
  emails,
}: {
  emails: Array<{
    id: string;
    from: string;
    subject: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
  }>;
}) => {
  return (
    <div className="email-inbox">
      {emails.map((email) => (
        <EmailRow key={email.id} email={email} />
      ))}
    </div>
  );
};

const EmailRow = ({ email }: { email: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { truncated } = useTruncate({ tgphRef: previewRef }, [isExpanded]);

  return (
    <div
      className={`email-row ${!email.isRead ? "unread" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="email-header">
        <div className="email-from">
          <TruncatedText
            maxWidth="30"
            weight={email.isRead ? "regular" : "semibold"}
          >
            {email.from}
          </TruncatedText>
        </div>

        <div className="email-subject">
          <TruncatedText
            maxWidth="50"
            weight={email.isRead ? "regular" : "medium"}
          >
            {email.subject}
          </TruncatedText>
        </div>

        <div className="email-timestamp">{email.timestamp}</div>
      </div>

      <div className="email-preview-container">
        <div
          ref={previewRef}
          className="email-preview"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "none" : 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: email.isRead ? "#666" : "#333",
          }}
        >
          {email.preview}
        </div>

        {truncated && !isExpanded && (
          <TooltipIfTruncated label={email.preview}>
            <button className="expand-preview">...</button>
          </TooltipIfTruncated>
        )}
      </div>
    </div>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/truncate)
- [Typography Component](../typography/README.md) - Used by TruncatedText
- [Tooltip Component](../tooltip/README.md) - Used for showing full content

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
