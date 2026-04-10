import React from "react";

type ShadowStep = "0" | "inner" | "1" | "2" | "3";

const STEPS: ShadowStep[] = ["0", "inner", "1", "2", "3"];

const DESCRIPTIONS: Record<ShadowStep, string> = {
  "0": "No shadow",
  inner: "Inset depth",
  "1": "Subtle elevation",
  "2": "Card elevation",
  "3": "High elevation",
};

function getShadowCssVar(step: ShadowStep): string {
  return `var(--tgph-shadow-${step})`;
}

function getShadowTokenName(step: ShadowStep): string {
  return `shadow-${step}`;
}

export function ShadowGrid() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--tgph-spacing-2)",
        alignItems: "flex-start",
        fontFamily: "var(--tgph-family-sans)",
        backgroundColor: "var(--tgph-surface-1)",
        color: "var(--tgph-gray-12)",
        padding: "var(--tgph-spacing-4)",
        borderRadius: "var(--tgph-rounded-4)",
      }}
    >
      {STEPS.map((step) => (
        <div
          key={step}
          style={{
            padding: "var(--tgph-spacing-8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--tgph-spacing-3)",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              backgroundColor: "var(--tgph-surface-1)",
              borderRadius: "var(--tgph-rounded-4)",
              boxShadow: getShadowCssVar(step),
            }}
          />
          <div
            style={{
              fontFamily: "var(--tgph-family-mono)",
              fontSize: "var(--tgph-text-1)",
              color: "var(--tgph-gray-12)",
              textAlign: "center",
            }}
          >
            {getShadowTokenName(step)}
          </div>
          <div
            style={{
              fontSize: "var(--tgph-text-0)",
              color: "var(--tgph-gray-10)",
              textAlign: "center",
            }}
          >
            {DESCRIPTIONS[step]}
          </div>
        </div>
      ))}
    </div>
  );
}
