import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type AsAndTgphRefProps,
  type RemappedOmit,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Text, type TextProps } from "@telegraph/typography";
import { Check, Minus } from "lucide-react";
import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";

import { useCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";

import {
  CHECKBOX_COLOR_MAP,
  CHECKBOX_SIZE_MAP,
  type CheckboxColor,
  type CheckboxSize,
  LABEL_SIZE_MAP,
} from "./Checkbox.constants";

type InternalContextType = {
  size: CheckboxSize;
  color: CheckboxColor;
  disabled: boolean;
  indeterminate: boolean;
  parent: boolean;
  id: string;
  labelId: string;
  /**
   * The id Base UI actually put on the hidden input, which is not always the
   * `id` we passed: inside a select-all group it derives its own and discards
   * ours. `Checkbox.Label` needs the real one or `htmlFor` points at nothing.
   */
  inputId?: string;
  registerInputId: (id: string) => void;
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  formValue?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  "aria-label"?: string;
};

const CheckboxContext = createContext<InternalContextType>({
  size: "2",
  color: "blue",
  disabled: false,
  indeterminate: false,
  parent: false,
  id: "",
  labelId: "",
  registerInputId: () => {},
});

export type RootBaseProps = {
  size?: CheckboxSize;
  color?: CheckboxColor;
  /** Whether the checkbox is ticked. Use `defaultValue` for an uncontrolled checkbox. */
  value?: boolean;
  /** Initial ticked state for an uncontrolled checkbox. */
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  /** Renders the mixed state: `aria-checked="mixed"` plus a dash indicator. */
  indeterminate?: boolean;
  /**
   * Marks this checkbox as the select-all for its group. Requires a
   * `CheckboxGroup` with `allValues`; the group derives this checkbox's
   * checked and indeterminate state, so don't pass `value` alongside it.
   */
  parent?: boolean;
  /**
   * The string submitted with the form. Inside a `CheckboxGroup` this is also
   * the key the group tracks this checkbox by. Falls back to `name`.
   */
  formValue?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  id?: string;
};

// Stripped from *both* halves. Every element declares `defaultValue?: string |
// number | readonly string[]`, so leaving it in the passthrough intersects it
// with our `defaultValue?: boolean` and yields a type nothing can satisfy.
// `disabled` and `id` are declared on `RootBaseProps` instead, since the root
// renders a `div` but forwards them to the input `Checkbox.Control` renders.
type StripConflicting =
  | "value"
  | "defaultValue"
  | "onChange"
  | "disabled"
  | "id";

export type RootProps<T extends TgphElement = "div"> = RemappedOmit<
  StackProps<T>,
  "tgphRef" | "as" | StripConflicting
> &
  AsAndTgphRefProps<T, HTMLElement> &
  RootBaseProps;

const Root = <T extends TgphElement = "div">(rootProps: RootProps<T>) => {
  const {
    size: sizeProp,
    color: colorProp,
    value,
    defaultValue,
    onValueChange,
    indeterminate = false,
    parent = false,
    formValue,
    name,
    disabled: disabledProp,
    required = false,
    readOnly = false,
    id: idProp,
    className,
    children,
    as,
    style,
    "aria-label": ariaLabel,
    ...props
  } = rootProps as RootProps<"div">;
  const group = useCheckboxGroupContext();

  // Own prop wins, then the group's default, then the component default.
  const size = sizeProp ?? group?.size ?? "2";
  const color = colorProp ?? group?.color ?? "blue";
  const disabled = disabledProp ?? group?.disabled ?? false;

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;

  const [inputId, setInputId] = useState<string>();
  const registerInputId = useCallback(
    (nextId: string) => setInputId((current) => current ?? nextId),
    [],
  );

  return (
    <CheckboxContext.Provider
      value={{
        size,
        color,
        disabled,
        indeterminate,
        parent,
        id,
        labelId,
        inputId,
        registerInputId,
        value,
        defaultValue,
        onValueChange,
        formValue,
        name,
        required,
        readOnly,
        "aria-label": ariaLabel,
      }}
    >
      <Stack
        as={as}
        direction="row"
        align="center"
        gap="2"
        display="flex"
        className={className}
        data-tgph-checkbox-root
        data-tgph-checkbox-disabled={disabled}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      >
        {children}
      </Stack>
    </CheckboxContext.Provider>
  );
};

type BaseCheckboxRootProps = ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

type BaseCheckboxRenderProps = ComponentPropsWithoutRef<"span"> & {
  ref?: Ref<HTMLElement>;
};

type BaseCheckboxState = {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  readOnly: boolean;
  required: boolean;
};

export type ControlProps = RemappedOmit<
  BaseCheckboxRootProps,
  | "checked"
  | "className"
  | "defaultChecked"
  | "id"
  | "indeterminate"
  | "name"
  | "onCheckedChange"
  | "parent"
  | "render"
  | "style"
  | "value"
> & {
  style?: CSSProperties;
  tgphRef?: Ref<HTMLElement>;
};

const Control = ({ style, tgphRef, inputRef, ...props }: ControlProps) => {
  const context = useContext(CheckboxContext);
  const { size, iconSize } = CHECKBOX_SIZE_MAP[context.size];
  const { backgroundColor, indicatorColor } = CHECKBOX_COLOR_MAP[context.color];
  const { registerInputId } = context;

  // Report whatever id Base UI settled on, so `Checkbox.Label` can point
  // `htmlFor` at it. Composed with any caller-supplied `inputRef`.
  const composedInputRef = useComposedRefs<HTMLInputElement>(
    inputRef,
    useCallback(
      (node: HTMLInputElement | null) => {
        if (node?.id) registerInputId(node.id);
      },
      [registerInputId],
    ),
  );

  return (
    <BaseCheckbox.Root
      inputRef={composedInputRef}
      id={context.id}
      name={context.name}
      value={context.formValue}
      checked={context.value}
      defaultChecked={context.defaultValue}
      indeterminate={context.indeterminate}
      parent={context.parent}
      disabled={context.disabled}
      required={context.required}
      readOnly={context.readOnly}
      aria-label={context["aria-label"]}
      aria-labelledby={context["aria-label"] ? undefined : context.labelId}
      onCheckedChange={(checked) => context.onValueChange?.(checked)}
      {...props}
      render={createTgphBaseUIRender<
        BaseCheckboxRenderProps,
        BaseCheckboxState
      >((state) => {
        const active = state.checked || state.indeterminate;
        return (
          <Stack
            align="center"
            justify="center"
            w={size}
            h={size}
            rounded="2"
            border="px"
            borderColor={active ? backgroundColor : "gray-6"}
            bg={active ? backgroundColor : "surface-1"}
            data-tgph-checkbox-control
            data-tgph-checkbox-size={context.size}
            data-tgph-checkbox-color={context.color}
            tgphRef={tgphRef}
            style={style}
          >
            <BaseCheckbox.Indicator
              render={createTgphBaseUIRender<
                BaseCheckboxRenderProps,
                BaseCheckboxState
              >((indicatorState) => (
                <Stack
                  align="center"
                  justify="center"
                  data-tgph-checkbox-indicator
                >
                  <Icon
                    icon={indicatorState.indeterminate ? Minus : Check}
                    size={iconSize}
                    color={indicatorColor}
                    aria-hidden
                  />
                </Stack>
              ))}
            />
          </Stack>
        );
      })}
    />
  );
};

// `as` is re-declared as optional so `<Checkbox.Label>` works without it;
// Telegraph's `Text` otherwise requires `as` unless `internal_optionalAs` is set.
export type LabelProps<T extends TgphElement = "label"> = RemappedOmit<
  TextProps<T>,
  "as"
> & {
  as?: T;
};

const Label = <T extends TgphElement = "label">(labelProps: LabelProps<T>) => {
  const { as, style, ...props } = labelProps as LabelProps<"label">;
  const context = useContext(CheckboxContext);

  return (
    <Text
      as={as || "label"}
      // The id Base UI actually used, falling back to ours before the input
      // has mounted. Inside a select-all group these differ.
      htmlFor={context.inputId ?? context.id}
      id={context.labelId}
      size={LABEL_SIZE_MAP[context.size]}
      data-tgph-checkbox-label
      data-tgph-checkbox-disabled={context.disabled}
      style={{
        cursor: context.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...props}
    />
  );
};

export type DefaultProps<T extends TgphElement = "div"> = RootProps<T> & {
  label?: ReactNode;
  labelProps?: RemappedOmit<LabelProps<"label">, "as">;
  controlProps?: ControlProps;
};

const Default = <T extends TgphElement = "div">({
  label,
  labelProps,
  controlProps,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root {...(props as RootProps<T>)}>
      <Control {...controlProps} />
      {label && (
        <Label as="label" {...labelProps}>
          {label}
        </Label>
      )}
    </Root>
  );
};

const Checkbox = {
  Default,
  Root,
  Control,
  Label,
};

export { Checkbox, CheckboxContext };
