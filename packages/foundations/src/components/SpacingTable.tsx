import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { spacing } = telegraphTokens.tokens;

const TOKEN_ORDER = [
  "0", "px", "0_5", "1", "1_5", "2", "2_5", "3", "3_5", "4",
  "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
  "20", "24", "28", "32", "36", "40", "44", "48", "52", "56",
  "60", "64", "72", "80", "96", "120", "140", "160", "full", "auto",
] as const;

type SpacingKey = typeof TOKEN_ORDER[number];

function formatTokenKey(key: SpacingKey): string {
  return key.replace(/_/g, ".");
}

function formatCssVarName(key: SpacingKey): string {
  return `--tgph-spacing-${key}`;
}

export function SpacingTable() {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--tgph-family-sans)",
        backgroundColor: "var(--tgph-surface-1)",
        color: "var(--tgph-gray-12)",
      }}
    >
      <thead>
        <tr>
          {["Token", "Visual", "Value"].map((header) => (
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
        {TOKEN_ORDER.map((key, index) => {
          const rawValue = (spacing as Record<string | number, string>)[key];
          const isEven = index % 2 === 0;

          return (
            <tr
              key={key}
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
                  whiteSpace: "nowrap",
                }}
              >
                {formatCssVarName(key)}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                }}
              >
                {key === "full" ? (
                  <span
                    style={{
                      fontSize: "var(--tgph-text-1)",
                      color: "var(--tgph-gray-9)",
                      fontFamily: "var(--tgph-family-mono)",
                    }}
                  >
                    100%
                  </span>
                ) : key === "auto" ? (
                  <span
                    style={{
                      fontSize: "var(--tgph-text-1)",
                      color: "var(--tgph-gray-9)",
                      fontFamily: "var(--tgph-family-mono)",
                    }}
                  >
                    auto
                  </span>
                ) : (
                  <div
                    style={{
                      width: `var(--tgph-spacing-${key})`,
                      maxWidth: "320px",
                      height: "8px",
                      backgroundColor: "var(--tgph-accent-9)",
                      borderRadius: "var(--tgph-rounded-1)",
                      minWidth: key === "0" ? "2px" : undefined,
                    }}
                  />
                )}
              </td>
              <td
                style={{
                  padding: "var(--tgph-spacing-2) var(--tgph-spacing-3)",
                  fontFamily: "var(--tgph-family-mono)",
                  fontSize: "var(--tgph-text-1)",
                  color: "var(--tgph-gray-11)",
                  whiteSpace: "nowrap",
                }}
              >
                {rawValue ?? "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
