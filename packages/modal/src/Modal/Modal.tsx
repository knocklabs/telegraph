import * as Dialog from "@radix-ui/react-dialog";
import { Box, Stack } from "@telegraph/layout";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type RootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Dialog.Root>,
  "modal"
> &
  React.ComponentPropsWithoutRef<typeof Stack> & {
    portal?: {
      enabled?: boolean;
      container?: HTMLElement;
    };
  };

type RootRef = React.ElementRef<typeof Dialog.Content>;

const Root = React.forwardRef<RootRef, RootProps>(
  (
    {
      portal = { enabled: true, container: null },
      open,
      onOpenChange,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const Portal = portal.enabled ? Dialog.Portal : React.Fragment;
    return (
      <Dialog.Root onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Portal container={portal.container} forceMount>
              <Dialog.Overlay asChild>
                <Box
                  as={motion.div}
                  onClick={() => onOpenChange?.(false)}
                  initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                  animate={{ backdropFilter: "blur(4px)", opacity: 1 }}
                  exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                  transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                  className="fixed inset-0 bg-alpha-black-4 z-overlay"
                />
              </Dialog.Overlay>
              <Dialog.Content
                onEscapeKeyDown={() => onOpenChange?.(false)}
                onPointerDownOutside={() => onOpenChange?.(false)}
                ref={forwardedRef}
                asChild
              >
                <Stack
                  className={clsx(
                    "absolute z-modal top-0 left-1/2 transform -translate-x-1/2 max-h-[calc(100vh-var(--tgph-spacing-32))] shadow-1",
                    className,
                  )}
                  direction="column"
                  as={motion.div}
                  bg="surface-1"
                  rounded="4"
                  my="16"
                  initial={{ scale: 0.8, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                  border
                >
                  {props.children}
                </Stack>
              </Dialog.Content>
            </Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  },
);

type ContentProps = React.ComponentPropsWithoutRef<typeof Box>;
type ContentRef = HTMLDivElement;

const Content: React.FC<typeof Box> = React.forwardRef<
  ContentRef,
  ContentProps
>(({ p = "4", className, ...props }, forwardedRef) => {
  return (
    <Box
      className={clsx(className, "overflow-y-auto")}
      p={p}
      {...props}
      ref={forwardedRef}
    />
  );
});

const Modal = {} as {
  Root: typeof Root;
  Content: typeof Content;
};

Object.assign(Modal, {
  Root,
  Content,
});

export { Modal };
