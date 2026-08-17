import { Stack } from "@telegraph/layout";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  useState,
} from "react";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "../index";

type CustomLinkProps = ComponentPropsWithoutRef<"a"> & {
  tgphRef?: Ref<HTMLAnchorElement>;
};

const CustomLink = ({ tgphRef, ...props }: CustomLinkProps) => (
  // Children reach the anchor through the spread, which the rule cannot see.
  // oxlint-disable-next-line jsx-a11y/anchor-has-content
  <a ref={tgphRef} {...props} />
);

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

  it("matches Base UI semantics for Motion button and div tabs", () => {
    const errors: Array<unknown> = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => errors.push(args[0]));

    try {
      render(
        <Tabs defaultValue="button">
          <Tabs.List>
            <Tabs.Tab
              as={motion.button}
              value="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
            >
              Motion button
            </Tabs.Tab>
            <Tabs.Tab
              as={motion.div}
              value="div"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
            >
              Motion div
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="button">Button panel</Tabs.Panel>
          <Tabs.Panel value="div">Div panel</Tabs.Panel>
        </Tabs>,
      );

      const buttonTab = screen.getByRole("tab", { name: "Motion button" });
      const divTab = screen.getByRole("tab", { name: "Motion div" });

      expect(buttonTab.tagName).toBe("BUTTON");
      expect(divTab.tagName).toBe("DIV");
      expect(buttonTab).toHaveStyle({ opacity: "0" });
      expect(divTab).toHaveStyle({ opacity: "0" });
      expect(buttonTab).not.toHaveAttribute("initial");
      expect(divTab).not.toHaveAttribute("initial");
      expect(
        errors.filter((error) => String(error).includes("nativeButton")),
      ).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("honors nativeButton for an opaque non-button tab", () => {
    const errors: Array<unknown> = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => errors.push(args[0]));

    try {
      render(
        <Tabs defaultValue="docs">
          <Tabs.List>
            <Tabs.Tab
              as={CustomLink}
              href="/docs"
              nativeButton={false}
              value="docs"
            >
              Docs
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="docs">Docs panel</Tabs.Panel>
        </Tabs>,
      );

      const tab = screen.getByRole("tab", { name: "Docs" });

      expect(tab.tagName).toBe("A");
      expect(tab).toHaveAttribute("href", "/docs");
      expect(tab).not.toHaveAttribute("nativeButton");
      expect(
        errors.filter((error) => String(error).includes("nativeButton")),
      ).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("stacks the tab list above the panel by rendering a vertical Stack", () => {
    render(
      <Tabs defaultValue="tab1" data-testid="tabs-root">
        <Tabs.List>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
      </Tabs>,
    );

    // The root must lay its children out as a column. Previously it rendered a
    // bare Box, so consumers had to pass `as={Stack} direction="column"` — which
    // silently fell back to `row` because Box emits `--flex-direction` while the
    // Stack CSS reads `--direction`.
    const root = screen.getByTestId("tabs-root");
    expect(root).toHaveClass("tgph-stack");
    expect(root).toHaveStyle({ "--direction": "column" });
  });

  it("lets consumers override the stacking direction", () => {
    render(
      <Tabs defaultValue="tab1" direction="row" data-testid="tabs-root">
        <Tabs.List>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First panel</Tabs.Panel>
      </Tabs>,
    );

    expect(screen.getByTestId("tabs-root")).toHaveStyle({
      "--direction": "row",
    });
  });

  it("preserves panel direction when composed with as={Stack}", () => {
    render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1" as={Stack} direction="column">
          First panel
        </Tabs.Panel>
      </Tabs>,
    );

    // Regression (KNO-14080): the Box-based panel consumed `direction` into a
    // custom property the Stack CSS never read, so panels rendered as rows.
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveClass("tgph-stack");
    expect(panel).toHaveStyle({ "--direction": "column" });
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

  it("renders a disabled anchor tab without a Base UI nativeButton error", () => {
    const errors: Array<unknown> = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => errors.push(args[0]));

    try {
      // `disabled` makes `Button` render a native button whatever `as` says, so
      // `nativeButton` has to account for it or Base UI reports the mismatch.
      const { container } = render(
        <Tabs defaultValue="docs">
          <Tabs.List>
            <Tabs.Tab value="docs" as="a" href="/docs" disabled>
              Docs
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>,
      );

      const tab = container.querySelector("[data-tgph-tab]");

      expect(tab?.tagName).toBe("BUTTON");
      // A tab stays focusable while disabled so arrow keys can still reach it,
      // so Base UI marks it with `aria-disabled` rather than the native
      // attribute. The mismatch only shows up in the console.
      expect(tab).toHaveAttribute("aria-disabled", "true");
      expect(
        errors.filter((e) => String(e).includes("nativeButton")),
      ).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("keeps disabled tab coercion native over an explicit override", () => {
    const errors: Array<unknown> = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => errors.push(args[0]));

    try {
      render(
        <Tabs defaultValue="docs">
          <Tabs.List>
            <Tabs.Tab
              value="docs"
              as="a"
              href="/docs"
              disabled
              nativeButton={false}
            >
              Docs
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>,
      );

      const tab = screen.getByRole("tab", { name: "Docs" });

      expect(tab.tagName).toBe("BUTTON");
      expect(
        errors.filter((error) => String(error).includes("nativeButton")),
      ).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
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
