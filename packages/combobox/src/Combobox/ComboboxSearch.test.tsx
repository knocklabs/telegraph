import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, useState } from "react";
import { beforeAll, describe, expect, it } from "vitest";

import { Combobox } from "./Combobox";
import {
  doesOptionMatchSearchQuery,
  findStringNodes,
} from "./Combobox.helpers";

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const queryOptions = () =>
  document.querySelectorAll("[data-tgph-combobox-option]");

const Harness = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<string>("");
  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>{children}</Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

const open = async (container: HTMLElement) => {
  const user = userEvent.setup();
  const trigger = container.querySelector("[data-tgph-combobox-trigger]");
  await user.click(trigger!);
  await waitFor(() =>
    expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
  );
  return user;
};

describe("Combobox search matching", () => {
  it("matches text rendered directly in nested children", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Text as="span">kyle@knock.app</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("kyle@knock.app");
    expect(queryOptions().length).toBe(1);
  });

  it("matches a query spanning sibling text nodes", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Stack direction="column">
            <Text as="span">Kyle</Text>
            <Text as="span">McDonald</Text>
          </Stack>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Kyle McDonald");
    expect(queryOptions().length).toBe(1);
  });

  it("matches when inline markup already carries a trailing space", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          Kyle <Text as="span">McDonald</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Kyle McDonald");
    expect(queryOptions().length).toBe(1);
  });

  it("ignores repeated whitespace inside the query", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Text as="span">Kyle McDonald</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Kyle  McDonald");
    expect(queryOptions().length).toBe(1);
  });

  it("ignores surrounding whitespace in the query", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Text as="span">kyle@knock.app</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("  kyle@knock.app  ");
    expect(queryOptions().length).toBe(1);
  });

  it("shows every option when the query is only whitespace", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="a">Alpha</Combobox.Option>
        <Combobox.Option value="b">Beta</Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("   ");
    expect(queryOptions().length).toBe(2);
  });

  it("still filters out options that do not match", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="a">Alpha</Combobox.Option>
        <Combobox.Option value="b">Beta</Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Alph");
    expect(queryOptions().length).toBe(1);
  });

  describe("text rendered by child components", () => {
    // The email exists only in UserRow's render output — unreachable from the
    // element tree. Matching works because each option captures its rendered
    // DOM text while visible and the query is matched against the capture.
    const UserRow = ({ name, email }: { name: string; email: string }) => (
      <Stack direction="column">
        <Text as="span">{name}</Text>
        <Text as="span">{email}</Text>
      </Stack>
    );

    it("matches automatically, with no extra props", async () => {
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <UserRow name="Kyle McDonald" email="kyle@knock.app" />
          </Combobox.Option>
          <Combobox.Option value="u_2">
            <UserRow name="Sam Seely" email="sam@knock.app" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      await user.keyboard("kyle@knock.app");
      expect(queryOptions().length).toBe(1);
    });

    it("re-matches after being filtered out and back", async () => {
      // The capture must survive the option unmounting while filtered out.
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <UserRow name="Kyle McDonald" email="kyle@knock.app" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);

      await user.keyboard("sam");
      expect(queryOptions().length).toBe(0);

      await user.keyboard("{Backspace}{Backspace}{Backspace}kyle");
      expect(queryOptions().length).toBe(1);
    });

    it("matches a query spanning the wrapper's sibling text nodes", async () => {
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <UserRow name="Kyle McDonald" email="kyle@knock.app" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      // "McDonald" and the email are separate DOM nodes inside the wrapper.
      await user.keyboard("McDonald kyle@knock.app");
      expect(queryOptions().length).toBe(1);
    });

    it("does not match across the captured variants' seam", async () => {
      // Captured text has two joining variants ("abcd" and "ab cd"). A query
      // assembled from the end of one and the start of the other ("cd ab")
      // appears in neither and never on screen, so it must not match.
      const Row = () => (
        <Stack direction="column">
          <Text as="span">ab</Text>
          <Text as="span">cd</Text>
        </Stack>
      );

      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <Row />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      await user.keyboard("cd ab");
      expect(queryOptions().length).toBe(0);
    });

    it("re-filters when an option's content changes under an active query", async () => {
      const Cmp = ({ email }: { email: string }) => {
        const [value, setValue] = useState<string>("");
        return (
          <Combobox.Root value={value} onValueChange={setValue}>
            <Combobox.Trigger />
            <Combobox.Content>
              <Combobox.Search />
              <Combobox.Options>
                <Combobox.Option value="u_1">
                  <UserRow name="Kyle McDonald" email={email} />
                </Combobox.Option>
              </Combobox.Options>
            </Combobox.Content>
          </Combobox.Root>
        );
      };

      const { container, rerender } = render(<Cmp email="kyle@knock.app" />);
      const user = await open(container);

      await user.keyboard("knock.app");
      expect(queryOptions().length).toBe(1);

      // The on-screen text stops matching the query; the option must hide
      // without needing another keystroke.
      rerender(<Cmp email="kyle@example.com" />);
      expect(queryOptions().length).toBe(0);
    });
  });

  describe("findStringNodes", () => {
    it("collects numbers as searchable text", () => {
      expect(findStringNodes(<span>{2024}</span>)).toEqual(["2024"]);
      expect(
        doesOptionMatchSearchQuery({
          children: <span>{2024}</span>,
          value: "y",
          searchQuery: "2024",
        }),
      ).toBe(true);
    });

    it("collects a nested zero, which is falsy but still renders", () => {
      expect(findStringNodes(<span>{0}</span>)).toEqual(["0"]);
      expect(
        doesOptionMatchSearchQuery({
          children: <span>{0}</span>,
          value: "y",
          searchQuery: "0",
        }),
      ).toBe(true);
    });
  });

  describe("a controlled Combobox.Search is not treated as an option", () => {
    it("keeps resolving the selected value to the real option's label", async () => {
      const Cmp = () => {
        const [query, setQuery] = useState<string>("");
        return (
          <Combobox.Root value="email">
            <Combobox.Trigger>
              {({ value: resolved }) => (
                <span data-testid="resolved">{JSON.stringify(resolved)}</span>
              )}
            </Combobox.Trigger>
            <Combobox.Content>
              <Combobox.Search value={query} onValueChange={setQuery} />
              <Combobox.Options>
                <Combobox.Option value="email" label="Email" />
              </Combobox.Options>
            </Combobox.Content>
          </Combobox.Root>
        );
      };
      const { container } = render(<Cmp />);
      const user = await open(container);

      // Typing the selected value must not shadow the real option.
      await user.keyboard("email");
      expect(
        document.querySelector('[data-testid="resolved"]')?.textContent,
      ).toBe(JSON.stringify({ value: "email", label: "Email" }));
    });

    it("also excludes a search input wrapped in a consumer component", async () => {
      // The wrapper's element type isn't Search, so the exclusion can't rely
      // on identity alone — the controlled-input signature (value paired with
      // a change handler) is what marks it as a non-option.
      const MySearch = (props: {
        value: string;
        onValueChange: (v: string) => void;
      }) => <Combobox.Search {...props} />;

      const Cmp = () => {
        const [query, setQuery] = useState<string>("");
        return (
          <Combobox.Root value="email">
            <Combobox.Trigger>
              {({ value: resolved }) => (
                <span data-testid="resolved">{JSON.stringify(resolved)}</span>
              )}
            </Combobox.Trigger>
            <Combobox.Content>
              <MySearch value={query} onValueChange={setQuery} />
              <Combobox.Options>
                <Combobox.Option value="email" label="Email" />
              </Combobox.Options>
            </Combobox.Content>
          </Combobox.Root>
        );
      };
      const { container } = render(<Cmp />);
      const user = await open(container);

      await user.keyboard("email");
      expect(
        document.querySelector('[data-testid="resolved"]')?.textContent,
      ).toBe(JSON.stringify({ value: "email", label: "Email" }));
    });

    it("does not exclude an Option wrapper that exposes a change callback", async () => {
      // The controlled-input exclusion must not swallow option wrappers: this
      // one carries value + onValueChange like a controlled input would, but
      // its label prop marks it as option-shaped, so getOptions keeps it and
      // the trigger can resolve the selected value's label.
      const MyOption = ({
        value,
        label,
        onValueChange,
      }: {
        value: string;
        label: string;
        onValueChange: (v: string) => void;
      }) => (
        <Combobox.Option
          value={value}
          label={label}
          onSelect={() => onValueChange(value)}
        />
      );

      const Cmp = () => (
        <Combobox.Root value="email">
          <Combobox.Trigger>
            {({ value: resolved }) => (
              <span data-testid="resolved">{JSON.stringify(resolved)}</span>
            )}
          </Combobox.Trigger>
          <Combobox.Content>
            <Combobox.Options>
              <MyOption value="email" label="Email" onValueChange={() => {}} />
            </Combobox.Options>
          </Combobox.Content>
        </Combobox.Root>
      );
      render(<Cmp />);

      expect(
        document.querySelector('[data-testid="resolved"]')?.textContent,
      ).toBe(JSON.stringify({ value: "email", label: "Email" }));
    });
  });
});
