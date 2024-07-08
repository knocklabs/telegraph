import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@telegraph/button";
import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type RootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Dialog.Root>,
  "modal"
> &
  TgphComponentProps<typeof Stack> & {
    a11yTitle: string;
    a11yDescription?: string;
  };

const Root = ({
  defaultOpen,
  open,
  onOpenChange,
  a11yTitle,
  a11yDescription,
  className,
  children,
  ...props
}: RootProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      <VisuallyHidden.Root>
        <Dialog.Title>{a11yTitle}</Dialog.Title>
        {a11yDescription && (
          <Dialog.Description>{a11yDescription}</Dialog.Description>
        )}
      </VisuallyHidden.Root>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Overlay>
              <Box
                as={motion.div}
                onClick={() => onOpenChange?.(false)}
                initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                animate={{ backdropFilter: "blur(4px)", opacity: 1 }}
                exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                className="fixed inset-0 bg-alpha-black-4 z-overlay"
              />
              <Stack
                className={clsx(
                  "fixed z-modal top-0 left-1/2 -translate-x-1/2",
                  "w-full",
                  "max-h-[calc(100vh-var(--tgph-spacing-32))] max-w-[calc(100vw-var(--tgph-spacing-8))]",
                )}
              >
                <Stack
                  className={clsx("shadow-1", className)}
                  direction="column"
                  as={motion.div}
                  my="16"
                  initial={{ scale: 0.8, opacity: 0, y: -20, x: "-50%" }}
                  animate={{ scale: 1, opacity: 1, y: 0, x: "-50%" }}
                  exit={{ scale: 0.8, opacity: 0, y: -20, x: "-50%" }}
                  transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                  maxW={props.maxW ?? "140"}
                  w={props.w ?? "full"}
                  bg="surface-1"
                  border
                  rounded="4"
                  {...props}
                >
                  {children}
                </Stack>
              </Stack>
            </Dialog.Overlay>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

type ContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content>;
type ContentRef = React.ElementRef<typeof Dialog.Content>;

const Content = React.forwardRef<ContentRef, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Dialog.Content ref={forwardedRef} {...props} asChild>
        <Stack direction="column">{children}</Stack>
      </Dialog.Content>
    );
  },
);

type CloseProps<T extends TgphElement> = TgphComponentProps<typeof Button<T>> &
  Omit<React.ComponentPropsWithoutRef<typeof Dialog.Close>, "color">;
const Close = <T extends TgphElement>({
  size = "1",
  variant = "ghost",
  ...props
}: CloseProps<T>) => {
  return (
    <Dialog.Close asChild>
      <Button
        icon={{ icon: Lucide.X, alt: "Close Modal" }}
        variant={variant}
        size={size}
        {...props}
      />
    </Dialog.Close>
  );
};

type BodyProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Stack>;

const Body = <T extends TgphElement>({ children, ...props }: BodyProps<T>) => {
  return (
    <Stack direction="column" px="6" py="4" {...props}>
      {children}
    </Stack>
  );
};

type HeaderProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Stack>;

const Header = <T extends TgphElement>({
  children,
  ...props
}: HeaderProps<T>) => {
  return (
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      px="6"
      py="4"
      borderBottom="px"
      {...props}
    >
      {children}
    </Stack>
  );
};

type FooterProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Stack>;

const Footer = <T extends TgphElement>({
  children,
  ...props
}: FooterProps<T>) => {
  return (
    <Stack
      direction="row"
      align="center"
      justify="flex-end"
      gap="2"
      px="6"
      py="4"
      borderTop="px"
      {...props}
    >
      {children}
    </Stack>
  );
};

const Modal = {} as {
  Root: typeof Root;
  Content: typeof Content;
  Close: typeof Close;
  Body: typeof Body;
  Header: typeof Header;
  Footer: typeof Footer;
};

Object.assign(Modal, {
  Root,
  Content,
  Close,
  Body,
  Header,
  Footer,
});

export { Modal };
