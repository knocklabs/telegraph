import {
  DirectionProvider,
  type TextDirection,
} from "@base-ui/react/direction-provider";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Button } from "@telegraph/button";
import {
  type TgphComponentProps,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import type { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import {
  type CSSProperties,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  forwardRef,
} from "react";

type BaseRadioGroupProps = ComponentPropsWithoutRef<typeof BaseRadioGroup>;

type LegacyRadioGroupProps = {
  /**
   * Kept for Radix API compatibility and enforced by the Telegraph wrapper
   * because Base UI RadioGroup does not expose an orientation prop.
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Kept for Radix API compatibility and enforced by the Telegraph wrapper
   * because Base UI RadioGroup does not expose a loop prop.
   */
  loop?: boolean;
  /**
   * Kept for Radix API compatibility and forwarded through Base UI's
   * DirectionProvider.
   */
  dir?: TextDirection;
};

export type RootProps = Omit<
  BaseRadioGroupProps,
  | "children"
  | "className"
  | "defaultValue"
  | "onValueChange"
  | "render"
  | "style"
  | "value"
> &
  TgphComponentProps<typeof Stack> &
  LegacyRadioGroupProps & {
    defaultValue?: string;
    value?: string | null;
    onValueChange?: (value: string) => void;
  };

type NavigationOrientation = NonNullable<LegacyRadioGroupProps["orientation"]>;
type RadioCardKeyboardEvent = KeyboardEvent<HTMLDivElement> & {
  baseUIHandlerPrevented?: boolean;
  preventBaseUIHandler: () => void;
};

const getHorizontalForwardKey = (dir: TextDirection | undefined) => {
  return dir === "rtl" ? "ArrowLeft" : "ArrowRight";
};

const getHorizontalBackwardKey = (dir: TextDirection | undefined) => {
  return dir === "rtl" ? "ArrowRight" : "ArrowLeft";
};

const isOrientationBlockedKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
) => {
  if (orientation === "horizontal") {
    return key === "ArrowUp" || key === "ArrowDown";
  }

  if (orientation === "vertical") {
    return key === "ArrowLeft" || key === "ArrowRight";
  }

  return false;
};

const isForwardNavigationKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  if (orientation === "vertical") {
    return key === "ArrowDown";
  }

  return key === getHorizontalForwardKey(dir) || key === "ArrowDown";
};

const isBackwardNavigationKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  if (orientation === "vertical") {
    return key === "ArrowUp";
  }

  return key === getHorizontalBackwardKey(dir) || key === "ArrowUp";
};

const getNavigationDirection = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  if (isForwardNavigationKey(key, orientation, dir)) {
    return 1;
  }

  if (isBackwardNavigationKey(key, orientation, dir)) {
    return -1;
  }

  return 0;
};

const getEnabledRadios = (root: HTMLElement) => {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[role="radio"]'),
  ).filter(
    (radio) =>
      !radio.matches(":disabled, [data-disabled], [aria-disabled='true']"),
  );
};

const getCurrentRadio = (root: HTMLElement, enabledRadios: HTMLElement[]) => {
  const activeElement = root.ownerDocument.activeElement;

  if (
    activeElement instanceof HTMLElement &&
    root.contains(activeElement) &&
    activeElement.getAttribute("role") === "radio"
  ) {
    return activeElement;
  }

  return (
    enabledRadios.find(
      (radio) => radio.getAttribute("aria-checked") === "true",
    ) ?? null
  );
};

const getNextRadio = (
  event: RadioCardKeyboardEvent,
  orientation: NavigationOrientation | undefined,
  loop: boolean | undefined,
  dir: TextDirection | undefined,
) => {
  const navigationDirection = getNavigationDirection(
    event.key,
    orientation,
    dir,
  );

  if (navigationDirection === 0) {
    return null;
  }

  const enabledRadios = getEnabledRadios(event.currentTarget);
  const currentRadio = getCurrentRadio(event.currentTarget, enabledRadios);
  const currentIndex = currentRadio ? enabledRadios.indexOf(currentRadio) : -1;

  if (currentIndex === -1) {
    return null;
  }

  const nextIndex = currentIndex + navigationDirection;

  if (nextIndex >= 0 && nextIndex < enabledRadios.length) {
    return enabledRadios[nextIndex] ?? null;
  }

  if (loop === false) {
    return currentRadio;
  }

  return navigationDirection === 1
    ? enabledRadios[0]
    : enabledRadios[enabledRadios.length - 1];
};

const preventBaseUIKeyboardNavigation = (event: RadioCardKeyboardEvent) => {
  event.preventBaseUIHandler();
};

const syncRadioTabStops = (root: HTMLElement, activeRadio: HTMLElement) => {
  getEnabledRadios(root).forEach((radio) => {
    radio.tabIndex = radio === activeRadio ? 0 : -1;
  });

  activeRadio.focus();
};

const handleCompatibilityKeyboardNavigation = (
  event: RadioCardKeyboardEvent,
  orientation: NavigationOrientation | undefined,
  loop: boolean | undefined,
  dir: TextDirection | undefined,
) => {
  if (isOrientationBlockedKey(event.key, orientation)) {
    preventBaseUIKeyboardNavigation(event);
    event.preventDefault();
    return;
  }

  const nextRadio = getNextRadio(event, orientation, loop, dir);

  if (!nextRadio) {
    return;
  }

  preventBaseUIKeyboardNavigation(event);
  event.preventDefault();

  if (nextRadio === event.target) {
    syncRadioTabStops(event.currentTarget, nextRadio);
    return;
  }

  const root = event.currentTarget;

  nextRadio.click();
  queueMicrotask(() => {
    syncRadioTabStops(root, nextRadio);
  });
};

type RootContentProps = RootProps;

const RootContent = ({
  value,
  defaultValue,
  children,
  onValueChange,
  disabled,
  dir,
  form,
  inputRef,
  loop,
  name,
  onKeyDown,
  orientation,
  readOnly,
  required,
  ...props
}: RootContentProps) => {
  const handleValueChange: BaseRadioGroupProps["onValueChange"] | undefined =
    onValueChange
      ? (nextValue) => {
          if (typeof nextValue === "string") {
            onValueChange(nextValue);
          }
        }
      : undefined;

  const handleKeyDown = (event: RadioCardKeyboardEvent) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    handleCompatibilityKeyboardNavigation(event, orientation, loop, dir);
  };

  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      form={form}
      inputRef={inputRef}
      name={name}
      readOnly={readOnly}
      required={required}
      render={createTgphBaseUIRender(
        <Stack gap="1" dir={dir} onKeyDown={handleKeyDown} {...props}>
          {children}
        </Stack>,
      )}
    />
  );
};

const Root = ({ dir, ...props }: RootProps) => {
  if (dir) {
    return (
      <DirectionProvider direction={dir}>
        <RootContent dir={dir} {...props} />
      </DirectionProvider>
    );
  }

  return <RootContent {...props} />;
};

type BaseRadioRootProps = ComponentPropsWithoutRef<typeof BaseRadio.Root>;
type BaseRadioRenderProps = ComponentPropsWithoutRef<"button"> & {
  ref?: Ref<HTMLElement>;
};
type BaseRadioState = {
  checked: boolean;
  disabled: boolean;
};

const getRadioCardButtonStyle = (
  style: CSSProperties | undefined,
): CSSProperties =>
  ({
    "--tgph-button-active-shadow": "inset 0 0 0 1px var(--tgph-blue-8)",
    ...style,
  }) as CSSProperties;

export type ItemProps = Omit<
  BaseRadioRootProps,
  "children" | "className" | "render" | "style" | "value"
> & {
  children?: ReactNode;
  style?: CSSProperties;
  tgphRef?: Ref<HTMLButtonElement>;
  value: string;
};
type ItemRef = HTMLButtonElement;

const Item = forwardRef<ItemRef, ItemProps>(
  ({ children, style, tgphRef, ...props }, forwardedRef) => {
    return (
      <BaseRadio.Root
        {...props}
        ref={forwardedRef as Ref<HTMLElement>}
        nativeButton
        render={createTgphBaseUIRender<BaseRadioRenderProps, BaseRadioState>(
          (state) => (
            <Button.Root
              variant="outline"
              active={state.checked}
              disabled={state.disabled}
              h="full"
              w="full"
              px="0"
              py="0"
              data-tgph-radio-group-button
              data-state={state.checked ? "checked" : "unchecked"}
              tgphRef={tgphRef}
              style={getRadioCardButtonStyle(style)}
            >
              {children}
            </Button.Root>
          ),
        )}
      />
    );
  },
);

export type ItemTitleProps<T extends TgphElement = "span"> = TgphComponentProps<
  typeof Button.Text<T>
>;

const ItemTitle = <T extends TgphElement = "span">({
  size = "2",
  ...props
}: ItemTitleProps<T>) => {
  return <Button.Text as={"span"} size={size} {...props} />;
};

export type ItemDescriptionProps<T extends TgphElement = "span"> =
  TgphComponentProps<typeof Button.Text<T>>;
const ItemDescription = <T extends TgphElement = "span">({
  size = "0",
  ...props
}: ItemDescriptionProps<T>) => {
  return (
    <Button.Text
      as={"span"}
      size={size}
      color="gray"
      data-tgph-radio-card-description
      {...props}
    />
  );
};

export type ItemIconProps<T extends TgphElement = "span"> = TgphComponentProps<
  typeof Button.Icon<T>
>;

const ItemIcon = <T extends TgphElement = "span">(props: ItemIconProps<T>) => {
  return <Button.Icon color="gray" data-tgph-radio-card-icon {...props} />;
};

type DefaultIconProps = ComponentProps<typeof Icon>;

export type DefaultProps = ComponentPropsWithoutRef<typeof Root> & {
  options: Array<
    {
      title?: ReactNode;
      description?: ReactNode;
      icon?: DefaultIconProps;
    } & ComponentPropsWithoutRef<typeof Item>
  >;
};

const Default = ({ options, direction = "row", ...props }: DefaultProps) => {
  const isGroupHorizontal = direction === "row" || direction === "row-reverse";
  return (
    <Root direction={direction} {...props}>
      {options.map(({ title, description, icon, ...itemProps }) => (
        <Item key={itemProps.value} {...itemProps}>
          <Stack
            direction={isGroupHorizontal ? "column" : "row"}
            align={isGroupHorizontal ? "flex-start" : "center"}
            p="3"
            w="full"
          >
            {icon && (
              <Box
                mb={isGroupHorizontal ? "2" : "0"}
                mr={isGroupHorizontal ? "0" : "4"}
                ml={isGroupHorizontal ? "0" : "1"}
              >
                <ItemIcon {...icon} />
              </Box>
            )}
            <Stack direction="column" align="flex-start">
              {title && <ItemTitle>{title}</ItemTitle>}
              {description && <ItemDescription>{description}</ItemDescription>}
            </Stack>
          </Stack>
        </Item>
      ))}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Item,
  ItemTitle,
  ItemDescription,
  ItemIcon,
});

const RadioCards = Default as typeof Default & {
  Root: typeof Root;
  Item: typeof Item;
  ItemTitle: typeof ItemTitle;
  ItemDescription: typeof ItemDescription;
  ItemIcon: typeof ItemIcon;
};

export { RadioCards };
