import { Combobox } from "@telegraph/combobox";
import { TgphComponentProps } from "@telegraph/helpers";
import React from "react";

type Option = TgphComponentProps<typeof Combobox.Option>;

type SingleValue = string;
type MultipleValue = Array<string>;

type RootProps = Omit<
  TgphComponentProps<typeof Combobox.Root>,
  "value" | "onValueChange" | "layout"
> & {
  size?: TgphComponentProps<typeof Combobox.Trigger>["size"];
  triggerProps?: TgphComponentProps<typeof Combobox.Trigger>;
  contentProps?: TgphComponentProps<typeof Combobox.Content>;
  optionsProps?: TgphComponentProps<typeof Combobox.Options>;
  multiple?: boolean;
} & (
    | {
        multiple?: true;
        value?: MultipleValue;
        onValueChange?: (value: MultipleValue) => void;
        layout?: TgphComponentProps<typeof Combobox.Root>["layout"];
      }
    | {
        multiple?: false | undefined;
        value?: SingleValue;
        onValueChange?: (value: SingleValue) => void;
        layout?: never;
      }
  );

const Root = ({
  size = "1",
  multiple = false,
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

  const derivedValue = React.useMemo(() => {
    if (multiple && value && Array.isArray(value)) {
      return value.map((v) => ({
        value: v,
        label: options.find((o) => o.value === v)?.label,
      }));
    }
    return value
      ? {
          value: value as string,
          label: options.find((o) => o.value === value)?.label,
        }
      : undefined;
  }, [multiple, value, options]);

  return (
    <Combobox.Root
      value={derivedValue}
      onValueChange={(value) => {
        if (multiple && value && Array.isArray(value)) {
          const changeFn = onValueChange as (value: MultipleValue) => void;
          changeFn?.(value.map((v) => v.value));
          return;
        }

        const changeFn = onValueChange as (value: SingleValue) => void;
        const valueString = (value as { value: string }).value;
        changeFn(valueString);
      }}
      closeOnSelect={!multiple}
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
