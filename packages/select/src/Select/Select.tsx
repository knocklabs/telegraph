import {
  Combobox,
  type ComboboxContentProps,
  type ComboboxOptionProps,
  type ComboboxOptionsProps,
  type ComboboxTriggerProps,
} from "@telegraph/combobox";
import { TgphComponentProps } from "@telegraph/helpers";

// The exported props types rather than `TgphComponentProps<typeof
// Combobox.X>`: extracting props from a generic component instantiates its
// parameter at the constraint, which erases the element passthrough. Select
// renders each part as its default element, so each props type's own default
// is enough. `Combobox.Trigger`'s `V` has no default — it types the value
// handed to a render-prop child — so it is pinned to the same union Select
// accepts, matching how `<Combobox.Trigger />` instantiates below.
// `Combobox.Root` is not element-polymorphic, so it is read as-is.
type SelectTriggerProps = ComboboxTriggerProps<string | Array<string>>;

type Option = ComboboxOptionProps;

type RootProps = TgphComponentProps<typeof Combobox.Root> & {
  size?: SelectTriggerProps["size"];
  triggerProps?: SelectTriggerProps;
  contentProps?: ComboboxContentProps;
  optionsProps?: ComboboxOptionsProps;
};
const Root = ({
  size = "1",
  value,
  onValueChange,
  defaultValue,
  triggerProps,
  contentProps,
  optionsProps,
  children,
  ...props
}: RootProps) => {
  return (
    <Combobox.Root
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      closeOnSelect={!Array.isArray(value) && !Array.isArray(defaultValue)}
      {...props}
    >
      <Combobox.Trigger size={size} {...triggerProps} />
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
type SelectProps = RootProps;

export { Select };
export type { SelectProps, OptionProps, Option };
