import {
  Combobox,
  type ComboboxContentProps,
  type ComboboxOptionProps,
  type ComboboxOptionsProps,
  type ComboboxRootProps,
  type ComboboxTriggerProps,
} from "@telegraph/combobox";
import type { RemappedOmit, TgphElement } from "@telegraph/helpers";

// `Select.Option` takes a string `value`, so a Select selects over a single
// string or an array of them.
type SelectValue = string | Array<string>;

type Option = ComboboxOptionProps;

type SelectOnValueChange<V extends SelectValue> = NonNullable<
  ComboboxRootProps<V>["onValueChange"]
>;

export type RootProps<V extends SelectValue = string> = RemappedOmit<
  ComboboxRootProps<V>,
  "onValueChange"
> & {
  // `NoInfer` so `V` comes from `value`/`defaultValue` alone: a `useState`
  // setter would otherwise contribute `SetStateAction<...>`, which fails the
  // constraint and collapses `V` back to it.
  onValueChange?: NoInfer<SelectOnValueChange<V>>;
  size?: ComboboxTriggerProps<V>["size"];
  triggerProps?: ComboboxTriggerProps<V>;
  contentProps?: ComboboxContentProps;
  optionsProps?: ComboboxOptionsProps;
};

const Root = <V extends SelectValue = string>(rootProps: RootProps<V>) => {
  const {
    size = "1",
    triggerProps,
    contentProps,
    optionsProps,
    children,
    ...comboboxRootProps
  } = rootProps;
  const { value, defaultValue } = rootProps;

  return (
    <Combobox.Root<V>
      closeOnSelect={!Array.isArray(value) && !Array.isArray(defaultValue)}
      {...comboboxRootProps}
    >
      <Combobox.Trigger<V> size={size} {...triggerProps} />
      <Combobox.Content {...contentProps}>
        <Combobox.Options {...optionsProps}>{children}</Combobox.Options>
        {/* Typing filters the options in place; without a message a
            non-matching query would leave an empty popup. */}
        <Combobox.Empty />
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
