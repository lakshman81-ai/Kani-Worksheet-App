## 2026-02-04 - [Interactive Div Pattern]
**Learning:** The codebase frequently uses `div`s for interactive elements (buttons, radios) with `onClick` but missing proper keyboard support (specifically `Space` key) and relying on deprecated `onKeyPress`.
**Action:** Systematically upgrade these to use `onKeyDown`, handle both `Enter` and `Space` (preventing default scroll for Space), and ensure proper ARIA roles are maintained.
