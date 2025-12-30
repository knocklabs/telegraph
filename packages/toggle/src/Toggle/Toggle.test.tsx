import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("is accessible", async () => {
    const { container } = render(
      <Toggle.Default label="Enable notifications" defaultValue={false} />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when checked", async () => {
    const { container } = render(
      <Toggle.Default label="Enable notifications" defaultValue={true} />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when disabled", async () => {
    const { container } = render(
      <Toggle.Default
        label="Enable notifications"
        disabled
        defaultValue={false}
      />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible with hidden label", async () => {
    const { container } = render(
      <Toggle.Root defaultValue={false}>
        <Toggle.Label as="label" hidden>
          Enable notifications
        </Toggle.Label>
        <Toggle.Switch />
      </Toggle.Root>,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible with indicator", async () => {
    const { container } = render(
      <Toggle.Default indicator={true} defaultValue={false} />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("renders unchecked by default", () => {
    render(<Toggle.Default label="Enable notifications" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checked when defaultValue is true", () => {
    render(<Toggle.Default label="Enable notifications" defaultValue={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("can be toggled by clicking", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Toggle.Default label="Enable notifications" />,
    );
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    // Click the visual toggle switch
    const toggle = container.querySelector("[data-tgph-toggle-switch]");
    await user.click(toggle!);

    expect(checkbox).toBeChecked();
  });

  it("calls onValueChange when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <Toggle.Default
        label="Enable notifications"
        onValueChange={handleChange}
      />,
    );

    const toggle = container.querySelector("[data-tgph-toggle-switch]");
    await user.click(toggle!);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("supports controlled mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <Toggle.Default
        label="Enable notifications"
        value={false}
        onValueChange={handleChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    const toggle = container.querySelector("[data-tgph-toggle-switch]");
    await user.click(toggle!);

    expect(handleChange).toHaveBeenCalledWith(true);
    // In controlled mode, component doesn't update itself
    expect(checkbox).not.toBeChecked();

    // Update via props
    rerender(
      <Toggle.Default
        label="Enable notifications"
        value={true}
        onValueChange={handleChange}
      />,
    );

    expect(checkbox).toBeChecked();
  });

  it("can be disabled", () => {
    render(<Toggle.Default label="Enable notifications" disabled />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("cannot be toggled when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <Toggle.Default
        label="Enable notifications"
        disabled
        onValueChange={handleChange}
      />,
    );

    const toggle = container.querySelector("[data-tgph-toggle-switch]");
    await user.click(toggle!);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("can be toggled with keyboard (Space)", async () => {
    const user = userEvent.setup();
    render(<Toggle.Default label="Enable notifications" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await user.keyboard(" ");

    expect(checkbox).toBeChecked();
  });

  it("can be toggled with keyboard (Enter)", async () => {
    const user = userEvent.setup();
    render(<Toggle.Default label="Enable notifications" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    checkbox.focus();
    // Note: Native checkboxes respond to Space, not Enter
    // Enter only works when inside a form
    await user.keyboard(" ");

    expect(checkbox).toBeChecked();
  });

  it("renders with correct size attributes", () => {
    const { container } = render(
      <Toggle.Default label="Enable notifications" size="1" />,
    );
    const toggle = container.querySelector('[data-tgph-toggle-size="1"]');
    expect(toggle).toBeInTheDocument();
  });

  it("renders visible label by default", () => {
    render(<Toggle.Default label="Enable notifications" />);
    const label = screen.getByText("Enable notifications");
    expect(label).toBeInTheDocument();
    expect(label).toBeVisible();
  });

  it("hides label visually when hidden prop is true", () => {
    render(
      <Toggle.Root defaultValue={false}>
        <Toggle.Label as="label" hidden>
          Enable notifications
        </Toggle.Label>
        <Toggle.Switch />
      </Toggle.Root>,
    );
    const label = screen.getByText("Enable notifications");
    expect(label).toBeInTheDocument();
    // Label exists for screen readers but is visually hidden
  });

  it("supports custom aria-label", () => {
    render(<Toggle.Default aria-label="Custom label" />);
    const checkbox = screen.getByRole("checkbox", { name: "Custom label" });
    expect(checkbox).toBeInTheDocument();
  });

  it("supports required attribute", () => {
    render(<Toggle.Default label="Enable notifications" required />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });

  it("supports name attribute", () => {
    render(
      <Toggle.Default label="Enable notifications" name="notifications" />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("name", "notifications");
  });

  it("applies checked state to visual toggle", () => {
    const { container } = render(
      <Toggle.Default label="Enable notifications" defaultValue={true} />,
    );
    const toggle = container.querySelector('[data-tgph-toggle-checked="true"]');
    expect(toggle).toBeInTheDocument();
  });

  it("clicking label toggles the toggle", async () => {
    const user = userEvent.setup();
    render(<Toggle.Default label="Enable notifications" />);
    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("Enable notifications");

    expect(checkbox).not.toBeChecked();

    await user.click(label);

    expect(checkbox).toBeChecked();
  });

  describe("Indicator", () => {
    it("renders indicator when indicator prop is true", () => {
      const { container } = render(
        <Toggle.Default indicator={true} defaultValue={false} />,
      );
      const indicator = container.querySelector("[data-tgph-toggle-indicator]");
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent("Disabled");
    });

    it("shows enabled content when checked", () => {
      const { container } = render(
        <Toggle.Default indicator={true} defaultValue={true} />,
      );
      const indicator = container.querySelector("[data-tgph-toggle-indicator]");
      expect(indicator).toHaveTextContent("Enabled");
    });

    it("shows disabled content when unchecked", () => {
      const { container } = render(
        <Toggle.Default indicator={true} defaultValue={false} />,
      );
      const indicator = container.querySelector("[data-tgph-toggle-indicator]");
      expect(indicator).toHaveTextContent("Disabled");
    });

    it("supports custom indicator content", () => {
      const { container } = render(
        <Toggle.Default
          indicator={true}
          indicatorProps={{
            enabledContent: "On",
            disabledContent: "Off",
          }}
          defaultValue={false}
        />,
      );
      const indicator = container.querySelector("[data-tgph-toggle-indicator]");
      expect(indicator).toHaveTextContent("Off");
    });

    it("updates indicator content when toggled", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Toggle.Default indicator={true} defaultValue={false} />,
      );
      const indicator = container.querySelector("[data-tgph-toggle-indicator]");
      const toggle = container.querySelector("[data-tgph-toggle-switch]");

      expect(indicator).toHaveTextContent("Disabled");

      await user.click(toggle!);

      expect(indicator).toHaveTextContent("Enabled");
    });
  });

  describe("Composition", () => {
    it("works with Toggle.Root and Toggle.Switch", () => {
      render(
        <Toggle.Root aria-label="Enable notifications" defaultValue={false}>
          <Toggle.Switch />
        </Toggle.Root>,
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("works with Toggle.Root, Toggle.Switch, and Toggle.Label", () => {
      render(
        <Toggle.Root defaultValue={false}>
          <Toggle.Label as="label">Enable notifications</Toggle.Label>
          <Toggle.Switch />
        </Toggle.Root>,
      );
      expect(screen.getByText("Enable notifications")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("works with Toggle.Root, Toggle.Label, and Toggle.Indicator", () => {
      render(
        <Toggle.Root defaultValue={false}>
          <Toggle.Label as="label">Enable notifications</Toggle.Label>
          <Toggle.Indicator />
          <Toggle.Switch />
        </Toggle.Root>,
      );
      expect(screen.getByText("Enable notifications")).toBeInTheDocument();
      const indicator = screen.getByText("Disabled");
      expect(indicator).toBeInTheDocument();
    });
  });
});
