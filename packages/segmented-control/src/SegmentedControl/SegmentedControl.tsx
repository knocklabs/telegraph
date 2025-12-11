import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Button } from "@telegraph/button";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { useTruncate } from "@telegraph/truncate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import { div as MotionDiv } from "motion/react-m";
import React from "react";

// Use a tolerance of 1px to account for subpixel rendering and floating-point precision
const SCROLL_TOLERANCE = 1;

const SegmentedControlContextState = React.createContext<{
  value?: React.ComponentProps<typeof ToggleGroup.Root>["value"];
  size?: React.ComponentProps<typeof Button.Root>["size"];
  truncated?: boolean;
}>({
  value: "",
  size: "1",
  truncated: false,
});

type RootProps = Omit<React.ComponentProps<typeof ToggleGroup.Root>, "type"> &
  TgphComponentProps<typeof Stack> & {
    type?: React.ComponentProps<typeof ToggleGroup.Root>["type"];
    size?: React.ComponentProps<typeof Button.Root>["size"];
  };

const Root = ({
  // ToggleGroup.Root Props
  type = "single",
  size = "1",
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
  const [scrollStatus, setScrollStatus] = React.useState<
    "flushLeft" | "flushRight" | "middle" | null
  >(null);

  const handleScroll = React.useCallback((direction: "left" | "right") => {
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

  const updateScrollStatus = React.useCallback(() => {
    if (!containerRef.current) return;
    const newScrollPosition = containerRef.current.scrollLeft;
    const maxScrollPosition =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;

    // If the scroll position is at or near 0, this means that the leftmost option
    // is flush against the left edge of the container.
    if (newScrollPosition <= SCROLL_TOLERANCE) {
      return setScrollStatus("flushLeft");
    }

    // If the scroll position is at or near the maximum, this means that the rightmost
    // option is flush against the right edge of the container.
    if (newScrollPosition >= maxScrollPosition - SCROLL_TOLERANCE) {
      return setScrollStatus("flushRight");
    }

    // If neither of these things are true, then the scroll position is
    // somewhere in the middle and we need both buttons to be visible.
    setScrollStatus("middle");
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Run the initial check to see if the container is truncated
    updateScrollStatus();
    container.addEventListener("scroll", updateScrollStatus);
    return () => {
      container?.removeEventListener("scroll", updateScrollStatus);
    };
  }, [updateScrollStatus]);

  return (
    <Box position="relative" overflow="hidden" rounded="2">
      <SegmentedControlContextState.Provider value={{ value, size, truncated }}>
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
              overflow="hidden"
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
      {truncated && (
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {(scrollStatus === "flushRight" || scrollStatus === "middle") && (
              <Box
                key="left-scroll-button"
                as={MotionDiv}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.2, type: "spring", bounce: 0 }}
                position="absolute"
                left="0"
                top="0"
                bottom="0"
              >
                <Button
                  variant="outline"
                  icon={{ icon: ChevronLeft, alt: "Scroll left" }}
                  onClick={() => handleScroll("left")}
                  size={size}
                  aria-label="Scroll left to view more options"
                  aria-controls={containerId}
                />
              </Box>
            )}
            {(scrollStatus === "flushLeft" || scrollStatus === "middle") && (
              <Box
                key="right-scroll-button"
                as={MotionDiv}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.2, type: "spring", bounce: 0 }}
                position="absolute"
                right="0"
                top="0"
                bottom="0"
              >
                <Button
                  variant="outline"
                  icon={{ icon: ChevronRight, alt: "Scroll right" }}
                  onClick={() => handleScroll("right")}
                  size={size}
                  aria-label="Scroll right to view more options"
                  aria-controls={containerId}
                />
              </Box>
            )}
          </AnimatePresence>
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

type OptionProps = React.ComponentProps<typeof ToggleGroup.Item> &
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
  const context = React.useContext(SegmentedControlContextState);
  const status = context.value === value ? "active" : "inactive";
  const derivedSize = context.size ?? size;

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
