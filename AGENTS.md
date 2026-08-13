# AGENTS.md

Guidance for AI agents working in this repository.

Before writing code, read the SKILL.md (and its referenced files) for any
applicable skill below:

| Task                                          | Skill                                 |
| --------------------------------------------- | ------------------------------------- |
| Reviewing a diff, a PR, or your own work      | `.agents/skills/code-review/SKILL.md` |
| Changing a props type, or destructuring props | `.agents/skills/code-review/SKILL.md` |
| Writing a browser-mode component test         | `write-browser-component-test`        |

Skills under `.agents/skills` live in this repo and are always available. Skills
named without a path are published to Knock's
[skillset](https://github.com/knocklabs/skillset); install a missing one with
`skillset install <name>`.

## Prop types are the public API

Every prop type in `packages/*/src` is type-checked against by consuming apps. A
prop type that is wrong does not fail here — it fails in the consumer, one
release later. The whole family of defects that produces compiles cleanly, so
reading the diff is not enough.

Before changing a props type, adding an `as` prop, or destructuring props, read
`.agents/skills/code-review/SKILL.md` and run:

```bash
node .agents/skills/code-review/scripts/check-prop-plumbing.cjs
```

## Browser-mode component tests (Vitest)

Tests run in two ways: **jsdom** (the default, `yarn test`) and **real browser**
(Vitest Browser Mode + Playwright, files named `*.browser.test.tsx`, run with
`yarn test:browser` via `vitest.browser.config.mts`). Browser tests exist only
for behavior jsdom fakes — real focus and `Tab` order, trusted keyboard,
layout/geometry, `ResizeObserver`, and animation timing. They run headed
(locally and in CI, under `xvfb`) on a separate CI job (`browser-test-packages`),
so the bar for adding one is high.

Any browser test you write or review must go through the
`write-browser-component-test` skill first; it owns the decision (including when
NOT to write one) and the authoring patterns. The skill is published to Knock's
[skillset](https://github.com/knocklabs/skillset); if it is not already installed
in your environment, install it with `skillset install write-browser-component-test`.
