import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Button } from "@telegraph/button";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { useTruncate } from "@telegraph/truncate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import React from "react";

// Use a tolerance of 1px to account for subpixel rendering and floating-point precision
const SCROLL_TOLERANCE = 1;
const SCROLL_OFFSET = 24;

const SegmentedControlContextState = React.createContext<{
  value?: React.ComponentProps<typeof ToggleGroup.Root>["value"];
  size?: React.ComponentProps<typeof Button.Root>["size"];
  showScrollButtons?: boolean;
  activeOptionRef?: HTMLButtonElement | null;
  setActiveOptionRef?: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
}>({
  value: "",
  size: "1",
  showScrollButtons: false,
  activeOptionRef: null,
  setActiveOptionRef: () => {},
});

export type RootProps = Omit<
  React.ComponentProps<typeof ToggleGroup.Root>,
  "type"
> &
  TgphComponentProps<typeof Stack> & {
    type?: React.ComponentProps<typeof ToggleGroup.Root>["type"];
    size?: React.ComponentProps<typeof Button.Root>["size"];
    scrollControls?: "arrows" | "none";
  };

const Root = ({
  // ToggleGroup.Root Props
  type = "single",
  size = "1",
  scrollControls = "arrows",
  value,
  defaultValue,
  onValueChange,
  disabled,
  rovingFocus,
  orientation,
  dir,
  loop,
  children,
  ...props
}: RootProps) => {
  const containerId = React.useId();

  // Automatically show the scroll buttons when the content of the
  // segmented control is too wide to fit within the container.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { truncated } = useTruncate({ tgphRef: containerRef });
  const scrollButtonRef = React.useRef<HTMLButtonElement>(null);
  const showScrollButtons = scrollControls === "arrows" && truncated;

  // We store the active option ref as a state value so that we can respond to it
  // changing via an effect vs doing complicated ref status chasing.
  const [activeOptionRef, setActiveOptionRef] =
    React.useState<HTMLButtonElement | null>(null);
  const [scrollStatus, setScrollStatus] = React.useState<
    "flushLeft" | "flushRight" | "middle" | null
  >(null);

  const onScrollClick = React.useCallback((direction: "left" | "right") => {
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
  const deriveScrollStatus = React.useCallback(
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
  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;
    const newScrollPosition = containerRef.current.scrollLeft;
    const newScrollStatus = deriveScrollStatus(newScrollPosition);
    setScrollStatus(newScrollStatus);
  }, [deriveScrollStatus]);

  React.useEffect(() => {
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
  const [hasRan, setHasRan] = React.useState(false);
  React.useEffect(() => {
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
        // option instantly. This avoid animating to that value on mount.
        behavior: hasRan ? "smooth" : "instant",
      });

      !hasRan && setHasRan(true);
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
          value,
          size,
          showScrollButtons,
          activeOptionRef,
          setActiveOptionRef,
        }}
      >
        {/* @ts-expect-error: radix's type props doesn't seem to be typed correctly, could be a bug? */}
        <ToggleGroup.Root
          asChild={true}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          rovingFocus={rovingFocus}
          orientation={orientation}
          dir={dir}
          loop={loop}
        >
          <RefToTgphRef>
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
              tgphRef={containerRef}
              {...props}
            >
              {children}
            </Stack>
          </RefToTgphRef>
        </ToggleGroup.Root>
      </SegmentedControlContextState.Provider>
      {/* We only load any of the truncation logic when the container is truncated. */}
      {showScrollButtons && (
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
  string,
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

export type OptionProps = React.ComponentProps<typeof ToggleGroup.Item> &
  TgphComponentProps<typeof Button>;

const Option = ({
  // ToggleGroup.Item Props
  value,
  disabled,
  // Button Props
  size = "1",
  style,
  ...props
}: OptionProps) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { setActiveOptionRef, ...context } = React.useContext(
    SegmentedControlContextState,
  );
  const status = context.value === value ? "active" : "inactive";
  const derivedSize = context.size ?? size;

  React.useEffect(() => {
    if (status === "active") {
      setActiveOptionRef?.(buttonRef.current);
    }
  }, [status, setActiveOptionRef]);

  return (
    <ToggleGroup.Item asChild={true} value={value} disabled={disabled}>
      <RefToTgphRef>
        <Button
          size={derivedSize}
          {...ButtonStyleProps[status]}
          style={{
            // Make the button take up all availabel space
            flexGrow: 1,
            ...style,
          }}
          data-tgph-segmented-control-option
          data-tgph-segmented-control-option-status={status}
          tgphRef={buttonRef}
          {...props}
        />
      </RefToTgphRef>
    </ToggleGroup.Item>
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
