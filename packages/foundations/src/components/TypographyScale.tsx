import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { text, leading, tracking } = telegraphTokens.tokens;

const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type TextStep = typeof STEPS[number];

export function TypographyScale() {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--tgph-family-sans)",
      }}
    >
      <thead>
        <tr>
          {["Step", "Size", "Line height", "Tracking", "Preview"].map((header) => (
            <th
              key={header}
              style={{
                fontSize: "var(--tgph-text-1)",
                fontWeight: "var(--tgph-weight-semi-bold)",
                color: "var(--tgph-gray-11)",
                borderBottom: "1px solid var(--tgph-gray-5)",
                textAlign: "left",
                padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STEPS.map((step, index) => {
          const isEven = index % 2 === 0;

          return (
            <tr
              key={step}
              style={{
                backgroundColor: isEven ? "var(--tgph-gray-2)" : "transparent",
              }}
            >
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  fontFamily: "var(--tgph-family-mono)",
                  fontSize: "var(--tgph-text-1)",
                  color: "var(--tgph-gray-12)",
                }}
              >
                {step}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  fontFamily: "var(--tgph-family-mono)",
                  fontSize: "var(--tgph-text-1)",
                  color: "var(--tgph-gray-12)",
                }}
              >
                {text[step]}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  fontFamily: "var(--tgph-family-mono)",
                  fontSize: "var(--tgph-text-1)",
                  color: "var(--tgph-gray-12)",
                }}
              >
                {leading[step]}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  fontFamily: "var(--tgph-family-mono)",
                  fontSize: "var(--tgph-text-1)",
                  color: "var(--tgph-gray-12)",
                }}
              >
                {tracking[step]}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  minWidth: "200px",
                }}
              >
                <span
                  style={{
                    fontSize: `var(--tgph-text-${step})`,
                    lineHeight: `var(--tgph-leading-${step})`,
                    letterSpacing: `var(--tgph-tracking-${step})`,
                    fontFamily: "var(--tgph-family-sans)",
                    color: "var(--tgph-gray-12)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  Telegraph
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
