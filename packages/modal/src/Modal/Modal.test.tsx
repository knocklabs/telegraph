import { describe, it } from "vitest";

import { Modal } from "./Modal";
import type {
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
} from "./index";

describe("Modal", () => {
  describe("type inheritance", () => {
    it("accepts valid polymorphic props on Body", () => {
      const validProps: ModalBodyProps<"section"> = {
        as: "section",
      };
      void validProps;
    });

    it("accepts inherited stack/layout props on Body", () => {
      const validProps: ModalBodyProps = {
        gap: "2",
        padding: "4",
        display: "flex",
      };
      void validProps;
    });

    it("accepts inherited stack/layout props on Header", () => {
      const validProps: ModalHeaderProps = {
        gap: "1",
        padding: "2",
      };
      void validProps;
    });

    it("accepts inherited stack/layout props on Footer", () => {
      const validProps: ModalFooterProps = {
        gap: "1",
        padding: "2",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on ModalBodyProps
      const invalidProp: ModalBodyProps = { invalidProp: "invalid" };
      void invalidProp;

      // @ts-expect-error unknown prop rejected on ModalHeaderProps
      const invalidHeaderProp: ModalHeaderProps = { invalidProp: "invalid" };
      void invalidHeaderProp;

      // @ts-expect-error unknown prop rejected on ModalFooterProps
      const invalidFooterProp: ModalFooterProps = { invalidProp: "invalid" };
      void invalidFooterProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Modal.Body JSX
      const invalidBody = <Modal.Body invalidProp="invalid" />;
      void invalidBody;

      // @ts-expect-error unknown prop rejected on Modal.Header JSX
      const invalidHeader = <Modal.Header invalidProp="invalid" />;
      void invalidHeader;

      // @ts-expect-error unknown prop rejected on Modal.Footer JSX
      const invalidFooter = <Modal.Footer invalidProp="invalid" />;
      void invalidFooter;
    });
  });
});
