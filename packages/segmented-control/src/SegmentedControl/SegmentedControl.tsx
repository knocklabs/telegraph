import {
  DirectionProvider,
  type TextDirection,
} from "@base-ui/react/direction-provider";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Button } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type TgphComponentProps,
  createTgphBaseUIRender,
  useControllableState,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { useTruncate } from "@telegraph/truncate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import {
  type ComponentPropsWithoutRef,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  type AnySegmentedControlValue,
  ROVING_FOCUS_KEYS,
  type SegmentedControlType,
  type SegmentedControlValue,
  getBaseToggleGroupValue,
  getBaseToggleValue,
  getLegacyToggleGroupValue,
} from "./SegmentedControl.helpers";

// Use a tolerance of 1px to account for subpixel rendering and floating-point precision
const SCROLL_TOLERANCE = 1;
const SCROLL_OFFSET = 24;

type BaseToggleGroupProps = ComponentPropsWithoutRef<typeof BaseToggleGroup>;
type SegmentedControlOptionStatus = "active" | "inactive";
type SegmentedControlRootKeyDownEvent = KeyboardEvent<HTMLDivElement> & {
  preventBaseUIHandler?: () => void;
};
type SegmentedControlChangeValue<
  T extends SegmentedControlType,
  Value extends AnySegmentedControlValue,
> = T extends "multiple"
  ? string[]
  : Extract<Value, string> extends never
    ? string
    : Extract<Value, string>;
type SegmentedControlValueChangeHandler<
  T extends SegmentedControlType,
  Value extends AnySegmentedControlValue,
> = {
  bivarianceHack(value: SegmentedControlChangeValue<T, Value>): void;
}["bivarianceHack"];

const SegmentedControlContextState = createContext<{
  disabled?: boolean;
  size?: ComponentPropsWithoutRef<typeof Button.Root>["size"];
  showScrollButtons?: boolean;
  activeOptionRef?: HTMLButtonElement | null;
  setActiveOptionRef?: Dispatch<SetStateAction<HTMLButtonElement | null>>;
}>({
  disabled: false,
  size: "1",
  showScrollButtons: false,
  activeOptionRef: null,
  setActiveOptionRef: () => {},
});

export type RootProps<
  T extends SegmentedControlType = "single",
  Value extends AnySegmentedControlValue = SegmentedControlValue<T>,
> = Omit<
  BaseToggleGroupProps,
  | "children"
  | "className"
  | "defaultValue"
  | "disabled"
  | "loopFocus"
  | "multiple"
  | "onKeyDown"
  | "onValueChange"
  | "orientation"
  | "render"
  | "style"
  | "value"
> &
  Omit<TgphComponentProps<typeof Stack>, "defaultValue" | "dir"> & {
    defaultValue?: Value;
    dir?: TextDirection;
    disabled?: boolean;
    loop?: boolean;
    onValueChange?: SegmentedControlValueChangeHandler<T, Value>;
    orientation?: BaseToggleGroupProps["orientation"];
    rovingFocus?: boolean;
    scrollControls?: "arrows" | "none";
    size?: ComponentPropsWithoutRef<typeof Button.Root>["size"];
    type?: T;
    value?: Value;
  };

type SegmentedControlDirectionProviderProps = {
  children: ReactNode;
  dir?: TextDirection;
};

const SegmentedControlDirectionProvider = ({
  children,
  dir,
}: SegmentedControlDirectionProviderProps) => {
  if (!dir) {
    return <>{children}</>;
  }

  return <DirectionProvider direction={dir}>{children}</DirectionProvider>;
};

const Root = <
  T extends SegmentedControlType = "single",
  Value extends AnySegmentedControlValue = SegmentedControlValue<T>,
>({
  type: typeProp,
  size = "1",
  scrollControls = "arrows",
  value,
  defaultValue,
  onValueChange,
  disabled,
  rovingFocus,
  orientation,
  dir,
  loop = true,
  children,
  onKeyDown,
  tgphRef,
  ...props
}: RootProps<T, Value>) => {
  const containerId = useId();

  // Automatically show the scroll buttons when the content of the
  // segmented control is too wide to fit within the container.
  const containerRef = useRef<HTMLDivElement>(null);
  const composedContainerRef = useComposedRefs(
    tgphRef as Ref<HTMLDivElement> | undefined,
    containerRef,
  );
  const { truncated } = useTruncate({ tgphRef: containerRef });
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const showScrollButtons = scrollControls === "arrows" && truncated;
  // Only load the motion/measurement work once overflow is detected.
  const shouldRenderScrollButtons = showScrollButtons;
  const type = typeProp ?? "single";
  const isMultiple = type === "multiple";
  // Encode Telegraph values before they reach Base UI so empty strings and
  // private-looking values can round-trip safely through ToggleGroup.
  const [currentValue, setCurrentValue] = useControllableState<
    AnySegmentedControlValue | undefined
  >({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as
      | ((nextValue: AnySegmentedControlValue | undefined) => void)
      | undefined,
  });
  const baseValue = getBaseToggleGroupValue(currentValue) ?? [];
  const handleValueChange = useCallback<
    NonNullable<BaseToggleGroupProps["onValueChange"]>
  >(
    (nextValue) => {
      if (!isMultiple && nextValue.length === 0) {
        // Radix single ToggleGroup did not let the active option clear itself.
        return;
      }

      // Base UI always emits arrays; convert back to Telegraph's single or
      // multiple public value shape before notifying consumers.
      setCurrentValue(
        getLegacyToggleGroupValue(type, nextValue) as AnySegmentedControlValue,
      );
    },
    [isMultiple, setCurrentValue, type],
  );
  const handleKeyDown = useCallback(
    (event: SegmentedControlRootKeyDownEvent) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        event.preventBaseUIHandler?.();
        return;
      }

      if (rovingFocus !== false) {
        return;
      }

      if (ROVING_FOCUS_KEYS.includes(event.key)) {
        // `rovingFocus={false}` used to leave arrow keys to the page/caller, so
        // block Base UI's default roving handler after user code has run.
        event.preventBaseUIHandler?.();
      }
    },
    [onKeyDown, rovingFocus],
  );

  // We store the active option ref as a state value so that we can respond to it
  // changing via an effect vs doing complicated ref status chasing.
  const [activeOptionRef, setActiveOptionRef] =
    useState<HTMLButtonElement | null>(null);
  const [scrollStatus, setScrollStatus] = useState<
    "flushLeft" | "flushRight" | "middle" | null
  >(null);

  const onScrollClick = useCallback((direction: "left" | "right") => {
    if (!containerRef.current) return;

    // We get the currentWidth so that we can scroll a meaningful amount.
    // Current width in this context is the visible width of the container
    // and not the total width of the overflowed content.
    const currentWidth = containerRef.current.clientWidth;
    const newScrollPosition =
      direction === "left"
        ? containerRef.current.scrollLeft - currentWidth
        : containerRef.current.scrollLeft + currentWidth;

    containerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  }, []);

  // Derive what the `scrollStatus` should be based on the current scroll position.
  const deriveScrollStatus = useCallback(
    (
      currentScrollPosition: number,
    ): "flushLeft" | "flushRight" | "middle" | null => {
      if (!containerRef.current) return null;
      const maxScrollPosition =
        containerRef.current.scrollWidth - containerRef.current.clientWidth;

      // If the scroll position is at or near 0, this means that the leftmost option
      // is flush against the left edge of the container.
      if (currentScrollPosition <= SCROLL_TOLERANCE) {
        return "flushLeft";
      }

      // If the scroll position is at or near the maximum, this means that the rightmost
      // option is flush against the right edge of the container.
      if (currentScrollPosition >= maxScrollPosition - SCROLL_TOLERANCE) {
        return "flushRight";
      }

      // If neither of these things are true, then the scroll position is
      // somewhere in the middle and we need both buttons to be visible.
      return "middle";
    },
    [],
  );

  // Update the `scrollStatus` on mount and each time the container is scrolled.
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const newScrollPosition = containerRef.current.scrollLeft;
    const newScrollStatus = deriveScrollStatus(newScrollPosition);
    setScrollStatus(newScrollStatus);
  }, [deriveScrollStatus]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Run the initial check to see if the container is truncated
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // When the active option is changed, ensure that it is in view.
  const [hasRan, setHasRan] = useState(false);
  useEffect(() => {
    if (showScrollButtons && activeOptionRef) {
      const optionOffsetLeft = activeOptionRef.offsetLeft;
      // Determine what the scroll status would be if the active option was scrolled into view.
      const newScrollStatus = deriveScrollStatus(optionOffsetLeft);
      const scrollButtonWidth =
        (scrollButtonRef.current?.clientWidth ?? 0) + SCROLL_OFFSET;

      // Set the scroll status so that the scroll buttons start in the correct position.
      setScrollStatus(newScrollStatus);

      const newScrollPosition =
        // If the active option would be behind the left scroll button, take the measurement of
        // the scroll button width into account so that the active option is in view.
        newScrollStatus === "flushRight" || newScrollStatus === "middle"
          ? optionOffsetLeft - scrollButtonWidth
          : optionOffsetLeft;

      containerRef.current?.scrollTo({
        left: newScrollPosition,
        // If this is the first time we've run this effect, we choose to scroll to the active
        // option instantly. This avoids animating to that value on mount.
        behavior: hasRan ? "smooth" : "instant",
      });

      if (!hasRan) {
        setHasRan(true);
      }
    }
  }, [showScrollButtons, activeOptionRef, deriveScrollStatus, hasRan]);

  return (
    <Box
      position="relative"
      overflow={showScrollButtons ? "hidden" : "visible"}
      rounded="2"
    >
      <SegmentedControlContextState.Provider
        value={{
          size,
          disabled,
          showScrollButtons,
          activeOptionRef,
          setActiveOptionRef,
        }}
      >
        <SegmentedControlDirectionProvider dir={dir}>
          <BaseToggleGroup
            value={baseValue}
            onValueChange={handleValueChange}
            disabled={disabled}
            multiple={isMultiple}
            orientation={orientation}
            loopFocus={loop}
            render={createTgphBaseUIRender(
              <Stack
                id={containerId}
                bg="gray-3"
                rounded="2"
                align="center"
                justify="space-between"
                // We use overflow hidden here to totally hide any overflow while also
                // hiding any scroll bars. The buttons that appear when the container is truncated
                // control the scroll. This means we don't need to worry about the browser's default
                // scroll bar overlapping the segmented control.
                overflow={showScrollButtons ? "hidden" : "visible"}
                position="relative"
                dir={dir}
                tgphRef={composedContainerRef}
                onKeyDown={handleKeyDown}
                {...props}
              >
                {children}
              </Stack>,
            )}
          />
        </SegmentedControlDirectionProvider>
      </SegmentedControlContextState.Provider>
      {shouldRenderScrollButtons && (
        <LazyMotion features={domAnimation}>
          <Box
            key="left-scroll-button"
            as={MotionDiv}
            animate={{
              x:
                scrollStatus === "flushRight" || scrollStatus === "middle"
                  ? 0
                  : "-100%",
              display:
                scrollStatus === "flushRight" || scrollStatus === "middle"
                  ? "flex"
                  : "none",
            }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            position="absolute"
            left="0"
            top="0"
            bottom="0"
          >
            <Button
              variant="outline"
              icon={{ icon: ChevronLeft, alt: "Scroll left" }}
              onClick={() => onScrollClick("left")}
              size={size}
              aria-label="Scroll left to view more options"
              aria-controls={containerId}
            />
          </Box>
          <Box
            key="right-scroll-button"
            as={MotionDiv}
            animate={{
              x:
                scrollStatus === "flushLeft" || scrollStatus === "middle"
                  ? 0
                  : "100%",
              display:
                scrollStatus === "flushLeft" || scrollStatus === "middle"
                  ? "flex"
                  : "none",
            }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            tgphRef={scrollButtonRef}
          >
            <Button
              variant="outline"
              icon={{ icon: ChevronRight, alt: "Scroll right" }}
              onClick={() => onScrollClick("right")}
              size={size}
              aria-label="Scroll right to view more options"
              aria-controls={containerId}
            />
          </Box>
        </LazyMotion>
      )}
    </Box>
  );
};

const ButtonStyleProps: Record<
  SegmentedControlOptionStatus,
  TgphComponentProps<typeof Button.Root>
> = {
  active: {
    variant: "outline",
    color: "default",
  },
  inactive: {
    variant: "ghost",
    color: "gray",
  },
};

export type OptionProps = Omit<TgphComponentProps<typeof Button>, "value"> & {
  value: string;
};

type OptionButtonProps = Omit<OptionProps, "value"> & {
  buttonRef: RefObject<HTMLButtonElement | null>;
  status: SegmentedControlOptionStatus;
};

const OptionButton = ({
  buttonRef,
  disabled,
  size = "1",
  status,
  style,
  tgphRef,
  ...props
}: OptionButtonProps) => {
  const { setActiveOptionRef, ...context } = useContext(
    SegmentedControlContextState,
  );
  const derivedSize = context.size ?? size;
  const derivedDisabled = Boolean(context.disabled || disabled);
  const composedButtonRef = useComposedRefs(
    tgphRef as Ref<HTMLButtonElement> | undefined,
    buttonRef,
  );

  useEffect(() => {
    if (status === "active") {
      setActiveOptionRef?.(buttonRef.current);
    }
  }, [buttonRef, status, setActiveOptionRef]);

  return (
    <Button
      size={derivedSize}
      disabled={derivedDisabled}
      {...ButtonStyleProps[status]}
      style={{
        flexGrow: 1,
        ...style,
      }}
      data-tgph-segmented-control-option
      data-tgph-segmented-control-option-status={status}
      tgphRef={composedButtonRef}
      {...props}
    />
  );
};

const Option = ({ value, disabled, ...props }: OptionProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <BaseToggle
      value={getBaseToggleValue(value)}
      disabled={disabled}
      render={createTgphBaseUIRender((state) => (
        <OptionButton
          buttonRef={buttonRef}
          disabled={state.disabled || disabled}
          status={state.pressed ? "active" : "inactive"}
          {...props}
        />
      ))}
    />
  );
};

const Default = {};

Object.assign(Default, {
  Root,
  Option,
});
const SegmentedControl = Default as typeof Default & {
  Root: typeof Root;
  Option: typeof Option;
};

export { SegmentedControl };
