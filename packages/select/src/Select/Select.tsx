import {
  Combobox,
  type ComboboxContentProps,
  type ComboboxOptionProps,
  type ComboboxOptionsProps,
  type ComboboxRootProps,
  type ComboboxTriggerProps,
} from "@telegraph/combobox";
import type { TgphElement } from "@telegraph/helpers";

// `Select.Option` takes a string `value`, so a Select selects over a single
// string or an array of them.
type SelectValue = string | Array<string>;

type Option = ComboboxOptionProps;

// `legacyBehavior` is dropped: it makes Combobox emit `{ value, label }` option
// objects, which `Select.Option` cannot produce.
export type RootProps<V extends SelectValue = string> = Omit<
  ComboboxRootProps<V, false>,
  "legacyBehavior" | "onValueChange"
> & {
  // `NoInfer` so `V` comes from `value`/`defaultValue` alone: a `useState`
  // setter would otherwise contribute `SetStateAction<...>`, which fails the
  // constraint and collapses `V` back to it.
  onValueChange?: NoInfer<(value: V) => void>;
  size?: ComboboxTriggerProps<V>["size"];
  triggerProps?: ComboboxTriggerProps<V>;
  contentProps?: ComboboxContentProps;
  optionsProps?: ComboboxOptionsProps;
};

const Root = <V extends SelectValue = string>(rootProps: RootProps<V>) => {
  const {
    size = "1",
    value,
    onValueChange,
    defaultValue,
    triggerProps,
    contentProps,
    optionsProps,
    children,
    // Discarded, not just omitted from the props type: a JSX spread of a
    // non-literal skips excess-property checking, so `<Select.Root {...p} />`
    // could still land it on `Combobox.Root<V, false>` and make that `false`
    // a lie about the values `onValueChange` reports.
    legacyBehavior: _legacyBehavior,
    ...props
  } = rootProps as RootProps<V> & { legacyBehavior?: boolean };

  return (
    <Combobox.Root<V, false>
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      closeOnSelect={!Array.isArray(value) && !Array.isArray(defaultValue)}
      {...props}
    >
      <Combobox.Trigger<V> size={size} {...triggerProps} />
      <Combobox.Content {...contentProps}>
        <Combobox.Options {...optionsProps}>{children}</Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

// Generic, so `as={NextLink}` resolves. The bare form is
// `ComboboxOptionProps<"button">`, which pins `as` to `"button"`.
type OptionProps<T extends TgphElement = "button"> = ComboboxOptionProps<T>;

// `label` defaults to `children` but stays overridable, which is what Combobox
// already does at runtime: it renders `label || children` and searches on the
// same. Taking it explicitly rather than through the rest spread also stops an
// explicit `label={undefined}` erasing the fallback.
const Option = <T extends TgphElement = "button">(
  optionProps: OptionProps<T>,
) => {
  const { value, label, children, ...props } =
    optionProps as OptionProps<"button">;

  return <Combobox.Option value={value} label={label ?? children} {...props} />;
};

const Select = { Root, Option };
type SelectProps<V extends SelectValue = string> = RootProps<V>;

export { Select };
export type { SelectProps, SelectValue, OptionProps, Option };
