import { describe, expect, it } from "vitest";

import { getStyleProp } from "./getStyleProp";

describe("getStyleProp", () => {
  it("returns the css variable correctly", () => {
    const { styleProp } = getStyleProp({
      props: {
        color: "red-11",
      },
      cssVars: {
        color: {
          cssVar: "--color",
          value: "var(--tgph-VARIABLE)",
        },
      },
    });

    expect(styleProp).toStrictEqual({
      "--color": "var(--tgph-red-11)",
    });
  });
  it("removes the defined prop from otherProps", () => {
    const { otherProps } = getStyleProp({
      props: {
        test: "test",
      },
      cssVars: {
        color: {
          cssVar: "--color",
          value: "var(--tgph-VARIABLE)",
        },
      },
    });

    expect(otherProps).toStrictEqual({
      test: "test",
    });
  });
  it("lone variable returns without cssVar syntax", () => {
    const { styleProp } = getStyleProp({
      props: {
        display: "block",
      },
      cssVars: {
        display: {
          cssVar: "--display",
          value: "VARIABLE",
        },
      },
    });

    expect(styleProp).toStrictEqual({
      "--display": "block",
    });
  });
  it("when no values are passed empty objects are returned", () => {
    const { styleProp, otherProps } = getStyleProp({
      props: {},
      cssVars: {},
    });
    expect(styleProp).toStrictEqual({});
    expect(otherProps).toStrictEqual({});
  });
  it("style prop passes through styleProp correctly", () => {
    const { styleProp, otherProps } = getStyleProp({
      props: {
        style: {
          display: "block",
        },
      },
      cssVars: {},
    });
    expect(styleProp).toStrictEqual({
      display: "block",
    });
    expect(otherProps).toStrictEqual({});
  });
});
