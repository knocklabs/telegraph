import * as Dialog from "@radix-ui/react-dialog";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
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

type Child = {
  id?: string;
  open?: boolean;
};

const ModalContext = React.createContext<{
  child?: Child;
  setChild: (child: Child) => void;
}>({
  child: undefined,
  setChild: () => {},
});

const Root = ({
  defaultOpen: defaultOpenProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  a11yTitle,
  a11yDescription,
  children,
  ...props
}: RootProps) => {
  const id = React.useId();
  const [child, setChild] = React.useState<Child | undefined>(undefined);

  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpenProp,
    prop: openProp,
    onChange: onOpenChangeProp,
  });

  const parentContext = React.useContext(ModalContext);

  React.useEffect(() => {
    if (parentContext) {
      parentContext.setChild({
        id,
        open,
        // depth: !child?.depth ? 1 : child?.depth + 1,
        // depth: !parentContext.child?.depth
        //   ? 1
        //   : parentContext?.child?.depth + 1,
      });
    }
  }, [parentContext, id, open]);

  const isStacked = !!child?.id && child?.open === true;
  const isChild = parentContext?.child;
  const isParent = parentContext?.child === undefined;

  const DerivedOverlayComponent = isChild ? React.Fragment : Overlay;

  return (
    <ModalContext.Provider value={{ child, setChild }}>
      <DismissableLayer
        onEscapeKeyDown={(event) => {
          if (open) {
            event.preventDefault();
            onOpenChange?.(false);
          }
        }}
      >
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <VisuallyHidden.Root>
            <Dialog.Title>{a11yTitle}</Dialog.Title>
            {a11yDescription && (
              <Dialog.Description>{a11yDescription}</Dialog.Description>
            )}
          </VisuallyHidden.Root>
          <AnimatePresence>
            {open && (
              <DerivedOverlayComponent>
                <Stack
                  as={motion.div}
                  initial={{ top: isParent ? "var(--tgph-spacing-4)" : 0 }}
                  animate={{ top: isStacked ? "0" : "var(--tgph-spacing-4)" }}
                  exit={{ top: "var(--tgph-spacing-4)" }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  zIndex="modal"
                  w="full"
                  justify="center"
                  // align="flex-start"
                  style={{
                    position: "fixed",
                    left: 0,
                    // right: 0,
                    // bottom: 0,
                    // top: 0,
                    // left: "50%",
                    top: isParent ? "var(--tgph-spacing-12)" : 0,
                    maxHeight: "calc(100vh - var(--tgph-spacing-32))",
                    maxWidth: "calc(100vw - var(--tgph-spacing-8))",
                  }}
                  key={"container" + id}
                >
                  <Stack
                    direction="column"
                    as={motion.div}
                    // my={isChild ? "4" : "16"}
                    animate={{
                      scale: isChild ? 1.02 : 0.98,
                      y: isStacked ? "calc(var(--tgph-spacing-4) * 1)" : "0",
                      // marginTop: "var(--tgph-spacing-3)",
                      // transform: isChild
                      //   ? "scale(1.02) "
                      //   : " scale(0.98) translateY(16px)",

                      transformOrigin: "center center",
                    }}
                    // initial={{ scale: 0.8, opacity: 0, y: -20 }}
                    // animate={{ scale: 1, opacity: 1, y: 0 }}
                    // exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, bounce: 0, type: "spring" }}
                    maxW={props.maxW ?? "160"}
                    w={props.w ?? "full"}
                    bg="surface-1"
                    border="px"
                    rounded="4"
                    shadow="3"
                    key={"content" + id}
                    {...props}
                  >
                    {children}
                  </Stack>
                </Stack>
              </DerivedOverlayComponent>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </DismissableLayer>
    </ModalContext.Provider>
  );
};

type OverlayProps = TgphComponentProps<typeof Box>;

const Overlay = ({ children }: OverlayProps) => {
  return (
    <Dialog.Overlay>
      <Box
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, bounce: 0, type: "spring" }}
        bg="alpha-black-6"
        zIndex="overlay"
        w="full"
        h="full"
        style={{
          position: "fixed",
          cursor: "pointer",
          inset: "0px",
        }}
      />
      {children}
    </Dialog.Overlay>
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
