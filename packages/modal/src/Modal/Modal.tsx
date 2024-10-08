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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                bg="alpha-black-6"
                zIndex="overlay"
                style={{
                  position: "fixed",
                  inset: "0px",
                }}
              />
              <Stack
                zIndex="modal"
                w="full"
                style={{
                  position: "fixed",
                  top: 0,
                  left: "50%",
                  maxHeight: "calc(100vh - var(--tgph-spacing-32))",
                  maxWidth: "calc(100vw - var(--tgph-spacing-8))",
                }}
              >
                <Stack
                  direction="column"
                  as={motion.div}
                  my="16"
                  initial={{ scale: 0.8, opacity: 0, y: -20, x: "-50%" }}
                  animate={{ scale: 1, opacity: 1, y: 0, x: "-50%" }}
                  exit={{ scale: 0.8, opacity: 0, y: -20, x: "-50%" }}
                  transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                  maxW={props.maxW ?? "160"}
                  w={props.w ?? "full"}
                  bg="surface-1"
                  border="px"
                  rounded="4"
                  shadow="1"
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

type ContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content> &
  TgphComponentProps<typeof Stack>;
type ContentRef = React.ElementRef<typeof Dialog.Content>;

const Content = React.forwardRef<ContentRef, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Dialog.Content ref={forwardedRef} {...props} asChild>
        <Stack direction="column" h="full" {...props}>
          {children}
        </Stack>
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
