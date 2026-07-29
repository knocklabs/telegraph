import { Modal } from ".";
import type {
  ModalBodyProps,
  ModalCloseProps,
  ModalContentProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalRootProps,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Modal types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<ModalRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalContentProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalCloseProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalBodyProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalHeaderProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalFooterProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ModalOverlayProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<ModalRootProps["a11yTitle"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["a11yDescription"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["layer"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["trapped"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["open"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["onOpenChange"]>().not.toBeAny();
    expectTypeOf<ModalRootProps["maxW"]>().not.toBeAny();
    expectTypeOf<ModalContentProps["p"]>().not.toBeAny();
    expectTypeOf<ModalContentProps["className"]>().not.toBeAny();
    expectTypeOf<ModalContentProps["onEscapeKeyDown"]>().not.toBeAny();
    expectTypeOf<ModalContentProps["onOpenAutoFocus"]>().not.toBeAny();
    expectTypeOf<ModalContentProps["tgphRef"]>().not.toBeAny();
    expectTypeOf<ModalCloseProps["variant"]>().not.toBeAny();
    expectTypeOf<ModalCloseProps["size"]>().not.toBeAny();
    expectTypeOf<ModalBodyProps["px"]>().not.toBeAny();
    expectTypeOf<ModalHeaderProps["justify"]>().not.toBeAny();
    expectTypeOf<ModalFooterProps["gap"]>().not.toBeAny();
    expectTypeOf<ModalOverlayProps["layer"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Modal.Root
      a11yTitle="Settings"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Content
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Content
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Modal.Close
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Body
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Header
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Footer
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Modal.Heading
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Modal.Root
      // @ts-expect-error a11yTitle is a string
      a11yTitle={42}
    />;
    <Modal.Root
      a11yTitle="Settings"
      // @ts-expect-error open is a boolean
      open="yes"
    />;
    <Modal.Content
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Modal.Close
      // @ts-expect-error not a button size
      size="99"
    />;
    <Modal.Body
      // @ts-expect-error not a spacing token
      px={24}
    />;
    <Modal.Header
      // @ts-expect-error not a justify value
      justify="middle"
    />;
    <Modal.Footer
      // @ts-expect-error not a spacing token
      gap="notAToken"
    />;
  });

  it("rejects `as` on Root", () => {
    // KNO-14501. `Root` renders the animated containers and discards `as`, so
    // the type has to reject it. It accepted it while the cast sat on the
    // parameter rather than in the body.
    <Modal.Root
      a11yTitle="Settings"
      // @ts-expect-error as is not a Modal.Root prop
      as="div"
    />;
  });

  it("accepts valid props", () => {
    <Modal.Root
      a11yTitle="Settings"
      a11yDescription="Update your settings"
      open
      onOpenChange={(open) => open}
      maxW="160"
      w="full"
    >
      <Modal.Content
        p="0"
        className="c"
        style={{ opacity: 1 }}
        aria-label="settings"
        data-testid="modal-content"
        onEscapeKeyDown={() => {}}
      >
        <Modal.Header px="6" py="4">
          <Modal.Heading>Settings</Modal.Heading>
          <Modal.Close variant="ghost" size="1" onClick={() => {}} />
        </Modal.Header>
        <Modal.Body px="6" py="4" gap="2">
          Body
        </Modal.Body>
        <Modal.Footer justify="flex-end" gap="2">
          Footer
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>;
    <Modal.Body as="section" data-testid="body" />;
    <Modal.Header as="header" className="header" />;
    <Modal.Footer as="footer" style={{ opacity: 1 }} />;
    <Modal.Heading as="h3" size="3" weight="medium" />;
  });
});
