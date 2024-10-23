import { style, variant } from "@telegraph/style-engine";

export const baseStyles = style({
  appearance: "none",
  color: "var(--tgph-gray-12)",
  fontFamily: "var(--tgph-font-sans)",
  transition: "border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  ":hover": {
    borderColor: "var(--tgph-gray-7)",
  },
  ":focus": {
    borderColor: "var(--tgph-blue-8)",
    outline: "none",
  },
  "::placeholder": {
    color: "var(--tgph-gray-10)",
  },
});

export const variants = variant({
  variants: {
    size: {
      "1": {
        fontSize: "var(--tgph-text-1)",
        lineHeight: "var(--tgph-leading-1)",
        letterSpacing: "var(--tgph-tracking-1)",
      },
      "2": {
        fontSize: "var(--tgph-text-2)",
        lineHeight: "var(--tgph-leading-2)",
        letterSpacing: "var(--tgph-tracking-2)",
      },
      "3": {
        fontSize: "var(--tgph-text-3)",
        lineHeight: "var(--tgph-leading-3)",
        letterSpacing: "var(--tgph-tracking-3)",
      },
    },
    state: {
      default: {},
      disabled: {
        cursor: "not-allowed",
        ":hover": {
          borderColor: "var(--tgph-gray-2)",
        },
        ":focus": {
          borderColor: "var(--tgph-gray-2)",
        },
      },
      error: {
        ":hover": {
          borderColor: "var(--tgph-red-6)",
        },
        ":focus": {
          borderColor: "var(--tgph-red-8)",
        },
      },
    },
    resize: {
      both: {
        resize: "both",
      },
      vertical: {
        resize: "vertical",
      },
      horizontal: {
        resize: "horizontal",
      },
      none: {
        resize: "none",
      },
    },
    variant: {
      outline: {},
      ghost: {
        resize: "none",
      },
    },
  },
});
