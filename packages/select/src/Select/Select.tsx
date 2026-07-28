import {
  Combobox,
  type ComboboxContentProps,
  type ComboboxOptionProps,
  type ComboboxOptionsProps,
  type ComboboxRootProps,
  type ComboboxTriggerProps,
} from "@telegraph/combobox";

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

const Root = <V extends SelectValue = string>({
  size = "1",
  value,
  onValueChange,
  defaultValue,
  triggerProps,
  contentProps,
  optionsProps,
  children,
  ...props
}: RootProps<V>) => {
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

type OptionProps = Omit<ComboboxOptionProps, "label">;

const Option = ({ value, children, ...props }: OptionProps) => {
  return <Combobox.Option value={value} label={children} {...props} />;
};

const Select = { Root, Option };
type SelectProps<V extends SelectValue = string> = RootProps<V>;

export { Select };
export type { SelectProps, SelectValue, OptionProps, Option };
