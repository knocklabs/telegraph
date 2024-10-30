import * as Dialog from "@radix-ui/react-dialog";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@telegraph/button";
import type { Required } from "@telegraph/helpers";
import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { DismissableWrapper } from "./Modal.helpers";
import { useModalStacking } from "./ModalStacking";

type RootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Dialog.Root>,
  "modal"
> &
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
    defaultProp: defaultOpenProp,
  });

  // Prevent rendering anything within the modal if it is not open
  if (!open) return;

  return <RootComponent open={open} onOpenChange={onOpenChange} {...props} />;
};

const RootComponent = ({
  open,
  onOpenChange,
  a11yTitle,
  a11yDescription,
  children,
  layer: layerProp,
  ...props
}: Required<RootProps, "open" | "onOpenChange">) => {
  const id = React.useId();
  const stacking = useModalStacking();

  React.useEffect(() => {
    if (!stacking || !open || stacking.layers.includes(id)) return;
    stacking.addLayer(id, { layer: layerProp });
  }, [id, layerProp, stacking, open]);

  const layer = stacking.layers?.indexOf(id) || 0;
  const layersLength = stacking.layers?.length || 0;
  const isStacked = layer !== 0;

  return (
    <DismissableWrapper
      id={id}
      layers={stacking.layers}
      onEscapeKeyDown={(event) => {
        event.preventDefault();
        stacking.removeTopLayer();
        onOpenChange(false);
      }}
      onPointerDownOutside={(event) => {
        event.preventDefault();
        stacking.removeTopLayer();
        onOpenChange(false);
      }}
    >
      <Dialog.Root
        open={open}
        onOpenChange={(value) => {
          const hasStacking = !!stacking;

          if (hasStacking) {
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
            <Overlay layer={layer}>
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
                  transition={{ duration: 0.2, bounce: 0, type: "spring" }}
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
            </Overlay>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </DismissableWrapper>
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
      <FocusScope trapped={true}>
        <Dialog.Content ref={forwardedRef} asChild {...props}>
          <Stack direction="column" h="full" {...props}>
            {children}
          </Stack>
        </Dialog.Content>
      </FocusScope>
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
