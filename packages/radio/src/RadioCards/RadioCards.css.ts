import { globalStyle, style, tokens } from "@telegraph/style-engine";

export const baseStyles = style({
  selectors: {
    // Blue border on the radio card when active
    "&[data-tgph-button-state=active]": {
      boxShadow: `var(--tgph-button-shadow) ${tokens.color["blue-8"]}`,
    },
  },
});

// Set the color of the radio card description and icon when hovered to gray-12
globalStyle(
  `${baseStyles}:hover [data-tgph-radio-card-description], ${baseStyles}:hover [data-tgph-radio-card-icon]`,
  {
    color: tokens.color["gray-12"],
    transition: "color 0.2s ease-in-out",
  },
);
