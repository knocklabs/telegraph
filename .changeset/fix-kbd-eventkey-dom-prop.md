---
"@telegraph/kbd": patch
---

fix(kbd): prevent eventKey prop from being passed to DOM

Fixes React warning by destructuring eventKey from props to prevent it from being spread to the Stack component via {...props}. Updates usePressed hook to use the destructured eventKey variable instead of props.eventKey.
