# @telegraph/truncate

## 0.2.0

### Minor Changes

- [#888](https://github.com/knocklabs/telegraph/pull/888) [`028dd83`](https://github.com/knocklabs/telegraph/commit/028dd8337dadb4df0971ef20af6b275338385a9e) Thanks [@kylemcd](https://github.com/kylemcd)! - Add front, middle, and fade truncation to `TruncatedText`, plus supporting fixes:
  - **`TruncatedText`** gains `mode="truncate" | "fruncate" | "middle"`, a `fade` `variant`, a custom `marker`, and (for `middle`) `split` / `priority`. `TruncatedText` remains the single public truncation component — the extra modes are folded in. End (`truncate`) and front (`fruncate`, via `direction: rtl`) use native `text-overflow: ellipsis` — glyph-boundary clip, no stylesheet. `mode="middle"` measures the rendered text and slices it to exactly the `head…tail` characters that fit — a crisp "…", **no gap**, and **never a cut glyph**, at every width (pure CSS can't do all three at once). Its measurement is scoped to `middle`, runs only on real resizes via a guarded `ResizeObserver` (so it can't reproduce the [#185](https://github.com/knocklabs/telegraph/issues/185) loop), needs no stylesheet, and honors `maxWidth`. For `middle`, `split="center"` (the default) balances both ends — a prefix and a suffix with the "…" in the visual middle — while the anchored splits (`leaf-path`/`extension`) keep one end whole, chosen by `priority`. `variant="fade"` instead dissolves the edge via a CSS-only engine (a container size-query, ported from Pierre).
  - **`TooltipIfTruncated`** now measures truncation lazily on hover/focus (controlled `open`) instead of in a render effect, and accepts an `isTruncated` predicate. This removes the "Maximum update depth exceeded" (React [#185](https://github.com/knocklabs/telegraph/issues/185)) loop.
  - **`useTruncate`** is hardened with a value-guarded state update so redundant measurements are genuine no-ops even in re-render-heavy trees.

  `TruncatedText`'s `fade` variant (and a custom `marker` on end/front truncation) requires importing `@telegraph/truncate/default.css` and modern browsers (CSS container queries, the `1lh` unit, and `color-mix`). The `truncate` / `fruncate` / `middle` modes, `TooltipIfTruncated`, and `useTruncate` have no such requirement.

## 0.1.6

### Patch Changes

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Migrate Tooltip internals from Radix UI to Base UI while preserving Telegraph trigger state attributes, dismissal callbacks, collision props, hidden-when-detached behavior, and `tgphRef` support. The portaled tooltip surface keeps a dark Telegraph appearance attribute without reintroducing the removed public `appearance` prop. Keep dependency subpath imports external in shared Vite library builds so Base UI-backed packages publish browser-safe ESM output.

- [#837](https://github.com/knocklabs/telegraph/pull/837) [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde) Thanks [@kylemcd](https://github.com/kylemcd)! - Verify published Tooltip consumers against the Base UI-backed implementation and preserve their trigger refs, optional tooltip labels, and Radix-compatible trigger state attributes. TooltipIfTruncated now documents and tests that an explicit `label` takes precedence over child text when both are provided.

- Updated dependencies [[`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde), [`b78f9b6`](https://github.com/knocklabs/telegraph/commit/b78f9b6b4e209597a56094ac565978b49b777dde)]:
  - @telegraph/helpers@0.1.0
  - @telegraph/tooltip@0.5.0
  - @telegraph/typography@0.4.2

## 0.1.5

### Patch Changes

- Updated dependencies [[`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e)]:
  - @telegraph/helpers@0.0.16
  - @telegraph/tooltip@0.4.1
  - @telegraph/typography@0.4.1

## 0.1.4

### Patch Changes

- Updated dependencies [[`03cfc99`](https://github.com/knocklabs/telegraph/commit/03cfc99c839a753e81d0d1fec2f7b167c0160038)]:
  - @telegraph/tooltip@0.4.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`c335807`](https://github.com/knocklabs/telegraph/commit/c33580795d3e75d921449a5684ff7aaff1c2c482)]:
  - @telegraph/tooltip@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`3c100cf`](https://github.com/knocklabs/telegraph/commit/3c100cf78d2b322f674e2f170860f938ea3b69a3)]:
  - @telegraph/typography@0.4.0
  - @telegraph/tooltip@0.2.1

## 0.1.1

### Patch Changes

- Updated dependencies [[`1de6cf1`](https://github.com/knocklabs/telegraph/commit/1de6cf1874835db4389f5e7f14fbcc694229a5de), [`d3b6fee`](https://github.com/knocklabs/telegraph/commit/d3b6fee0e7cd308151efdc5921164d324ccaf045)]:
  - @telegraph/typography@0.3.0
  - @telegraph/tooltip@0.2.0

## 0.1.0

### Minor Changes

- [#688](https://github.com/knocklabs/telegraph/pull/688) [`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf) Thanks [@kylemcd](https://github.com/kylemcd)! - fix: invalid props on components would not throw type errors

### Patch Changes

- Updated dependencies [[`8d55540`](https://github.com/knocklabs/telegraph/commit/8d5554005bea4695560efbee9ea4333ccddfc1bf)]:
  - @telegraph/typography@0.2.0
  - @telegraph/tooltip@0.1.0

## 0.0.18

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

- Updated dependencies [[`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029)]:
  - @telegraph/typography@0.1.29
  - @telegraph/helpers@0.0.15
  - @telegraph/tooltip@0.0.62

## 0.0.17

### Patch Changes

- Updated dependencies [[`c7ffe1d`](https://github.com/knocklabs/telegraph/commit/c7ffe1d85a0320dec6a05b1fd386ba0092c48e37)]:
  - @telegraph/helpers@0.0.14
  - @telegraph/tooltip@0.0.61
  - @telegraph/typography@0.1.28

## 0.0.16

### Patch Changes

- [#640](https://github.com/knocklabs/telegraph/pull/640) [`712f9fd`](https://github.com/knocklabs/telegraph/commit/712f9fd3604f5e89a8eed61548a2d63b5a3522c7) Thanks [@kylemcd](https://github.com/kylemcd)! - feat: add horizontal scrolling to overflowed segmented control

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @telegraph/typography@0.1.27
  - @telegraph/tooltip@0.0.60

## 0.0.14

### Patch Changes

- Updated dependencies []:
  - @telegraph/typography@0.1.26
  - @telegraph/tooltip@0.0.59

## 0.0.13

### Patch Changes

- Updated dependencies []:
  - @telegraph/tooltip@0.0.58
  - @telegraph/typography@0.1.25

## 0.0.12

### Patch Changes

- Updated dependencies []:
  - @telegraph/typography@0.1.24
  - @telegraph/tooltip@0.0.57

## 0.0.11

### Patch Changes

- Updated dependencies [[`fccb828`](https://github.com/knocklabs/telegraph/commit/fccb828f5863e9020d9e33ae981799bdf8e66d47)]:
  - @telegraph/tooltip@0.0.56

## 0.0.10

### Patch Changes

- Updated dependencies [[`c0244e3`](https://github.com/knocklabs/telegraph/commit/c0244e3f4b6232f633ba4d99bb0eb603909c87fa)]:
  - @telegraph/tooltip@0.0.55

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @telegraph/typography@0.1.23
  - @telegraph/tooltip@0.0.54

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @telegraph/tooltip@0.0.53
  - @telegraph/typography@0.1.22

## 0.0.7

### Patch Changes

- Updated dependencies [[`6e5d6c3`](https://github.com/knocklabs/telegraph/commit/6e5d6c313f630f2095c7ef3622520daf8e3ab1e2), [`dc12662`](https://github.com/knocklabs/telegraph/commit/dc12662f6f41697d976d0978871a567d564777e8)]:
  - @telegraph/tooltip@0.0.52
  - @telegraph/typography@0.1.21

## 0.0.6

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

- Updated dependencies [[`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67), [`f5d6a69`](https://github.com/knocklabs/telegraph/commit/f5d6a693e078dbfa1c99a78dc7b8ec6a9c34218a)]:
  - @telegraph/typography@0.1.20
  - @telegraph/helpers@0.0.13
  - @telegraph/tooltip@0.0.51

## 0.0.5

### Patch Changes

- Updated dependencies [[`89da3cc`](https://github.com/knocklabs/telegraph/commit/89da3ccc374e5c610f5472bda950c95345b86a90)]:
  - @telegraph/tooltip@0.0.50
  - @telegraph/typography@0.1.19
  - @telegraph/helpers@0.0.12

## 0.0.4

### Patch Changes

- Updated dependencies [[`bad64d8`](https://github.com/knocklabs/telegraph/commit/bad64d8996ba2304dc84ca81d0393bff5844fc96)]:
  - @telegraph/tooltip@0.0.49
  - @telegraph/typography@0.1.18

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @telegraph/typography@0.1.17
  - @telegraph/tooltip@0.0.48

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @telegraph/tooltip@0.0.47

## 0.0.1

### Patch Changes

- [#446](https://github.com/knocklabs/telegraph/pull/446) [`5c0784e`](https://github.com/knocklabs/telegraph/commit/5c0784e3fc5198ae4a83ef5c09b7b8c57c8d264d) Thanks [@kylemcd](https://github.com/kylemcd)! - add truncate component and integrate into combobox

- Updated dependencies [[`5c0784e`](https://github.com/knocklabs/telegraph/commit/5c0784e3fc5198ae4a83ef5c09b7b8c57c8d264d)]:
  - @telegraph/tooltip@0.0.46
