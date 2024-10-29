import { Combobox } from "@telegraph/combobox";
import { TgphComponentProps } from "@telegraph/helpers";
import React from "react";

type Option = TgphComponentProps<typeof Combobox.Option>;

type RootProps = Omit<
  TgphComponentProps<typeof Combobox.Root>,
  "value" | "onValueChange" | "layout"
> & {
  value?: Option["value"];
  onValueChange?: (value: Option["value"]) => void;
  size?: TgphComponentProps<typeof Combobox.Trigger>["size"];
  triggerProps?: TgphComponentProps<typeof Combobox.Trigger>;
  contentProps?: TgphComponentProps<typeof Combobox.Content>;
  optionsProps?: TgphComponentProps<typeof Combobox.Options>;
};

const Root = ({
  size = "1",
  value,
  onValueChange,
  triggerProps,
  contentProps,
  optionsProps,
  children,
  ...props
}: RootProps) => {
  const [options, setOptions] = React.useState<Array<Option>>([]);

  // Get all of the options passed into Select so that we can display
  // the label of the selected option in the trigger.
  React.useEffect(() => {
    if (!children) return;
    const options = React.Children.toArray(children)
      // Filter down to the components that are Option components
      .filter((child) => {
        return React.isValidElement(child) && child.props.value;
      })
      // Map the Option components to an array of objects that have a value and label
      // so that we can display the label of the selected option in the trigger.
      .map((child) => {
        const childOption = child as React.ReactElement<OptionProps>;
        return {
          value: childOption.props.value,
          // If the Option component has a label, use it. Otherwise, use the value
          // so that we can display something.
          label: childOption.props?.children || childOption.props.value,
        };
      });

    setOptions(options);
  }, [children]);

  const label = options.find((option) => option.value === value)?.label;

  return (
    <Combobox.Root
      value={value ? { value, label } : undefined}
      onValueChange={(value) => onValueChange?.(value.value)}
      {...props}
    >
      <Combobox.Trigger size={size} {...triggerProps} />
      <Combobox.Content {...contentProps}>
        <Combobox.Options {...optionsProps}>{children}</Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

type OptionProps = TgphComponentProps<typeof Combobox.Option>;

const Option = ({ value, children, ...props }: OptionProps) => {
  return <Combobox.Option value={value} label={children} {...props} />;
};

const Select = { Root, Option };
type SelectProps = RootProps;

export { Select };
export type { SelectProps, OptionProps, Option };
