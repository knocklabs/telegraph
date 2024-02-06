const family = {
  sans: "Inter, sans-serif",
  mono: "Menlo, serif",
};

export const font = {
  family,
  body: {
    family: family.sans,
    size: {
      0: "0.6875rem",
      1: "0.75rem",
      2: "0.875rem",
      3: "1rem",
      4: "1.125rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.875rem",
      8: "2.25rem",
      9: "3rem",
    },
    leading: {
      0: "1rem",
      1: "1rem",
      2: "1.25rem",
      3: "1.5rem",
      4: "1.125rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.875rem",
      8: "2.25rem",
      9: "3rem",
    },
    tracking: {
      0: "0.25%",
      1: "0.25%",
      2: "0",
      3: "0",
      4: "-0.25%",
      5: "-0.5%",
      6: "-0.625%",
      7: "-0.75%",
      8: "-1%",
      9: "-2.5%",
    },
  },
  code: {
    family: family.mono,
  },
};
