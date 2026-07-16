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
          <Text as="span">jane@example.com</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("jane@example.com");
    expect(queryOptions().length).toBe(1);
  });

  it("matches a query spanning sibling text nodes", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Stack direction="column">
            <Text as="span">Jane</Text>
            <Text as="span">Doe</Text>
          </Stack>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Jane Doe");
    expect(queryOptions().length).toBe(1);
  });

  it("matches when inline markup already carries a trailing space", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          Jane <Text as="span">Doe</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Jane Doe");
    expect(queryOptions().length).toBe(1);
  });

  it("ignores repeated whitespace inside the query", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Text as="span">Jane Doe</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("Jane  Doe");
    expect(queryOptions().length).toBe(1);
  });

  it("ignores surrounding whitespace in the query", async () => {
    const { container } = render(
      <Harness>
        <Combobox.Option value="u_1">
          <Text as="span">jane@example.com</Text>
        </Combobox.Option>
      </Harness>,
    );
    const user = await open(container);
    await user.keyboard("  jane@example.com  ");
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
    // The email only exists in UserRow's render output, so matching relies
    // on the captured rendered text
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
            <UserRow name="Jane Doe" email="jane@example.com" />
          </Combobox.Option>
          <Combobox.Option value="u_2">
            <UserRow name="John Smith" email="john@example.com" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      await user.keyboard("jane@example.com");
      expect(queryOptions().length).toBe(1);
    });

    it("re-matches after being filtered out and back", async () => {
      // The capture must survive being filtered out
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <UserRow name="Jane Doe" email="jane@example.com" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);

      await user.keyboard("sam");
      expect(queryOptions().length).toBe(0);

      await user.keyboard("{Backspace}{Backspace}{Backspace}jane");
      expect(queryOptions().length).toBe(1);
    });

    it("matches a query spanning the wrapper's sibling text nodes", async () => {
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1">
            <UserRow name="Jane Doe" email="jane@example.com" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      // The name and email are separate DOM nodes inside the wrapper
      await user.keyboard("Doe jane@example.com");
      expect(queryOptions().length).toBe(1);
    });

    it("does not match across the captured variants' seam", async () => {
      // "cd ab" spans the seam between the captured variants ("abcd" and
      // "ab cd") and never appears on screen, so it must not match
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
                  <UserRow name="Jane Doe" email={email} />
                </Combobox.Option>
              </Combobox.Options>
            </Combobox.Content>
          </Combobox.Root>
        );
      };

      const { container, rerender } = render(<Cmp email="jane@acme.com" />);
      const user = await open(container);

      await user.keyboard("acme.com");
      expect(queryOptions().length).toBe(1);

      // Content stopped matching, so the option must hide without another
      // keystroke
      rerender(<Cmp email="jane@example.com" />);
      expect(queryOptions().length).toBe(0);
    });

    it("shows the empty state when a content change hides the last match", async () => {
      const Cmp = ({ email }: { email: string }) => {
        const [value, setValue] = useState<string>("");
        return (
          <Combobox.Root value={value} onValueChange={setValue}>
            <Combobox.Trigger />
            <Combobox.Content>
              <Combobox.Search />
              <Combobox.Options>
                <Combobox.Option value="u_1">
                  <UserRow name="Jane Doe" email={email} />
                </Combobox.Option>
              </Combobox.Options>
              <Combobox.Empty />
            </Combobox.Content>
          </Combobox.Root>
        );
      };

      const { container, rerender } = render(<Cmp email="jane@acme.com" />);
      const user = await open(container);

      await user.keyboard("acme.com");
      expect(queryOptions().length).toBe(1);
      expect(document.querySelector("[data-tgph-combobox-empty]")).toBeNull();

      // The last match hid from a content update, not a keystroke; the
      // empty message must still appear
      rerender(<Cmp email="jane@example.com" />);
      await waitFor(() =>
        expect(
          document.querySelector("[data-tgph-combobox-empty]"),
        ).not.toBeNull(),
      );
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

      // Typing the selected value must not shadow the real option
      await user.keyboard("email");
      expect(
        document.querySelector('[data-testid="resolved"]')?.textContent,
      ).toBe(JSON.stringify({ value: "email", label: "Email" }));
    });

    it("also excludes a search input wrapped in a consumer component", async () => {
      // A wrapped search isn't Search by type; its value + change handler
      // signature is what excludes it
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
      // value + onValueChange looks like a controlled input, but the label
      // prop marks it option-shaped, so getOptions keeps it
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
