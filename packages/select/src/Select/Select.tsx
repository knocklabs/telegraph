import { Combobox } from "@telegraph/combobox";
import { TgphComponentProps } from "@telegraph/helpers";

type Option = TgphComponentProps<typeof Combobox.Option>;

type RootProps = TgphComponentProps<typeof Combobox.Root> & {
  size?: TgphComponentProps<typeof Combobox.Trigger>["size"];
  triggerProps?: TgphComponentProps<typeof Combobox.Trigger>;
  contentProps?: TgphComponentProps<typeof Combobox.Content>;
  optionsProps?: TgphComponentProps<typeof Combobox.Options>;
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

type OptionProps = Omit<TgphComponentProps<typeof Combobox.Option>, "label">;

const Option = ({ value, children, ...props }: OptionProps) => {
  return <Combobox.Option value={value} label={children} {...props} />;
};

const Select = { Root, Option };
type SelectProps = RootProps;

export { Select };
export type { SelectProps, OptionProps, Option };
