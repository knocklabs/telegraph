import React from "react";
import telegraphTokens from "@telegraph/tokens";

const { color } = telegraphTokens.tokens;

type PaletteName = "gray" | "beige" | "accent" | "green" | "yellow" | "blue" | "red" | "purple";

const PALETTES: PaletteName[] = ["gray", "beige", "accent", "green", "yellow", "blue", "red", "purple"];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "var(--tgph-text-2)",
  fontWeight: "var(--tgph-weight-semi-bold)",
  color: "var(--tgph-gray-12)",
  marginBottom: "var(--tgph-spacing-4)",
  marginTop: "var(--tgph-spacing-6)",
};

const swatchLabelStyle: React.CSSProperties = {
  fontSize: "var(--tgph-text-0)",
  fontFamily: "var(--tgph-family-mono)",
  color: "var(--tgph-gray-11)",
  marginTop: "var(--tgph-spacing-1)",
};

const swatchValueStyle: React.CSSProperties = {
  fontSize: "var(--tgph-text-0)",
  fontFamily: "var(--tgph-family-mono)",
  color: "var(--tgph-gray-9)",
};

function PaletteRow({ name }: { name: PaletteName }) {
  const palette = color[name];

  return (
    <div style={{ marginBottom: "var(--tgph-spacing-6)" }}>
      <div
        style={{
          fontSize: "var(--tgph-text-1)",
          fontWeight: "var(--tgph-weight-semi-bold)",
          color: "var(--tgph-gray-11)",
          marginBottom: "var(--tgph-spacing-2)",
          textTransform: "capitalize",
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--tgph-spacing-2)",
        }}
      >
        {STEPS.map((step) => {
          const token = palette[step] as { light: string; dark: string };
          return (
            <div key={step}>
              <div
                style={{
                  height: "56px",
                  borderRadius: "var(--tgph-rounded-2)",
                  backgroundColor: `var(--tgph-${name}-${step})`,
                }}
              />
              <div style={swatchLabelStyle}>{`--tgph-${name}-${step}`}</div>
              <div style={swatchValueStyle}>{token.light}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SurfaceSection() {
  const surfaceSteps = [1, 2, 3] as const;

  return (
    <div style={{ marginBottom: "var(--tgph-spacing-6)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--tgph-spacing-2)",
          maxWidth: "calc(3 * 120px + 2 * var(--tgph-spacing-2, 0.5rem))",
        }}
      >
        {surfaceSteps.map((step) => {
          const token = color.surface[step] as { light: string; dark: string };
          return (
            <div key={step}>
              <div
                style={{
                  height: "56px",
                  borderRadius: "var(--tgph-rounded-2)",
                  backgroundColor: `var(--tgph-surface-${step})`,
                  border: "1px solid var(--tgph-gray-4)",
                }}
              />
              <div style={swatchLabelStyle}>{`--tgph-surface-${step}`}</div>
              <div style={swatchValueStyle}>{token.light}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlphaRow({ variant }: { variant: "white" | "black" }) {
  const palette = color.alpha[variant];

  return (
    <div style={{ marginBottom: "var(--tgph-spacing-4)" }}>
      <div
        style={{
          fontSize: "var(--tgph-text-1)",
          fontWeight: "var(--tgph-weight-semi-bold)",
          color: "var(--tgph-gray-11)",
          marginBottom: "var(--tgph-spacing-2)",
          textTransform: "capitalize",
        }}
      >
        Alpha {variant}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "var(--tgph-spacing-2)",
        }}
      >
        {STEPS.map((step) => {
          const rawValue = palette[step] as string;
          return (
            <div key={step}>
              <div
                style={{
                  height: "56px",
                  borderRadius: "var(--tgph-rounded-2)",
                  backgroundImage:
                    "repeating-conic-gradient(var(--tgph-gray-4) 0% 25%, var(--tgph-gray-1) 0% 50%)",
                  backgroundSize: "16px 16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: `var(--tgph-alpha-${variant}-${step})`,
                  }}
                />
              </div>
              <div style={swatchLabelStyle}>{`--tgph-alpha-${variant}-${step}`}</div>
              <div style={swatchValueStyle}>{rawValue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BaseColorsSection() {
  const baseColors: Array<{ name: string; value: string; cssVar?: string }> = [
    { name: "transparent", value: color.transparent },
    { name: "white", value: color.white },
    { name: "black", value: color.black },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--tgph-spacing-4)",
        flexWrap: "wrap",
      }}
    >
      {baseColors.map(({ name, value }) => (
        <div key={name} style={{ width: "120px" }}>
          <div
            style={{
              height: "56px",
              borderRadius: "var(--tgph-rounded-2)",
              backgroundColor: `var(--tgph-${name})`,
              border: "1px solid var(--tgph-gray-4)",
            }}
          />
          <div style={swatchLabelStyle}>{`--tgph-${name}`}</div>
          <div style={swatchValueStyle}>{value}</div>
        </div>
      ))}
    </div>
  );
}

export function ColorsGrid() {
  return (
    <div style={{ fontFamily: "var(--tgph-family-sans)", backgroundColor: "var(--tgph-surface-1)", color: "var(--tgph-gray-12)", padding: "var(--tgph-spacing-6)", borderRadius: "var(--tgph-rounded-4)" }}>
      <h2 style={{ ...sectionHeadingStyle, marginTop: 0 }}>Palettes</h2>
      {PALETTES.map((name) => (
        <PaletteRow key={name} name={name} />
      ))}

      <h2 style={sectionHeadingStyle}>Surface</h2>
      <SurfaceSection />

      <h2 style={sectionHeadingStyle}>Alpha</h2>
      <AlphaRow variant="white" />
      <AlphaRow variant="black" />

      <h2 style={sectionHeadingStyle}>Base</h2>
      <BaseColorsSection />
    </div>
  );
}
