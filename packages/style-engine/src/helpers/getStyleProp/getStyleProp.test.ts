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

  describe("applyAxisValues", () => {
    it("handles overflow on x-axis only", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowX: "hidden",
        },
        cssVars: {
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "hidden visible",
      });
    });

    it("handles overflow on y-axis only", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowY: "scroll",
        },
        cssVars: {
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "visible scroll",
      });
    });

    it("handles overflow on both axes", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflow: "auto",
        },
        cssVars: {
          overflow: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "both",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "auto auto",
      });
    });

    it("combines overflowX and overflowY correctly", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowX: "hidden",
          overflowY: "scroll",
        },
        cssVars: {
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "hidden scroll",
      });
    });

    it("preserves y-axis value when setting x-axis", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowY: "auto",
          overflowX: "hidden",
        },
        cssVars: {
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "hidden auto",
      });
    });

    it("preserves x-axis value when setting y-axis", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowX: "scroll",
          overflowY: "hidden",
        },
        cssVars: {
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "scroll hidden",
      });
    });

    it("overflow both axes overrides previous individual x-axis value", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowX: "hidden",
          overflow: "scroll",
        },
        cssVars: {
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
          overflow: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "both",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "scroll scroll",
      });
    });

    it("overflow both axes overrides previous individual y-axis value", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflowY: "hidden",
          overflow: "auto",
        },
        cssVars: {
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
          overflow: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "both",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "auto auto",
      });
    });

    it("individual x-axis can override previous overflow both value", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflow: "scroll",
          overflowX: "hidden",
        },
        cssVars: {
          overflow: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "both",
          },
          overflowX: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "x",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "hidden scroll",
      });
    });

    it("individual y-axis can override previous overflow both value", () => {
      const { styleProp } = getStyleProp({
        props: {
          overflow: "scroll",
          overflowY: "hidden",
        },
        cssVars: {
          overflow: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "both",
          },
          overflowY: {
            cssVar: "--overflow",
            value: "VARIABLE",
            axis: "y",
          },
        },
      });

      expect(styleProp).toStrictEqual({
        "--overflow": "scroll hidden",
      });
    });

    it("handles all overflow values correctly", () => {
      const overflowValues = ["hidden", "visible", "scroll", "auto"] as const;

      overflowValues.forEach((value) => {
        const { styleProp } = getStyleProp({
          props: {
            overflow: value,
          },
          cssVars: {
            overflow: {
              cssVar: "--overflow",
              value: "VARIABLE",
              axis: "both",
            },
          },
        });

        expect(styleProp).toStrictEqual({
          "--overflow": `${value} ${value}`,
        });
      });
    });
  });

  describe("pseudo-class object props", () => {
    const cssVars = {
      backgroundColor: {
        cssVar: "--background-color",
        value: "var(--tgph-VARIABLE)",
      },
      borderColor: {
        cssVar: "--border-color",
        value: "var(--tgph-VARIABLE)",
      },
      padding: {
        cssVar: "--padding",
        value: "var(--tgph-spacing-VARIABLE)",
        direction: "all" as const,
      },
    };

    it("generates hover pseudo CSS variables from object prop", () => {
      const { styleProp, interactive } = getStyleProp({
        props: {
          backgroundColor: "gray-2",
          _hover: { backgroundColor: "gray-3" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--background-color": "var(--tgph-gray-2)",
        "--hover--background-color": "var(--tgph-gray-3)",
      });
      expect(interactive).toBe(true);
    });

    it("generates focus pseudo CSS variables from object prop", () => {
      const { styleProp, interactive } = getStyleProp({
        props: {
          backgroundColor: "gray-2",
          _focus: { backgroundColor: "gray-4" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--background-color": "var(--tgph-gray-2)",
        "--focus--background-color": "var(--tgph-gray-4)",
      });
      expect(interactive).toBe(true);
    });

    it("generates active pseudo CSS variables from object prop", () => {
      const { styleProp } = getStyleProp({
        props: {
          _active: { backgroundColor: "gray-5" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--active--background-color": "var(--tgph-gray-5)",
      });
    });

    it("generates focusWithin pseudo CSS variables", () => {
      const { styleProp } = getStyleProp({
        props: {
          _focusWithin: { borderColor: "blue-8" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--focus-within--border-color": "var(--tgph-blue-8)",
      });
    });

    it("generates disabled pseudo CSS variables", () => {
      const { styleProp } = getStyleProp({
        props: {
          _disabled: { backgroundColor: "gray-2" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--disabled--background-color": "var(--tgph-gray-2)",
      });
    });

    it("handles multiple pseudo states simultaneously", () => {
      const { styleProp } = getStyleProp({
        props: {
          backgroundColor: "gray-2",
          _hover: { backgroundColor: "gray-3" },
          _focus: { backgroundColor: "gray-4" },
          _active: { backgroundColor: "gray-5" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--background-color": "var(--tgph-gray-2)",
        "--hover--background-color": "var(--tgph-gray-3)",
        "--focus--background-color": "var(--tgph-gray-4)",
        "--active--background-color": "var(--tgph-gray-5)",
      });
    });

    it("handles multiple properties within a single pseudo state", () => {
      const { styleProp } = getStyleProp({
        props: {
          _hover: {
            backgroundColor: "gray-3",
            borderColor: "blue-5",
          },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--hover--background-color": "var(--tgph-gray-3)",
        "--hover--border-color": "var(--tgph-blue-5)",
      });
    });

    it("passes through unmatched pseudo props in otherProps", () => {
      const { styleProp, otherProps } = getStyleProp({
        props: {
          _hover: {
            backgroundColor: "gray-3",
            unknownProp: "value",
          },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--hover--background-color": "var(--tgph-gray-3)",
      });
      expect(otherProps).toStrictEqual({
        _hover: { unknownProp: "value" },
      });
    });

    it("sets interactive=true only when pseudo props match cssVars", () => {
      // All pseudo props are unrecognized
      const { interactive } = getStyleProp({
        props: {
          _hover: { unknownProp: "value" },
        },
        cssVars,
      });

      expect(interactive).toBe(false);
    });

    it("handles directional properties in pseudo state", () => {
      const { styleProp } = getStyleProp({
        props: {
          _hover: { padding: "4" },
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--hover--padding":
          "var(--tgph-spacing-4) var(--tgph-spacing-4) var(--tgph-spacing-4) var(--tgph-spacing-4)",
      });
    });

    it("does not interfere with base prop processing", () => {
      const { styleProp, otherProps } = getStyleProp({
        props: {
          backgroundColor: "gray-2",
          _hover: { backgroundColor: "gray-3" },
          unknownProp: "passthrough",
        },
        cssVars,
      });

      expect(styleProp).toStrictEqual({
        "--background-color": "var(--tgph-gray-2)",
        "--hover--background-color": "var(--tgph-gray-3)",
      });
      expect(otherProps).toStrictEqual({
        unknownProp: "passthrough",
      });
    });
  });
});
