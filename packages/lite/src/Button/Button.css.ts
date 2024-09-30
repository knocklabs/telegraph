import { variant } from "@telegraph/style-engine";

export const button = variant({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `var(--knock-spacing-2) var(--knock-spacing-4)`,
    borderRadius: `var(--knock-rounded-3)`,
    border: `1px solid transparent`,
    fontSize: `var(--knock-font-medium-3-size)`,
    fontWeight: `var(--knock-font-medium-3-weight)`,
    lineHeight: `var(--knock-font-medium-3-line-height)`,
    letterSpacing: `var(--knock-font-medium-3-letter-spacing)`,
  },
  variants: {
    variant: {
      solid: {
        color: `var(--knock-colors-content-contrast)`,
        backgroundColor: `var(--knock-colors-accent)`,
        ":hover": {
          backgroundColor: `var(--knock-colors-accent-dark)`,
        },
      },
      outline: {
        color: `var(--knock-colors-content)`,
        backgroundColor: `var(--knock-colors-surface)`,
        border: `1px solid var(--knock-colors-border)`,
        ":hover": {
          border: `1px solid var(--knock-colors-border-dark)`,
          backgroundColor: `var(--knock-colors-secondary-light)`,
        },
      },
      ghost: {
        color: `var(--knock-colors-content)`,
        backgroundColor: `transparent`,
        ":hover": {
          backgroundColor: `var(--knock-colors-secondary-light)`,
        },
        ":disabled": {
          color: `var(--knock-colors-content-disabled)`,
          backgroundColor: `transparent`,
        },
      },
    },
  },
});
