import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { family } = telegraphTokens.tokens;

interface FamilyCardProps {
  label: string;
  fontFamilyVar: string;
  fontStack: string;
}

function FamilyCard({ label, fontFamilyVar, fontStack }: FamilyCardProps) {
  return (
    <div
      style={{
        padding: "var(--tgph-spacing-6)",
        border: "1px solid var(--tgph-gray-5)",
        borderRadius: "var(--tgph-rounded-4)",
        backgroundColor: "var(--tgph-gray-2)",
        flex: "1",
        minWidth: "280px",
        fontFamily: fontFamilyVar,
      }}
    >
      <div
        style={{
          fontSize: "var(--tgph-text-9)",
          lineHeight: "1",
          color: "var(--tgph-gray-12)",
        }}
      >
        Aa
      </div>
      <div
        style={{
          fontSize: "var(--tgph-text-2)",
          fontWeight: "var(--tgph-weight-semi-bold)",
          color: "var(--tgph-gray-12)",
          marginTop: "var(--tgph-spacing-4)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "var(--tgph-text-0)",
          color: "var(--tgph-gray-9)",
          fontFamily: "var(--tgph-family-mono)",
          wordBreak: "break-all",
          marginTop: "var(--tgph-spacing-1)",
        }}
      >
        {fontStack}
      </div>
    </div>
  );
}

export function TypographyFamilies() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--tgph-spacing-4)",
        flexWrap: "wrap",
        backgroundColor: "var(--tgph-surface-1)",
        color: "var(--tgph-gray-12)",
        padding: "var(--tgph-spacing-6)",
        borderRadius: "var(--tgph-rounded-4)",
      }}
    >
      <FamilyCard
        label="Sans"
        fontFamilyVar="var(--tgph-family-sans)"
        fontStack={family.sans}
      />
      <FamilyCard
        label="Mono"
        fontFamilyVar="var(--tgph-family-mono)"
        fontStack={family.mono}
      />
    </div>
  );
}
