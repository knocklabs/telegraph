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
});
