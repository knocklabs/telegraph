# AGENTS.md

Guidance for AI agents working in this repository.

Before writing code, read the SKILL.md (and its referenced files) for any
applicable skill below:

| Task                                  | Skill                          |
| ------------------------------------- | ------------------------------ |
| Writing a browser-mode component test | `write-browser-component-test` |

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
