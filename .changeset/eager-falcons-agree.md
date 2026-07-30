---
"@telegraph/button": minor
"@telegraph/tabs": patch
"@telegraph/menu": patch
"@telegraph/segmented-control": patch
---

`Tabs.Tab` no longer reports a Base UI error when a disabled tab renders as another element:

```tsx
<Tabs.Tab value="docs" as="a" href="/docs" disabled>
  Docs
</Tabs.Tab>
```

`Button` always renders a real `<button>` when you disable it. It needs the native disabled state to block clicks, so it ignores `as`. `Tab` missed that and told Base UI the tag was not a button. Base UI logged the mismatch on every render.

`@telegraph/button` now exports `rendersNativeButton(as, disabled)`. `Button.Root` uses it to pick its own tag. `Menu.Button`, `Menu.SubTrigger`, `SegmentedControl.Option`, and `Tabs.Tab` read it too. The five cannot diverge again.
