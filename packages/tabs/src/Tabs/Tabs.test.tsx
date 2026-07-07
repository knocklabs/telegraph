import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "../index";

const TabsFixture = () => {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
        <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
        <Tabs.Tab value="tab3" disabled>
          Disabled Tab
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="tab1">First panel</Tabs.Panel>
      <Tabs.Panel value="tab2">Second panel</Tabs.Panel>
      <Tabs.Panel value="tab3">Disabled panel</Tabs.Panel>
    </Tabs>
  );
};

describe("Tabs", () => {
  it("renders the default tab with Telegraph and Radix-compatible state attributes", () => {
    render(<TabsFixture />);

    const activeTab = screen.getByRole("tab", { name: "First Tab" });

    expect(activeTab).toHaveAttribute("data-tgph-tab", "");
    expect(activeTab).toHaveAttribute("data-active", "");
    expect(activeTab).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
  });

  it("supports controlled values and change callbacks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const ControlledTabs = () => {
      const [value, setValue] = useState("tab1");

      return (
        <Tabs
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
            <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tab1">First panel</Tabs.Panel>
          <Tabs.Panel value="tab2">Second panel</Tabs.Panel>
        </Tabs>
      );
    };

    render(<ControlledTabs />);

    await user.click(screen.getByRole("tab", { name: "Second Tab" }));

    expect(onValueChange).toHaveBeenCalledWith("tab2");
    expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });

  it("does not forward Base UI-only cleared selection changes", async () => {
    const onValueChange = vi.fn();

    render(
      <Tabs defaultValue="missing-tab" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="tab1" disabled>
            First Tab
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
      </Tabs>,
    );

    await waitFor(() => {
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  it("does not auto-select a tab when no default or controlled value is provided", () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
          <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
        <Tabs.Panel value="tab2">Second panel</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
      "data-state",
      "inactive",
    );
    expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
      "data-state",
      "inactive",
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("does not activate disabled tabs", async () => {
    const user = userEvent.setup();

    render(<TabsFixture />);

    const disabledTab = screen.getByRole("tab", { name: "Disabled Tab" });
    await user.click(disabledTab);

    expect(disabledTab).toHaveAttribute("data-disabled", "");
    expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
  });

  it("activates tabs with arrow-key focus by default", async () => {
    const user = userEvent.setup();

    render(<TabsFixture />);

    screen.getByRole("tab", { name: "First Tab" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });

  it("respects disabled keyboard looping", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab2">
        <Tabs.List loop={false}>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
          <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
        <Tabs.Panel value="tab2">Second panel</Tabs.Panel>
      </Tabs>,
    );

    screen.getByRole("tab", { name: "Second Tab" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });

  it("keeps forceBackgroundMount panels mounted and hidden while inactive", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
          <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
        <Tabs.Panel value="tab2" forceBackgroundMount="once">
          Second panel
        </Tabs.Panel>
      </Tabs>,
    );

    const inactivePanel = screen
      .getByText("Second panel")
      .closest("[data-tgph-tab-panel]");

    expect(inactivePanel).toHaveAttribute("data-state", "inactive");
    expect(inactivePanel).toHaveAttribute("hidden");
    expect(inactivePanel).toHaveAttribute("aria-hidden", "true");
    expect(inactivePanel).toHaveStyle({
      height: "0px",
      overflow: "hidden",
      visibility: "hidden",
    });

    await user.click(screen.getByRole("tab", { name: "Second Tab" }));

    expect(inactivePanel).toHaveAttribute("data-state", "active");
    expect(inactivePanel).not.toHaveAttribute("hidden");
    expect(inactivePanel).not.toHaveAttribute("aria-hidden");
    expect(inactivePanel).toHaveStyle({
      height: "auto",
      overflow: "visible",
      visibility: "visible",
    });
  });

  it("forwards tgphRef through Base UI render props", () => {
    const rootRef = createRef<HTMLDivElement>();
    const tabRef = createRef<HTMLButtonElement>();

    render(
      <Tabs defaultValue="tab1" data-testid="tabs-root" tgphRef={rootRef}>
        <Tabs.List>
          <Tabs.Tab value="tab1" tgphRef={tabRef}>
            First Tab
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
      </Tabs>,
    );

    expect(rootRef.current).toBe(screen.getByTestId("tabs-root"));
    expect(tabRef.current).toBe(screen.getByRole("tab", { name: "First Tab" }));
  });
});
