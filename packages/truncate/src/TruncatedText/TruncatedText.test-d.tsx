import { TruncatedText } from ".";
import type {
  CustomSplitFn,
  Split,
  SplitOffset,
  TruncatePriority,
  TruncateVariant,
  TruncatedTextMode,
  TruncatedTextProps,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("TruncatedText types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TruncatedTextProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TruncatedTextProps<"div">>().not.toHaveProperty(
      "notARealProp",
    );
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TruncatedTextProps["mode"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["variant"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["marker"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["split"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["priority"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["tooltipProps"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["size"]>().not.toBeAny();
    expectTypeOf<TruncatedTextProps["color"]>().not.toBeAny();

    // The exported option types are the exact ones the props resolve to.
    expectTypeOf<TruncatedTextProps["mode"]>().toEqualTypeOf<
      TruncatedTextMode | undefined
    >();
    expectTypeOf<TruncatedTextProps["variant"]>().toEqualTypeOf<
      TruncateVariant | undefined
    >();
    expectTypeOf<TruncatedTextProps["priority"]>().toEqualTypeOf<
      TruncatePriority | undefined
    >();
    expectTypeOf<TruncatedTextProps["split"]>().toEqualTypeOf<
      Split | undefined
    >();
    expectTypeOf<SplitOffset>().not.toBeAny();
    expectTypeOf<CustomSplitFn>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <TruncatedText
      as="span"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error unknown prop
      letterSpacing="wide"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error unknown prop
      truncate={true}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <TruncatedText
      as="span"
      // @ts-expect-error not a truncation mode
      mode="sideways"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error not a truncate variant
      variant="dissolve"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error not a truncate priority
      priority="middle"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error not a split strategy
      split="notASplitStrategy"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error not a text size token
      size="99"
    />;
    <TruncatedText
      as="span"
      // @ts-expect-error tooltipProps only takes TooltipIfTruncated props
      tooltipProps={{ notARealProp: "x" }}
    />;
  });

  it("accepts valid props", () => {
    <TruncatedText as="span">A long piece of text</TruncatedText>;
    <TruncatedText as="div" mode="fruncate" variant="fade" size="1" p="2">
      /a/very/long/path
    </TruncatedText>;
    <TruncatedText
      as="span"
      mode="middle"
      split="leaf-path"
      priority="start"
      marker="…"
      color="gray"
      mt="4"
    >
      /a/very/long/path
    </TruncatedText>;
    <TruncatedText as="span" split={["last", 12] satisfies SplitOffset} />;
    <TruncatedText
      as="span"
      split={((contents: string) => [contents, ""]) satisfies CustomSplitFn}
    />;
    <TruncatedText as="span" split={8} />;
    <TruncatedText
      as="span"
      tooltipProps={{ delayDuration: 0, label: "Full text" }}
      className="c"
      style={{ maxWidth: 240 }}
      aria-label="truncated"
      data-testid="truncated"
    />;
  });
});
