# 📝 TextArea

> Multi-line text input component with auto-resize, character counting, and form integration capabilities.

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
      onChange={(e) => setComment(e.target.value)}
      placeholder="Share your thoughts..."
      maxLength={500}
      showCharacterCount
      autoResize
    />
  );
};
```

## API Reference

### `<TextArea>`

The main textarea component with enhanced features for multi-line text input.

| Prop                 | Type                                             | Default      | Description                                      |
| -------------------- | ------------------------------------------------ | ------------ | ------------------------------------------------ |
| `size`               | `"0" \| "1" \| "2" \| "3" \| "4"`                | `"1"`        | Size of the textarea                             |
| `variant`            | `"ghost" \| "outline"`                           | `"outline"`  | Visual style variant                             |
| `autoResize`         | `boolean`                                        | `false`      | Automatically adjust height based on content     |
| `minRows`            | `number`                                         | `3`          | Minimum number of visible rows                   |
| `maxRows`            | `number`                                         | `undefined`  | Maximum number of visible rows (for auto-resize) |
| `showCharacterCount` | `boolean`                                        | `false`      | Display character count indicator                |
| `maxLength`          | `number`                                         | `undefined`  | Maximum allowed characters                       |
| `resize`             | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` | CSS resize behavior                              |
| `state`              | `"default" \| "error" \| "success"`              | `"default"`  | Validation state                                 |
| `errorMessage`       | `string`                                         | `undefined`  | Error message to display                         |
| `helperText`         | `string`                                         | `undefined`  | Helper text to display                           |

All standard HTML textarea attributes are also supported (value, onChange, placeholder, disabled, etc.).

## Usage Patterns

### Basic Textarea

```tsx
import { TextArea } from "@telegraph/textarea";

export const BasicExample = () => (
  <TextArea placeholder="Enter your message..." rows={4} />
);
```

### Different Sizes

```tsx
import { TextArea } from "@telegraph/textarea";

export const SizedTextAreas = () => (
  <div>
    <TextArea size="0" placeholder="Small textarea" />
    <TextArea size="1" placeholder="Medium textarea" />
    <TextArea size="2" placeholder="Large textarea" />
  </div>
);
```

### With Character Limit

```tsx
import { TextArea } from "@telegraph/textarea";
import { useState } from "react";

export const CharacterLimit = () => {
  const [value, setValue] = useState("");

  return (
    <TextArea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Write a tweet..."
      maxLength={280}
      showCharacterCount
    />
  );
};
```

### Auto-resize

```tsx
import { TextArea } from "@telegraph/textarea";

export const AutoResizeExample = () => (
  <TextArea
    autoResize
    minRows={2}
    maxRows={10}
    placeholder="This textarea will grow as you type..."
  />
);
```

### Validation States

```tsx
import { TextArea } from "@telegraph/textarea";

export const ValidationStates = () => (
  <div>
    <TextArea
      state="error"
      errorMessage="This field is required"
      placeholder="Error state"
    />

    <TextArea
      state="success"
      helperText="Looks good!"
      placeholder="Success state"
    />
  </div>
);
```

### Different Variants

```tsx
import { TextArea } from "@telegraph/textarea";

export const Variants = () => (
  <div>
    <TextArea variant="outline" placeholder="Outline variant" />
    <TextArea variant="ghost" placeholder="Ghost variant" />
  </div>
);
```

## Advanced Usage

### Form Integration

```tsx
import { TextArea } from "@telegraph/textarea";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  description: string;
  notes: string;
};

export const FormExample = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div>
        <label htmlFor="description">Description</label>
        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            minLength: { value: 10, message: "Minimum 10 characters" },
          }}
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              state={fieldState.error ? "error" : "default"}
              errorMessage={fieldState.error?.message}
              placeholder="Describe your project..."
              maxLength={1000}
              showCharacterCount
              autoResize
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="notes">Additional Notes</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              placeholder="Any additional notes (optional)"
              variant="ghost"
              maxLength={500}
              showCharacterCount
            />
          )}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support for text input and navigation
- ✅ **Screen Reader Support**: Proper labeling and error announcement
- ✅ **Focus Management**: Clear focus indicators and logical tab order
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Error Handling**: Clear error states and validation messages

### Keyboard Shortcuts

| Key            | Action                          |
| -------------- | ------------------------------- |
| `Tab`          | Move focus to/from the textarea |
| `Enter`        | Insert new line                 |
| `Ctrl/Cmd + A` | Select all text                 |
| `Ctrl/Cmd + Z` | Undo last action                |
| `Ctrl/Cmd + Y` | Redo last action                |

### ARIA Attributes

- `aria-label` or `aria-labelledby` - Associates labels with textarea
- `aria-describedby` - Links help text and error messages
- `aria-invalid` - Indicates validation state
- `role="textbox"` - Explicitly identifies as text input
- `aria-multiline="true"` - Indicates multi-line input

### Best Practices

1. **Provide Clear Labels**: Always include accessible labels for textareas
2. **Error Messaging**: Use clear, specific error messages
3. **Helper Text**: Provide helpful guidance about expected input
4. **Character Limits**: Clearly communicate length restrictions
5. **Auto-resize Limits**: Set reasonable min/max bounds for auto-resize

## Examples

### Basic Example

```tsx
import { TextArea } from "@telegraph/textarea";

export const FeedbackForm = () => (
  <div>
    <label htmlFor="feedback">Your Feedback</label>
    <TextArea
      id="feedback"
      placeholder="Tell us what you think..."
      rows={4}
      maxLength={1000}
      showCharacterCount
    />
  </div>
);
```

### Advanced Example

```tsx
import { TextArea } from "@telegraph/textarea";
import { useState } from "react";

export const BlogPostEditor = () => {
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(true);

  const handleSave = () => {
    // Save logic here
    console.log("Saving:", content);
  };

  const handlePublish = () => {
    setIsDraft(false);
    // Publish logic here
    console.log("Publishing:", content);
  };

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h2>Write your blog post</h2>
        <div className="status">Status: {isDraft ? "Draft" : "Published"}</div>
      </div>

      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your blog post..."
        autoResize
        minRows={10}
        maxRows={30}
        showCharacterCount
        helperText="Write in markdown format. Use **bold** and *italic* for formatting."
      />

      <div className="editor-actions">
        <button onClick={handleSave} disabled={!content}>
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          disabled={!content || content.length < 100}
          className="primary"
        >
          Publish Post
        </button>
      </div>
    </div>
  );
};
```

### Real-world Example

```tsx
import { TextArea } from "@telegraph/textarea";
import { useEffect, useState } from "react";

export const CustomerSupportTicket = () => {
  const [ticket, setTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit ticket logic
      await submitTicket({ ...ticket, attachments });
      alert("Ticket submitted successfully!");
    } catch (error) {
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="support-ticket">
      <h2>Submit a Support Ticket</h2>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          value={ticket.subject}
          onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={ticket.priority}
          onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <TextArea
          id="description"
          value={ticket.description}
          onChange={(e) =>
            setTicket({ ...ticket, description: e.target.value })
          }
          placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and screenshots if applicable."
          autoResize
          minRows={6}
          maxRows={15}
          maxLength={5000}
          showCharacterCount
          state={ticket.description.length < 50 ? "default" : "success"}
          helperText="Please provide at least 50 characters for a detailed description."
          required
        />
      </div>

      <div className="form-group">
        <label>Attachments</label>
        <FileUpload
          onFilesChange={setAttachments}
          maxFiles={5}
          acceptedTypes={[".png", ".jpg", ".pdf", ".txt"]}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={
            isSubmitting || !ticket.subject || ticket.description.length < 50
          }
          className="primary"
        >
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </div>
    </form>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/textarea)
- [Input Component](../input/README.md) - Related single-line input component
- [Typography Component](../typography/README.md) - For text styling

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
