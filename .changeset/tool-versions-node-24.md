---
---

chore: pin local Node to 24.19.0 to match the version CI runs

`.tool-versions` asked for Node 22 while `engines` asked for 24, and CI reads
`engines` through `node-version-file: "package.json"`. Local development ran a
different major than every workflow. Both now say 24.

The 22 pin also moved to 22.23.2 in #950 to satisfy jsdom 30
(`^22.22.2 || ^24.15.0 || >=26.0.0`), so anyone without that exact version
installed could not run `yarn` at all. 24.19.0 satisfies jsdom through its
`^24.15.0` range instead.

Tooling-only — no published package output changes, so no version bumps.
