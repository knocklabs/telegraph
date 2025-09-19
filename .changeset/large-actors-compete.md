---
"@telegraph/button": patch
---

fix: Make button "type" prop fully compatible with HTML button type prop

In 0.2.0, we mistakenly overrode the typing for the type prop (which also broke full compatibility with html button) and modified the behavior of it. It was unnecessary to override the typing for the prop.
