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

  describe("searchValue", () => {
    it("matches text rendered by a child component", async () => {
      // The email is produced inside UserRow's render output, so it can't be
      // read off the element tree — searchValue is how it stays findable.
      const UserRow = ({ email }: { email: string }) => (
        <Text as="span">{email}</Text>
      );

      const { container } = render(
        <Harness>
          <Combobox.Option
            value="u_1"
            searchValue="Kyle McDonald kyle@knock.app"
          >
            <UserRow email="kyle@knock.app" />
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      await user.keyboard("knock.app");
      expect(queryOptions().length).toBe(1);
    });

    it("replaces the derived text rather than adding to it", async () => {
      const { container } = render(
        <Harness>
          <Combobox.Option value="usr_internal_id" searchValue="Alpha">
            <Text as="span">Alpha</Text>
          </Combobox.Option>
        </Harness>,
      );
      const user = await open(container);
      // The option value would otherwise match; searchValue excludes it.
      await user.keyboard("internal");
      expect(queryOptions().length).toBe(0);
    });

    it("is not forwarded to the DOM", async () => {
      const { container } = render(
        <Harness>
          <Combobox.Option value="u_1" searchValue="findme">
            <Text as="span">Alpha</Text>
          </Combobox.Option>
        </Harness>,
      );
      await open(container);
      expect(
        document.querySelector("[data-tgph-combobox-option]"),
      ).not.toHaveAttribute("searchValue");
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
  });
});
