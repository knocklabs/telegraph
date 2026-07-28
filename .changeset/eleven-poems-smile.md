---
"@telegraph/select": patch
---

`Select.Root` is now generic over its value, so `onValueChange` reports the value type the caller selected over instead of the whole union `Combobox` accepts. Reading the props off `typeof Combobox.Root` instantiated Combobox's value parameter at its constraint, so a single-string select handed its consumer back `string | { value, label } | Array<...>` and every call site had to narrow the value it had just supplied.

The value type is inferred from `value`/`defaultValue` and defaults to `string`:

```tsx
const [value, setValue] = useState<string>("");
<Select.Root value={value} onValueChange={setValue} />; // (value: string) => void

const [values, setValues] = useState<Array<string>>([]);
<Select.Root value={values} onValueChange={setValues} />; // (value: Array<string>) => void
```

**Breaking in three ways.** `value` is now a string or an array of strings — matching `Select.Option`, whose `value` has always been a string — so passing `null`, an option object, or a non-string union is an error.

`legacyBehavior` is no longer accepted, and is now discarded rather than forwarded: it makes Combobox emit `{ value, label }` option objects, which `Select.Option` cannot produce and `onValueChange` no longer describes. Use `Combobox` directly for that.

`layout` now applies only to selects over an array of values. It was always declared as `never` for a single value (`layout` positions multiple selected tags); reading the props with the value parameter at its constraint is what previously made it look available on every Select.

Runtime behavior is otherwise unchanged.
