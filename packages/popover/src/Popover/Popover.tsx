import * as RadixPopover from "@radix-ui/react-popover";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { RefToTgphRef } from "@telegraph/helpers";
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
    <PopoverContext.Provider value={{ open, setOpen }}>
      <RadixPopover.Root open={open} onOpenChange={setOpen} {...props}>
        <pre>{JSON.stringify(open, null, 2)}</pre>
        {children}
      </RadixPopover.Root>
    </PopoverContext.Provider>
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
      {children}
    </RadixPopover.Trigger>
  );
};

type ContentProps = React.ComponentProps<typeof RadixPopover.Content> & {
  tgphRef?: React.RefObject<HTMLDivElement>;
};

const Content = ({ tgphRef, children, ...props }: ContentProps) => {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content {...props} ref={tgphRef}>
        <RefToTgphRef>{children}</RefToTgphRef>
        <RadixPopover.Arrow className="PopoverArrow" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
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
