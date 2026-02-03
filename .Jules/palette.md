# Palette's Journal

This journal documents critical UX and accessibility learnings from the Palette agent.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2025-02-18 - [Interaction] Keyboard Support for Interactive Divs
**Learning:** Interactive `div` elements often use `onClick` but lack robust keyboard support. `onKeyPress` is deprecated and fails to handle Space key scrolling prevention. `onKeyDown` with explicit Enter/Space handling is needed. Also, form labels often miss programmatic association with inputs.
**Action:** Replace `onKeyPress` with `onKeyDown` for interactive non-button elements, ensuring `preventDefault()` is called for Space key. Always link labels to inputs using `htmlFor` and `id`.
