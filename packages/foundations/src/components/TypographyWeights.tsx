import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { weight } = telegraphTokens.tokens;

type WeightKey = keyof typeof weight;

interface WeightRowProps {
  label: string;
  weightKey: WeightKey;
  isLast?: boolean;
}

function WeightRow({ label, weightKey, isLast = false }: WeightRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: isLast ? undefined : "1px solid var(--tgph-gray-4)",
        padding: "var(--tgph-spacing-4) 0",
        gap: "var(--tgph-spacing-4)",
      }}
    >
      <div
        style={{
          width: "120px",
          flexShrink: 0,
          fontFamily: "var(--tgph-family-mono)",
          fontSize: "var(--tgph-text-1)",
          color: "var(--tgph-gray-10)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "var(--tgph-text-3)",
          lineHeight: "var(--tgph-leading-3)",
          fontFamily: "var(--tgph-family-sans)",
          color: "var(--tgph-gray-12)",
          fontWeight: `var(--tgph-weight-${weightKey})`,
        }}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
}

export function TypographyWeights() {
  return (
    <div style={{ fontFamily: "var(--tgph-family-sans)", backgroundColor: "var(--tgph-surface-1)", color: "var(--tgph-gray-12)", padding: "var(--tgph-spacing-4) var(--tgph-spacing-6)", borderRadius: "var(--tgph-rounded-4)" }}>
      <WeightRow label={`Regular / ${weight.regular}`} weightKey="regular" />
      <WeightRow label={`Medium / ${weight.medium}`} weightKey="medium" />
      <WeightRow label={`Semi-bold / ${weight["semi-bold"]}`} weightKey="semi-bold" isLast />
    </div>
  );
}
