---
"@telegraph/tabs": patch
---

feat(tabs): rename renderInBackground prop to forceBackgroundMount

Renamed the `renderInBackground` prop to `forceBackgroundMount` in TabPanel component for better naming consistency. This is a breaking change for users currently using the `renderInBackground` prop.

- Updated TabPanel component prop interface
- Updated all story examples to use new prop name
- Updated documentation in README.md
