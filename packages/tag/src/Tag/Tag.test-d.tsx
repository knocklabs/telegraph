import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

import { Tag } from ".";
import type {
  TagButtonProps,
  TagCopyButtonProps,
  TagIconProps,
  TagProps,
  TagRootProps,
  TagTextProps,
} from ".";

describe("Tag types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TagProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TagRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TagTextProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TagButtonProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TagCopyButtonProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TagIconProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TagProps["size"]>().not.toBeAny();
    expectTypeOf<TagProps["color"]>().not.toBeAny();
    expectTypeOf<TagProps["variant"]>().not.toBeAny();
    expectTypeOf<TagProps["icon"]>().not.toBeAny();
    expectTypeOf<TagProps["textProps"]>().not.toBeAny();
    expectTypeOf<TagProps["onRemove"]>().not.toBeAny();
    expectTypeOf<TagRootProps["size"]>().not.toBeAny();
    expectTypeOf<TagRootProps["color"]>().not.toBeAny();
    expectTypeOf<TagRootProps["variant"]>().not.toBeAny();
    expectTypeOf<TagCopyButtonProps["textToCopy"]>().not.toBeAny();
    expectTypeOf<TagButtonProps["variant"]>().not.toBeAny();
    expectTypeOf<TagIconProps["icon"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Tag
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Tag
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tag.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Tag.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tag.Text
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tag.Button
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tag.CopyButton
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tag.Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Tag
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Tag
      // @ts-expect-error not a tag variant
      variant="notAVariant"
    />;
    <Tag
      // @ts-expect-error not a tag size
      size="99"
    />;
    <Tag
      // @ts-expect-error not a tag color
      color="notAColor"
    />;
    <Tag.Root
      // @ts-expect-error not a tag variant
      variant="notAVariant"
    />;
    <Tag.Root
      // @ts-expect-error not a tag size
      size="99"
    />;
    <Tag.CopyButton
      // @ts-expect-error textToCopy must be a string
      textToCopy={123}
    />;
    <Tag.Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not an icon size
      size="99"
    />;
  });

  it("accepts valid props", () => {
    <Tag size="1" color="accent" variant="soft" p="2" mt="4" />;
    <Tag as="div" className="c" style={{ opacity: 0.5 }} />;
    <Tag icon={{ icon: Bell, alt: "bell" }} textProps={{ maxW: "40" }} />;
    <Tag onRemove={() => {}} aria-label="tag" data-testid="tag" />;
    <Tag onCopy={() => {}} textToCopy="copy me">
      Label
    </Tag>;
    <Tag.Root size="2" color="red" variant="solid" pl="2">
      <Tag.Icon icon={Bell} alt="bell" />
      <Tag.Text maxW="40">Label</Tag.Text>
      <Tag.Button onClick={() => {}} />
    </Tag.Root>;
    <Tag.Root as="div" className="c" style={{ opacity: 0.5 }} />;
    <Tag.Text as="p" data-testid="text" />;
    <Tag.Button as="a" href="/docs" />;
    <Tag.CopyButton textToCopy="copy me" />;
    <Tag.CopyButton textToCopy="copy me" onClick={() => {}} className="c" />;
    <Tag.Icon icon={Bell} aria-hidden mr="1" />;
  });
});
