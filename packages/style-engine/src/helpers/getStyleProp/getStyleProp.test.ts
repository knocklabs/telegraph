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

  it("handles negative spacing values correctly", () => {
    const { styleProp } = getStyleProp({
      props: {
        marginLeft: "-2",
      },
      cssVars: {
        marginLeft: {
          cssVar: "--margin",
          value: "var(--tgph-spacing-VARIABLE)",
          direction: "left",
        },
      },
    });

    expect(styleProp).toStrictEqual({
      "--margin": "0 0 0 calc(-1 * var(--tgph-spacing-2))",
    });
  });

  it("handles negative spacing with multiple directional values", () => {
    const { styleProp } = getStyleProp({
      props: {
        marginTop: "-4",
        marginLeft: "2",
      },
      cssVars: {
        marginTop: {
          cssVar: "--margin",
          value: "var(--tgph-spacing-VARIABLE)",
          direction: "top",
        },
        marginLeft: {
          cssVar: "--margin",
          value: "var(--tgph-spacing-VARIABLE)",
          direction: "left",
        },
      },
    });

    expect(styleProp).toStrictEqual({
      "--margin": "calc(-1 * var(--tgph-spacing-4)) 0 0 var(--tgph-spacing-2)",
    });
  });

  it("handles negative spacing for positioning properties", () => {
    const { styleProp } = getStyleProp({
      props: {
        top: "-8",
      },
      cssVars: {
        top: {
          cssVar: "--top",
          value: "var(--tgph-spacing-VARIABLE)",
        },
      },
    });

    expect(styleProp).toStrictEqual({
      "--top": "calc(-1 * var(--tgph-spacing-8))",
    });
  });
});
