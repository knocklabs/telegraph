import * as Dialog from "@radix-ui/react-dialog";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { FocusScope } from "@radix-ui/react-focus-scope";
import * as Portal from "@radix-ui/react-portal";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@telegraph/button";
import { RefToTgphRef } from "@telegraph/helpers";
import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

import { useModalStacking } from "./ModalStacking";

type RootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Dialog.Root>,
  "modal"
> &
  React.ComponentPropsWithoutRef<typeof FocusScope> &
  TgphComponentProps<typeof Stack> & {
    a11yTitle: string;
    a11yDescription?: string;
    layer?: number;
  };

const Root = ({
  defaultOpen: defaultOpenProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: RootProps) => {
  const [open, onOpenChange] = useControllableState({
    prop: openProp,
    onChange: onOpenChangeProp,
    defaultProp: defaultOpenProp ?? false,
  });

  const stacking = useModalStacking();
  const id = props.a11yTitle;

  React.useEffect(() => {
    if (!open && stacking.layers.includes(id)) {
      stacking.removeLayer(id);
    }
  }, [id, stacking, open]);

  // Prevent rendering anything within the modal if it is not open
  if (!open) return;

  return <RootComponent open={open} onOpenChange={onOpenChange} {...props} />;
};

type RootComponentProps = RootProps & {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const RootComponent = ({
  open,
  onOpenChange,
  a11yTitle,
  a11yDescription,
  children,
  // Focus scope props
  trapped,
  onMountAutoFocus,
  onUnmountAutoFocus,
  ...props
}: RootComponentProps) => {
  // We use the a11yTitle as the id for the modal as it is unique
  // and can be used to identify the modal in the stacking context.
  // Without the need to generate a random id and manage between
  // different modal rendering patterns.
  const id = a11yTitle;
  const stacking = useModalStacking();
  React.useEffect(() => {
    if (!stacking || !open || stacking.layers.includes(id)) return;
    stacking.addLayer(id);
  }, [id, stacking, open]);

  const layer = stacking.layers?.indexOf(id) || 0;
  const layersLength = stacking.layers?.length || 0;
  const isStacked = layer !== 0;
  const isTopLayer = id === stacking.layers[stacking.layers.length - 1];

  return (
    <DismissableLayer
      onEscapeKeyDown={(event) => {
        if (!isTopLayer) return;
        event.preventDefault();
        stacking.removeTopLayer();
        onOpenChange(false);
      }}
      onPointerDownOutside={(event) => {
        if (!isTopLayer) return;
        event.preventDefault();
        stacking.removeTopLayer();
        onOpenChange(false);
      }}
    >
      <Dialog.Root
        open={open}
        onOpenChange={(value) => {
          const hasLayers = stacking?.layers?.length > 0;

          if (hasLayers) {
            if (
              value === false &&
              id === stacking.layers[stacking.layers.length - 1]
            ) {
              stacking.removeLayer(id);
              return onOpenChange(false);
            }
            // If the modal is not the top layer, do not call onOpenChange
            // when we are stacking the modals
            return;
          }

          onOpenChange(value);
        }}
        key={id}
      >
        <VisuallyHidden.Root>
          <Dialog.Title>{a11yTitle}</Dialog.Title>
          {a11yDescription && (
            <Dialog.Description>{a11yDescription}</Dialog.Description>
          )}
        </VisuallyHidden.Root>
        <AnimatePresence>
          {open && (
            // We add the className "tgph" here so that styles within
            // the portal get scoped properly to telegraph
            <Portal.Root className="tgph">
              <Overlay layer={layer}>
                <FocusScope
                  trapped={typeof trapped === "boolean" ? trapped : isTopLayer}
                  onMountAutoFocus={onMountAutoFocus}
                  onUnmountAutoFocus={onUnmountAutoFocus}
                  asChild
                >
                  <RefToTgphRef>
                    <Stack
                      as={motion.div}
                      initial={{
                        top: `calc(var(--tgph-spacing-16) + var(--tgph-spacing-4) * ${layersLength - 1})`,
                      }}
                      animate={{
                        top: isStacked
                          ? `calc(var(--tgph-spacing-16) + var(--tgph-spacing-4) * ${layer} )`
                          : "var(--tgph-spacing-16)",
                      }}
                      exit={{ top: 0 }}
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      w="full"
                      justify="center"
                      style={{
                        position: "fixed",
                        left: 0,
                        maxHeight: "calc(100vh - var(--tgph-spacing-32))",
                        maxWidth: "calc(100vw - var(--tgph-spacing-8))",
                        zIndex: `calc(var(--tgph-zIndex-modal) + ${layer})`,
                      }}
                      key={`container-${id}`}
                    >
                      <Stack
                        direction="column"
                        as={motion.div}
                        animate={{
                          scale: 1.02 - Math.abs(layersLength - layer) * 0.02,
                          transformOrigin: "center center",
                        }}
                        transition={{
                          duration: 0.2,
                          bounce: 0,
                          type: "spring",
                        }}
                        maxW={props.maxW ?? "160"}
                        w={props.w ?? "full"}
                        bg="surface-1"
                        border="px"
                        rounded="4"
                        shadow="3"
                        key={`content-${id}`}
                        {...props}
                      >
                        {children}
                      </Stack>
                    </Stack>
                  </RefToTgphRef>
                </FocusScope>
              </Overlay>
            </Portal.Root>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </DismissableLayer>
  );
};

type OverlayProps = TgphComponentProps<typeof Box> & {
  layer: number;
};

const Overlay = ({ layer, children }: OverlayProps) => {
  // If the layer is greater than 0, we don't want to show this
  // overlay as to not stack the overlays on top of each other.
  if (layer > 0) return children;
  return (
    <Dialog.Overlay>
      <Box
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, bounce: 0, type: "spring" }}
        bg="alpha-black-6"
        w="full"
        h="full"
        zIndex="overlay"
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
      <Dialog.Content ref={forwardedRef} asChild {...props}>
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
        icon={{ icon: X, alt: "Close Modal" }}
        variant={variant}
        size={size}
        {...props}
      />
    </Dialog.Close>
  );
};

type BodyProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Stack>;

const Body = <T extends TgphElement>({
  style,
  children,
  ...props
}: BodyProps<T>) => {
  return (
    <Stack
      direction="column"
      px="6"
      py="4"
      style={{
        overflowY: "auto",
        ...style,
      }}
      {...props}
    >
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
