import * as RadixPopover from "@radix-ui/react-popover";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  RefToTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Layer } from "@telegraph/layer";
import { Stack } from "@telegraph/layout";
import { AnimatePresence, motion } from "@telegraph/motion";
import React from "react";

type RootProps = React.ComponentProps<typeof RadixPopover.Root> & {
  defaultOpen?: boolean;
};

type PopoverContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextProps>({
  open: false,
  setOpen: () => {},
});

const Root = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  children,
  ...props
}: RootProps) => {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp,
    onChange: onOpenChangeProp,
  });

  return (
    <AnimatePresence
      presenceMap={[
        {
          "tgph-motion-key": "popover-content",
          value: open,
        },
      ]}
    >
      <PopoverContext.Provider value={{ open, setOpen }}>
        <RadixPopover.Root open={open} onOpenChange={setOpen} {...props}>
          {children}
        </RadixPopover.Root>
      </PopoverContext.Provider>
    </AnimatePresence>
  );
};

type TriggerProps = React.ComponentProps<typeof RadixPopover.Trigger> & {
  tgphRef?: React.RefObject<HTMLButtonElement>;
};

const Trigger = ({
  asChild = true,
  tgphRef,
  children,
  ...props
}: TriggerProps) => {
  const context = React.useContext(PopoverContext);

  return (
    <RadixPopover.Trigger
      onClick={() => {
        context.setOpen(!context.open);
      }}
      asChild={asChild}
      {...props}
      ref={tgphRef}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </RadixPopover.Trigger>
  );
};

type ContentProps<T extends TgphElement> = React.ComponentProps<
  typeof RadixPopover.Content
> &
  Omit<TgphComponentProps<typeof Stack<T>>, "align"> & {
    contentStackRef?: React.RefObject<HTMLDivElement>;
    skipAnimation?: TgphComponentProps<typeof motion.div>["skipAnimation"];
  };

const Content = <T extends TgphElement>({
  direction = "column",
  gap = "1",
  rounded = "4",
  py = "1",
  border = "px",
  shadow = "2",
  side = "bottom",
  sideOffset = 4,
  align = "center",
  bg = "surface-1",
  alignOffset,
  tgphRef,
  style,
  skipAnimation,
  children,
  ...props
}: ContentProps<T>) => {
  const context = React.useContext(PopoverContext);
  const deriveAnimationBasedOnSide = (side: ContentProps<T>["side"]) => {
    const ANIMATION_OFFSET = 5;
    if (side === "top") {
      return {
        y: -ANIMATION_OFFSET,
      };
    }

    if (side === "bottom") {
      return {
        y: ANIMATION_OFFSET,
      };
    }

    if (side === "left") {
      return {
        x: -ANIMATION_OFFSET,
      };
    }

    if (side === "right") {
      return {
        x: ANIMATION_OFFSET,
      };
    }
  };

  return (
    <Layer
      onEscapeKeyDown={() => {
        context.setOpen(false);
      }}
    >
      <RadixPopover.Portal>
        <RadixPopover.Content
          asChild
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          onEscapeKeyDown={(event) => event.preventDefault()}
          // {...props}
          ref={tgphRef}
        >
          <RefToTgphRef>
            <Stack
              as={motion.div}
              // Add tgph class so that this always works in portals
              className="tgph"
              initializeWithAnimation={false}
              skipAnimation={skipAnimation}
              initial={{
                opacity: 0.5,
                scale: 0.6,
                ...deriveAnimationBasedOnSide(side),
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0.5,
                scale: 0.6,
                ...deriveAnimationBasedOnSide(side),
              }}
              transition={{
                duration: 100,
                type: "spring",
              }}
              bg={bg}
              direction={direction}
              gap={gap}
              rounded={rounded}
              border={border}
              py={py}
              shadow={shadow}
              style={{
                overflowY: "auto",
                transformOrigin:
                  "var(--radix-tooltip-content-transform-origin)",
                ...style,
              }}
              zIndex="popover"
              tgph-motion-key="popover-content"
            >
              {children}
            </Stack>
          </RefToTgphRef>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </Layer>
  );
};

const Popover = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
};

Object.assign(Popover, {
  Root,
  Trigger,
  Content,
});

export { Popover };
