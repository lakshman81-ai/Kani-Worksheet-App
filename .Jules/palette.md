## 2024-05-22 - Interactive Div Patterns
**Learning:** React components using `div` elements for interaction often miss standard keyboard behaviors. specifically support for `Space` key and `onKeyDown` instead of the deprecated `onKeyPress`.
**Action:** When converting clickable `div`s to accessible controls, always implement `onKeyDown` handling both `Enter` and `Space`, and ensure `:focus-visible` styles are present.
