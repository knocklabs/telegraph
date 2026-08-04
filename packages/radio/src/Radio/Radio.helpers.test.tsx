import { describe, expect, it } from "vitest";

import { countLabels } from "./Radio.helpers";

const Label = () => null;
const NotALabel = () => null;
// Stands in for any component that returns a label from inside itself.
const Opaque = () => <Label />;

const count = (node: Parameters<typeof countLabels>[0]) =>
  countLabels(node, Label);

describe("countLabels", () => {
  it("returns 0 when there is nothing to find", () => {
    expect(count(null)).toBe(0);
    expect(count(undefined)).toBe(0);
    expect(count(false)).toBe(0);
    expect(count("Free plan")).toBe(0);
    expect(count(<NotALabel />)).toBe(0);
  });

  it("counts a direct child", () => {
    expect(count(<Label />)).toBe(1);
  });

  it("counts through nested wrappers", () => {
    expect(
      count(
        <div>
          <span>
            <Label />
          </span>
        </div>,
      ),
    ).toBe(1);
  });

  it("counts every label in the tree", () => {
    expect(
      count(
        <>
          <Label />
          <div>
            <Label />
          </div>
        </>,
      ),
    ).toBe(2);
  });

  // The known limitation: a label a custom component renders is invisible here,
  // because that component has not been called yet. `Radio.Control` then leaves
  // `aria-labelledby` unset and Base UI names the control from the rendered
  // `<label for>` instead.
  it("cannot see a label returned by a custom component", () => {
    expect(count(<Opaque />)).toBe(0);
  });

  it("ignores a different component that takes children", () => {
    expect(
      count(
        <NotALabel>
          <NotALabel />
        </NotALabel>,
      ),
    ).toBe(0);
  });
});
