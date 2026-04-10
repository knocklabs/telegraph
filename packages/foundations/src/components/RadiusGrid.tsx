import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { rounded } = telegraphTokens.tokens;

type RadiusStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | "full";
const STEPS: RadiusStep[] = [0, 1, 2, 3, 4, 5, 6, "full"];

function getRoundedCssVar(step: RadiusStep): string {
  return `var(--tgph-rounded-${step})`;
}

function getRoundedValue(step: RadiusStep): string {
  if (step === "full") return rounded.full;
  return rounded[step];
}

export function RadiusGrid() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--tgph-spacing-6)",
        flexWrap: "wrap",
        alignItems: "flex-start",
        fontFamily: "var(--tgph-family-sans)",
      }}
    >
      {STEPS.map((step) => (
        <div
          key={step}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--tgph-spacing-1)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              border: "2px solid var(--tgph-gray-6)",
              backgroundColor: "var(--tgph-gray-3)",
              borderRadius: getRoundedCssVar(step),
            }}
          />
          <div
            style={{
              fontSize: "var(--tgph-text-0)",
              fontFamily: "var(--tgph-family-mono)",
              color: "var(--tgph-gray-11)",
              marginTop: "var(--tgph-spacing-2)",
              textAlign: "center",
            }}
          >
            {`rounded-${step}`}
          </div>
          <div
            style={{
              fontSize: "var(--tgph-text-0)",
              fontFamily: "var(--tgph-family-mono)",
              color: "var(--tgph-gray-9)",
              textAlign: "center",
            }}
          >
            {getRoundedValue(step)}
          </div>
        </div>
      ))}
    </div>
  );
}
