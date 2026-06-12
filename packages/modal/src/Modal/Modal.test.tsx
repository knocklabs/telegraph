import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./Modal";
import { ModalStackingProvider } from "./ModalStacking";
import type {
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
} from "./index";

const TestModal = ({
  a11yTitle = "Settings",
  open = true,
  onOpenChange = vi.fn(),
  onEscapeKeyDown,
}: {
  a11yTitle?: string;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  return (
    <Modal.Root
      open={open}
      onOpenChange={onOpenChange}
      a11yTitle={a11yTitle}
      a11yDescription="Configure notification settings"
    >
      <Modal.Content onEscapeKeyDown={onEscapeKeyDown}>
        <Modal.Header>
          <Modal.Heading>{a11yTitle}</Modal.Heading>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>Modal body</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

describe("Modal", () => {
  it("renders an accessible dialog with hidden title and description", async () => {
    render(<TestModal />);

    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAccessibleDescription(
      "Configure notification settings",
    );
    expect(screen.getByText("Modal body")).toBeInTheDocument();
  });

  it("calls onOpenChange when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestModal onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Close Modal" }));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("dedupes repeated uncontrolled open changes before rerender", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal.Root
        defaultOpen
        onOpenChange={onOpenChange}
        a11yTitle="Settings"
        a11yDescription="Configure notification settings"
      >
        <Modal.Content>
          <Modal.Header>
            <Modal.Heading>Settings</Modal.Heading>
            <Modal.Close />
          </Modal.Header>
          <Modal.Body>Modal body</Modal.Body>
        </Modal.Content>
      </Modal.Root>,
    );

    await user.dblClick(screen.getByRole("button", { name: "Close Modal" }));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps the modal open when escape dismissal is prevented", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
      event.preventDefault();
    });
    render(
      <TestModal
        onOpenChange={onOpenChange}
        onEscapeKeyDown={onEscapeKeyDown}
      />,
    );

    await user.keyboard("{Escape}");

    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("calls onOpenChange when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestModal onOpenChange={onOpenChange} />);

    const overlay = document.querySelector("[data-tgph-modal-overlay]");
    expect(overlay).toBeInTheDocument();

    await user.click(overlay as HTMLElement);

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("only closes the top layer when stacked modals receive escape", async () => {
    const user = userEvent.setup();
    const onFirstOpenChange = vi.fn();
    const onSecondOpenChange = vi.fn();

    render(
      <ModalStackingProvider>
        <TestModal a11yTitle="First modal" onOpenChange={onFirstOpenChange} />
        <TestModal a11yTitle="Second modal" onOpenChange={onSecondOpenChange} />
      </ModalStackingProvider>,
    );

    await waitFor(() => {
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    });

    await user.keyboard("{Escape}");

    expect(onSecondOpenChange).toHaveBeenCalledTimes(1);
    expect(onSecondOpenChange).toHaveBeenCalledWith(false);
    expect(onFirstOpenChange).not.toHaveBeenCalled();
  });

  it("only closes the top layer when stacked modals receive backdrop clicks", async () => {
    const user = userEvent.setup();
    const onFirstOpenChange = vi.fn();
    const onSecondOpenChange = vi.fn();

    render(
      <ModalStackingProvider>
        <TestModal a11yTitle="First modal" onOpenChange={onFirstOpenChange} />
        <TestModal a11yTitle="Second modal" onOpenChange={onSecondOpenChange} />
      </ModalStackingProvider>,
    );

    await waitFor(() => {
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    });

    const overlay = document.querySelector("[data-tgph-modal-overlay]");
    expect(overlay).toBeInTheDocument();

    await user.click(overlay as HTMLElement);

    expect(onSecondOpenChange).toHaveBeenCalledTimes(1);
    expect(onSecondOpenChange).toHaveBeenCalledWith(false);
    expect(onFirstOpenChange).not.toHaveBeenCalled();
  });

  it("does not suppress the next escape after a stacked backdrop dismissal", async () => {
    const user = userEvent.setup();

    const StatefulStackedModals = () => {
      const [firstOpen, setFirstOpen] = useState(true);
      const [secondOpen, setSecondOpen] = useState(true);

      return (
        <ModalStackingProvider>
          <TestModal
            a11yTitle="First modal"
            open={firstOpen}
            onOpenChange={setFirstOpen}
          />
          <TestModal
            a11yTitle="Second modal"
            open={secondOpen}
            onOpenChange={setSecondOpen}
          />
        </ModalStackingProvider>
      );
    };

    render(<StatefulStackedModals />);

    await waitFor(() => {
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
    });

    const overlay = document.querySelector("[data-tgph-modal-overlay]");
    expect(overlay).toBeInTheDocument();

    await user.click(overlay as HTMLElement);

    await waitFor(() => {
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(0);
    });
  });

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
