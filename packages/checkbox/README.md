# ☑️ Checkbox

> A checkbox with indeterminate and group support for the Telegraph design system.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/checkbox.svg)](https://www.npmjs.com/package/@telegraph/checkbox)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/checkbox)](https://bundlephobia.com/result?p=@telegraph/checkbox)
[![license](https://img.shields.io/npm/l/@telegraph/checkbox)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/checkbox
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/checkbox";
```

Via Javascript:

```tsx
import "@telegraph/checkbox/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Checkbox } from "@telegraph/checkbox";

export const Example = () => (
  <Checkbox.Default label="Cancel this run" defaultValue={false} />
);
```

## A note on `value`

Three similarly-named props do different jobs. Worth reading once before you
use the group:

| Prop                  | Type       | What it is                                             |
| --------------------- | ---------- | ------------------------------------------------------ |
| `Checkbox.value`      | `boolean`  | Whether this checkbox is ticked                        |
| `Checkbox.formValue`  | `string`   | The string submitted with the form. Defaults to `"on"` |
| `CheckboxGroup.value` | `string[]` | Which checkboxes in the group are ticked               |

Telegraph's convention is that `value` is whatever a control holds — a boolean
for one checkbox, a list for a group. That's why the string a form submits is
called `formValue` here rather than `value`, matching `Toggle` instead of raw
HTML.

Inside a `CheckboxGroup`, a checkbox is tracked by its `formValue`, falling
back to its `name`. So in the common case you only set `name`:

```tsx
<CheckboxGroup value={["email"]}>
  <Checkbox.Default name="email" label="Email" />
</CheckboxGroup>
```

Inside a group, the group owns the selection: a checkbox's own `value` or
`defaultValue` is ignored. Put the initial selection on the group instead.
Passing one anyway logs a warning in development.

Set both when several checkboxes should submit under one field name:

```tsx
<Checkbox.Default name="channels" formValue="email" label="Email" />
<Checkbox.Default name="channels" formValue="sms" label="SMS" />
```

## API Reference

### `<Checkbox.Default>` (Default Component)

The simple API for common use cases: renders the control and an associated
label.

| Prop            | Type                    | Default  | Description                                                  |
| --------------- | ----------------------- | -------- | ------------------------------------------------------------ |
| `label`         | `ReactNode`             | —        | Visible label, associated via `htmlFor`                      |
| `size`          | `"1" \| "2"`            | `"2"`    | Control size                                                 |
| `color`         | `CheckboxColor`         | `"blue"` | Color when checked                                           |
| `value`         | `boolean`               | —        | Controlled checked state                                     |
| `defaultValue`  | `boolean`               | `false`  | Initial checked state when uncontrolled                      |
| `onValueChange` | `(value, eventDetails)` | —        | Fired when the checkbox is ticked or unticked                |
| `indeterminate` | `boolean`               | `false`  | Renders the mixed state                                      |
| `parent`        | `boolean`               | `false`  | Marks this as the group's select-all                         |
| `disabled`      | `boolean`               | `false`  | Disables interaction                                         |
| `readOnly`      | `boolean`               | `false`  | Prevents changes but stays focusable                         |
| `required`      | `boolean`               | `false`  | Must be ticked before the form submits                       |
| `name`          | `string`                | —        | Form field name, and the group key when `formValue` is unset |
| `formValue`     | `string`                | `"on"`   | The string submitted with the form                           |
| `labelProps`    | `CheckboxLabelProps`    | —        | Forwarded to `Checkbox.Label`                                |
| `controlProps`  | `CheckboxControlProps`  | —        | Forwarded to `Checkbox.Control`                              |

`color` accepts `default`, `accent`, `blue`, `gray`, `green`, `purple`, `red`,
and `yellow` — the same set as `@telegraph/button`, so a checked checkbox
matches a solid button of the same color.

### Composable parts

```tsx
<Checkbox.Root value={checked} onValueChange={setChecked} name="run_1">
  <Checkbox.Control />
  <Checkbox.Label>Cancel this run</Checkbox.Label>
</Checkbox.Root>
```

- **`<Checkbox.Root>`** — holds state and layout, and provides context. Takes
  every prop in the table above except `label`, `labelProps` and `controlProps`.
  Also accepts `Stack` layout props and `as` / `tgphRef`.
- **`<Checkbox.Control>`** — the box and its indicator.
- **`<Checkbox.Label>`** — the label, associated with the control automatically.

Use `aria-label` on `Root` when there is no visible label. Without either one,
the control falls back to a wrapping `<label>` or a `Field.Label`, so those
compositions name it correctly too.

### `<CheckboxGroup>`

| Prop            | Type                    | Default    | Description                                   |
| --------------- | ----------------------- | ---------- | --------------------------------------------- |
| `value`         | `string[]`              | —          | Controlled selection                          |
| `defaultValue`  | `string[]`              | —          | Initial selection when uncontrolled           |
| `onValueChange` | `(value, eventDetails)` | —          | Fired when any checkbox in the group changes  |
| `allValues`     | `string[]`              | —          | Every key in the group. Required for `parent` |
| `size`          | `"1" \| "2"`            | —          | Applied to children that don't set their own  |
| `color`         | `CheckboxColor`         | —          | Applied to children that don't set their own  |
| `disabled`      | `boolean`               | `false`    | Disables every child                          |
| `direction`     | `"row" \| "column"`     | `"column"` | Layout direction                              |
| `gap`           | Telegraph spacing token | `"2"`      | Space between checkboxes                      |

It renders a `Stack`, so the usual layout props apply.

A group's `disabled` wins over a child's. `<Checkbox.Default disabled={false}>`
inside a disabled group stays disabled — that is Base UI's rule, and `size` and
`color` are the ones a child can override.

### Event details

Both `onValueChange` callbacks take a second argument carrying the event behind
the change. Use it to reach the native event — `shiftKey` for range selection,
for example — or to reject the change outright.

Base UI types `event` as the base DOM `Event`, so narrow before reading
modifier keys. Toggling with the space key goes through a synthesized click, so
both paths arrive as a `PointerEvent`.

```tsx
<CheckboxGroup
  value={selected}
  onValueChange={(next, eventDetails) => {
    const { event } = eventDetails;
    if (event instanceof MouseEvent && event.shiftKey) {
      setSelected(extendRange(selected, next));
      return;
    }
    setSelected(next);
  }}
>
```

Call `eventDetails.cancel()` to leave the checkbox as it was. This works on a
standalone checkbox and on the group callback. It does not work on a child of a
group that sets `allValues`, because Base UI commits the group selection before
the child callback runs. Cancel on the group there instead.

### Select-all

Mark one checkbox `parent` and give the group `allValues`. Its checked and
indeterminate state is then derived — don't pass it a `value`.

```tsx
const runs = ["run-1", "run-2", "run-3"];
const [selected, setSelected] = useState<string[]>([]);

<CheckboxGroup value={selected} onValueChange={setSelected} allValues={runs}>
  <Checkbox.Default parent label="Select all" />
  {runs.map((run) => (
    <Checkbox.Default key={run} name={run} label={run} />
  ))}
</CheckboxGroup>;
```

Two behaviors worth knowing:

- **Disabled children are respected.** Select-all won't tick a disabled
  unchecked child, and won't untick a disabled checked one.
- **A partial selection is restored on the third click.** From a hand-picked
  subset, clicking the parent cycles all → none → back to that subset. From a
  fully-on or fully-off group it's a plain toggle.

A `parent` checkbox is excluded from form submission.

#### Disabled children and `allValues`

The parent reads as checked only when the selection covers all of `allValues`.
That comparison doesn't know about disabled children, so a child that can never
be selected pins the parent at indeterminate — select-all ticks everything it
can, and the parent still shows a dash.

If some rows are permanently unselectable, leave them out of `allValues`:

```tsx
const selectable = runs.filter(isCancelable).map((run) => run.id);

<CheckboxGroup
  value={selected}
  onValueChange={setSelected}
  allValues={selectable}
>
  <Checkbox.Default parent label="Select all" />
  {runs.map((run) => (
    <Checkbox.Default
      key={run.id}
      name={run.id}
      label={run.name}
      disabled={!isCancelable(run)}
    />
  ))}
</CheckboxGroup>;
```

The children still render; they're just not counted when deciding whether
"all" is selected. Keep a child in `allValues` when its disabled state is
temporary and it should still block the parent from reading as complete.

### Known limitation

`id` never lands on the element you probably expect. Base UI puts it on the
hidden input, not on the styled element that carries `role="checkbox"`, so
`getElementById` returns an `aria-hidden` input rather than the control.

In any group that sets `allValues` — with or without a `parent` checkbox —
Base UI ignores the `id` you passed and derives its own from the group's id
plus the checkbox's key
([mui/base-ui#2691](https://github.com/mui/base-ui/issues/2691)).

`Checkbox.Label` handles both cases for you: it reads back whatever id Base UI
settled on, and it re-reads it whenever that id changes, so clicking label text
keeps toggling the checkbox. If you write your own label, associate it the same
way rather than assuming the `id` you passed was honored.
